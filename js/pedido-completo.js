// Sistema de Pedidos Completo com Modal
class SistemaPedidos {
    constructor() {
        this.pedidoAtual = null;
        this.init();
    }

    init() {
        this.criarModal();
        this.configurarEventos();
    }

    criarModal() {
        const modalHTML = `
            <div id="modal-pedido" class="modal-overlay">
                <div class="modal-content">
                    <button class="modal-close" onclick="sistemaPedidos.fecharModal()">&times;</button>
                    
                    <div class="modal-header">
                        <h3>🥗 Finalizar Pedido - Forja do Sabor</h3>
                        <p>Preencha os dados para confirmar seu pedido</p>
                    </div>

                    <div id="pedido-resumo" class="pedido-resumo">
                        <!-- Resumo será preenchido dinamicamente -->
                    </div>

                    <div class="taxa-entrega">
                        📍 Taxa de entrega na região metropolitana de Belém: R$ 5,00
                    </div>

                    <form id="form-pedido">
                        <div class="form-field required">
                            <label for="endereco">Endereço de Entrega</label>
                            <textarea id="endereco" placeholder="Digite seu endereço completo (rua, número, bairro, referências)" required></textarea>
                        </div>

                        <div class="form-field required">
                            <label for="forma-pagamento">Forma de Pagamento</label>
                            <select id="forma-pagamento" required>
                                <option value="">Selecione a forma de pagamento</option>
                                <option value="dinheiro">Dinheiro</option>
                                <option value="pix">PIX</option>
                                <option value="cartao-debito">Cartão de Débito</option>
                                <option value="cartao-credito">Cartão de Crédito</option>
                            </select>
                        </div>

                        <div class="form-field conditional" id="campo-troco">
                            <label for="troco">Troco para quanto?</label>
                            <input type="text" id="troco" placeholder="Ex: R$ 50,00">
                        </div>

                        <div class="form-field">
                            <label for="observacoes">Observações (opcional)</label>
                            <textarea id="observacoes" placeholder="Alguma observação especial para seu pedido?"></textarea>
                        </div>
                    </form>

                    <div class="modal-buttons">
                        <button type="button" class="btn-modal btn-cancelar" onclick="sistemaPedidos.fecharModal()">
                            Cancelar
                        </button>
                        <button type="button" class="btn-modal btn-confirmar" onclick="sistemaPedidos.confirmarPedido()">
                            <i class="fab fa-whatsapp"></i> Enviar Pedido
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    configurarEventos() {
        // Evento para mostrar/ocultar campo de troco
        const formaPagamento = document.getElementById('forma-pagamento');
        const campoTroco = document.getElementById('campo-troco');

        formaPagamento.addEventListener('change', () => {
            if (formaPagamento.value === 'dinheiro') {
                campoTroco.classList.add('show');
                document.getElementById('troco').required = true;
            } else {
                campoTroco.classList.remove('show');
                document.getElementById('troco').required = false;
                document.getElementById('troco').value = '';
            }
        });

        // Fechar modal ao clicar fora
        document.getElementById('modal-pedido').addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                this.fecharModal();
            }
        });

        // Fechar modal com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.fecharModal();
            }
        });
    }

    abrirModal(produto, tamanho, preco, quantidade = 1) {
        this.pedidoAtual = {
            produto,
            tamanho,
            preco,
            quantidade,
            total: preco * quantidade
        };

        this.atualizarResumo();
        this.limparFormulario();
        
        const modal = document.getElementById('modal-pedido');
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    fecharModal() {
        const modal = document.getElementById('modal-pedido');
        modal.classList.remove('active');
        document.body.style.overflow = '';
        this.pedidoAtual = null;
    }

    atualizarResumo() {
        if (!this.pedidoAtual) return;

        const resumoElement = document.getElementById('pedido-resumo');
        resumoElement.innerHTML = `
            <h4>📋 Resumo do Pedido</h4>
            <div class="produto">${this.pedidoAtual.produto}</div>
            <div class="produto">${this.pedidoAtual.tamanho}</div>
            <div class="produto">Quantidade: ${this.pedidoAtual.quantidade}</div>
            <div class="total">💰 Total: R$ ${this.pedidoAtual.total.toFixed(2).replace('.', ',')}</div>
        `;
    }

    limparFormulario() {
        document.getElementById('form-pedido').reset();
        document.getElementById('campo-troco').classList.remove('show');
        document.getElementById('troco').required = false;
    }

    validarFormulario() {
        const endereco = document.getElementById('endereco').value.trim();
        const formaPagamento = document.getElementById('forma-pagamento').value;
        const troco = document.getElementById('troco').value.trim();

        if (!endereco) {
            alert('Por favor, informe o endereço de entrega.');
            return false;
        }

        if (!formaPagamento) {
            alert('Por favor, selecione a forma de pagamento.');
            return false;
        }

        if (formaPagamento === 'dinheiro' && !troco) {
            alert('Por favor, informe para quanto você precisa de troco.');
            return false;
        }

        return true;
    }

    confirmarPedido() {
        if (!this.validarFormulario()) return;

        const endereco = document.getElementById('endereco').value.trim();
        const formaPagamento = document.getElementById('forma-pagamento').value;
        const troco = document.getElementById('troco').value.trim();
        const observacoes = document.getElementById('observacoes').value.trim();

        const formaPagamentoTexto = {
            'dinheiro': 'Dinheiro',
            'pix': 'PIX',
            'cartao-debito': 'Cartão de Débito',
            'cartao-credito': 'Cartão de Crédito'
        };

        let mensagem = `🥗 *PEDIDO - FORJA DO SABOR* 🥗\n\n`;
        mensagem += `📋 *Produto:* ${this.pedidoAtual.produto}\n`;
        mensagem += `📏 *Tamanho:* ${this.pedidoAtual.tamanho}\n`;
        mensagem += `📦 *Quantidade:* ${this.pedidoAtual.quantidade}\n\n`;
        mensagem += `💰 *SUBTOTAL:* R$ ${this.pedidoAtual.total.toFixed(2).replace('.', ',')}\n`;
        mensagem += `🚚 *Taxa de entrega:* R$ 5,00\n`;
        mensagem += `💵 *TOTAL FINAL:* R$ ${(this.pedidoAtual.total + 5).toFixed(2).replace('.', ',')}\n\n`;
        mensagem += `📍 *Endereço:* ${endereco}\n`;
        mensagem += `💳 *Pagamento:* ${formaPagamentoTexto[formaPagamento]}`;
        
        if (formaPagamento === 'dinheiro') {
            mensagem += ` (Troco para ${troco})`;
        }
        
        if (observacoes) {
            mensagem += `\n📝 *Observações:* ${observacoes}`;
        }
        
        mensagem += `\n\n✅ Pedido realizado pelo site da Forja do Sabor`;

        const whatsappURL = `https://wa.me/5591985148050?text=${encodeURIComponent(mensagem)}`;
        window.open(whatsappURL, '_blank');
        
        this.fecharModal();
    }
}

