---
---

console.log("Loading canvas js!");

var camera, scene, renderer, controls;
var raycaster;
var peak = 0.1, gravity = 0.3;
var mouse;
var time;



{% if jekyll.environment == "production" %}
  // console.log = function() {}
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

function animate_vertices(mesh, pk, grav){
  // k = (noise.perlin2(time/100, time)) * 2 + 2.2;
  time = performance.now() * 0.0004;

  // k += 0.001;
  // k = (mouse.x + 1) * 2;
  for (var i = 0; i < mesh.geometry.vertices.length; i++) {
      var p = mesh.geometry.vertices[i];
      p.normalize().multiplyScalar(1 + grav * noise.perlin3(p.x * peak + time, p.y * pk, p.z * pk));
  }
  mesh.geometry.computeVertexNormals();
  mesh.geometry.verticesNeedUpdate = true; //must be set or vertices will not update
}


function createBlob(c) {
  var geo = new THREE.SphereGeometry(.3, 50, 50);
  var mat  = new THREE.MeshStandardMaterial({
    shininess: 100,
    specular: 0xffffff,
    // transparent: true,
    // shading: THREE.FlatShading,
    // side: THREE.DoubleSide,
    // alpha: true,
    opacity: 0.8,
    clearCoat: 0.7,
    reflectivity: 1,
    metalness: 0,
    roughness: 0.8,
    // emissive: 0xffffff,
    // color: 0xffffff
    // color: 0x4e4279
    // color: 0x694dcb
    color: c
  });

  var bmesh = new THREE.Mesh(geo, mat);
  animate_vertices(bmesh, 0.9, 0.3);
  var s = Math.random() * .3 + .1;
  bmesh.scale.set(s, s, s);
  var distance = .4 + s;
  var range = 1;

  var x = Math.random() * range + distance;
  var y = Math.random() * range + distance;
  var z = Math.random() * range + distance;
  bmesh.position.set(x,y,z);

  var meshParent = new THREE.Object3D();
  meshParent.add(bmesh);
  meshParent.rotation.x = Math.random() * 20;
  meshParent.rotation.y = Math.random() * 20;
  meshParent.rotation.z = Math.random() * 20;
  objectWrapper.add(meshParent);
}

function createCanvasMaterial(size) {
  var matCanvas = document.createElement('canvas');
  matCanvas.width = matCanvas.height = size;
  var matContext = matCanvas.getContext('2d');
  // create exture object from canvas.
  var texture = new THREE.Texture(matCanvas);
  // Draw a circle
  var center = size / 2;
  matContext.beginPath();
  matContext.arc(center, center, size/2, 0, 2 * Math.PI, false);
  matContext.closePath();
  matContext.fillStyle = "#ffffff";
  matContext.fill();
  // need to set needsUpdate
  texture.needsUpdate = true;
  // return a texture made from the canvas
  return texture;
}


function createMesh(){

  var cubeLoader = new THREE.CubeTextureLoader();
    cubeLoader.setPath('assets/media/cube/');
    var textureCube = cubeLoader.load([
      'px.png', 'nx.png',
    	'py.png', 'ny.png',
    	'pz.png', 'nz.png'
    ]);

  var textureLoader = new THREE.TextureLoader();
  var blobGeometry   = new THREE.SphereGeometry(1, 50, 50);
  var material = new THREE.MeshPhysicalMaterial({
    // shininess: 100,
    // specular: 0xffffff,
    // transparent: true,
    // envMap: textureCube,
    // shading: THREE.FlatShading,
    // side: THREE.DoubleSide,
    clearCoat: 0.4,
    alpha: true,
    opacity: 0.9,
    reflectivity: 1,
    metalness: 0,
    roughness: 0.8,
    // emissive: 0xffffff,
    // color: 0xffffff
    // color: 0x4e4279
    // color: 0x694dcb
    color: 0x6c5ba5
  });

  var pmat = new THREE.PointsMaterial( {
    size: .05,
    map: createCanvasMaterial(256),
    // transparent: true,
    color: 0xffffff,
    linecap: 'round', //ignored by WebGLRenderer
  	linejoin:  'round' //ignored by WebGLRenderer
  } );

  var lineMat = new THREE.MeshBasicMaterial( {
  	color: 0xffffff,
    wireframe: true,
  	wireframeLinewidth: .01,
  	linecap: 'round', //ignored by WebGLRenderer
  	linejoin:  'round' //ignored by WebGLRenderer
  } );
  // window.blobMesh = new THREE.Mesh(blobGeometry, lineMat);
  window.blobMesh = new THREE.Mesh(blobGeometry, material);
  window.pointsMesh = new THREE.Points(blobGeometry, pmat);
  // material.map = textureLoader.load('{{site.image_path}}/trr-environment.png');
  // material.emissiveMap = textureLoader.load('{{site.image_path}}/trr-emissive.jpg');
  material.needsUpdate = true;
  // material.bumpMap = textureLoader.load('{{site.image_path}}/gold_bump.jpg');
  scene.add(blobMesh);
  // scene.add(pointsMesh);

  console.log("scene: " ,scene.children);
	textureCube.minFilter = THREE.LinearFilter;

  var colors = [0x15958c, 0xf3d500, 0xeff0f9]
  var c;
  for (var i = 0; i < 3; i++) {
    c = colors[i];
    createBlob(c);
  }

  // console.log("mesh: " ,mesh);
  // projects.push(project);

  $(canvas3D).delay(1000).fadeIn(500, function(){
    $("#landing-title, #svg-container").fadeIn(500, function(){
      $("#credits").delay(200).fadeIn(500);
    });
  });
}





