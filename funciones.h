#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAX_PRODUCTOS 100

struct Producto {
    char nombre[50];
    char descripcion[100];
    char tipo[20];
    int codigo;
    int cantidad;
};

void limpiarPantalla() {
#ifdef _WIN32
    system("cls");
#else
    printf("\033[2J\033[1;1H");
#endif
}

void limpiarBuffer() {
    int c;
    while ((c = getchar()) != '\n' && c != EOF);
}

void agregarProducto(struct Producto inventario[], int* cantidad) {
    if (*cantidad == MAX_PRODUCTOS) {
        printf("Error: El inventario está lleno. No se pueden agregar más productos.\n");
        return;
    }

    struct Producto nuevoProducto;

    printf("Ingrese el nombre del producto: ");
    fgets(nuevoProducto.nombre, sizeof(nuevoProducto.nombre), stdin);
    printf("Ingrese la descripción del producto: ");
    fgets(nuevoProducto.descripcion, sizeof(nuevoProducto.descripcion), stdin);
    printf("Ingrese el tipo de producto: ");
    fgets(nuevoProducto.tipo, sizeof(nuevoProducto.tipo), stdin);

    // Restricción de código único
    while (1) {
        printf("Ingrese el código del producto: ");
        scanf("%d", &nuevoProducto.codigo);
        getchar(); // Capturar el salto de línea después de ingresar el código

        int codigoRepetido = 0;

        for (int i = 0; i < *cantidad; i++) {
            if (inventario[i].codigo == nuevoProducto.codigo) {
                codigoRepetido = 1;
                break;
            }
        }

        if (!codigoRepetido) {
            break; // Salir del bucle si el código no está repetido
        }

        printf("Error: El código ya ha sido asignado a otro producto. Por favor, ingrese un código válido.\n");
    }

    printf("Ingrese la cantidad del producto: ");
    scanf("%d", &nuevoProducto.cantidad);
    getchar(); // Capturar el salto de línea después de ingresar la cantidad

    inventario[*cantidad] = nuevoProducto;
    (*cantidad)++;

    printf("Producto agregado correctamente.\n");
}

void salidaProducto(struct Producto inventario[], int cantidad) {
    if (cantidad == 0) {
        printf("Error: El inventario está vacío.\n");
        return;
    }

    char nombre[50];
    int codigo;
    int cantidadSalida;

    printf("Ingrese el nombre del producto a dar salida: ");
    fgets(nombre, sizeof(nombre), stdin);
    printf("Ingrese el código del producto a dar salida: ");
    scanf("%d", &codigo);
    printf("Ingrese la cantidad a dar salida: ");
    scanf("%d", &cantidadSalida);
    getchar(); // Capturar el salto de línea después de ingresar la cantidad

    int indice = -1;
    for (int i = 0; i < cantidad; i++) {
        if (strcmp(inventario[i].nombre, nombre) == 0 && inventario[i].codigo == codigo) {
            indice = i;
            break;
        }
    }

    if (indice == -1) {
        printf("No se encontró un producto con ese nombre y código.\n");
        return;
    }

    if (inventario[indice].cantidad < cantidadSalida) {
        printf("Error: La cantidad a dar salida es mayor que la cantidad disponible en el inventario.\n");
        return;
    }

    inventario[indice].cantidad -= cantidadSalida;

    printf("Salida de producto registrada correctamente.\n");
        limpiarBuffer();

}

