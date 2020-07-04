var myData = "year,intelligence,neuron,knowledge,learning\n\
1959,,,,3\n\
1964,,,,\n\
1965,,,,\n\
1967,,,,\n\
1971,8,,,\n\
1973,7,,,\n\
1974,7,,,7\n\
1975,13,6,12,13\n\
1976,13,,2,4\n\
1977,18,,31,12\n\
1978,9,,10,3\n\
1979,3,,,\n\
1980,15,,30,4\n\
1981,9,,18,8\n\
1982,15,,26,17\n\
1983,34,,68,35\n\
1984,47,,75,10\n\
1985,63,,128,45\n\
1986,85,4,195,53\n\
1987,74,6,200,102\n\
1988,91,58,295,164\n\
1989,120,88,291,146\n\
1990,98,124,303,199\n\
1991,116,173,341,234\n\
1992,134,130,365,269\n\
1993,127,269,371,376\n\
1994,105,223,274,404\n\
1995,146,309,314,486\n\
1996,137,212,325,488\n\
1997,174,326,321,473\n\
1998,227,212,373,548\n\
1999,249,313,464,622\n\
2000,246,268,462,590\n\
2001,224,391,485,738\n";
//2002,160,194,293,503\n";

    var margin = {
        top: 20,
        right: 80,
        bottom: 30,
        left: 50
      },
      width = 900 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    var parseDate = d3.time.format("%Y").parse;

    var x = d3.time.scale()
      .range([0, width]);

    var y = d3.scale.linear()
      .range([height, 0]);

    var color = d3.scale.category10();

    var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

    var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

    var line = d3.svg.line()
      //.interpolate("basis")
      .defined(d => !isNaN(d.temperature))
      .x(function(d) {
        return x(d.year);
      })
      .y(function(d) {
        return y(d.temperature);
      });

    var svg = d3.select("#ai_keywords").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var data = d3.csv.parse(myData);

    color.domain(d3.keys(data[0]).filter(function(key) {
      return key !== "year";
    }));

    data.forEach(function(d) {
      d.year = parseDate(d.year);
    });

    var cities = color.domain().map(function(name) {
      return {
        name: name,
        values: data.map(function(d) {
          return {
            year: d.year,
            temperature: +d[name]
          };
        })
      };
    });

    x.domain(d3.extent(data, function(d) {
      return d.year;
    }));
 //   y.domain([0.6, 1.5]);


    y.domain([
/*      d3.min(cities, function(c) {
        return d3.min(c.values, function(v) {
          return v.temperature;
        });
      }),*/
      0,
      d3.max(cities, function(c) {
        return d3.max(c.values, function(v) {
          return v.temperature;
        });
      })
    ]);

    var legend = svg.selectAll('g')
      .data(cities)
      .enter()
      .append('g')
      .attr('class', 'legend');

    legend.append('rect')
      .attr('x', width - 2)
      .attr('y', function(d, i) {
        return i * 20;
      })
      .attr('width', 10)
      .attr('height', 10)
      .style('fill', function(d) {
        return color(d.name);
      });

    legend.append('text')
      .attr('x', width + 10)
      .attr('y', function(d, i) {
        return (i * 20) + 9;
      })
      .text(function(d) {
        return d.name;
      });

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Journal and Conference Article Number");

    var city = svg.selectAll(".city")
      .data(cities)
      .enter().append("g")
      .attr("class", "city");

    city.append("path")
      .attr("class", "line")
      .attr("d", function(d) {
        return line(d.values);
      })
      .style("stroke-width", "3px")
      .style("stroke", function(d) {
        return color(d.name);
      })
      .on("mouseover", function () {
      d3.select(this).style("stroke-width", 6);
      //tooltip.text("Roger Federer")
      //.style("left", (d3.event.pageX) + "px")     
      //.style("top", (d3.event.pageY - 28) + "px");  
      //return tooltip.style("visibility", "visible")
      })
      .on("mouseout", function () {
      d3.select(this).style("stroke-width", 3);
      return tooltip.style("visibility", "hidden");
      });
/*
    city.append("text")
      .datum(function(d) {
        return {
          name: d.name,
          value: d.values[d.values.length - 1]
        };
      })
      .attr("transform", function(d) {
        return "translate(" + x(d.value.year) + "," + y(d.value.temperature) + ")";
      })
      .attr("x", 3)
      .attr("dy", ".35em")
      .text(function(d) {
        return d.name;
      });
*/
    var mouseG = svg.append("g")
      .attr("class", "mouse-over-effects");

    mouseG.append("path") // this is the black vertical line to follow mouse
      .attr("class", "mouse-line")
      .style("stroke", "black")
      .style("stroke-width", "1px")
      .style("opacity", "0");
      
    var lines = document.getElementsByClassName('line');

    var mousePerLine = mouseG.selectAll('.mouse-per-line')
      .data(cities)
      .enter()
      .append("g")
      .attr("class", "mouse-per-line");

    mousePerLine.append("circle")
      .attr("r", 7)
      .style("stroke", function(d) {
        return color(d.name);
      })
      .style("fill", "none")
      .style("stroke-width", "1px")
      .style("opacity", "0");

    mousePerLine.append("text")
      .attr("transform", "translate(10,3)");

    mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
      .attr('width', width) // can't catch mouse events on a g element
      .attr('height', height)
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .on('mouseout', function() { // on mouse out hide line, circles and text
        d3.select(".mouse-line")
          .style("opacity", "0");
        d3.selectAll(".mouse-per-line circle")
          .style("opacity", "0");
        d3.selectAll(".mouse-per-line text")
          .style("opacity", "0");
      })
      .on('mouseover', function() { // on mouse in show line, circles and text
        d3.select(".mouse-line")
          .style("opacity", "1");
        d3.selectAll(".mouse-per-line circle")
          .style("opacity", "1");
        d3.selectAll(".mouse-per-line text")
          .style("opacity", "1");
      })
      .on('mousemove', function() { // mouse moving over canvas
        var mouse = d3.mouse(this);
        d3.select(".mouse-line")
          .attr("d", function() {
            var d = "M" + mouse[0] + "," + height;
            d += " " + mouse[0] + "," + 0;
            return d;
          });

        d3.selectAll(".mouse-per-line")
          .attr("transform", function(d, i) {
            console.log(width/mouse[0])
            var xDate = x.invert(mouse[0]),
                bisect = d3.bisector(function(d) { return d.year; }).right;
                idx = bisect(d.values, xDate);
                yr = 1959 + idx;
                ratio = isNaN(d.values[idx].temperature) ? "data missing" : d.values[idx].temperature.toFixed(0);
            
            var beginning = 0,
                end = lines[i].getTotalLength(),
                target = null;

            while (true){
              target = Math.floor((beginning + end) / 2);
              pos = lines[i].getPointAtLength(target);
              if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                  break;
              }
              if (pos.x > mouse[0])      end = target;
              else if (pos.x < mouse[0]) beginning = target;
              else break; //position found
            }
            
            d3.select(this).select('text')
              //.text(y.invert(pos.y).toFixed(2));
              .text(d.name + ": " + ratio);
              
            return "translate(" + mouse[0] + "," + pos.y +")";
          });
      });