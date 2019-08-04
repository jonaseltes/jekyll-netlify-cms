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

function canvasResize() {
  if (typeof logo !== "undefined" && typeof logoOuterPath !== "undefined") {
    // logo.position = view.center;
    var ratio =  view.size.height / logo.bounds.height;
    logo.scale(ratio);
    logo.bounds.x = 0;
    logo.bounds.y = 0;
    oCenter.x = logoOuterPath.bounds.x + (logoOuterPath.bounds.width/2);
    oCenter.y = logoOuterPath.bounds.y + (logoOuterPath.bounds.height/2);
    if (!hasResized) {
      oRatio = logoOuterPath.bounds.width / view.size.width;
      hasResized = true;
    }
    oScale = oRatio * view.element.width;
    // console.log(view.element.id, ": oScale: " ,oScale);
    strokeW = oScale / 7;
    if (strokeW < 3) {
      strokeW = 3;
    }
    char.strokeWidth = strokeW;
  }
}


project.importSVG("{{site.logo.three.white_animation}}", {
  expandShapes: true,
  onLoad: function (item) {
    logo = item;
    console.log("logo: " ,logo);
    var charIndex = 14;
    // item.children[0].remove();
    char = logo.children[14];
    // logo.children[8].selected = true;
    // logo.children[9].selected = true;
    // logo.children[10].selected = true;
    char.fillColor.alpha = 0;
    char.strokeColor = 'white';
    char.style = null;
    logoOuterPath = logo.children[14].children[0];
    logoInnerPath = logo.children[14].children[1];
    logoInnerPath.remove();
    logoOuterPath.style = null;
    console.log("logoOuterPath: " ,logoOuterPath);
    oCenter = new Point();
    oCenter.x = logoOuterPath.bounds.x + (logoOuterPath.bounds.width/2);
    oCenter.y = logoOuterPath.bounds.y + (logoOuterPath.bounds.height/2);
    console.log("oCenter: " ,oCenter);
    oRatio = logoOuterPath.bounds.height / view.element.height;
    oScale = oRatio * view.element.height;
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

console.log("view: " ,view);
console.log("canvas: " ,view.element);
console.log("paper version: " ,paper.version);


function onResize(event) {
  // console.log("onResize!");
	// Whenever the window is resized, recenter the path:
	canvasResize();
}

var seed = Math.random()*1000;

function onFrame(event) {

  if (animate) {
    // canvasResize();
    for (var i = 0; i < logoOuterPath.segments.length; i++) {
      var outerSegment = logoOuterPath.segments[i];

      var vectorOuter = oCenter - outerSegment.point;
      var vectorOuterNormalized = vectorOuter.normalize(oScale/4);

      var factor = map_range(noise.perlin2(i*(event.time+seed)*0.009, (event.time+seed) * 0.7), -1, 1, 0.5, 4);

      outerSegment.point = oCenter - (vectorOuterNormalized * factor);
      outerSegment.smooth({type: 'catmull-rom'});
      // view.pause();
    }
    logoOuterPath.position.x = logo.children[8].bounds.x + logo.children[8].bounds.width + logoOuterPath.bounds.width/2 + strokeW/4;
    logo.children[9].bounds.x = logoOuterPath.bounds.x + logoOuterPath.bounds.width + strokeW;
    logo.children[10].bounds.x = logo.children[9].bounds.x + logo.children[9].bounds.width + strokeW/2;
    logoOuterPath.smooth({ type: 'continuous' });
    // logoInnerPath.smooth({ type: 'continuous' });
  }
}
