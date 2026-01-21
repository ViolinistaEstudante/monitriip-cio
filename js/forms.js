const form = document.getElementById("form");
const overlay = document.getElementById("success_overlay");

const URL_WEB_APP = "https://script.google.com/macros/s/AKfycby-kFDmYIR2vbNuC7_ffh9GJUOrPnzuEmMwIHhS4ASXeOjk7tX3AYKOVATVlbIK_GI7/exec";

form.addEventListener("submit", e => {
    e.preventDefault();

    const dados = {
        nome: document.getElementById("nome").value,
        regiao: document.getElementById("regiao").value,
        atualizacao: document.getElementById("atualizacao").value,
        descricao: document.getElementById("descricao").value
    };

    fetch(URL_WEB_APP, {
        method: "POST",
        body: JSON.stringify(dados)
    })
    .then(() => {
        overlay.style.display = "flex";
        form.reset();

        setTimeout(() => {
            overlay.style.display = "none";
        }, 2500);
    });
});
