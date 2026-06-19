console.log("FINAL BOSS CINEMATIC MODE");

const scene = new THREE.Scene();

// 🌌 DEPTH SPACE (WAJIB BIAR TIDAK FLAT)
scene.fog = new THREE.FogExp2(0x050714, 0.025);

// ================= CAMERA =================
const camera = new THREE.PerspectiveCamera(
  60,
  innerWidth / innerHeight,
  0.1,
  2000
);

camera.position.z = 7;

// ================= RENDERER =================
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true
});

renderer.setSize(innerWidth, innerHeight);
document.getElementById("three").appendChild(renderer.domElement);

// ================= LIGHT =================
scene.add(new THREE.AmbientLight(0xffffff, 0.6));

const light = new THREE.PointLight(0xff4fd8, 4);
light.position.set(5, 5, 5);
scene.add(light);

// ================= PLANET =================
const planet = new THREE.Mesh(
  new THREE.SphereGeometry(1.6, 64, 64),
  new THREE.MeshStandardMaterial({
    color: 0xff4fa3,
    emissive: 0xff2a8a,
    emissiveIntensity: 0.7
  })
);
scene.add(planet);

// 🌈 ATMOSPHERE GLOW
const atmosphere = new THREE.Mesh(
  new THREE.SphereGeometry(2.4, 64, 64),
  new THREE.MeshBasicMaterial({
    color: 0xff66cc,
    transparent: true,
    opacity: 0.2,
    side: THREE.BackSide
  })
);
scene.add(atmosphere);

// ================= STARFIELD (FINAL VERSION) =================
const starGeo = new THREE.BufferGeometry();
const starCount = 2500;
const starPos = [];

for (let i = 0; i < starCount; i++) {
  starPos.push(
    (Math.random() - 0.5) * 400,
    (Math.random() - 0.5) * 400,
    (Math.random() - 0.5) * 400
  );
}

starGeo.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(starPos, 3)
);

const stars = new THREE.Points(
  starGeo,
  new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.4,
    transparent: true,
    opacity: 0.9
  })
);

scene.add(stars);

// ================= TEXTURE =================
const loader = new THREE.TextureLoader();

function tex(n){
  return loader.load("./"+n);
}

const imgs = [
  tex("1.jpg"),tex("2.jpg"),tex("3.jpg"),tex("4.jpg"),
  tex("5.jpg"),tex("6.jpg"),tex("7.jpg"),tex("8.jpg")
];

// ================= ORBIT SYSTEM (FINAL CINEMATIC) =================
const layers = [];

function orbit(radius, speed, count, depthOffset){

  const g = new THREE.Group();

  for (let i = 0; i < count; i++) {

    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(0.75, 0.75),
      new THREE.MeshBasicMaterial({
        map: imgs[i % 8],
        transparent: true
      })
    );

    m.userData = {
      a: Math.random() * Math.PI * 2,
      r: radius,
      s: speed,
      d: depthOffset
    };

    g.add(m);
  }

  scene.add(g);
  layers.push(g);
}

// 🔥 layered depth orbit (biar cinematic)
orbit(2.3, 0.003, 20, 0.2);
orbit(3.4, 0.002, 26, 0.0);
orbit(4.6, 0.0015, 30, -0.2);

// ================= SCENE STATE =================
let sceneState = 0;
let punch = 0;

// ================= UI BUTTON =================
const btn = document.createElement("button");
btn.innerText = "🌍 JELAJAH";

Object.assign(btn.style, {
  position: "fixed",
  bottom: "80px",
  left: "50%",
  transform: "translateX(-50%)",
  zIndex: 9999,
  padding: "12px 20px",
  borderRadius: "20px",
  border: "none",
  background: "rgba(255,255,255,0.2)",
  color: "white",
  display: "none"
});

document.body.appendChild(btn);

// ================= TEXT SCENE =================
const text = document.createElement("div");
Object.assign(text.style, {
  position:"fixed",
  top:"50%",
  left:"50%",
  transform:"translate(-50%,-50%)",
  color:"white",
  textAlign:"center",
  fontSize:"18px",
  opacity:"0",
  zIndex:9999
});

text.innerHTML = "masa di sini mulu?<br><b>jelajah aja napa?</b>";
document.body.appendChild(text);

// ================= ENTER =================
document.getElementById("enter").onclick = () => {

  document.getElementById("ui").style.display = "none";
  document.getElementById("bgm")?.play().catch(()=>{});

  sceneState = 1;

  btn.style.display = "block";

  punch = 1;
  setTimeout(()=>punch = 0, 600);
};

// ================= BUTTON =================
btn.onclick = () => {
  sceneState = 2;
  btn.style.display = "none";

  punch = 1;
  setTimeout(()=>punch = 0, 600);
};

// ================= DRAG CAMERA =================
let drag=false, px=0, py=0;
let tx=0, ty=0;

function down(x,y){drag=true;px=x;py=y;}
function move(x,y){
  if(!drag) return;
  tx += (x-px)*0.004;
  ty += (y-py)*0.004;
  px=x; py=y;
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
  atmosphere.rotation.y += 0.001;

  stars.rotation.y += 0.0002;

  // ORBIT ONLY SCENE 3
  if(sceneState === 3){

    layers.forEach(l=>{
      l.children.forEach(m=>{

        m.userData.a += m.userData.s;

        m.position.x = Math.cos(m.userData.a)*m.userData.r;
        m.position.z = Math.sin(m.userData.a)*m.userData.r;

        m.position.y = Math.sin(m.userData.a) * m.userData.d;

        m.lookAt(camera.position);
      });
    });
  }

  // ================= CAMERA SCENE =================
  let targetZ = 7;

  if(sceneState === 1) targetZ = 6;
  if(sceneState === 2){
    targetZ = 3.5;
    text.style.opacity = 1;

    setTimeout(()=>{
      sceneState = 3;
      text.style.opacity = 0;
    }, 2500);
  }
  if(sceneState === 3) targetZ = 6;

  camera.position.z += (targetZ - camera.position.z) * 0.06;
  camera.position.x += (tx - camera.position.x) * 0.08;
  camera.position.y += (ty - camera.position.y) * 0.08;

  // 🎥 CINEMATIC PUNCH
  camera.fov = punch ? 75 : 60;
  camera.updateProjectionMatrix();

  renderer.domElement.style.filter =
    punch ? "brightness(2) blur(2px)" : "brightness(1) blur(0px)";

  renderer.render(scene, camera);
}

animate();

// ================= RESIZE =================
window.addEventListener("resize",()=>{
  camera.aspect = innerWidth/innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth,innerHeight);
});
