console.log("STABLE VERSION LOADED");

// ================= SCENE =================
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x050714, 0.03);

// ================= CAMERA =================
const camera = new THREE.PerspectiveCamera(
  60,
  innerWidth / innerHeight,
  0.1,
  2000
);
camera.position.z = 7;

// ================= RENDERER =================
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
document.getElementById("three").appendChild(renderer.domElement);

// ================= LIGHT =================
scene.add(new THREE.AmbientLight(0xffffff, 0.7));

const light = new THREE.PointLight(0xff4fd8, 3);
light.position.set(5,5,5);
scene.add(light);

// ================= PLANET =================
const planet = new THREE.Mesh(
  new THREE.SphereGeometry(1.6, 64, 64),
  new THREE.MeshStandardMaterial({
    color: 0xff4fa3,
    emissive: 0xff2a8a,
    emissiveIntensity: 0.6
  })
);
scene.add(planet);

// ================= ATMOSPHERE =================
const glow = new THREE.Mesh(
  new THREE.SphereGeometry(2.3, 64, 64),
  new THREE.MeshBasicMaterial({
    color: 0xff66cc,
    transparent: true,
    opacity: 0.2,
    side: THREE.BackSide
  })
);
scene.add(glow);

// ================= STARFIELD =================
const geo = new THREE.BufferGeometry();
const pos = [];

for(let i=0;i<1500;i++){
  pos.push(
    (Math.random()-0.5)*400,
    (Math.random()-0.5)*400,
    (Math.random()-0.5)*400
  );
}

geo.setAttribute("position", new THREE.Float32BufferAttribute(pos,3));

const stars = new THREE.Points(
  geo,
  new THREE.PointsMaterial({color:0xffffff,size:0.4})
);

scene.add(stars);

// ================= STATE =================
let state = 0;

// ================= UI =================
const ui = document.getElementById("ui");
const menu = document.getElementById("menu");
const paper = document.getElementById("paper");

// ENTER
document.getElementById("enter").onclick = () => {
  ui.classList.add("hidden");
  menu.classList.remove("hidden");
  document.getElementById("bgm")?.play().catch(()=>{});
  state = 1;
};

// JELAJAH
document.getElementById("goExplore").onclick = () => {
  menu.classList.add("hidden");
  state = 2;
};

// TETAP DI SINI
document.getElementById("stayHere").onclick = () => {
  menu.classList.add("hidden");
  paper.classList.remove("hidden");
  state = 3;
};

// PAPER → JELAJAH
document.getElementById("goExplore2").onclick = () => {
  paper.classList.add("hidden");
  state = 2;
};

// ================= CAMERA DRAG =================
let drag=false,px=0,py=0,tx=0,ty=0;

function down(x,y){drag=true;px=x;py=y;}
function move(x,y){
  if(!drag)return;
  tx+=(x-px)*0.004;
  ty+=(y-py)*0.004;
  px=x;py=y;
}
function up(){drag=false;}

window.onmousedown=e=>down(e.clientX,e.clientY);
window.onmousemove=e=>move(e.clientX,e.clientY);
window.onmouseup=up;

window.ontouchstart=e=>down(e.touches[0].clientX,e.touches[0].clientY);
window.ontouchmove=e=>move(e.touches[0].clientX,e.touches[0].clientY);
window.ontouchend=up;

// ================= LOOP =================
function animate(){
  requestAnimationFrame(animate);

  planet.rotation.y += 0.002;
  glow.rotation.y += 0.001;
  stars.rotation.y += 0.0002;

  let targetZ = 7;

  if(state === 2) targetZ = 6;   // planet
  if(state === 3) targetZ = 4;   // paper zoom

  camera.position.z += (targetZ - camera.position.z)*0.05;
  camera.position.x += (tx - camera.position.x)*0.08;
  camera.position.y += (ty - camera.position.y)*0.08;

  renderer.render(scene,camera);
}

animate();

// ================= RESIZE =================
window.addEventListener("resize",()=>{
  camera.aspect = innerWidth/innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth,innerHeight);
});
