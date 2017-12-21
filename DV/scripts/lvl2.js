  function createLvl2Graph(groupYear, groupGenre) {
    d3.json("../data/lvl2.json", function (error, data) {
      data = data.filter(function(d) {return d.year === groupYear && d.genre === groupGenre; });

      var circle_size = Math.min(20/data.length*25,30);

      //seting size and position
      var margin = {
        top: -5,
        right: -5,
        bottom: -5,
        left: -5
      };

      var width = window.innerWidth*0.7 - margin.left - margin.right,
      height = 1000 - margin.top - margin.bottom;

      //background color is genre
      document.getElementById('viz_container').style.background= colors[groupGenre];

      //force
      var force = d3.layout.force()
        .charge(-800)
        .linkDistance(400)
        .size([width, height]);

      //drag
      var drag = d3.behavior.drag().
      origin(function(d) {
        return d;
      })
        .on("dragstart", dragstarted)
        .on("drag", dragged)
        .on("dragend", dragended);

      //main call
      var svg = d3.select("#map").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        //.attr("transform", "translate(" + margin.left + "," + margin.right + ")");

      //create tip for elements
      var tip = d3.tip()
        .attr('class', 'd3-tip')
        .direction("e")
        .offset([0, circle_size/2])
        .html(function(d) {
          //iterate over all the array elements
          var myString = "<p><strong>Songs played:</strong></p><span style='color:lightgray'>";
          var i = 0;
          while(i<d.tracklist.length){
             myString = myString + ("<p>" + d.tracklist[i] + "</p>");
             i++;
          }
          return myString+"</span>";
        })
      svg.call(tip);

      //force
      force.nodes(data).start();

      //create node in function of data
      var container = svg.append("g");
      var node = container.append("g")
        .attr("class", "nodes")
        .selectAll(".node")
        .data(data)
        .enter().append("g")
        .attr("class", "node")
        .call(drag);

      //represent node by circle
      node.append("circle")
        .attr("r",  circle_size)
        .attr("class", "logo")
        .style("fill", "transparent")
        .style("stroke", "black")
        .style("stroke-width", 1.2);

      //add images
      node.append("clipPath")
        .attr('id', function(d, i) {
          return "clip" + i
        })
        .append("circle")
        .attr("class", "clip-path")
        .attr("r", circle_size);

      node.append("svg:image")
        .attr("class", "circle")
        .attr("xlink:href", d => "http://www.vector-logo.net/logo_preview/eps/m/Montreux_Jazz_Festival.png")
        .attr("clip-path", function(d, i) {
          return "url(#clip" + i + ")"
        })
        .attr("x", -circle_size)
        .attr("y", -circle_size)
        .attr("width", circle_size*2)
        .attr("height", circle_size*2);

      //text over the nodes
      node.append("text")
        .attr("x", 0)
        .attr("y", -(circle_size+2))
        .style("opacity", 1)
        .style("fill", "#000000")
        .style("stroke", "#ffffff")
        .style("stroke-width", "0.1px")
        .style("font-size","12pt")
        .style("font-weight", "900")
        .html(function(d) {
          return d.name
        });

      //force
      force.on("tick", function() {
        node.attr("transform", function(d) {
          return "translate(" + d.x + "," + d.y + ")";
        });
      });

      //activate tip over nodes
      node.on('mouseover', tip.show)
        .on('mouseout', tip.hide);

      //zoom
      function zoomed() {
        container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
      }

      //dragging
      function dragstarted(d) {
        tip.hide();
        d3.event.sourceEvent.stopPropagation();
        d3.select(this).classed("dragging", true);
        force.start();
      }

      function dragged(d) {
        tip.hide();
        d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
      }

      function dragended(d) {
        d3.select(this).classed("dragging", false);
      }
  });

  //document.getElementById('chart').style.opacity = 0;
  document.getElementById('map').style.opacity = 1;
}
