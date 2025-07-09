document.addEventListener('DOMContentLoaded', function() {
    console.log('JavaScript das saladas carregado');
    
    // Função para alterar quantidade
    window.changeQuantity = function(itemId, change) {
        const qtyInput = document.getElementById('qty-' + itemId);
        if (!qtyInput) {
            console.error('Campo de quantidade não encontrado:', 'qty-' + itemId);
            return;
        }
        
        let currentQty = parseInt(qtyInput.value) || 1;
        let newQty = currentQty + change;
        
        // Validar limites
        if (newQty < 1) newQty = 1;
        if (newQty > 10) newQty = 10;
        
        qtyInput.value = newQty;
        console.log('Quantidade alterada para:', newQty, 'Item:', itemId);
    };
    
    // Função para fazer pedido via WhatsApp
    window.fazerPedido = function(nomeSalada, tamanho, precoUnitario, itemId) {
        console.log('Fazendo pedido:', nomeSalada, tamanho, precoUnitario, itemId);
        
        const qtyInput = document.getElementById('qty-' + itemId);
        if (!qtyInput) {
            console.error('Campo de quantidade não encontrado:', 'qty-' + itemId);
            alert('Erro: Campo de quantidade não encontrado');
            return;
        }
        
        const quantidade = parseInt(qtyInput.value) || 1;
        const total = precoUnitario * quantidade;
        
        console.log('Dados do pedido:', {
            nomeSalada,
            tamanho,
            precoUnitario,
            quantidade,
            total
        });
        
        // Gerar mensagem para WhatsApp
        const mensagem = gerarMensagemWhatsApp(nomeSalada, tamanho, quantidade, total);
        
        // Codificar mensagem para URL
        const mensagemCodificada = encodeURIComponent(mensagem);
        
        // Número do WhatsApp
        const numeroWhatsApp = '5591985148050';
        
        // Gerar link do WhatsApp
        const linkWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensagemCodificada}`;
        
        console.log('Link WhatsApp gerado:', linkWhatsApp);
        
        // Abrir WhatsApp
        window.open(linkWhatsApp, '_blank');
    };
    
    // Função para gerar mensagem do WhatsApp
    function gerarMensagemWhatsApp(nomeSalada, tamanho, quantidade, total) {
        const mensagem = `🥗 *PEDIDO SALADAS - FORJA DO SABOR* 🥗

🥗 *Salada:* ${nomeSalada}
📏 *Tamanho:* ${tamanho}

📦 *Quantidade:* ${quantidade}
💰 *TOTAL: R$ ${total.toFixed(2).replace('.', ',')}*

📍 *Endereço de entrega:* _Favor informar_
💳 *Forma de pagamento:* _Favor informar_

✅ Pedido realizado pelo site da Forja do Sabor`;

        return mensagem;
    }
    
    // Inicializar todas as quantidades como 1
    const qtyInputs = document.querySelectorAll('input[type="number"][id^="qty-"]');
    qtyInputs.forEach(input => {
        input.value = 1;
        console.log('Quantidade inicializada:', input.id);
    });
    
    console.log('JavaScript das saladas inicializado com sucesso');
    console.log('Total de campos de quantidade encontrados:', qtyInputs.length);
});

