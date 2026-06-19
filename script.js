window.onerror = function(msg, src, line){
  console.log("JS ERROR:", msg, "line:", line);
};

console.log("PLANET 3D FULL FINAL START");

// ===================== THREE SETUP =====================
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  60,
  innerWidth / innerHeight,
  0.1,
  2000
);

camera.position.z = 7;

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true
});

renderer.setSize(innerWidth, innerHeight);
document.getElementById("three").appendChild(renderer.domElement);

// ===================== LIGHT =====================
scene.add(new THREE.AmbientLight(0xffffff, 0.5));

const light = new THREE.PointLight(0xff4fd8, 3);
light.position.set(5, 5, 5);
scene.add(light);

// ===================== PLANET =====================
const planet = new THREE.Mesh(
  new THREE.SphereGeometry(1.6, 64, 64),
  new THREE.MeshStandardMaterial({
    color: 0xff4fa3,
    emissive: 0xff2a8a,
    emissiveIntensity: 0.6
  })
);

scene.add(planet);

// glow layer
const glow = new THREE.Mesh(
  new THREE.SphereGeometry(2.1, 64, 64),
  new THREE.MeshBasicMaterial({
    color: 0xff66cc,
    transparent: true,
    opacity: 0.12
  })
);

scene.add(glow);

// ===================== TEXTURE =====================
const loader = new THREE.TextureLoader();

function tex(file){
  return loader.load("./" + file);
}

const imgs = [
  tex("1.jpg"), tex("2.jpg"), tex("3.jpg"), tex("4.jpg"),
  tex("5.jpg"), tex("6.jpg"), tex("7.jpg"), tex("8.jpg")
];

// ===================== ORBIT SYSTEM =====================
const layers = [];

function createOrbit(radius, speed, count){

  const group = new THREE.Group();

  for(let i=0;i<count;i++){

    const mat = new THREE.MeshBasicMaterial({
      map: imgs[i % 8],
      transparent: true
    });

    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(0.7, 0.7),
      mat
    );

    mesh.userData = {
      a: Math.random() * Math.PI * 2,
      r: radius,
      s: speed
    };

    group.add(mesh);
  }

  scene.add(group);
  layers.push(group);
}

// VIRAL DENSITY ORBIT
createOrbit(2.3, 0.003, 20);
createOrbit(3.2, 0.002, 26);
createOrbit(4.3, 0.0015, 30);
createOrbit(5.2, 0.0012, 34);

// ===================== ENTER BUTTON =====================
document.addEventListener("DOMContentLoaded", () => {

  const btn = document.getElementById("enter");
  const ui = document.getElementById("ui");
  const audio = document.getElementById("bgm");

  if(!btn){
    alert("ENTER NOT FOUND");
    return;
  }

  btn.onclick = () => {
    ui.style.display = "none";
    audio?.play().catch(()=>{});
  };

});

// ===================== DRAG CAMERA CONTROL =====================
let isDragging = false;
let previousX = 0;
let previousY = 0;

let targetRotX = 0;
let targetRotY = 0;

function startDrag(x, y){
  isDragging = true;
  previousX = x;
  previousY = y;
}

function moveDrag(x, y){
  if(!isDragging) return;

  let dx = x - previousX;
  let dy = y - previousY;

  targetRotY += dx * 0.005;
  targetRotX += dy * 0.005;

  previousX = x;
  previousY = y;
}

function endDrag(){
  isDragging = false;
}

// mouse
window.addEventListener("mousedown", (e)=>startDrag(e.clientX, e.clientY));
window.addEventListener("mousemove", (e)=>moveDrag(e.clientX, e.clientY));
window.addEventListener("mouseup", endDrag);

// touch
window.addEventListener("touchstart", (e)=>{
  startDrag(e.touches[0].clientX, e.touches[0].clientY);
});

window.addEventListener("touchmove", (e)=>{
  moveDrag(e.touches[0].clientX, e.touches[0].clientY);
});

window.addEventListener("touchend", endDrag);

// ===================== ANIMATION LOOP =====================
let t = 0;

function animate(){

  requestAnimationFrame(animate);

  t += 0.01;

  // planet rotate
  planet.rotation.y += 0.002;
  glow.rotation.y += 0.001;

  // orbit update
  layers.forEach(layer=>{
    layer.children.forEach(m=>{

      m.userData.a += m.userData.s;

      m.position.x = Math.cos(m.userData.a) * m.userData.r;
      m.position.z = Math.sin(m.userData.a) * m.userData.r;

      m.lookAt(camera.position);

    });
  });

  // smooth camera (DRAG + FLOAT)
  camera.position.x += (targetRotY - camera.position.x) * 0.08;
  camera.position.y += (targetRotX - camera.position.y) * 0.08;
  camera.position.z = 7;

  renderer.render(scene, camera);
}

animate();

// ===================== RESIZE =====================
window.addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
