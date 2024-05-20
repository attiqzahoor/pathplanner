let map = null;

document.getElementById('distance-form').addEventListener('submit', function (e) {
    e.preventDefault();
    calculateDistance();
});

function calculateDistance() {
    const origin = document.getElementById('origin').value;
    const destination = document.getElementById('destination').value;

    const geocodeUrl = 'https://nominatim.openstreetmap.org/search?format=json&q=';

    Promise.all([
        fetch(geocodeUrl + encodeURIComponent(origin)).then(response => response.json()),
        fetch(geocodeUrl + encodeURIComponent(destination)).then(response => response.json())
    ]).then(results => {
        console.log('Geocoding results:', results); // Log results for debugging

        const originResults = results[0];
        const destinationResults = results[1];

        if (originResults.length === 0) {
            throw new Error('Origin location not found');
        }
        if (destinationResults.length === 0) {
            throw new Error('Destination location not found');
        }

        const originCoords = [originResults[0].lat, originResults[0].lon];
        const destinationCoords = [destinationResults[0].lat, destinationResults[0].lon];

        document.getElementById('result').innerHTML = `
            <p>From: ${originResults[0].display_name}</p>
            <p>To: ${destinationResults[0].display_name}</p>
        `;

        showRoute(originCoords, destinationCoords);
    }).catch(error => {
        document.getElementById('result').innerHTML = `<p>Error: ${error.message}</p>`;
        console.error('Error:', error);
    });
}

function showRoute(originCoords, destinationCoords) {
    // Destroy the previous map instance if it exists
    if (map !== null) {
        map.off();
        map.remove();
        map = null;
    }

    // Create a new map instance
    map = L.map('map').setView(originCoords, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.Routing.control({
        waypoints: [
            L.latLng(originCoords[0], originCoords[1]),
            L.latLng(destinationCoords[0], destinationCoords[1])
        ],
        routeWhileDragging: true,
        router: L.Routing.osrmv1({
            serviceUrl: 'https://router.project-osrm.org/route/v1'
        })
    }).addTo(map);
}
//new
async function getCurrentLocation() {
  const originInput = document.getElementById('origin');
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async function(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const address = await getAddressFromCoordinates(latitude, longitude);
        originInput.value = address || `Latitude: ${latitude}, Longitude: ${longitude}`;
      },
      function(error) {
        console.error('Error getting location:', error.message);
        originInput.value = 'Error getting location';
      }
    );
  } else {
    console.error('Geolocation is not supported by this browser.');
    originInput.value = 'Geolocation not supported';
  }
}

async function getAddressFromCoordinates(latitude, longitude) {
  const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
  const data = await response.json();
  if (data && data.display_name) {
    return data.display_name;
  } else {
    return 'Address not found';
  }
}

document.getElementById('getLocationBtn').addEventListener('click', getCurrentLocation);



//btn
function scrollToInput() {
  const inputField = document.getElementById('one');
  inputField.scrollIntoView({ behavior: 'smooth' });
}
 // Get the button and map elements
const button = document.getElementById('submitBtn');
 const hello = document.getElementById('map');

 //Add a click event listener to the button
 button.addEventListener('click', function() {
    // Toggle the visibility of the map
    if (hello.style.display === 'none') {
        hello.style.display = 'block';
     } else {
        hello.style.display = 'block';
     }
 });
