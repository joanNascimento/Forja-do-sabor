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
    const resumoContent = document.getElementById('resumo-content');
    const btnWhatsApp = document.getElementById('btn-whatsapp');
    
    console.log('Elementos encontrados:', {
        planoRadios: planoRadios.length,
        saladaProntaRadios: saladaProntaRadios.length,
        baseSelect: !!baseSelect,
        proteinaSelect: !!proteinaSelect,
        extrasCheckboxes: extrasCheckboxes.length,
        molhoRadios: molhoRadios.length,
        resumoDiv: !!resumoDiv,
        resumoContent: !!resumoContent,
        btnWhatsApp: !!btnWhatsApp
    });
    
    // Estado do pedido
    let pedidoAtual = {
        tipo: null,
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
        
        if (resumoDiv) {
            resumoDiv.parentNode.insertBefore(quantidadeDiv, resumoDiv);
            console.log('Campo de quantidade criado');
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
            if (input.value < 10) {
                input.value = parseInt(input.value) + 1;
                pedidoAtual.quantidade = parseInt(input.value);
                atualizarResumo();
            }
        });
        
        document.getElementById('quantidade').addEventListener('change', function() {
            const valor = parseInt(this.value);
            if (valor >= 1 && valor <= 10) {
                pedidoAtual.quantidade = valor;
                atualizarResumo();
            } else {
                this.value = pedidoAtual.quantidade;
            }
        });
    }

    // Função para desabilitar/habilitar campos
    function toggleCampos(habilitar) {
        if (baseSelect) baseSelect.disabled = !habilitar;
        if (proteinaSelect) proteinaSelect.disabled = !habilitar;
        extrasCheckboxes.forEach(checkbox => checkbox.disabled = !habilitar);
        molhoRadios.forEach(radio => radio.disabled = !habilitar);
        
        const formGroups = document.querySelectorAll('.form-group');
        formGroups.forEach(group => {
            if (group.querySelector('#base, #proteina, input[name="extras"], input[name="molho"]')) {
                if (habilitar) {
                    group.classList.remove('disabled');
                } else {
                    group.classList.add('disabled');
                }
            }
        });
    }

    // Função para limpar seleções
    function limparSelecoes() {
        if (baseSelect) baseSelect.value = '';
        if (proteinaSelect) proteinaSelect.value = '';
        extrasCheckboxes.forEach(checkbox => checkbox.checked = false);
        molhoRadios.forEach(radio => radio.checked = false);
        
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
                
                // CORREÇÃO: Atualizar estado ANTES de chamar atualizarResumo
                pedidoAtual.tipo = 'plano';
                pedidoAtual.plano = {
                    nome: this.value,
                    preco: parseFloat(this.dataset.price),
                    maxExtras: parseInt(this.dataset.extras)
                };
                pedidoAtual.saladaPronta = null;
                
                toggleCampos(true);
                criarCampoQuantidade();
                atualizarResumo();
            }
        });
    });

    // Event listeners para saladas prontas - CORREÇÃO PRINCIPAL AQUI
    saladaProntaRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.checked) {
                console.log('Salada pronta selecionada:', this.value);
                
                // Limpar planos
                planoRadios.forEach(r => r.checked = false);
                
                // CORREÇÃO: Atualizar estado CORRETAMENTE
                pedidoAtual.tipo = 'pronta';
                pedidoAtual.saladaPronta = {
                    nome: this.value,
                    preco: parseFloat(this.dataset.price)
                };
                pedidoAtual.plano = null;
                
                console.log('Estado atualizado:', pedidoAtual); // Log para debug
                
                limparSelecoes();
                toggleCampos(false);
                criarCampoQuantidade();
                atualizarResumo();
            }
        });
    });

    // Event listeners para campos do formulário
    if (baseSelect) {
        baseSelect.addEventListener('change', function() {
            pedidoAtual.base = this.value;
            atualizarResumo();
        });
    }

    if (proteinaSelect) {
        proteinaSelect.addEventListener('change', function() {
            pedidoAtual.proteina = this.value;
            atualizarResumo();
        });
    }

    extrasCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                if (pedidoAtual.plano && pedidoAtual.extras.length >= pedidoAtual.plano.maxExtras) {
                    this.checked = false;
                    alert(`Você pode selecionar no máximo ${pedidoAtual.plano.maxExtras} extras no plano ${pedidoAtual.plano.nome}.`);
                    return;
                }
                pedidoAtual.extras.push(this.value);
            } else {
                pedidoAtual.extras = pedidoAtual.extras.filter(extra => extra !== this.value);
            }
            atualizarResumo();
        });
    });

    molhoRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.checked) {
                pedidoAtual.molho = this.value;
                atualizarResumo();
            }
        });
    });

    // Função para atualizar resumo - CORRIGIDA
    function atualizarResumo() {
        console.log('Atualizando resumo com estado:', pedidoAtual);
        
        if (!resumoContent) {
            console.error('Elemento resumo-content não encontrado');
            return;
        }
        
        let html = '';
        
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
        } else {
            html = '<p>Selecione um plano ou salada pronta para ver o resumo</p>';
            resumoContent.innerHTML = html;
            
            if (btnWhatsApp) {
                btnWhatsApp.style.display = 'none';
            }
            return;
        }
        
        // Adicionar quantidade e total
        if (pedidoAtual.quantidade > 0 && pedidoAtual.preco > 0) {
            const total = pedidoAtual.preco * pedidoAtual.quantidade;
            html += `<div class="resumo-item"><strong>Quantidade:</strong> ${pedidoAtual.quantidade}</div>`;
            html += `<div class="resumo-item total"><strong>TOTAL: R$ ${total.toFixed(2).replace('.', ',')}</strong></div>`;
        }
        
        resumoContent.innerHTML = html;
        
        // Habilitar botão WhatsApp para saladas prontas
        if (btnWhatsApp) {
            const pedidoCompleto = (pedidoAtual.tipo === 'pronta' && pedidoAtual.saladaPronta) ||
                                 (pedidoAtual.tipo === 'plano' && pedidoAtual.plano && pedidoAtual.base && pedidoAtual.proteina && pedidoAtual.molho);
            
            if (pedidoCompleto) {
                btnWhatsApp.href = gerarLinkWhatsApp();
                btnWhatsApp.style.display = 'block';
                btnWhatsApp.style.opacity = '1';
                btnWhatsApp.style.pointerEvents = 'auto';
            } else {
                btnWhatsApp.href = '#';
                btnWhatsApp.style.display = 'none';
            }
        }
        
        console.log('Resumo atualizado com sucesso');
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
        
        const numeroWhatsApp = '5591985148050';
        const mensagemCodificada = encodeURIComponent(mensagem);
        
        console.log('Link WhatsApp gerado:', `https://wa.me/${numeroWhatsApp}?text=${mensagemCodificada}`);
        
        return `https://wa.me/${numeroWhatsApp}?text=${mensagemCodificada}`;
    }

    // Inicializar
    toggleCampos(false);
    atualizarResumo();
    
    console.log('JavaScript inicializado com sucesso');
});

