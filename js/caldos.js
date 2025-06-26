document.addEventListener('DOMContentLoaded', function() {
    // Preços dos caldos
    const precos = {
        'caldo-frango-300ml': 12,
        'caldo-frango-500ml': 18,
        'caldo-carne-300ml': 14,
        'caldo-carne-500ml': 20,
        'caldo-camarao-300ml': 16,
        'caldo-camarao-500ml': 24,
        'caldo-verde-300ml': 10,
        'caldo-verde-500ml': 15,
        'combo-degustacao': 45,
        'combo-familia': 65,
        'combo-fidelidade': 85
    };

    // Descrições dos produtos
    const descricoes = {
        'caldo-frango-300ml': 'Caldo de Frango 300ml - Tradicional caldo caseiro com frango desfiado',
        'caldo-frango-500ml': 'Caldo de Frango 500ml - Tradicional caldo caseiro com frango desfiado',
        'caldo-carne-300ml': 'Caldo de Carne Moída 300ml - Caldo encorpado com carne moída temperada',
        'caldo-carne-500ml': 'Caldo de Carne Moída 500ml - Caldo encorpado com carne moída temperada',
        'caldo-camarao-300ml': 'Caldo de Camarão 300ml - Caldo especial com camarão rosa',
        'caldo-camarao-500ml': 'Caldo de Camarão 500ml - Caldo especial com camarão rosa',
        'caldo-verde-300ml': 'Caldo Verde 300ml - Caldo vegetariano com legumes frescos',
        'caldo-verde-500ml': 'Caldo Verde 500ml - Caldo vegetariano com legumes frescos',
        'combo-degustacao': 'Combo Degustação - 3 caldos de 300ml (sabores à escolha)',
        'combo-familia': 'Combo Família - 4 caldos de 500ml (sabores à escolha)',
        'combo-fidelidade': 'Combo Fidelidade - 6 caldos de 500ml (sabores à escolha) + desconto especial'
    };

    // Adicionar botões de pedido a todos os produtos
    const produtoCards = document.querySelectorAll('.product-card, .combo-card, .caldo-card');
    
    produtoCards.forEach(card => {
        // Identificar o produto pelo título ou classe
        const titulo = card.querySelector('h3, h4');
        const preco = card.querySelector('.price');
        let produtoId = null;
        
        if (titulo && preco) {
            const textoTitulo = titulo.textContent.toLowerCase();
            const textoPreco = preco.textContent;
            
            // Identificar por título e preço
            if (textoTitulo.includes('frango') && textoTitulo.includes('300ml')) {
                produtoId = 'caldo-frango-300ml';
            } else if (textoTitulo.includes('frango') && textoTitulo.includes('500ml')) {
                produtoId = 'caldo-frango-500ml';
            } else if (textoTitulo.includes('carne') && textoTitulo.includes('300ml')) {
                produtoId = 'caldo-carne-300ml';
            } else if (textoTitulo.includes('carne') && textoTitulo.includes('500ml')) {
                produtoId = 'caldo-carne-500ml';
            } else if (textoTitulo.includes('camarão') && textoTitulo.includes('300ml')) {
                produtoId = 'caldo-camarao-300ml';
            } else if (textoTitulo.includes('camarão') && textoTitulo.includes('500ml')) {
                produtoId = 'caldo-camarao-500ml';
            } else if (textoTitulo.includes('verde') && textoTitulo.includes('300ml')) {
                produtoId = 'caldo-verde-300ml';
            } else if (textoTitulo.includes('verde') && textoTitulo.includes('500ml')) {
                produtoId = 'caldo-verde-500ml';
            } else if (textoTitulo.includes('degustação')) {
                produtoId = 'combo-degustacao';
            } else if (textoTitulo.includes('família')) {
                produtoId = 'combo-familia';
            } else if (textoTitulo.includes('fidelidade')) {
                produtoId = 'combo-fidelidade';
            }
        }
        
        if (produtoId && precos[produtoId]) {
            // Verificar se já existe botão
            if (!card.querySelector('.btn-pedido')) {
                const btnPedido = document.createElement('a');
                btnPedido.className = 'btn-pedido';
                btnPedido.innerHTML = '<i class="fab fa-whatsapp"></i> Pedir via WhatsApp';
                btnPedido.href = gerarLinkWhatsAppCaldos(produtoId);
                btnPedido.target = '_blank';
                
                card.appendChild(btnPedido);
            }
        }
    });

    // Função para gerar link do WhatsApp para caldos
    function gerarLinkWhatsAppCaldos(produtoId) {
        const preco = precos[produtoId];
        const descricao = descricoes[produtoId];
        
        let mensagem = '🍲 *PEDIDO CALDOS - FORJA DO SABOR* 🍲\n\n';
        mensagem += `🥄 *Produto:* ${descricao}\n`;
        mensagem += `💰 *Preço:* R$ ${preco.toFixed(2)}\n\n`;
        
        // Adicionar observação para combos
        if (produtoId.includes('combo')) {
            mensagem += '📝 *Observação:* Favor informar os sabores desejados\n\n';
        }
        
        mensagem += '📍 *Endereço de entrega:* _Favor informar_\n';
        mensagem += '💳 *Forma de pagamento:* _Favor informar_\n\n';
        mensagem += '✅ Pedido realizado pelo site da Forja do Sabor';
        
        const numeroWhatsApp = '5591985148050';
        const mensagemCodificada = encodeURIComponent(mensagem);
        
        return `https://wa.me/${numeroWhatsApp}?text=${mensagemCodificada}`;
    }
});

