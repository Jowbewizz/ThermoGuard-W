// Gestion de la navigation
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');

navLinks.forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        const target = link.getAttribute('data-target');

        sections.forEach(section => section.classList.remove('active'));
        document.getElementById(target).classList.add('active');
    });
});

// Gestion de l'affichage des bâtiments
const buildingLinks = document.querySelectorAll('.building-link');
const buildings = document.querySelectorAll('.building');

buildingLinks.forEach(link => {
    link.addEventListener('click', () => {
        const buildingNumber = link.getAttribute('data-building');

        // Masquer tous les bâtiments
        buildings.forEach(building => building.classList.remove('active'));

        // Afficher le bâtiment sélectionné
        const selectedBuilding = document.getElementById(`building-${buildingNumber}`);
        if (selectedBuilding) {
            selectedBuilding.classList.add('active');
        }
    });
});

function toggleRooms(levelId, imageId) {
    // Obtenez les éléments de pièces et d'image par leurs identifiants
    const rooms = document.getElementById(levelId);
    const image = document.getElementById(imageId);

    // Alternez l'affichage entre "block" et "none" pour les deux éléments
    const isVisible = rooms.style.display === "block";
    rooms.style.display = isVisible ? "none" : "block";
    image.style.display = isVisible ? "none" : "block";
}



// Initialisation de la carte CesiumJS
var viewer = new Cesium.Viewer('cesiumContainer', {
    imageryProvider: new Cesium.IonImageryProvider({
        assetId: 2, // ID de l'asset (Bing Maps Aerial)
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiNzQ5NjY0Mi05OGQ1LTRmZjgtYTI1NC00ODU5MzU2OGQ5OWEiLCJpZCI6MjUxNDAzLCJpYXQiOjE3MzIzMTM3ODN9.tZEHfLGh8KOaPVBQvrfPPRrZgKp-dRn0n2qzH9X3uDc' // Remplacez par votre clé API valide
    }),
    terrainProvider: Cesium.createWorldTerrain(),
    baseLayerPicker: false // Désactive le sélecteur de couches de base
});

// Carrousel
document.addEventListener("DOMContentLoaded", function() {
    const carouselImages = document.querySelectorAll('.carousel img');
    let currentIndex = 0;

    function showNextImage() {
        // Masquer l'image actuelle
        carouselImages[currentIndex].classList.remove('active');

        // Passer à l'image suivante
        currentIndex = (currentIndex + 1) % carouselImages.length;

        // Afficher la nouvelle image
        carouselImages[currentIndex].classList.add('active');
    }

    // Démarrage du défilement automatique toutes les 4 secondes
    setInterval(showNextImage, 4000);
});


// Fonction pour récupérer les données du serveur et mettre à jour le site
function fetchSensorData() {
    const url = "http://192.168.137.1:3000/sensor-data"; // Remplacez par l'adresse de votre serveur

    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Mettez à jour les informations dans la pièce 101
            document.querySelector('#room-101 .temperature').textContent = `${data.temperature || 'N/A'}`;
            document.querySelector('#room-101 .humidity').textContent = `${data.humidity || 'N/A'}`;
            document.querySelector('#room-101 .airQuality').textContent = `${data.airQualityAQ1 || 'N/A'}`;
            document.querySelector('#room-101 .co2').textContent = `${data.airQualityCO2 || 'N/A'}`;
            document.querySelector('#room-101 .dust').textContent = `${data.airQualityAnalog2 || 'N/A'}`;

            // Optionnel : changez le style en fonction des données
            const roomElement = document.getElementById('room-101');
            if (data.temperature > 30) {
                roomElement.style.backgroundColor = '#ff6961'; // Rouge pour une température élevée
            } else {
                roomElement.style.backgroundColor = '#77dd77'; // Vert pour une température normale
            }
        })
        .catch(error => {
            console.error("Erreur lors de la récupération des données du serveur :", error);
        });
}

// Appeler la fonction régulièrement (toutes les 5 secondes, par exemple)
setInterval(fetchSensorData, 5000);
fetchSensorData(); // Appel initial