void editarProducto(struct Producto inventario[], int cantidad) {
    if (cantidad == 0) {
        printf("Error: El inventario está vacío.\n");
        return;
    }

    char nombre[50];
    int codigo;

    printf("Ingrese el nombre del producto a editar: ");
    fgets(nombre, sizeof(nombre), stdin);
    printf("Ingrese el código del producto a editar: ");
    scanf("%d", &codigo);
    getchar(); // Capturar el salto de línea después de ingresar el código

    int indice = -1;
    for (int i = 0; i < cantidad; i++) {
        if (strcmp(inventario[i].nombre, nombre) == 0 && inventario[i].codigo == codigo) {
            indice = i;
            break;
        }
    }

    if (indice == -1) {
        printf("No se encontró un producto con ese nombre y código.\n");
        return;
    }

    struct Producto productoEditado;

    printf("Ingrese el nuevo nombre del producto: ");
    fgets(productoEditado.nombre, sizeof(productoEditado.nombre), stdin);
    printf("Ingrese la nueva descripción del producto: ");
    fgets(productoEditado.descripcion, sizeof(productoEditado.descripcion), stdin);
    printf("Ingrese el nuevo tipo de producto: ");
    fgets(productoEditado.tipo, sizeof(productoEditado.tipo), stdin);
    printf("Ingrese el nuevo código del producto: ");
    scanf("%d", &productoEditado.codigo);
    getchar(); // Capturar el salto de línea después de ingresar el código
    printf("Ingrese la nueva cantidad del producto: ");
    scanf("%d", &productoEditado.cantidad);
    getchar(); // Capturar el salto de línea después de ingresar la cantidad

    inventario[indice] = productoEditado;

    printf("Producto editado correctamente.\n");
        limpiarBuffer();

}

void mostrarInventarioPorTipo(struct Producto inventario[], int cantidad) {
    if (cantidad == 0) {
        printf("Error: El inventario está vacío.\n");
        return;
    }

    char tipoBuscado[20];
    printf("Ingrese el tipo de producto a buscar: ");
    fgets(tipoBuscado, sizeof(tipoBuscado), stdin);

    printf("\n--- Inventario por tipo: %s ---\n", tipoBuscado);

    int productosEncontrados = 0;

    for (int i = 0; i < cantidad; i++) {
        if (strcmp(inventario[i].tipo, tipoBuscado) == 0) {
            printf("Nombre: %s", inventario[i].nombre);
            printf("Descripción: %s", inventario[i].descripcion);
            printf("Código: %d\n", inventario[i].codigo);
            printf("Cantidad: %d\n", inventario[i].cantidad);
            printf("--------------------\n");
            productosEncontrados++;
        }
    }

    if (productosEncontrados == 0) {
        printf("No se encontraron productos con ese tipo.\n");
    }
}

void mostrarInventarioCompleto(struct Producto inventario[], int cantidad) {
    if (cantidad == 0) {
        printf("Error: El inventario está vacío.\n");
        return;
    }

    printf("\n--- Inventario completo ---\n");

    for (int i = 0; i < cantidad; i++) {
        printf("Nombre: %s", inventario[i].nombre);
        printf("Descripción: %s", inventario[i].descripcion);
        printf("Tipo: %s", inventario[i].tipo);
        printf("Código: %d\n", inventario[i].codigo);
        printf("Cantidad: %d\n", inventario[i].cantidad);
        printf("--------------------\n");
    }
        limpiarBuffer();

}

void buscarPorCodigo(struct Producto inventario[], int cantidad) {
    if (cantidad == 0) {
        printf("Error: El inventario está vacío.\n");
        return;
    }

    int codigoBuscado;
    printf("Ingrese el código del producto a buscar: ");
    scanf("%d", &codigoBuscado);
    getchar(); // Capturar el salto de línea después de ingresar el código

    int productoEncontrado = 0;

    for (int i = 0; i < cantidad; i++) {
        if (inventario[i].codigo == codigoBuscado) {
            printf("Nombre: %s", inventario[i].nombre);
            printf("Descripción: %s", inventario[i].descripcion);
            printf("Tipo: %s", inventario[i].tipo);
            printf("Cantidad: %d\n", inventario[i].cantidad);
            printf("--------------------\n");
            productoEncontrado = 1;
            break; // Se encontró el producto, se puede salir del ciclo
        }
    }

    if (!productoEncontrado) {
        printf("No se encontró ningún producto con ese código.\n");
    }
}