package com.capstone.device.dgraph.processor;

import com.capstone.device.dgraph.annotation.DgraphNode;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DgraphMappingProcessor {
    private final ObjectMapper objectMapper;

    public <T> String toDgraphNode(@NotNull T entity) throws JsonProcessingException {
        if (!entity.getClass().isAnnotationPresent(DgraphNode.class)) {
            throw new IllegalArgumentException("Class is not annotated with @DgraphNode");
        }

        return objectMapper.writeValueAsString(entity);
    }

    public <T> T fromDgraphNode(String json, @NotNull Class<T> clazz) throws JsonProcessingException {
        var type = clazz.getSimpleName();
        var jsonNode = objectMapper.readTree(json);
        var dgraphType = jsonNode.get("dgraph.type").isArray() ? jsonNode.get("dgraph.type").get(0).asText() : null;
        if (!type.equals(dgraphType)) {
            throw new IllegalArgumentException("Class is not register as a Dgraph Type. Expected: " + type + ", Actual: " + dgraphType);
        }
        if (!clazz.isAnnotationPresent(DgraphNode.class)) {
            throw new IllegalArgumentException("Class is not annotated with @DgraphNode");
        }
        return objectMapper.readValue(json, clazz);
    }

    public <T> Collection<T> fromDefaultQueryResponse(String json, Class<T> clazz) throws JsonProcessingException {
        var rootNode = objectMapper.readTree(json);
        if (!rootNode.isObject()) {
            throw new IllegalArgumentException("Excepted a JSON response from Dgraph, but received a non-object JSON.");
        }
        var dataNode = rootNode.get("q");
        if (dataNode == null) {
            return null;
        }
        if (!dataNode.isArray()) {
            throw new IllegalArgumentException("Expected a JSON array for Dgraph node mapping, but received a non-array JSON.");
        }
        var arrayNode = (ArrayNode) dataNode;
        if (arrayNode.isEmpty()) {
            return Collections.emptyList();
        }
        List<T> resultList = new ArrayList<>(arrayNode.size());
        for (var node : arrayNode) {
            if (node.isObject()) {
                resultList.add(fromDgraphNode(node.toString(), clazz));
            } else {
                throw new IllegalArgumentException("Array contains non-object elements that cannot be mapped as Dgraph nodes.");
            }
        }
        return resultList;
    }

//    private <T> T fromDgraphRelationship(JsonNode jsonNode, Class<T> clazz) {
//        if (!clazz.isAnnotationPresent(DgraphNode.class)) {
//           throw new IllegalArgumentException("Class is not annotated with @DgraphNode");
//        }
//        return null;
//    }
}
