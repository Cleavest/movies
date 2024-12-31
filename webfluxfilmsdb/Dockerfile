FROM openjdk:17-jdk-slim-buster
WORKDIR /app
COPY /build/libs/webfluxfilmsdb-0.0.1-SNAPSHOT.jar /app/webflux.jar
EXPOSE 8084
ENTRYPOINT ["java", "-jar", "webflux.jar"]