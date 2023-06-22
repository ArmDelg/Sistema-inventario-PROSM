// Cargar los datos del inventario desde el almacenamiento local
var inventario = JSON.parse(localStorage.getItem("inventario")) || [];

function ejecutarOpcion() {
  var opcion = document.getElementById("opcion").value;
  var resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";

  if (opcion === "1") {
    agregarProducto();
  } else if (opcion === "2") {
    var codigo = prompt("Ingrese el código del producto a editar:");
    var nuevoNombre = prompt("Ingrese el nuevo nombre del producto:");
    var nuevaDescripcion = prompt("Ingrese la nueva descripción del producto:");
    var nuevaCantidad = parseInt(prompt("Ingrese la nueva cantidad del producto:"));
    editarProducto(codigo, nuevoNombre, nuevaDescripcion, nuevaCantidad);
  } else if (opcion === "3") {
    var codigo = prompt("Ingrese el código del producto:");
    var cantidad = parseInt(prompt("Ingrese la cantidad a dar salida:"));
    darSalidaProducto(codigo, cantidad);
  } else if (opcion === "4") {
    agregarCantidadProducto();
  } else if (opcion === "5") {
    var codigo = prompt("Ingrese el código del producto a buscar:");
    buscarProductoPorCodigo(codigo);
  } else if (opcion === "6") {
    mostrarInventarioCompleto();
  } else if (opcion === "7") {
    imprimirTabla();
  } else if (opcion === "8") {
    generarPDF();
  } else if (opcion === "9") {
    limpiarInventario();
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
    entrada: 0, // Inicializar propiedad entrada en 0
    salida: 0, // Inicializar propiedad salida en 0
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
    if (productoEncontrado.cantidad >= cantidad) {
      productoEncontrado.cantidad -= cantidad;
      productoEncontrado.salida += cantidad; // <-- Corregido a productoEncontrado.salida
      guardarInventarioEnLocal();
      mostrarMensaje("Salida registrada correctamente.");
    } else {
      mostrarMensaje("No hay suficiente cantidad del producto.");
    }
  }
  mostrarInventarioCompleto();
}

function editarProducto(codigo, nuevoNombre, nuevaDescripcion, nuevaCantidad) {
  var productoEncontrado = buscarProductoPorCodigo(codigo);
  if (productoEncontrado) {
    // Guardar las entradas y salidas actuales
    var entradasActuales = productoEncontrado.entradas;
    var salidasActuales = productoEncontrado.salidas;

    // Reiniciar las entradas y salidas del producto
    productoEncontrado.entradas = 0;
    productoEncontrado.salidas = 0;

    // Actualizar el nombre, descripción y cantidad del producto
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

    var entradaCell = document.createElement("td");
    entradaCell.textContent = inventario[i].entrada;
    row.appendChild(entradaCell);

    var salidaCell = document.createElement("td");
    salidaCell.textContent = inventario[i].salida;
    row.appendChild(salidaCell);

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
  productoEncontrado.entrada += cantidad; // <-- Corregido a productoEncontrado.entrada

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
  window.print();
}

function generarPDF() {
  // Crear un nuevo objeto jsPDF
  var doc = new jsPDF();

  // Obtener la tabla del inventario
  var tabla = document.getElementById("inventory-table");

  // Obtener el ancho y alto de la tabla
  var tablaWidth = tabla.offsetWidth;
  var tablaHeight = tabla.offsetHeight;

  // Definir la posición inicial de dibujo en el PDF
  var xPos = 10;
  var yPos = 10;

  // Convertir la tabla en una imagen base64
  html2canvas(tabla).then(function(canvas) {
    // Obtener la imagen base64 de la tabla
    var imgData = canvas.toDataURL("image/png");

    // Agregar la imagen al PDF
    doc.addImage(imgData, "PNG", xPos, yPos, tablaWidth, tablaHeight);

    // Guardar el PDF
    doc.save("tabla_inventario.pdf");
  });
}
