document.addEventListener('DOMContentLoaded', function() {
    // Estado do pedido
    let pedidoAtual = {
        tipo: null, // 'plano' ou 'pronta'
        plano: null,
        saladaPronta: null,
        base: null,
        proteina: null,
        extras: [],
        molho: null,
        preco: 0
    };

    // Preços e configurações
    const precos = {
        planos: {
            essencial: { preco: 45, maxExtras: 3 },
            completo: { preco: 55, maxExtras: 5 },
            premium: { preco: 65, maxExtras: 999 }
        },
        saladasprontas: {
            'mix-500': 15,
            'mix-750': 20,
            'mix-1000': 25,
            'mix-camarao-500': 20,
            'mix-camarao-750': 25,
            'mix-camarao-1000': 30
        }
    };

    // Elementos DOM
    const planosRadio = document.querySelectorAll('input[name="plano"]');
    const saladasProntasRadio = document.querySelectorAll('input[name="ready-salad"]');
    const baseSelect = document.getElementById('base');
    const proteinaSelect = document.getElementById('proteina');
    const extrasCheckboxes = document.querySelectorAll('input[name="extras"]');
    const molhoRadio = document.querySelectorAll('input[name="molho"]');
    const resumoContent = document.getElementById('resumo-content');
    const btnWhatsapp = document.getElementById('btn-whatsapp');
    const extrasWarning = document.getElementById('extras-warning');
    const proteinWarning = document.getElementById('protein-warning');

    // Event Listeners para planos
    planosRadio.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.checked) {
                pedidoAtual.tipo = 'plano';
                pedidoAtual.plano = this.value;
                pedidoAtual.saladaPronta = null;
                
                // Limpar saladas prontas
                saladasProntasRadio.forEach(r => r.checked = false);
                
                // Habilitar campos do formulário
                habilitarCamposFormulario(true);
                
                // Verificar extras e proteínas
                verificarLimiteExtras();
                verificarProteinasPremium();
                atualizarResumo();
            }
        });
    });

    // Event Listeners para saladas prontas
    saladasProntasRadio.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.checked) {
                pedidoAtual.tipo = 'pronta';
                pedidoAtual.saladaPronta = this.value;
                pedidoAtual.plano = null;
                
                // Limpar planos
                planosRadio.forEach(r => r.checked = false);
                
                // Desabilitar campos do formulário
                habilitarCamposFormulario(false);
                
                // Limpar seleções do formulário
                limparFormulario();
                atualizarResumo();
            }
        });
    });

    // Event Listeners para campos do formulário
    if (baseSelect) {
        baseSelect.addEventListener('change', function() {
            pedidoAtual.base = this.value;
            atualizarResumo();
        });
    }

    if (proteinaSelect) {
        proteinaSelect.addEventListener('change', function() {
            pedidoAtual.proteina = this.value;
            verificarProteinasPremium();
            atualizarResumo();
        });
    }

    extrasCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                pedidoAtual.extras.push(this.value);
            } else {
                pedidoAtual.extras = pedidoAtual.extras.filter(extra => extra !== this.value);
            }
            verificarLimiteExtras();
            atualizarResumo();
        });
    });

    molhoRadio.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.checked) {
                pedidoAtual.molho = this.value;
                atualizarResumo();
            }
        });
    });

    // Função para habilitar/desabilitar campos do formulário
    function habilitarCamposFormulario(habilitar) {
        if (baseSelect) baseSelect.disabled = !habilitar;
        if (proteinaSelect) proteinaSelect.disabled = !habilitar;
        extrasCheckboxes.forEach(cb => cb.disabled = !habilitar);
        molhoRadio.forEach(radio => radio.disabled = !habilitar);
        
        // Adicionar classe visual
        const formGroups = document.querySelectorAll('.form-group');
        formGroups.forEach(group => {
            if (habilitar) {
                group.classList.remove('disabled');
            } else {
                group.classList.add('disabled');
            }
        });
    }

    // Função para limpar formulário
    function limparFormulario() {
        if (baseSelect) baseSelect.selectedIndex = 0;
        if (proteinaSelect) proteinaSelect.selectedIndex = 0;
        extrasCheckboxes.forEach(cb => cb.checked = false);
        molhoRadio.forEach(radio => radio.checked = false);
        
        pedidoAtual.base = null;
        pedidoAtual.proteina = null;
        pedidoAtual.extras = [];
        pedidoAtual.molho = null;
        
        // Esconder avisos
        if (extrasWarning) extrasWarning.style.display = 'none';
        if (proteinWarning) proteinWarning.style.display = 'none';
    }

    // Função para verificar proteínas premium
    function verificarProteinasPremium() {
        if (!pedidoAtual.plano || !proteinaSelect) return;
        
        const opcoesPremium = proteinaSelect.querySelectorAll('option[value*="Premium"]');
        
        opcoesPremium.forEach(opcao => {
            if (pedidoAtual.plano !== 'premium') {
                opcao.disabled = true;
                if (opcao.selected) {
                    proteinaSelect.selectedIndex = 0;
                    pedidoAtual.proteina = null;
                    if (proteinWarning) proteinWarning.style.display = 'block';
                }
            } else {
                opcao.disabled = false;
                if (proteinWarning) proteinWarning.style.display = 'none';
            }
        });
    }

    // Função para verificar limite de extras
    function verificarLimiteExtras() {
        if (!pedidoAtual.plano) return;
        
        const maxExtras = precos.planos[pedidoAtual.plano].maxExtras;
        const extrasCount = pedidoAtual.extras.length;
        
        if (extrasCount >= maxExtras && maxExtras !== 999) {
            // Desabilitar checkboxes não marcados
            extrasCheckboxes.forEach(cb => {
                if (!cb.checked) {
                    cb.disabled = true;
                    cb.closest('.extra-option').classList.add('disabled');
                }
            });
            
            if (extrasWarning) {
                extrasWarning.style.display = 'block';
            }
        } else {
            // Habilitar todos os checkboxes
            extrasCheckboxes.forEach(cb => {
                cb.disabled = false;
                cb.closest('.extra-option').classList.remove('disabled');
            });
            
            if (extrasWarning) {
                extrasWarning.style.display = 'none';
            }
        }
    }

    // Função para calcular preço
    function calcularPreco() {
        if (pedidoAtual.tipo === 'plano' && pedidoAtual.plano) {
            return precos.planos[pedidoAtual.plano].preco;
        } else if (pedidoAtual.tipo === 'pronta' && pedidoAtual.saladaPronta) {
            return precos.saladasprontas[pedidoAtual.saladaPronta];
        }
        return 0;
    }

    // Função para atualizar resumo
    function atualizarResumo() {
        if (!resumoContent) return;
        
        const preco = calcularPreco();
        pedidoAtual.preco = preco;
        
        let resumoHTML = '';
        
        if (pedidoAtual.tipo === 'plano' && pedidoAtual.plano) {
            const planoInfo = precos.planos[pedidoAtual.plano];
            resumoHTML = `
                <div class="resumo-item">
                    <strong>Plano:</strong> ${pedidoAtual.plano.charAt(0).toUpperCase() + pedidoAtual.plano.slice(1)}
                </div>
                <div class="resumo-item">
                    <strong>Preço:</strong> R$ ${preco.toFixed(2)}
                </div>
            `;
            
            if (pedidoAtual.base && pedidoAtual.base !== 'Selecione a base') {
                resumoHTML += `<div class="resumo-item"><strong>Base:</strong> ${pedidoAtual.base}</div>`;
            }
            
            if (pedidoAtual.proteina && pedidoAtual.proteina !== 'Selecione a proteína') {
                resumoHTML += `<div class="resumo-item"><strong>Proteína:</strong> ${pedidoAtual.proteina}</div>`;
            }
            
            if (pedidoAtual.extras.length > 0) {
                resumoHTML += `<div class="resumo-item"><strong>Extras:</strong> ${pedidoAtual.extras.join(', ')}</div>`;
            }
            
            if (pedidoAtual.molho) {
                resumoHTML += `<div class="resumo-item"><strong>Molho:</strong> ${pedidoAtual.molho}</div>`;
            }
            
        } else if (pedidoAtual.tipo === 'pronta' && pedidoAtual.saladaPronta) {
            const saladaInfo = getSaladaProntaInfo(pedidoAtual.saladaPronta);
            resumoHTML = `
                <div class="resumo-item">
                    <strong>Salada:</strong> ${saladaInfo.nome}
                </div>
                <div class="resumo-item">
                    <strong>Tamanho:</strong> ${saladaInfo.tamanho}
                </div>
                <div class="resumo-item">
                    <strong>Preço:</strong> R$ ${preco.toFixed(2)}
                </div>
                <div class="resumo-item">
                    <strong>Ingredientes:</strong> ${saladaInfo.ingredientes}
                </div>
            `;
        } else {
            resumoHTML = '<p>Selecione um plano ou salada pronta para ver o resumo</p>';
        }
        
        resumoContent.innerHTML = resumoHTML;
        
        // Mostrar/esconder botão WhatsApp
        if (btnWhatsapp) {
            if (preco > 0 && pedidoValido()) {
                btnWhatsapp.style.display = 'inline-block';
                btnWhatsapp.href = gerarLinkWhatsApp();
            } else {
                btnWhatsapp.style.display = 'none';
            }
        }
    }

    // Função para verificar se pedido é válido
    function pedidoValido() {
        if (pedidoAtual.tipo === 'pronta') {
            return pedidoAtual.saladaPronta !== null;
        } else if (pedidoAtual.tipo === 'plano') {
            return pedidoAtual.plano && 
                   pedidoAtual.base && 
                   pedidoAtual.base !== 'Selecione a base' &&
                   pedidoAtual.proteina && 
                   pedidoAtual.proteina !== 'Selecione a proteína' &&
                   pedidoAtual.molho;
        }
        return false;
    }

    // Função para obter informações da salada pronta
    function getSaladaProntaInfo(codigo) {
        const infos = {
            'mix-500': {
                nome: 'Salada Mix Completa',
                tamanho: '500ml',
                ingredientes: 'Mix de folhas, pepino, cenoura, cebola roxa, repolho, tomate cereja, kani, ovo de codorna e gergelim'
            },
            'mix-750': {
                nome: 'Salada Mix Completa',
                tamanho: '750ml',
                ingredientes: 'Mix de folhas, pepino, cenoura, cebola roxa, repolho, tomate cereja, kani, ovo de codorna e gergelim'
            },
            'mix-1000': {
                nome: 'Salada Mix Completa',
                tamanho: '1000ml',
                ingredientes: 'Mix de folhas, pepino, cenoura, cebola roxa, repolho, tomate cereja, kani, ovo de codorna e gergelim'
            },
            'mix-camarao-500': {
                nome: 'Salada Mix com Camarão',
                tamanho: '500ml',
                ingredientes: 'Mix de folhas, pepino, cenoura, cebola roxa, repolho, tomate cereja, kani, ovo de codorna, gergelim e camarão'
            },
            'mix-camarao-750': {
                nome: 'Salada Mix com Camarão',
                tamanho: '750ml',
                ingredientes: 'Mix de folhas, pepino, cenoura, cebola roxa, repolho, tomate cereja, kani, ovo de codorna, gergelim e camarão'
            },
            'mix-camarao-1000': {
                nome: 'Salada Mix com Camarão',
                tamanho: '1000ml',
                ingredientes: 'Mix de folhas, pepino, cenoura, cebola roxa, repolho, tomate cereja, kani, ovo de codorna, gergelim e camarão'
            }
        };
        
        return infos[codigo] || { nome: 'Salada', tamanho: '', ingredientes: '' };
    }

    // Função para gerar link do WhatsApp
    function gerarLinkWhatsApp() {
        let mensagem = '🥗 *PEDIDO - FORJA DO SABOR* 🥗\n\n';
        
        if (pedidoAtual.tipo === 'plano') {
            mensagem += `📋 *Plano:* ${pedidoAtual.plano.charAt(0).toUpperCase() + pedidoAtual.plano.slice(1)}\n`;
            mensagem += `🥬 *Base:* ${pedidoAtual.base}\n`;
            mensagem += `🍗 *Proteína:* ${pedidoAtual.proteina}\n`;
            
            if (pedidoAtual.extras.length > 0) {
                mensagem += `➕ *Extras:* ${pedidoAtual.extras.join(', ')}\n`;
            }
            
            mensagem += `🥄 *Molho:* ${pedidoAtual.molho}\n`;
            
        } else if (pedidoAtual.tipo === 'pronta') {
            const saladaInfo = getSaladaProntaInfo(pedidoAtual.saladaPronta);
            mensagem += `🥗 *Salada:* ${saladaInfo.nome}\n`;
            mensagem += `📏 *Tamanho:* ${saladaInfo.tamanho}\n`;
            mensagem += `🥬 *Ingredientes:* ${saladaInfo.ingredientes}\n`;
        }
        
        mensagem += `\n💰 *TOTAL: R$ ${pedidoAtual.preco.toFixed(2)}*\n\n`;
        mensagem += '📍 *Endereço de entrega:* _Favor informar_\n';
        mensagem += '💳 *Forma de pagamento:* _Favor informar_\n\n';
        mensagem += '✅ Pedido realizado pelo site da Forja do Sabor';
        
        const numeroWhatsApp = '5591985148050';
        const mensagemCodificada = encodeURIComponent(mensagem);
        
        return `https://wa.me/${numeroWhatsApp}?text=${mensagemCodificada}`;
    }

    // Inicializar
    habilitarCamposFormulario(false);
    atualizarResumo();
});

