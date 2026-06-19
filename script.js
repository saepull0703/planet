console.log("FULL CINEMATIC + PARTICLE + ORBIT TEXT");

// ================= SCENE =================
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x050714, 0.028);

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
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
document.getElementById("three").appendChild(renderer.domElement);

// ================= LIGHT =================
scene.add(new THREE.AmbientLight(0xffffff, 0.6));

const light = new THREE.PointLight(0xff4fd8, 4.5);
light.position.set(5, 5, 5);
scene.add(light);

// ================= PLANET =================
const planet = new THREE.Mesh(
  new THREE.SphereGeometry(1.6, 64, 64),
  new THREE.MeshStandardMaterial({
    color: 0xff4fa3,
    emissive: 0xff2a8a,
    emissiveIntensity: 0.75
  })
);
scene.add(planet);

// ================= ATMOSPHERE =================
const atmosphere = new THREE.Mesh(
  new THREE.SphereGeometry(2.45, 64, 64),
  new THREE.MeshBasicMaterial({
    color: 0xff66cc,
    transparent: true,
    opacity: 0.22,
    side: THREE.BackSide
  })
);
scene.add(atmosphere);

// ================= STARFIELD =================
const starGeo = new THREE.BufferGeometry();
const starCount = 2500;
const starPos = [];

for (let i = 0; i < starCount; i++) {
  starPos.push(
    (Math.random() - 0.5) * 500,
    (Math.random() - 0.5) * 500,
    (Math.random() - 0.5) * 500
  );
}

starGeo.setAttribute("position", new THREE.Float32BufferAttribute(starPos, 3));

const stars = new THREE.Points(
  starGeo,
  new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.45,
    transparent: true,
    opacity: 0.9
  })
);

scene.add(stars);

// ================= PARTICLE DUST =================
const pGeo = new THREE.BufferGeometry();
const pCount = 1200;
const pPos = [];

for (let i = 0; i < pCount; i++) {
  pPos.push(
    (Math.random() - 0.5) * 500,
    (Math.random() - 0.5) * 500,
    (Math.random() - 0.5) * 500
  );
}

pGeo.setAttribute("position", new THREE.Float32BufferAttribute(pPos, 3));

const particles = new THREE.Points(
  pGeo,
  new THREE.PointsMaterial({
    color: 0xffb3d9,
    size: 0.25,
    transparent: true,
    opacity: 0.6
  })
);

scene.add(particles);

// ================= TEXTURE IMAGES =================
const loader = new THREE.TextureLoader();
const imgs = [];

for (let i = 1; i <= 8; i++) {
  imgs.push(loader.load(i + ".jpg"));
}

// ================= ORBIT FOTO =================
const layers = [];

function orbit(r, s, c) {
  const g = new THREE.Group();

  for (let i = 0; i < c; i++) {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(0.75, 0.75),
      new THREE.MeshBasicMaterial({
        map: imgs[i % 8],
        transparent: true
      })
    );

    m.userData = {
      a: Math.random() * Math.PI * 2,
      r: r,
      s: s
    };

    g.add(m);
  }

  scene.add(g);
  layers.push(g);
}

orbit(2.3, 0.0032, 22);
orbit(3.5, 0.0022, 28);
orbit(4.8, 0.0016, 32);

// ================= TEXT SPRITE =================
function makeTextSprite(text) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = 512;
  canvas.height = 256;

  ctx.clearRect(0, 0, 512, 256);

  ctx.font = "28px Arial";
  ctx.fillStyle = "#ff66cc";
  ctx.textAlign = "center";

  ctx.fillText(text, 256, 130);

  const tex = new THREE.CanvasTexture(canvas);
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true });

  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(2.5, 1.2, 1);

  return sprite;
}

// ================= MBA AMAL TEXT ORBIT =================
const compliments = [
  "Mba Amal cantik banget ✨",
  "senyumnya bikin orbit tenang 💖",
  "kayak bintang paling lembut 🌙",
  "auranya bikin galaxy adem 🌌",
  "kalem tapi ngena 🫶",
  "kayak cahaya kecil di ruang hampa 💫",
  "bikin dunia jadi lebih pelan ✨"
];

