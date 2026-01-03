package com.capstone.customer.dgraph.query;

import org.springframework.util.Assert;

public class QueryBlock {
    private Class<?> type;
    private String after;
    private int first;
    private Integer offset;
    private String blockName;

    public QueryBlock() {}

    public QueryBlock withType(Class<?> type) {
        Assert.notNull(type, "type must not be null");
        this.type = type;
        return this;
    }

    public QueryBlock withBlockName(String blockName) {
        this.blockName = blockName;
        return this;
    }

    public QueryBlock withFirst(int first) {
        this.first = first;
        return this;
    }

    public static QueryBlock root(Class<?> type) {
        return new QueryBlock().withBlockName("q").withType(type);
    }

    public static QueryBlock root() {
        return new QueryBlock().withBlockName("q");
    }

    public static QueryBlock var() {
        return new QueryBlock().withBlockName("var");
    }
}
