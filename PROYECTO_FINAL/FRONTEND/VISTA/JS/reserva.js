 // Función para volver a la página Nosotros
        function goToProductos() {
            // Aquí puedes cambiar la ruta según tu estructura de archivos
            window.location.href = 'Nosotros.html';
        }

        // Manejar el envío del formulario
        document.getElementById('contactForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Mostrar mensaje de éxito
            const successMessage = document.getElementById('successMessage');
            successMessage.style.display = 'block';
            
            // Limpiar el formulario
            this.reset();
            
            // Hacer scroll al mensaje de éxito
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Opcional: Ocultar el mensaje después de 5 segundos
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 5000);
        });

        // Establecer fecha mínima como hoy
        document.getElementById('fecha').min = new Date().toISOString().split('T')[0];