# Dockerfile

# Use a lightweight JDK base image
FROM openjdk:17-jdk-alpine

# Create a directory in the container
VOLUME /tmp

# Add the built jar file to the image
ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} app.jar

# Run the JAR
ENTRYPOINT ["java", "-jar", "/app.jar"]
