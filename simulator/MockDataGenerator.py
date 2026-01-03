import pika
import json
import time
import random
import sys
from datetime import datetime, timedelta

# --- CONFIGURATION ---
RABBITMQ_HOST = 'localhost'
QUEUE_NAME = 'energy-queue'
DEVICE_ID = "0000000000000-0000-0000-0001"  # <--- PASTE A VALID UUID FROM YOUR DB HERE

def simulate_device():
    try:
        # Connect to RabbitMQ
        connection = pika.BlockingConnection(pika.ConnectionParameters(host=RABBITMQ_HOST))
        channel = connection.channel()

        # Ensure the queue exists
        channel.queue_declare(queue=QUEUE_NAME, durable=True)

        print(f"[*] Simulator started for Device: {DEVICE_ID}")
        print("[*] Sending 'Hourly' data every 2 minutes.")
        print("[*] Press CTRL+C to stop.")

        # Start simulation from "now"
        simulated_time = datetime.now()

        while True:
            # Generate a random consumption value (e.g., between 1.0 and 100.0 kWh)
            energy_value = round(random.uniform(1.0, 100.0), 2)

            # Create the JSON payload (matching your Java DTO)
            payload = {
                "timeStamp": int(simulated_time.timestamp() * 1000), # Epoch in milliseconds
                "deviceId": DEVICE_ID,
                "reading": energy_value
            }

            # Convert to JSON string
            message_body = json.dumps(payload)

            # Publish to RabbitMQ
            channel.basic_publish(
                exchange='',
                routing_key=QUEUE_NAME,
                body=message_body,
                properties=pika.BasicProperties(
                    delivery_mode=2,  # Make message persistent
                    content_type='application/json',
                    priority=0
                )
            )

            print(f"[x] Sent: {energy_value} kWh for time: {simulated_time.strftime('%Y-%m-%d %H:%M')}")

            # TIME TRAVEL: Advance the timestamp by 1 hour for the next message
            simulated_time += timedelta(hours=1)

            # REAL TIME: Wait 2 minutes before sending the next one
            time.sleep(120)

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
    simulate_device()
