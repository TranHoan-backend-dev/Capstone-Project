package com.capstone.common.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Annotation to automatically inject an SLF4J Logger into the logger field of
 * the annotated class.
 * This is a replacement for Lombok's @Slf4j for developers who cannot use
 * Lombok.
 * <p>
 * Usage:
 *
 * <pre>
 * &#64;AppLog
 * &#64;Component
 * public class MyService {
 *     private Logger log; // LoggerPostProcessor will inject this field
 *
 *     public void doSomething() {
 *         log.info("Doing something");
 *     }
 * }
 * </pre>
 *
 * Note: The logger is NOT available in the constructor as it is injected after
 * instantiation.
 */
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface AppLog {
}
