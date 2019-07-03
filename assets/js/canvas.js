---
---

console.log("Loading canvas js!");

var camera, scene, renderer, controls;
var raycaster;
var peak = 0.1, gravity = 0.3;
var mouse;
var time;
var renderOn = false;
var canvasRes = 1;
if (animation_mode == "lab") {
  canvasRes = window.devicePixelRatio;
}

var blobColors = {
  learn: 0x70FF6B,
  work: 0x6c5ba5,
  rest: 0xFF5757
}


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
  var geo = new THREE.SphereGeometry(.3, 60, 60);
  var mat  = new THREE.MeshBasicMaterial({
    transparent: true,
    // shading: THREE.FlatShading,
    // side: THREE.DoubleSide,
    // alpha: true,
    opacity: 0.8,
    metalness: 0,
    roughness: 0.1,
    // emissive: 0xffffff,
    // color: 0xffffff
    // color: 0x4e4279
    // color: 0x694dcb
    color: c
  });

  var material = new THREE.MeshPhysicalMaterial({
    // shininess: 100,
    // specular: 0xffffff,
    transparent: true,
    // envMap: textureCube,
    // shading: THREE.FlatShading,
    // side: THREE.DoubleSide,
    clearCoat: 0.4,
    opacity: 0.9,
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
  animate_vertices(bmesh, 0.9, 0.5);
  var s = Math.random() * .5 + .3;
  bmesh.scale.set(s, s, s);
  var distance = .3 + (s/2);
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
  blobsWrapper.add(meshParent);
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


function startRender(){
  renderOn = true;
  animate();
  $(canvas3D).delay(1000).fadeIn(500, function(){
    $(canvas2D).fadeIn();
    $("#landing-title, #svg-container").fadeIn(500, function(){
      $("#credits").delay(200).fadeIn(500);
    });
  });
}

function loadBlobs(callback){

  var cubeLoader = new THREE.CubeTextureLoader();
    cubeLoader.setPath('/assets/media/cube/');
    window.textureCube = cubeLoader.load([
      'px.png', 'nx.png',
    	'py.png', 'ny.png',
    	'pz.png', 'nz.png'
    ]);

  var blobGeometry   = new THREE.SphereGeometry(1, 50, 50);
  var material = new THREE.MeshBasicMaterial({
    // shininess: 100,
    // specular: 0xffffff,
    // transparent: true,
    envMap: textureCube,
    // shading: THREE.FlatShading,
    // side: THREE.DoubleSide,
    clearCoat: 0.4,
    // alpha: true,
    opacity: 0.9,
    reflectivity: 1,
    metalness: 0,
    roughness: 0.9,
    // emissive: 0xffffff,
    // color: 0xffffff
    // color: 0x4e4279
    // color: 0x694dcb
    color: 0x6c5ba5
  });

  var bmaterial = new THREE.MeshPhysicalMaterial({
    // shininess: 100,
    // specular: 0xffffff,
    // transparent: true,
    // envMap: textureCube,
    // shading: THREE.FlatShading,
    // side: THREE.DoubleSide,
    clearCoat: 0.4,
    // alpha: true,
    opacity: 0.9,
    reflectivity: 1,
    metalness: 0,
    roughness: 0.9,
    // emissive: 0xffffff,
    // color: 0xffffff
    // color: 0x4e4279
    // color: 0x694dcb
    color: 0x6c5ba5
  });

  // material.envMap = textureCube;

  var pmat = new THREE.PointsMaterial( {
    size: .05,
    map: createCanvasMaterial(256),
    // transparent: true,
    color: 0xffffff
  } );

  var lineMat = new THREE.MeshBasicMaterial( {
  	color: 0xffffff,
    wireframe: true,
  	wireframeLinewidth: .01,
  	linecap: 'round', //ignored by WebGLRenderer
  	linejoin:  'round' //ignored by WebGLRenderer
  } );
  // window.blobMesh = new THREE.Mesh(blobGeometry, lineMat);
  window.blobMesh = new THREE.Mesh(blobGeometry, bmaterial);
  // window.pointsMesh = new THREE.Points(blobGeometry, pmat);
  // material.emissiveMap = textureLoader.load('{{site.image_path}}/trr-emissive.jpg');
  var s = 0.8;
  blobMesh.scale.set(s, s, s);
  material.needsUpdate = true;

  scene.add(blobMesh);
  // blobMesh.visible = false;
  // scene.add(pointsMesh);

  console.log("scene: " ,scene.children);
	textureCube.minFilter = THREE.LinearFilter;

  var colors = [blobColors.learn, blobColors.rest, blobColors.work];
  var c;
  for (var i = 0; i < 2; i++) {
    c = colors[i];
    createBlob(c);
  }

  // console.log("mesh: " ,mesh);
  // projects.push(project);

  console.log("scene: " ,scene);
  callback();
}

function setBlobProprties(mesh, s, p){
  var scale = 0.1 + (s*0.01);
  mesh.scale.set(scale, scale, scale);
  var gravity = 0.3;
  gravity = gravity + (p*0.01);
  p = 0.8 + (p*0.09);
  mesh.userData.scale = scale;
  mesh.userData.peak = p;
  mesh.userData.gravity = gravity;
}

function createBlobSlot(c, s, p, name, data){
  var cubeLoader = new THREE.CubeTextureLoader();
    cubeLoader.setPath('/assets/media/cube/');
    window.textureCube = cubeLoader.load([
      'px.png', 'nx.png',
    	'py.png', 'ny.png',
    	'pz.png', 'nz.png'
    ]);
  var geo = new THREE.SphereGeometry(.3, s*4, s*4);
  var mat  = new THREE.MeshBasicMaterial({
    // shininess: 100,
    // specular: 0xffffff,
    transparent: true,
    // envMap: textureCube,
    // shading: THREE.FlatShading,
    // side: THREE.DoubleSide,
    // alpha: true,
    // opacity: 0.8,
    // clearCoat: 0.7,
    // reflectivity: 1,
    metalness: 0,
    roughness: 0.3,
    // emissive: 0xffffff,
    // color: 0xffffff
    // color: 0x4e4279
    // color: 0x694dcb
    color: c
  });

  var bmesh = new THREE.Mesh(geo, mat);


  animate_vertices(bmesh, p, gravity);

  setBlobProprties(bmesh, s, p);

  bmesh.name = name;
  bmesh.userData.years = data.years;
  bmesh.userData.slots = data.slots;

  if (name != "base" && name != "default") {
    bmesh.userData.animate = true;
  }

  else {
    bmesh.userData.animate = false;
  }

  var meshParent = new THREE.Object3D();
  meshParent.add(bmesh);
  meshParent.rotation.x = Math.random() * 20;
  meshParent.rotation.y = Math.random() * 20;
  meshParent.rotation.z = Math.random() * 20;
  // labWrapper.add(meshParent);

  return bmesh;
}

function createSlot (c, s) {
  var geo = new THREE.SphereGeometry(.3, 50, 50);
  var mat  = new THREE.MeshStandardMaterial({
    // shininess: 100,
    // specular: 0xffffff,
    transparent: true,
    // shading: THREE.FlatShading,
    // side: THREE.DoubleSide,
    // alpha: true,
    opacity: 0.8,
    // clearCoat: 0.7,
    // reflectivity: 1,
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
  var scale = 0.03 + (s*0.01);
  bmesh.scale.set(scale, scale, scale);
  return bmesh;
}


function fitView() {
  var fov = camera.fov * ( Math.PI / 180 );
  camera.position.z = Math.abs( (totalWidth/2 + .6) / Math.sin( fov / 2 ) / camera.aspect );
}

function fitCameraToObject( camera, object, offset ) {

  offset = offset || 1.5;

  const boundingBox = new THREE.Box3();

  boundingBox.setFromObject( object );

  const center = boundingBox.getCenter( new THREE.Vector3() );
  const size = boundingBox.getSize( new THREE.Vector3() );

  const startDistance = center.distanceTo(camera.position);
  // here we must check if the screen is horizontal or vertical, because camera.fov is
  // based on the vertical direction.
  const endDistance = camera.aspect > 1 ?
  					((size.y/2)+offset) / Math.abs(Math.tan(camera.fov/2)) :
  					((size.y/2)+offset) / Math.abs(Math.tan(camera.fov/2)) / camera.aspect ;

  camera.position.z = camera.position.y * endDistance / startDistance;
  // camera.position.set(
  // 	camera.position.x * endDistance / startDistance,
  // 	camera.position.y * endDistance / startDistance,
  // 	camera.position.z * endDistance / startDistance,
  // 	);
  // camera.lookAt(center);
}


function array_move(arr, old_index, new_index) {
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr; // for testing
};


function makeTimeLine(dataArray){
  window.totalWidth = 0;
  var meshArray = [];
  for (var i = 0; i < dataArray.length; i++) {
    //Create random color for dataType
    var c = new THREE.Color( 0xffffff );
    c.setHex( Math.random() * 0xffffff );
    var dataType = dataArray[i];
    console.log("dataType: " ,dataType);
    for (var j = 0; j < dataType.slots; j++) {
      var s = dataType.years / dataType.slots;
      var mesh = createSlot(c, s);
      meshArray.push(mesh);
    }
  }

  for (var i = 0; i < meshArray.length; i++) {
    var mesh = meshArray[i];
    if (i > 0) {
      totalWidth += meshArray[i-1].scale.x + 0.2;
      mesh.position.x = totalWidth + (mesh.scale.x/2);
    }
    labWrapper.add(mesh);
  }

  for (var i = 0; i < meshArray.length; i++) {
    var mesh = meshArray[i];
    mesh.position.x -= totalWidth/2;
  }

  const boundingBox = new THREE.Box3();
  // get bounding box of object - this will be used to setup controls and camera
  boundingBox.setFromObject( labWrapper );
  console.log("boundingBox: " ,boundingBox);
  const size = boundingBox.getSize(new THREE.Vector3());
  console.log("bounding box size: " ,size)
  // get the max side of the bounding box (fits to width OR height as needed )
  const maxDim = Math.max( size.x, size.y, size.z );
  console.log("maxDim: " ,maxDim);

  fitView();
  console.log("camera.position.z: " ,camera.position.z);
}

function updateVerticalPosition(){
  var yPos = to3Dcoord(0, window.innerHeight - 100);
  if (!mobile_view) {
    yPos = to3Dcoord(0, window.innerHeight - (window.innerHeight/4));
  }
  yPos.y = yPos.y/camera.aspect;
  console.log("yPos: " ,yPos);
  console.log("camera.aspect: " ,camera.aspect);
  for (var i = 0; i < meshArray.length; i++) {
    var mesh = meshArray[i];
    mesh.position.y = yPos.y;
  }
}


function makeAbstractTimeLine(dataArray) {
  window.meshArray = [];
  window.totalWidth = 0;
  for (var i = 0; i < dataArray.length; i++) {
    //Create random color for dataType
    var c = new THREE.Color( 0xffffff );
    c.setHex( Math.random() * 0xffffff );
    console.log("color: " ,c.getHexString());
    var dataType = dataArray[i];
    console.log("dataType: " ,dataType);
    var mesh = createBlobSlot(dataType.color, dataType.years, dataType.slots, dataType.label, dataType);
    console.log("mesh: " ,mesh);
    meshArray.push(mesh);
  }

  console.log("meshArray: " ,meshArray);

  for (var i = 0; i < meshArray.length; i++) {
    var mesh = meshArray[i];
    if (i > 0) {
      totalWidth += (meshArray[i-1].scale.x) + 0.6 + mesh.scale.x;
      mesh.position.x = totalWidth;
    }
    labWrapper.add(mesh);
  }

  const boundingBox = new THREE.Box3();
  // get bounding box of object - this will be used to setup controls and camera
  boundingBox.setFromObject( labWrapper );
  console.log("boundingBox: " ,boundingBox);
  const size = boundingBox.getSize(new THREE.Vector3());
  console.log("bounding box size: " ,size)
  // get the max side of the bounding box (fits to width OR height as needed )
  const maxDim = Math.max( size.x, size.y, size.z );
  console.log("maxDim: " ,maxDim);

  // var yPos = to3Dcoord(0, window.innerHeight - (window.innerHeight/4));
  // console.log("yPos: " ,yPos);
  for (var i = 0; i < meshArray.length; i++) {
    var mesh = meshArray[i];
    mesh.position.x -= totalWidth/2;
    // mesh.position.y = yPos.y;
  }
  updateVerticalPosition();
  fitView();

}



function initiLabMode(mode, result, callback) {
  renderOn = false;
  $(canvas3D).fadeOut(function(){
    $(canvas2D).fadeOut();
    blobMesh.visible = false;
    blobsWrapper.visible = false;
    animation_mode = mode;
    $(canvas3D).toggleClass("no-pointer-e");
    callback(result, startRender);
  });
}


function loadLabVisuals(results, callback){
  var total = results.total;
  results.data.learn.color = blobColors.learn;
  results.data.work.color = blobColors.work;
  results.data.rest.color = blobColors.rest;
  console.log("Parsing result for visuals: " ,results);

  var dataArray = [];
  Object.keys(results.data).map(function(value, key) {
    console.log(value, key);
    if (value != "base" && value != "default") {
      dataArray.push(results.data[value]);
    }
  });
  console.log("dataArray: " ,dataArray);

  // makeTimeLine(dataArray);
  makeAbstractTimeLine(dataArray);

  callback();
}


$(document).ready(function(){
	$('.middle').mousedown(function(e){
		console.log("click on middle!");
		e.stopPropagation();
		e.stopImmediatePropagation();
	});

});


function loadScene() {
  console.log("renderer3D.domElement: " ,renderer3D.domElement);

	mouse = new THREE.Vector2();
	raycaster = new THREE.Raycaster();
	worldVector = new THREE.Vector3();


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

  labWrapper = new THREE.Object3D();
	blobsWrapper = new THREE.Object3D();
	scene.add(blobsWrapper);
  scene.add(labWrapper);


  var ambLight = new THREE.AmbientLight( 0xffffff, 0.1 ); // soft white light
  // ambLight.layers.set( 1 );
  // scene.add( ambLight );

  var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.8 );
  directionalLight.position.set( .7, .8, .8 );
  // scene.add(directionalLight);

  var directionalLight2 = new THREE.DirectionalLight( 0xffffff, 0.9 );
  directionalLight2.position.set( -15, 0, -5 );
  scene.add(directionalLight2);

  var rectLight = new THREE.RectAreaLight( 0xffffff, 3.5,  20, 20 );
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
}


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

  canvas2D = document.getElementById('canvas2D');
  renderer2D = new THREE.CanvasRenderer({canvas: canvas2D, antialias: true, clearColor: 0x000000, clearAlpha: 0, alpha: true, autoClear: true});
  renderer2D.setPixelRatio(window.devicePixelRatio);
  renderer2D.setSize(window.innerWidth / canvasRes, window.innerHeight / canvasRes, false);


	canvas3D = document.getElementById('canvas3D');
	renderer3D = new THREE.WebGLRenderer( { canvas: canvas3D, antialias: true, clearColor: 0x000000, clearAlpha: 0, alpha: true, preserveDrawingBuffer: false, autoClear: true });
  // scene.background = new THREE.Color( 0xefefef );
	renderer3D.setPixelRatio(window.devicePixelRatio);
	renderer3D.setSize(window.innerWidth / canvasRes, window.innerHeight / canvasRes, false);

  camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.z = 4;


	// var container = document.getElementById('container');
	// container.appendChild( renderer3D.domElement);

  loadScene();

  onWindowResize();

  $(canvas3D).hide();
  $(canvas2D).hide();

  console.log("animation_mode: " ,animation_mode);

  console.log("lauyout: " ,{{layout | jsonify}});

  if (animation_mode == "blobs") {
      console.log("starting blobs mode!");
      loadBlobs(startRender);
  }

  if (animation_mode == "lab") {
    console.log("starting lab mode!");
    // console.log("latest result: " ,latestResult);
  }


	// load();
  // animate();



	var PI2 = Math.PI * 2;

	clock = new THREE.Clock();

  window.addEventListener( 'resize', onWindowResize, false );
  // document.addEventListener('mousedown', onDocumentMouseDown, false);
  document.addEventListener( 'mousemove', onMouseMove, false );
  renderer3D.domElement.addEventListener("mousedown", onDocumentMouseDown, true);

}





function clickedBlob (intersects){
  if (intersects.length > 0) {
    var blob = intersects[0].object;
    // clickedBlob = blob;
    console.log("clicked blob: " ,blob);
    for (var i = 0; i < meshArray.length; i++) {
      if (meshArray[i].name != blob.name) {
        meshArray[i].material.opacity = 0.5;
      }
      else {
        meshArray[i].material.opacity = 1.0;
      }
    }

    // if (filter) {
      var active_filter = $('#filter-select').val().toLowerCase();
      var groupObject = data_highlights[active_filter];
      var amount = Math.round(((groupObject.highlights[blob.name].quantity / groupObject.entries)*100) * 10) / 10;
      if (blob.name == "work") {
          $('#results-info-second').html("<div class='work-color'><p>"+amount+"% of those surveyed said they would switch workplace every "+groupObject.highlights[blob.name].change+" years.</p></div>");
      }
      if (blob.name == "learn") {
          $('#results-info-second').html("<div class='learn-color'><p>"+amount+"% of those surveyed said they would pause working and have education be their primary occupation <span class='text-lowercase'>"+groupObject.highlights[blob.name].answer+".</span></p></div>");
      }
      if (blob.name == "rest") {
          $('#results-info-second').html('<div class="rest-color"><p class="">'+amount+'% of those surveyed said:</p><p>"'+groupObject.highlights[blob.name].answer+'."</p></div>');
      }
      $('#results-info-second').append("<p>How does that change the future of work?<br><a class='no-underline' href='/hackathon'>Join the hackathon to find out →</a></p>");
    // }
    /*else {
      var groupObject = data_highlights.all;
      var amount = Math.round(((groupObject.highlights[blob.name].quantity / groupObject.entries)*100) * 10) / 10;
      // $('#results-info-first').text("Clicked on " +capitalizeFirstLetter(blob.name)+".");
      $('#results-info-second').text("[Interesting data goes here]");
      if (blob.name == "work") {
          $('#results-info-first').html("<div class='work-color'>"+amount+"% of those surveyed said they would switch workplace every "+groupObject.highlights[blob.name].change+" years.</div>");
      }
      if (blob.name == "learn") {
          $('#results-info-first').html("<div class='learn-color'>"+amount+"% of those surveyed said they would pause working and have education be their primary occupation <span class='text-lowercase'>"+groupObject.highlights[blob.name].answer+".</span></div>");
      }
      if (blob.name == "rest") {
          $('#results-info-first').html('<div class="rest-color">('+amount+'%) of those surveyed said:</p><p>"'+groupObject.highlights[blob.name].answer+'."</div>');
      }
      $('#results-info-second').html("<p>How does that change the future of work?<br><a class='no-underline' href='/hackathon'>Join the hackathon to find out →</a></p>");
    }*/
  }
  else {
    for (var i = 0; i < meshArray.length; i++) {
        meshArray[i].material.opacity = 1.0;
    }
    if (filter) {
      $('#results-info-second').text("Click one of the blobs to explore insights and trends within each category:");
    }

    else {
      $('#results-info-second').text("Click one of the blobs to explore how your ideal future of work compares to the rest of the results:");
      // $('#results-info-second').text("");
    }
  }


}


function onDocumentMouseDown(event) {
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

  console.log("clicked: " ,mouse);

  raycaster.setFromCamera( mouse, camera );
  // calculate objects intersecting the picking ray
  window.intersects = raycaster.intersectObjects( labWrapper.children, true );
  clickedBlob(intersects);

}

function to3Dcoord (x, y) {
  x = ( x / window.innerWidth ) * 2 - 1;
	y = - ( y / window.innerHeight ) * 2 + 1;
  return {
    x: x,
    y: y
  }
}

function onMouseMove( event ) {

}




function toScreenXY(position, camera, canvas) {
  var pos = position.clone();
  var projScreenMat = new THREE.Matrix4();
  projScreenMat.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
 // projScreenMat.multiplyVector3( pos );
	pos.applyMatrix4(projScreenMat);
  return { x: (( pos.x + 1 ) * canvas.width / 2  + canvas.offsetLeft),
      y: (( - pos.y + 1) * canvas.height / 2 + canvas.offsetTop) };
}


function toScreenCoords (v){
  console.log("v before projection: ",v);
  v.project(camera);
  console.log("v after projection: ",v);
  let widthHalf = renderer3D.width / 2;
  let heightHalf = renderer3D.height / 2;
  v.x = (v.x * widthHalf) + widthHalf;
  v.y = - (v.y * heightHalf) + heightHalf;
  v.z = 0;
  return v;
}

const visibleHeightAtZDepth = ( depth, camera ) => {
  // compensate for cameras not positioned at z=0
  const cameraOffset = camera.position.z;
  if ( depth < cameraOffset ) depth -= cameraOffset;
  else depth += cameraOffset;

  // vertical fov in radians
  const vFOV = camera.fov * Math.PI / 180;

  // Math.abs to ensure the result is always positive
  return 2 * Math.tan( vFOV / 2 ) * Math.abs( depth );
};

const visibleWidthAtZDepth = ( depth, camera ) => {
  const height = visibleHeightAtZDepth( depth, camera );
  return height * camera.aspect;
};


function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


function animate() {
  if (!renderOn) return;

  if (animation_mode == "blobs") {
    animate_vertices(blobMesh, 1, 0.3);

    blobsWrapper.rotation.x += .002;
    blobsWrapper.rotation.y += .0009;
    for (var i = 0; i < blobsWrapper.children.length; i++) {
      var thisObject = blobsWrapper.children[i].children[0];
      thisObject.rotation.y += 0.01;
      thisObject.rotation.x += 0.009;
    }

    blobMesh.rotation.y = time * .1;
    blobMesh.rotation.z = time * .03;


    blobMesh.position.x = noise.perlin2(time, time/4000) * 0.5;
    blobMesh.position.y = noise.perlin2(time+1000, time/4000) * 0.5;
    blobMesh.position.z = noise.perlin2(time+2000, time/4000) * 0.4;
  }

  else if (animation_mode == "lab") {
    for (var i = 0; i < meshArray.length; i++) {
      if (meshArray[i].userData.animate) {
        animate_vertices(meshArray[i], meshArray[i].userData.peak, meshArray[i].userData.gravity);
      }
    }


    ctx2d = renderer2D.domElement.getContext('2d');
    ctx2d.clearRect (0, 0, window.innerWidth*window.devicePixelRatio, window.innerHeight*devicePixelRatio);
    ctx2d.fillStyle = "#ffffff";
    var fontSize = 14 * window.devicePixelRatio;
    if (window.innerWidth < 700) {
      fontSize = 10 * window.devicePixelRatio;
    }

    ctx2d.font = +fontSize+ 'pt Open Sans';
    ctx2d.textAlign = 'center';


    // labWrapper.rotation.x += .002;
    // labWrapper.rotation.y += .0009;
    for (var i = 0; i < labWrapper.children.length; i++) {
      var thisObject = labWrapper.children[i];
      thisObject.rotation.y += 0.005;
      thisObject.rotation.x += 0.009;

      var v =  new THREE.Vector3();
      v.setFromMatrixPosition( thisObject.matrixWorld );
      // var r = dataVertices[i].radius;
      var c =  toScreenXY(v, camera, renderer3D.domElement);
      if (thisObject.name !== null){
        ctx2d.beginPath();
        ctx2d.moveTo(c.x, c.y + (20 * window.devicePixelRatio));
        ctx2d.lineTo(c.x, canvas2D.height-(120 * window.devicePixelRatio));
        ctx2d.strokeStyle = "white";
        ctx2d.stroke();
        var name = thisObject.name;
        var years = (Math.round(thisObject.userData.years  * 10) / 10).toString() + " years";
        var slots = (Math.round(thisObject.userData.slots * 10) / 10).toString();
        // Math.round( number * 10 ) / 10
        if (thisObject.name == "learn") {
          name = "educations"
          name = slots + " " + capitalizeFirstLetter(name);
        }

        if (thisObject.name == "work") {
          name = "workplaces"
          name = slots + " " + capitalizeFirstLetter(name);
        }

        if (thisObject.name == "rest") {
          name = "retirements"
          name = slots + " " + capitalizeFirstLetter(name);
        }

        // console.log("thisObject.userData.years: " ,years);


        if (window.innerWidth < 700) {
          ctx2d.fillText(capitalizeFirstLetter(name), c.x, canvas2D.height-(90 * window.devicePixelRatio));
          // ctx2d.fillText(capitalizeFirstLetter(years), c.x, canvas2D.height-(75 * window.devicePixelRatio));
          // ctx2d.fillText(capitalizeFirstLetter(slots), c.x, canvas2D.height-(60 * window.devicePixelRatio));
        }
        else {
          ctx2d.fillText(capitalizeFirstLetter(name), c.x, canvas2D.height-(100 * window.devicePixelRatio));
          // ctx2d.fillText(capitalizeFirstLetter(years), c.x, canvas2D.height-(75 * window.devicePixelRatio));
          // ctx2d.fillText(capitalizeFirstLetter(slots), c.x, canvas2D.height-(50 * window.devicePixelRatio));
        }
        // ctx2d.fillText(projects[i].description, c.x + (10 * window.devicePixelRatio), c.y + (10*devicePixelRatio));
      }
    }

  }


  {% if jekyll.environment == "production" %}

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

  if (typeof meshArray !== "undefined") {
    updateVerticalPosition();
  }

  if (window.innerWidth < 576) {
    window.mobile_view = true;
  }

  else {
    window.mobile_view = false;
  }

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
  // console.log("animation_mode: " ,animation_mode);
  if (animation_mode == "lab") {
    fitView();
  }

	renderer3D.setSize( window.innerWidth / canvasRes, window.innerHeight / canvasRes, false);
  renderer2D.setSize( window.innerWidth / canvasRes, window.innerHeight / canvasRes, false);
	// console.log("window width: " ,window.innerWidth);
	// console.log("window height: " ,window.innerHeight);

}
