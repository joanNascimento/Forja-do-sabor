document.addEventListener('DOMContentLoaded', function() {
    // Preços dos produtos gourmet
    const precos = {
        'tabua-pequena': 35,
        'tabua-media': 45,
        'tabua-grande': 55,
        'combo-premium': 75,
        'combo-executivo': 65,
        'combo-familia': 85
    };

    // Descrições dos produtos
    const descricoes = {
        'tabua-pequena': 'Tábua Pequena - Seleção de frios e queijos para 2 pessoas',
        'tabua-media': 'Tábua Média - Seleção de frios e queijos para 3-4 pessoas',
        'tabua-grande': 'Tábua Grande - Seleção de frios e queijos para 5-6 pessoas',
        'combo-premium': 'Combo Premium - Tábua grande + bebidas + acompanhamentos especiais',
        'combo-executivo': 'Combo Executivo - Tábua média + bebidas + acompanhamentos',
        'combo-familia': 'Combo Família - Tábua grande + bebidas + acompanhamentos + sobremesa'
    };

    // Adicionar botões de pedido a todos os produtos
    const produtoCards = document.querySelectorAll('.product-card, .combo-card');
    
    produtoCards.forEach(card => {
        // Identificar o produto pelo título ou classe
        const titulo = card.querySelector('h3, h4');
        let produtoId = null;
        
        if (titulo) {
            const textoTitulo = titulo.textContent.toLowerCase();
            
            if (textoTitulo.includes('pequena')) produtoId = 'tabua-pequena';
            else if (textoTitulo.includes('média')) produtoId = 'tabua-media';
            else if (textoTitulo.includes('grande')) produtoId = 'tabua-grande';
            else if (textoTitulo.includes('premium')) produtoId = 'combo-premium';
            else if (textoTitulo.includes('executivo')) produtoId = 'combo-executivo';
            else if (textoTitulo.includes('família')) produtoId = 'combo-familia';
        }
        
        if (produtoId && precos[produtoId]) {
            // Verificar se já existe botão
            if (!card.querySelector('.btn-pedido')) {
                const btnPedido = document.createElement('a');
                btnPedido.className = 'btn-pedido';
                btnPedido.innerHTML = '<i class="fab fa-whatsapp"></i> Pedir via WhatsApp';
                btnPedido.href = gerarLinkWhatsAppGourmet(produtoId);
                btnPedido.target = '_blank';
                
                card.appendChild(btnPedido);
            }
        }
    });

    // Função para gerar link do WhatsApp para produtos gourmet
    function gerarLinkWhatsAppGourmet(produtoId) {
        const preco = precos[produtoId];
        const descricao = descricoes[produtoId];
        
        let mensagem = '🧀 *PEDIDO GOURMET - FORJA DO SABOR* 🧀\n\n';
        mensagem += `🍽️ *Produto:* ${descricao}\n`;
        mensagem += `💰 *Preço:* R$ ${preco.toFixed(2)}\n\n`;
        mensagem += '📍 *Endereço de entrega:* _Favor informar_\n';
        mensagem += '💳 *Forma de pagamento:* _Favor informar_\n\n';
        mensagem += '✅ Pedido realizado pelo site da Forja do Sabor';
        
        const numeroWhatsApp = '5591985148050';
        const mensagemCodificada = encodeURIComponent(mensagem);
        
        return `https://wa.me/${numeroWhatsApp}?text=${mensagemCodificada}`;
    }
});

