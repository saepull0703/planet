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

renderer.setSize(innerWidth, innerHeight);
document.getElementById("three").appendChild(renderer.domElement);

// =======================
// LIGHT
// =======================

scene.add(new THREE.AmbientLight(0xffffff,0.5));

const light = new THREE.PointLight(0xff4fd8,3);
light.position.set(5,5,5);
scene.add(light);

// =======================
// STAR FIELD
// =======================

function stars(count, size){

  const geo = new THREE.BufferGeometry();
  const arr=[];

  for(let i=0;i<count;i++){
    arr.push(
      (Math.random()-0.5)*200,
      (Math.random()-0.5)*200,
      (Math.random()-0.5)*200
    );
  }

  geo.setAttribute("position",
    new THREE.Float32BufferAttribute(arr,3)
  );

  const mat = new THREE.PointsMaterial({
    color:0xffffff,
    size
  });

  const mesh = new THREE.Points(geo,mat);
  scene.add(mesh);

  return mesh;
}

const star = stars(2000,0.7);

// =======================
// PLANET (PINK JUPITER)
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
  new THREE.SphereGeometry(2.1,128,128),
  new THREE.MeshBasicMaterial({
    color:0xff66cc,
    transparent:true,
    opacity:0.12
  })
);

scene.add(glow);

// =======================
// ORBIT PHOTO (SUPER DENSE)
// =======================

const loader = new THREE.TextureLoader();

const img = [
 "1.jpg","2.jpg","3.jpg","4.jpg",
 "5.jpg","6.jpg","7.jpg","8.jpg"
].map(f=>loader.load(f));

const group = new THREE.Group();
scene.add(group);

const layers=[];

function orbit(r,s,d){

  const layer = new THREE.Group();

  for(let i=0;i<8*d;i++){

    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(0.6,0.6),
      new THREE.MeshBasicMaterial({
        map:img[i%8],
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

// 🔥 ULTRA DENSITY
orbit(2.2,0.002,12);
orbit(3.0,0.0015,14);
orbit(3.8,0.0012,16);
orbit(4.6,0.001,18);

// =======================
// MOUSE CLICK RAYCAST
// =======================

const raycaster=new THREE.Raycaster();
const mouse=new THREE.Vector2();

window.addEventListener("click",(e)=>{

  mouse.x=(e.clientX/innerWidth)*2-1;
  mouse.y=-(e.clientY/innerHeight)*2+1;

  raycaster.setFromCamera(mouse,camera);

  layers.forEach(l=>{

    const hit = raycaster.intersectObjects(l.children);

    if(hit.length){

      document.getElementById("modal").style.display="flex";
      document.getElementById("modalImg").src=
      hit[0].object.material.map.image.currentSrc;

    }

  });

});

// =======================
// MODAL CLOSE
// =======================

document.getElementById("close").onclick=()=>{
  document.getElementById("modal").style.display="none";
};

// =======================
// ANIMATION LOOP
// =======================

let t=0;

function animate(){

  requestAnimationFrame(animate);

  t+=0.01;

  planet.rotation.y += 0.002;
  glow.rotation.y += 0.001;

  star.rotation.y += 0.0002;

  // orbit
  layers.forEach(l=>{
    l.children.forEach(m=>{
      m.userData.a += m.userData.s;

      m.position.x=Math.cos(m.userData.a)*m.userData.r;
      m.position.z=Math.sin(m.userData.a)*m.userData.r;

      m.lookAt(camera.position);
    });
  });

  // floating camera cinematic
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

// =======================
// ENTER + MUSIC
// =======================

document.getElementById("enter").onclick=()=>{

  document.getElementById("ui").style.display="none";

  document.getElementById("bgm").play();

};