var scene, material, geometry,camera,mesh,render;
var meshFloor;
function game(){
	var clock = new THREE.Clock();

 var scene = new THREE.Scene();
 scene.background = new THREE.Color( 0xcce0ff );

var camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight , 0.1, 1000);

var controls= new THREE.FirstPersonControls(camera);
controls.movementSpeed = 10;
controls.lookSpeed = 0.1;

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var geometry = new THREE.CubeGeometry(20, 20, 20);
var material = new THREE.MeshBasicMaterial({color: 0xff0000, wireframe:false });
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);

  meshFloor= new THREE.Mesh(
 new THREE.PlaneGeometry( 100, 100, 100 ),
 new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide}) 
);
  
camera.position.z = 100;
var render = function () {
    requestAnimationFrame(render);
  cube.rotation.x += 0.00;
  cube.rotation.y += 0.00;
	
	
	controls.update( clock.getDelta() );
	
    renderer.render(scene, camera);

};

render();

}


}

