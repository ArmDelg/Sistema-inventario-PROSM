#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include"funciones.h"

#define MAX_PRODUCTOS 100
int main() {
    struct Producto inventario[MAX_PRODUCTOS];
    int cantidad = 0;
    int opcion;

    FILE *archivo;
    archivo = fopen("inventario.txt", "r");
    if (archivo != NULL) {
        fseek(archivo, 0, SEEK_END);
        if (ftell(archivo) > 0) {
            printf("El inventario no está vacío.\n");
            rewind(archivo);

            // Leer el inventario desde el archivo
            while (!feof(archivo)) {
                fgets(inventario[cantidad].nombre, sizeof(inventario[cantidad].nombre), archivo);
                fgets(inventario[cantidad].descripcion, sizeof(inventario[cantidad].descripcion), archivo);
                fgets(inventario[cantidad].tipo, sizeof(inventario[cantidad].tipo), archivo);
                fscanf(archivo, "%d\n", &inventario[cantidad].codigo);
                fscanf(archivo, "%d\n", &inventario[cantidad].cantidad);
                cantidad++;
            }
        } else {
            printf("El inventario está vacío.\n");
        }

        fclose(archivo);
    } else {
        printf("Error al abrir el archivo de inventario.\n");
    }

    do {
        printf("\n--- Menú de opciones ---\n");
        printf("1. Agregar producto\n");
        printf("2. Dar salida a producto\n");
        printf("3. Editar producto\n");
        printf("4. Mostrar inventario completo\n");
        printf("5. Mostrar inventario por tipo\n");
        printf("6. Mostrar inventario por codigo\n");
        printf("0. Salir\n");
        printf("Ingrese una opción: ");
        scanf("%d", &opcion);
        getchar(); // Capturar el salto de línea después de ingresar la opción
        limpiarPantalla();
        limpiarBuffer();

        switch (opcion) {
            case 1:
                agregarProducto(inventario, &cantidad);
                break;
            case 2:
                salidaProducto(inventario, cantidad);
                break;
            case 3:
                editarProducto(inventario, cantidad);
                break;
            case 4:
                mostrarInventarioCompleto(inventario, cantidad);
                break;
            case 5:
                mostrarInventarioPorTipo(inventario, cantidad);
                break;
            case 6:
                buscarPorCodigo(inventario, cantidad);
                break;
            case 0:
                printf("Saliendo del programa...\n");
                break;
            default:
                printf("Opción no válida. Por favor, intente nuevamente.\n");
                break;
        }
    } while (opcion != 0);

    // Guardar el inventario en el archivo
    archivo = fopen("inventario.txt", "w");
    if (archivo != NULL) {
        for (int i = 0; i < cantidad; i++) {
            fprintf(archivo, "%s", inventario[i].nombre);
            fprintf(archivo, "%s", inventario[i].descripcion);
            fprintf(archivo, "%s", inventario[i].tipo);
            fprintf(archivo, "%d\n", inventario[i].codigo);
            fprintf(archivo, "%d\n", inventario[i].cantidad);
                limpiarBuffer();
        }

        fclose(archivo);
    } else {
        printf("Error al abrir el archivo de inventario.\n");
    }

    return 0;
}