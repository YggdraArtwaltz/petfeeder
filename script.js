// Draw the clock
function drawClock() {
    const canvas = document.getElementById('canvasClock');
    const ctx = canvas.getContext('2d');
    const now = new Date();

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = canvas.width / 2 - 10;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the clock face
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#333';
    ctx.stroke();

    // Draw the hour marks and numbers
    ctx.font = `${canvas.width / 15}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let i = 1; i <= 12; i++) {
        const angle = (i * Math.PI) / 6 - Math.PI / 2;
        const x = centerX + Math.cos(angle) * (radius - 30);
        const y = centerY + Math.sin(angle) * (radius - 30);
        ctx.fillText(i.toString(), x, y);
    }

    // Get the current time
    const hours = now.getHours() % 12;
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    // Draw the hour hand
    const hourAngle = ((hours + minutes / 60) * Math.PI) / 6 - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(
        centerX + Math.cos(hourAngle) * (radius - 50),
        centerY + Math.sin(hourAngle) * (radius - 50)
    );
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#000';
    ctx.stroke();

    // Draw the minute hand
    const minuteAngle = ((minutes + seconds / 60) * Math.PI) / 30 - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(
        centerX + Math.cos(minuteAngle) * (radius - 30),
        centerY + Math.sin(minuteAngle) * (radius - 30)
    );
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#333';
    ctx.stroke();

    // Draw the second hand
    const secondAngle = (seconds * Math.PI) / 30 - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(
        centerX + Math.cos(secondAngle) * (radius - 20),
        centerY + Math.sin(secondAngle) * (radius - 20)
    );
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'red';
    ctx.stroke();
}

// Update the clock every second
setInterval(drawClock, 1000);
drawClock(); // Initialize the clock immediately

// Load scheduled food from localStorage and display it
function loadScheduledFood() {
    const scheduledFoodList = document.getElementById('scheduledFoodList');
    scheduledFoodList.innerHTML = ''; // Clear the list

    const feedingSchedules = JSON.parse(localStorage.getItem('feedingSchedules')) || [];
    feedingSchedules.forEach((entry, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${entry.date} at ${entry.time}`;

        // Add a delete button for manual deletion
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete-button';
        deleteButton.onclick = () => {
            feedingSchedules.splice(index, 1); // Remove the entry
            localStorage.setItem('feedingSchedules', JSON.stringify(feedingSchedules));
            loadScheduledFood(); // Reload the list
        };

        listItem.appendChild(deleteButton);
        scheduledFoodList.appendChild(listItem);
    });
}

// Check if any scheduled food matches the current time and delete expired entries
function checkScheduledFood() {
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const currentTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    let feedingSchedules = JSON.parse(localStorage.getItem('feedingSchedules')) || [];
    const updatedSchedules = feedingSchedules.filter((entry) => {
        if (entry.date === currentDate && entry.time === currentTime) {
            alert(`It's feeding time! The dispenser will open for ${entry.time}.`);

            // Wait for 1 minute before removing the entry
            setTimeout(() => {
                feedingSchedules = feedingSchedules.filter(
                    (item) => !(item.date === entry.date && item.time === entry.time)
                );
                localStorage.setItem('feedingSchedules', JSON.stringify(feedingSchedules));
                loadScheduledFood(); // Reload the list
            }, 60000); // 1 minute delay (60000 ms)

            return false; // Exclude this entry from the updated list
        }
        return true; // Keep this entry in the updated list
    });

    localStorage.setItem('feedingSchedules', JSON.stringify(updatedSchedules));
    loadScheduledFood(); // Reload the list
}

// Run the check every minute
setInterval(checkScheduledFood, 60000); // Check every 60 seconds

// Load scheduled food on page load
document.addEventListener('DOMContentLoaded', () => {
    loadScheduledFood();
});