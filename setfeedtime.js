// Initialize Flatpickr for date
flatpickr("#feedDate", {
    dateFormat: "Y-m-d", // Format: YYYY-MM-DD
    minDate: "today", // Disable past dates
    monthSelectorType: "dropdown", // Show dropdown for month and year
    altInput: true, // Use an alternate input for better UI
    altFormat: "F j, Y", // Format: Full month name, day, year
});

// Initialize Flatpickr for time
flatpickr("#feedTime", {
    enableTime: true,
    noCalendar: true, // Disable calendar
    dateFormat: "H:i", // Format: HH:MM
    time_24hr: true, // Use 24-hour format
    altInput: true, // Use an alternate input for better UI
    altFormat: "h:i K", // Format: Hour:Minute AM/PM
});

// Save a new feeding schedule
document.getElementById('feedTimeForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form from refreshing the page

    // Get selected date
    const feedDate = document.getElementById('feedDate').value;

    // Get selected time
    const feedHour = document.getElementById('feedHour').value;
    const feedMinute = document.getElementById('feedMinute').value;
    const feedAmPm = document.getElementById('feedAmPm').value;
    const feedTime = `${feedHour}:${feedMinute} ${feedAmPm}`;

    if (!feedDate || !feedTime) {
        alert('Please select a valid date and time.');
        return;
    }

    // Save the feeding schedule
    const feedingSchedule = {
        date: feedDate,
        time: feedTime,
    };

    const feedingSchedules = JSON.parse(localStorage.getItem('feedingSchedules')) || [];
    feedingSchedules.push(feedingSchedule);
    localStorage.setItem('feedingSchedules', JSON.stringify(feedingSchedules));

    alert(`Feeding schedule saved for ${feedDate} at ${feedTime}`);
    location.href = 'index.html'; // Redirect back to the main page
});

// Load saved feeding times
function loadFeedingTimes() {
    const timesList = document.getElementById('timesList');
    timesList.innerHTML = ''; // Clear the list

    const feedingSchedules = JSON.parse(localStorage.getItem('feedingSchedules')) || [];
    feedingSchedules.forEach((entry, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${entry.day}, ${entry.date} at ${entry.time}`;
        listItem.className = 'time-item';

        // Add a delete button for each entry
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete-button';
        deleteButton.onclick = () => {
            feedingSchedules.splice(index, 1);
            localStorage.setItem('feedingSchedules', JSON.stringify(feedingSchedules));
            loadFeedingTimes();
        };

        listItem.appendChild(deleteButton);
        timesList.appendChild(listItem);
    });
}

// Check if the current time, date, and day match any saved entry
function checkFeedingTime() {
    const now = new Date();
    const currentDay = now.toLocaleString('en-US', { weekday: 'long' }); // Get current day
    const currentDate = now.toLocaleDateString('en-US'); // Get current date in MM/DD/YYYY format
    const currentTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }); // Get current time in HH:MM AM/PM format

    const feedingSchedules = JSON.parse(localStorage.getItem('feedingSchedules')) || [];
    feedingSchedules.forEach((entry, index) => {
        if (entry.day === currentDay && entry.date === currentDate && entry.time === currentTime) {
            alert('It\'s feeding time! The dispenser will open.');
            feedingSchedules.splice(index, 1); // Remove the entry
            localStorage.setItem('feedingSchedules', JSON.stringify(feedingSchedules));
            loadFeedingTimes();
        }
    });
}

// Infinite scrolling for hours and minutes
function setupInfiniteScroll(containerId, maxValue) {
    const container = document.getElementById(containerId);
    const items = container.querySelectorAll('.scroll-item');

    // Clone items to create an infinite scroll effect
    items.forEach(item => {
        const clone = item.cloneNode(true);
        container.appendChild(clone);
    });

    container.addEventListener('scroll', () => {
        if (container.scrollTop + container.clientHeight >= container.scrollHeight) {
            container.scrollTop = 0; // Reset scroll to the top
        }
    });

    // Handle item selection
    container.addEventListener('click', (event) => {
        if (event.target.classList.contains('scroll-item')) {
            const selectedValue = event.target.getAttribute('data-value');
            alert(`Selected value: ${selectedValue}`);
        }
    });
}

// Validate inputs
function validateInputs(feedDay, feedDate, feedTime) {
    if (!feedDay) {
        alert('Please select a valid day.');
        return false;
    }
    if (!feedDate || !/^\d{2}\/\d{2}\/\d{4}$/.test(feedDate)) {
        alert('Please enter a valid date in MM/DD/YYYY format.');
        return false;
    }
    if (!feedTime || !/^\d{1,2}:\d{2} (AM|PM)$/.test(feedTime)) {
        alert('Please select a valid time.');
        return false;
    }
    return true;
}

// Load feeding times on page load
document.addEventListener('DOMContentLoaded', () => {
    loadFeedingTimes();
    setInterval(checkFeedingTime, 60000); // Check every minute

    // Initialize infinite scroll for hours and minutes
    setupInfiniteScroll('hourScroll', 12);
    setupInfiniteScroll('minuteScroll', 59);
});