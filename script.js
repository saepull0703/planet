console.log("FULL SCENE SYSTEM START");

// ================= THREE SETUP =================
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

// ================= LIGHT =================
scene.add(new THREE.AmbientLight(0xffffff, 0.5));

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

// glow
const glow = new THREE.Mesh(
  new THREE.SphereGeometry(2.2, 64, 64),
  new THREE.MeshBasicMaterial({
    color: 0xff66cc,
    transparent: true,
    opacity: 0.12
  })
);

scene.add(glow);

// ================= TEXTURE =================
const loader = new THREE.TextureLoader();

function img(n){
  return loader.load("./"+n);
}

const imgs = [
  img("1.jpg"),img("2.jpg"),img("3.jpg"),img("4.jpg"),
  img("5.jpg"),img("6.jpg"),img("7.jpg"),img("8.jpg")
];

// ================= ORBIT =================
const layers = [];

function makeOrbit(r,s,c){
  const g = new THREE.Group();

  for(let i=0;i<c;i++){
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(0.7,0.7),
      new THREE.MeshBasicMaterial({
        map: imgs[i%8],
        transparent:true
      })
    );

    m.userData = {
      a:Math.random()*Math.PI*2,
      r:r,
      s:s
    };

    g.add(m);
  }

  scene.add(g);
  layers.push(g);
}

// dense orbit
makeOrbit(2.3,0.003,18);
makeOrbit(3.2,0.002,22);
makeOrbit(4.3,0.0015,26);

// ================= SCENE STATE =================
let sceneState = 0; 
// 0 = intro
// 1 = main planet
// 2 = zoom text
// 3 = orbit mode

// ================= BUTTON JELAJAH =================
const btnScene2 = document.createElement("button");
btnScene2.innerText = "🌍 JELAJAH";

Object.assign(btnScene2.style, {
  position: "fixed",
  bottom: "80px",
  left: "50%",
  transform: "translateX(-50%)",
  zIndex: "9999",
  padding: "12px 20px",
  borderRadius: "20px",
  border: "none",
  background: "rgba(255,255,255,0.2)",
  color: "white",
  fontSize: "16px",
  display: "none"
});

document.body.appendChild(btnScene2);

// tombol klik
btnScene2.onclick = () => {
  sceneState = 2;
  btnScene2.style.display = "none";
};

// ================= ENTER BUTTON =================
document.getElementById("enter").onclick = () => {

  document.getElementById("ui").style.display = "none";
  document.getElementById("bgm")?.play().catch(()=>{});

  sceneState = 1;

  // tampilkan tombol jelajah
  setTimeout(()=>{
    btnScene2.style.display = "block";
  }, 1200);
};

// ================= CAMERA DRAG =================
let drag=false;
let px=0,py=0;
let tx=0,ty=0;

function down(x,y){drag=true;px=x;py=y;}
function move(x,y){
  if(!drag) return;
  tx += (x-px)*0.005;
  ty += (y-py)*0.005;
  px=x; py=y;
}
function up(){drag=false;}

window.onmousedown=e=>down(e.clientX,e.clientY);
window.onmousemove=e=>move(e.clientX,e.clientY);
window.onmouseup=up;

window.ontouchstart=e=>down(e.touches[0].clientX,e.touches[0].clientY);
window.ontouchmove=e=>move(e.touches[0].clientX,e.touches[0].clientY);
window.ontouchend=up;

// ================= TEXT SCENE 2 =================
const text = document.createElement("div");

Object.assign(text.style, {
  position:"fixed",
  top:"50%",
  left:"50%",
  transform:"translate(-50%,-50%)",
  color:"white",
  fontSize:"18px",
  textAlign:"center",
  opacity:"0",
  zIndex:"9999"
});

text.innerHTML = `
masa di sini mulu?<br>
<b>jelajah aja napa?</b>
`;

document.body.appendChild(text);

// ================= LOOP =================
function animate(){

  requestAnimationFrame(animate);

  planet.rotation.y += 0.002;
  glow.rotation.y += 0.001;

  // orbit hanya di scene 3
  if(sceneState === 3){

    layers.forEach(l=>{
      l.children.forEach(m=>{

        m.userData.a += m.userData.s;

        m.position.x = Math.cos(m.userData.a)*m.userData.r;
        m.position.z = Math.sin(m.userData.a)*m.userData.r;

        m.lookAt(camera.position);

      });
    });

  }

  // ================= SCENE LOGIC =================

  if(sceneState === 0){
    camera.position.z += (7 - camera.position.z)*0.05;
  }

  if(sceneState === 1){
    camera.position.z += (5 - camera.position.z)*0.05;
  }

  if(sceneState === 2){
    camera.position.z += (3.5 - camera.position.z)*0.05;
    text.style.opacity = 1;

    setTimeout(()=>{
      sceneState = 3;
      text.style.opacity = 0;
    }, 2500);
  }

  if(sceneState === 3){
    camera.position.z += (6 - camera.position.z)*0.05;
  }

  // drag camera
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
