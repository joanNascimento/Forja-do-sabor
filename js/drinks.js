// Drinks JavaScript Functions

// Função para aumentar quantidade
function aumentarQuantidade(button) {
    const input = button.parentElement.querySelector('.quantidade-input');
    let quantidade = parseInt(input.value);
    quantidade++;
    input.value = quantidade;
}

// Função para diminuir quantidade
function diminuirQuantidade(button) {
    const input = button.parentElement.querySelector('.quantidade-input');
    let quantidade = parseInt(input.value);
    if (quantidade > 1) {
        quantidade--;
        input.value = quantidade;
    }
}

// Função para abrir modal de pedido (será integrada com o sistema existente)
function abrirModalPedido(nomeProduto, tamanho, preco, button) {
    const quantidadeInput = button.parentElement.querySelector('.quantidade-input');
    const quantidade = parseInt(quantidadeInput.value);
    const precoTotal = preco * quantidade;
    
    // Chama a função do sistema de pedidos existente
    if (typeof window.abrirModalPedidoCompleto === 'function') {
        window.abrirModalPedidoCompleto(nomeProduto, tamanho, precoTotal, quantidade);
    } else {
        // Fallback para WhatsApp direto se o sistema não estiver disponível
        const mensagem = `Olá! Gostaria de pedir:\n\n🍹 *${nomeProduto}*\n📏 Tamanho: ${tamanho}\n🔢 Quantidade: ${quantidade}\n💰 Total: R$ ${precoTotal.toFixed(2).replace('.', ',')}`;
        const whatsappUrl = `https://wa.me/5591985148050?text=${encodeURIComponent(mensagem)}`;
        window.open(whatsappUrl, '_blank');
    }
}

// Validação de quantidade nos inputs
document.addEventListener('DOMContentLoaded', function() {
    const quantidadeInputs = document.querySelectorAll('.quantidade-input');
    
    quantidadeInputs.forEach(input => {
        input.addEventListener('change', function() {
            let valor = parseInt(this.value);
            if (isNaN(valor) || valor < 1) {
                this.value = 1;
            }
        });
        
        input.addEventListener('input', function() {
            // Remove caracteres não numéricos
            this.value = this.value.replace(/[^0-9]/g, '');
        });
    });
});

// Animações suaves ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    const produtoCards = document.querySelectorAll('.produto-card');
    
    // Adiciona animação de entrada aos cards
    produtoCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
    });
});

// Função para destacar drink especial
function destacarDrinkEspecial() {
    const drinkEspecial = document.querySelector('.produto-card:last-of-type');
    if (drinkEspecial) {
        drinkEspecial.style.border = '3px solid var(--drinks-accent)';
        drinkEspecial.style.position = 'relative';
        
        // Adiciona badge "Drink da Casa"
        const badge = document.createElement('div');
        badge.innerHTML = '⭐ DRINK DA CASA';
        badge.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: var(--drinks-accent);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: bold;
            z-index: 10;
        `;
        drinkEspecial.style.position = 'relative';
        drinkEspecial.appendChild(badge);
    }
}

// Chama a função quando a página carrega
document.addEventListener('DOMContentLoaded', destacarDrinkEspecial);

