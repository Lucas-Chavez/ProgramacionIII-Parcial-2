// Obtener productos desde localStorage
export const handleGetProductLocalStorage = () => {
    // Intenta obtener los productos guardados en localStorage y convertirlos a un array
    const products = JSON.parse(localStorage.getItem('products'));
    if (products) {
        // Retorna los productos si existen en localStorage
        return products;
    } else {
        // Si no existen productos, retorna un array vacío
        return [];
    }
};

// Guardar o actualizar un producto en localStorage
export const setInLocalStorage = (productsIn) => {
    // Obtener productos existentes en localStorage
    let productsInLocal = handleGetProductLocalStorage();

    // Verificar si el producto ya existe en el array (usando el id)
    const existingIndex = productsInLocal.findIndex((productsLocal) =>
        productsLocal.id === productsIn.id
    );

    if (existingIndex !== -1) {
        // Si el producto ya existe, actualizarlo en la posición encontrada
        productsInLocal[existingIndex] = productsIn;
    } else {
        // Si el producto no existe, agregarlo al array
        productsInLocal.push(productsIn); 
    }

    // Guardar el array actualizado de productos en localStorage
    localStorage.setItem("products", JSON.stringify(productsInLocal));
    
    // Emitir un evento para notificar a otros componentes que los productos han sido actualizados
    const event = new CustomEvent('productsUpdated', {
        detail: { products: productsInLocal }
    });
    document.dispatchEvent(event);
    
    // Retornar el array actualizado de productos
    return productsInLocal;
};

// Eliminar un producto de localStorage
export const deleteFromLocalStorage = (productId) => {
    // Obtener el array de productos desde localStorage
    let productsInLocal = handleGetProductLocalStorage();
    
    // Filtrar los productos, excluyendo el producto que queremos eliminar
    productsInLocal = productsInLocal.filter(product => product.id !== productId);
    
    // Actualizar el localStorage con el array filtrado
    localStorage.setItem("products", JSON.stringify(productsInLocal));
    
    // Emitir un evento para notificar que los productos han sido actualizados
    const event = new CustomEvent('productsUpdated', {
        detail: { products: productsInLocal }
    });
    document.dispatchEvent(event);
    
    // Retornar el array de productos después de la eliminación
    return productsInLocal;
};
