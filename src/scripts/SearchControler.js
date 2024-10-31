// SearchController.js
class SearchController {
    constructor(store) {
        // Almacena la referencia al almacenamiento o base de datos de productos
        this.store = store;
        // Selecciona el campo de entrada para la búsqueda en el encabezado
        this.searchInput = document.querySelector('.header__search-input');
        // Selecciona el botón de búsqueda en el encabezado
        this.searchButton = document.querySelector('.header__search-button');
        // Crea el contenedor para mostrar los términos de búsqueda actuales
        this.searchTermDisplay = this.createSearchTermDisplay();
        // Inicializa los eventos de búsqueda
        this.initialize();
        
        // NUEVO: Agregar listener para el evento de cambio de categoría
        // Este listener limpiará automáticamente la búsqueda cuando cambie la categoría
        document.addEventListener('categoryChanged', () => {
            this.clearSearch();
        });
    }

    createSearchTermDisplay() {
        // Crea el contenedor para mostrar los términos de búsqueda
        const container = document.createElement('div');
        // Asigna una clase específica para estilo al contenedor
        container.className = 'header__search-terms';
        // Define el estilo en línea para el contenedor
        container.style.cssText = `
            margin-top: 10px;
            padding: 5px 10px;
            font-size: 14px;
            color: #666;
            display: none;
        `;
        
        // Inserta el contenedor en el DOM dentro del contenedor de búsqueda
        const searchContainer = document.querySelector('.header__search-container');
        searchContainer.appendChild(container);
        
        // Retorna el contenedor creado para su uso posterior
        return container;
    }

    initialize() {
        // Agrega un evento de clic en el botón de búsqueda para manejar la búsqueda
        this.searchButton.addEventListener('click', () => {
            this.handleSearch();
        });

        // Añade funcionalidad de búsqueda con la tecla Enter para mejor experiencia
        this.searchInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                this.handleSearch();
            }
        });
    }

    handleSearch() {
        // Obtiene el término de búsqueda del campo de entrada, eliminando espacios extra
        const searchTerm = this.searchInput.value.trim();
        
        if (searchTerm) {
            // Dispara un evento personalizado con el término de búsqueda cuando no está vacío
            document.dispatchEvent(new CustomEvent('searchChanged', {
                detail: { searchTerm }
            }));
        } else {
            // Oculta el contenedor de términos de búsqueda si el campo está vacío
            this.searchTermDisplay.style.display = 'none';
            // Dispara un evento personalizado indicando que no hay términos de búsqueda
            document.dispatchEvent(new CustomEvent('searchChanged', {
                detail: { searchTerm: '' }
            }));
        }
    }

    // NUEVO: Método mejorado para limpiar la búsqueda
    // Este método ahora es más completo y se puede llamar desde otros componentes
    clearSearch() {
        // Limpia el campo de búsqueda
        this.searchInput.value = '';
        // Oculta el display de términos de búsqueda
        this.searchTermDisplay.style.display = 'none';
        // Notifica a otros componentes que la búsqueda se ha limpiado
        document.dispatchEvent(new CustomEvent('searchChanged', {
            detail: { searchTerm: '' }
        }));
    }
}

export default SearchController;