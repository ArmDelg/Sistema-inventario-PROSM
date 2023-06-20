#!/usr/bin/env python3

import cgi
import subprocess

# Obtener los datos enviados por el formulario
form = cgi.FieldStorage()
opcion = form.getvalue('opcion')
nombre = form.getvalue('nombre')
descripcion = form.getvalue('descripcion')
tipo = form.getvalue('tipo')
codigo = form.getvalue('codigo')
cantidad = form.getvalue('cantidad')

# Ejecutar el programa C según la opción seleccionada
if opcion == '1':
    comando = ['./Inventario', '1', nombre, descripcion, tipo, codigo, cantidad]
elif opcion == '2':
    comando = ['./Inventario', '2', nombre, codigo, cantidad]
elif opcion == '3':
    comando = ['./Inventario', '3', nombre, codigo, descripcion, cantidad]
elif opcion == '4':
    comando = ['./Inventario', '4']
elif opcion == '5':
    comando = ['./Inventario', '5', tipo]
else:
    resultado = 'Opción inválida'

# Ejecutar el comando y capturar la salida
if opcion != '0':
    resultado = subprocess.run(comando, capture_output=True, text=True)

# Generar la respuesta en HTML
print('Content-type: text/html\n')
print('<html>')
print('<head>')
print('<title>Resultado</title>')
print('</head>')
print('<body>')
print('<h1>Resultado</h1>')
print('<pre>' + resultado.stdout + '</pre>')
print('</body>')
print('</html>')