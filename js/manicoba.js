document.addEventListener('DOMContentLoaded', function() {
    // Preços dos produtos de maniçoba
    const precos = {
        'pote-individual-500ml': 18,
        'pote-individual-750ml': 25,
        'pote-individual-1000ml': 32,
        'combo-duplo': 45,
        'combo-familia': 85,
        'combo-festa': 150,
        'suco-acai-300ml': 8,
        'suco-acai-500ml': 12,
        'suco-cupuacu-300ml': 8,
        'suco-cupuacu-500ml': 12
    };

    // Descrições dos produtos
    const descricoes = {
        'pote-individual-500ml': 'Maniçoba Individual 500ml - Porção individual da tradicional maniçoba paraense',
        'pote-individual-750ml': 'Maniçoba Individual 750ml - Porção generosa da tradicional maniçoba paraense',
        'pote-individual-1000ml': 'Maniçoba Individual 1000ml - Porção família da tradicional maniçoba paraense',
        'combo-duplo': 'Combo Duplo - 2 potes de 500ml + acompanhamentos',
        'combo-familia': 'Combo Família - 4 potes de 500ml + acompanhamentos + bebidas',
        'combo-festa': 'Combo Festa - 8 potes de 500ml + acompanhamentos + bebidas + sobremesa',
        'suco-acai-300ml': 'Suco de Açaí Natural 300ml',
        'suco-acai-500ml': 'Suco de Açaí Natural 500ml',
        'suco-cupuacu-300ml': 'Suco de Cupuaçu Natural 300ml',
        'suco-cupuacu-500ml': 'Suco de Cupuaçu Natural 500ml'
    };

    // Adicionar botões de pedido a todos os produtos
    const produtoCards = document.querySelectorAll('.product-card, .combo-card, .juice-card');
    
    produtoCards.forEach(card => {
        // Identificar o produto pelo título ou classe
        const titulo = card.querySelector('h3, h4');
        const preco = card.querySelector('.price');
        let produtoId = null;
        
        if (titulo && preco) {
            const textoTitulo = titulo.textContent.toLowerCase();
            const textoPreco = preco.textContent;
            
            // Identificar por título e preço
            if (textoTitulo.includes('500ml') && textoPreco.includes('18')) {
                produtoId = 'pote-individual-500ml';
            } else if (textoTitulo.includes('750ml') && textoPreco.includes('25')) {
                produtoId = 'pote-individual-750ml';
            } else if (textoTitulo.includes('1000ml') && textoPreco.includes('32')) {
                produtoId = 'pote-individual-1000ml';
            } else if (textoTitulo.includes('duplo')) {
                produtoId = 'combo-duplo';
            } else if (textoTitulo.includes('família')) {
                produtoId = 'combo-familia';
            } else if (textoTitulo.includes('festa')) {
                produtoId = 'combo-festa';
            } else if (textoTitulo.includes('açaí') && textoTitulo.includes('300ml')) {
                produtoId = 'suco-acai-300ml';
            } else if (textoTitulo.includes('açaí') && textoTitulo.includes('500ml')) {
                produtoId = 'suco-acai-500ml';
            } else if (textoTitulo.includes('cupuaçu') && textoTitulo.includes('300ml')) {
                produtoId = 'suco-cupuacu-300ml';
            } else if (textoTitulo.includes('cupuaçu') && textoTitulo.includes('500ml')) {
                produtoId = 'suco-cupuacu-500ml';
            }
        }
        
        if (produtoId && precos[produtoId]) {
            // Verificar se já existe botão
            if (!card.querySelector('.btn-pedido')) {
                const btnPedido = document.createElement('a');
                btnPedido.className = 'btn-pedido';
                btnPedido.innerHTML = '<i class="fab fa-whatsapp"></i> Pedir via WhatsApp';
                btnPedido.href = gerarLinkWhatsAppManicoba(produtoId);
                btnPedido.target = '_blank';
                
                card.appendChild(btnPedido);
            }
        }
    });

    // Função para gerar link do WhatsApp para produtos de maniçoba
    function gerarLinkWhatsAppManicoba(produtoId) {
        const preco = precos[produtoId];
        const descricao = descricoes[produtoId];
        
        let mensagem = '🍲 *PEDIDO MANIÇOBA - FORJA DO SABOR* 🍲\n\n';
        mensagem += `🥘 *Produto:* ${descricao}\n`;
        mensagem += `💰 *Preço:* R$ ${preco.toFixed(2)}\n\n`;
        mensagem += '📍 *Endereço de entrega:* _Favor informar_\n';
        mensagem += '💳 *Forma de pagamento:* _Favor informar_\n\n';
        mensagem += '✅ Pedido realizado pelo site da Forja do Sabor';
        
        const numeroWhatsApp = '5591985148050';
        const mensagemCodificada = encodeURIComponent(mensagem);
        
        return `https://wa.me/${numeroWhatsApp}?text=${mensagemCodificada}`;
    }
});

