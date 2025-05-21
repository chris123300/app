// Catálogo de productos predefinidos para panadería
const productCatalog = [
    { id: 1, name: "Pan Francés", price: 1500, category: "Panes" },
    { id: 2, name: "Pan Integral", price: 2200, category: "Panes" },
    { id: 3, name: "Pan de Molde", price: 4500, category: "Panes" },
    { id: 4, name: "Pan Baguette", price: 3000, category: "Panes" },
    { id: 5, name: "Pan Ciabatta", price: 2800, category: "Panes" },
    { id: 6, name: "Pan de Ajo", price: 2500, category: "Panes" },
    { id: 7, name: "Pan de Centeno", price: 3500, category: "Panes" },
    { id: 8, name: "Pan de Maíz", price: 2300, category: "Panes" },
    { id: 9, name: "Croissant", price: 2500, category: "Bollería" },
    { id: 10, name: "Croissant de Chocolate", price: 3000, category: "Bollería" },
    { id: 11, name: "Pain au Chocolat", price: 3200, category: "Bollería" },
    { id: 12, name: "Caracola de Pasas", price: 2700, category: "Bollería" },
    { id: 13, name: "Napolitana de Crema", price: 2900, category: "Bollería" },
    { id: 14, name: "Galleta de Chocolate", price: 1200, category: "Galletas" },
    { id: 15, name: "Galleta de Mantequilla", price: 1000, category: "Galletas" },
    { id: 16, name: "Galleta de Avena", price: 1500, category: "Galletas" },
    { id: 17, name: "Torta de Chocolate", price: 25000, category: "Tortas" },
    { id: 18, name: "Torta de Vainilla", price: 22000, category: "Tortas" },
    { id: 19, name: "Torta de Zanahoria", price: 28000, category: "Tortas" },
    { id: 20, name: "Cheesecake", price: 30000, category: "Tortas" },
    { id: 21, name: "Brownie", price: 3500, category: "Repostería" },
    { id: 22, name: "Muffin de Arándanos", price: 2800, category: "Repostería" },
    { id: 23, name: "Muffin de Chocolate", price: 2800, category: "Repostería" },
    { id: 24, name: "Eclair de Chocolate", price: 3500, category: "Repostería" },
    { id: 25, name: "Empanada de Queso", price: 2000, category: "Salados" },
    { id: 26, name: "Empanada de Carne", price: 2500, category: "Salados" },
    { id: 27, name: "Arepa de Queso", price: 3000, category: "Salados" },
    { id: 28, name: "Almojábana", price: 2200, category: "Salados" },
    { id: 29, name: "Pandebono", price: 2200, category: "Salados" },
    { id: 30, name: "Café Americano", price: 2500, category: "Bebidas" },
    { id: 31, name: "Café con Leche", price: 3500, category: "Bebidas" },
    { id: 32, name: "Chocolate Caliente", price: 4000, category: "Bebidas" },
    { id: 33, name: "Jugo Natural", price: 5000, category: "Bebidas" }
];

// Función para inicializar la funcionalidad del catálogo de productos
function initializeProductCatalog() {
    // Obtener elementos del DOM
    const productNameInput = document.getElementById('product-name');
    const productPriceInput = document.getElementById('product-price');
    const productList = document.getElementById('product-catalog-list');
    const catalogContainer = document.getElementById('product-catalog-container');
    
    // Crear contenedor para categorías
    const categoriesContainer = document.getElementById('categories-container');
    
    // Obtener categorías únicas
    const uniqueCategories = [...new Set(productCatalog.map(product => product.category))];
    
    // Crear botones de filtro por categoría
    uniqueCategories.forEach(category => {
        const categoryBtn = document.createElement('button');
        categoryBtn.textContent = category;
        categoryBtn.className = 'category-btn';
        categoryBtn.addEventListener('click', () => filterProductsByCategory(category));
        categoriesContainer.appendChild(categoryBtn);
    });
    
    // Botón para mostrar todos
    const showAllBtn = document.createElement('button');
    showAllBtn.textContent = 'Todos';
    showAllBtn.className = 'category-btn active';
    showAllBtn.addEventListener('click', () => displayProductCatalog(productCatalog));
    categoriesContainer.insertBefore(showAllBtn, categoriesContainer.firstChild);
    
    // Mostrar todos los productos inicialmente
    displayProductCatalog(productCatalog);
    
    // Event listener para búsqueda en tiempo real
    productNameInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        
        if (searchTerm.length >= 2) {
            catalogContainer.style.display = 'block';
            const filteredProducts = productCatalog.filter(product => 
                product.name.toLowerCase().includes(searchTerm)
            );
            displayProductCatalog(filteredProducts);
        } else if (searchTerm.length === 0) {
            catalogContainer.style.display = 'none';
        }
    });
    
    // Cerrar la lista al hacer clic fuera
    document.addEventListener('click', function(event) {
        if (!event.target.closest('#product-catalog-container') && 
            !event.target.closest('#product-name') &&
            !event.target.closest('#categories-container')) {
            catalogContainer.style.display = 'none';
        }
    });
    
    // Abrir catálogo al hacer focus en el input
    productNameInput.addEventListener('focus', function() {
        if (this.value.length >= 2 || document.querySelector('.category-btn.active')) {
            catalogContainer.style.display = 'block';
        }
    });
    
    // Botón para mostrar/ocultar catálogo
    const catalogToggleBtn = document.getElementById('show-catalog-btn');
    catalogToggleBtn.addEventListener('click', function() {
        if (catalogContainer.style.display === 'none' || !catalogContainer.style.display) {
            catalogContainer.style.display = 'block';
            displayProductCatalog(productCatalog);
        } else {
            catalogContainer.style.display = 'none';
        }
    });
}

// Función para mostrar productos filtrados por categoría
function filterProductsByCategory(category) {
    // Actualizar botones activos
    document.querySelectorAll('.category-btn').forEach(btn => {
        if (btn.textContent === category) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Filtrar y mostrar productos
    const filteredProducts = productCatalog.filter(product => product.category === category);
    displayProductCatalog(filteredProducts);
    
    // Mostrar el contenedor
    document.getElementById('product-catalog-container').style.display = 'block';
}

// Función para mostrar productos en el catálogo
function displayProductCatalog(products) {
    const productList = document.getElementById('product-catalog-list');
    productList.innerHTML = '';
    
    if (products.length === 0) {
        const noResults = document.createElement('li');
        noResults.textContent = 'No se encontraron productos';
        noResults.className = 'no-results';
        productList.appendChild(noResults);
        return;
    }
    
    products.forEach(product => {
        const productItem = document.createElement('li');
        productItem.className = 'product-item';
        productItem.innerHTML = `
            <div class="product-item-name">${product.name}</div>
            <div class="product-item-price">$${formatNumber(product.price)}</div>
            <div class="product-item-category">${product.category}</div>
        `;
        
        // Event listener para seleccionar un producto
        productItem.addEventListener('click', function() {
            selectProduct(product);
        });
        
        productList.appendChild(productItem);
    });
}

// Función para seleccionar un producto del catálogo
function selectProduct(product) {
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-catalog-container').style.display = 'none';
    document.getElementById('product-quantity').focus();
}

// Inicializar el catálogo cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si ya existe esta función en el script principal
    const existingDOMContentLoaded = window.onload || function(){};
    
    // Ejecutar la función anterior y luego inicializar el catálogo
    window.onload = function() {
        existingDOMContentLoaded();
        initializeProductCatalog();
    };
});

// Añadir la función de formateo de números si no existe
if (typeof formatNumber !== 'function') {
    function formatNumber(number) {
        return number.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    }
}