function createLvl1Graph(genreYear) {
  var cur_year = genreYear;
  var data;

  d3.json("../data/lvl1.json", function (error, f) {
    var temp = f.filter(function(d) {return d.year === cur_year; });
    data = temp[0].count;

    var text = "";

    var width = 400;
    var height = 400;
    var thickness = 40;
    var duration = 750;

    var radius = Math.min(width, height) / 2;

    function clickedLvl1(d){
      groupGenre = d.data.genre;
      scale = 20;
      //center into the clicked node
      g.transition()
        .duration(2000);
      //change the opacity of the link
      path.transition()
        .duration(900)
      //create the next lvl
      //setTimeout(document.getElementById('chart').remove(), 2100);
      //change the opacity of the link
      var node2 = document.createElement("div");
      node2.id = "map";
      document.getElementById('visualization').appendChild(node2);
      createLvl2Graph(cur_year, groupGenre);
      document.getElementById('chart').style.zIndex = -1;
      document.getElementById('chart').style.opacity = 0;
      addYearButton(groupGenre);
    }

    function resetLvl1() {
      active = d3.select(null);
       svg.transition()
        .delay(1000)
        .duration(1500)
        .attr("opacity", "1");
    }

    var svg = d3.select("#chart")
    .append('svg')
    .attr('class', 'pie')
    .attr('width', width+100)
    .attr('height', height+100)
    .attr("opacity", "0");

    var g = svg.append('g')
    .attr('transform', 'translate(' + ((width+50)/2) + ',' + ((height+50)/2) + ')');

    var arc = d3.svg.arc()
    .innerRadius(radius - thickness)
    .outerRadius(radius);

    var pie = d3.layout.pie()
    .value(function(d) {return d.percentage; })
    .sort(null);

    var path = g.selectAll('path')
    .data(pie(data))
    .enter()
    .append("g")
    .on("click",function(d) {clickedLvl1(d)})
    .on("mouseover", function(d) {
          let g = d3.select(this)
            .style("cursor", "pointer")
            .style("fill", "black")
            .append("g")
            .attr("class", "text-group");

          g.append("text")
            .attr("class", "name-text")
            .text(`${d.data.genre}`)
            .attr('text-anchor', 'middle')
            .attr('dy', '-0.7em')
            .style('fill', colors[d.data.genre]);

          g.append("text")
            .attr("class", "value-text")
            .text(`${d.data.percentage*100}%`)
            .attr('text-anchor', 'middle')
            .attr('dy', '.6em');
        })
      .on("mouseout", function(d) {
          d3.select(this)
            .style("cursor", "none")
            .style("fill", colors[d.data.genre])
            .select(".text-group").remove();
        })
      .append('path')
      .attr('d', arc)
      .attr('fill', (d,i) => colors[d.data.genre])
      .on("mouseover", function(d) {
          d3.select(this)
            .style("cursor", "pointer")
            .style("opacity", "0.6")
            .style("transform", "scale(1.1)");
        })
      .on("mouseout", function(d) {
          d3.select(this)
            .style("cursor", "none")
            .style("opacity", "1")
            .style("transform", "scale(1)");
        })
      .each(function(d, i) { this._current = i; });


    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '.35em')
      .text(text);

    resetLvl1();
  });
}
