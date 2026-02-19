# backend/Dockerfile

# --- Stage 1: Build the JAR ---
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
# Build the JAR, skipping tests to save time
RUN mvn clean package -DskipTests

# --- Stage 2: Run the Application ---
FROM openjdk:17-slim
WORKDIR /app
# Copy the built JAR from Stage 1
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