$(document).ready(function(){
	$('.middle').mousedown(function(e){
		console.log("click on middle!");
		e.stopPropagation();
		e.stopImmediatePropagation();
	});


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
	camera.position.z = 4;
  // camera.layers.set( 1 );
	//camera.position.y = cameraOffsetY;
	//camera.lookAt(0, 0, 0);

	// controls = new THREE.TrackballControls(camera, renderer3D.domElement);
	// controls.enableDamping = true;
	// controls.dampingFactor = 1.0;
	// controls.enableZoom = true;
  // scene.fog = new THREE.Fog( 0x999999, 3, 5.5);
	var isoRadius = 140;

	verticies = [];

	center = new THREE.Vector3(0,0,0);


	objectWrapper = new THREE.Object3D();
	scene.add(objectWrapper);




  var ambLight = new THREE.AmbientLight( 0xffffff, 0.1 ); // soft white light
  // ambLight.layers.set( 1 );
  // scene.add( ambLight );

  var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.8 );
  directionalLight.position.set( .7, .8, .8 );
  // scene.add(directionalLight);

  var directionalLight2 = new THREE.DirectionalLight( 0xffffff, 0.9 );
  directionalLight2.position.set( -15, 0, -5 );
  scene.add(directionalLight2);

  var rectLight = new THREE.RectAreaLight( 0xffffff, 3,  20, 20 );
  rectLight.position.set( 15, 0, 5 );
  rectLight.lookAt( 0, 0, 0 );
  scene.add( rectLight );

  var light = new THREE.PointLight( 0xffffff, 1, 900 );
  var light2 = new THREE.PointLight( 0xffffff, 1, 900 );
  var light3 = new THREE.PointLight( 0xffffff, 1, 900 );
  light.position.set( 250, 0, 150 );
  light2.position.set( -250, 0, 150 );
  light3.position.set( 0, 0, -150 );
  // light.layers.set( 1 );
  // scene.add( light );
  // scene.add( light2 );
  // objectWrapper.add( light3 );

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







function animate() {

  animate_vertices(blobMesh, 1, 0.3);


  objectWrapper.rotation.x += .002;
  objectWrapper.rotation.y += .0009;
  for (var i = 0; i < objectWrapper.children.length; i++) {
		var thisObject = objectWrapper.children[i].children[0];
		thisObject.rotation.y += 0.01;
		thisObject.rotation.x += 0.009;
	}

  blobMesh.rotation.y = time * .1;
  blobMesh.rotation.z = time * .03;


  blobMesh.position.x = noise.perlin2(time, time/4000) * 0.5;
  blobMesh.position.y = noise.perlin2(time+1000, time/4000) * 0.5;
  blobMesh.position.z = noise.perlin2(time+2000, time/4000) * 0.4;
  {% if jekyll.environment == "production" %}
    requestAnimationFrame( animate );
  {% endif %}
  requestAnimationFrame( animate );

  // console.log("time: " ,time);

	//camera.lookAt( scene.position );
	//TWEEN.update();
	// controls.update();
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
