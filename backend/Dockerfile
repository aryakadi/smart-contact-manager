# Build stage
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copy the pom.xml file
COPY pom.xml .

# Download dependencies (this step is cached if pom.xml doesn't change)
RUN mvn dependency:go-offline -B

# Copy the source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy the built jar file from the build stage
COPY --from=build /app/target/*.jar app.jar

# Render dynamic port assignment (defaults to 8080 if PORT is not set)
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
