// =======================
// BASIC SETUP
// =======================

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  60,
  innerWidth/innerHeight,
  0.1,
  2000
);

camera.position.z = 7;

const renderer = new THREE.WebGLRenderer({
  antialias:true,
  alpha:true
});

renderer.setSize(innerWidth,innerHeight);
document.getElementById("three").appendChild(renderer.domElement);

// =======================
// LIGHT
// =======================

scene.add(new THREE.AmbientLight(0xffffff,0.5));

const light = new THREE.PointLight(0xff4fd8,3);
light.position.set(5,5,5);
scene.add(light);

// =======================
// PLANET PINK JUPITER
// =======================

const planet = new THREE.Mesh(
  new THREE.SphereGeometry(1.7,128,128),
  new THREE.MeshStandardMaterial({
    color:0xff4fa3,
    emissive:0xff2a8a,
    emissiveIntensity:0.6
  })
);

scene.add(planet);

// glow
const glow = new THREE.Mesh(
  new THREE.SphereGeometry(2.2,128,128),
  new THREE.MeshBasicMaterial({
    color:0xff66cc,
    transparent:true,
    opacity:0.12
  })
);

scene.add(glow);

// =======================
// ORBIT PHOTO SYSTEM
// =======================

const loader = new THREE.TextureLoader();

const imgs = [
"1.jpg","2.jpg","3.jpg","4.jpg",
"5.jpg","6.jpg","7.jpg","8.jpg"
].map(f=>loader.load(f));

const group = new THREE.Group();
scene.add(group);

const layers=[];

function createOrbit(r,s,d){

  const layer = new THREE.Group();

  for(let i=0;i<8*d;i++){

    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(0.6,0.6),
      new THREE.MeshBasicMaterial({
        map:imgs[i%8],
        transparent:true
      })
    );

    m.userData={
      a:Math.random()*Math.PI*2,
      r,
      s
    };

    layer.add(m);
  }

  group.add(layer);
  layers.push(layer);
}

createOrbit(2.3,0.002,10);
createOrbit(3.2,0.0015,12);
createOrbit(4.2,0.0012,14);

// =======================
// SCENE SYSTEM
// =======================

const uiStart = document.getElementById("uiStart");
const scene1 = document.getElementById("scene1");
const scene2 = document.getElementById("scene2");
const scene3 = document.getElementById("scene3");

function show(el){
  [uiStart,scene1,scene2,scene3].forEach(e=>e.style.display="none");
  el.style.display="flex";
}

// =======================
// START BUTTON
// =======================

document.getElementById("enter").onclick=()=>{

  uiStart.style.display="none";
  scene1.style.display="flex";

  document.getElementById("bgm").play().catch(()=>{});

};

// =======================
// SCENE BUTTONS
// =======================

document.getElementById("goScene2").onclick=()=>{
  show(scene2);
};

document.getElementById("stay").onclick=()=>{
  alert("kamu tetap di planet 😌");
};

document.getElementById("back1").onclick=()=>{
  show(scene1);
};

// =======================
// ANIMATION LOOP
// =======================

let t=0;

function animate(){

  requestAnimationFrame(animate);

  t+=0.01;

  planet.rotation.y+=0.002;
  glow.rotation.y+=0.001;

  // orbit motion
  layers.forEach(l=>{
    l.children.forEach(m=>{
      m.userData.a += m.userData.s;

      m.position.x=Math.cos(m.userData.a)*m.userData.r;
      m.position.z=Math.sin(m.userData.a)*m.userData.r;

      m.lookAt(camera.position);
    });
  });

  // camera cinematic float
  camera.position.x=Math.sin(t*0.5)*0.2;
  camera.position.y=Math.cos(t*0.4)*0.1;

  renderer.render(scene,camera);
}

animate();

// resize
addEventListener("resize",()=>{
  camera.aspect=innerWidth/innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth,innerHeight);
});
