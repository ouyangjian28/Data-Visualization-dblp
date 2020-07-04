function a(){ 
    var margin = {top: 10, right: 30, bottom: 20, left: 50},
        width = 1024 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#year_cat_stack")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Parse the Data
    d3.csv("../data/year_categoy_stack.csv", function(data) {

        // List of subgroups = header of the csv files = soil condition here
        var subgroups = data.columns.slice(1)

        console.log(data)

        // List of groups = species here = value of the first column called group -> I show them on the X axis
        var groups = d3.map(data, function(d){return(d.date)}).keys()

        // Add X axis
        var x = d3.scaleBand()
            .domain(groups)
            .range([0, width])
            .padding([0.2])
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).tickSize(0));

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([0, 120000])
            .range([ height, 0 ]);
        svg.append("g")
            .call(d3.axisLeft(y));

        // Another scale for subgroup position?
        var xSubgroup = d3.scaleBand()
            .domain(subgroups)
            .range([0, x.bandwidth()])
            .padding([0.05])

        // color palette = one color per subgroup
        var colors = ['#e41a1c','#377eb8','#4daf4a','#ac4aaf','#010203'];
        var color = d3.scaleOrdinal()
            .domain(subgroups)
            .range(['#e41a1c','#377eb8','#4daf4a','#ac4aaf','#010203'])

        // Show the bars
        svg.append("g")
            .selectAll("g")
            // Enter in data = loop group per group
            .data(data)
            .enter()
            .append("g")
            .attr("transform", function(d) { return "translate(" + x(d.date) + ",0)"; })
            .selectAll("rect")
            .data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
            .enter().append("rect")
            .attr("x", function(d) { return xSubgroup(d.key); })
            .attr("y", function(d) { return y(d.value); })
            .attr("width", xSubgroup.bandwidth())
            .attr("height", function(d) { return height - y(d.value); })
            .attr("fill", function(d) { return color(d.key); });


        svg.append("text")
            .attr("x", (width / 2))             
            .attr("y", 50 - (margin.top / 2))
            .attr("text-anchor", "middle")  
            .style("font-size", "16px") 
            .style("text-decoration", "underline")  
            .text("Publication by categories over the Year");

        var legend = svg.selectAll(".legend")
            .data(colors)
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(30," + i * 19 + ")"; });
           
          legend.append("rect")
            .attr("x", width - 18)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", function(d, i) {return colors.slice().reverse()[i];});
           
          legend.append("text")
            .attr("x", width + 5)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "start")
            .style("color", "black")
            .text(function(d, i) { 
              switch (i) {
                case 0: return "in proceeding";
                case 1: return "4 Authors";
                case 2: return "3 Authors";
                case 3: return "2 Authors";
                case 4: return "1 Author";
              }
            });

    })
};
a();