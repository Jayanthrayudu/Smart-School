# Use official Maven image to build the jar
FROM maven:3.9.2-eclipse-temurin-17 AS build

WORKDIR /app

# Copy pom and download dependencies first (better caching)
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy the source code
COPY src ./src

# Build the Spring Boot application
RUN mvn clean package -DskipTests

# Use lightweight Java 17 runtime image
FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

# Copy the jar from build stage
COPY --from=build /app/target/smart-school-backend-0.0.1-SNAPSHOT.jar app.jar

# Expose port
EXPOSE 5000

# Use .env variables at runtime
ENV SPRING_PROFILES_ACTIVE=prod

# Start the app
ENTRYPOINT ["java","-jar","app.jar"]
