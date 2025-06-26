document.addEventListener('DOMContentLoaded', function() {
    console.log('JavaScript carregado para página de saladas');
    
    // Elementos principais
    const planoRadios = document.querySelectorAll('input[name="plano"]');
    const saladaProntaRadios = document.querySelectorAll('input[name="ready-salad"]');
    const baseSelect = document.getElementById('base');
    const proteinaSelect = document.getElementById('proteina');
    const extrasCheckboxes = document.querySelectorAll('input[name="extras"]');
    const molhoRadios = document.querySelectorAll('input[name="molho"]');
    const resumoDiv = document.getElementById('resumo-pedido');
    const btnWhatsApp = document.getElementById('btn-whatsapp');
    
    // Grupos de formulário para controle de disabled/enabled
    const baseGroup = document.getElementById('base-group');
    const proteinaGroup = document.getElementById('proteina-group');
    const extrasGroup = document.getElementById('extras-group');
    const molhoGroup = document.getElementById('molho-group');

    // Mensagens de aviso
    const proteinWarning = document.getElementById('protein-warning');
    const extrasWarning = document.getElementById('extras-warning');

    // Estado do pedido
    let pedidoAtual = {
        tipo: null, // 'plano' ou 'pronta'
        plano: null,
        saladaPronta: null,
        base: '',
        proteina: '',
        extras: [],
        molho: '',
        quantidade: 1,
        preco: 0
    };

    // Função para criar campo de quantidade
    function criarCampoQuantidade() {
        // Verificar se já existe para evitar duplicação
        if (document.getElementById('quantidade')) {
            return;
        }
        
        const quantidadeDiv = document.createElement('div');
        quantidadeDiv.className = 'form-group quantidade-group';
        quantidadeDiv.innerHTML = `
            <label for="quantidade">Quantidade:</label>
            <div class="quantidade-controls">
                <button type="button" class="qty-btn" id="qty-minus">-</button>
                <input type="number" id="quantidade" name="quantidade" value="1" min="1" max="10">
                <button type="button" class="qty-btn" id="qty-plus">+</button>
            </div>
        `;
        
        // Inserir antes do resumo
        const resumoSection = document.querySelector('.resumo-section') || document.getElementById('resumo-pedido').parentNode; // Garante que a quantidade seja inserida antes do resumo
        if (resumoSection) {
            resumoSection.parentNode.insertBefore(quantidadeDiv, resumoSection);
        }
        
        // Event listeners para os botões de quantidade
        document.getElementById('qty-minus').addEventListener('click', function() {
            const input = document.getElementById('quantidade');
            if (input.value > 1) {
                input.value = parseInt(input.value) - 1;
                pedidoAtual.quantidade = parseInt(input.value);
                atualizarResumo();
            }
        });
        
        document.getElementById('qty-plus').addEventListener('click', function() {
            const input = document.getElementById('quantidade');
            if (input.value < 10) { // Limite de 10 unidades por pedido
                input.value = parseInt(input.value) + 1;
                pedidoAtual.quantidade = parseInt(input.value);
                atualizarResumo();
            }
        });
        
        document.getElementById('quantidade').addEventListener('change', function() {
            const valor = parseInt(this.value);
            if (valor >= 1 && valor <= 10) { // Validação de 1 a 10
                pedidoAtual.quantidade = valor;
                atualizarResumo();
            } else {
                // Se o valor for inválido, reverte para a quantidade anterior ou 1
                this.value = pedidoAtual.quantidade > 0 ? pedidoAtual.quantidade : 1;
            }
        });
    }

    // Função para desabilitar/habilitar campos
    function toggleCampos(habilitar) {
        // Seleção de base, proteína, extras e molho
        if (baseSelect) baseSelect.disabled = !habilitar;
        if (proteinaSelect) proteinaSelect.disabled = !habilitar;
        extrasCheckboxes.forEach(checkbox => checkbox.disabled = !habilitar);
        molhoRadios.forEach(radio => radio.disabled = !habilitar);
        
        // Adiciona/remove classe 'disabled' nos grupos para feedback visual
        if (baseGroup) habilitar ? baseGroup.classList.remove('disabled') : baseGroup.classList.add('disabled');
        if (proteinaGroup) habilitar ? proteinaGroup.classList.remove('disabled') : proteinaGroup.classList.add('disabled');
        if (extrasGroup) habilitar ? extrasGroup.classList.remove('disabled') : extrasGroup.classList.add('disabled');
        if (molhoGroup) habilitar ? molhoGroup.classList.remove('disabled') : molhoGroup.classList.add('disabled');

        // Resetar warnings
        proteinWarning.style.display = 'none';
        extrasWarning.style.display = 'none';
    }

    // Função para limpar seleções (útil ao trocar de plano para salada pronta)
    function limparSelecoes() {
        if (baseSelect) baseSelect.value = '';
        if (proteinaSelect) proteinaSelect.value = '';
        extrasCheckboxes.forEach(checkbox => checkbox.checked = false);
        molhoRadios.forEach(radio => radio.checked = false);
        
        // Resetar o estado do pedido para campos específicos de plano
        pedidoAtual.base = '';
        pedidoAtual.proteina = '';
        pedidoAtual.extras = [];
        pedidoAtual.molho = '';
    }

    // Event listeners para planos
    planoRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.checked) {
                console.log('Plano selecionado:', this.value);
                
                // Limpar saladas prontas
                saladaProntaRadios.forEach(r => r.checked = false);
                
                pedidoAtual.tipo = 'plano';
                pedidoAtual.plano = {
                    nome: this.value,
                    preco: parseFloat(this.dataset.price),
                    maxExtras: parseInt(this.dataset.extras)
                };
                pedidoAtual.saladaPronta = null; // Zera a salada pronta selecionada
                
                limparSelecoes(); // Limpa as seleções anteriores (importante ao trocar de salada pronta para plano)
                toggleCampos(true); // Habilita os campos de montagem
                atualizarResumo();
                
                // Criar campo de quantidade se não existir
                criarCampoQuantidade();
                checkProteinaOptions(); // Verifica as opções de proteína ao mudar de plano
            }
        });
    });

    // Event listeners para saladas prontas
    saladaProntaRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.checked) {
                console.log('Salada pronta selecionada:', this.value);
                
                // Limpar planos
                planoRadios.forEach(r => r.checked = false);
                
                pedidoAtual.tipo = 'pronta';
                pedidoAtual.saladaPronta = {
                    nome: this.value,
                    preco: parseFloat(this.dataset.price)
                };
                pedidoAtual.plano = null; // Zera o plano selecionado
                
                // Limpar campos do formulário de montagem, já que é salada pronta
                limparSelecoes();
                toggleCampos(false); // Desabilita os campos de montagem
                atualizarResumo();
                
                // Criar campo de quantidade se não existir
                criarCampoQuantidade();
                checkProteinaOptions(); // Atualiza estado das proteínas
            }
        });
    });

    // Event listener para seleção de Proteína
    if (proteinaSelect) {
        proteinaSelect.addEventListener('change', function() {
            pedidoAtual.proteina = this.value;
            checkProteinaOptions(); // Chama ao selecionar a proteína
            atualizarResumo();
        });
    }

    // Função para verificar e controlar opções de proteína
    function checkProteinaOptions() {
        const premiumProteins = ['Camarão Rosa Salteado (Premium)', 'Salmão Grelhado (Premium)'];
        const isPremiumPlan = pedidoAtual.plano && pedidoAtual.plano.nome === 'premium';

        proteinaSelect.querySelectorAll('option').forEach(option => {
            const isPremiumProtein = premiumProteins.includes(option.value);

            if (isPremiumProtein) {
                if (!isPremiumPlan) {
                    option.disabled = true;
                    option.classList.add('protein-disabled');
                    // Se uma proteína premium estiver selecionada sem o plano Premium, deselecionar
                    if (pedidoAtual.proteina === option.value) {
                        proteinaSelect.value = '';
                        pedidoAtual.proteina = '';
                        proteinWarning.style.display = 'block'; // Mostra aviso
                    }
                } else {
                    option.disabled = false;
                    option.classList.remove('protein-disabled');
                    proteinWarning.style.display = 'none'; // Esconde aviso
                }
            } else {
                option.disabled = false; // Garante que outras proteínas estejam sempre habilitadas
                option.classList.remove('protein-disabled');
            }
        });
    }


    // Event listeners para base
    if (baseSelect) {
        baseSelect.addEventListener('change', function() {
            pedidoAtual.base = this.value;
            atualizarResumo();
        });
    }

    // Event listeners para extras
    extrasCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (!pedidoAtual.plano) { // Impede seleção de extras se não houver plano
                this.checked = false;
                alert('Por favor, selecione um plano primeiro.');
                return;
            }

            if (this.checked) {
                if (pedidoAtual.plano.maxExtras !== 999 && pedidoAtual.extras.length >= pedidoAtual.plano.maxExtras) {
                    this.checked = false;
                    extrasWarning.style.display = 'block'; // Mostra aviso
                    //alert(`Você pode selecionar no máximo ${pedidoAtual.plano.maxExtras} extras no plano ${pedidoAtual.plano.nome}.`);
                    return;
                }
                pedidoAtual.extras.push(this.value);
            } else {
                pedidoAtual.extras = pedidoAtual.extras.filter(extra => extra !== this.value);
                extrasWarning.style.display = 'none'; // Esconde aviso se o limite não for mais atingido
            }
            atualizarResumo();
        });
    });

    // Event listeners para molho
    molhoRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.checked) {
                pedidoAtual.molho = this.value;
                atualizarResumo();
            }
        });
    });

    // Função para atualizar resumo
    function atualizarResumo() {
        if (!resumoDiv) return;
        
        let html = '<h3>Resumo do seu Pedido</h3>';
        let pedidoCompletoParaWhatsApp = false; // Flag para controlar o botão do WhatsApp
        
        if (pedidoAtual.tipo === 'plano' && pedidoAtual.plano) {
            pedidoAtual.preco = pedidoAtual.plano.preco;
            
            html += `<div class="resumo-item"><strong>Plano:</strong> ${pedidoAtual.plano.nome.charAt(0).toUpperCase() + pedidoAtual.plano.nome.slice(1)}</div>`;
            
            if (pedidoAtual.base) {
                html += `<div class="resumo-item"><strong>Base:</strong> ${pedidoAtual.base}</div>`;
            }
            
            if (pedidoAtual.proteina) {
                html += `<div class="resumo-item"><strong>Proteína:</strong> ${pedidoAtual.proteina}</div>`;
            }
            
            if (pedidoAtual.extras.length > 0) {
                html += `<div class="resumo-item"><strong>Extras:</strong> ${pedidoAtual.extras.join(', ')}</div>`;
            }
            
            if (pedidoAtual.molho) {
                html += `<div class="resumo-item"><strong>Molho:</strong> ${pedidoAtual.molho}</div>`;
            }
            
            // Condição para habilitar o botão do WhatsApp para planos
            pedidoCompletoParaWhatsApp = pedidoAtual.base && pedidoAtual.proteina && pedidoAtual.molho;
            
        } else if (pedidoAtual.tipo === 'pronta' && pedidoAtual.saladaPronta) {
            pedidoAtual.preco = pedidoAtual.saladaPronta.preco;
            
            const nomesSaladas = {
                'mix-500': 'Salada Mix Completa 500ml',
                'mix-750': 'Salada Mix Completa 750ml',
                'mix-1000': 'Salada Mix Completa 1000ml',
                'mix-camarao-500': 'Salada Mix com Camarão 500ml',
                'mix-camarao-750': 'Salada Mix com Camarão 750ml',
                'mix-camarao-1000': 'Salada Mix com Camarão 1000ml'
            };
            
            html += `<div class="resumo-item"><strong>Salada:</strong> ${nomesSaladas[pedidoAtual.saladaPronta.nome] || pedidoAtual.saladaPronta.nome}</div>`;
            
            // Condição para habilitar o botão do WhatsApp para saladas prontas
            pedidoCompletoParaWhatsApp = true; // Salada pronta já é "completa" ao ser selecionada
        } else {
            html += '<p>Selecione um plano ou salada pronta para ver o resumo</p>';
            resumoDiv.innerHTML = html;
            // Desabilita o botão se não houver seleção
            if (btnWhatsApp) {
                btnWhatsApp.href = '#';
                btnWhatsApp.style.opacity = '0.5';
                btnWhatsApp.style.pointerEvents = 'none';
            }
            return;
        }
        
        // Adicionar quantidade e total
        if (pedidoAtual.quantidade > 0 && pedidoAtual.preco > 0) {
            const total = pedidoAtual.preco * pedidoAtual.quantidade;
            html += `<div class="resumo-item"><strong>Quantidade:</strong> ${pedidoAtual.quantidade}</div>`;
            html += `<div class="resumo-item total"><strong>TOTAL: R$ ${total.toFixed(2).replace('.', ',')}</strong></div>`;
        }
        
        resumoDiv.innerHTML = html;
        
        // Habilitar/desabilitar botão WhatsApp com base na flag
        if (btnWhatsApp) {
            if (pedidoCompletoParaWhatsApp) {
                btnWhatsApp.href = gerarLinkWhatsApp();
                btnWhatsApp.style.opacity = '1';
                btnWhatsApp.style.pointerEvents = 'auto';
            } else {
                btnWhatsApp.href = '#';
                btnWhatsApp.style.opacity = '0.5';
                btnWhatsApp.style.pointerEvents = 'none';
            }
        }
    }

    // Função para gerar link do WhatsApp
    function gerarLinkWhatsApp() {
        let mensagem = '🥗 *PEDIDO SALADAS - FORJA DO SABOR* 🥗\\n\\n';
        
        if (pedidoAtual.tipo === 'plano') {
            mensagem += `📋 *Plano:* ${pedidoAtual.plano.nome.charAt(0).toUpperCase() + pedidoAtual.plano.nome.slice(1)}\\n`;
            mensagem += `🥬 *Base:* ${pedidoAtual.base}\\n`;
            mensagem += `🍗 *Proteína:* ${pedidoAtual.proteina}\\n`;
            
            if (pedidoAtual.extras.length > 0) {
                mensagem += `➕ *Extras:* ${pedidoAtual.extras.join(', ')}\\n`;
            }
            
            mensagem += `🥄 *Molho:* ${pedidoAtual.molho}\\n`;
        } else {
            const nomesSaladas = {
                'mix-500': 'Salada Mix Completa 500ml',
                'mix-750': 'Salada Mix Completa 750ml',
                'mix-1000': 'Salada Mix Completa 1000ml',
                'mix-camarao-500': 'Salada Mix com Camarão 500ml',
                'mix-camarao-750': 'Salada Mix com Camarão 750ml',
                'mix-camarao-1000': 'Salada Mix com Camarão 1000ml'
            };
            
            mensagem += `🥗 *Salada:* ${nomesSaladas[pedidoAtual.saladaPronta.nome]}\\n`;
        }
        
        const total = pedidoAtual.preco * pedidoAtual.quantidade;
        mensagem += `\\n📦 *Quantidade:* ${pedidoAtual.quantidade}\\n`;
        mensagem += `💰 *TOTAL: R$ ${total.toFixed(2).replace('.', ',')}*\\n\\n`;
        mensagem += '📍 *Endereço de entrega:* _Favor informar_\\n';
        mensagem += '💳 *Forma de pagamento:* _Favor informar_\\n\\n';
        mensagem += '✅ Pedido realizado pelo site da Forja do Sabor';
        
        const numeroWhatsApp = '5591985148050'; // Número de WhatsApp do Forja do Sabor
        const mensagemCodificada = encodeURIComponent(mensagem);
        
        return `https://wa.me/${numeroWhatsApp}?text=${mensagemCodificada}`;
    }

    // Inicializar o estado dos campos e do resumo
    toggleCampos(false); // Começa com os campos de montagem desabilitados
    atualizarResumo(); // Atualiza o resumo inicial
    checkProteinaOptions(); // Verifica as opções de proteína na inicialização
    
    console.log('JavaScript inicializado com sucesso');
});
