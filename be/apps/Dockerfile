# =======================
# Base build image
# =======================
FROM gradle:8-jdk21-alpine AS base-builder
WORKDIR /workspace

# Copy gradle core (cache layer)
COPY settings.gradle build.gradle gradlew gradle/ ./

# =======================
# AUTH SERVICE
# =======================
FROM base-builder AS build-auth
COPY auth ./auth
RUN gradle :auth:bootJar -x test --no-daemon

# RUNTIME
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build-auth /workspace/auth/build/libs/*.jar app.jar
EXPOSE 9001
ENTRYPOINT ["java","-jar","app.jar"]

# =======================
# CHAT SERVICE
# =======================
#FROM base-builder AS build-chat
#COPY chat ./chat
#RUN gradle :chat:bootJar -x test --no-daemon

# RUNTIME
#FROM eclipse-temurin:21-jre-alpine
#WORKDIR /app
#COPY --from=build-chat /workspace/chat/build/libs/*.jar app.jar
#EXPOSE 9002
#ENTRYPOINT ["java","-jar","app.jar"]

# =======================
# CUSTOMER SERVICE
# =======================
#FROM base-builder AS build-customer
#COPY customer ./customer
#RUN gradle :customer:bootJar -x test --no-daemon

# RUNTIME
#FROM eclipse-temurin:21-jre-alpine
#WORKDIR /app
#COPY --from=build-auth /workspace/auth/build/libs/*.jar app.jar
#EXPOSE 9003
#ENTRYPOINT ["java","-jar","app.jar"]

# =======================
# NOTIFICATION SERVICE
# =======================
#FROM base-builder AS build-notification
#COPY notification ./notification
#RUN gradle :notification:bootJar -x test --no-daemon

# RUNTIME
#FROM eclipse-temurin:21-jre-alpine
#WORKDIR /app
#COPY --from=build-notification /workspace/notification/build/libs/*.jar app.jar
#EXPOSE 9004
#ENTRYPOINT ["java","-jar","app.jar"]
