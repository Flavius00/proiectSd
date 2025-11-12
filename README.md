# README Proiect Microservicii

Acest proiect reprezintă o aplicație web bazată pe o arhitectură de microservicii. Aplicația este containerizată folosind Docker și orchestrată cu Docker Compose. Include servicii de backend dezvoltate în Spring Boot, un frontend (React) și un reverse proxy (Traefik) pentru a gestiona traficul.

## Arhitectură

Aplicația este compusă din următoarele componente principale:

* **Reverse Proxy (`traefik`):** Acționează ca punct de intrare (entrypoint) pentru toată aplicația. Acesta rutează automat cererile către serviciul de frontend sau către microserviciile de backend corespunzătoare.
* **Frontend (`nginx`):** Un server web Nginx care servește aplicația frontend statică (build-ul aplicației React).
* **Microservicii Backend (Spring Boot):**
    * `auth-service`: Gestionează autentificarea și autorizarea.
    * `userService` (numit `spring-demo` în compose): Gestionează operațiunile legate de utilizatori.
    * `device-service`: Gestionează operațiunile legate de dispozitive.
* **Baze de date (PostgreSQL):**
    * Fiecare microserviciu de backend are propria sa instanță de bază de date PostgreSQL izolată, pentru a asigura decuplarea.

## Servicii Detaliate

Mai jos este o listă a serviciilor definite în `docker-compose.yml` și porturile pe care le expun:

| Nume Serviciu (în compose) | Nume Container | Port Host | Port Container | Descriere |
| :--- | :--- | :--- | :--- | :--- |
| **Baze de Date** | | | | |
| `db-users` | `db-users` | 5433 | 5432 | Baza de date PostgreSQL pentru `userService`. |
| `db-auth` | `db-auth` | 5435 | 5432 | Baza de date PostgreSQL pentru `auth-service`. |
| `db-device` | `db-device` | 5434 | 5432 | Baza de date PostgreSQL pentru `device-service`. |
| **Backend** | | | | |
| `spring-demo` | `spring-demo` | 8081 | 8080 | Microserviciul `userService` (Java/Spring Boot). |
| `device-service`| `device-service`| 8082 | 8080 | Microserviciul `deviceService` (Java/Spring Boot). |
| `auth-service` | `auth-service` | 8083 | 8080 | Microserviciul `authService` (Java/Spring Boot). |
| **Frontend & Proxy** | | | | |
| `nginx` | `nginx-frontend` | - | 80 | Server Nginx care servește frontend-ul. |
| `traefik` | `traefik` | 80 | 80 | Reverse Proxy. Punctul de intrare HTTP. |
| `traefik` | `traefik` | 8080 | 8080 | Dashboard-ul Traefik pentru monitorizare. |

## Cerințe Preliminare

Înainte de a rula proiectul, asigurați-vă că aveți instalate următoarele unelte:

* **Docker:** Motorul de containerizare.
* **Docker Compose:** Uneltă pentru definirea și rularea aplicațiilor Docker multi-container.
* **Java 25:** Necesar dacă doriți să compilați manual proiectele Spring Boot.
* **Maven:** Necesar pentru managementul dependențelor și build-ul proiectelor Java.
* **Git:** Pentru a clona acest depozit.

## Instalare și Rulare

1.  **Clonați Depozitul**
    ```bash
    git clone https://gitlab.com/ds2025_30644_turcu_flavius_emil/ds2025_30644_turcu_flavius_emil_assignment_1.git
    cd DS2025_30644_Turcu_Flavius_Emil_Assignment_1
    ```

2.  **Creați Rețeaua Docker Externă**
    Serviciile sunt configurate să folosească o rețea externă numită `my_net`. Trebuie să o creați manual înainte de a porni containerele:
    ```bash
    docker network create my_net
    ```

3.  **Construiți și Porniți Containerele**
    Folosiți Docker Compose pentru a construi imaginile (unde este necesar) și a porni toate serviciile în modul "detached" (-d):
    ```bash
    docker-compose up --build -d
    ```

4.  **Oprirea Aplicației**
    Pentru a opri și șterge containerele, rețeaua și volumele:
    ```bash
    docker-compose down -v
    ```

## Utilizare

Odată ce toate containerele rulează, puteți accesa aplicația:

* **Aplicația Frontend:**
    Deschideți un browser și navigați la `http://localhost` (Traefik va ruta cererea către `nginx-frontend`).

* **Dashboard Traefik:**
    Pentru a vedea serviciile descoperite și rutele, accesați `http://localhost:8080`.

* **Acces Direct la API-uri (pentru testare):**
    * **UserService:** `http://localhost:8081`
    * **DeviceService:** `http://localhost:8082`
    * **AuthService:** `http://localhost:8083`
* **Acces prin container(cum se acceseaza din frontend):**
    * **UserService:** `http://localhost/api/user`
    * **DeviceService:** `http://localhost/api/device`
    * **AuthService:** `http://localhost/api/auth`

## Tehnologii Folosite

* **Backend:** Java 25, Spring Boot 4.0.0-SNAPSHOT
* **Frontend:** React (dedus din structura `nginx/src` și configurarea `nginx.conf`)
* **Bază de date:** PostgreSQL
* **Containerizare:** Docker & Docker Compose
* **Reverse Proxy & Load Balancing:** Traefik
* **Server Web (Frontend):** Nginx
