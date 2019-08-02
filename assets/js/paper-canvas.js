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

function canvasResize() {
  if (typeof logo !== "undefined" && typeof logoOuterPath !== "undefined") {
    // logo.position = view.center;
    var ratio =  view.size.height / logo.bounds.height;
    logo.scale(ratio);
    logo.bounds.x = 0;
    logo.bounds.y = 0;
    console.log("logo.bounds: " ,logo.bounds);
    oCenter.x = logoOuterPath.bounds.x + (logoOuterPath.bounds.width/2);
    oCenter.y = logoOuterPath.bounds.y + (logoOuterPath.bounds.height/2);
    // oRatio = logoOuterPath.bounds.width / view.size.width;
    oScale = oRatio * view.size.width;
    strokeW = oScale / 3.5;
    char.strokeWidth = strokeW;

    console.log("pixelRatio: " ,view.pixelRatio);
    console.log("resolution: " ,view.resolution);
    console.log("view.viewSize: " ,view.viewSize);
    console.log("view.size: " ,view.size);
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
    console.log("logo.children[8]: " ,logo.children[8]);
    char.fillColor.alpha = 0;
    char.strokeColor = 'white';
    char.style = null;
    console.log("char: " ,char);
    logoOuterPath = logo.children[14].children[0];
    logoInnerPath = logo.children[14].children[1];
    logoInnerPath.remove();
    logoOuterPath.style = null;
    console.log("logoOuterPath: " ,logoOuterPath);
    oCenter = new Point();
    oCenter.x = logoOuterPath.bounds.x + (logoOuterPath.bounds.width/2);
    oCenter.y = logoOuterPath.bounds.y + (logoOuterPath.bounds.height/2);
    console.log("oCenter: " ,oCenter);
    oRatio = logoOuterPath.bounds.width / view.size.width;
    oScale = oRatio * view.size.width;
    // logoOuterPath.selected = true;
    // logo.children[14].selected = true;
    console.log("child: " ,logo.children[14]);
    console.log("logoOuterPath.segments[0].point: " ,logoOuterPath.segments[0].point);

    console.log("oRatio: " ,oRatio);
    console.log("logoOuterPath.bounds.width: " ,logoOuterPath.bounds.width);
    // logoOuterPath.segments[0].remove();
    // logoInnerPath.segments[0].remove();

    canvasResize();
    char.strokeWidth = strokeW;
    animate = true;
  }
});

console.log("view: " ,view);
console.log("paper version: " ,paper.version);


function onResize(event) {
  console.log("onResize!");
	// Whenever the window is resized, recenter the path:
	canvasResize();
}

var seed = Math.random()*1000;

function onFrame(event) {

  if (animate) {
    for (var i = 0; i < logoOuterPath.segments.length; i++) {
      // oCenter.x = logoOuterPath.bounds.x + (logoOuterPath.bounds.width/2);
      var outerSegment = logoOuterPath.segments[i];

      var vectorOuter = oCenter - outerSegment.point;
      var vectorOuterNormalized = vectorOuter.normalize(oScale/2 - (strokeW/2));

      var factor = map_range(noise.perlin2(i*(event.time+seed)*0.01, (event.time+seed) * 0.7), -1, 1, 0.5, 5);
      // factor = 1;
      if (i == 15) {
          // outerSegment.point.selected = true;
          // innerSegment.point.selected = true;
      }
      outerSegment.point = oCenter - (vectorOuterNormalized * factor);
      logoOuterPath.position.x = logo.children[8].bounds.x + logo.children[8].bounds.width + logoOuterPath.bounds.width/2 + strokeW/4;
      logo.children[9].bounds.x = logoOuterPath.bounds.x + logoOuterPath.bounds.width + strokeW;
      logo.children[10].bounds.x = logo.children[9].bounds.x + logo.children[9].bounds.width + strokeW/2;
      outerSegment.smooth({type: 'catmull-rom'});
      // view.pause();
    }
    logoOuterPath.smooth({ type: 'continuous' });
    // logoInnerPath.smooth({ type: 'continuous' });
  }


	// var vector = destination - text.position;
  //
	// text.position += vector / 30;
  //
	// text.content = Math.round(vector.length);
	// if (vector.length < 5) {
	// 	destination = Point.random() * view.size;
	// }
  // console.log("count: " ,event.count);
}
