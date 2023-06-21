// Cargar los datos del inventario desde el almacenamiento local
var inventario = JSON.parse(localStorage.getItem("inventario")) || [];

function ejecutarOpcion() {
  var opcion = document.getElementById("opcion").value;
  var resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";

  if (opcion === "1") {
    agregarProducto();
  } else if (opcion === "2") {
    var codigo = prompt("Ingrese el código del producto:");
    var cantidad = parseInt(prompt("Ingrese la cantidad a dar salida:"));
    darSalidaProducto(codigo, cantidad);
  } else if (opcion === "3") {
    var codigo = prompt("Ingrese el código del producto a editar:");
    var nuevoNombre = prompt("Ingrese el nuevo nombre del producto:");
    editarProducto(codigo, nuevoNombre);
  } else if (opcion === "4") {
    mostrarInventarioCompleto();
  } else if (opcion === "5") {
    var codigo = prompt("Ingrese el código del producto a buscar:");
    buscarProductoPorCodigo(codigo);
  } else if (opcion === "6") {
    limpiarInventario();
  }
  else {
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
  };

  // Agregar el producto al inventario
  inventario.push(producto);

  // Guardar el inventario actualizado en el almacenamiento local
  guardarInventarioEnLocal();

  mostrarMensaje("Producto agregado correctamente.");
}

function darSalidaProducto(codigo, cantidad) {
  var productoEncontrado = buscarProductoPorCodigo(codigo);
  if (productoEncontrado) {
    if (productoEncontrado.cantidad >= cantidad) {
      productoEncontrado.cantidad -= cantidad;
      guardarInventarioEnLocal();
      mostrarMensaje("Salida registrada correctamente.");
    } else {
      mostrarMensaje("No hay suficiente cantidad del producto.");
    }
  }
}

function editarProducto(codigo, nuevoNombre) {
  var productoEncontrado = buscarProductoPorCodigo(codigo);
  if (productoEncontrado) {
    productoEncontrado.nombre = nuevoNombre;
    guardarInventarioEnLocal();
    mostrarMensaje("Producto editado correctamente.");
  }
}

function mostrarInventarioCompleto() {
  var inventoryBody = document.getElementById("inventory-body");
  inventoryBody.innerHTML = "";

  inventario.forEach(function(producto) {
    var row = document.createElement("tr");

    var codigoCell = document.createElement("td");
    codigoCell.textContent = producto.codigo;
    row.appendChild(codigoCell);

    var nombreCell = document.createElement("td");
    nombreCell.textContent = producto.nombre;
    row.appendChild(nombreCell);

    var descripcionCell = document.createElement("td");
    descripcionCell.textContent = producto.descripcion;
    row.appendChild(descripcionCell);

    var cantidadCell = document.createElement("td");
    cantidadCell.textContent = producto.cantidad;
    row.appendChild(cantidadCell);

    inventoryBody.appendChild(row);
  });
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
}
