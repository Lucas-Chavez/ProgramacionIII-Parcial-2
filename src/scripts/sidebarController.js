class SidebarController {
    constructor() {
        // Elementos del DOM
        this.sidebar = document.querySelector('.sidebar-left'); // Selecciona la barra lateral
        this.categorySections = document.querySelectorAll('.sidebar-section'); // Selecciona las secciones de categorías
        this.sectionTitles = document.querySelectorAll('.sidebar-section__title'); // Selecciona los títulos de las secciones
        this.categoryLinks = document.querySelectorAll('.sidebar-section__link'); // Selecciona los enlaces de las categorías
        this.priceButtons = document.querySelectorAll('[data-order]'); // Selecciona los botones de ordenamiento por precio

        // Estado inicial
        this.currentCategory = 'all'; // Almacena la categoría seleccionada
        this.currentSortOrder = null; // Almacena el orden de precio seleccionado

        this.initialize(); // Inicializa los eventos
    }

    initialize() {
        // Asigna eventos a los títulos de las secciones
        this.sectionTitles.forEach(title => {
            title.addEventListener('click', (e) => {
                const section = e.target.closest('.sidebar-section'); // Encuentra la sección correspondiente
                this.toggleSection(section); // Alterna la visualización de la sección
            });
        });

        // Asigna eventos a los enlaces de categorías
        this.categoryLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault(); // Evita la acción por defecto del enlace
                this.handleCategoryChange(link); // Maneja el cambio de categoría
            });
        });

        // Asigna eventos a los botones de ordenamiento por precio
        this.priceButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.handlePriceSort(button); // Maneja el cambio de orden de precios
            });
        });

        // Configura el estado inicial de las categorías y secciones
        this.setInitialStates();
    }

    setInitialStates() {
        // Establece la categoría "Todos" como activa inicialmente
        const allProductsLink = document.querySelector('[data-category="all"]');
        if (allProductsLink) {
            allProductsLink.classList.add('sidebar-section__link--active'); // Marca la categoría "Todos" como activa
        }

        // Expande todas las secciones de categorías por defecto
        this.categorySections.forEach(section => {
            section.setAttribute('aria-expanded', 'true'); // Marca la sección como expandida
        });
    }

    toggleSection(section) {
        const isExpanded = section.getAttribute('aria-expanded') === 'true'; // Verifica si la sección está expandida
        const content = section.querySelector('ul, .sidebar-section__content'); // Selecciona el contenido de la sección
        const icon = section.querySelector('.sidebar-section__icon'); // Selecciona el ícono de la sección

        // Alterna el estado expandido de la sección
        section.setAttribute('aria-expanded', !isExpanded);

        // Muestra u oculta el contenido de la sección
        if (content) {
            if (!isExpanded) {
                content.style.maxHeight = content.scrollHeight + 'px'; // Expande el contenido
            } else {
                content.style.maxHeight = '0'; // Colapsa el contenido
            }
        }

        // Rota el ícono de la sección
        if (icon) {
            icon.style.transform = !isExpanded ? 'rotate(180deg)' : 'rotate(0)'; // Cambia la orientación del ícono
        }
    }

    handleCategoryChange(selectedLink) {
        // Remueve la clase activa de todos los enlaces de categoría
        this.categoryLinks.forEach(link => {
            link.classList.remove('sidebar-section__link--active');
        });

        // Agrega la clase activa al enlace de categoría seleccionado
        selectedLink.classList.add('sidebar-section__link--active');

        // Obtiene la categoría seleccionada
        const category = selectedLink.dataset.category || 'all';
        this.currentCategory = category;

        // Dispara un evento de cambio de categoría con la categoría actual
        document.dispatchEvent(new CustomEvent('categoryChanged', {
            detail: { category: this.currentCategory }
        }));
    }

    handlePriceSort(selectedButton) {
        // Remueve la clase activa de todos los botones de ordenamiento por precio
        this.priceButtons.forEach(button => {
            button.classList.remove('sidebar-section__button--active');
        });

        // Agrega la clase activa al botón de ordenamiento seleccionado
        selectedButton.classList.add('sidebar-section__button--active');

        // Obtiene el orden de precios seleccionado
        const order = selectedButton.dataset.order;
        this.currentSortOrder = order;

        // Dispara un evento de cambio de orden con el orden seleccionado
        document.dispatchEvent(new CustomEvent('sortChanged', {
            detail: { order: this.currentSortOrder }
        }));
    }

    // Método para obtener el estado actual del filtrado (categoría y orden)
    getCurrentFilters() {
        return {
            category: this.currentCategory,
            sortOrder: this.currentSortOrder
        };
    }
}

export default SidebarController;
