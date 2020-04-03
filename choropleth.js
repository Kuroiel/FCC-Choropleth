d3.select("#everything").attr("align", "center");
let width = d3.select("svg").attr("width");
let height = d3.select("svg").attr("height");

let projection = d3.geoAlbersUsa().translate([500, 300]);
let path = d3.geoPath();

//loading multiple files using Promise.all from answer at https://stackoverflow.com/questions/49534470/d3-js-v5-promise-all-replaced-d3-queue

let lonks = [
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json",
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json"
];
Promise.all(lonks.map((url) => d3.json(url))).then(function (data) {
  let colors = ["red", "#b3ecff", "#ffccff", "green"];

  console.log(data);

  let countyFromTopo = [];
  for (var j = 0; j < data[1].objects.counties.geometries.length; j++) {
    countyFromTopo.push(data[1].objects.counties.geometries[j].id);
  }

  console.log(countyFromTopo);

  let sortedData = [];
  for (var v = 0; v < countyFromTopo.length; v++) {
    for (var u = 0; u < data[0].length; u++) {
      if (data[0][u].fips == countyFromTopo[v]) {
        sortedData.push(data[0][u]);
      }
    }
  }

  console.log(sortedData);

  d3.select("svg")
    .append("g")
    .attr("class", "counties")
    .selectAll("path")
    .data(topojson.feature(data[1], data[1].objects.counties).features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("class", "county")
    .attr("data-fips", function (d, i) {
      return sortedData[i].fips;
    })
    .attr("data-education", function (d, i) {
      return sortedData[i].bachelorsOrHigher;
    })
    .style("fill", function (d, i) {
      if (sortedData[i].bachelorsOrHigher <= 10) {
        return "red";
      } else if (
        sortedData[i].bachelorsOrHigher > 10 &&
        sortedData[i].bachelorsOrHigher <= 20
      ) {
        return "#b3ecff";
      } else if (
        sortedData[i].bachelorsOrHigher > 20 &&
        sortedData[i].bachelorsOrHigher <= 30
      ) {
        return "#ffccff";
      } else if (sortedData[i].bachelorsOrHigher > 30) {
        return "green";
      }
    })
    .on("mouseover", function (d, i) {
      d3.select("#tooltip")
        .style("opacity", 0.8)
        .attr("data-education", sortedData[i].bachelorsOrHigher)
        .html(
          "County: " +
            sortedData[i].area_name +
            "<br>" +
            "Rate: " +
            sortedData[i].bachelorsOrHigher +
            "%"
        );
    })
    .on("mouseout", function (d, i) {
      d3.select("#tooltip").style("opacity", 0);
    });

  d3.select("body")
    .append("svg")
    .attr("id", "legend")
    .attr("width", 500)
    .attr("height", 100);

  d3.select("#legend")
    .selectAll("rect")
    .data(colors)
    .enter()
    .append("rect")
    .attr("x", function (d, i) {
      return 60 * i;
    })
    .attr("y", function (d, i) {
      return 0;
    })
    .attr("height", 25)
    .attr("width", 60)
    .style("fill", function (d, i) {
      return colors[i];
    });
});
