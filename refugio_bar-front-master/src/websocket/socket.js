import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const SOCKET_URL = 'http://localhost:8080/ws';

let stompClient = null;

const getConnectHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const connectSocket = (onMesaUpdate, onMesaDelete) => {
  stompClient = new Client({
    webSocketFactory: () => new SockJS(SOCKET_URL),
    reconnectDelay: 5000,
    connectHeaders: getConnectHeaders(),
    onConnect: () => {
      // Escuchar actualizaciones de mesas
      stompClient.subscribe('/topic/mesas/actualizado', (message) => {
        if (onMesaUpdate) onMesaUpdate(JSON.parse(message.body));
      });
      // Escuchar eliminaciones de mesas
      stompClient.subscribe('/topic/mesas/eliminada', (message) => {
        if (onMesaDelete) onMesaDelete(JSON.parse(message.body));
      });
    },
  });
  stompClient.activate();
};

export const connectPedidosSocket = ({ onPedidoNuevo, onPedidoActualizado, onPedidoListo }) => {
  if (!stompClient) {
    stompClient = new Client({
      webSocketFactory: () => new SockJS(SOCKET_URL),
      reconnectDelay: 5000,
      connectHeaders: getConnectHeaders(),
      onConnect: () => {
        // suscripciones que se añadirán abajo
      },
    });
    stompClient.activate();
  }

  const ensureSubscribe = () => {
    try {
      if (!stompClient.subscriptions) stompClient.subscriptions = {};
      // nuevo pedido
      if (!stompClient.subscriptions['/topic/pedidos']) {
        stompClient.subscriptions['/topic/pedidos'] = stompClient.subscribe('/topic/pedidos', (msg) => {
          if (onPedidoNuevo) onPedidoNuevo(JSON.parse(msg.body));
        });
      }
      // pedido actualizado
      if (!stompClient.subscriptions['/topic/pedidos/actualizado']) {
        stompClient.subscriptions['/topic/pedidos/actualizado'] = stompClient.subscribe('/topic/pedidos/actualizado', (msg) => {
          if (onPedidoActualizado) onPedidoActualizado(JSON.parse(msg.body));
        });
      }
      // pedidos listos para mozo
      if (!stompClient.subscriptions['/topic/pedidos/listos']) {
        stompClient.subscriptions['/topic/pedidos/listos'] = stompClient.subscribe('/topic/pedidos/listos', (msg) => {
          if (onPedidoListo) onPedidoListo(JSON.parse(msg.body));
        });
      }
    } catch (e) {
      // ignore
    }
  };

  // Si el cliente ya está activo, suscribimos; si no, se suscribirá en onConnect (pequeño timeout)
  if (stompClient && stompClient.connected) {
    ensureSubscribe();
  } else {
    setTimeout(ensureSubscribe, 500);
  }
};

export const disconnectSocket = () => {
  if (stompClient) stompClient.deactivate();
};
