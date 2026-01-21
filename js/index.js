const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwPdy3iYvN-qSTIw-Lp1UePWxR5640IVsXpRUTc4A8l_gRKZsjcr9AmpMdpHK1tCXqCGA/exec";

function login(event) {
  event.preventDefault();

  const usuario = document.getElementById("usuario").value.trim().toUpperCase();
  const senha = document.getElementById("senha").value.trim();
  const msg = document.getElementById("msg");

  if (!usuario || !senha) {
    msg.innerText = "Preencha todos os campos";
    msg.style.color = "#ff5252";
    return;
  }

  fetch(`${SCRIPT_URL}?usuario=${encodeURIComponent(usuario)}&senha=${encodeURIComponent(senha)}`)
    .then(res => res.json())
    .then(data => { 
      if (data.sucesso) {

        localStorage.setItem("usuarioLogado", usuario);

        msg.style.color = "#4caf50";
        msg.innerText = "Login autorizado ✅";

        setTimeout(() => {
          window.location.href = "dashboard.html";
        }, 500);

      } else {
        msg.style.color = "#ff5252";
        msg.innerText = data.msg;
      }
    })
    .catch(() => {
      msg.style.color = "#ff5252";
      msg.innerText = "Erro de conexão";
    });
}
