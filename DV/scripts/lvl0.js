var diameter = 1000;
var radius = diameter / 2;
var margin = 100;

// Generates a tooltip for a SVG circle element based on its ID
function addTooltip(circle) {
  var x = parseFloat(circle.attr("cx"));
  var y = parseFloat(circle.attr("cy"));
  var r = parseFloat(circle.attr("r"));
  var text = circle.attr("id") + " main genre: "+circle.attr("genre");

  var tooltip = d3.select("#plot")
    .append("text")
    .text(text)
    .attr("x", x)
    .attr("y", y)
    .attr("dy", -r * 2)
    .attr("id", "tooltip");

  var offset = tooltip.node().getBBox().width / 2;

  if ((x - offset) < -radius) {
    tooltip.attr("text-anchor", "start");
    tooltip.attr("dx", -r);
  } else if ((x + offset) > (radius)) {
    tooltip.attr("text-anchor", "end");
    tooltip.attr("dx", r);
  } else {
    tooltip.attr("text-anchor", "middle");
    tooltip.attr("dx", 0);
  }
}

// Draws an arc diagram for the provided undirected graph
function drawGraph(graph) {
  // create svg image
  var svg = d3.select("body").select("#circle")
    .append("svg")
    .attr("width", diameter)
    .attr("height", diameter);
    svg.append("rect")
    .attr("class", "background")
    .attr("width", diameter)
    .attr("height", diameter);
    //.on("click", resetLvl0);
  // create plot area within svg image
  var plot = svg.append("g")
    .attr("id", "plot")
    .attr("transform", "translate(" + radius + ", " + radius + ")");

  var nodes = graph;
  var links = [];

  nodes.forEach(function(e) {
    var edgesList = e.edges;
    edgesList.forEach(function(f){
      targetNodeName = f[0];
      targetNode = graph.filter(function(n) {
        return n.year === targetNodeName;
      })[0];
      links.push({
        source: e,
        target: targetNode,
        value: f[1]
      });
    });
  });

  // calculate node positions
  circleLayout(nodes);

  drawCurves(links);
  // draw nodes last
  // Draws nodes with tooltips

  plot.selectAll(".node")
    .data(nodes)
    .enter()
    .append("circle")
    .attr("class", "node")
    .style("opacity", 1)
    .attr("id", function(d, i) {
      return d.year;
    })
    .attr("genre", function(d, i) {
      return d.dom_genre;
    })
    .attr("cx", function(d, i) {
      return d.x;
    })
    .attr("cy", function(d, i) {
      return d.y;
    })
    .attr("r", 10)
    .style("fill", function(d, i) {
      return colors[d.dom_genre];
    })
    .on("mouseover", mouseovered)
    .on("mouseout", mouseouted)
    .on("click",clicked);

  function mouseovered(d){
    var nod = d3.select(this);
    addTooltip(nod);

    nod.attr("r", 14);
    nod.style("cursor", "pointer")

  }

  function mouseouted(d){
    var nod = d3.select(this);
    nod.attr("r", 10);
    d3.select("#tooltip").remove();

  }
  //zoom into the clicked node
  function clicked(d){
    year = d.year;
    x = d.x;
    y = d.y;
    scale = 20;
    translate = [(radius - scale * x), (radius - scale * y)];
    //center into the clicked node
    plot.transition()
      .duration(2000)
      .attr("transform", "translate(" + translate + ")scale("+ scale +")");
    //change the opacity of the link
    plot.selectAll(".link")
      .transition()
      .duration(900)
      .style("opacity", 0)
    //changed the opacity of the node
    plot.selectAll(".node")
      .transition()
      .duration(2000)
      .style("opacity", 0)
      .style("pointer-events","none")
    //remove the tooltip
    d3.select("#tooltip").remove();
    //create the next lvl
    //todo need svg parameter to draw in
    var node = document.createElement("div");
    node.id = "chart";
    document.getElementById('visualization').appendChild(node);
    document.getElementById('circle').style.zIndex = -1;
    createLvl1Graph(year);
    addHomeButton(year);
  }

  //unzoom into the whole circle
  function resetLvl0() {
    //recenter
    active = d3.select(null);
    plot.transition()
      .duration(750)
      .attr("transform", "translate(" + radius + ", " + radius + ")");
    //makes the links visible
    plot.selectAll(".link")
      .transition()
      .duration(750)
      .style("opacity", 1);
    //makes the node visible
    plot.selectAll(".node")
      .transition()
      .duration(750)
      .style("opacity", 1)
      .style("pointer-events","visible");
    document.getElementById('chart').remove();
    document.getElementById('map').remove();
  }

  //will maybe be useful for lvl2 and 3
  //https://stackoverflow.com/questions/13595175/updating-svg-element-z-index-with-d3
  d3.selection.prototype.bringElementAsTopLayer = function() {
    return this.each(function(){
      this.parentNode.appendChild(this);
    });
  };
  //d3.select(this).bringElementAsTopLayer();
  d3.selection.prototype.pushElementAsBackLayer = function() {
    return this.each(function() {
      var firstChild = this.parentNode.firstChild;
      if (firstChild) {
        this.parentNode.insertBefore(this, firstChild);
      }
    });
  }
}

// Calculates node locations
function circleLayout(nodes) {
  // use to scale node index to theta value
  var scale = d3.scale.linear()
  .domain([0, nodes.length])
  .range([-Math.PI, -3 * Math.PI]);
  // calculate theta
  nodes.forEach(function(d, i) {
    var theta = scale(i) - Math.PI/nodes.length;
    var radial = radius - margin;
    // convert to cartesian coordinates
    d.x = radial * Math.sin(theta);
    d.y = radial * Math.cos(theta);
  });
}

function drawCurves(links) {
  // https://stackoverflow.com/questions/34263110/d3-js-edge-bundling-without-hierachy

  d3.select("#plot").selectAll(".link")
    .data(links)
    .enter()
    .append("path")
    .attr("class", "link")
    .attr("source", function(d){d.source;})
    .attr("target", function(d){d.target;})
    .attr("d", function(d){
      var lineData = [
        {
          x: Math.round(d.target.x),
          y: Math.round(d.target.y)
        }, {
          x: Math.round(d.target.x) - Math.round(d.target.x)/3,
          y: Math.round(d.target.y) - Math.round(d.target.y)/3
        },
        {
          x: Math.round(d.source.x) - Math.round(d.source.x)/3,
          y: Math.round(d.source.y) - Math.round(d.source.y)/3
        },{
          x: Math.round(d.source.x),
          y: Math.round(d.source.y)
        }];
        return `M${lineData[0].x},${lineData[0].y}C${lineData[1].x},${lineData[1].y},${lineData[2].x},${lineData[2].y},${lineData[3].x},${lineData[3].y} `;
      })
      .attr("stroke", function(d){
        var val = d.value;
        r = 200-val*200/10;
        g = 200-val*200/10;
        b = 200-val*200/10;
        return "rgb("+r+","+g+","+b+")";
      })
      .attr("stroke-width", function(d){
        var val = d.value;
        return 0.20*val+"px";
      });
  }
