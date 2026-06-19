console.log("SCRIPT JALAN");

window.onerror = function(msg, src, line){
  alert("ERROR: " + msg + " line " + line);
};

document.addEventListener("DOMContentLoaded", () => {

  const btn = document.getElementById("enter");

  alert("BUTTON TERDETEKSI: " + btn);

  if(!btn){
    alert("ENTER TIDAK KETEMU DI HTML");
    return;
  }

  btn.addEventListener("click", () => {
    alert("BERHASIL DIPENCET");
  });

});
