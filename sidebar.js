// Get the sidebar and toggle icon elements
const sidebar = document.getElementById('sidebar');
const toggleIcon = document.getElementById('toggleIcon');

// Add click event listener to the toggle icon
toggleIcon.addEventListener('click', () => {
    sidebar.classList.toggle('open'); // Toggle the "open" class
});

// Close the sidebar when clicking outside of it (for mobile)
document.addEventListener('click', (event) => {
    if (!sidebar.contains(event.target) && !toggleIcon.contains(event.target)) {
        sidebar.classList.remove('open'); // Close the sidebar
    }
});