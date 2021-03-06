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
  learn: 0x14e05f,
  work: 0x6c5ba5,
  rest: 0xff3c26
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



function animate_vertices(mesh, pk, grav){
  // k = (noise.perlin2(time/100, time)) * 2 + 2.2;
  time = performance.now() * 0.0004;

  // k += 0.001;
  // k = (mouse.x + 1) * 2;
  for (var i = 0; i < mesh.geometry.vertices.length; i++) {
      var p = mesh.geometry.vertices[i];
      p.normalize().multiplyScalar(1 + grav * noise.perlin3(p.x * pk + time, p.y * pk, p.z * pk));
  }
  mesh.geometry.computeVertexNormals();
  mesh.geometry.verticesNeedUpdate = true; //must be set or vertices will not update
}


function createBlob(c, l) {
  var geo = new THREE.SphereGeometry(.3, 50, 50);
  var mat  = new THREE.MeshStandardMaterial({
    // transparent: true,
    // shading: THREE.FlatShading,
    // side: THREE.DoubleSide,
    // alpha: true,
    opacity: 1,
    metalness: 0.4,
    roughness: 0.8,
    emissive: c,
    emissiveIntensity: 0.7,
    // fog: false,
    // emissive: 0xffffff,
    // color: 0xffffff
    // color: 0x4e4279
    // color: 0x694dcb
    color: c
  });


  var bmesh = new THREE.Mesh(geo, mat);
  bmesh.name = l;
  animate_vertices(bmesh, 0.9, 0.5);
  var s = Math.random() * .2 + .3;
  bmesh.scale.set(s, s, s);
  var distance = .38 + (s/6);
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
      if (projection_mode) {
        capturer.start();
      }
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

    textureCube.format = THREE.RGBFormat;

  var blobGeometry   = new THREE.SphereGeometry(1, 50, 50);
  var material = new THREE.MeshStandardMaterial({
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
    clearCoat: 0.1,
    // alpha: true,
    opacity: 1,
    // reflectivity: 1,
    metalness: .3,
    roughness: 0.7,
    fog: false,
    emissive: 0x3f2a85, //0x3f2a85
    emissiveIntensity: 0.7,
    // emissive: 0xffffff,
    // color: 0xffffff
    // color: 0x4e4279
    // color: 0x694dcb
    color: blobColors.work // 6c5ba5
  });

  // material.envMap = textureCube;

  var pmat = new THREE.PointsMaterial( {
    size: .02,
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
  // window.blobMesh = new THREE.Points(blobGeometry, pmat);
  blobMesh.name = "work"
  // material.emissiveMap = textureLoader.load('{{site.image_path}}/trr-emissive.jpg');
  var s = 0.8;
  blobMesh.scale.set(s, s, s);
  // material.needsUpdate = true;

  scene.add(blobMesh);
  // blobMesh.visible = false;
  // scene.add(pointsMesh);

  console.log("scene: " ,scene.children);
	textureCube.minFilter = THREE.LinearFilter;
  console.log("page url: " ,{{page.url | jsonify}});
  var colors = [blobColors.learn, blobColors.rest, blobColors.work];
  var labels = ["learn", "rest", "work"];
  if (projection_mode) {
    labels = ["swedish", "lab", "work"];
  }
  var c;
  var l;
  for (var i = 0; i < 2; i++) {
    c = colors[i];
    l = labels[i];
    createBlob(c, l);
  }

  // console.log("mesh: " ,mesh);
  // projects.push(project);

  console.log("scene: " ,scene);
  callback();
}

function setBlobProprties(mesh, s, p){
  var scale = 0.2 + (s*0.01);
  mesh.scale.set(scale, scale, scale);
  var gravity = 0.3;
  gravity = gravity + (p*0.001);
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
  var mat  = new THREE.MeshStandardMaterial({
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
    opacity: 1,
    metalness: 0.4,
    roughness: 0.8,
    emissive: c,
    emissiveIntensity: 0.7,
    fog: false,
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

	// controls = new THREE.TrackballControls(camera, renderer3D.domElement);
	// controls.enableDamping = true;
	// controls.dampingFactor = 1.0;
	// controls.enableZoom = true;
  scene.fog = new THREE.Fog( 0xbabaab, 3, 6.5);
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
  directionalLight.position.set(-10, 0, -5 );
  // scene.add(directionalLight);

  var directionalLight2 = new THREE.DirectionalLight( 0xffffff, .7 );
  directionalLight2.position.set( 7, 0, 5 );
  scene.add(directionalLight2);

  var rectLight = new THREE.RectAreaLight( 0xffffff, 3.0,  20, 20 );
  rectLight.position.set( -15, 0, -5 );
  rectLight.lookAt( 0, 0, 0 );
  scene.add( rectLight );

  var hemlight = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
  scene.add( hemlight );

  var spotLight = new THREE.SpotLight( 0xffffff );
  spotLight.position.set( 100, 0, 100 );

  spotLight.castShadow = true;

  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;

  spotLight.shadow.camera.near = 500;
  spotLight.shadow.camera.far = 4000;
  spotLight.shadow.camera.fov = 30;

  // scene.add( spotLight );



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

  if (projection_mode) {
    window.capturer = new CCapture( {
    	framerate: 60,
    	verbose: true,
      timeLimit: 20,
      format: 'png'
    } );
  }

}


function init() {

	$( "#canvas3D").click(function(e) {
		// event.stopPropagation();
		//e.preventDefault();
	  	console.log("clicked canvas!");
	  	//return false;
	});


	scene = new THREE.Scene();

  canvas2D = document.getElementById('canvas2D');
  renderer2D = new THREE.CanvasRenderer({canvas: canvas2D, antialias: true, clearColor: 0x000000, clearAlpha: 0, alpha: true, autoClear: true});
  renderer2D.setPixelRatio(window.devicePixelRatio);
  renderer2D.setSize(window.innerWidth / canvasRes, window.innerHeight / canvasRes, false);

	canvas3D = document.getElementById('canvas3D');
	renderer3D = new THREE.WebGLRenderer( { canvas: canvas3D, antialias: true, clearColor: 0x000000, clearAlpha: 0, alpha: true, preserveDrawingBuffer: false, autoClear: true });
  // scene.background = new THREE.Color( 0xabab96 );
	renderer3D.setPixelRatio(window.devicePixelRatio);
	renderer3D.setSize(window.innerWidth / canvasRes, window.innerHeight / canvasRes, false);

  camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.z = 4;


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
  }


	// load();
  // animate();


	clock = new THREE.Clock();

  window.addEventListener( 'resize', onWindowResize, false );
  // document.addEventListener('mousedown', onDocumentMouseDown, false);
  document.addEventListener( 'mousemove', onMouseMove, false );
  renderer3D.domElement.addEventListener("mousedown", onDocumentMouseDown, true);

}


function clickedBlob (intersects){

  if (animation_mode == "lab") {
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

      if (filter) {
        // var active_filter = $('#filter-select').val().toLowerCase();
        // var groupObject = data_highlights[active_filter];
        var category = blob.name;
        // var data1 =

        var age1 = Math.floor(Math.random()*Object.keys(data_highlights.ages).length);
        var age2 = Math.floor(Math.random()*Object.keys(data_highlights.ages).length);


        while (age2 == age1) {
          age2 = Math.floor(Math.random()*Object.keys(data_highlights.ages).length);
        }

        age1 = Object.keys(data_highlights.ages)[age1];
        age2 = Object.keys(data_highlights.ages)[age2];

        console.log("age1: " ,age1);
        console.log("age2: " ,age2);


        // COMPARING MOST EXTREME
        // var max = data_highlights.all.greatest[blob.name].max;
        // var min = data_highlights.all.greatest[blob.name].min;

        var max = data_highlights.ages[age1].highlights[blob.name];
        var min = data_highlights.ages[age2].data.categories.answers[blob.name][max.answer];

        var amountMax = Math.round(((max.percentage)*100) * 10) / 10;
        var amountMin = Math.round(((min.percentage)*100) * 10) / 10;

        if (blob.name == "work") {
            $('#results-info-first').html("<div class='work-color'><p>"+amountMin+"% of those in age group "+age1+" said they would switch workplace every "+max.change+" years, compared to "+amountMax+"% of those in age group "+age2+".</p></div>");
        }
        if (blob.name == "learn") {
            $('#results-info-first').html("<div class='learn-color'><p>"+amountMin+"% of those surveyed in age group "+age1+" said they would pause working and have education be their primary occupation <span class='text-lowercase'>"+max.answer+", compared to "+amountMax+"% of those in age group "+age2+".</span></p></div>");
        }
        if (blob.name == "rest") {
            $('#results-info-first').html('<div class="rest-color"><p class="">'+amountMin+'% of those surveyed in age group '+age1+' said "'+max.answer+'", compared to '+amountMax+'% of those in age group '+age2+'.</p></div>');
        }
        // $('#results-info-first').append("<p>How does that change the future of work?<br><a class='no-underline' href='/hackathon'>Join the hackathon to find out →</a></p>");
      }

      else {
        var category = blob.name;
        var userObject = data_highlights.user;
        var highlight = data_highlights.ages[userObject.age].highlights[category];

        // var max = data_highlights.all.greatest[category].max;
        // var min = data_highlights.user.data.parsed[category];
        var highlightAmount = Math.round(((highlight.percentage)*100) * 10) / 10;
        // var amountMax = Math.round(((max.percentage)*100) * 10) / 10;
        // var amountMin = Math.round(((min.percentage)*100) * 10) / 10;

        if (blob.name == "work") {
            $('#results-info-first').html("<div class='work-color'><p>"+highlightAmount+"% of those in the same age group as you ("+userObject.age+") said they would switch workplace every "+highlight.change+" years.</p></div>");
        }
        if (blob.name == "learn") {
            $('#results-info-first').html("<div class='learn-color'><p>"+highlightAmount+"% of those in the same age group as you ("+userObject.age+") said they would pause working and have education be their primary occupation <span class='text-lowercase'>"+highlight.answer+".</span></p></div>");
        }
        if (blob.name == "rest") {
            $('#results-info-first').html('<div class="rest-color"><p class="">'+highlightAmount+'% of those in the same age group as you ('+userObject.age+') said "'+highlight.answer+'".</p></div>');
        }
        // $('#results-info-first').append("<p>How does that change the future of work?<br><a class='no-underline' href='/hackathon'>Join the hackathon to find out →</a></p>");
      }
    }
    else {
      for (var i = 0; i < meshArray.length; i++) {
          meshArray[i].material.opacity = 1.0;
      }
      if (filter) {
        $('#results-info-first').text("Click one of the blobs to explore insights and trends within each category:");
      }

      else {
        $('#results-info-first').text("Click one of the blobs to explore how your ideal future of work compares to the rest of the results:");
        // $('#results-info-second').text("");
      }
    }
  }

  if (animation_mode == "blobs") {
    if (intersects.length > 0) {
      var blob = intersects[0].object;
      // clickedBlob = blob;
      console.log("clicked blob: " ,blob);
      {% if jekyll.environment == "development" %}
        var exporter = new THREE.STLExporter();
        var result = exporter.parse( blob, { binary: true } );
        saveArrayBuffer( result, 'blob.stl' );
      {% endif %}
    }
  }
}


function onDocumentMouseDown(event) {
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

  console.log("clicked: " ,mouse);

  raycaster.setFromCamera( mouse, camera );
  // calculate objects intersecting the picking ray
  if (animation_mode == "lab") {
    window.intersects = raycaster.intersectObjects( labWrapper.children, true );
  }

  else if (animation_mode == "blobs") {
    window.intersects = raycaster.intersectObjects( scene.children, true );
  }

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
  console.log("v after normalization: ",v);
  return v;
}



function animate() {
  if (!renderOn) return;

  ctx2d = renderer2D.domElement.getContext('2d');
  ctx2d.clearRect (0, 0, window.innerWidth*window.devicePixelRatio, window.innerHeight*devicePixelRatio);
  ctx2d.fillStyle = "#ffffff";


  if (animation_mode == "blobs") {
    animate_vertices(blobMesh, 1, 0.3);

    blobsWrapper.rotation.x += .002;
    blobsWrapper.rotation.y += .0009;
    for (var i = 0; i < blobsWrapper.children.length; i++) {
      var thisObject = blobsWrapper.children[i].children[0];
      animate_vertices(thisObject, 0.9, 0.5);
      // thisObject.rotation.y += 0.01;
      // thisObject.rotation.x += 0.009;
    }

    blobMesh.rotation.y = time * .1;
    blobMesh.rotation.z = time * .03;

    blobMesh.position.x = noise.perlin2(time, time/4000) * 0.5;
    blobMesh.position.y = noise.perlin2(time+1000, time/4000) * 0.5;
    blobMesh.position.z = noise.perlin2(time+2000, time/4000) * 0.4;

    scene.traverse(function(element){
      if (element.type == "Mesh" && blob_labels) {
        var thisObject = element;
        var direction =  new THREE.Vector3();
        direction.setFromMatrixPosition( thisObject.matrixWorld );
        // var direction = thisObject.position.clone();
        var startPoint = camera.position.clone();
        var directionVector = direction.sub( startPoint );
        raycaster.set( startPoint, directionVector.normalize() );
        var intersects = raycaster.intersectObjects( scene.children, true);
        if (intersects.length > 0) {
          ctx2d.fillStyle = "rgba(255, 255, 255,  0.8)";
          // console.log(intersects[0].object.name);
          if (intersects[0].object.name == thisObject.name) {
            var v =  new THREE.Vector3();
            v.setFromMatrixPosition( thisObject.matrixWorld );
            // var r = dataVertices[i].radius;
            var c =  toScreenXY(v, camera, renderer3D.domElement);
            if (thisObject.name !== null){
              var name = thisObject.name.toUpperCase();

              var fontSize = 12 * window.devicePixelRatio;
              if (window.innerWidth < 700) {
                fontSize = 9 * window.devicePixelRatio;
              }
              ctx2d.font = +fontSize+ 'pt Roboto Mono';
              ctx2d.textAlign = 'center';

              if (window.innerWidth < 700) {
                ctx2d.fillText(name, c.x, c.y);
                // ctx2d.fillText(capitalizeFirstLetter(years), c.x, canvas2D.height-(75 * window.devicePixelRatio));
                // ctx2d.fillText(capitalizeFirstLetter(slots), c.x, canvas2D.height-(60 * window.devicePixelRatio));
              }
              else {
                ctx2d.fillText(name, c.x, c.y);
                // ctx2d.fillText(capitalizeFirstLetter(years), c.x, canvas2D.height-(75 * window.devicePixelRatio));
                // ctx2d.fillText(capitalizeFirstLetter(slots), c.x, canvas2D.height-(50 * window.devicePixelRatio));
              }
              // ctx2d.fillText(projects[i].description, c.x + (10 * window.devicePixelRatio), c.y + (10*devicePixelRatio));
            }
          }
        }
      }
    });


  }

  else if (animation_mode == "lab") {
    for (var i = 0; i < meshArray.length; i++) {
      if (meshArray[i].userData.animate) {
        animate_vertices(meshArray[i], meshArray[i].userData.peak, meshArray[i].userData.gravity);
      }
    }

    // labWrapper.rotation.x += .002;
    // labWrapper.rotation.y += .0009;
    for (var i = 0; i < labWrapper.children.length; i++) {
      var thisObject = labWrapper.children[i];
      // thisObject.rotation.y += 0.005;
      // thisObject.rotation.x += 0.009;

      var v =  new THREE.Vector3();
      v.setFromMatrixPosition( thisObject.matrixWorld );
      // var r = dataVertices[i].radius;
      var c =  toScreenXY(v, camera, renderer3D.domElement);
      if (thisObject.name !== null){
        var fontSize = 14 * window.devicePixelRatio;
        if (window.innerWidth < 700) {
          fontSize = 10 * window.devicePixelRatio;
        }
        ctx2d.font = +fontSize+ 'pt Roboto Mono';
        ctx2d.textAlign = 'center';

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
  if (projection_mode) {
    capturer.capture( paperCanvas );
  }
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
