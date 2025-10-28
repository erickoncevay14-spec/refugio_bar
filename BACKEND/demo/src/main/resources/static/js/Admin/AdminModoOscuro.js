// Theme Toggle
function toggleTheme() {
    const html = document.documentElement;
    const button = document.querySelector('.theme-toggle');
    const currentTheme = html.getAttribute('data-theme');
    
    if (currentTheme === 'dark') {
        html.removeAttribute('data-theme');
        button.textContent = 'Modo Oscuro';
        localStorage.setItem('theme', 'light');
    } else {
        html.setAttribute('data-theme', 'dark');
        button.textContent = 'Modo Claro';
        localStorage.setItem('theme', 'dark');
    }
}

// Load saved theme
window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    const button = document.querySelector('.theme-toggle');
    
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        button.textContent = 'Modo Claro';
    }
});


        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                
                const section = this.dataset.section;
                document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
                document.getElementById(section).classList.add('active');
                
                const titles = {
                    'dashboard': 'Dashboard',
                    'productos': 'Productos',
                    'pedidos': 'Pedidos',
                    'usuarios': 'Usuarios',
                    'mesas': 'Mesas',
                    'reservas': 'Reservas',
                    'analytics': 'Analytics'
                };
                document.getElementById('pageTitle').textContent = titles[section];
            });
        });

    

        // Update date/time
        function updateDateTime() {
            const now = new Date();
            const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
            const dateStr = now.toLocaleDateString('es-ES', options);
            document.getElementById('fechaHora').textContent = dateStr;
        }
        
        updateDateTime();
        setInterval(updateDateTime, 60000);