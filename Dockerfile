FROM openjdk:23-jdk-slim

WORKDIR /app

COPY target/*.jar app.jar

EXPOSE 8080

CMD ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=80.0", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]