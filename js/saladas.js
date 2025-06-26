document.addEventListener("DOMContentLoaded", function () {
    const readySalads = document.querySelectorAll("input[name='ready-salad']");
    const planInputs = document.querySelectorAll("input[name='plano']");
    const baseSelect = document.getElementById("base");
    const proteinaSelect = document.getElementById("proteina");
    const extrasCheckboxes = document.querySelectorAll("input[name='extras']");
    const molhoInputs = document.querySelectorAll("input[name='molho']");
    const resumoContent = document.getElementById("resumo-content");
    const whatsappBtn = document.getElementById("btn-whatsapp");

    function getSelectedMolho() {
        const molho = document.querySelector("input[name='molho']:checked");
        return molho ? molho.value : null;
    }

    function getSelectedExtras() {
        const extras = [];
        extrasCheckboxes.forEach(cb => {
            if (cb.checked) extras.push(cb.value);
        });
        return extras;
    }

    function getSelectedPlan() {
        const selected = document.querySelector("input[name='plano']:checked");
        if (!selected) return null;
        return {
            nome: selected.value,
            preco: parseFloat(selected.dataset.price),
            extrasPermitidos: parseInt(selected.dataset.extras),
        };
    }

    function getSelectedReadySalad() {
        const selected = document.querySelector("input[name='ready-salad']:checked");
        if (!selected) return null;
        const value = selected.value;
        const price = parseFloat(selected.getAttribute("data-price"));
        const tamanho = selected.parentElement.innerText.split("-")[0].trim();
        const nome = value.includes("camarao") ? "Salada Mix com Camarão" : "Salada Mix Completa";

        return {
            nome,
            tamanho,
            preco: price
        };
    }

    function atualizarResumoEPedido() {
        const saladaPronta = getSelectedReadySalad();
        const plano = getSelectedPlan();

        let mensagem = "";
        let resumoHtml = "";

        // Caso 1: Salada pronta
        if (saladaPronta) {
            mensagem = `*PEDIDO SALADAS - FORJA DO SABOR*\n🥗 ${saladaPronta.nome}\n📏 Tamanho: ${saladaPronta.tamanho}\n💰 Valor: R$ ${saladaPronta.preco},00`;
            resumoHtml = `
                <p><strong>${saladaPronta.nome}</strong></p>
                <p>Tamanho: ${saladaPronta.tamanho}</p>
                <p>Total: R$ ${saladaPronta.preco},00</p>
            `;
        }
        // Caso 2: Montagem personalizada
        else if (plano) {
            const base = baseSelect.value;
            const proteina = proteinaSelect.value;
            const extras = getSelectedExtras();
            const molho = getSelectedMolho();

            if (!base || !proteina) {
                resumoContent.innerHTML = `<p>Preencha base e proteína obrigatoriamente</p>`;
                whatsappBtn.style.display = "none";
                return;
            }

            if (extras.length > plano.extrasPermitidos) {
                resumoContent.innerHTML = `<p>Você excedeu o limite de ${plano.extrasPermitidos} extras</p>`;
                whatsappBtn.style.display = "none";
                return;
            }

            mensagem = `*PEDIDO SALADAS - FORJA DO SABOR*\n🧾 Plano: ${plano.nome.toUpperCase()}\n🥬 Base: ${base}\n🍗 Proteína: ${proteina}`;
            if (extras.length > 0) mensagem += `\n🥕 Extras: ${extras.join(", ")}`;
            if (molho) mensagem += `\n🧴 Molho: ${molho}`;
            mensagem += `\n💰 Valor: R$ ${plano.preco},00`;

            resumoHtml = `
                <p><strong>Plano: ${plano.nome.toUpperCase()}</strong></p>
                <p>Base: ${base}</p>
                <p>Proteína: ${proteina}</p>
                <p>Extras: ${extras.join(", ") || "Nenhum"}</p>
                <p>Molho: ${molho || "Nenhum"}</p>
                <p>Total: R$ ${plano.preco},00</p>
            `;
        }

        if (mensagem) {
            resumoContent.innerHTML = resumoHtml;
            whatsappBtn.href = `https://wa.me/5591985148050?text=${encodeURIComponent(mensagem)}`;
            whatsappBtn.style.display = "inline-block";
        } else {
            resumoContent.innerHTML = `<p>Selecione uma salada para ver o resumo</p>`;
            whatsappBtn.style.display = "none";
        }
    }

    // Eventos
    readySalads.forEach(el => el.addEventListener("change", atualizarResumoEPedido));
    planInputs.forEach(el => el.addEventListener("change", atualizarResumoEPedido));
    baseSelect.addEventListener("change", atualizarResumoEPedido);
    proteinaSelect.addEventListener("change", atualizarResumoEPedido);
    extrasCheckboxes.forEach(el => el.addEventListener("change", atualizarResumoEPedido));
    molhoInputs.forEach(el => el.addEventListener("change", atualizarResumoEPedido));

    atualizarResumoEPedido(); // executa ao carregar
});
