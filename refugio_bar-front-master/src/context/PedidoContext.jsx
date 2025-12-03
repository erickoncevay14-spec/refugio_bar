import React, { createContext, useEffect, useState } from 'react';
import { connectPedidosSocket, disconnectSocket } from '../websocket/socket';

export const PedidoUpdateContext = createContext({ tick: 0 });

export const PedidoProvider = ({ children }) => {
	const [tick, setTick] = useState(0);

	useEffect(() => {
		// Conectar socket y aumentar un "tick" cuando lleguen eventos relevantes.
		connectPedidosSocket({
			onPedidoNuevo: () => setTick(t => t + 1),
			onPedidoActualizado: () => setTick(t => t + 1),
			onPedidoListo: () => setTick(t => t + 1),
		});

		return () => {
			try { disconnectSocket(); } catch (e) { /* ignore */ }
		};
	}, []);

	return (
		<PedidoUpdateContext.Provider value={{ tick }}>
			{children}
		</PedidoUpdateContext.Provider>
	);
};
