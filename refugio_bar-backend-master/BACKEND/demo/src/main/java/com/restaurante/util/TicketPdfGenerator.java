package com.restaurante.util;

import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import com.restaurante.model.Pedido;
import com.restaurante.model.DetallePedido;

import java.io.FileOutputStream;
import java.text.SimpleDateFormat;

public class TicketPdfGenerator {

    /**
     * Método de prueba rápido (genera un PDF con solo un texto)
     */
    public static void generarBoletaTest(String ruta) throws Exception {
        try (FileOutputStream fos = new FileOutputStream(ruta)) {
            Document document = new Document();
            PdfWriter.getInstance(document, fos);
            document.open();
            document.add(new Paragraph("PRUEBA PDF OK - Funciona perfecto"));
            document.close(); // ← solo esto es suficiente
        }
        System.out.println("[TicketPdfGenerator] PDF de prueba generado en: " + ruta);
    }

    /**
     * Genera el ticket/boleta de venta en PDF (formato térmico 80mm)
     */
    public static void generarBoleta(Pedido pedido, String pdfPath) throws Exception {

        if (pedido == null) {
            throw new IllegalArgumentException("El pedido no puede ser null");
        }
        if (pedido.getDetalles() == null || pedido.getDetalles().isEmpty()) {
            throw new IllegalArgumentException("El pedido no tiene detalles.");
        }

        // Tamaño aproximado de ticket de 80mm → 226 puntos (a 72 dpi ≈ 80mm)
        Document document = new Document(new Rectangle(226, 800), 10, 10, 10, 10);

        try (FileOutputStream fos = new FileOutputStream(pdfPath)) {

            PdfWriter writer = PdfWriter.getInstance(document, fos);
            document.open();

            Font fontNormal = new Font(Font.COURIER, 9);
            Font fontBold = new Font(Font.COURIER, 10, Font.BOLD);
            Font fontBoldBig = new Font(Font.COURIER, 11, Font.BOLD);

            // ==================== ENCABEZADO ====================
            Paragraph header = new Paragraph(
                    "REFUGIO BAR\n" +
                    "CDH BAR CARA SUCIA\n" +
                    "RUC: 20604915351\n" +
                    "https://tusitio.com\n" +
                    "Cel: 70186129\n\n", fontBold);
            header.setAlignment(Element.ALIGN_CENTER);
            document.add(header);

            document.add(new Paragraph("NOTA DE VENTA ELECTRÓNICA", fontBold));
            document.add(new Paragraph("N° " + pedido.getNumeroPedido() + "\n\n", fontNormal));

            // ==================== DATOS CLIENTE / CAJERO ====================
            SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy HH:mm");

            document.add(new Paragraph("Cliente: CLIENTE GENERAL", fontNormal));
            document.add(new Paragraph("Cajero: " +
                    (pedido.getUsuario() != null ? pedido.getUsuario().getNombre() : "-"), fontNormal));
            document.add(new Paragraph("F/H Emisión: " +
                    (pedido.getFechaPedido() != null ? sdf.format(pedido.getFechaPedido()) : "-"), fontNormal));
            document.add(new Paragraph(" "));

            // ==================== TABLA DE DETALLES ====================
            PdfPTable table = new PdfPTable(5);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{1f, 1f, 3f, 1f, 1f});

            // Cabeceras
            addCellToTable(table, "Cant", true);
            addCellToTable(table, "U.M.", true);
            addCellToTable(table, "Descripción", true);
            addCellToTable(table, "Unit", true);
            addCellToTable(table, "Total", true);

            // Filas de productos
            for (DetallePedido d : pedido.getDetalles()) {
                addCellToTable(table, String.valueOf(d.getCantidad()), false);
                addCellToTable(table, "UND", false);
                addCellToTable(table, d.getProducto().getNombre(), false);
                addCellToTable(table, String.format("%.2f", d.getPrecioUnitario()), false);
                addCellToTable(table, String.format("%.2f", d.getSubtotal()), false);
            }

            document.add(table);

            // ==================== TOTALES ====================
            document.add(new Paragraph("\nDESCUENTO: S/ 0.00", fontNormal));
            document.add(new Paragraph("OP. SUBTOTAL: S/ " + String.format("%.2f", pedido.getTotal()), fontNormal));
            document.add(new Paragraph("IGV 0%: S/ 0.00", fontNormal));
            document.add(new Paragraph("IMPORTE TOTAL: S/ " + String.format("%.2f", pedido.getTotal()), fontBoldBig));

            document.add(new Paragraph(" "));
            document.add(new Paragraph("SON: " + convertirNumeroALetras(pedido.getTotal()) + " SOLES", fontNormal));
            document.add(new Paragraph("Forma de Pago: " +
                    (pedido.getMetodoPago() != null ? pedido.getMetodoPago() : "EFECTIVO"), fontNormal));
            document.add(new Paragraph("Monto Recibido: S/ " +
                    (pedido.getMontoPagado() != null ? String.format("%.2f", pedido.getMontoPagado()) : "0.00"), fontNormal));

            document.add(new Paragraph(" "));
            Paragraph gracias = new Paragraph("¡MUCHAS GRACIAS POR SU PREFERENCIA!", fontBold);
            gracias.setAlignment(Element.ALIGN_CENTER);
            document.add(gracias);

            // ==================== CIERRE CORRECTO ====================
            document.close();
            // ¡NO LLAMAR writer.close()! → document.close() ya lo hace internamente

        } // ← aquí se cierra automáticamente el FileOutputStream

        System.out.println("[TicketPdfGenerator] Boleta generada correctamente en: " + pdfPath);
    }

    // Pequeño helper para no repetir código en la tabla
    private static void addCellToTable(PdfPTable table, String text, boolean isHeader) {
        PdfPCell cell = new PdfPCell(new Phrase(text, isHeader 
                ? new Font(Font.COURIER, 9, Font.BOLD) 
                : new Font(Font.COURIER, 9)));
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        cell.setBorder(Rectangle.NO_BORDER);
        if (!isHeader) {
            cell.setPaddingBottom(8f);
        }
        table.addCell(cell);
    }

    // Conversor básico de número → letras (solo hasta 14 porque en tickets casi nunca pasa de ahí)
    private static String convertirNumeroALetras(Double numero) {
        if (numero == null) return "CERO";
        int n = numero.intValue();
        String[] unidades = {"", "UN", "DOS", "TRES", "CUATRO", "CINCO", "SEIS", "SIETE", "OCHO", "NUEVE", "DIEZ",
                             "ONCE", "DOCE", "TRECE", "CATORCE", "QUINCE", "DIECISEIS", "DIECISIETE",
                             "DIECIOCHO", "DIECINUEVE", "VEINTE"};
        if (n < 20) return unidades[n];
        return String.valueOf(n); // por si es mayor
    }
}