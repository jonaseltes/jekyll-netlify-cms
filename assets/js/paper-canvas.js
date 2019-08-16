---
---


var logo;
var logoInnerPath;
var logoOuterPath;
var oCenter;
var animate = false;
var strokeW = 12;
var oRatio;
var oScale;
var char;
var hasResized = false;
var init = false;
var documentReady = false;

function canvasResize() {
  // console.log("view.viewSize: " ,view.viewSize);
  if (typeof logo !== "undefined" && typeof logoOuterPath !== "undefined") {
    // logo.position = view.center;
    var ratio =  view.size.width / logo.bounds.width;
    console.log("view.size.width: " ,view.size.width);
    console.log("logo.bounds.width: " ,logo.bounds.width);
    logo.scale(ratio);
    logo.bounds.x = 0;
    logo.bounds.y = 0;
    oCenter.x = logoOuterPath.bounds.x + (logoOuterPath.bounds.width/2);
    oCenter.y = logoOuterPath.bounds.y + (logoOuterPath.bounds.height/2);
    if (!hasResized) {
      oRatio = logoOuterPath.bounds.width / view.size.width;
      hasResized = true;
    }
    oScale = oRatio * view.size.height;
    // console.log(view.element.id, ": oScale: " ,oScale);
    strokeW = oScale / 4;
    if (strokeW < 3) {
      strokeW = 3;
    }
    strokeW = strokeW;
    char.strokeWidth = strokeW;
  }
}


function initCanvas(){
  console.log("initCanvas!");
  project.clear();
  project.importSVG("{{site.logo.three.white_animation}}", {
    expandShapes: true,
    onLoad: function (item) {
      logo = item;
      logo.fillColor = 'white';
      {% if jekyll.environment == "development" %}
        logo.fillColor = 'black';
      {% endif %}
      console.log("logo: " ,logo);
      var charIndex = 14;
      // item.children[0].remove();
      char = logo.children[14];
      // char.fullySelected = true;
      // logo.children[8].selected = true;
      // logo.children[9].selected = true;
      // logo.children[10].selected = true;
      char.fillColor.alpha = 0;
      char.strokeColor = 'white';
      {% if jekyll.environment == "development" %}
        char.strokeColor = 'black';
      {% endif %}
      char.style = null;
      logoOuterPath = char.children[0];
      logoInnerPath = char.children[1];
      logoInnerPath.remove();
      logoOuterPath.style = null;
      console.log("logoOuterPath: " ,logoOuterPath);
      oCenter = new Point();
      oCenter.x = logoOuterPath.bounds.x + (logoOuterPath.bounds.width/2);
      oCenter.y = logoOuterPath.bounds.y + (logoOuterPath.bounds.height/2);
      console.log("oCenter: " ,oCenter);
      oRatio = logoOuterPath.bounds.height / view.size.height;
      oScale = oRatio * view.size.height;
      console.log("view.element.height: " ,view.element.height);
      console.log("oRatio: " ,oRatio);
      console.log("logoOuterPath.bounds.width: " ,logoOuterPath.bounds.width);
      // logoOuterPath.selected = true;
      // logo.children[14].selected = true;
      console.log("logoOuterPath.segments[0].point: " ,logoOuterPath.segments[0].point);

      // logoOuterPath.segments[0].remove();
      // logoInnerPath.segments[0].remove();

      canvasResize();
      animate = true;
    }
  });
}


console.log("canvas: " ,view.element);
console.log("paper: " ,paper);


function saveCanvas(){
  console.log("Clicked canvas!");
  var svgExport = char.exportSVG({ asString: false });
  var padding = 10;
  var offsetX = 0 -logoOuterPath.bounds.x + strokeW + padding/2;
  var offsetY = 0 -logoOuterPath.bounds.y + strokeW/2 + padding/2;
  svgExport.setAttribute('transform', 'translate('+offsetX+','+offsetY+')');
  console.log("svgExport: " ,svgExport);
  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute('width', logoOuterPath.bounds.width + strokeW + padding);
  svg.setAttribute('height', logoOuterPath.bounds.height + strokeW + padding);
  // logoOuterPath.bounds.x = 0;
  // logoOuterPath.bounds.y = 0;
  svg.appendChild(svgExport);
  // console.log("svg: " ,svg);
  svg = new XMLSerializer().serializeToString(svg);
  svg = 'data:image/svg+xml;base64,' + btoa(svg);
  console.log("svg: " ,svg);
  svg = svg.replace(/^data:image\/[^;]+/, 'data:application/octet-stream');
  // window.open(svg);
  // char.fillColor.alpha = 0;
  // char.strokeColor = 'black';
  // char.style = null;
  saveBase64(svg, 'logo.svg');
}


$( document ).ready(function() {
  console.log("paper.js ready!");
  if (view.element.height > 0 && init == false) {
    // var paperCanvas = document.getElementById("paperCanvas");
    view.element.width  = $("#paperCanvas").width() * window.devicePixelRatio;
    view.element.height  = $("#logo").height() * window.devicePixelRatio;
    view.viewSize.width  = $("#paperCanvas").width();
    view.viewSize.height  = $("#logo").height();
    view.update(true);
    console.log("view: " ,view);
    // view.element.style.width  = $("#paperCanvas").width();
    // view.element.style.height  = $("#paperCanvas").height();
    initCanvas();
    init = true;
  }
  $("#paperCanvas").click(function(){
    {% if jekyll.environment == "development" %}
      saveCanvas();
    {% endif %}
  });
  documentReady = true;
});

function onResize(event) {
  // console.log("onResize: ",event.size);
  if ($("#logo").height() > 0 && init == false && documentReady == true) {
    console.log("importing svg!");
    view.element.width  = $("#paperCanvas").width() * window.devicePixelRatio;
    view.element.height  = $("#logo").height() * window.devicePixelRatio;
    view.viewSize.width  = $("#paperCanvas").width();
    view.viewSize.height  = $("#logo").height();
    view.update(true);
    initCanvas();
    init = true;
  }
  // console.log("onResize!");
	// Whenever the window is resized, recenter the path:
	canvasResize();
}

// view.setViewSize(200, 200);
// onResize(view);

var seed = Math.random()*1000;
console.log("seed: " ,seed);

// function onMouseDown(event) {
// 	console.log('You pressed the mouse!');
// }



function onFrame(event) {

  if (animate) {
    if (project.activeLayer.children.length > 1) {
      project.activeLayer.children[0].remove();
    }
    // canvasResize();
    for (var i = 0; i < logoOuterPath.segments.length; i++) {
      var outerSegment = logoOuterPath.segments[i];

      var vectorOuter = oCenter - outerSegment.point;
      var vectorOuterNormalized = vectorOuter.normalize(oScale/4);
      var speed = 0.5;
      var peak = 0.2;
      var factor = map_range(noise.perlin2(i*peak+(event.time+seed)*speed, i*peak+(event.time+seed) * speed), -1, 1, 0.4, 4);

      outerSegment.point = oCenter - (vectorOuterNormalized * factor);
      // outerSegment.smooth({type: 'continuous'});
      // view.pause();
    }
    logoOuterPath.position.x = logo.children[8].bounds.x + logo.children[8].bounds.width + logoOuterPath.bounds.width/2 + strokeW/4;
    logo.children[9].bounds.x = logoOuterPath.bounds.x + logoOuterPath.bounds.width + strokeW;
    logo.children[10].bounds.x = logo.children[9].bounds.x + logo.children[9].bounds.width + strokeW/2;
    logoOuterPath.smooth({ type: 'continuous' });
  }
}
