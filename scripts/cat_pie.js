var newData = [{
    count: 111608,
    emote: "article"
}, {
    count: 1008,
    emote: "incollection"
}, {
    count: 212272,
    emote: "inproceeding"
}, {
    count: 3006,
    emote: "proceedings"
},{
    count: 919,
    emote: "book_matser_phd"
},

]

// Define size & radius of donut pie chart
var width = 460,
    height = 800,
    radius = Math.min(width, height) / 2.5;

// Define arc colours
var colour = d3v3.scale.category20();

// Define arc ranges
var arcText = d3v3.scale.ordinal()
    .rangeRoundBands([0, width], .1, .3);

// Determine size of arcs
var arc = d3v3.svg.arc()
    .innerRadius(radius - 130)
    .outerRadius(radius - 10);

// Create the donut pie chart layout
var pie = d3v3.layout.pie()
    .value(function(d) {
        return d.count;
    })
    .sort(null);

// Append SVG attributes and append g to the SVG
var mySvg = d3v3.select('#cat_pie').append("svg")
    .attr("width", width)
    .attr("height", height);

var svg = mySvg
    .append("g")
    .attr("transform", "translate(" + radius + "," + radius + ")");

var svgText = mySvg
    .append("g")
    .attr("transform", "translate(" + radius + "," + radius + ")");

// Define inner circle
svg.append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", 100)
    .attr("fill", "#fff");

// Calculate SVG paths and fill in the colours
var g = svg.selectAll(".arc")
    .data(pie(newData))
    .enter().append("g")
    .attr("class", "arc");

// Append the path to each g
g.append("path")
    .attr("d", arc)
    //.attr("data-legend", function(d, i){ return parseInt(newData[i].count) + ' ' + newData[i].emote; })
    .attr("fill", function(d, i) {
        return colour(i);
    });

var textG = svg.selectAll(".labels")
    .data(pie(newData))
    .enter().append("g")
    .attr("class", "labels");

// Append text labels to each arc
// textG.append("text")
//     .attr("transform", function(d) {
//         return "translate(" + arc.centroid(d) + ")";
//     })
//     .attr("dy", ".35em")
//     .style("text-anchor", "middle")
//     .attr("fill", "#fff")
//     .text(function(d, i) {
//         return d.data.count > 0 ? d.data.emote : '';
//     });

var legendG = mySvg.selectAll(".legend")
    .data(pie(newData))
    .enter().append("g")
    .attr("transform", function(d,i){
        return "translate(" + (width - 120) + "," + (i * 15 + 20) + ")";
    })
    .attr("class", "legend");

legendG.append("rect")
    .attr("width", 10)
    .attr("height", 10)
    .attr("fill", function(d, i) {
        return colour(i);
    });

legendG.append("text")
    .text(function(d){
        return  d.data.emote+":"+d.value ;
    })
    .style("font-size", 9)
    .attr("y", 10)
    .attr("x", 11);
