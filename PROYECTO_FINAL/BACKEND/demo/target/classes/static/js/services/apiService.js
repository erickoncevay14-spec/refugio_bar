// Configuración base de la API
const API_BASE_URL = 'http://localhost:8080/api';

// Servicio genérico para peticiones
class ApiService {
    constructor() {
        this.token = localStorage.getItem('token');
    }
    
    // Headers por defecto
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json',
        };
        
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        
        return headers;
    }
    
    // GET request
    async get(endpoint) {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'GET',
                headers: this.getHeaders()
            });
            return await response.json();
        } catch (error) {
            console.error('Error en GET:', error);
            throw error;
        }
    }
    
    // POST request
    async post(endpoint, data) {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            console.error('Error en POST:', error);
            throw error;
        }
    }
}

const apiService = new ApiService();