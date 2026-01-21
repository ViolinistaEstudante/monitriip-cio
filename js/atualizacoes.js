const URL_SCRIPT = "https://script.google.com/macros/s/AKfycbyzuxzZ6Ub1Ea129oJU_CnKZSwbxQx3unqjO7j4xjplSP8HZKYZo11Kw3B_YIlDBLocOQ/exec?action=listar";
const tbody = document.querySelector("#tabela tbody");

fetch(URL_SCRIPT)
  .then(res => res.json())
  .then(dados => {
    dados.forEach(item => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${new Date(item.data).toLocaleString()}</td>
        <td>${item.nome}</td>
        <td>${item.regiao}</td>
        <td>${item.tipo}</td>
        <td>${item.descricao}</td>
      `;

      tbody.appendChild(tr);
    });
  });

document.addEventListener("DOMContentLoaded", () => {
  protegerAcessoAdmin();
  carregarTabela();
});

