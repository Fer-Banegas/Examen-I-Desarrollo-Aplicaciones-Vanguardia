# Ejercicio 2 · API REST de pedidos

Proyecto independiente del Examen I Parcial de Desarrollo de Aplicaciones de Vanguardia (CEUTEC).

## Instalar y ejecutar

1. Abre una terminal en `Ejercicio-2-Pedidos` y ejecuta `npm ci`.
2. Comprueba que tu instancia local de MongoDB esté en ejecución. En macOS puedes verificar el puerto con `nc -G 2 -z 127.0.0.1 27017`.
3. Si aún no tienes `.env`, ejecuta `cp .env.example .env`. Conserva `PORT=3001` y ajusta `MONGODB_URI` si tu instancia local requiere una configuración distinta. Guarda cualquier credencial únicamente en `.env`, que Git ignora.
4. Ejecuta `npm start`. El proyecto verifica la conexión con MongoDB y luego inicia Express en `http://localhost:3001`. Usa `Ctrl+C` para detenerlo.

Si MongoDB devuelve `Unauthorized` al consultar pedidos, configura en `.env` la URI de una cuenta existente con permisos de lectura y escritura sobre `pedidos_db`. Si la cuenta se creó en otra base, especifica esa base con `authSource`. Si el usuario o la contraseña contienen caracteres reservados de URI, codifícalos con percent-encoding. El arranque comprueba el acceso al servidor con un `ping` y los permisos sobre la colección se comprueban al ejecutar las operaciones.

## Base de datos y modelo

La conexión usa `pedidos_db`. MongoDB materializa la base al crear su primera colección. El arranque comprueba la conexión. El primer registro exitoso crea la colección si todavía no existe.

El modelo requiere `clienteNombre` y un `total` mayor que cero. `estado` acepta `pendiente`, `enviado` y `entregado`, con `pendiente` como valor predeterminado. `fecha` usa la fecha actual por defecto y `productos` se puede omitir.

## Endpoints

| Método y ruta | Resultado |
| --- | --- |
| `POST /pedidos` | Registra el pedido y devuelve el documento creado con `201 Created`. |
| `GET /pedidos` | Devuelve todos los pedidos con `200 OK`. |
| `GET /pedidos/estado/:estado` | Devuelve los pedidos del estado solicitado con `200 OK`. |

Las consultas devuelven `[]` cuando no hay resultados. El filtro admite `pendiente`, `enviado` y `entregado`. Un estado inválido o un pedido que incumpla las validaciones devuelve `400 Bad Request` con un campo JSON `mensaje`.

### Ejemplos de solicitudes

El primer comando guarda un pedido. Los otros dos solo consultan.

```bash
curl -i -X POST http://localhost:3001/pedidos \
  -H 'Content-Type: application/json' \
  -d '{"clienteNombre":"Ana López","total":450,"estado":"pendiente","productos":["Cuaderno"]}'

curl -i http://localhost:3001/pedidos

curl -i http://localhost:3001/pedidos/estado/pendiente
```
