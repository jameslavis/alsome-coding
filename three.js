var keyboard = {};
var player = { height:1.8, speed:0.2, turnSpeed:Math.PI*0.02 };

		var world;
        var fixedTimeStep = 1 / 60;
        var maxSubSteps = 3;
        var mass = 5;
        var lastTime;

        var camera, scene, renderer, controls;
        var geometry, material, mesh;
        var container, camera, scene, renderer, cannonDebugRenderer;
		var meshes=[];
		var bodies=[];
function start(){
		initCannon();
		initThree();
		addSphere();
		addBox();
		addCylinder();
		addTrimesh();
		addPlane();
		//addHeightfield();
		animate();
}
		function initThree(){
			container = document.createElement( 'div' );
            document.body.appendChild( container );
            // scene
            scene = new THREE.Scene();
            scene.fog = new THREE.Fog( 0x000000, 500, 10000 );
            // camera
            camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 0.5, 10000 );
            camera.position.set(0, player.height, -5);
			camera.lookAt(new THREE.Vector3(0,player.height,0));
			camera.up.set(0,1,0);
            scene.add(camera);
            material = new THREE.MeshLambertMaterial( { color: 0x777777 } );
            // lights
            scene.add( new THREE.AmbientLight( 0x111111 ) );
            var light = new THREE.DirectionalLight( 0xffffff, 1.75 );
            var d = 20;
            light.position.set( 40, 20, 30 );
            scene.add( light );
            renderer = new THREE.WebGLRenderer( { antialias: true } );
            renderer.setSize( window.innerWidth, window.innerHeight );
            renderer.setClearColor( scene.fog.color );
            container.appendChild( renderer.domElement );
            window.addEventListener( 'resize', onWindowResize, false );
            cannonDebugRenderer = new THREE.CannonDebugRenderer(scene, world);
	
		}
		function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize( window.innerWidth, window.innerHeight );
        
        }

		function animate(time){
			requestAnimationFrame(animate);
			 if(time && lastTime){
                var dt = time - lastTime;
                world.step(fixedTimeStep, dt / 1000, maxSubSteps);
				if(keyboard[87]){ // W key
		camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
		camera.position.z -= -Math.cos(camera.rotation.y) * player.speed;
	}
	if(keyboard[83]){ // S key
		camera.position.x += Math.sin(camera.rotation.y) * player.speed;
		camera.position.z += -Math.cos(camera.rotation.y) * player.speed;
	}
	if(keyboard[65]){ // A key
		// Redirect motion by 90 degrees
		camera.position.x += Math.sin(camera.rotation.y + Math.PI/2) * player.speed;
		camera.position.z += -Math.cos(camera.rotation.y + Math.PI/2) * player.speed;
	}
	if(keyboard[68]){ // D key
		camera.position.x += Math.sin(camera.rotation.y - Math.PI/2) * player.speed;
		camera.position.z += -Math.cos(camera.rotation.y - Math.PI/2) * player.speed;
	}
	
	// Keyboard turn inputs
	if(keyboard[37]){ // left arrow key
		camera.rotation.y -= player.turnSpeed;
	}
	if(keyboard[39]){ // right arrow key
		camera.rotation.y += player.turnSpeed;
	}
	if(keyboard[40]){
		camera.rotation.x+=player.turnSpeed;
	}
	if(keyboard[38]){
		camera.rotation.x-=player.turnSpeed;
	}
            }
		
		     updateMeshPositions();
            cannonDebugRenderer.update();
            
            renderer.render(scene, camera);
            lastTime = time;
        }
		function updateMeshPositions(){
            for(var i=0; i !== meshes.length; i++){
                meshes[i].position.copy(bodies[i].position);
                meshes[i].quaternion.copy(bodies[i].quaternion);
            }
		}
		   function initCannon(){
            world = new CANNON.World();
            world.gravity.set(0,-10,0);
            world.broadphase = new CANNON.NaiveBroadphase();
        }
		   function addPlane(){
            // Physics
            var shape = new CANNON.Plane();
            var body = new CANNON.Body({ mass: 0 });
            body.addShape(shape);
            body.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
            world.addBody(body);
            bodies.push(body);
            // Graphics
            geometry = new THREE.PlaneGeometry( 100, 100, 1, 1 );
            mesh = new THREE.Mesh( geometry, material );
            mesh.quaternion.setFromAxisAngle(new THREE.Vector3(1,0,0), -Math.PI / 2);
            scene.add(mesh);
            meshes.push(mesh);
        }
		   function addBox(){
            // Physics
            var shape = new CANNON.Box(new CANNON.Vec3(0.5,0.5,0.5));
            var body = new CANNON.Body({ mass: mass });
            body.addShape(shape);
            body.position.set(1,5,0);
            world.addBody(body);
            bodies.push(body);
            // Graphics
            var cubeGeo = new THREE.BoxGeometry( 1, 1, 1, 10, 10 );
            cubeMesh = new THREE.Mesh(cubeGeo, material);
            meshes.push(cubeMesh);
            scene.add(cubeMesh);
        }
		 function addSphere(){
            // Physics
            var body = new CANNON.Body({ mass: mass });
            var shape = new CANNON.Sphere(1);
            body.addShape(shape);
            body.position.set(-1,5,0);
            world.addBody(body);
            bodies.push(body);
            // Graphics
            var sphereGeo = new THREE.SphereGeometry(0.95, 20, 20);
            sphereMesh = new THREE.Mesh(sphereGeo, material);
            meshes.push(sphereMesh);
            scene.add(sphereMesh);
        }
        function addCylinder(){
            // Physics
            var body = new CANNON.Body({ mass: mass });
            var shape = new CANNON.Cylinder(1, 1, 1, 10);
            var quat = new CANNON.Quaternion(0.5, 0, 0, 0.5);
            quat.normalize();
            body.addShape(shape, new CANNON.Vec3, quat);
            body.position.set(-3,5,0);
            world.addBody(body);
            bodies.push(body);
            // Graphics
            var geo = new THREE.CylinderGeometry(1,1,1,20,20,false);
            var mesh = new THREE.Mesh(geo, material);
            meshes.push(mesh);
            scene.add(mesh);
        }
        function addTrimesh(){
            // Physics
            var body = new CANNON.Body({ mass: mass });
            var shape = new CANNON.Trimesh.createTorus(1, 0.3, 16, 16);
            body.addShape(shape);
            body.position.set(-6,5,0);
            world.addBody(body);
            bodies.push(body);
            // Graphics
            var geo = new THREE.TorusGeometry(1,0.3,16,100);
            var mesh = new THREE.Mesh(geo, material);
            meshes.push(mesh);
            scene.add(mesh);
        }
        /*function addHeightfield(){
            // Physics
            var body = new CANNON.Body({ mass: 0 });
            var matrix = [];
            var sizeX = 20, sizeY = 20;
            for (var i = 0; i < sizeX; i++) {
                matrix.push([]);
                for (var j = 0; j < sizeY; j++) {
                    var height = Math.cos(i/sizeX * Math.PI * 2)*Math.cos(j/sizeY * Math.PI * 2);
                    matrix[i].push(height);
                }
            }*
            var shape = new CANNON.Heightfield(matrix, { elementSize: 0.5 });
            var quat = new CANNON.Quaternion(-0.5, 0, 0, 0.5);
            quat.normalize();
            body.addShape(shape, new CANNON.Vec3, quat);
            body.position.set(6,1,0);
            world.addBody(body);
            bodies.push(body);
            // Graphics: empty for now
            var geo = new THREE.Geometry();
            var mesh = new THREE.Mesh(geo, material);
            meshes.push(mesh);
            scene.add(mesh);
        }*/
		function keyDown(event){
	keyboard[event.keyCode] = true;
}

function keyUp(event){
	keyboard[event.keyCode] = false;
}

window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);
