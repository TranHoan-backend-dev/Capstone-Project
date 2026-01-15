package com.capstone.device.dgraph.query;

import com.capstone.device.dgraph.annotation.DgraphNode;
import com.capstone.device.dgraph.annotation.DgraphPredicate;
import com.capstone.device.dgraph.annotation.Relationship;
import org.jetbrains.annotations.Contract;
import org.jetbrains.annotations.NotNull;

import java.lang.reflect.Field;
import java.lang.reflect.ParameterizedType;
import java.util.*;

public class QueryBuilder {
    private Class<?> type;
    private QueryParams[] queryParams;
    private String orderClause;
    private Integer offset;
    private Integer limit;
    private final StringBuilder filterClause;
    private String queryName;
    private int maxDepth;
    private String[] rootUids;
    private QueryBlock[] queryBlocks;
    private boolean fetchUidOnly;

    private QueryBuilder() {
        this.filterClause = new StringBuilder();
        this.orderClause = "";
        this.maxDepth = 1;
    }

    @NotNull
    @Contract(value = " -> new", pure = true)
    public static QueryBuilder builder() {
        return new QueryBuilder();
    }

    public QueryBuilder queryName(String queryName) {
        this.queryName = queryName;
        return this;
    }

    public QueryBuilder queryParams(QueryParams... queryParams) {
        this.queryParams = queryParams;
        return this;
    }

    public QueryBuilder forType(Class<?> clazz) {
        this.type = clazz;
        return this;
    }

    public QueryBuilder withUids(String... uids) {
        if (uids == null || uids.length == 0) {
            throw new IllegalArgumentException("Uids cannot be null or empty for withUids method.");
        }
        for (String uid : uids) {
            if (uid == null || uid.isBlank()) {
                throw new IllegalArgumentException("Uid values cannot be null or blank.");
            }
        }
        this.rootUids = uids;
        // Ensure type is not set for uid queries, or handle combination logic
        // For now, assume uid takes precedence if both are set.
        return this;
    }

    private QueryBuilder addFilter(String condition) {
        if (!this.filterClause.isEmpty()) {
            this.filterClause.append(" AND ");
        }
        this.filterClause.append(condition);
        return this;
    }

    public QueryBuilder fetchUidOnly(boolean uidOnly) {
        this.fetchUidOnly = uidOnly;
        return this;
    }

    public QueryBuilder filterEquals(String predicate, String alias) {
        return addFilter(String.format("eq(%s, %s)", predicate, formatValueForFilter(alias)));
    }

    public QueryBuilder filterGreaterThan(String predicate, String alias) {
        return addFilter(String.format("gt(%s, %s)", predicate, formatValueForFilter(alias)));
    }

    public QueryBuilder filterLessThan(String predicate, String alias) {
        return addFilter(String.format("lt(%s, %s)", predicate, formatValueForFilter(alias)));
    }

    /**
     * <h4>Adds a regular expression (regex) filter condition to the query.</h4>
     * <p>
     * Example:
     * <pre>
     * &#064;filter(regexp(user.user_name, /keyword/))
     * </pre>
     *
     * @param predicate The name of the Dgraph predicate, e.g., user.user_name
     * @param regex     The regular expression used for matching
     * @return The current QueryBuilder instance for method chaining
     */
    public QueryBuilder filterRegexp(String predicate, String regex) {
        return addFilter(String.format("regexp(%s, /%s/)", predicate, regex));
    }

    public QueryBuilder filterHas(String field) {
        return addFilter(String.format("has(%s)", field));
    }

    public QueryBuilder limit(Integer limit) {
        this.limit = limit;
        return this;
    }

    public QueryBuilder offset(Integer offset) {
        this.offset = offset;
        return this;
    }

    public QueryBuilder orderBy(String predicate, boolean desc) {
        this.orderClause = String.format("%s: %s", desc ? "orderdesc" : "orderasc", predicate);
        return this;
    }

    public QueryBuilder maxDepth(int maxDepth) {
        if (maxDepth < 0) {
            throw new IllegalArgumentException("Max depth must be greater than 0");
        }
        this.maxDepth = maxDepth;
        return this;
    }

    public String build() {
        validateBuilderState();
        StringBuilder sb = new StringBuilder("query");
        if (queryName != null && !queryName.isBlank()) {
            sb.append(" ").append(queryName);
        }
        appendQueryParam(sb);

        sb.append(" {\n");
        appendRootQueryBlock(sb);
        sb.append("\n}");

        return sb.toString();
    }

    private void appendQueryParam(StringBuilder sb) {
        if (queryParams != null && queryParams.length > 0) {
            StringJoiner sj = new StringJoiner(", ");
            Arrays.stream(queryParams).forEach(param -> {
                sj.add(String.format("%s: %s", param.alias(), param.type().getValue()));
            });
            sb.append("(").append(sj).append(")");
        }
    }

    private void appendRootQueryBlock(@NotNull StringBuilder sb) {
        sb.append("q(");

        if (rootUids != null && rootUids.length > 0) {
            StringJoiner uidJoiner = new StringJoiner(", ");
            for (String uid : rootUids) {
                uidJoiner.add(formatValueForFilter(uid));
            }
            sb.append("func: uid(").append(uidJoiner).append(")");
        } else if (type != null) {
            sb.append("func: type(").append(type.getSimpleName()).append(")");
        } else {
            throw new IllegalStateException("Neither root type nor UIDs provided for the query.");
        }

        if (limit != null) {
            sb.append(", first: ").append(limit);
        }
        if (offset != null) {
            sb.append(", offset: ").append(offset);
        }
        sb.append(")");

        appendFilterAndOrder(sb);

        sb.append("{\n");
        if (fetchUidOnly) {
            sb.append(" uid ");
        } else {
            Set<Class<?>> visitedTypes = new HashSet<>();
            // Initialize the visited set for cycle detection in recursive eager fetch
            sb.append(buildPredicateString(type, 0, maxDepth, visitedTypes));
        }
        sb.append("\n}"); // Close the root query predicates block
    }

