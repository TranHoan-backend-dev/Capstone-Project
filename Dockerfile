# Base build image
FROM gradle:8-jdk21-alpine AS base-builder
WORKDIR /workspace

COPY settings.gradle build.gradle gradlew gradle/ ./

# AUTH SERVICE
FROM base-builder AS build-auth
COPY auth ./auth
RUN gradle :auth:bootJar -x test --no-daemon

FROM eclipse-temurin:21-jre-alpine AS runtime-auth
WORKDIR /app
COPY --from=build-auth /workspace/auth/build/libs/*.jar app.jar
EXPOSE 9003
ENTRYPOINT ["java","-jar","app.jar"]

# CONSTRUCTION SERVICE
FROM base-builder AS build-construction
COPY construction ./construction
RUN gradle :construction:bootJar -x test --no-deamon

FROM eclipse-temurin:21-jre-alpine AS runtime-construction
WORKDIR /app
COPY --from=build-construction /workspace/construction/build/libs/*.jar app4.jar
EXPOSE 9004
ENTRYPOINT ["java", "-jar", "app4.jar"]

# CUSTOMER SERVICE
FROM base-builder AS build-customer
COPY customer ./customer
RUN gradle :customer:bootJar -x test --no-daemon

FROM eclipse-temurin:21-jre-alpine AS runtime-customer
WORKDIR /app
COPY --from=build-customer /workspace/customer/build/libs/*.jar app2.jar
EXPOSE 9005
ENTRYPOINT ["java","-jar","app2.jar"]

# DEVICE SERVICE
FROM base-builder AS build-device
COPY device ./device
RUN gradle :device:bootJar -x test --no-deamon

FROM eclipse-temurin:21-jre-alpine AS runtime-device
WORKDIR /app
COPY --from=build-device /workspace/device/build/libs/*.jar app5.jar
EXPOSE 9006
ENTRYPOINT ["java", "-jar", "app5.jar"]

# EMAIL SERVICE
FROM node:22-alpine AS build-email
WORKDIR /workspace
COPY package*.json ./
COPY apps/email-service/package.json ./apps/email-service/package.json
RUN npm install
COPY apps/email-service ./apps/email-service
COPY nx.json tsconfig.base.json tsconfig.json eslint.config.mjs .prettierrc ./
RUN npx nx build email-service --prod

FROM node:22-alpine AS runner
WORKDIR /app
COPY --from=build-email /workspace/apps/email-service/dist ./
RUN npm install --omit=dev
EXPOSE 9005
ENTRYPOINT ["node", "main.js"]

# NOTIFICATION SERVICE
FROM base-builder AS build-notification
COPY notification ./notification
RUN gradle :notification:bootJar -x test --no-daemon

FROM eclipse-temurin:21-jre-alpine AS runtime-notification
WORKDIR /app
COPY --from=build-notification /workspace/notification/build/libs/*.jar app3.jar
EXPOSE 9007
ENTRYPOINT ["java","-jar","app3.jar"]

# ORGANIZATION SERVICE
FROM base-builder AS build-organization
COPY organization ./organization
RUN gradle :organization:bootJar -x test --no-daemon

FROM eclipse-temurin:21-jre-alpine AS runtime-organization
WORKDIR /app
COPY --from=build-organization /workspace/organization/build/libs/*.jar app5.jar
EXPOSE 9008
ENTRYPOINT ["java","-jar","app5.jar"]

# EUREKA SERVICE
FROM base-builder AS build-eureka
COPY eureka ./eureka
RUN gradle :eureka:bootJar -x test --no-daemon

FROM eclipse-temurin:21-jre-alpine AS runtime-eureka
WORKDIR /app
COPY --from=build-eureka /workspace/eureka/build/libs/*.jar app.jar
EXPOSE 9000
ENTRYPOINT ["java","-jar","app.jar"]

# API GATEWAY SERVICE
FROM base-builder AS build-api-gateway
COPY gateway ./api-gateway
RUN gradle :api-gateway:bootJar -x test --no-daemon

FROM eclipse-temurin:21-jre-alpine AS runtime-api-gateway
WORKDIR /app
COPY --from=build-api-gateway /workspace/api-gateway/build/libs/*.jar app.jar
EXPOSE 8000
ENTRYPOINT ["java","-jar","app.jar"]
