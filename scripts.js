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

  var cantidadStr = prompt("Ingrese la cantidad del producto:");
  var cantidad = parseInt(cantidadStr);
  if (isNaN(cantidad) || cantidad < 0) {
    mostrarMensaje("La cantidad debe ser un número válido y positivo.");
    return;
  }

  // Crear un objeto con la información del producto
  var producto = {
    codigo: codigo,
    nombre: nombre,
    descripcion: descripcion,
    cantidad: cantidad,
    entradas: 0,
    salidas: 0,
  };

  // Agregar el producto al inventario
  inventario.push(producto);

  // Guardar el inventario actualizado en el almacenamiento local
  guardarInventarioEnLocal();

  mostrarMensaje("Producto agregado correctamente.");
  mostrarInventarioCompleto();
}

function darSalidaProducto(codigo, cantidadStr) {
  var productoEncontrado = buscarPorCodigo(codigo);

  if (productoEncontrado) {
    var cantidad = parseInt(cantidadStr);
    if (isNaN(cantidad) || cantidad < 0) {
      mostrarMensaje("La cantidad debe ser un número válido y positivo.");
      return;
    }

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
    var entradasActuales = productoEncontrado.entradas;
    var salidasActuales = productoEncontrado.salidas;

    productoEncontrado.entradas = 0;
    productoEncontrado.salidas = 0;

    productoEncontrado.codigo = nuevoCodigo;
    productoEncontrado.nombre = nuevoNombre;
    productoEncontrado.descripcion = nuevaDescripcion;

    var cantidad = parseInt(nuevaCantidad);
    if (isNaN(cantidad) || cantidad < 0) {
      mostrarMensaje("La cantidad debe ser un número válido y positivo.");
      return;
    }
    productoEncontrado.cantidad = cantidad;

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

  var productoEncontrado = null;
  for (var i = 0; i < inventario.length; i++) {
    if (inventario[i].codigo === codigo) {
      productoEncontrado = inventario[i];
      break;
    }
  }

  if (!productoEncontrado) {
    mostrarMensaje("El producto no se encuentra en el inventario.");
    return;
  }

  var cantidadStr = prompt("Ingrese la cantidad a agregar:");
  var cantidad = parseInt(cantidadStr);
  if (isNaN(cantidad) || cantidad < 0) {
    mostrarMensaje("La cantidad debe ser un número válido y positivo.");
    return;
  }

  productoEncontrado.cantidad += cantidad;
  productoEncontrado.entradas += cantidad;

  guardarInventarioEnLocal();

  mostrarMensaje("Existencias agregadas correctamente.");
  mostrarInventarioCompleto();
}


function mostrarProductosEncontrados(productos) {
  var inventoryBody = document.getElementById("inventory-body");

  inventoryBody.innerHTML = "";

  for (var i = 0; i < productos.length; i++) {
    var row = document.createElement("tr");

    var codigoCell = document.createElement("td");
    codigoCell.textContent = productos[i].codigo;
    row.appendChild(codigoCell);

    var nombreCell = document.createElement("td");
    nombreCell.textContent = productos[i].nombre;
    row.appendChild(nombreCell);

    var descripcionCell = document.createElement("td");
    descripcionCell.textContent = productos[i].descripcion;
    row.appendChild(descripcionCell);

    var entradasCell = document.createElement("td");
    entradasCell.textContent = productos[i].entradas;
    row.appendChild(entradasCell);

    var salidasCell = document.createElement("td");
    salidasCell.textContent = productos[i].salidas;
    row.appendChild(salidasCell);

    var cantidadCell = document.createElement("td");
    cantidadCell.textContent = productos[i].cantidad;
    row.appendChild(cantidadCell);

    inventoryBody.appendChild(row);
  }

}


function buscarProductoPorCodigo(codigo) {
  var productosEncontrados = [];

  for (var i = 0; i < inventario.length; i++) {
    if (inventario[i].codigo.toLowerCase() === codigo.toLowerCase()) {
      productosEncontrados.push(inventario[i]);
    }
  }

  if (productosEncontrados.length > 0) {
    mostrarProductosEncontrados(productosEncontrados);
  } else {
    mostrarMensaje("No se encontraron productos con el nombre especificado.");
  }
}

function buscarPorCodigo(codigo) {
  var productoEncontrado = null;

  for (var i = 0; i < inventario.length; i++) {
    if (inventario[i].codigo.toLowerCase() === codigo.toLowerCase()) {
      productoEncontrado = inventario[i];
      break; // Importante: detener el bucle cuando se encuentra el producto
    }
  }

  if (productoEncontrado) {
    return productoEncontrado;
  } else {
    mostrarMensaje("No se encontraron productos con el código especificado.");
    return null;
  }
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

