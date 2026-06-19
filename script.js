console.log("SCENE SYSTEM START");

// ================= THREE INIT =================
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
  new THREE.SphereGeometry(2.1, 64, 64),
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

// ================= ORBIT (SCENE 3) =================
const layers = [];

function orbit(r,s,c){
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
      a: Math.random()*Math.PI*2,
      r:r,
      s:s
    };

    g.add(m);
  }

  scene.add(g);
  layers.push(g);
}

// pre-create (tapi disembunyikan dulu)
orbit(2.3,0.003,18);
orbit(3.2,0.002,22);
orbit(4.3,0.0015,26);

// ================= SCENES =================
let sceneState = 1;

// 1 = intro planet
// 2 = zoom earth text
// 3 = orbit princess

// ================= ENTER =================
document.getElementById("enter").onclick = () => {

  document.getElementById("ui").style.display = "none";
  document.getElementById("bgm")?.play().catch(()=>{});

  sceneState = 2;

  // zoom masuk planet
  targetZ = 4;
};

// ================= CAMERA CONTROL =================
let drag=false;
let px=0,py=0;
let tx=0,ty=0;
let targetZ = 7;

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

// ================= FAKE TEXT SCENE 2 =================
const textDiv = document.createElement("div");
textDiv.style.position="fixed";
textDiv.style.top="50%";
textDiv.style.left="50%";
textDiv.style.transform="translate(-50%,-50%)";
textDiv.style.color="white";
textDiv.style.fontSize="18px";
textDiv.style.textAlign="center";
textDiv.style.opacity="0";
textDiv.innerHTML="masa di sini mulu?<br>jelajah aja napa?";
document.body.appendChild(textDiv);

// ================= MAIN LOOP =================
function animate(){

  requestAnimationFrame(animate);

  // planet rotation
  planet.rotation.y += 0.002;
  glow.rotation.y += 0.001;

  // orbit update (scene 3 only)
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

  // SCENE CONTROL
  if(sceneState === 1){

    camera.position.z += (7-camera.position.z)*0.05;

  }

  if(sceneState === 2){

    camera.position.z += (3.5-camera.position.z)*0.05;

    textDiv.style.opacity = 1;

    // after few seconds go scene 3
    setTimeout(()=>{
      sceneState = 3;
      textDiv.style.opacity = 0;
    }, 3000);
  }

  if(sceneState === 3){

    camera.position.z += (6-camera.position.z)*0.05;

    // activate orbit feel
    planet.scale.set(1.1,1.1,1.1);
  }

  // drag camera
  camera.position.x += (tx-camera.position.x)*0.08;
  camera.position.y += (ty-camera.position.y)*0.08;

  renderer.render(scene,camera);
}

animate();

// ================= RESIZE =================
window.addEventListener("resize",()=>{
  camera.aspect = innerWidth/innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth,innerHeight);
});
