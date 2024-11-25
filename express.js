// Importation des modules nécessaires
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path'); // Nécessaire pour manipuler les chemins

// Configuration du serveur
const app = express();
const PORT = process.env.PORT || 3000; // Utiliser PORT de l'environnement ou 3000 par défaut

// Middleware
app.use(bodyParser.json()); // Pour analyser les données JSON
app.use(cors()); // Pour permettre les requêtes cross-origin

// Servir les fichiers statiques (CSS, JS, images, etc.)
app.use(express.static(__dirname)); // Servir tous les fichiers dans le répertoire courant

// Route principale pour servir le fichier HTML
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
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
