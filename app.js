(() => {
  const products = [];
  let nextProductId = 1;
  const STORAGE_KEY = 'web-estoque:products:v1';
  const STORAGE_ID_KEY = 'web-estoque:nextId:v1';

  const elements = {
    form: document.getElementById('product-form'),
    formTitle: document.getElementById('form-title'),
    submitButton: document.getElementById('submit-button'),
    cancelEdit: document.getElementById('cancel-edit'),
    hint: document.getElementById('form-hint'),
    tbody: document.getElementById('products-tbody'),
    id: document.getElementById('product-id'),
    name: document.getElementById('name'),
    filamentType: document.getElementById('filamentType'),
    colors: document.getElementById('colors'),
    weight: document.getElementById('weight'),
    dimensions: document.getElementById('dimensions'),
    price: document.getElementById('price'),
    quantity: document.getElementById('quantity'),
    description: document.getElementById('description'),
    image: document.getElementById('image'),
    removeImage: document.getElementById('remove-image'),
    // Elementos dos modais
    deleteModal: document.getElementById('delete-modal'),
    deleteProductName: document.getElementById('delete-product-name'),
    deleteModalHint: document.getElementById('delete-modal-hint'),
    confirmDelete: document.getElementById('confirm-delete'),
    buyModal: document.getElementById('buy-modal'),
    buyProductName: document.getElementById('buy-product-name'),
    buyProductImage: document.getElementById('buy-product-image'),
    buyProductPrice: document.getElementById('buy-product-price'),
    buyProductStock: document.getElementById('buy-product-stock'),
    buyQuantity: document.getElementById('buy-quantity'),
    buyTotalPrice: document.getElementById('buy-total-price'),
    buyModalHint: document.getElementById('buy-modal-hint'),
    confirmBuy: document.getElementById('confirm-buy'),
    restockModal: document.getElementById('restock-modal'),
    restockProductName: document.getElementById('restock-product-name'),
    restockProductImage: document.getElementById('restock-product-image'),
    restockCurrentStock: document.getElementById('restock-current-stock'),
    restockQuantity: document.getElementById('restock-quantity'),
    restockNewStock: document.getElementById('restock-new-stock'),
    restockModalHint: document.getElementById('restock-modal-hint'),
    confirmRestock: document.getElementById('confirm-restock'),
  };

  const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

  function normalizeDecimal(value) {
    if (typeof value !== 'string') return Number.isFinite(value) ? value : 0;
    const trimmed = value.trim();
    if (trimmed === '') return NaN;
    // Aceita tanto vírgula quanto ponto como separador decimal, sem suportar separadores de milhar
    // Exemplos aceitos: "49,90" -> 49.90 | "49.90" -> 49.90
    const normalized = trimmed.replace(',', '.');
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : NaN;
  }

  function toNonNegativeInteger(value) {
    const parsed = typeof value === 'string' ? parseInt(value, 10) : Math.trunc(value);
    if (Number.isNaN(parsed) || parsed < 0) return NaN;
    return parsed;
  }

  function clearHint() {
    elements.hint.textContent = '';
    elements.hint.classList.remove('error', 'success');
  }

  function showError(message) {
    elements.hint.textContent = message;
    elements.hint.classList.remove('success');
    elements.hint.classList.add('error');
  }

  function showSuccess(message) {
    elements.hint.textContent = message;
    elements.hint.classList.remove('error');
    elements.hint.classList.add('success');
  }

  function validateForm(fields) {
    const missing = [];
    if (!fields.name) missing.push('Nome');
    if (!fields.filamentType) missing.push('Tipo de filamento');
    if (!fields.colors) missing.push('Cores');
    if (!fields.dimensions) missing.push('Dimensões');
    if (!fields.description) missing.push('Descrição');

    const weightNumber = normalizeDecimal(fields.weight);
    const priceNumber = normalizeDecimal(fields.price);
    const quantityInt = toNonNegativeInteger(fields.quantity);

    if (!Number.isFinite(weightNumber) || weightNumber < 0) {
      return { ok: false, message: 'Peso deve ser um número maior ou igual a zero (g).' };
    }
    if (!Number.isFinite(priceNumber) || priceNumber < 0) {
      return { ok: false, message: 'Preço deve ser um número maior ou igual a zero (R$).' };
    }
    if (!Number.isFinite(quantityInt)) {
      return { ok: false, message: 'Quantidade deve ser um inteiro maior ou igual a zero.' };
    }
    if (missing.length > 0) {
      return { ok: false, message: `Campos obrigatórios: ${missing.join(', ')}.` };
    }

    return {
      ok: true,
      data: {
        name: fields.name.trim(),
        filamentType: fields.filamentType.trim(),
        colors: fields.colors.trim(),
        weight: Number(weightNumber.toFixed(2)),
        dimensions: fields.dimensions.trim(),
        price: Number(priceNumber.toFixed(2)),
        quantity: quantityInt,
        description: fields.description.trim(),
      },
    };
  }

  function resetForm() {
    elements.id.value = '';
    elements.name.value = '';
    elements.filamentType.value = '';
    elements.colors.value = '';
    elements.weight.value = '';
    elements.dimensions.value = '';
    elements.price.value = '';
    elements.quantity.value = '';
    elements.description.value = '';
    elements.image.value = '';
    elements.removeImage.checked = false;
    elements.formTitle.textContent = 'Cadastrar Produto';
    elements.submitButton.textContent = 'Salvar produto';
    elements.cancelEdit.hidden = true;
    clearHint();
  }

  function getFormValues() {
    return {
      id: elements.id.value,
      name: elements.name.value,
      filamentType: elements.filamentType.value,
      colors: elements.colors.value,
      weight: elements.weight.value,
      dimensions: elements.dimensions.value,
      price: elements.price.value,
      quantity: elements.quantity.value,
      description: elements.description.value,
      image: elements.image.files?.[0] ?? null,
      removeImage: elements.removeImage.checked,
    };
  }

  function fillForm(product) {
    elements.id.value = String(product.id);
    elements.name.value = product.name;
    elements.filamentType.value = product.filamentType;
    elements.colors.value = product.colors;
    elements.weight.value = String(product.weight);
    elements.dimensions.value = product.dimensions;
    elements.price.value = String(product.price);
    elements.quantity.value = String(product.quantity);
    elements.description.value = product.description;
    elements.image.value = '';
    elements.removeImage.checked = false;
    elements.formTitle.textContent = 'Editar Produto';
    elements.submitButton.textContent = 'Atualizar produto';
    elements.cancelEdit.hidden = false;
    clearHint();
  }

  function createProduct(data) {
    const product = { id: nextProductId++, ...data };
    products.push(product);
    return product;
  }

  function updateProduct(productId, data) {
    const index = products.findIndex(p => p.id === productId);
    if (index === -1) return false;
    products[index] = { ...products[index], ...data };
    return true;
  }

  function deleteProduct(productId) {
    const index = products.findIndex(p => p.id === productId);
    if (index === -1) return false;
    products.splice(index, 1);
    return true;
  }

  function purchaseProduct(productId, quantityToBuy) {
    const product = products.find(p => p.id === productId);
    if (!product) return { ok: false, message: 'Produto não encontrado.' };
    const q = toNonNegativeInteger(quantityToBuy);
    if (!Number.isFinite(q) || q <= 0) {
      return { ok: false, message: 'Informe uma quantidade inteira positiva para compra.' };
    }
    if (product.quantity === 0) {
      return { ok: false, message: 'Produto indisponível para compra.' };
    }
    if (product.quantity - q < 0) {
      return { ok: false, message: 'Quantidade em estoque insuficiente.' };
    }
    product.quantity -= q; // RN07
    return { ok: true };
  }

  function restockProduct(productId, quantityToAdd) {
    const product = products.find(p => p.id === productId);
    if (!product) return { ok: false, message: 'Produto não encontrado.' };
    const q = toNonNegativeInteger(quantityToAdd);
    if (!Number.isFinite(q) || q <= 0) {
      return { ok: false, message: 'Informe uma quantidade inteira positiva para reabastecer.' };
    }
    product.quantity += q; // RN09
    return { ok: true };
  }

  function renderProducts() {
    if (products.length === 0) {
      elements.tbody.innerHTML = '<tr><td colspan="10">Nenhum produto cadastrado.</td></tr>';
      return;
    }
    const rows = products.map(p => renderRow(p)).join('');
    elements.tbody.innerHTML = rows;
  }

  function renderRow(product) {
    const available = product.quantity > 0;
    const status = available ?
      '<span class="status"><span class="dot green"></span>Disponível</span>' :
      '<span class="status"><span class="dot red"></span>Indisponível</span>';

    const buyDisabled = available ? '' : 'disabled';
    const imgHtml = product.imageDataUrl ? `<img class="thumb" src="${product.imageDataUrl}" alt="${escapeHtml(product.name)}" />` : '';

    return `
      <tr data-id="${product.id}">
        <td>${escapeHtml(product.name)}</td>
        <td>${imgHtml}</td>
        <td>${escapeHtml(product.filamentType)}</td>
        <td>${escapeHtml(product.colors)}</td>
        <td>${String(product.weight)} g</td>
        <td>${escapeHtml(product.dimensions)}</td>
        <td class="price">${currency.format(product.price)}</td>
        <td>${product.quantity}</td>
        <td>${status}</td>
        <td>
          <div class="row-actions">
            <button class="btn btn-success" data-action="buy" ${buyDisabled}>Comprar</button>
            <button class="btn" data-action="restock">Reabastecer</button>
            <button class="btn" data-action="edit">Editar</button>
            <button class="btn btn-danger" data-action="delete">Excluir</button>
          </div>
        </td>
      </tr>
    `;
  }

  function escapeHtml(text) {
    return String(text)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  elements.form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    clearHint();

    const values = getFormValues();
    const validation = validateForm(values); // RN01, RN02, RN03, RN04
    if (!validation.ok) {
      showError(validation.message);
      return;
    }

    const data = validation.data;
    const editingId = values.id ? parseInt(values.id, 10) : null;

    const proceed = async () => {
      // Processar imagem opcional
      let imageDataUrl = null;
      if (values.image instanceof File) {
        imageDataUrl = await fileToDataUrl(values.image);
      }

      if (editingId) {
        const current = products.find(p => p.id === editingId);
        const newData = { ...data };
        if (values.removeImage) {
          newData.imageDataUrl = null;
        } else if (imageDataUrl) {
          newData.imageDataUrl = imageDataUrl;
        } // senão mantém a atual
        updateProduct(editingId, newData); // RN05
        showSuccess('Produto atualizado com sucesso.');
      } else {
        const toCreate = { ...data };
        if (imageDataUrl) toCreate.imageDataUrl = imageDataUrl;
        createProduct(toCreate); // RN01, RN02
        showSuccess('Produto cadastrado com sucesso.');
      }

      persist();
      renderProducts();
      resetForm();
    };

    proceed();
  });

  elements.cancelEdit.addEventListener('click', () => {
    resetForm();
  });

  elements.tbody.addEventListener('click', (ev) => {
    const button = ev.target.closest('button');
    if (!button) return;
    const row = ev.target.closest('tr[data-id]');
    if (!row) return;
    const productId = parseInt(row.getAttribute('data-id'), 10);
    const product = products.find(p => p.id === productId);
    const action = button.getAttribute('data-action');

    if (action === 'delete') {
      if (!product) { showError('Produto não encontrado.'); return; }
      showDeleteModal(product);
      return;
    }

    if (action === 'edit') {
      if (!product) { showError('Produto não encontrado.'); return; }
      fillForm(product); // RN05
      return;
    }

    if (action === 'buy') {
      if (!product) { showError('Produto não encontrado.'); return; }
      showBuyModal(product);
      return;
    }

    if (action === 'restock') {
      if (!product) { showError('Produto não encontrado.'); return; }
      showRestockModal(product);
      return;
    }
  });

  // Event listeners para os modais
  // Modal de exclusão
  elements.confirmDelete.addEventListener('click', () => {
    const productId = parseInt(elements.deleteModal.dataset.productId);
    if (deleteProduct(productId)) {
      hideModal('delete-modal');
      showSuccess('Produto excluído com sucesso.');
      persist();
      renderProducts();
    } else {
      showModalError(elements.deleteModalHint, 'Erro ao excluir produto.');
    }
  });

  // Modal de compra
  elements.confirmBuy.addEventListener('click', () => {
    const productId = parseInt(elements.buyModal.dataset.productId);
    const quantity = parseInt(elements.buyQuantity.value);
    
    if (!quantity || quantity <= 0) {
      showModalError(elements.buyModalHint, 'Informe uma quantidade válida para compra.');
      return;
    }
    
    const result = purchaseProduct(productId, quantity);
    if (result.ok) {
      hideModal('buy-modal');
      showSuccess(`Compra realizada com sucesso! ${quantity} unidade(s) removida(s) do estoque.`);
      persist();
      renderProducts();
    } else {
      showModalError(elements.buyModalHint, result.message);
    }
  });

  // Modal de reabastecimento
  elements.confirmRestock.addEventListener('click', () => {
    const productId = parseInt(elements.restockModal.dataset.productId);
    const quantity = parseInt(elements.restockQuantity.value);
    
    if (!quantity || quantity <= 0) {
      showModalError(elements.restockModalHint, 'Informe uma quantidade válida para reabastecimento.');
      return;
    }
    
    const result = restockProduct(productId, quantity);
    if (result.ok) {
      hideModal('restock-modal');
      showSuccess(`Reabastecimento realizado com sucesso! ${quantity} unidade(s) adicionada(s) ao estoque.`);
      persist();
      renderProducts();
    } else {
      showModalError(elements.restockModalHint, result.message);
    }
  });

  // Event listeners para fechar modais
  document.addEventListener('click', (ev) => {
    // Fechar modal ao clicar no botão de fechar ou botão cancelar
    if (ev.target.matches('[data-modal]')) {
      const modalId = ev.target.getAttribute('data-modal');
      hideModal(modalId);
      clearAllModalHints();
    }
    
    // Fechar modal ao clicar fora do conteúdo
    if (ev.target.classList.contains('modal')) {
      ev.target.hidden = true;
      clearAllModalHints();
    }
  });

  // Event listeners para atualizar totais em tempo real
  elements.buyQuantity.addEventListener('input', updateBuyTotal);
  elements.restockQuantity.addEventListener('input', updateRestockTotal);

  // Fechar modais com tecla ESC
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') {
      hideAllModals();
      clearAllModalHints();
    }
  });

  // Persistência
  function persist() {
    try {
      const toSave = products.map(p => ({ ...p }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
      localStorage.setItem(STORAGE_ID_KEY, String(nextProductId));
    } catch (_) { /* ignore */ }
  }

  function hydrate() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const rawId = localStorage.getItem(STORAGE_ID_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (Array.isArray(saved)) {
          products.splice(0, products.length, ...saved);
        }
      }
      if (rawId) {
        const n = parseInt(rawId, 10);
        if (Number.isFinite(n) && n > 0) nextProductId = n;
      } else {
        // recalcula próximo id caso o id salvo não exista
        const maxId = products.reduce((m, p) => Math.max(m, p.id || 0), 0);
        nextProductId = maxId + 1;
      }
    } catch (_) { /* ignore */ }
  }

  function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
    });
  }

  // Funções para gerenciar modais
  function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.hidden = false;
      // Limpar mensagens anteriores
      const modalHint = modal.querySelector('.modal-hint');
      if (modalHint) {
        clearModalHint(modalHint);
      }
      // Foco no primeiro input do modal se existir
      const firstInput = modal.querySelector('input');
      if (firstInput) firstInput.focus();
    }
  }

  function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.hidden = true;
    }
  }

  function hideAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
      modal.hidden = true;
    });
  }

  // Função para mostrar modal de exclusão
  function showDeleteModal(product) {
    elements.deleteProductName.textContent = product.name;
    elements.deleteModal.dataset.productId = product.id;
    clearModalHint(elements.deleteModalHint);
    showModal('delete-modal');
  }

  // Função para mostrar modal de compra
  function showBuyModal(product) {
    elements.buyProductName.textContent = product.name;
    elements.buyProductPrice.textContent = currency.format(product.price);
    elements.buyProductStock.textContent = product.quantity;
    elements.buyQuantity.value = '1';
    elements.buyQuantity.max = product.quantity;
    
    if (product.imageDataUrl) {
      elements.buyProductImage.src = product.imageDataUrl;
      elements.buyProductImage.alt = product.name;
      elements.buyProductImage.style.display = 'block';
    } else {
      elements.buyProductImage.style.display = 'none';
    }
    
    clearModalHint(elements.buyModalHint);
    updateBuyTotal();
    elements.buyModal.dataset.productId = product.id;
    showModal('buy-modal');
  }

  // Função para mostrar modal de reabastecimento
  function showRestockModal(product) {
    elements.restockProductName.textContent = product.name;
    elements.restockCurrentStock.textContent = product.quantity;
    elements.restockQuantity.value = '1';
    
    if (product.imageDataUrl) {
      elements.restockProductImage.src = product.imageDataUrl;
      elements.restockProductImage.alt = product.name;
      elements.restockProductImage.style.display = 'block';
    } else {
      elements.restockProductImage.style.display = 'none';
    }
    
    clearModalHint(elements.restockModalHint);
    updateRestockTotal();
    elements.restockModal.dataset.productId = product.id;
    showModal('restock-modal');
  }

  // Função para atualizar total da compra
  function updateBuyTotal() {
    const quantity = parseInt(elements.buyQuantity.value) || 0;
    const productId = parseInt(elements.buyModal.dataset.productId);
    const product = products.find(p => p.id === productId);
    
    if (product && quantity > 0) {
      const total = product.price * quantity;
      elements.buyTotalPrice.textContent = currency.format(total);
    }
  }

  // Função para atualizar novo estoque
  function updateRestockTotal() {
    const quantity = parseInt(elements.restockQuantity.value) || 0;
    const productId = parseInt(elements.restockModal.dataset.productId);
    const product = products.find(p => p.id === productId);
    
    if (product && quantity > 0) {
      const newStock = product.quantity + quantity;
      elements.restockNewStock.textContent = newStock;
    }
  }

  // Funções para gerenciar mensagens dos modais
  function clearModalHint(modalHintElement) {
    if (modalHintElement) {
      modalHintElement.textContent = '';
      modalHintElement.className = 'modal-hint';
    }
  }

  function showModalError(modalHintElement, message) {
    if (modalHintElement) {
      modalHintElement.textContent = message;
      modalHintElement.className = 'modal-hint error';
    }
  }

  function showModalSuccess(modalHintElement, message) {
    if (modalHintElement) {
      modalHintElement.textContent = message;
      modalHintElement.className = 'modal-hint success';
    }
  }

  function clearAllModalHints() {
    clearModalHint(elements.deleteModalHint);
    clearModalHint(elements.buyModalHint);
    clearModalHint(elements.restockModalHint);
  }

  hydrate();
  renderProducts();
})();


