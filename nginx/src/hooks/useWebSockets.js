import { useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs'; // Folosim Client, nu Stomp.over()
import { HOST } from '../commons/hosts';

const useWebSocket = (userId, onNotificationReceived) => {
    const clientRef = useRef(null);

    useEffect(() => {
        if (userId) {
            // URL-ul WebSocket nativ (ws://)
            // Dacă HOST.backend_api este http://localhost, transformăm în ws://localhost/ws
            // Asumăm că Traefik e pe portul 80
            const brokerURL = 'ws://localhost/ws';

            console.log("Connecting to WebSocket at:", brokerURL);

            const client = new Client({
                brokerURL: brokerURL,
                reconnectDelay: 5000,
                heartbeatIncoming: 4000,
                heartbeatOutgoing: 4000,
                // Nu avem nevoie de SockJS factory dacă folosim brokerURL (WebSocket standard)
            });

            client.onConnect = (frame) => {
                console.log('Connected to WebSocket!');

                const topic = `/topic/user/${userId}/notification`;

                client.subscribe(topic, (message) => {
                    if (message.body) {
                        try {
                            const notification = JSON.parse(message.body);
                            console.log("Notification Received:", notification);
                            onNotificationReceived(notification);
                        } catch (e) {
                            console.error("Error parsing JSON:", e);
                        }
                    }
                });
            };

            client.onStompError = (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
            };

            client.activate();
            clientRef.current = client;

            return () => {
                if (clientRef.current) {
                    clientRef.current.deactivate();
                    console.log("Disconnected from WebSocket");
                }
            };
        }
    }, [userId]);

    return clientRef.current;
};

export default useWebSocket;
