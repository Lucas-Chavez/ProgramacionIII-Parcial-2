// Importar archivos de estilo CSS
import './src/styles/Main.css';
import './src/styles/Global.css';
import './src/styles/Header.css';
import './src/styles/SidebarLeft.css';
import './src/styles/SidebarRigth.css';
import './src/styles/Store.css';

// Importar scripts de controladores y utilidades
import SidebarController from './src/scripts/sidebarController.js';
import Store from './src/scripts/Store.js';
import SearchController from './src/scripts/SearchControler.js';
import './src/utils/productStorage.js';

// Ejecutar el código cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar controlador de la barra lateral
    const sidebarController = new SidebarController();

    // Inicializar la tienda para gestionar productos
    const store = new Store();

    // Inicializar el controlador de búsqueda, pasando la tienda como dependencia
    const searchController = new SearchController(store);
});
