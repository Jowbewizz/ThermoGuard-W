// Gestion de la navigation
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');
let mapInitialized = false; // Variable pour suivre l'état de la carte

navLinks.forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        const target = link.getAttribute('data-target');

        sections.forEach(section => section.classList.remove('active'));
        const activeSection = document.getElementById(target);
        activeSection.classList.add('active');

        // Initialiser la carte si la section "map" est activée
        if (target === 'map' && !mapInitialized) {
            initializeMap();
            mapInitialized = true;
        }
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

// Fonction pour initialiser la carte Mapbox
function initializeMap() {
    mapboxgl.accessToken = 'pk.eyJ1Ijoic2lyd2l6eiIsImEiOiJjbTQwdHM4c3UxcnR2Mmtwc3VxaWtpY2JuIn0.iyfUL1dmQM1qDL_XkvtKog'; // Remplacez par votre clé API Mapbox
    const map = new mapboxgl.Map({
        container: 'map-container', // ID du conteneur de la carte
        style: 'mapbox://styles/mapbox/streets-v11', // Style de la carte
        center: [-75.6972, 45.4215], // Coordonnées [Longitude, Latitude] (Ottawa)
        zoom: 11 // Niveau de zoom initial
    });

    // Ajouter contrôle de navigation
    map.addControl(new mapboxgl.NavigationControl());

    // Liste des bâtiments avec leurs coordonnées et informations
    const buildings = [
        { lng: -75.734530, lat: 45.476545, info: "Bâtiment 1 : 70 Rue Crémazie, Gatineau QC" },
        { lng: -75.699871, lat: 45.423707, info: "Bâtiment 2 : 110 Laurier Ave. W, Ottawa ON" },
        { lng: -75.638840, lat: 45.416877, info: "Bâtiment 3 : 395 Terminal Avenue – Ottawa train yard" },
        { lng: -75.697450, lat: 45.420307, info: "Bâtiment 4 : 100 Metcalfe Street, Ottawa ON" },
        { lng: -75.712297, lat: 45.404850, info: "Bâtiment 5 : 360 Lebreton Street S, Ottawa ON" },
        { lng: -75.708830, lat: 45.408535, info: "Bâtiment 6 : 580 Booth Street, Ottawa ON" },
        { lng: -75.663613, lat: 45.429153, info: "Bâtiment 7 : 1625 Vanier Parkway, Ottawa ON" },
        { lng: -75.609805, lat: 45.432340, info: "Bâtiment 8 : 1629 Ogilvie Road, Ottawa ON" },
        { lng: -75.688110, lat: 45.429800, info: "Bâtiment 9 : 350 King Edward Avenue, Ottawa ON" }
    ];

    // Ajouter des marqueurs pour chaque bâtiment
    buildings.forEach(building => {
        new mapboxgl.Marker()
            .setLngLat([building.lng, building.lat])
            .setPopup(new mapboxgl.Popup().setHTML(`<b>${building.info}</b>`)) // Ajouter une popup avec des informations sur le bâtiment
            .addTo(map);
    });
}

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
