# Base build image
FROM gradle:8-jdk21-alpine AS base-builder
WORKDIR /workspace

COPY settings.gradle build.gradle gradlew gradle/ ./

# AUTH SERVICE
FROM base-builder AS build-auth
COPY auth ./auth
RUN gradle :auth:bootJar -x test --no-daemon

# RUNTIME
FROM eclipse-temurin:21-jre-alpine AS runtime-auth
WORKDIR /app
COPY --from=build-auth /workspace/auth/build/libs/*.jar app.jar
EXPOSE 9001
ENTRYPOINT ["java","-jar","app.jar"]

# CHAT SERVICE
FROM base-builder AS build-chat
COPY chat ./chat
RUN gradle :chat:bootJar -x test --no-daemon

# RUNTIME
FROM eclipse-temurin:21-jre-alpine AS runtime-chat
WORKDIR /app
COPY --from=build-chat /workspace/chat/build/libs/*.jar app1.jar
EXPOSE 9002
ENTRYPOINT ["java","-jar","app1.jar"]

# CUSTOMER SERVICE
#FROM base-builder AS build-customer
#COPY customer ./customer
#RUN gradle :customer:bootJar -x test --no-daemon

# RUNTIME
#FROM eclipse-temurin:21-jre-alpine AS runtime-customer
#WORKDIR /app
#COPY --from=build-customer /workspace/customer/build/libs/*.jar app2.jar
#EXPOSE 9003
#ENTRYPOINT ["java","-jar","app2.jar"]

# NOTIFICATION SERVICE
FROM base-builder AS build-notification
COPY notification ./notification
RUN gradle :notification:bootJar -x test --no-daemon

# RUNTIME
FROM eclipse-temurin:21-jre-alpine AS runtime-notification
WORKDIR /app
COPY --from=build-notification /workspace/notification/build/libs/*.jar app3.jar
EXPOSE 9004
ENTRYPOINT ["java","-jar","app3.jar"]

# EMAIL SERVICE
FROM node:22-alpine AS build-email
WORKDIR /workspace
COPY package*.json ./
COPY apps/email-service/package.json ./apps/email-service/package.json
RUN npm install
COPY apps/email-service ./apps/email-service
COPY nx.json tsconfig.base.json tsconfig.json eslint.config.mjs .prettierrc ./
RUN npx nx build email-service --prod

# RUNTIME
FROM node:22-alpine AS runner
WORKDIR /app
COPY --from=build-email /workspace/apps/email-service/dist ./
RUN npm install --omit=dev
EXPOSE 9005
ENTRYPOINT ["node", "main.js"]
