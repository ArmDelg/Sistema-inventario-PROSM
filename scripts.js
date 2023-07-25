// Cargar los datos del inventario desde el almacenamiento local
var inventario = JSON.parse(localStorage.getItem("inventario")) || [];

verificarCasillasEnBlanco();
mostrarInventarioCompleto();


function ejecutarOpcion() {
  var opcion = document.getElementById("opcion").value;
  var resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";

  if (opcion === "1") {
    agregarProducto();
  } else if (opcion === "2") {
    var codigo = prompt("Ingrese el código del producto a editar:");
var nuevoCodigo = prompt("Ingrese el nuevo código del producto:");
var nuevoNombre = prompt("Ingrese el nuevo nombre del producto:");
var nuevaDescripcion = prompt("Ingrese la nueva descripción del producto:");
var nuevaCantidad = parseInt(prompt("Ingrese la nueva cantidad del producto:"));
editarProducto(codigo, nuevoCodigo, nuevoNombre, nuevaDescripcion, nuevaCantidad);
  } else if (opcion === "3") {
    var codigo = prompt("Ingrese el código del producto:");
    var cantidad = parseInt(prompt("Ingrese la cantidad a dar salida:"));
    darSalidaProducto(codigo, cantidad);
  }else if (opcion === "4") {
    var codigo = prompt("Ingrese el código del producto a eliminar:");
    var nombre = prompt("Ingrese el nombre del producto a eliminar:");
    eliminarProducto(codigo, nombre);
  } else if (opcion === "5") {
    agregarCantidadProducto();
  } else if (opcion === "6") {
    var codigo = prompt("Ingrese el código del producto a buscar:");
    buscarProductoPorCodigo(codigo);
  } else if (opcion === "7") {
    mostrarInventarioCompleto();
  } else if (opcion === "8") {
    imprimirTabla();
  } else if (opcion === "9") {
    generarPDF();
  } else if (opcion === "10") {
    limpiarInventario();
  } else if (opcion === "11") {
    guardarRespaldoInventario(); // Nueva opción para guardar respaldo del inventario
  } else if (opcion === "12") {
    cargarRespaldoInventario(); // Nueva opción para cargar respaldo del inventario
  } else {
    resultsDiv.innerHTML = "Seleccione una opción válida.";
  }
}
function agregarProducto() {
  var codigo = prompt("Ingrese el código del producto:");
  if (codigo === null) {
    // El usuario ha cancelado, no se realiza ninguna acción
    return;
  }

  var nombre = prompt("Ingrese el nombre del producto:");
  if (nombre === null) {
    // El usuario ha cancelado, no se realiza ninguna acción
    return;
  }

  var descripcion = prompt("Ingrese la descripción del producto:");
  if (descripcion === null) {
    // El usuario ha cancelado, no se realiza ninguna acción
    return;
  }

  var cantidad = parseInt(prompt("Ingrese la cantidad del producto:"));
  if (isNaN(cantidad) || cantidad === null) {
    // Si la cantidad no es un número válido o el usuario ha cancelado, no se realiza ninguna acción
    return;
  }

  // Crear un objeto con la información del producto
  var producto = {
    codigo: codigo,
    nombre: nombre,
    descripcion: descripcion,
    cantidad: cantidad,
    entradas: 0, // Inicializar propiedad entrada en 0
    salidas: 0, // Inicializar propiedad salida en 0
  };

  // Agregar el producto al inventario
  inventario.push(producto);

  // Guardar el inventario actualizado en el almacenamiento local
  guardarInventarioEnLocal();

  mostrarMensaje("Producto agregado correctamente.");
  mostrarInventarioCompleto();
}

function darSalidaProducto(codigo, cantidad) {
  var productoEncontrado = buscarProductoPorCodigo(codigo);

  if (productoEncontrado) {
    if (isNaN(cantidad)) {
      mostrarMensaje("La cantidad de salida debe ser un número válido.");
      return;
    }

    cantidad = parseInt(cantidad);

    if (productoEncontrado.cantidad >= cantidad) {
      productoEncontrado.cantidad -= cantidad;
      productoEncontrado.salidas += cantidad;
      guardarInventarioEnLocal();
      mostrarMensaje("Salida registrada correctamente.");
    } else {
      mostrarMensaje("No hay suficiente cantidad del producto.");
    }
  } else {
    mostrarMensaje("El código del producto no existe.");
  }

  mostrarInventarioCompleto();
}

