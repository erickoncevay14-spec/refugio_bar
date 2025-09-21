package com.restaurante.dto.response;

import java.time.LocalDateTime;
import java.util.List;

public class RecetaResponse {
    // Para: Respuestas de GET/POST/PUT /api/recetas
    // Datos completos de la receta
    
    private Long id;
    private String nombre;
    private String categoria;
    private Integer tiempoPreparacion;
    private String dificultad;
    private List<IngredienteResponse> ingredientes;
    private List<String> pasos;
    private String notas;
    private String imagen;
    private Boolean activa;
    private String nombreCreador; // Nombre del bartender que la creó
    private LocalDateTime fechaCreacion;
    private Integer vecesPreparada; // Estadística
    
    // Constructores, getters y setters...
    public RecetaResponse() {}
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }
    public Integer getTiempoPreparacion() { return tiempoPreparacion; }
    public void setTiempoPreparacion(Integer tiempoPreparacion) { this.tiempoPreparacion = tiempoPreparacion; }
    public String getDificultad() { return dificultad; }
    public void setDificultad(String dificultad) { this.dificultad = dificultad; }
    public List<IngredienteResponse> getIngredientes() { return ingredientes; }
    public void setIngredientes(List<IngredienteResponse> ingredientes) { this.ingredientes = ingredientes; }
    public List<String> getPasos() { return pasos; }
    public void setPasos(List<String> pasos) { this.pasos = pasos; }
    public String getNotas() { return notas; }
    public void setNotas(String notas) { this.notas = notas; }
    public String getImagen() { return imagen; }
    public void setImagen(String imagen) { this.imagen = imagen; }
    public Boolean getActiva() { return activa; }
    public void setActiva(Boolean activa) { this.activa = activa; }
    public String getNombreCreador() { return nombreCreador; }
    public void setNombreCreador(String nombreCreador) { this.nombreCreador = nombreCreador; }
    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }
    public Integer getVecesPreparada() { return vecesPreparada; }
    public void setVecesPreparada(Integer vecesPreparada) { this.vecesPreparada = vecesPreparada; }
}
