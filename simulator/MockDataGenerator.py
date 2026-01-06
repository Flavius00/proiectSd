import pika
import json
import time
import random
import sys
import psycopg2  # Libraria pentru PostgreSQL
from datetime import datetime, timedelta

# --- CONFIGURATION RABBITMQ ---
RABBITMQ_HOST = 'localhost'
QUEUE_NAME = 'energy-queue'

# --- CONFIGURATION DATABASE ---
DB_HOST = "localhost"
DB_PORT = "5434"
DB_NAME = "device-service"
DB_USER = "postgres"
DB_PASS = "root"

def get_device_ids():
    """Conecteaza la baza de date si returneaza o lista cu ID-urile dispozitivelor."""
    device_ids = []
    conn = None
    try:
        # print("[*] Connecting to Database to fetch Device IDs...")
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASS
        )
        cursor = conn.cursor()

        # Selectam ID-urile din tabelul 'device'
        cursor.execute("SELECT id FROM device")
        rows = cursor.fetchall()

        for row in rows:
            device_ids.append(str(row[0]))

        # print(f"[*] Found {len(device_ids)} devices in database.")

    except (Exception, psycopg2.DatabaseError) as error:
        print(f"[!] Database Error: {error}")
    finally:
        if conn is not None:
            conn.close()

    return device_ids

def simulate_all_devices():
    try:
        # Connect to RabbitMQ
        connection = pika.BlockingConnection(pika.ConnectionParameters(host=RABBITMQ_HOST))
        channel = connection.channel()

        # Ensure the queue exists
        channel.queue_declare(queue=QUEUE_NAME, durable=True)

        print("[*] Simulator started for ALL devices.")
        print("[*] Press CTRL+C to stop.")

        # Start simulation from "now"
        simulated_time = datetime.now()

        while True:
            # 1. Reimprospatam lista de device-uri la fiecare iteratie
            # (Optional: daca adaugi device-uri noi in timp ce ruleaza scriptul, le va prelua)
            valid_device_ids = get_device_ids()

            if not valid_device_ids:
                print("[!] No devices found. Waiting...")
                time.sleep(5)
                continue

            print(f"\n--- Sending data batch for {len(valid_device_ids)} devices at {simulated_time.strftime('%H:%M')} ---")

            # 2. Itereaza prin FIECARE device si trimite date
            for device_id in valid_device_ids:
                # Genereaza valoare random
                energy_value = round(random.uniform(1.0, 50.0), 2)

                # Payload
                payload = {
                    "timeStamp": int(simulated_time.timestamp() * 1000),
                    "deviceId": device_id,
                    "reading": energy_value
                }

                message_body = json.dumps(payload)

                channel.basic_publish(
                    exchange='',
                    routing_key=QUEUE_NAME,
                    body=message_body,
                    properties=pika.BasicProperties(
                        delivery_mode=2,
                        content_type='application/json',
                        priority=0
                    )
                )
                # Afiseaza un log scurt
                print(f" -> Sent {energy_value} kWh for {device_id}")

            # 3. Avansam timpul si asteptam
            simulated_time += timedelta(hours=1)

            # Asteapta 5 secunde inainte de urmatoarea serie de date pentru toate device-urile
            time.sleep(5)

    except KeyboardInterrupt:
        print("\n[!] Simulator stopped.")
        try:
            connection.close()
        except:
            pass
        sys.exit(0)
    except Exception as e:
        print(f"\n[!] Error: {e}")

if __name__ == "__main__":
    simulate_all_devices()
