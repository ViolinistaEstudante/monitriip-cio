const API_URL = "https://script.google.com/macros/s/AKfycbzMKdCQLP1P6EyG3kuZiItfJmRNdlURTuIwV3erdCGfq80jJVPPm4hMdg3K5CnQZpHiIg/exec";
const TABELA_API_URL = "https://script.google.com/macros/s/AKfycbx_NXKTbOyMlv9ckt6cCmBtm8J_uPmh4TOyWJ5-nzbaWNY1hO7DqVDAEk9-ZVxwNCKWOg/exec";
const REFRESH_TIME = 120;
let countdown = REFRESH_TIME;

const ADMIN_USERS = ["ADMIN"]; 

const USER_CITY_MAP = {
  "CVEL0208": "cascavel",
  "FLP0241": "florianopolis",
  "PVH0234": "porto-velho",
  "JPR0962": "ji-parana",
  "MAN0788": "manaus"
};

const CITY_CLASSES = {
  "cascavel": "city-cascavel",
  "florianopolis": "city-florianopolis",
  "porto-velho": "city-porto-velho",
  "ji-parana": "city-ji-parana",
  "manaus": "city-manaus"
};

function normalizarCidade(valor) {
  return String(valor)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/-?\s*pr$/g, "")
    .replace(/\s+/g, "-")
    .trim();
}

function getUsuarioLogado() {
  const usuario = localStorage.getItem("usuarioLogado");
  return usuario ? usuario.trim().toUpperCase() : null;
}

function getCidadeDoUsuario() {
  const usuario = getUsuarioLogado();
  return USER_CITY_MAP[usuario] || null;
}

function criarCard(item, cidadeUsuario, usuarioLogado) {
  const cidadeCard = normalizarCidade(item.cidade);
  let classeExtra = "";

  if (isAdmin(usuarioLogado)) {
    classeExtra = CITY_CLASSES[cidadeCard] || "";
  }

  else if (cidadeUsuario && cidadeCard === cidadeUsuario) {
    classeExtra = CITY_CLASSES[cidadeUsuario];
  }

  return `
    <div class="card ${classeExtra}">
      <h2>${item.cidade}</h2>
      <span>${item.quantidade}</span>
      <small>Atualiza em 02:00</small>
    </div>
  `;
}

function carregarDados() {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      const dashboard = document.getElementById("dashboard");
      dashboard.innerHTML = "";

      const usuarioLogado = getUsuarioLogado();
      const cidadeUsuario = getCidadeDoUsuario();

      data.forEach(item => {
        dashboard.innerHTML += criarCard(item, cidadeUsuario, usuarioLogado);
      });

      countdown = REFRESH_TIME;
    })
    .catch(err => {
      console.error("Erro ao buscar dados:", err);
    });
}

function iniciarCronometro() {
  setInterval(() => {
    countdown--;

    const min = String(Math.floor(countdown / 60)).padStart(2, "0");
    const sec = String(countdown % 60).padStart(2, "0");

    document.querySelectorAll(".card small").forEach(el => {
      el.textContent = `Atualiza em ${min}:${sec}`;
    });

    if (countdown <= 0) {
      carregarDados();
    }
  }, 1000);
}

document.addEventListener("DOMContentLoaded", () => {
  carregarDados();
  iniciarCronometro();
  carregarTabela();
});

function toggleMenu() {
  const menu = document.getElementById("profileMenu");
  menu.style.display = menu.style.display === "block" ? "none" : "block";
}

document.addEventListener("click", (event) => {
  const menu = document.getElementById("profileMenu");
  const profileBtn = document.querySelector(".profile-btn");

  if (!menu || !profileBtn) return;

  if (!menu.contains(event.target) && !profileBtn.contains(event.target)) {
    menu.style.display = "none";
  }
});

function logout() {
  localStorage.removeItem("usuarioLogado");
  window.location.href = "index.html";
}

function isAdmin(usuario) {
  return ADMIN_USERS.includes(usuario);
}

function carregarMarquee() {
  fetch(CONCAT_API_URL)
    .then(res => res.json())
    .then(data => {

      const textos = data.map(item => {
        return `📍 ${item.cidade}: ${item.concat}`;
      });

      const marquee = document.getElementById("marqueeText");
      marquee.textContent = textos.join("  •  ");
    })
    .catch(() => {
      document.getElementById("marqueeText").textContent =
        "Erro ao carregar informações.";
    });
}

function carregarTabela() {
  fetch(TABELA_API_URL)
    .then(res => res.json())
    .then(data => {
      const tbody = document.getElementById("tabelaCidades");
      tbody.innerHTML = "";

      const usuario = getUsuarioLogado();
      const cidadeUsuario = getCidadeDoUsuario();
      const admin = isAdmin(usuario);

      data.forEach(item => {
        const cidadeNormalizada = normalizarCidade(item.cidade);

        if (!admin && cidadeUsuario && cidadeNormalizada !== cidadeUsuario) {
          return;
        }

        if (!admin && !cidadeUsuario) {
          return;
        }

        const classe = CITY_CLASSES[cidadeNormalizada] || "";

        tbody.innerHTML += `
          <tr class="${classe}">
            <td>${item.cidade}</td>
            <td>${item.celular}</td>
          </tr>
        `;
      });

      if (!tbody.innerHTML) {
        tbody.innerHTML = `
          <tr>
            <td colspan="2">Nenhum dado disponível</td>
          </tr>
        `;
      }
    })
    .catch(() => {
      document.getElementById("tabelaCidades").innerHTML = `
        <tr>
          <td colspan="2">Erro ao carregar dados</td>
        </tr>
      `;
    });
}

function solicitacao() {
  window.location.href = "forms.html";
}

function protegerAcessoAdmin() {
  const usuario = getUsuarioLogado();

  if (!usuario || !isAdmin(usuario)) {
    window.location.href = "dashboard.html"; // ou index.html
  }
}

function acessarAdmin() {
  const usuario = getUsuarioLogado();
  if (isAdmin(usuario)) {
    window.location.href = "atualizacoes.html";
  } else {
    alert("Acesso negado. Área restrita para administradores.");
  }
}

function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("active");
}

/* Fecha clicando fora */
document.addEventListener("click", function (e) {
  const sidebar = document.getElementById("sidebar");
  const toggle = document.querySelector(".sidebar-toggle");

  if (!sidebar.contains(e.target) && !toggle.contains(e.target)) {
    sidebar.classList.remove("active");
  }
});

function planilha() {
  window.open("https://docs.google.com/spreadsheets/d/1naemUOUtGOtZhUq27JM_N8QA37tr88-95IR_1ySMmHs/edit?usp=sharing", "_blank");
}

