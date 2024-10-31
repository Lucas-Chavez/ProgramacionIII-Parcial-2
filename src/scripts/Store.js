// store.js
import { handleGetProductLocalStorage } from "../utils/localStorage";

class Store {
    constructor() {
        // Inicializa variables de productos y filtros
        this.products = [];
        this.filteredProducts = [];
        this.currentCategory = 'all';
        this.currentSortOrder = null;
        this.currentSearchTerm = '';
        
        // Selecciona los contenedores de productos y barra lateral
        this.mainContainer = document.querySelector('.main__content');
        this.sidebarRight = document.querySelector('.sidebar-right__content');
        
        this.initialize();
    }

    initialize() {
        console.log('Inicializando Store...');
        this.loadProducts();
        this.setupEventListeners();
        this.renderProducts();
    }

    setupEventListeners() {
        // Evento personalizado para actualizar los productos
        document.addEventListener('productsUpdated', (event) => {
            this.products = event.detail.products;
            this.applyFiltersAndSort();
        });

        // Evento para cambio de categoría
        document.addEventListener('categoryChanged', (event) => {
            this.filterByCategory(event.detail.category);
        });

        // Evento para cambiar el orden de los productos
        document.addEventListener('sortChanged', (event) => {
            this.sortByPrice(event.detail.order);
        });

        // Evento para aplicar el término de búsqueda
        document.addEventListener('searchChanged', (event) => {
            this.handleSearch(event.detail.searchTerm);
        });
    }

    loadProducts() {
        try {
            this.products = handleGetProductLocalStorage();
            this.filteredProducts = [...this.products];
        } catch (error) {
            console.error('Error al cargar productos:', error);
            this.products = [];
            this.filteredProducts = [];
        }
    }

    handleSearch(searchTerm) {
        // Actualiza el término de búsqueda actual
        this.currentSearchTerm = searchTerm;
        this.applyFiltersAndSort();
    }

    // Método de filtrado por categoría
    filterByCategory(category) {
        // Actualiza la categoría actual
        this.currentCategory = category;
        // La limpieza visual del campo de búsqueda ahora es manejada por SearchController
        this.applyFiltersAndSort();
    }

    sortByPrice(order) {
        this.currentSortOrder = order;
        this.applyFiltersAndSort();
    }

    applyFiltersAndSort() {
        let filtered = [...this.products];
    
        // Aplica filtro de búsqueda si existe un término
        if (this.currentSearchTerm) {
            filtered = filtered.filter(product => {
                const searchTerm = this.currentSearchTerm.toLowerCase();
                const name = product.name.toLowerCase();
                const price = product.price.toString();
    
                return name.includes(searchTerm) || price.includes(searchTerm);
            });
    
            // Notifica resultados de búsqueda
            document.dispatchEvent(new CustomEvent('searchResultsUpdated', {
                detail: {
                    searchTerm: this.currentSearchTerm,
                    resultsCount: filtered.length
                }
            }));
        }
    
        // Aplica filtro de categoría
        if (this.currentCategory !== 'all') {
            filtered = filtered.filter(product => 
                product.category.toLowerCase() === this.currentCategory.toLowerCase()
            );
        }
    
        // Aplica ordenamiento por precio si está configurado
        if (this.currentSortOrder) {
            filtered.sort((a, b) => {
                const priceA = parseFloat(a.price);
                const priceB = parseFloat(b.price);
                return this.currentSortOrder === 'asc' 
                    ? priceA - priceB 
                    : priceB - priceA;
            });
        }
    
        this.filteredProducts = filtered;
        this.renderProducts();
    }

