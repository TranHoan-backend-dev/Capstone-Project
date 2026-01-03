package com.capstone.infrastructures.dgraph.query;

public record QueryParams(String alias, QueryParamType type) {
    public QueryParams {
        if (alias == null || alias.isBlank() || !alias.startsWith("$")) {
            throw new IllegalArgumentException("Invalid alias: " + alias + ". Alias must start with $");
        }
    }
}
