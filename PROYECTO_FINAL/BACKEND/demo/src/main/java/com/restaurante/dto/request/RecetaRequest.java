package com.restaurante.dto.request;

import jakarta.validation.constraints.*;
import java.util.List;

public class RecetaRequest {
    // Para: POST /api/recetas, PUT /api/recetas/{id}
    // Crear/actualizar recetas (Bartender)
    
    private Long id; // Solo para actualizaciones
    
    @NotBlank(message = "El nombre de la receta es obligatorio")
    private String nombre;
    
    @NotBlank(message = "La categoría es obligatoria")
    private String categoria;
    
    @NotNull(message = "El tiempo de preparación es obligatorio")
    @Min(value = 1, message = "El tiempo debe ser al menos 1 minuto")
    private Integer tiempoPreparacion;
    
    @NotBlank(message = "La dificultad es obligatoria")
    @Pattern(regexp = "FACIL|MEDIO|DIFICIL", message = "Dificultad inválida")
    private String dificultad;
    
    @NotEmpty(message = "Debe tener al menos un ingrediente")
    private List<IngredienteRequest> ingredientes;
    
    @NotEmpty(message = "Debe tener al menos un paso")
    private List<String> pasos;
    
    private String notas;
    private String imagen;
    private Boolean activa;
    private Long productoId;
    
    // Constructores, getters y setters...
    public RecetaRequest() {}
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
    public List<IngredienteRequest> getIngredientes() { return ingredientes; }
    public void setIngredientes(List<IngredienteRequest> ingredientes) { this.ingredientes = ingredientes; }
    public List<String> getPasos() { return pasos; }
    public void setPasos(List<String> pasos) { this.pasos = pasos; }
    public String getNotas() { return notas; }
    public void setNotas(String notas) { this.notas = notas; }
    public String getImagen() { return imagen; }
    public void setImagen(String imagen) { this.imagen = imagen; }
    public Boolean getActiva() { return activa; }
    public void setActiva(Boolean activa) { this.activa = activa; }
    public Long getProductoId() { return productoId; }
    public void setProductoId(Long productoId) { this.productoId = productoId; }
}