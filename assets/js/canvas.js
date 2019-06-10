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


function getRndFloat(min, max) {
  var rnd = Math.random() * (max - min) + min;
  var random_boolean = Math.random() >= 0.5;
  if (random_boolean) {
    rnd *= -1;
  }
  // console.log("random_boolean: " ,random_boolean);
  return rnd;
}



function createMesh(){

  var minDistance = 1.3;
  var maxDistance = 1.7;


  var cubeLoader = new THREE.CubeTextureLoader();
    cubeLoader.setPath('{{site.image_path}}/cube/');
    var textureCube = cubeLoader.load([
      'px.png', 'nx.png',
    	'py.png', 'ny.png',
    	'pz.png', 'nz.png'
    ]);



  var textureLoader = new THREE.TextureLoader();
  var geometry   = new THREE.SphereGeometry(1, 200, 200);
  var material  = new THREE.MeshPhysicalMaterial({
    shininess: 100,
    specular: 0xffffff,
    transparent: true,
    // shading: THREE.FlatShading,
    side: THREE.DoubleSide,
    // alpha: true,
    // opacity: 0.6,
    envMap: textureCube,
    fog: true,
    clearCoat: 0.4,
    // clearCoatRoughness: 0.1,
    reflectivity: 0.5,
    metalness: 0,
    roughness: 0.9,
    // emissive: 0xffffff,
    // color: 0xffffff
    // color: 0xB2A48D GOOD BROWN
    color: 0xb7ad9d
    // color: 0x4e4279
    // color: 0x694dcb
    // color: 0xb3a4ed // USED
  });
  window.earthMesh = new THREE.Mesh(geometry, material);
  // material.map = textureLoader.load('{{site.image_path}}/blob-text.jpg');
  // material.emissiveMap = textureLoader.load('{{site.image_path}}/trr-emissive.jpg');
  material.needsUpdate = true;
  // material.bumpMap = textureLoader.load('{{site.image_path}}/gold_bump.jpg');
  material.bumpScale = 0.01;
  scene.add(earthMesh);
  console.log("scene: " ,scene.children);
	// texture.minFilter = THREE.NearestFilter;
	// texture.magFilter = THREE.NearestFilter;
  var cylindergeometry = new THREE.CylinderGeometry( 0.1, 0.1, 1, 32 );
  var cylindermaterial = new THREE.MeshStandardMaterial( {
    color: 0x111111,
    envMap: textureCube,
    clearCoat: 0,
    metalness: .9,
    reflectivity: 1,
    roughness: 0.3
  } );
  var cylinder = new THREE.Mesh( cylindergeometry, cylindermaterial );
  cylindermaterial.envMap = textureCube;

  var x = getRndFloat(minDistance, maxDistance);
  var y = getRndFloat(minDistance, maxDistance);
  var z = getRndFloat(minDistance, maxDistance);

  cylinder.position.set(x,y,z);
  var cylinderParent = new THREE.Object3D();
  cylinderParent.add(cylinder);
  cylinderParent.rotation.x = Math.random() * 20;
  cylinderParent.rotation.y = Math.random() * 20;
  cylinderParent.rotation.z = Math.random() * 20;
  objectWrapper.add(cylinderParent);



  var cylindergeometry2 = new THREE.CylinderGeometry( .5, .5, .03, 32 );
  var cylindermaterial2 = new THREE.MeshStandardMaterial( {
    color: 0xeeeeee,
    envMap: textureCube,
    clearCoat: 0,
    metalness: .9,
    reflectivity: 1,
    roughness: 0.1
  } );
  var cylinder2 = new THREE.Mesh( cylindergeometry2, cylindermaterial2 );

  var x = getRndFloat(minDistance, maxDistance);
  var y = getRndFloat(minDistance, maxDistance);
  var z = getRndFloat(minDistance, maxDistance);

  cylinder2.position.set(x,y,z);
  var cylinderParent2 = new THREE.Object3D();
  cylinderParent2.add(cylinder2);
  cylinderParent2.rotation.x = Math.random() * 20;
  cylinderParent2.rotation.y = Math.random() * 20;
  cylinderParent2.rotation.z = Math.random() * 20;
  objectWrapper.add(cylinderParent2);





  var spheeregeo = new THREE.SphereGeometry(0.35, 50, 50);
  var spheremat = new THREE.MeshBasicMaterial( {
    color: 0xeeeeee,
    // clearCoat: 0.7,
    // side: THREE.BackSide,
    envMap: cubeCamera.renderTarget.texture,
    // lightMap: textureCube,
    envMapintensity: 1,
    metalness: 0.9,
    roughness: 0,
    displacementScale: 0.05,
    reflectivity: 1,
    refractionRatio: 0.91

  } );
  spheremat.envMap.mapping = THREE.CubeRefractionMapping;
  // spheremat.map = textureLoader.load('{{site.image_path}}/textures/metal/COL.jpg');
  // spheremat.normalMap = textureLoader.load('{{site.image_path}}/textures/metal/BUMP.jpg');
  // spheremat.bumpMap = textureLoader.load('{{site.image_path}}/textures/metal/BUMP.jpg');
  // spheremat.displacementMap = textureLoader.load('{{site.image_path}}/textures/metal/DISP.png');
  // spheremat.roughnessMap = textureLoader.load('{{site.image_path}}/textures/metal/ROUGH.jpg');
  // spheremat.aoMap = textureLoader.load('{{site.image_path}}/textures/metal/AO.jpg');

   window.sphereMesh = new THREE.Mesh( spheeregeo, spheremat );


  var x = getRndFloat(minDistance, maxDistance);
  var y = getRndFloat(minDistance, maxDistance);
  var z = getRndFloat(minDistance, maxDistance);

  sphereMesh.position.set(0,0,3.2);

  // scene.add(sphereMesh);

  // sphereMesh.position.set(x,y,z);
  cubeCamera.position.copy(sphereMesh.position);
  // console.log("sphereMesh.position: " ,sphereMesh.position);
  // console.log("cubeCamera.position: " ,cubeCamera.position);
  window.sphereParent = new THREE.Object3D();
  sphereParent.add(sphereMesh);
  sphereParent.rotation.x = Math.random() * 20;
  sphereParent.rotation.y = Math.random() * 20;
  sphereParent.rotation.z = Math.random() * 20;
  objectWrapper.add(sphereParent);



  var conegeo = new THREE.ConeGeometry( .25, .4, 50 );
  var conemat = new THREE.MeshStandardMaterial( {
    color: 0xCCC1A8,
    envMap: textureCube,
    clearCoat: 0,
    metalness: 0.9,
    reflectivity: 1,
    roughness: 0.1
  } );

  // conemat.map = textureLoader.load('{{site.image_path}}/textures/marble/COL.jpg');
  // conemat.normalMap = textureLoader.load('{{site.image_path}}/textures/marble/NORM.jpg');
  // conemat.bumpMap = textureLoader.load('{{site.image_path}}/textures/marble/BUMP.jpg');
  // spheremat.bump = textureLoader.load('{{site.image_path}}/textures/DISP.jpg');
  // conemat.roughnessMap = textureLoader.load('{{site.image_path}}/textures/marble/ROUGH.jpg');

  var conemesh = new THREE.Mesh( conegeo, conemat );
  scene.add( conemesh );


  var x = getRndFloat(minDistance, maxDistance);
  var y = getRndFloat(minDistance, maxDistance);
  var z = getRndFloat(minDistance, maxDistance);

  conemesh.position.set(x,y,z);
  var coneParent = new THREE.Object3D();
  coneParent.add(conemesh);
  coneParent.rotation.x = Math.random() * 20;
  coneParent.rotation.y = Math.random() * 20;
  coneParent.rotation.z = Math.random() * 20;
  objectWrapper.add(coneParent);


  var torusgeometry = new THREE.TorusGeometry( 0.35, 0.12, 16, 100 );
  var torusmaterial = new THREE.MeshPhysicalMaterial( {
    color: 0xF4EFE4,
    specular: 0x5EBF79,
    clearCoat: 0.5,
    // clearCoatRoughness: 0.1,
    reflectivity: 0.5,
    envMap: textureCube,
    metalness: 0,
    roughness: 0.9
  } );
  var torus = new THREE.Mesh( torusgeometry, torusmaterial );

  var x = getRndFloat(minDistance, maxDistance);
  var y = getRndFloat(minDistance, maxDistance);
  var z = getRndFloat(minDistance, maxDistance);

  torus.position.set(x,y,z);
  var torusParent = new THREE.Object3D();
  torusParent.add(torus);
  torusParent.rotation.x = Math.random() * 20;
  torusParent.rotation.y = Math.random() * 20;
  torusParent.rotation.z = Math.random() * 20;
  objectWrapper.add(torusParent);



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
  scene.background = new THREE.Color( 0xCCC5C2 );
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
  window.cubeCamera = new THREE.CubeCamera(.1, 10000, 1024);
  scene.add(cubeCamera);
  cubeCamera.update( renderer3D, scene );
	camera.position.z = 12;
  // camera.layers.set( 1 );
	//camera.position.y = cameraOffsetY;
	//camera.lookAt(0, 0, 0);

	// controls = new THREE.TrackballControls(camera, renderer3D.domElement);
	// controls.enableDamping = true;
	// controls.dampingFactor = 1.0;
	// controls.enableZoom = true;
  scene.fog = new THREE.Fog( 0xCCC5C2, 9, 15);
  // scene.fog = new THREE.FogExp2(0xaaaaaa, 0.1);

	var isoRadius = 140;

	verticies = [];

	window.center = new THREE.Vector3(0,0,0);

  window.objectWrapper = new THREE.Object3D();
  scene.add(objectWrapper);

	lightsWrapper = new THREE.Object3D();
	scene.add(lightsWrapper);




  // var ambLight = new THREE.AmbientLight( 0xffffff, 0.1 ); // soft white light
  // ambLight.layers.set( 1 );
  // scene.add( ambLight );

  var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.8 );
  directionalLight.position.set( 0, 1, 0 );
  var directionalLight2 = new THREE.DirectionalLight( 0xffffff, 0.9 );
  // scene.add(directionalLight);
  directionalLight2.position.set( -15, 0, -5 );
  scene.add(directionalLight2);
  // lightsWrapper.add( directionalLight );


  var rectLight = new THREE.RectAreaLight( 0xffffff, 2.5,  20, 20 );
  rectLight.position.set( 15, 0, 5 );
  rectLight.lookAt( 0, 0, 0 );
  scene.add( rectLight );

  var rectLight2 = new THREE.RectAreaLight( 0xffffff, 1,  20, 20 );
  rectLight2.position.set( -10, 5, 7 );
  rectLight2.lookAt( 0, 0, 0 );
  // scene.add( rectLight2 );

  var light = new THREE.PointLight( 0xF4E9D0, 0.4, 100 );
  var light2 = new THREE.PointLight( 0xffffff, 1, 800 );
  var light3 = new THREE.PointLight( 0xffffff, 1, 800 );
  light.position.set( 0, 0, 15 );
  light2.position.set( -250, 0, 150 );
  light3.position.set( 0, 0, -150 );
  // light.layers.set( 1 );
  lightsWrapper.add( light );
  // lightsWrapper.add( light2 );
  // lightsWrapper.add( light3 );


  window.capturer = new CCapture( {
  	framerate: 60,
    format: 'webm',
  	verbose: true,
    timeLimit: 15
  } );



  $(canvas3D).hide();

  createMesh();
	// load();
  animate();
  capturer.start();


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
var gravity;

