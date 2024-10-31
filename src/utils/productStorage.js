// Importar las funciones necesarias de manejo de localStorage
import { setInLocalStorage, deleteFromLocalStorage } from "../utils/localStorage";

// Esperar a que el DOM esté completamente cargado antes de ejecutar el código
document.addEventListener("DOMContentLoaded", () => {
  // Obtener referencias a los elementos del formulario y los botones
  const productForm = document.getElementById("productForm");
  const acceptBtn = document.getElementById("acceptBtn");
  const cancelBtn = document.getElementById("cancelBtn");
  const deleteBtn = document.getElementById("deleteBtn");
  const notification = document.getElementById("notification");

  // Ocultar el botón de eliminar al cargar la página
  deleteBtn.style.display = "none";

  // Función para mostrar notificaciones con mensajes personalizados
  const showNotification = (message, type = "error") => {
    // Establecer el mensaje y estilo de la notificación
    notification.textContent = message;
    notification.className = `notification notification--${type}`;
    notification.style.display = "block";

    // Ocultar la notificación después de 3 segundos
    setTimeout(() => {
      notification.style.display = "none";
    }, 3000);
  };

  // Restablecer el formulario a su estado inicial
  const resetForm = () => {
    // Limpiar todos los campos del formulario y eliminar el ID de edición
    productForm.reset();
    delete productForm.dataset.editingId;

    // Cambiar el texto del botón de aceptar y ocultar el botón de eliminar
    acceptBtn.textContent = "Aceptar";
    deleteBtn.style.display = "none";
    acceptBtn.classList.remove('editing');
  };

  // Establecer el modo de edición del formulario
  const setEditMode = (isEditing) => {
    // Mostrar el botón de eliminar y cambiar el texto del botón de aceptar en modo de edición
    deleteBtn.style.display = isEditing ? "block" : "none";
    acceptBtn.textContent = isEditing ? "Modificar" : "Aceptar";
    acceptBtn.classList.toggle('editing', isEditing);
  };

  // Manejar el evento de clic del botón de aceptar
  acceptBtn.addEventListener("click", (event) => {
    event.preventDefault();

    // Obtener valores de los campos del formulario
    const productName = document.getElementById("productName").value.trim();
    const productImage = document.getElementById("productImage").value.trim();
    const productPrice = document.getElementById("productPrice").value.trim();
    const productCategory = document.getElementById("productCategory").value.trim();

    // Validar que todos los campos estén completos
    if (!productName || !productImage || !productPrice || !productCategory) {
      showNotification("Por favor, completa todos los campos requeridos.", "error");
      return;
    }

    // Crear el objeto de producto con los datos ingresados
    const productData = {
      id: productForm.dataset.editingId || new Date().toISOString(),
      name: productName,
      image: productImage,
      price: productPrice,
      category: productCategory,
    };

    // Guardar el producto en localStorage e indicar si es una creación o modificación
    try {
      setInLocalStorage(productData);
      showNotification(
        productForm.dataset.editingId 
          ? "Producto modificado exitosamente." 
          : "Producto guardado exitosamente.", 
        "success"
      );
      
      // Restablecer el formulario después de guardar el producto
      resetForm();
      
    } catch (error) {
      console.error('Error al procesar el producto:', error);
      showNotification("Error al procesar el producto.", "error");
    }
  });

  // Manejar el evento de clic del botón de eliminar
  deleteBtn.addEventListener("click", () => {
    const productId = productForm.dataset.editingId;
    if (!productId) return;

    // Confirmar eliminación del producto
    if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      try {
        deleteFromLocalStorage(productId);
        showNotification("Producto eliminado exitosamente.", "success");
        resetForm();
      } catch (error) {
        console.error('Error al eliminar el producto:', error);
        showNotification("Error al eliminar el producto.", "error");
      }
    }
  });

  // Manejar el evento de clic del botón de cancelar
  cancelBtn.addEventListener("click", () => {
    // Restablecer el formulario y mostrar una notificación de cancelación
    resetForm();
    showNotification("Operación cancelada, campos limpios.", "info");
  });
});
