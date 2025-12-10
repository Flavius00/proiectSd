FROM maven:3.9 AS build

ENV TZ=UTC
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
ENV CATALINA_OPTS="-Duser.timezone=UTC"

COPY ./pom.xml /monitoringService/pom.xml
WORKDIR /monitoringService
RUN mvn dependency:go-offline
COPY ./src/ /monitoringService/src
WORKDIR /monitoringService
RUN mvn clean install -DskipTests

FROM eclipse-temurin:25-jdk
WORKDIR /monitoringService
COPY --from=build /monitoringService/target/monitoringService-0.0.1-SNAPSHOT.jar /monitoringService/monitoringService.jar
EXPOSE 8080
CMD ["java", "-jar", "monitoringService.jar"]
