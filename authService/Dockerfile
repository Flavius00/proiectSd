FROM maven:3.9 AS build

ENV TZ=UTC
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
ENV CATALINA_OPTS="-Duser.timezone=UTC"

COPY ./pom.xml /authService/pom.xml
WORKDIR /authService
RUN mvn dependency:go-offline
COPY ./src/ /authService/src
WORKDIR /authService
RUN mvn clean install -DskipTests

FROM eclipse-temurin:25-jdk
WORKDIR /authService
COPY --from=build /authService/target/authService-0.0.1-SNAPSHOT.jar /authService/authService.jar
EXPOSE 8080
CMD ["java", "-jar", "authService.jar"]