function animate() {


  time = performance.now() * 0.0004;

  // lightsWrapper.rotation.x += .001;
  // lightsWrapper.rotation.y += .002;
  earthMesh.rotation.y = time * .1;
  earthMesh.rotation.z = time * .03;

  // k = (noise.perlin2(time/100, time)) * 2 + 2.2;
  k = 0.5;
  gravity = 0.9;
  // k += 0.001;
  // k = (mouse.x + 1) * 2;
  for (var i = 0; i < earthMesh.geometry.vertices.length; i++) {
      var p = earthMesh.geometry.vertices[i];
      p.normalize().multiplyScalar(1 + gravity * noise.perlin3(p.x * k + time, p.y * k, p.z * k));
  }
  earthMesh.geometry.computeVertexNormals();
  earthMesh.geometry.verticesNeedUpdate = true; //must be set or vertices will not update
  earthMesh.position.x = noise.perlin2(time, time/4000) * 0.5;
  earthMesh.position.y = noise.perlin2(time+1000, time/4000) * 0.5;
  earthMesh.position.z = noise.perlin2(time+2000, time/4000) * 0.4;

  objectWrapper.rotation.x += .005;
  objectWrapper.rotation.y += .008;
  for (var i = 0; i < objectWrapper.children.length; i++) {
		var thisObject = objectWrapper.children[i].children[0];
		thisObject.rotation.y += 0.01;
		thisObject.rotation.x += 0.009;
	}

  sphereParent.updateMatrixWorld();
  // console.log("sphereMesh.position" ,sphereMesh.getWorldPosition());
  cubeCamera.position.copy(sphereMesh.getWorldPosition());
  // console.log("cubeCamera.position" ,cubeCamera.position);

	requestAnimationFrame( animate );
  // console.log("time: " ,time);

	//camera.lookAt( scene.position );
	//TWEEN.update();
	// controls.update();

  sphereMesh.visible = false;
  cubeCamera.update(renderer3D, scene);
  sphereMesh.visible = true;
  renderer3D.clear();
	//renderer3D.render( bgScene, camera );

	renderer3D.render( scene, camera );
  capturer.capture( canvas3D );
}


function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer3D.setSize( window.innerWidth, window.innerHeight );


		console.log("window width: " ,window.innerWidth);
		console.log("window height: " ,window.innerHeight);


}
