document.addEventListener("DOMContentLoaded", () => {

  const btn = document.getElementById("enter");
  const ui = document.getElementById("ui");
  const audio = document.getElementById("bgm");

  if(!btn){
    alert("ENTER BUTTON TIDAK KETEMU");
    return;
  }

  btn.addEventListener("click", () => {

    // sembunyikan UI
    ui.style.display = "none";

    // coba play musik
    if(audio){
      audio.play().catch(()=>{});
    }

    alert("🚀 MASUK KE PLANET");

  });

}); 
