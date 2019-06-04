---
---

console.log("Loading canvas js!");

var camera, scene, renderer, controls;
var raycaster;
var k = 0.1;
var mouse;


{% if jekyll.environment == "production" %}
  console.log = function() {}
{% endif %}

init();






function getPlaneGeometry() {
        if(_geo == null) {
            var _geo = new THREE.PlaneGeometry(1000, 1000);
        }

        return _geo;
    };





function map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}




function createMesh(){

  var textureLoader = new THREE.TextureLoader();
  var geometry   = new THREE.SphereGeometry(1, 200, 200);
  var material  = new THREE.MeshPhongMaterial({
    shininess: 100,
    specular: 0xffffff,
    transparent: true,
    // shading: THREE.FlatShading,
    side: THREE.DoubleSide,
    // alpha: true,
    // opacity: 0.6,
    clearCoat: 0,
    reflectivity: 1,
    metalness: 0,
    roughness: 0.3,
    // emissive: 0xffffff,
    // color: 0xffffff
    // color: 0x4e4279
    // color: 0x694dcb
    color: 0xb3a4ed
  });
  window.earthMesh = new THREE.Mesh(geometry, material);
  // material.map = textureLoader.load('{{site.image_path}}/trr-environment.png');
  // material.emissiveMap = textureLoader.load('{{site.image_path}}/trr-emissive.jpg');
  material.needsUpdate = true;
  // material.bumpMap = textureLoader.load('{{site.image_path}}/gold_bump.jpg');
  material.bumpScale = 0.01;
  scene.add(earthMesh);
  console.log("scene: " ,scene.children);
	// texture.minFilter = THREE.NearestFilter;
	// texture.magFilter = THREE.NearestFilter;


	// var mat = new THREE.MeshBasicMaterial({
	// 	map: texture,
	// 	fog: true,
	// 	side: THREE.DoubleSide,
  //   transparent: true,
  //   opacity: 0.9
	// 	// color: 0x000000
	// });


  // console.log("mesh: " ,mesh);
  // projects.push(project);

  $(canvas3D).delay(1000).fadeIn(500, function(){
    $("#landing-title, #svg-container").fadeIn(500, function(){
      $("#credits").delay(200).fadeIn(500);
    });
  });
}




function load(){

    var textureLoader = new THREE.TextureLoader();
    var map = textureLoader.load(
      {{site.image_path}}+image,
      function(texture){
        numberOfLoadedTextures++;
        if (numberOfLoadedTextures == images.length) {
          console.log("done loading images!");
          $(canvas3D).delay(1000).fadeIn(500, function(){
            $("#landing-title, #svg-container").fadeIn(500, function(){
              $("#credits").delay(200).fadeIn(500);
            });
          });
          // $('#loading-text').fadeOut(300, function(){
          //   $('#landing-text').fadeIn(300);
          // });
        }
        createMesh(texture);
      }
    );

}

$(document).ready(function(){
	$('.middle').mousedown(function(e){
		console.log("click on middle!");
		e.stopPropagation();
		e.stopImmediatePropagation();
	});

	// $('.project').mousedown(function(e){
	// 	console.log("click on middle!");
	// 	e.stopPropagation();
	// 	e.stopImmediatePropagation();
	// });
});