function editarProducto(codigo, nuevoCodigo, nuevoNombre, nuevaDescripcion, nuevaCantidad) {
  var productoEncontrado = buscarProductoPorCodigo(codigo);
  if (productoEncontrado) {
    // Guardar las entradas y salidas actuales
    var entradasActuales = productoEncontrado.entradas;
    var salidasActuales = productoEncontrado.salidas;

    // Reiniciar las entradas y salidas del producto
    productoEncontrado.entradas = 0;
    productoEncontrado.salidas = 0;

    // Actualizar el código, nombre, descripción y cantidad del producto
    productoEncontrado.codigo = nuevoCodigo;
    productoEncontrado.nombre = nuevoNombre;
    productoEncontrado.descripcion = nuevaDescripcion;
    productoEncontrado.cantidad = nuevaCantidad;

    // Restaurar las entradas y salidas anteriores
    productoEncontrado.entradas = entradasActuales;
    productoEncontrado.salidas = salidasActuales;

    guardarInventarioEnLocal();
    mostrarMensaje("Producto editado correctamente.");
    mostrarInventarioCompleto();
  }
}

function mostrarInventarioCompleto() {
  var inventoryBody = document.getElementById("inventory-body");
  inventoryBody.innerHTML = "";

  for (var i = 0; i < inventario.length; i++) {
    var row = document.createElement("tr");

    var codigoCell = document.createElement("td");
    codigoCell.textContent = inventario[i].codigo;
    row.appendChild(codigoCell);

    var nombreCell = document.createElement("td");
    nombreCell.textContent = inventario[i].nombre;
    row.appendChild(nombreCell);

    var descripcionCell = document.createElement("td");
    descripcionCell.textContent = inventario[i].descripcion;
    row.appendChild(descripcionCell);

    var entradasCell = document.createElement("td");
    entradasCell.textContent = inventario[i].entradas;
    row.appendChild(entradasCell);

    var salidasCell = document.createElement("td");
    salidasCell.textContent = inventario[i].salidas;
    row.appendChild(salidasCell);

    var cantidadCell = document.createElement("td");
    cantidadCell.textContent = inventario[i].cantidad;
    row.appendChild(cantidadCell);

    inventoryBody.appendChild(row);
  }
}

function mostrarInventarioPorTipo(tipo) {
  var inventarioHTML = "";
  var productosFiltrados = inventario.filter(function (producto) {
    return producto.tipo === tipo;
  });
  if (productosFiltrados.length === 0) {
    inventarioHTML = "No hay productos de ese tipo en el inventario.";
  } else {
    inventarioHTML = "<ul>";
    for (var i = 0; i < productosFiltrados.length; i++) {
      inventarioHTML += "<li>" + productosFiltrados[i].nombre + ": " + productosFiltrados[i].cantidad + "</li>";
    }
    inventarioHTML += "</ul>";
  }
  mostrarMensaje(inventarioHTML);
}

function agregarCantidadProducto() {
  var codigo = prompt("Ingrese el código del producto:");
  if (codigo === null) {
    // El usuario ha cancelado, no se realiza ninguna acción
    return;
  }

  // Buscar el producto en el inventario
  var productoEncontrado = null;
  for (var i = 0; i < inventario.length; i++) {
    if (inventario[i].codigo === codigo) {
      productoEncontrado = inventario[i];
      break;
    }
  }

  if (productoEncontrado === null) {
    mostrarMensaje("El producto no se encuentra en el inventario.");
    return;
  }

  var cantidad = parseInt(prompt("Ingrese la cantidad a agregar:"));
  if (isNaN(cantidad) || cantidad === null) {
    // Si la cantidad no es un número válido o el usuario ha cancelado, no se realiza ninguna acción
    return;
  }

  // Actualizar la cantidad y entrada del producto
  productoEncontrado.cantidad += cantidad;
  productoEncontrado.entradas += cantidad; // <-- Corregido a productoEncontrado.entrada

  // Guardar el inventario actualizado en el almacenamiento local
  guardarInventarioEnLocal();

  mostrarMensaje("Existencias agregadas correctamente.");
  mostrarInventarioCompleto();
}


function buscarProductoPorCodigo(codigo) {
  var productoEncontrado = null;
  for (var i = 0; i < inventario.length; i++) {
    if (inventario[i].codigo === codigo) {
      productoEncontrado = inventario[i];
      break;
    }
  }
  if (productoEncontrado) {
    mostrarMensaje("Producto encontrado:<br>" + productoEncontrado.nombre + ": " + productoEncontrado.cantidad);
  } else {
    mostrarMensaje("Producto no encontrado.");
  }
  return productoEncontrado;
  mostrarInventarioCompleto();
}

function mostrarMensaje(mensaje) {
  var resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = mensaje;
}

function guardarInventarioEnLocal() {
  localStorage.setItem("inventario", JSON.stringify(inventario));
}