    private void validateBuilderState() {
        if (type == null && (rootUids == null || rootUids.length == 0)) {
            throw new IllegalStateException(
                    "Query must specify either a root type with 'forType()' or UIDs with 'withUids()'.");
        }
        if (type != null && isDgraphNode(type)) {
            throw new IllegalArgumentException(
                    "Root class for 'forType()' must be annotated with @DgraphNode: " + type.getName());
        }
        if (queryName == null || queryName.isBlank()) {
            this.queryName = "q"; // Default query name if not set
        }
    }

    // Recursive helper method to build nested predicates
    private String buildPredicateString(
            Class<?> currentType, int currentDepth, int maxDepth, Set<Class<?>> visitedTypes) {
        // Base case 1: Depth limit reached
        if (currentDepth > maxDepth) {
            return "uid"; // Just fetch UID if depth limit is reached
        }

        // Base case 2: Cycle detected
        // If currentType has already been visited in this path, it's a cycle.
        // Return "uid" to prevent infinite recursion and fetch the UID of the cyclic node.
        if (!visitedTypes.add(currentType)) { // add() returns false if element already exists
            return "uid";
        }

        var predicateJoiner = new StringJoiner(" ");
        predicateJoiner.add("uid");
        predicateJoiner.add("dgraph.type");

        for (var field : currentType.getDeclaredFields()) {
            field.setAccessible(true);
            if (!field.isAnnotationPresent(DgraphPredicate.class)) {
                continue;
            }
            var predicate = field.getAnnotation(DgraphPredicate.class).value();
            Class<?> relationshipTargetType = null;

            if (isRelationship(field)) {
                if (isCollection(field)) {
                    // Extract generic type for collections
                    var genericType = field.getGenericType();
                    if (genericType instanceof ParameterizedType pt) {
                        var actualTypeArguments = pt.getActualTypeArguments();
                        if (actualTypeArguments.length > 0 && actualTypeArguments[0] instanceof Class) {
                            relationshipTargetType = (Class<?>) actualTypeArguments[0];
                        }
                    }
                    // If generic type can't be determined or it's a raw collection type,
                    // treat it as a simple predicate without further eager fetching for now.
                    if (relationshipTargetType == null) {
                        System.err.println(
                                "Warning: Could not determine simple Class type for generic collection field: "
                                        + field.getName() + " in " + currentType.getName()
                                        + ". Fetching as direct predicate.");
                        predicateJoiner.add(predicate);
                        continue; // Move to next field if generic type not found/handled
                    }
                } else {
                    relationshipTargetType = field.getType();
                }

                if (isDgraphNode(relationshipTargetType)) {
                    throw new IllegalArgumentException(
                            "Relationship target class " + relationshipTargetType.getName() + " for field "
                                    + field.getName() + " in " + currentType.getName()
                                    + " is not annotated with @DgraphNode. Please ensure all related Dgraph nodes are correctly marked.");
                }

                if (isEagerFetch(field)) {
                    // Recursive call for eager fetching
                    String subPredicates =
                            buildPredicateString(relationshipTargetType, currentDepth + 1, maxDepth, visitedTypes);
                    if (!subPredicates.isBlank()) {
                        predicateJoiner.add(String.format("%s { %s }", predicate, subPredicates));
                    } else {
                        // If sub-predicates are empty (e.g., due to depth limit or cycle), just add the predicate
                        // itself
                        predicateJoiner.add(predicate);
                    }
                } else {
                    predicateJoiner.add(predicate);
                }
            } else {
                predicateJoiner.add(predicate);
            }
        }

        // Backtrack: Remove currentType from visitedTypes when returning from this recursion level
        // This allows the same type to be visited again through a different path in the graph.
        visitedTypes.remove(currentType);
        return predicateJoiner.toString();
    }

    private void appendFilterAndOrder(StringBuilder sb) {
        if (!filterClause.isEmpty()) {
            sb.append(" @filter(").append(filterClause).append(")");
        }
        if (!orderClause.isBlank()) {
            // Dgraph syntax for order often follows filter, potentially with a comma if other directives are present.
            // For simplicity here, we append it after filter.
            if (!filterClause.isEmpty()) {
                sb.append(" "); // Space after filter if both present
            }
            sb.append(" ").append(orderClause); // Add a leading space
        }
    }

    private String formatValueForFilter(Object value) {
        if (value instanceof String && !((String) value).startsWith("$")) {
            return "\"" + value + "\"";
        }
        return value.toString();
    }

    private boolean isRelationship(@NotNull Field field) {
        return field.isAnnotationPresent(Relationship.class) && field.isAnnotationPresent(DgraphPredicate.class);
    }

    private boolean isEagerFetch(@NotNull Field field) {
        return field.getAnnotation(Relationship.class).eagerFetch();
    }

    @Contract(pure = true)
    private boolean isDgraphNode(@NotNull Class<?> clazz) {
        return !clazz.isAnnotationPresent(DgraphNode.class);
    }

    private boolean isCollection(@NotNull Field field) {
        var fieldType = field.getType();
        boolean isCollectionType = Collection.class.isAssignableFrom(fieldType);
        boolean isMapType = Map.class.isAssignableFrom(fieldType);
        boolean isArrayType = fieldType.isArray();

        return isCollectionType || isMapType || isArrayType;
    }
}
