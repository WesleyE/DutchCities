// Download all cities
const { request, gql } = require('graphql-request');
const fs = require('fs');


// first: 50
const query = gql`
{
    bag2woonplaats(first:999999999) {
        eindgeldigheid,
        woonplaatsnaam,
        woonplaatsstatus,
        geometrie
    }
}
`

request('https://labs.kadaster.nl/gateway/graphql', query).then((data) => {
    console.log('Done downloading cities.');

    // We are downloading everything, so we need to filter on 'eindgeldigheid' to only get the most recent results
    let cities = data.bag2woonplaats.filter(city => city.eindgeldigheid == null);

    fs.writeFile('data.json', JSON.stringify(cities), function (err) {
        if (err) {
            console.log(`Could not safe file:${err}`);
            return;
        }
        console.log(`Wrote ${cities.length} dutch cities.`);
    });
});