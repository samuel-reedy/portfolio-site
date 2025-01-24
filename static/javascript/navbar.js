document.addEventListener('DOMContentLoaded', function() {
    // Load the navbar
    fetch('/template/navbar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar').innerHTML = data;
            setActivePage();
        })
        .catch(error => console.error('Error loading navbar:', error));

    // Set the active page
    function setActivePage() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('#navbar a');

        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentPath) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
});