package com.restaurante.dto.response;

public class ErrorResponse {
    private String error;
    private String message;
    private int status;
    
    public ErrorResponse(String error) {
        this.error = error;
        this.message = error;
        this.status = 400;
    }
    
    public ErrorResponse(String error, String message, int status) {
        this.error = error;
        this.message = message;
        this.status = status;
    }
    
    // Getters y Setters
    public String getError() { return error; }
    public void setError(String error) { this.error = error; }
    
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    
    public int getStatus() { return status; }
    public void setStatus(int status) { this.status = status; }
}