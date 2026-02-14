package com.capstone.common.config;

import com.capstone.common.annotation.AppLog;
import org.springframework.lang.NonNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.BeanPostProcessor;
import org.springframework.util.ReflectionUtils;

import java.lang.reflect.Modifier;

/**
 * BeanPostProcessor to inject SLF4J Logger into fields of beans annotated
 * with @AppLog.
 */
public class LoggerPostProcessor implements BeanPostProcessor {

    @Override
    public Object postProcessBeforeInitialization(@NonNull Object bean, @NonNull String beanName)
            throws BeansException {
        Class<?> clazz = bean.getClass();
        if (clazz.isAnnotationPresent(AppLog.class)) {
            ReflectionUtils.doWithFields(clazz, field -> {
                if (Logger.class.isAssignableFrom(field.getType()) && !Modifier.isFinal(field.getModifiers())) {
                    ReflectionUtils.makeAccessible(field);
                    field.set(bean, LoggerFactory.getLogger(clazz));
                }
            });
        }
        return bean;
    }
}
