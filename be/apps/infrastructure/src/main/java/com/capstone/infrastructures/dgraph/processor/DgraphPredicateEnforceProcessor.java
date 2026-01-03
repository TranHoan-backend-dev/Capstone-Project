package com.capstone.infrastructures.dgraph.processor;

import com.capstone.infrastructures.dgraph.annotation.DgraphPredicate;
import com.google.auto.service.AutoService;
import org.jetbrains.annotations.NotNull;

import javax.annotation.processing.*;
import javax.lang.model.SourceVersion;
import javax.lang.model.element.Element;
import javax.lang.model.element.ElementKind;
import javax.lang.model.element.TypeElement;
import javax.lang.model.element.VariableElement;
import javax.lang.model.type.TypeMirror;
import javax.tools.Diagnostic;
import java.util.Set;

@SupportedAnnotationTypes({"dev.huyhoangg.midia.annotation.DgraphPredicate"})
@SupportedSourceVersion(SourceVersion.RELEASE_21)
@AutoService(Processor.class)
public final class DgraphPredicateEnforceProcessor extends AbstractProcessor {
    private static final Set<String> ALLOWED_WRAPPER_TYPES = Set.of(
            "java.lang.Boolean",
            "java.lang.Integer",
            "java.lang.Long",
            "java.lang.Double",
            "java.lang.String",
            "java.lang.Float",
            "java.time.Instant");

    @Override
    public boolean process(Set<? extends TypeElement> annotations, @NotNull RoundEnvironment roundEnv) {
        for (var element : roundEnv.getElementsAnnotatedWith(DgraphPredicate.class)) {
            if (element.getKind() != ElementKind.FIELD) {
                continue;
            }

            var field = (VariableElement) element;
            var typeMirror = field.asType();
            var typeStr = typeMirror.toString();
            // Check for primitive or collection types
            if (typeMirror.getKind().isPrimitive() || isCollection(typeMirror)) {
                error(
                        field,
                        "Field '%s' cannot be primitive or a collection when using @DgraphPredicate",
                        field.getSimpleName());
            } else if (!ALLOWED_WRAPPER_TYPES.contains(typeStr)) {
                error(field, "Field '%s' must be one of: %s", field.getSimpleName(), ALLOWED_WRAPPER_TYPES);
            }
        }

        return true;
    }

    private boolean isCollection(@NotNull TypeMirror typeMirror) {
        var typeStr = typeMirror.toString();
        return typeStr.startsWith("java.util.List")
                || typeStr.startsWith("java.util.Set")
                || typeStr.startsWith("java.util.Map")
                || typeStr.startsWith("java.util.Collection");
    }

    private void error(Element e, String msg, Object... args) {
        processingEnv.getMessager().printMessage(Diagnostic.Kind.ERROR, String.format(msg, args), e);
    }
}
