# Ejercicio 1 · API REST de empleados

Proyecto del Examen I de Desarrollo de Aplicaciones de Vanguardia (CEUTEC).

## Instalar y preparar MySQL

1. Desde la carpeta `Ejercicio-1-Empleados`, ejecuta `npm ci`.
2. Con MySQL en ejecución, conéctate con una cuenta que pueda consultar y crear bases de datos. Sustituye `TU_USUARIO` por el nombre de esa cuenta. MySQL solicitará la contraseña en la terminal.

   ```bash
   mysql --host=127.0.0.1 --port=3306 --user=TU_USUARIO --password
   ```

3. Consulta si existe la base de datos. Si la consulta devuelve cero filas, ejecuta `CREATE DATABASE`.

   ```sql
   SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA
   WHERE SCHEMA_NAME = 'empresa_db';

   CREATE DATABASE IF NOT EXISTS empresa_db CHARACTER SET utf8mb4;
   ```

4. Si aún no tienes `.env`, créalo con `cp .env.example .env`. Completa `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER` y `DB_PASSWORD` con la configuración local. La cuenta de la aplicación debe tener acceso a `empresa_db` y permiso para crear la tabla. Guarda la contraseña en el archivo local, que Git ignora. Si contiene espacios o `#`, enciérrala entre comillas en el archivo.

## Iniciar el servidor y comprobar la tabla

Ejecuta `npm start`. Sequelize verifica la conexión y crea la tabla `empleados` si hace falta. El servidor HTTP inicia después, en el puerto `3000` por defecto. Si falla MySQL, la consola muestra el código de error. Usa `Ctrl+C` para detener el servidor.

Después del arranque, consulta la estructura desde el cliente de MySQL.

```sql
SHOW COLUMNS FROM empresa_db.empleados;
```

El modelo define `id`, `nombre`, `puesto`, `salario` y `activo`. El salario usa `DECIMAL(10,2)` y el menor valor positivo que se puede guardar es `0.01`.

## Endpoints disponibles

Con el servidor iniciado, usa `http://localhost:3000` como URL base. Para las solicitudes con cuerpo, envía JSON con `Content-Type: application/json`.

| Método y ruta | Operación | Código de éxito |
| --- | --- | --- |
| `GET /empleados` | Lista todos los empleados, incluidos los inactivos. | 200 |
| `GET /empleados/:id` | Consulta un empleado por su ID. | 200 |
| `POST /empleados` | Crea un empleado con `nombre`, `puesto` y `salario`. `activo` es opcional y su valor predeterminado es `true`. | 201 |
| `PUT /empleados/:id` | Actualiza los campos enviados. El cuerpo debe incluir al menos un campo editable. | 200 |
| `DELETE /empleados/:id` | Cambia `activo` a `false` y devuelve el empleado actualizado. | 200 |

Ejemplo de cuerpo para `POST /empleados`.

```json
{
  "nombre": "Ana López",
  "puesto": "Analista",
  "salario": 15000.50
}
```

Las respuestas de error incluyen un campo `mensaje`. Los datos inválidos devuelven `400`, un ID que no corresponde a un empleado devuelve `404` y un error interno devuelve `500`.
