// ======================
// ERROR CATCH (WAJIB)
// ======================

window.onerror = function(msg, src, line){
  alert("JS ERROR:\n" + msg + "\nLine: " + line);
};

console.log("SCRIPT LOADED");

// ======================
// BASIC SETUP
// ======================

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

// ======================
// LIGHT
// ======================

scene.add(new THREE.AmbientLight(0xffffff,0.5));

const light = new THREE.PointLight(0xff4fd8,3);
light.position.set(5,5,5);
scene.add(light);

// ======================
// PLANET PINK
// ======================

const planet = new THREE.Mesh(
  new THREE.SphereGeometry(1.7,64,64),
  new THREE.MeshStandardMaterial({
    color:0xff4fa3,
    emissive:0xff2a8a,
    emissiveIntensity:0.6
  })
);

scene.add(planet);

// glow
const glow = new THREE.Mesh(
  new THREE.SphereGeometry(2.2,64,64),
  new THREE.MeshBasicMaterial({
    color:0xff66cc,
    transparent:true,
    opacity:0.12
  })
);

scene.add(glow);

// ======================
// ORBIT (SAFE VERSION)
// ======================

const loader = new THREE.TextureLoader();

const imgs = [
"1.jpg","2.jpg","3.jpg","4.jpg",
"5.jpg","6.jpg","7.jpg","8.jpg"
].map(f=>loader.load("./"+f));

const group = new THREE.Group();
scene.add(group);

const layers=[];

function createOrbit(r,s,count){

  const layer = new THREE.Group();

  for(let i=0;i<count;i++){

    const mat = new THREE.MeshBasicMaterial({
      map:imgs[i%8],
      transparent:true
    });

    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(0.6,0.6),
      mat
    );

    m.userData = {
      a:Math.random()*Math.PI*2,
      r:r,
      s:s
    };

    layer.add(m);
  }

  group.add(layer);
  layers.push(layer);
}

createOrbit(2.4,0.002,20);
createOrbit(3.4,0.0015,24);
createOrbit(4.4,0.0012,28);

// ======================
// ENTER BUTTON (FIXED)
// ======================

document.addEventListener("DOMContentLoaded",()=>{

  const btn = document.getElementById("enter");
  const ui = document.getElementById("ui");
  const audio = document.getElementById("bgm");

  if(!btn){
    alert("ENTER TIDAK KETEMU");
    return;
  }

  btn.onclick = () => {

    ui.style.display = "none";

    if(audio){
      audio.play().catch(()=>{});
    }

  };

});

// ======================
// ANIMATION LOOP
// ======================

let t=0;

function animate(){

  requestAnimationFrame(animate);

  t+=0.01;

  planet.rotation.y += 0.002;
  glow.rotation.y += 0.001;

  layers.forEach(l=>{
    l.children.forEach(m=>{

      m.userData.a += m.userData.s;

      m.position.x = Math.cos(m.userData.a)*m.userData.r;
      m.position.z = Math.sin(m.userData.a)*m.userData.r;

      m.lookAt(camera.position);
    });
  });

  camera.position.x = Math.sin(t*0.5)*0.2;
  camera.position.y = Math.cos(t*0.4)*0.1;

  renderer.render(scene,camera);
}

animate();

// ======================
// RESIZE SAFE
// ======================

window.addEventListener("resize",()=>{
  camera.aspect = innerWidth/innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth,innerHeight);
});
