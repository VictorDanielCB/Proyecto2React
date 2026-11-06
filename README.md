# Proyecto 2 – Aplicación React UISIL

## Descripción

Aplicación web desarrollada en React que consume una API REST publicada para realizar la administración de usuarios.

## Tecnologías utilizadas

- React
- JavaScript
- Vite
- CSS
- API REST en C# con .NET
- SQL Server

## API utilizada

URL: http://apiuisilvictor.somee.com

## Credenciales de prueba

Para ingresar a la aplicación:

- **Correo:** `1`
- **Contraseña:** `1`

Estas credenciales corresponden al usuario de prueba de la API.

## Funcionalidades

- Inicio de sesión.
- Visualización de usuarios registrados.
- Búsqueda de usuarios por ID.
- Registro de nuevos usuarios.
- Actualización de usuarios.
- Eliminación lógica de usuarios.

## Instrucciones para ejecutar localmente

1. Instalar Node.js.
2. Descargar o descomprimir el proyecto.
3. Abrir la carpeta `Proyecto2React` en Visual Studio Code.
4. Abrir una terminal dentro de la carpeta.
5. Ejecutar:

   ```bash
   npm install
   ```

6. Iniciar el servidor de desarrollo:

   ```bash
   npm run dev
   ```

7. Abrir en el navegador la dirección que aparece en la terminal, normalmente:

   `http://localhost:5173`

## Compilar el proyecto

Para generar la versión de producción:

```bash
npm run build
```

Los archivos compilados se generan en la carpeta `dist`.
