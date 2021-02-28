# Dutch cities: Names and Locations in WGS84 and EPSG:28992

Downloads all cities from The Netherlands from the official BAG and formats them for use.

Source: https://labs.kadaster.nl/gateway & https://labs.kadaster.nl/cases/graphql-endpoint-eng

## Data format

```javascript
{
    name: "Utrecht", // City name
    status: "woonplaatsAangewezen", // Original status
    coordinates: {
        "EPSG:28992": { // Geo data in the original 'Amersfoort' projection
            shape: "", // GeoJson containing the full outline, may be a MultiPolygon
            centroid: "", // Calculated centroid from one or multiple Polygons
            originalWkt: "" // Original WKT from the BAG Server
        },
        "WSG84": { // Geo data in the often used WSG84 projection. Use this if you want to display it on a Google Maps / Leaflet map.
            shape: WSG84GeoJson, // GeoJson containing the full outline, may be a MultiPolygon
            centroid: WSG84Centroid, // Calculated centroid from one or multiple Polygons
        }
    },
}
```