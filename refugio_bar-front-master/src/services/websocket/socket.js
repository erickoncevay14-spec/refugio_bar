
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

let stompClient = null;

export function connectSocket(onMessage) {
  stompClient = new Client({
    webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
    reconnectDelay: 5000,
    onConnect: () => {
      stompClient.subscribe('/topic/reservas/nueva', (msg) => {
        if (onMessage) onMessage(JSON.parse(msg.body));
      });
    },
  });
  stompClient.activate();
}

export function sendNuevaReserva(reserva) {
  if (stompClient && stompClient.connected) {
    stompClient.publish({ destination: '/app/reservas/nueva', body: JSON.stringify(reserva) });
  }
}

export function disconnectSocket() {
  if (stompClient) stompClient.deactivate();
}

