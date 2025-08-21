// Run the code only after the page has fully loaded
document.addEventListener("DOMContentLoaded", function () {

  // Get the form and list elements from the page
  let plantForm = document.getElementById("plantForm");
  let plantList = document.getElementById("plantList");
  let wateringSound = document.getElementById("wateringSound");

  // the form submission
  plantForm.addEventListener("submit", function (event) {
    event.preventDefault(); 

    // Get values entered by the user
    let name = document.getElementById("plantName").value.trim();
    let interval = parseInt(document.getElementById("wateringInterval").value);
    let sunlight = document.getElementById("sunlightRequirement").value;

    // If any field is empty, stop here
    if (!name || !interval || !sunlight) {
      return;
    }

    // Create the date for next watering
    let nextWatering = new Date();
    nextWatering.setDate(nextWatering.getDate() + interval);

    // Create a plant object with details
    let plant = {
      name: name,
      interval: interval,
      sunlight: sunlight,
      nextWatering: nextWatering
    };

    // Show the plant in the list
    renderPlant(plant);

    // Clear the form inputs
    plantForm.reset();
  });

  // Function to display a plant on the page
  function renderPlant(plant) {
    // Create a new list item (li)
    let li = document.createElement("li");

    // Calculate how many days left to water the plant
    let daysLeft = calculateDaysLeft(plant.nextWatering);

    // Set the inner HTML for the plant
    li.innerHTML = `
      <div class="plant-info">
        <h3>${plant.name}</h3>
        <p>💧 Water in <strong>${daysLeft}</strong> day(s) &nbsp; | &nbsp; ☀️ Sunlight: <strong>${plant.sunlight}</strong></p>
      </div>
      <div class="button-group">
        <button class="water-btn">Watered</button>
        <button class="remove-btn">Remove</button>
      </div>
    `;

    // When "Watered" button is clicked
    let waterButton = li.querySelector(".water-btn");
    waterButton.addEventListener("click", function () {
      wateringSound.play(); // Play water sound

      // Set new watering date
      plant.nextWatering = new Date();
      plant.nextWatering.setDate(plant.nextWatering.getDate() + plant.interval);

      // Update the display
      let newDaysLeft = calculateDaysLeft(plant.nextWatering);
      li.querySelector("p").innerHTML = ` Water in <strong>${newDaysLeft}</strong> day(s) &nbsp; | &nbsp;  Sunlight: <strong>${plant.sunlight}</strong>`;
    });

    // When "Remove" button is clicked
    let removeButton = li.querySelector(".remove-btn");
    removeButton.addEventListener("click", function () {
      // Stop and reset the watering sound
      wateringSound.pause();
      wateringSound.currentTime = 0;

      // Remove the plant from the list
      plantList.removeChild(li);
    });

    // Add the plant to the list
    plantList.appendChild(li);
  }

  //refer javaScript blogPost on Google for calculating days
  // Function to calculate days until the next watering
  function calculateDaysLeft(nextDate) {
    let now = new Date(); // Current date and time
    let timeDifference = new Date(nextDate) - now; // Time between now and next watering
    let days = Math.ceil(timeDifference / (1000 * 60 * 60 * 24)); // Convert to days
    return Math.max(0, days); // Return 0 if date is past
  }
});
