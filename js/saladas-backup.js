document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('salada-form');
    const planoInputs = document.querySelectorAll('input[name="plano"]');
    const baseSelect = document.getElementById('base');
    const proteinaSelect = document.getElementById('proteina');
    const extrasCheckboxes = document.querySelectorAll('input[name="extras"]');
    const molhoInputs = document.querySelectorAll('input[name="molho"]');
    const resumoContent = document.getElementById('resumo-content');
    const btnWhatsapp = document.getElementById('btn-whatsapp');
    const proteinWarning = document.getElementById('protein-warning');
    const extrasWarning = document.getElementById('extras-warning');

    let currentPlan = null;
    let maxExtras = 0;
    let planPrice = 0;

    // Inicializar estado
    updateProteinOptions();
    updateExtrasState();
    updateResumo();

    // Event listeners para planos
    planoInputs.forEach(input => {
        input.addEventListener('change', function() {
            if (this.checked) {
                currentPlan = this.value;
                maxExtras = parseInt(this.dataset.extras);
                planPrice = parseFloat(this.dataset.price);
                
                updateProteinOptions();
                updateExtrasState();
                updateResumo();
            }
        });
    });

    // Event listeners para outros campos
    baseSelect.addEventListener('change', updateResumo);
    proteinaSelect.addEventListener('change', function() {
        checkProteinValidity();
        updateResumo();
    });
    
    extrasCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            handleExtrasChange();
            updateResumo();
        });
    });

    molhoInputs.forEach(input => {
        input.addEventListener('change', updateResumo);
    });

    function updateProteinOptions() {
        const premiumOptions = proteinaSelect.querySelectorAll('.premium-only');
        
        premiumOptions.forEach(option => {
            if (currentPlan !== 'premium') {
                option.disabled = true;
                option.classList.add('protein-disabled');
                if (option.selected) {
                    option.selected = false;
                    proteinaSelect.value = '';
                }
            } else {
                option.disabled = false;
                option.classList.remove('protein-disabled');
            }
        });
    }

    function checkProteinValidity() {
        const selectedOption = proteinaSelect.options[proteinaSelect.selectedIndex];
        
        if (selectedOption && selectedOption.classList.contains('premium-only') && currentPlan !== 'premium') {
            proteinWarning.style.display = 'block';
            proteinaSelect.value = '';
        } else {
            proteinWarning.style.display = 'none';
        }
    }

    function updateExtrasState() {
        const checkedExtras = document.querySelectorAll('input[name="extras"]:checked');
        
        extrasCheckboxes.forEach(checkbox => {
            const parentDiv = checkbox.closest('.extra-option');
            
            if (checkedExtras.length >= maxExtras && !checkbox.checked && currentPlan !== 'premium') {
                checkbox.disabled = true;
                parentDiv.classList.add('disabled');
            } else {
                checkbox.disabled = false;
                parentDiv.classList.remove('disabled');
            }
        });

        // Mostrar/esconder aviso de limite
        if (checkedExtras.length >= maxExtras && currentPlan !== 'premium') {
            extrasWarning.style.display = 'block';
        } else {
            extrasWarning.style.display = 'none';
        }
    }

    function handleExtrasChange() {
        updateExtrasState();
    }

    function updateResumo() {
        if (!currentPlan) {
            resumoContent.innerHTML = '<p>Selecione um plano para ver o resumo</p>';
            btnWhatsapp.style.display = 'none';
            return;
        }

        const base = baseSelect.value;
        const proteina = proteinaSelect.value;
        const checkedExtras = Array.from(document.querySelectorAll('input[name="extras"]:checked')).map(cb => cb.value);
        const molho = document.querySelector('input[name="molho"]:checked')?.value;

        let resumoHTML = `
            <div class="resumo-item">
                <strong>Plano:</strong> ${currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)}
            </div>
        `;

        if (base) {
            resumoHTML += `
                <div class="resumo-item">
                    <strong>Base:</strong> ${base}
                </div>
            `;
        }

        if (proteina) {
            resumoHTML += `
                <div class="resumo-item">
                    <strong>Proteína:</strong> ${proteina}
                </div>
            `;
        }

        if (checkedExtras.length > 0) {
            resumoHTML += `
                <div class="resumo-item">
                    <strong>Extras:</strong> ${checkedExtras.join(', ')}
                </div>
            `;
        }

        if (molho) {
            resumoHTML += `
                <div class="resumo-item">
                    <strong>Molho:</strong> ${molho}
                </div>
            `;
        }

        resumoHTML += `
            <div class="resumo-item">
                <strong>Total: R$ ${planPrice.toFixed(2)}</strong>
            </div>
        `;

        resumoContent.innerHTML = resumoHTML;

        // Mostrar botão WhatsApp se campos obrigatórios estiverem preenchidos
        if (base && proteina && molho) {
            btnWhatsapp.style.display = 'inline-block';
            updateWhatsappLink(base, proteina, checkedExtras, molho);
        } else {
            btnWhatsapp.style.display = 'none';
        }
    }

    function updateWhatsappLink(base, proteina, extras, molho) {
        const planName = currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1);
        const extrasText = extras.length > 0 ? extras.join(', ') : 'Nenhum';
        
        const message = `Olá, Forja do Sabor!

Gostaria de pedir uma salada personalizada:

*Base:* ${base}
*Proteína:* ${proteina}
*Extras:* ${extrasText}
*Molho:* ${molho}

*Plano:* ${planName}
*Total:* R$ ${planPrice.toFixed(2)}

Aguardando a confirmação!`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/5591985148050?text=${encodedMessage}`;
        
        btnWhatsapp.href = whatsappUrl;
    }
});