function init() {

	$( "#canvas3D").click(function(e) {
		// event.stopPropagation();
		//e.preventDefault();
	  	console.log("clicked canvas!");
	  	//return false;
	});


	// $('body').click(function(){
	// 	console.log("clicked body!");
	// });



	scene = new THREE.Scene();

	canvas3D = document.getElementById('canvas3D');
	renderer3D = new THREE.WebGLRenderer( { canvas: canvas3D, antialias: true, clearColor: 0x000000, clearAlpha: 0, alpha: true, preserveDrawingBuffer: false, autoClear: true });
  // scene.background = new THREE.Color( 0xefefef );
	renderer3D.setPixelRatio(window.devicePixelRatio);
	renderer3D.setSize(window.innerWidth, window.innerHeight);
	//renderer2D.setSize(window.innerWidth, window.innerHeight);


	// var container = document.getElementById('container');
	// container.appendChild( renderer3D.domElement);

	console.log("renderer3D.domElement: " ,renderer3D.domElement);


	mouse = new THREE.Vector2();
	raycaster = new THREE.Raycaster();
	worldVector = new THREE.Vector3();

	camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.z = 5;
  // camera.layers.set( 1 );
	//camera.position.y = cameraOffsetY;
	//camera.lookAt(0, 0, 0);

	controls = new THREE.TrackballControls(camera, renderer3D.domElement);
	controls.enableDamping = true;
	controls.dampingFactor = 1.0;
	controls.enableZoom = true;
  // scene.fog = new THREE.Fog( 0x000000, 400, 1500);
	var isoRadius = 140;

	verticies = [];

	center = new THREE.Vector3(0,0,0);


	objectWrapper = new THREE.Object3D();
	scene.add(objectWrapper);




  var ambLight = new THREE.AmbientLight( 0xffffff, 0.1 ); // soft white light
  // ambLight.layers.set( 1 );
  scene.add( ambLight );

  var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
  directionalLight.position.set( 0, 1, 0 );
  // objectWrapper.add( directionalLight );

  var light = new THREE.PointLight( 0xffffff, 1, 800 );
  var light2 = new THREE.PointLight( 0xffffff, 1, 800 );
  var light3 = new THREE.PointLight( 0xffffff, 1, 800 );
  light.position.set( 250, 0, 150 );
  light2.position.set( -250, 0, 150 );
  light3.position.set( 0, 0, -150 );
  // light.layers.set( 1 );
  objectWrapper.add( light );
  objectWrapper.add( light2 );
  objectWrapper.add( light3 );

  $(canvas3D).hide();

  createMesh();
	// load();
  animate();



	var PI2 = Math.PI * 2;

	clock = new THREE.Clock();




  window.addEventListener( 'resize', onWindowResize, false );
  document.addEventListener('mousedown', onDocumentMouseDown, false);
  document.addEventListener( 'mousemove', onMouseMove, false );

}


function onDocumentMouseDown(event) {

}

function onMouseMove( event ) {

	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}




function toScreenXY(position, camera, canvas) {
  var pos = position.clone();
  var projScreenMat = new THREE.Matrix4();
  projScreenMat.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
 // projScreenMat.multiplyVector3( pos );
	pos.applyProjection(projScreenMat);
  return { x: (( pos.x + 1 ) * canvas.width / 2  + canvas.offsetLeft),
      y: (( - pos.y + 1) * canvas.height / 2 + canvas.offsetTop) };
}


function checkRotation(){

    var x = camera.position.x,
        y = camera.position.y,
        z = camera.position.z;

    // if (keyboard.pressed("left")){
    //     camera.position.x = x * Math.cos(rotSpeed) + z * Math.sin(rotSpeed);
    //     camera.position.z = z * Math.cos(rotSpeed) - x * Math.sin(rotSpeed);
    // } else if (keyboard.pressed("right")){
        camera.position.y = y * Math.cos(rotSpeed) - x * Math.sin(rotSpeed);
        camera.position.x = x * Math.cos(rotSpeed) + y * Math.sin(rotSpeed);
    //}

    //camera.lookAt(scene.position);
    //camera.lookAt(0, 50, 50);
    //camera.lookAt(scene.position.x, scene.position.y, scene.position.z);

}



var time;

function animate() {


  time = performance.now() * 0.0004;

  // objectWrapper.rotation.x += .001;
  objectWrapper.rotation.y += .002;
  earthMesh.rotation.y = time * .1;
  earthMesh.rotation.z = time * .03;

  // k = (noise.perlin2(time/100, time)) * 2 + 2.2;
  k = 1.2;
  // k += 0.001;
  // k = (mouse.x + 1) * 2;
  for (var i = 0; i < earthMesh.geometry.vertices.length; i++) {
      var p = earthMesh.geometry.vertices[i];
      p.normalize().multiplyScalar(1 + 0.3 * noise.perlin3(p.x * k + time, p.y * k, p.z * k));
  }
  earthMesh.geometry.computeVertexNormals();
  earthMesh.geometry.verticesNeedUpdate = true; //must be set or vertices will not update
  earthMesh.position.x = noise.perlin2(time, time/4000) * 0.5;
  earthMesh.position.y = noise.perlin2(time+1000, time/4000) * 0.5;
  earthMesh.position.z = noise.perlin2(time+2000, time/4000) * 0.4;

	requestAnimationFrame( animate );
  // console.log("time: " ,time);

	//camera.lookAt( scene.position );
	//TWEEN.update();
	controls.update();
  renderer3D.clear();
	//renderer3D.render( bgScene, camera );
	renderer3D.render( scene, camera );

}


function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer3D.setSize( window.innerWidth, window.innerHeight );


		console.log("window width: " ,window.innerWidth);
		console.log("window height: " ,window.innerHeight);


}
