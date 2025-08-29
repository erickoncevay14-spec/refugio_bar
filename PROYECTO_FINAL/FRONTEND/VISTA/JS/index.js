 // Navegación suave
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Efecto de scroll en header
        window.addEventListener('scroll', () => {
            const header = document.querySelector('header');
            if (window.scrollY > 100) {
                header.style.background = 'rgba(26, 26, 26, 0.95)';
                header.style.backdropFilter = 'blur(10px)';
            } else {
                header.style.background = 'linear-gradient(135deg, #1a1a1a 0%, #2d1810 100%)';
                header.style.backdropFilter = 'none';
            }
        });

        // Animación de aparición para las tarjetas de productos
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                }
            });
        }, observerOptions);

        document.querySelectorAll('.product-card').forEach(card => {
            observer.observe(card);
        });

        // Manejo del formulario de login
        document.querySelector('.login-form').addEventListener('submit', function (e) {
            e.preventDefault();
            const usuario = document.getElementById('usuario').value;
            const password = document.getElementById('password').value;

            if (usuario && password) {
                alert('¡Bienvenido a El Refugio Bar!');
                // Aquí irían las funciones de autenticación real
            } else {
                alert('Por favor complete todos los campos.');
            }
        });