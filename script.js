// Inicialización de variables globales
const products = [];
let subtotalGeneral = 0;
let discountAmount = 0;
let netValue = 0;
let ivaAmount = 0;
let totalAmount = 0;

// Constantes de configuración
const IVA_PERCENTAGE = 19;
const DISCOUNT_PERCENTAGE = 10;
const DISCOUNT_THRESHOLD = 50000;

// Elementos DOM
document.addEventListener('DOMContentLoaded', function() {
    // Botones principales
    const addProductButton = document.getElementById('add-product');
    const generatePdfButton = document.getElementById('generate-pdf');
    const newSaleButton = document.getElementById('new-sale');
    
    // Manejar eventos
    addProductButton.addEventListener('click', addProduct);
    generatePdfButton.addEventListener('click', generatePDF);
    newSaleButton.addEventListener('click', resetSale);
    
    // Si no hay productos mostrados
    updateEmptyState();
});

// Función para añadir un nuevo producto a la factura
function addProduct() {
    // Obtener valores del formulario
    const productName = document.getElementById('product-name').value.trim();
    const productPrice = parseFloat(document.getElementById('product-price').value);
    const productQuantity = parseInt(document.getElementById('product-quantity').value);
    
    // Validar datos
    if (!productName) {
        alert('Por favor, ingrese el nombre del producto.');
        return;
    }
    
    if (isNaN(productPrice) || productPrice <= 0) {
        alert('Por favor, ingrese un precio válido mayor a 0.');
        return;
    }
    
    if (isNaN(productQuantity) || productQuantity <= 0) {
        alert('Por favor, ingrese una cantidad válida mayor a 0.');
        return;
    }
    
    // Calcular subtotal
    const subtotal = productPrice * productQuantity;
    
    // Añadir producto al array
    const product = {
        id: Date.now(), // ID único basado en timestamp
        name: productName,
        price: productPrice,
        quantity: productQuantity,
        subtotal: subtotal
    };
    
    products.push(product);
    
    // Actualizar la tabla
    renderProductsTable();
    
    // Actualizar cálculos
    updateCalculations();
    
    // Limpiar formulario
    document.getElementById('product-name').value = '';
    document.getElementById('product-price').value = '';
    document.getElementById('product-quantity').value = '1';
    document.getElementById('product-name').focus();
}

// Función para renderizar la tabla de productos
function renderProductsTable() {
    const productsList = document.getElementById('products-list');
    productsList.innerHTML = '';
    
    products.forEach(product => {
        const row = document.createElement('tr');
        row.classList.add('fade-in');
        
        row.innerHTML = `
            <td>${product.name}</td>
            <td>$${formatNumber(product.price)}</td>
            <td>${product.quantity}</td>
            <td>$${formatNumber(product.subtotal)}</td>
            <td>
                <button class="delete-btn" data-id="${product.id}">Eliminar</button>
            </td>
        `;
        
        productsList.appendChild(row);
    });
    
    // Añadir event listeners a los botones de eliminar
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            removeProduct(productId);
        });
    });
    
    // Actualizar estado de tabla vacía
    updateEmptyState();
}

// Función para actualizar el estado vacío
function updateEmptyState() {
    const productsList = document.getElementById('products-list');
    const table = document.getElementById('products-table');
    
    if (products.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `
            <td colspan="5" class="empty-table">No hay productos agregados a la factura</td>
        `;
        productsList.appendChild(emptyRow);
    }
}

// Función para eliminar un producto
function removeProduct(productId) {
    const index = products.findIndex(product => product.id === productId);
    
    if (index !== -1) {
        products.splice(index, 1);
        renderProductsTable();
        updateCalculations();
    }
}

// Función para actualizar todos los cálculos
function updateCalculations() {
    // Calcular subtotal general
    subtotalGeneral = products.reduce((sum, product) => sum + product.subtotal, 0);
    
    // Calcular descuento (10% si el subtotal supera $50,000)
    discountAmount = subtotalGeneral > DISCOUNT_THRESHOLD ? subtotalGeneral * (DISCOUNT_PERCENTAGE / 100) : 0;
    
    // Valor neto (subtotal - descuento)
    netValue = subtotalGeneral - discountAmount;
    
    // Calcular IVA (19% del valor neto)
    ivaAmount = netValue * (IVA_PERCENTAGE / 100);
    
    // Total general
    totalAmount = netValue + ivaAmount;
    
    // Actualizar elementos del DOM
    document.getElementById('subtotal').textContent = `$${formatNumber(subtotalGeneral)}`;
    document.getElementById('discount').textContent = `$${formatNumber(discountAmount)}`;
    document.getElementById('net-value').textContent = `$${formatNumber(netValue)}`;
    document.getElementById('iva').textContent = `$${formatNumber(ivaAmount)}`;
    document.getElementById('total').textContent = `$${formatNumber(totalAmount)}`;
    
    // Mostrar u ocultar la fila de descuento según corresponda
    const discountRow = document.getElementById('discount-row');
    discountRow.style.display = discountAmount > 0 ? 'flex' : 'none';
}

