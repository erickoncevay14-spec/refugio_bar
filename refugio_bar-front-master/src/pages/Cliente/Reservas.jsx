import React, { useEffect, useState } from "react";
import { getReservas } from "../../services/reservaService";
import { generarComprobanteReserva } from "../../utils/comprobanteReserva";

const Reservas = () => {
	const [reservas, setReservas] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchReservas = async () => {
			setLoading(true);
			try {
				const userId = localStorage.getItem("userId");
				const todas = await getReservas();
				// Filtrar solo las reservas del usuario autenticado
				const mias = Array.isArray(todas)
					? todas.filter(r => String(r.usuario?.id) === String(userId))
					: [];
				setReservas(mias);
			} catch (err) {
				setError("Error al cargar reservas");
			}
			setLoading(false);
		};
		fetchReservas();
	}, []);

	return (
		<section className="p-2 sm:p-4 max-w-2xl mx-auto">
			<h2 className="text-xl font-bold mb-4">Mis Reservas</h2>
			<div className="bg-white rounded shadow p-2 sm:p-4">
				{loading ? (
					<p>Cargando...</p>
				) : error ? (
					<p className="text-red-500">{error}</p>
				) : reservas.length === 0 ? (
					<p className="text-gray-600">No tienes reservas registradas.</p>
				) : (
					<>
						{/* Desktop table */}
						<table className="hidden sm:table min-w-full text-sm">
							<thead>
								<tr>
									<th className="px-2 py-1 text-left">Fecha</th>
									<th className="px-2 py-1 text-left">Hora</th>
									<th className="px-2 py-1 text-left">Personas</th>
									<th className="px-2 py-1 text-left">Mesa</th>
									<th className="px-2 py-1 text-left">Estado</th>
									<th className="px-2 py-1 text-left"></th>
								</tr>
							</thead>
							<tbody>
								{reservas.map(r => {
									const fecha = r.fechaHora ? new Date(r.fechaHora) : null;
									return (
										<tr key={r.id}>
											<td className="px-2 py-1">{fecha ? fecha.toLocaleDateString() : "-"}</td>
											<td className="px-2 py-1">{fecha ? fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "-"}</td>
											<td className="px-2 py-1">{r.personas}</td>
											<td className="px-2 py-1">{r.mesa?.numero || "-"}</td>
											<td className="px-2 py-1 flex items-center gap-2">
												<span>{r.estado}</span>
												{r.estado === 'CONFIRMADA' && (
													<button
														title="Descargar comprobante"
														className="px-2 py-1 rounded bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold transition flex items-center"
														onClick={() => generarComprobanteReserva(r)}
														style={{ verticalAlign: 'middle' }}
													>
														<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-1">
															<path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0l-4-4m4 4l4-4m-8 8h8" />
														</svg>
														Comprobante
													</button>
												)}
												{r.estado === 'PENDIENTE' && (
													<button
														title="Cancelar reserva"
														className="px-2 py-1 rounded bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-semibold transition flex items-center"
														onClick={async () => {
															if(window.confirm('¿Seguro que deseas cancelar esta reserva?')) {
																try {
																	const updated = await import('../../services/reservaService').then(m => m.updateReserva(r.id, { ...r, estado: 'CANCELADA' }));
																	setReservas(reservas.map(res => res.id === r.id ? { ...res, estado: 'CANCELADA' } : res));
																} catch (e) {
																	alert('Error al cancelar la reserva');
																}
															}
														}}
														style={{ verticalAlign: 'middle' }}
													>
														Cancelar
													</button>
												)}
											</td>
											<td></td>
										</tr>
								);
								})}
							</tbody>
						</table>

						{/* Mobile cards */}
						<div className="sm:hidden flex flex-col gap-3">
							{reservas.map(r => {
								const fecha = r.fechaHora ? new Date(r.fechaHora) : null;
								return (
									<div key={r.id} className="rounded border border-gray-200 shadow-sm p-3 bg-white flex flex-col gap-2">
										<div className="flex justify-between items-center">
											<span className="font-semibold text-base">{fecha ? fecha.toLocaleDateString() : "-"}</span>
											<span className="text-xs text-gray-500">{fecha ? fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "-"}</span>
										</div>
										<div className="flex justify-between text-sm">
											<span><span className="font-medium">Personas:</span> {r.personas}</span>
											<span><span className="font-medium">Mesa:</span> {r.mesa?.numero || "-"}</span>
										</div>
										<div className="flex items-center gap-2 mt-1">
											<span className="text-xs px-2 py-1 rounded bg-gray-100 font-semibold">{r.estado}</span>
											{r.estado === 'CONFIRMADA' && (
												<button
													title="Descargar comprobante"
													className="ml-auto px-2 py-1 rounded bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold transition flex items-center"
													onClick={() => generarComprobanteReserva(r)}
													style={{ verticalAlign: 'middle' }}
												>
													<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-1">
														<path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0l-4-4m4 4l4-4m-8 8h8" />
													</svg>
													Comprobante
												</button>
											)}
											{r.estado === 'PENDIENTE' && (
												<button
													title="Cancelar reserva"
													className="ml-auto px-2 py-1 rounded bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-semibold transition flex items-center"
													onClick={async () => {
														if(window.confirm('¿Seguro que deseas cancelar esta reserva?')) {
															try {
																const updated = await import('../../services/reservaService').then(m => m.updateReserva(r.id, { ...r, estado: 'CANCELADA' }));
																setReservas(reservas.map(res => res.id === r.id ? { ...res, estado: 'CANCELADA' } : res));
															} catch (e) {
																alert('Error al cancelar la reserva');
															}
														}
													}}
													style={{ verticalAlign: 'middle' }}
												>
													Cancelar
												</button>
											)}
										</div>
									</div>
								);
							})}
						</div>
					</>
				)}
				</div>
			</section>
	);
};

export default Reservas;
