
const fs = require('fs');
const turf = require('@turf/turf');
const Wkt = require('wicket');
const reproject = require('reproject');
const proj4 = require('proj4');
const cliProgress = require('cli-progress');

// Setup Amersfoort projection
let projDef = 'EPSG:28992","+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +towgs84=565.417,50.3319,465.552,-0.398957,0.343988,-1.8774,4.0725 +units=m +no_defs';
proj4.defs("EPSG:28992","+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +towgs84=565.417,50.3319,465.552,-0.398957,0.343988,-1.8774,4.0725 +units=m +no_defs");

// Let's add some more usefull data
let cities = require('./data.json');

const progressBar = new cliProgress.SingleBar({
    format: '[{bar}] {percentage}% | ETA: {eta}s | {value}/{total} | Processed {city}'
}, cliProgress.Presets.rect);
progressBar.start(cities.length, 0);

// Add the centroid of each city
cities = cities.map((city) => {
    // We need to remove the projection url at the start of the WKT in order to load it.
    let geo = city.geometrie.replace(/<(.*)> /, '');

    // Wkt to GeoJson
    let wkt = new Wkt.Wkt();
    wkt.read(geo);
    let geoJson = wkt.toJson();

    // Reproject to WSG84 to use on Google Maps & others
    let WSG84GeoJson = reproject.reproject(geoJson, "EPSG:28992", proj4.WGS84);

    // Calculate centroides (takes MultiPolygons into account)
    let originalCentroid = turf.centroid(geoJson);
    let WSG84Centroid = turf.centroid(WSG84GeoJson);

    progressBar.increment(1, {city: city.woonplaatsnaam});
    
    return {
        name: city.woonplaatsnaam,
        status: city.woonplaatsstatus,
        coordinates: {
            "EPSG:28992": {
                shape: geoJson,
                centroid: originalCentroid,
                originalWkt: city.geometrie
            },
            "WSG84": {
                shape: WSG84GeoJson,
                centroid: WSG84Centroid,
            }
        },
    };
});

progressBar.stop();

console.log('Processing complete, writing file...');

// Safe to file
fs.writeFile('refined_data.json', JSON.stringify(cities), function (err) {
    if (err) {
        console.log(`Could not safe file:${err}`);
        return;
    }
    console.log('Wrote refined_data.json');
    console.log('Complete');
});