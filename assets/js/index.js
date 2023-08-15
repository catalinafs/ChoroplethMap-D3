// APIs Variables
let CountryUrl = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json';
let EducationUrl = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json';

// SVG Dimensions Variables
let width = 950, height = 600;

// Store the SVG Element
let svg = d3.select('svg');

// Function to add the width and height to the svg
function drawSvg() {
    svg.attr('width', width)
        .attr('height', height);
}

// Function to generate the USA Map and the Tooltip
function drawMap(CountryData, EducationData) {
    svg.selectAll('path')
        .data(CountryData)
        .enter()
        .append('path')
        .attr('d', d3.geoPath())
        .attr('class', 'county')
        .attr('fill', (countryItem) => {
            let country = EducationData.find((item) => {
                return item['fips'] === countryItem.id;
            });

            let percentage = country['bachelorsOrHigher'];

            if (percentage <= 15) {
                return '#C77DFF';
            } else if (percentage <= 25) {
                return '#9D4EDD';
            } else if (percentage <= 50) {
                return '#7B2CBF';
            } else if (percentage <= 75) {
                return '#5A189A';
            } else if (percentage <= 100) {
                return '#3C096C';
            } else {
                return '#330063';
            }
        })
        .attr('data-fips', (d) => { return d['id'] })
        .attr('data-education', (d) => {
            let country = EducationData.find((item) => {
                return item['fips'] === d.id
            });

            let percentage = country['bachelorsOrHigher'];
            return percentage
        })
        .on('mousemove', (e, d) => {
            //Creating the Tooltip
            const tooltip = d3.select('#tooltip');
            tooltip.transition().style('visibility', 'visible');

            let country = EducationData.find((item) => {
                return item['fips'] === d.id;
            });

            tooltip.text(
                country["fips"] + " - " + country['area_name'] + ',' +
                country['state'] + ':' + country['bachelorsOrHigher'] + '%'
            );

            tooltip.attr("data-education", country["bachelorsOrHigher"]);
        })
        .on('mouseout', () => {
            const tooltip = d3.select('#tooltip');

            tooltip.transition().style('visibility', 'hidden');
        });
}


// Make the request to the url
d3.json(CountryUrl).then((resCountry, error) => {
    if (error) {
        throw error;
    } else {
        // Country Data Variable
        let CountryData = topojson.feature(resCountry, resCountry.objects.counties).features;

        d3.json(EducationUrl).then((resEducation, error) => {
            if (error) {
                throw error;
            } else {
                // Educational Data Variable
                let EducationData = resEducation;

                // We call the functions and pass the data to those who need it
                drawSvg();
                drawMap(CountryData, EducationData);
            }
        });
    }
});