function limpiarInventario() {
  var password = prompt("Ingrese la contraseña para limpiar el inventario:");

  if (password === "KratosProSM") {
    inventario = [];
    guardarInventarioEnLocal();
    mostrarMensaje("Inventario limpiado correctamente.");
  } else {
    mostrarMensaje("Contraseña incorrecta. No se pudo limpiar el inventario.");
  }
  mostrarInventarioCompleto();
}
function imprimirTabla() {
  var menuDiv = document.getElementById("menu");
  var resultsDiv = document.getElementById("results");

  // Ocultar el menú y los resultados
  menuDiv.style.display = "none";
  resultsDiv.style.display = "none";

  // Imprimir la página actual
  window.print();

  // Restaurar la visibilidad del menú y los resultados
  menuDiv.style.display = "block";
  resultsDiv.style.display = "block";
}

function generarPDF() {
  var table = document.getElementById("inventory-table");

  html2canvas(table).then(function(canvas) {
    var imgData = canvas.toDataURL("image/png");
    var pdf = new jsPDF();
    pdf.addImage(imgData, "PNG", 10, 10);
    pdf.save("inventory.pdf");
  });
}

function eliminarProducto(codigo, nombre) {
  var productoEncontrado = buscarProductoPorCodigo(codigo);
  if (productoEncontrado && productoEncontrado.nombre === nombre) {
    // Eliminar el producto de la tabla
    var indiceProducto = inventario.indexOf(productoEncontrado);
    inventario.splice(indiceProducto, 1);

    guardarInventarioEnLocal();
    mostrarMensaje("Producto eliminado correctamente.");
    mostrarInventarioCompleto();
  } else {
    mostrarMensaje("No se encontró un producto con el código y nombre especificados.");
  }
}

// Función para actualizar y recuperar el inventario
function actualizarInventario() {
  try {
    // Obtener el inventario actual almacenado en el localStorage
    const inventarioGuardado = JSON.parse(localStorage.getItem("inventory")) || {};

    // Recorremos cada producto en el inventario
    for (const producto in inventarioGuardado) {
      if (inventarioGuardado.hasOwnProperty(producto)) {
        // Verificamos si alguna propiedad del producto es NaN o null y la corregimos si es necesario
        const productoActualizado = {
          ...inventarioGuardado[producto], // Mantenemos las propiedades existentes
          // Corregimos las propiedades incorrectas o faltantes
          propiedad1: isNaN(inventarioGuardado[producto].propiedad1) ? 0 : inventarioGuardado[producto].propiedad1,
          propiedad2: isNaN(inventarioGuardado[producto].propiedad2) ? 0 : inventarioGuardado[producto].propiedad2,
          // ...
        };

        // Actualizamos el producto en el inventario con los datos corregidos o actualizados
        inventarioGuardado[producto] = productoActualizado;
      }
    }

    // Actualizamos el inventario en el localStorage con los datos corregidos
    localStorage.setItem("inventory", JSON.stringify(inventarioGuardado));

    mostrarMensaje("Inventario actualizado y recuperado correctamente.");
  } catch (error) {
    // Si ocurre algún error, lo manejamos aquí.
    mostrarMensaje("Error al actualizar y recuperar el inventario:", error.message);
  }
}

function verificarCasillasEnBlanco() {
  var productosEliminados = 0;

  for (var i = 0; i < inventario.length; i++) {
    var producto = inventario[i];

    if (producto.codigo === "" || producto.nombre === "") {
      inventario.splice(i, 1);
      productosEliminados++;
      i--; // Ajustar el índice después de eliminar un elemento
    }
  }

  if (productosEliminados > 0) {
    guardarInventarioEnLocal();
    mostrarMensaje(`Se han eliminado ${productosEliminados} productos sin código o nombre.`);
  }
}

// Función para guardar el inventario en el almacenamiento local
function guardarRespaldoInventario() {
  // Convierte el inventario en una cadena JSON
  var inventarioJSON = JSON.stringify(inventario);
  
  // Guarda el inventario en el almacenamiento local
  localStorage.setItem('respaldoInventario', inventarioJSON);
  
  mostrarMensaje('Respaldo del inventario guardado en el almacenamiento local.');
}

// Función para cargar un respaldo anterior del inventario desde el almacenamiento local
function cargarRespaldoInventario() {
  // Recupera el inventario del almacenamiento local
  var inventarioJSON = localStorage.getItem('respaldoInventario');
  
  if (inventarioJSON) {
    // Convierte la cadena JSON en un objeto JavaScript
    inventario = JSON.parse(inventarioJSON);
    
    mostrarMensaje('Respaldo del inventario cargado desde el almacenamiento local.');
    mostrarInventarioCompleto();
  } else {
    mostrarMensaje('No se encontró ningún respaldo del inventario en el almacenamiento local.');
  }
}

