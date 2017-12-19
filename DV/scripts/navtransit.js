var homeButton = document.createElement("span");
var yearButton = document.createElement("span");
var genreButton = document.createElement("span");
var a, b, c;
var cur_lvl;

homeButton.id = "homeButton";
yearButton.id = "yearButton";
genreButton.id = "genreButton";

function addHomeButton(year) {
  a = document.createTextNode("Home");
  b = document.createTextNode(year);
  homeButton.appendChild(a);
  yearButton.appendChild(b);
  cur_lvl = 1;

  document.getElementById('navbar').appendChild(homeButton);
  document.getElementById('navbar').appendChild(yearButton);
  homeButton.addEventListener("mouseover", homeButton.style.cursor = "pointer");
  homeButton.addEventListener("click", function() {backLvl0()});
}

function addYearButton(genre) {
  c = document.createTextNode(genre);
  cur_lvl = 2;
  genreButton.appendChild(c);

  document.getElementById('navbar').appendChild(genreButton);
  yearButton.addEventListener("mouseover", yearButton.style.cursor = "pointer");
  yearButton.addEventListener("click", function() {backLvl1()});
}

function backLvl0() {
  var newCircle = document.createElement("div");
  newCircle.id = "circle";
  newCircle.align = "center";

  if (cur_lvl == 1) {
    document.getElementById('circle').remove();
    document.getElementById('chart').remove();
    homeButton.removeChild(a);
    yearButton.removeChild(b);
    document.getElementById('visualization').appendChild(newCircle);
    d3.json("../data/lvl0.json", drawGraph);
  } else if (cur_lvl == 2) {
    document.getElementById('circle').remove();
    document.getElementById('chart').remove();
    document.getElementById('map').remove();
    homeButton.removeChild(a);
    yearButton.removeChild(b);
    genreButton.removeChild(c);
    document.getElementById('visualization').appendChild(newCircle);
    d3.json("../data/lvl0.json", drawGraph);
  }
}

function backLvl1() {
  genreButton.removeChild(c);
  document.getElementById('map').remove();
  document.getElementById('chart').style.zIndex = 1;
  document.getElementById('chart').style.opacity = 1;
  yearButton.removeEventListener("click", function() {backLvl1()});
  yearButton.addEventListener("mouseover", yearButton.style.cursor = "auto");
}
