FROM maven:3.9 AS build

ENV TZ=UTC
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
ENV CATALINA_OPTS="-Duser.timezone=UTC"

COPY ./pom.xml /comunicationService/pom.xml
WORKDIR /comunicationService
RUN mvn dependency:go-offline
COPY ./src/ /comunicationService/src
WORKDIR /comunicationService
RUN mvn clean install -DskipTests

FROM eclipse-temurin:25-jdk
WORKDIR /comunicationService
COPY --from=build /comunicationService/target/comunicationService-0.0.1-SNAPSHOT.jar /comunicationService/comunicationService.jar
EXPOSE 8080
CMD ["java", "-jar", "comunicationService.jar"]
