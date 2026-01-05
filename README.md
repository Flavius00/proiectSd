# README Proiect Microservicii - Sistem de Monitorizare a Energiei

Acest proiect reprezintă o aplicație web complexă bazată pe o arhitectură de microservicii distribuite. Aplicația este containerizată folosind Docker, orchestrată cu Docker Compose și utilizează comunicare asincronă prin RabbitMQ pentru sincronizarea datelor și procesarea citirilor de la senzori.

Include servicii de backend dezvoltate în Spring Boot, un frontend (React), un reverse proxy (Traefik) și un simulator de date (Python).

## Arhitectură și Componente Noi

Față de versiunea anterioară, sistemul a fost extins pentru a suporta monitorizarea consumului de energie:

* **Communication Middleware (`RabbitMQ`):** Gestionează cozile de mesaje pentru decuplarea serviciilor și asigurarea consistenței eventuale.
    * `auth-user-queue`: Sincronizează datele utilizatorilor între **AuthService** și **UserService** (utilizat la înregistrare).
    * `user-device-queue`: Propagă evenimentele (ștergeri, actualizări) dinspre **UserService** către **DeviceService**.
    * `device-sync-queue`: Sincronizează crearea/modificarea dispozitivelor între **DeviceService** și **MonitoringService**.
    * `device-delete-queue`: Asigură ștergerea în cascadă a dispozitivelor și a citirilor asociate în **MonitoringService**.
    * `energy-queue`: Prelucrează fluxul de date primit de la senzorii inteligenți (Simulator).
* **Monitoring Microservice (`monitoring-service`):**
    * Consumator RabbitMQ: Ascultă mesajele de sincronizare și datele de energie.
    * Stochează datele istorice și oferă API-uri pentru graficele de consum.
* **Device Data Simulator (Python):** Un script care simulează comportamentul senzorilor inteligenți, generând date de consum și trimițându-le către RabbitMQ.

## Servicii Detaliate

Lista completă a serviciilor definite în `docker-compose.yml`:

| Nume Serviciu (în compose) | Nume Container | Port Host | Port Container | Descriere |
| :--- | :--- | :--- | :--- | :--- |
| **Infrastructură & Mesagerie** | | | | |
| `rabbitmq` | `rabbitmq` | 5672, 15672 | 5672, 15672 | Message Broker. Interfața de management la portul 15672. |
| `traefik` | `traefik` | 80, 8080 | 80, 8080 | Reverse Proxy și Load Balancer. Dashboard la portul 8080. |
| **Baze de Date** | | | | |
| `db-users` | `db-users` | 5433 | 5432 | PostgreSQL pentru `userService`. |
| `db-auth` | `db-auth` | 5435 | 5432 | PostgreSQL pentru `auth-service`. |
| `db-device` | `db-device` | 5434 | 5432 | PostgreSQL pentru `device-service`. |
| `db-monitoring`| `db-monitoring`| 5436 | 5432 | PostgreSQL pentru `monitoring-service`. |
| **Backend Microservices** | | | | |
| `spring-demo` | `spring-demo` | 8081 | 8080 | Microserviciul `userService` (Gestionează utilizatori). |
| `device-service`| `device-service`| 8082 | 8080 | Microserviciul `deviceService` (Gestionează dispozitive & Sync). |
| `auth-service` | `auth-service` | 8083 | 8080 | Microserviciul `authService` (Autentificare JWT). |
| `monitoring-service`| `monitoring-service`| 8084 | 8080 | Microserviciul `monitoringService` (Consumator & Grafice). |
| **Frontend** | | | | |
| `nginx` | `nginx-frontend` | - | 80 | Server Nginx care servește aplicația React. |

## Cerințe Preliminare

* **Docker & Docker Compose**
* **Java 17+ & Maven** (pentru dezvoltare backend)
* **Python 3.x** (pentru rularea simulatorului)
* **Librării Python:** `pika`, `psycopg2` (pentru simulator)

## Instalare și Rulare

### 1. Pornirea Sistemului (Docker)

1.  **Creați Rețeaua Docker Externă** (dacă nu există deja):
    ```bash
    docker network create my_net
    ```

2.  **Porniți Containerele:**
    ```bash
    docker-compose up --build -d
    ```

3.  **Verificare:**
    * Frontend: `http://localhost`
    * RabbitMQ Management: `http://localhost:15672` (User/Pass: `guest`/`guest` implicit)
    * Traefik Dashboard: `http://localhost:8080`

### 2. Rularea Simulatorului de Senzori

Simulatorul este o aplicație Python separată care trimite date către RabbitMQ.

1.  Navigați în folderul simulatorului:
    ```bash
    cd simulator
    ```
2.  Instalați dependențele necesare:
    ```bash
    pip install pika psycopg2
    ```
3.  Porniți simulatorul:
    ```bash
    python MockDataGenerator.py
    ```
    *Notă: Simulatorul va citi ID-urile dispozitivelor din baza de date și va începe să trimită date simulate de consum către coada `energy-queue`.*

### 3. Oprirea Aplicației
```bash
docker-compose down -v
```
### Funcționalități Cheie
**Sincronizare Event-Driven:**

* Când un dispozitiv este creat, actualizat sau șters în DeviceService, un eveniment este trimis prin RabbitMQ.

* MonitoringService consumă acest eveniment și își actualizează propria bază de date pentru a menține consistența, fără a cupla direct serviciile.

**Monitorizare Energie:**

* Datele primite de la Simulator sunt procesate și stocate.

* Utilizatorii pot vizualiza grafice de consum (Energy Charts) pe ore, comparând consumul real cu limita maximă setată per dispozitiv.

### Securitate:

Autentificare bazată pe JWT (JSON Web Tokens).

Roluri de utilizator (Admin/Client) gestionate centralizat.

 ### Acces API (Endpoints)
Toate cererile sunt rutate prin Traefik (`http://localhost/api/...`), dar serviciile pot fi accesate și direct pentru debug:

* **User API: `http://localhost/api/users` (via Proxy) sau :8081**

* **Device API: `http://localhost/api/devices` (via Proxy) sau :8082**

* **Auth API: `http://localhost/api/auth` (via Proxy) sau :8083**

* **Monitoring API: `http://localhost/api/monitoring` (via Proxy) sau :8084**

* **Endpoint grafice: `/chart/user/{userId}?date=YYYY-MM-DD`**