// Función para generar PDF
function generatePDF() {
    if (products.length === 0) {
        alert('No hay productos para generar la factura. Por favor, agregue al menos un producto.');
        return;
    }
    
    // Crear elemento temporal para la factura
    const invoiceElement = document.createElement('div');
    invoiceElement.className = 'invoice-pdf';
    
    // Aplicar estilos para el PDF
    invoiceElement.style.width = '100%';
    invoiceElement.style.maxWidth = '800px';
    invoiceElement.style.margin = '0 auto';
    invoiceElement.style.padding = '20px';
    invoiceElement.style.fontFamily = 'Arial, sans-serif';
    
    // Fecha actual
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
    const formattedTime = `${currentDate.getHours()}:${String(currentDate.getMinutes()).padStart(2, '0')}`;
    
    // Generar número de factura aleatorio
    const invoiceNumber = Math.floor(100000 + Math.random() * 900000);
    
    // Construir el contenido HTML de la factura
    invoiceElement.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="margin-bottom: 5px; color: #3b5998;">PANADERÍA EL BUEN PAN</h1>
            <p style="margin-bottom: 5px;">NIT: 900.123.456-7</p>
            <p style="margin-bottom: 5px;">Dirección: Calle Principal #123</p>
            <p style="margin-bottom: 20px;">Tel: (601) 123-4567</p>
            <h2 style="margin-bottom: 5px;">FACTURA DE VENTA</h2>
            <p style="margin-bottom: 5px;">No. ${invoiceNumber}</p>
            <p>Fecha: ${formattedDate} - Hora: ${formattedTime}</p>
        </div>
        
        <hr style="margin: 20px 0;">
        
        <div style="margin-bottom: 20px;">
            <h3 style="margin-bottom: 10px;">PRODUCTOS:</h3>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background-color: #f2f2f2;">
                        <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">Producto</th>
                        <th style="padding: 8px; text-align: right; border-bottom: 1px solid #ddd;">Precio Unit.</th>
                        <th style="padding: 8px; text-align: center; border-bottom: 1px solid #ddd;">Cant.</th>
                        <th style="padding: 8px; text-align: right; border-bottom: 1px solid #ddd;">Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    ${products.map(product => `
                        <tr>
                            <td style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">${product.name}</td>
                            <td style="padding: 8px; text-align: right; border-bottom: 1px solid #ddd;">$${formatNumber(product.price)}</td>
                            <td style="padding: 8px; text-align: center; border-bottom: 1px solid #ddd;">${product.quantity}</td>
                            <td style="padding: 8px; text-align: right; border-bottom: 1px solid #ddd;">$${formatNumber(product.subtotal)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        
        <div style="margin-left: auto; width: 300px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <div>Subtotal:</div>
                <div>$${formatNumber(subtotalGeneral)}</div>
            </div>
            
            ${discountAmount > 0 ? `
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <div>Descuento (${DISCOUNT_PERCENTAGE}%):</div>
                <div>$${formatNumber(discountAmount)}</div>
            </div>
            ` : ''}
            
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <div>Valor Neto:</div>
                <div>$${formatNumber(netValue)}</div>
            </div>
            
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <div>IVA (${IVA_PERCENTAGE}%):</div>
                <div>$${formatNumber(ivaAmount)}</div>
            </div>
            
            <div style="display: flex; justify-content: space-between; margin-top: 10px; font-weight: bold; border-top: 1px solid #000; padding-top: 5px;">
                <div>TOTAL:</div>
                <div>$${formatNumber(totalAmount)}</div>
            </div>
        </div>
        
        <div style="margin-top: 50px; text-align: center;">
            <p>¡Gracias por su compra!</p>
        </div>
    `;
    
    // Añadir temporalmente el elemento al DOM
    document.body.appendChild(invoiceElement);
    
    // Configurar jsPDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'pt', 'a4');
    
    // Usar html2canvas para convertir HTML a imagen
    html2canvas(invoiceElement, {
        scale: 2,
        useCORS: true
    }).then(canvas => {
        // Agregar imagen al PDF
        const imgData = canvas.toDataURL('image/png');
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
        const imgX = (pageWidth - imgWidth * ratio) / 2;
        
        doc.addImage(imgData, 'PNG', imgX, 20, imgWidth * ratio, imgHeight * ratio);
        
        // Descargar PDF
        doc.save(`Factura_${invoiceNumber}.pdf`);
        
        // Eliminar el elemento temporal
        document.body.removeChild(invoiceElement);
    });
}

// Función para resetear la venta
function resetSale() {
    if (products.length > 0) {
        if (confirm('¿Está seguro que desea iniciar una nueva venta? Se perderán los datos actuales.')) {
            // Limpiar array de productos
            products.length = 0;
            
            // Actualizar UI
            renderProductsTable();
            updateCalculations();
            
            // Limpiar formulario
            document.getElementById('product-name').value = '';
            document.getElementById('product-price').value = '';
            document.getElementById('product-quantity').value = '1';
        }
    } else {
        alert('No hay una venta en curso para reiniciar.');
    }
}


