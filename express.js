// Importation des modules nécessaires
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path'); // Nécessaire pour les chemins des fichiers

// Configuration du serveur
const app = express();
const PORT = process.env.PORT || 3000; // Utilisation de PORT depuis l'environnement ou 3000 par défaut

// Middleware
app.use(bodyParser.json()); // Pour analyser les données JSON
app.use(cors()); // Pour permettre les requêtes cross-origin

// Servir les fichiers statiques (CSS, JS, images, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Servir le fichier HTML principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Variables pour stocker les données des capteurs
let sensorData = {};

// Fonction pour formater les données
function formatSensorData(data) {
    return {
        temperature: `${data.temperature || 'N/A'}°C`,
        humidity: `${data.humidity || 'N/A'}%`,
        airQualityAQ1: data.airQualityAQ1 || 'N/A',
        airQualityAnalog1: `${data.airQualityAnalog1 || 'N/A'} µg/m³`,
        airQualityCO2: data.co2Level || 'N/A',
        airQualityAnalog2: `${data.airQualityAnalog2 || 'N/A'} µg/m³`
    };
}

// Endpoint pour recevoir les données des capteurs (POST)
app.post('/sensor-data', (req, res) => {
    sensorData = formatSensorData(req.body); // Formate et stocke les données
    console.log('Données reçues et formatées :', sensorData);
    res.sendStatus(200); // Réponse HTTP OK
});

// Endpoint pour renvoyer les données des capteurs (GET)
app.get('/sensor-data', (req, res) => {
    res.json(sensorData); // Envoie les données actuelles sous forme de JSON
});

// Lancement du serveur
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Serveur démarré sur http://0.0.0.0:${PORT}`);
    console.log(`Accessible via : http://localhost:${PORT}/sensor-data`);
});
