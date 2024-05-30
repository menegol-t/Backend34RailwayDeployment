# Comienzo: 
```
$ npm run start
```

Por default, se usa  localhost:8080 en modo FORK (1 solo proceso por CPU core). Se puede seleccionar si se usan otros puertos o se utiliza el modo cluster (es decir 1 proceso por CPU core) con "-p" y "-m", por ejemplo: 
```
$ npm run start -- -p:85 -m:CLUSTER
```
Todos los errores y warnings se guardan en /LOGS/ERROR.LOG o /LOGS/WARN.LOG

## Variables de entorno .env a nivel root: 

* MONGO_ATLAS_SRV= Link a la base de datos a usar. 

* ETHEREAL_EMAIL= Un email de la plataforma Ethereal. Por ahora la app solo funciona con ethereal y no Gmail. En este email se recibiran las ordenes de compra para el admin.
* ETHEREAL_PASSWORD= Password de ethereal.
* ETHEREAL_NAME= Nombre en ethereal.

* ADMIN_EMIAL= Email del administrador en caso de integrar Gmail en un futuro.
* ADMIN_PHONE= Numero de telefono del adminsitrador, con "+" al inicio y todos los prefijos internacionales. (por ej: +5491112345678) Es usado para recibir un SMS cuando se realiza una compra. Es importante que este numero sea el que se tiene habilitado en twilio.

* TWILIO_TOKEN= Cuenta en Twilio para envio de SMS y Whatsapp. 
* TWILIO_ACCOUNT_ID= ID de Twilio. 
* TWILIO_CELLPHONE= Numero de Twilio con "+" para enviar SMS.
* TWILIO_WHATSAPP_SANDBOX= Numero de Whatsapp de twilio.
* SEND_TO_TWILIO_WHATSAPP= Codigo para sincroniazr el whatsapp de twilio. 


Al principio sera redirigido a Login. En caso de no tener cuenta, seleccionar Signup. Aqui introducir sus datos, tiene que ser mayor de edad (y menor de 100 años) para usar la app, y tener un email genuino. Adicional, el numero de telefono se ingresa sin espacios ni simbolos, pero con todos los prefijos para telefonos internacionales (por ej: 54 911 1234 5678).

Si los datos de signup son validos, se redirigira a Login para ingresar con la cuenta recientemente creada. 

## Una vez loggueado, servicios:

* CHAT: Chatear con otros usuarios en vivo via websocket.
* PROFILE: Muestra informacion de su perfil. 
* LOGOUT: Se desloguea de la plataforma. Por default, tambien se desloguea de manera automatica a los 10 minutos. 
* PRODUCTS: Aqui se seleccionan productos para sumar al carrito. 
* CARTS: Se gestiona el carrito del usuario. Finalizar la compra cambiara el estado del carrito, enviara un email a la cuenta de ehtereal del admin, un SMS al admin (en caso de que se descomente el codigo en SRC/CONTROLLERS/CARTMETHODS.TS LINEA 108) y enviara un whatsapp tanto al admin como al cliente que haya escaneado el QR en el carrito. 

## Just backend though API
Login API: POST localhost:8080/api/login: Body: { 
    username: "myUser", 
    password: "mySecretPass" 
}

Sign up API: POST localhost:8080/api/signup: Body: {
    username: "myUser",
    password: "mySecretPass",
    name: "my name",
    location: "My home",
    age: "30",
    phone: "5491112345678",
    profileThumbnail: "HTTPS link to an image",
}

### General Endpoints: 
A los endpoints solo se puede acceder si se esta loggeado. 

- GET /API/CART: Solo se puede acceder si se esta loggeado.
- POST /API/CART/BUY: Finaliza la compra del carrito.

### Admin endpoints:
Solo se puede acceder a algunos con permisos de admin. Estos se cambian desde SRC/CONFIG/ADMIN.TS, seleccionando "admin: true".

* GET /API/CART/ALL: Muestra todos los carritos de todos los clientes. 
    * GET /API/CART/CartId: Obtiene un carrito por su ID. 
    * GET /API/CART/CartId/PRODUCTS: Obtiene los productos de un carrito por su ID.
    * POST /API/CART: Se crea un carrito.
    * POST /API/CartId/products: Añade un producto a un carrito con body: { productId: "id de un producto" }
    * DELETE /API/CartId: Elimina un cart por su ID.
    * DELETE /API/CartId/PRODUCTS: Elimina un producto de un carrito. El id del producto va con body: { productId: "id de un producto" }

* GET /API/INFO: Se pueden revisar estadisticas de la aplicacion como su PID, etc.
      
* GET /API/PRODUCTS/ProdId: Se obtiene la informacion de un producto por su Id.
* POST /API/PRODUCTS: Se puede crear un nuevo producto con body: {title: "Nombre del producto", price: "Precio como numero, sin simbolos.", thumbnail: "Link HTTPS hacia foto del producto", thumbnail2: "Segundo link HTTPS hacia foto del producto", stock: "Numero de stock", description: "Descripcion del producto", alt: "Texto alternativo para las imagenes", category: "Categoria del proucto"}
      
* PUT /API/ProdId: Se seleccionan los campos a actualizat de un producto. Para esot, se usa el product Id y se ponen los campos en el body. 
* DELETE /API/ProdId: Se elimina un producto por su Id.
      
* GET /API/PRODUCTS-TEST: Api de prueba.
* GET /API/RANDOMS: Se usa para gastar CPU calculando 100000000 numeros aleatorios. Si se pone /api/randoms?cant=2000, se calcularan 2000 numeros.
