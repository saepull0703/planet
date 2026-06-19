// =========================
// SAFE MODE (ANTI CRASH)
// =========================

window.onerror = function(msg, src, line){
  alert("JS ERROR:\n" + msg + "\nLine: " + line);
};

console.log("3D SCRIPT START");

// =========================
// THREE INIT SAFE CHECK
// =========================

if (!window.THREE) {
  alert("THREE.JS GAGAL LOAD");
}

// =========================
// SCENE SETUP
// =========================

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  60,
  innerWidth / innerHeight,
  0.1,
  2000
);

camera.position.z = 6;

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true
});

renderer.setSize(innerWidth, innerHeight);
document.getElementById("three").appendChild(renderer.domElement);

// =========================
// LIGHT
// =========================

scene.add(new THREE.AmbientLight(0xffffff, 0.6));

const light = new THREE.PointLight(0xff4fd8, 2);
light.position.set(5,5,5);
scene.add(light);

// =========================
// PLANET (SAFE MATERIAL)
// =========================

const planet = new THREE.Mesh(
  new THREE.SphereGeometry(1.6, 48, 48),
  new THREE.MeshStandardMaterial({
    color: 0xff4fa3,
    emissive: 0xff2a8a,
    emissiveIntensity: 0.5
  })
);

scene.add(planet);

// =========================
// TEXTURE SAFE LOADER
// =========================

const loader = new THREE.TextureLoader();

function safeTexture(file){
  try{
    return loader.load("./" + file);
  } catch(e){
    console.log("fail:", file);
    return null;
  }
}

const textures = [
  safeTexture("1.jpg"),
  safeTexture("2.jpg"),
  safeTexture("3.jpg"),
  safeTexture("4.jpg"),
  safeTexture("5.jpg"),
  safeTexture("6.jpg"),
  safeTexture("7.jpg"),
  safeTexture("8.jpg")
];

// =========================
// ORBIT SYSTEM (STABLE)
// =========================

const group = new THREE.Group();
scene.add(group);

const layers = [];

function createOrbit(radius, speed, count){

  const layer = new THREE.Group();

  for(let i=0;i<count;i++){

    const mat = new THREE.MeshBasicMaterial({
      map: textures[i % 8],
      transparent: true
    });

    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(0.6,0.6),
      mat
    );

    mesh.userData = {
      a: Math.random()*Math.PI*2,
      r: radius,
      s: speed
    };

    layer.add(mesh);
  }

  group.add(layer);
  layers.push(layer);
}

// dense orbit (viral feel)
createOrbit(2.3,0.002,16);
createOrbit(3.2,0.0015,20);
createOrbit(4.2,0.0012,24);

// =========================
// ENTER BUTTON SAFE
// =========================

document.addEventListener("DOMContentLoaded",()=>{

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

// =========================
// ANIMATION LOOP (LOCKED SAFE)
// =========================

let t = 0;

function animate(){

  requestAnimationFrame(animate);

  t += 0.01;

  planet.rotation.y += 0.002;

  layers.forEach(layer=>{
    layer.children.forEach(m=>{

      m.userData.a += m.userData.s;

      m.position.x = Math.cos(m.userData.a) * m.userData.r;
      m.position.z = Math.sin(m.userData.a) * m.userData.r;

      m.lookAt(camera.position);

    });
  });

  camera.position.x = Math.sin(t)*0.2;
  camera.position.y = Math.cos(t*0.5)*0.1;

  renderer.render(scene,camera);
}

animate();

// =========================
// RESIZE SAFE
// =========================

window.addEventListener("resize",()=>{
  camera.aspect = innerWidth/innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth,innerHeight);
});
