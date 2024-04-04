// Initialisation de la carte Leaflet
var map = L.map('map').setView([46.2010962412042, 6.147106702889864], 13);
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '© CARTO'
}).addTo(map);

// Données des marqueurs avec des icônes personnalisées
var waypoints = [
    { name: "La fontaine de l'Escalade", coordinates: [46.20374005005952, 6.14376619916994], iconUrl: 'https://cdn-icons-png.flaticon.com/512/2983/2983535.png' },
    { name: "Le Musée Tatiana Zoubov", coordinates: [46.20169750116412, 6.1445213669340175], iconUrl: 'https://cdn-icons-png.flaticon.com/512/3936/3936764.png' },
    { name: "Le Monument international de la Réformation", coordinates: [46.20021323907556, 6.145877866790115], iconUrl: 'https://cdn-icons-png.flaticon.com/128/5985/5985359.png' },
    { name: "Hôtel de Ville", coordinates: [46.20082826849649, 6.14685899892906], iconUrl: 'https://cdn-icons-png.flaticon.com/512/4797/4797110.png' },
    { name: "L'Ancien Arsenal", coordinates: [46.20118262528934, 6.1470305989292005], iconUrl: 'https://cdn-icons-png.flaticon.com/512/2144/2144733.png' },
    { name: "La Maison Tavel", coordinates: [46.201439880626424, 6.14730078708044], iconUrl: 'https://cdn-icons-png.flaticon.com/512/3936/3936764.png' },
    { name: "La Place du Bourg-de-Four", coordinates: [46.20009574069345, 6.1490588877031715], iconUrl: 'https://cdn4.iconfinder.com/data/icons/new-normal-1/512/public-place-park-bench-tree-512.png' },
    { name: "Le Musée international de la Réforme", coordinates: [46.20142631586874, 6.148557910985599], iconUrl: 'https://cdn-icons-png.flaticon.com/512/3936/3936764.png' },
    { name: "La Cathédrale Saint-Pierre", coordinates: [46.20123740229765, 6.1482750374787365], iconUrl: 'https://cdn-icons-png.flaticon.com/512/4313/4313544.png' },
    { name: "Le site archéologique de la Cathédrale Saint-Pierre", coordinates: [46.201085840345335, 6.147888138975222], iconUrl: 'https://cdn-icons-png.flaticon.com/512/3936/3936764.png' },
    { name: "Auditoire de Calvin", coordinates: [46.20085503585228, 6.148318004371298], iconUrl: 'https://static.thenounproject.com/png/967962-200.png' },
    { name: "Le Collège Calvin", coordinates: [46.2008686039396, 6.151007748107211], iconUrl: 'https://cdn-icons-png.freepik.com/512/4729/4729436.png' },
    { name: "Eglise Evangélique luthérienne de Genève", coordinates: [46.20097696309722, 6.149556623691599], iconUrl: 'https://banner2.cleanpng.com/20210418/ffk/transparent-church-icon-in-the-village-icon-607cc66ca32ad1.3241317816187899966683.jpg' },
    { name: "La Tour du Molard", coordinates: [46.20387914429126, 6.148108876482555], iconUrl: 'https://cdn-icons-png.flaticon.com/256/993/993612.png' },
];

// Fonction pour dessiner l'itinéraire pédestre
function drawPedestrianRoute(waypoints) {
    for (var i = 0; i < waypoints.length - 1; i++) {
        var startPoint = waypoints[i].coordinates;
        var endPoint = waypoints[i + 1].coordinates;

        // Appel à l'API Directions de Mapbox pour obtenir les instructions d'itinéraire
        var url = 'https://api.mapbox.com/directions/v5/mapbox/walking/' + startPoint[1] + ',' + startPoint[0] + ';' + endPoint[1] + ',' + endPoint[0] + '?steps=true&geometries=geojson&access_token=pk.eyJ1Ijoiam9zZXBoZ2VvdmlzdSIsImEiOiJjbHA5aTQ2bXEydW56MmtzNHB6bnBsNmNpIn0.YO4qrc53oPF9vaWFDLP91Q';
        fetch(url)
            .then(response => response.json())
            .then(data => {
                var route = L.geoJSON(data.routes[0].geometry, { color: 'blue' }).addTo(map);
                map.fitBounds(route.getBounds());
            })
            .catch(error => console.error('Error:', error));
    }
}

// Fonction pour ajouter des marqueurs avec des icônes personnalisées
function addMarkers(waypoints) {
    waypoints.forEach(function(waypoint) {
        var icon = L.icon({ iconUrl: waypoint.iconUrl, iconSize: [32, 32] });
        var marker = L.marker(waypoint.coordinates, { icon: icon }).addTo(map).bindPopup(waypoint.name);
       
        // Gestionnaire d'événements pour ouvrir le puzzle dans un nouvel onglet
        if (waypoint.name === "La Tour du Molard") {
            marker.on('click', function() {
                // Ouvrir la page du puzzle dans un nouvel onglet
                window.open('Sortie_puzzle.html', '_blank');
            });
        }
    });
}

// Dessiner l'itinéraire pédestre
drawPedestrianRoute(waypoints);

// Ajouter des marqueurs
addMarkers(waypoints);












