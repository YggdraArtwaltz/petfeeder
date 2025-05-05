// Function to open the link
function openLink() {
    const link = "https://docs.google.com/spreadsheets/d/<SHEET_ID>/edit"; // Replace <SHEET_ID> with your actual Google Sheet ID
    window.open(link, "_blank"); // Open the link in a new tab
}

// Function to print the page
function printPage() {
    window.print(); // Trigger the browser's print dialog
}

// Add animation to buttons
const buttons = document.querySelectorAll('.action-button');
buttons.forEach(button => {
    button.addEventListener('mouseover', () => {
        button.classList.add('hovered');
    });

    button.addEventListener('mouseout', () => {
        button.classList.remove('hovered');
    });

    button.addEventListener('click', () => {
        button.classList.add('clicked');
        setTimeout(() => {
            button.classList.remove('clicked');
        }, 300); // Remove the animation after 300ms
    });
});