// Inicializar sistema de pedidos
const sistemaPedidos = new SistemaPedidos();

// Função global para fazer pedidos (compatibilidade com botões existentes)
function fazerPedido(produto, tamanho, preco, quantidadeId) {
    let quantidade = 1;
    
    if (quantidadeId) {
        const qtyElement = document.getElementById(`qty-${quantidadeId}`);
        if (qtyElement) {
            quantidade = parseInt(qtyElement.value) || 1;
        }
    }
    
    sistemaPedidos.abrirModal(produto, tamanho, preco, quantidade);
}

// Função para alterar quantidade (compatibilidade com botões existentes)
function changeQuantity(id, delta) {
    const input = document.getElementById(`qty-${id}`);
    if (input) {
        let currentValue = parseInt(input.value) || 1;
        let newValue = currentValue + delta;
        
        if (newValue < 1) newValue = 1;
        if (newValue > 10) newValue = 10;
        
        input.value = newValue;
    }
}

// Função para pedidos diretos (sem quantidade - para páginas como caldos, gourmet, etc.)
function fazerPedidoDireto(produto, preco, descricao = '') {
    const produtoCompleto = descricao ? `${produto} - ${descricao}` : produto;
    sistemaPedidos.abrirModal(produtoCompleto, '', preco, 1);
}

