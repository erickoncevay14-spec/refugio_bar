import jsPDF from "jspdf";

export function generarComprobanteReserva(reserva) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  // Colores y estilos
  const primaryColor = '#2d3748';
  const accentColor = '#4299e1';
  const borderColor = '#e2e8f0';
  const textColor = '#222';
  const labelBg = '#f7fafc';
  // Encabezado
  doc.setFillColor(primaryColor);
  doc.roundedRect(40, 40, 515, 60, 8, 8, 'F');
  doc.setFontSize(24);
  doc.setTextColor('#fff');
  doc.text('Comprobante de Reserva', 55, 80);

  // Datos principales
  doc.setFontSize(12);
  doc.setTextColor(textColor);
  doc.setFont('helvetica', 'bold');
  doc.text('Cliente:', 55, 120);
  doc.setFont('helvetica', 'normal');
  doc.text(
    reserva.usuario?.nombre || reserva.usuario?.username || reserva.usuario?.email || '-',
    120,
    120
  );
  doc.setFont('helvetica', 'bold');
  doc.text('ID Reserva:', 55, 140);
  doc.setFont('helvetica', 'normal');
  doc.text(`${reserva.id || '-'}`, 130, 140);
  doc.setFont('helvetica', 'bold');
  doc.text('Mesa:', 55, 160);
  doc.setFont('helvetica', 'normal');
  doc.text(`${reserva.mesa?.numero || reserva.mesa?.id || '-'}`, 100, 160);
  doc.setFont('helvetica', 'bold');
  doc.text('Fecha:', 55, 180);
  doc.setFont('helvetica', 'normal');
  doc.text(
    reserva.fechaHora ? new Date(reserva.fechaHora).toLocaleDateString() : '-',
    110,
    180
  );
  doc.setFont('helvetica', 'bold');
  doc.text('Hora:', 55, 200);
  doc.setFont('helvetica', 'normal');
  doc.text(
    reserva.fechaHora ? new Date(reserva.fechaHora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-',
    100,
    200
  );
  doc.setFont('helvetica', 'bold');
  doc.text('Personas:', 55, 220);
  doc.setFont('helvetica', 'normal');
  doc.text(`${reserva.personas}`, 120, 220);
  doc.setFont('helvetica', 'bold');
  doc.text('Estado:', 55, 240);
  doc.setFont('helvetica', 'normal');
  doc.text(`${reserva.estado}`, 110, 240);

  // Bloque de agradecimiento
  doc.setFillColor(labelBg);
  doc.roundedRect(40, 270, 515, 40, 6, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(accentColor);
  doc.text('¡Gracias por reservar en RefugioBar!', 55, 295);

  // Pie de página
  doc.setFontSize(10);
  doc.setTextColor('#888');
  doc.text('RefugioBar - www.refugiobar.com', 55, 820);

  doc.save(`comprobante_reserva_${reserva.id || ''}.pdf`);
}