    createProductCard(product) {
        try {
            // Crea un elemento de tarjeta de producto
            const productCard = document.createElement('article');
            productCard.className = 'product-card';
            
            const imageContainer = document.createElement('div');
            imageContainer.className = 'product-card__image-container';
            
            const image = document.createElement('img');
            image.src = product.image;
            image.alt = product.name;
            image.className = 'product-card__image';
            // Establece imagen predeterminada en caso de error
            image.onerror = () => {
                image.src = 'https://via.placeholder.com/150';
            };
            
            const content = document.createElement('div');
            content.className = 'product-card__content';
            
            const name = document.createElement('h3');
            name.className = 'product-card__title';
            name.textContent = product.name;
            
            const category = document.createElement('p');
            category.className = 'product-card__category';
            category.textContent = product.category;
            
            const price = document.createElement('p');
            price.className = 'product-card__price';
            price.textContent = `$${product.price}`;
            
            const editButton = document.createElement('button');
            editButton.className = 'product-card__button';
            editButton.textContent = 'Modificar';
            editButton.onclick = () => this.loadProductForEdit(product);
            
            // Estructura la tarjeta con sus elementos
            imageContainer.appendChild(image);
            content.appendChild(name);
            content.appendChild(category);
            content.appendChild(price);
            content.appendChild(editButton);
            
            productCard.appendChild(imageContainer);
            productCard.appendChild(content);
            
            return productCard; // Retorna la tarjeta del producto
        } catch (error) {
            console.error('Error al crear tarjeta de producto:', error);
            return null;
        }
    }

    renderProducts() {
        try {
            console.log('Renderizando productos...');
            this.mainContainer.innerHTML = ''; // Limpia el contenedor principal
            
            if (!Array.isArray(this.filteredProducts) || this.filteredProducts.length === 0) {
                this.renderEmptyState(); // Muestra estado vacío si no hay productos
                return;
            }

            const productsGrid = document.createElement('div');
            productsGrid.className = 'products-grid';

            // Crea y añade cada tarjeta de producto al grid
            this.filteredProducts.forEach(product => {
                const productCard = this.createProductCard(product);
                if (productCard) {
                    productsGrid.appendChild(productCard);
                }
            });

            this.mainContainer.appendChild(productsGrid);
        } catch (error) {
            console.error('Error al renderizar productos:', error);
            this.renderEmptyState(); // Muestra estado vacío en caso de error
        }
    }

    renderEmptyState() {
        // Crea y muestra un mensaje cuando no hay productos
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'store-empty-message';
        
        if (this.currentSearchTerm) {
            emptyMessage.textContent = `No se encontraron productos que coincidan con "${this.currentSearchTerm}"`;
        } else if (this.currentCategory !== 'all') {
            emptyMessage.textContent = `No hay productos en la categoría "${this.currentCategory}"`;
        } else {
            emptyMessage.textContent = 'No hay productos disponibles';
        }
        
        this.mainContainer.appendChild(emptyMessage);
    }

    loadProductForEdit(product) {
        // Carga los datos del producto en el formulario para edición
        const productForm = document.getElementById("productForm");
        const deleteBtn = document.getElementById("deleteBtn");
        const acceptBtn = document.getElementById("acceptBtn");

        document.getElementById("productName").value = product.name;
        document.getElementById("productImage").value = product.image;
        document.getElementById("productPrice").value = product.price;
        document.getElementById("productCategory").value = product.category;
        
        productForm.dataset.editingId = product.id; // Guarda el ID del producto en edición
        deleteBtn.style.display = "block"; // Muestra el botón de eliminación
        acceptBtn.textContent = "Modificar";
        acceptBtn.classList.add('editing');
        
        // Muestra notificación de edición y realiza scroll al formulario
        const notification = document.getElementById("notification");
        notification.textContent = "Editando producto";
        notification.className = "notification notification--info";
        notification.style.display = "block";
        
        const sidebarRight = document.querySelector('.sidebar-right__content');
        if (sidebarRight) {
            sidebarRight.style.display = 'block'; // Asegura que el sidebar esté visible
            const formRect = sidebarRight.getBoundingClientRect();
            const scrollPosition = window.pageYOffset + formRect.top - 20;
            window.scrollTo({
                top: scrollPosition,
                behavior: 'smooth'
            });

            // Añade un efecto de resaltado en el formulario
            productForm.style.transition = 'background-color 0.3s ease';
            productForm.style.backgroundColor = '#f0f8ff';
            
            setTimeout(() => {
                productForm.style.backgroundColor = 'transparent';
            }, 1000);
        }
        
        setTimeout(() => {
            notification.style.display = "none";
        }, 2000);
    }
}

export default Store;