const textGroup = new THREE.Group();

compliments.forEach((t, i) => {
  const s = makeTextSprite(t);

  s.userData = {
    a: Math.random() * Math.PI * 2,
    r: 2.8 + i * 0.25,
    s: 0.002 + Math.random() * 0.001
  };

  textGroup.add(s);
});

scene.add(textGroup);

// ================= STATE =================
let state = 0;
let warp = 0;

// ================= UI =================
const ui = document.getElementById("ui");
const menu = document.getElementById("menu");
const paper = document.getElementById("paperScene");

function triggerWarp() {
  warp = 1;
  setTimeout(() => (warp = 0), 700);
}

// ================= BUTTONS =================
document.getElementById("enter").onclick = () => {
  ui.classList.add("hidden");
  menu.classList.remove("hidden");
  document.getElementById("bgm")?.play().catch(() => {});
  state = 1;
  triggerWarp();
};

document.getElementById("goExplore").onclick = () => {
  menu.classList.add("hidden");
  state = 3;
  triggerWarp();
};

document.getElementById("stayHere").onclick = () => {
  menu.classList.add("hidden");
  paper.classList.remove("hidden");
  state = 2;
  triggerWarp();
};

document.getElementById("goExplore2").onclick = () => {
  paper.classList.add("hidden");
  state = 3;
  triggerWarp();
};

// ================= CAMERA CONTROL =================
let drag = false, px = 0, py = 0, tx = 0, ty = 0;

function down(x, y) { drag = true; px = x; py = y; }
function move(x, y) {
  if (!drag) return;
  tx += (x - px) * 0.004;
  ty += (y - py) * 0.004;
  px = x; py = y;
}
function up() { drag = false; }

window.onmousedown = e => down(e.clientX, e.clientY);
window.onmousemove = e => move(e.clientX, e.clientY);
window.onmouseup = up;

window.ontouchstart = e => down(e.touches[0].clientX, e.touches[0].clientY);
window.ontouchmove = e => move(e.touches[0].clientX, e.touches[0].clientY);
window.ontouchend = up;

// ================= ANIMATE =================
function animate() {
  requestAnimationFrame(animate);

  planet.rotation.y += 0.002;
  atmosphere.rotation.y += 0.0012;
  stars.rotation.y += 0.0002;
  particles.rotation.y += 0.0001;

  // ORBIT FOTO
  if (state === 3) {
    layers.forEach(l => {
      l.children.forEach(m => {
        m.userData.a += m.userData.s;

        m.position.x = Math.cos(m.userData.a) * m.userData.r;
        m.position.z = Math.sin(m.userData.a) * m.userData.r;
        m.position.y = Math.sin(m.userData.a * 1.3) * 0.25;

        m.lookAt(camera.position);
      });
    });

    textGroup.children.forEach(m => {
      m.userData.a += m.userData.s;

      m.position.x = Math.cos(m.userData.a) * m.userData.r;
      m.position.z = Math.sin(m.userData.a) * m.userData.r;
      m.position.y = Math.sin(m.userData.a * 1.2) * 0.3;

      m.lookAt(camera.position);
    });
  }

  // CAMERA FLOW
  let targetZ = 7;

  if (state === 1) targetZ = 6;
  if (state === 2) targetZ = 3.8;
  if (state === 3) targetZ = 6;

  camera.position.z += (targetZ - camera.position.z) * 0.06;
  camera.position.x += (tx - camera.position.x) * 0.08;
  camera.position.y += (ty - camera.position.y) * 0.08;

  // WARP EFFECT
  renderer.domElement.style.filter = warp
    ? "brightness(2.2) blur(2px)"
    : "brightness(1) blur(0px)";

  renderer.render(scene, camera);
}

animate();

// ================= RESIZE =================
window.addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
