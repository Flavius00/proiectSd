FROM maven:3.9 AS build

ENV TZ=UTC
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
ENV CATALINA_OPTS="-Duser.timezone=UTC"

COPY ./pom.xml /deviceService/pom.xml
WORKDIR /deviceService
RUN mvn dependency:go-offline
COPY ./src/ /deviceService/src
WORKDIR /deviceService
RUN mvn clean install -DskipTests

FROM eclipse-temurin:25-jdk
WORKDIR /deviceService
COPY --from=build /deviceService/target/deviceService-0.0.1-SNAPSHOT.jar /deviceService/deviceService.jar
EXPOSE 8080
CMD ["java", "-jar", "deviceService.jar"]
