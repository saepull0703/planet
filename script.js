window.onerror = function(msg, src, line){
  alert("JS ERROR:\n" + msg + "\nLine: " + line);
};

console.log("SCRIPT START OK");

// ================= THREE INIT =================
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  60,
  innerWidth/innerHeight,
  0.1,
  2000
);

camera.position.z = 6;

const renderer = new THREE.WebGLRenderer({
  antialias:true,
  alpha:true
});

renderer.setSize(innerWidth,innerHeight);
document.getElementById("three").appendChild(renderer.domElement);

// ================= LIGHT =================
scene.add(new THREE.AmbientLight(0xffffff,0.6));
const light = new THREE.PointLight(0xff4fd8,2);
light.position.set(5,5,5);
scene.add(light);

// ================= PLANET =================
const planet = new THREE.Mesh(
  new THREE.SphereGeometry(1.6, 48, 48),
  new THREE.MeshStandardMaterial({
    color: 0xff4fa3,
    emissive: 0xff2a8a,
    emissiveIntensity: 0.5
  })
);

scene.add(planet);

// ================= SAFE TEXTURE =================
const loader = new THREE.TextureLoader();

function safeLoad(name){
  const tex = loader.load(
    "./" + name,
    ()=>console.log(name + " loaded"),
    undefined,
    ()=>console.log(name + " FAILED")
  );
  return tex;
}

const imgs = [
  safeLoad("1.jpg"),
  safeLoad("2.jpg"),
  safeLoad("3.jpg"),
  safeLoad("4.jpg"),
  safeLoad("5.jpg"),
  safeLoad("6.jpg"),
  safeLoad("7.jpg"),
  safeLoad("8.jpg")
];

// ================= ORBIT SYSTEM =================
const layers = [];

function createOrbit(r,s,count){

  const layer = new THREE.Group();

  for(let i=0;i<count;i++){

    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(0.6,0.6),
      new THREE.MeshBasicMaterial({
        map: imgs[i % 8],
        transparent:true
      })
    );

    mesh.userData = {
      a: Math.random()*Math.PI*2,
      r: r,
      s: s
    };

    layer.add(mesh);
  }

  scene.add(layer);
  layers.push(layer);
}

// density aman (tidak terlalu berat HP)
createOrbit(2.4,0.002,12);
createOrbit(3.4,0.0015,14);
createOrbit(4.4,0.0012,16);

// ================= ENTER =================
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

// ================= LOOP =================
function animate(){

  requestAnimationFrame(animate);

  planet.rotation.y += 0.002;

  layers.forEach(layer=>{
    layer.children.forEach(m=>{

      if(!m) return;

      m.userData.a += m.userData.s;

      m.position.x = Math.cos(m.userData.a) * m.userData.r;
      m.position.z = Math.sin(m.userData.a) * m.userData.r;

      m.lookAt(camera.position);

    });
  });

  renderer.render(scene,camera);
}

animate();

// resize safe
window.addEventListener("resize",()=>{
  camera.aspect = innerWidth/innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth,innerHeight);
});
