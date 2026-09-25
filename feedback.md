# 📋 Bitácora de Pruebas y Feedback (GymPulse MVP)

Utilizá este archivo para anotar todos los detalles, ajustes visuales, bugs o mejoras que encuentres mientras pruebas cada uno de los 3 roles en [http://localhost:3000](http://localhost:3000).

---

## 🔑 Cuentas para Probar

| Rol | Email | Contraseña | URL de Inicio |
| :--- | :--- | :--- | :--- |
| **Miembro (Member)** | `maria@ironstrength.co` | `Password123!` | [http://localhost:3000/member](http://localhost:3000/member) |
| **Dueño de Gimnasio (Owner)** | `roberto@ironstrength.co` | `Password123!` | [http://localhost:3000/dashboard](http://localhost:3000/dashboard) |
| **SuperAdmin (Yeison Carreño)** | `admin@gympulse.com` | `Admin123456!` | [http://localhost:3000/admin](http://localhost:3000/admin) |

---

## 👤 1. Rol: Miembro (`/member`)

### Pantalla: Dashboard (`/member`)
- [en la promocion cuando le doy en el botton de aprovecha no pasa nada ] 

### Pantalla: Plan de Entreno (`/member/workout`)
- [todo esta esta bien  ] 

### Pantalla: Progreso (`/member/progress`)
- [el boton de sunir foto no funciona no pasa nada cuando se preciona,
GRASA CORPORAL no muetra datos, MASA MUSCULAR no muetra datos,Medidas corporales no muetra datos, Récords personales cuando precion ver todos no pasa nada ] 

### Pantalla: Agenda (`/member/schedule`)
- [ cuando preciono flitar no pasa nada, la fecha no se puede cambiar, el mes no se puede cambiar, ] 

### Pantalla: Comunidad (`/member/community`)
- [ cuando preciono agregar imagen no pasa nada, el boton de comentarios hace nada cunado le doy publicar la publicacion se sube con una foto a si no tenga ninguna imagen, ] 

### Pantalla: Logros (`/member/achievements`)
- [ en los logros debe de mostraser que para obtener el logro se debe de hacer algo y mostraser cuanto falta para obtenerlo, y quiero que se le agregue una barra de progreso por cada logro  y agregarle mas logros ] 

### Pantalla: Encuestas (`/member/surveys`)
- [ esta beien pero se puede mejorar, por ejemplo agregarle mas tipos de encuestas y que se puedan ver los resultados de las encuestas  ] 

### Pantalla: Configuración & Ayuda (`/member/settings`, `/member/help`)
- [ cuando edito o cambio los datos personales no se guardan los cambios ni se mantienen, en notificaciones  se deben agregar mas opciones para poder configurar las notificaciones, cuadno cambio algo en notificaciones no se mantienen los cambios, en los terminos de servicio y politica de privacidad no se muestran los terminos de servicio y politica de privacidad en la privacidad no se mutran opciones para seleccionar, en privacidad  quiero que se puedan seleccionar y guardar las opciones, en seguridad, quiero que se pueda cambiar la contraseña y que se pueda activar o desactivar la autenticacion en dos pasos,  en seguirada no se muetra nada que se pueda hacer no tiene sentido no tiene opciones.
en ayuda en la barra de busqueda se puede escribir pero no se muestra nada   no muestra lo que se esta buscando<tambien quiero que se le agregue una ayuda interativa paara que puedan usar cualquier vista y la ayuda lo balla guiendo paso a paso >
tambien se debe de poner la opcion de edtar la foto de perfil y agregarla , y que muestre ] 

---

## 🏢 2. Rol: Dueño de Gimnasio (`/dashboard`)

### Pantalla: Dashboard Operativo (`/dashboard`)
- [ MIEMBROS ACTIVOS no muestra los miembros activos , quiero qeu muestre los miembros activos, EN RIESGO tampoco muestra los miembros en riesgo, la bara de busqueda permite escribir pero no muestra nada, ] 

### Pantalla: Gestión de Miembros (`/dashboard/members`)
- [ todo esta bien pero se puede mejora visiblemente y en segurida al momento de ecribir los datos que se muetre que estam bien que el campo deonde se esta ecribiendo este bien y se ponga de color verde, y lo mismo cuando se esta escribiendo mal, se ponga de color rojo, ] 

### Pantalla: Gestión de Rutinas (`/dashboard/routines`)
- [ al moneto de crea la rutina se debe de balidar los campos y lo ejercicio que se puede hacer y las series y repeticiones debe de ser un numero, adema que que se puedan agregar images de los ejercicios. el boton de importan plamtilla lo que muetra es el formulario de crea rutina 
quiero suar esto https://github.com/yuhonas/free-exercise-db para que se muetren los ejercico cuando se crea la rutina y que tambien este la posibilidad de msotrar imágenes que puedan subir  los mismos dueños de los gynacios, todo esto respetando en ambito legal del repositorio, en la parte de los ejercicios quiero que se pueda ver una imagen del ejercicio, el nombre del ejercicio, la descripcion del ejercicio y los pasos para realizar el ejercicio, y que se pueda agregar  ] 

### Pantalla: Gestión de Entrenadores (`/dashboard/trainers`)
- [ en entrenadores se debe de mostra cuantos entrenadores hay y si estn activos o inactivos, se debe de poder buscar los entrenadores, y se debe de poder editar, y los bonton de acciones se debe de poder ver o  editar , tambien se debe de poder ver los miembros que tiene agregado el entrenador, se debe de poder agregar un horario de trabajo ] 
- [ ] 
### pantalla: reportes  

- [ la bara de busqueda permite escribir pero no muestra nada, el boto de jenerar reporete muetra lo del reporte pero no se descarga nada, quiero qeu se descargue en pdf, tambien quier que le agregues mas opciones de reportes como por ejemplo reportes de los miembros, entrenadores, rutinas,  mejor mes que hay  y un flitro por fecha y tipo de  reporte ] 

### Pantalla: pagos 
- [la bara de busqueda permite escribir pero no muestra nada, null value in column "paid_at" of relation "payments" violates not-null constraint me sale e=cuando intento reguistra un pago pendiente  tambien cuando se seleccione pendiente por cobrar no se deberia de poder elejir el metod de pago, tambien se debe de poder tener la ocion de editar el pago y actualizar el pago al estado que se quiera y se guarde el pago  una ves confirmado el pago no se debe de poder editar  ] 

### Pantalla: Configuración del Gimnasio (`/dashboard/settings`)
- [ en la arte de datos del gynacio todo bien pero se debe de poner una opcion que puedn sunir el logo o imagen del gynacio y estre mostrarcele a los mienbros y a lo s entrnendaores, en ofretas en el boton de agregar nuevas ofertas  no muestra nada, las ofretas viejas no tienen la opcion de editar ni eliminar, en la parte de equipos no se puede editar esa parte ni modificar ni agegar cosas nuevas, en la parte de plan no se mutran una opcion de canserlaar o cambiar si se desea cambiar el plan, en integrciones no se memuetra una ocion de editar o modificar o agregar mas integraciones,
en  notificaciones no se mutra nada quiero que se pueda agragr notificaciones  y seleccionar desde que dia se quiere que lleguen , que se envie un mensaje desde que se le da la bienvenida al miembro o al cliente hasta el ultimo dia , y que se muestren las fechas de los envios,  y tambien se debe de poder ver las notificaciones enviadas y que se muestre la opcion de aquien enviarsela   ] 

### Pantalla: Centro de Ayuda (`/dashboard/help`)
- [la bara de busqueda permite esceribor pero no muetra nada, ademas quiero agregar una ayuda interactiva para que puedan usar cualquier vista y la ayuda lo balla guiendo paso a paso, y tambien los temas que se muetran no se puede hacer click para obtener ayuda ] 

---

## 👑 3. Rol: SuperAdmin (`/admin`)

### Pantalla: Dashboard Global (`/admin`)
- [ CHURN / CANCELADOS no muestra nada, ] 

### Pantalla: Gestión de Gimnasios (`/admin/gyms`)
- [  al monto de registran un ginacio se debe de poder crear una cuenta de dueño al mismo tiempo, y tambien el dueño debe de poder editar la informacion del gynacio, los planes, ademas debe de poder eliminar el gynacio, adema tambien debe de tener la opcion de agregar una foto de perfil al gynacio   ] 

### pantalla: usuarios
- [ agregar campos para ver usuarios ] 

### pantalla: analiticas 
- [se pueden agregar mas graficas y opciones de visualizacion, ademas de que se deben mostrar los datos correctamente, se puede mejoer visalmente ] 

### Pantalla: Planes SaaS (`/admin/plans`)
- [  en los planes hace flata un boton para agregar ] 

### Pantalla: Analítica Global (`/admin/analytics`)
- [ ] 

### Pantalla: Facturación Global (`/admin/billing`)
- [ahi que agregaruna fraficas y mas opciones de pago con los que los clientes puedan pagar por ejemplo con mercado pago, paypal, etc. tambien que se muestre que metodos de pago estn habilitados y que no tambien que muestre el reporte de los pagos que se han realizado. se puede mejorar el diseño visalmente ] 

### Pantalla: Configuración Global (`/admin/settings`)
- [en datos personales no se guardan los cambios aademas debe de ahaber una ocionn para carhar el logo o imagen de el saas a demas que cuando este imagen se suaba tambien cambie en la pagina y tambien el nombre del saas  
en equipos se debed de crear un boto para agregar a alguin o si se agrega en usaurios quq se meutre en equio, en el branding   se debe de poner ocionde sobre la pagina y que muestre el logo del saas el nombre del saas y los colores que se 
pueden personalizar ademas de que se guarde los cambios , en planes se debe de poner un boton de agrega, ademas de  el tema de claro y oscuro y el idioma de la pagina  y que se guarde los cambios . en al autenticacion por favor agrega la opcion de iniciar sesion con google y facebook y que se pueda cambiar la contraseña y correo electronico . 
tambien agrega las opciones de autentificacion que se puedan ensender o desactivar 
en integraciones que se puedan edirar acrualizar o eliminar  y agregar un boton de agregar mas opciones de integraciones y que se pueda activar o desactivar las integraciones 
en notificaciones que se puedan editar, actualizar o eliminar y agregar un boton de agregar mas opciones de notificaciones y que se pueda activar o desactivar las notificaciones  ] 

---

### pagina de inicio 
- [ pagina de inicio mejora la parte visual hay cosas que se meuatran por esima de otras  ] 

## 🚀 Instrucciones para ejecutar los cambios:
Una vez que hayas completado tus notas en este archivo, simplemente escribe en el chat:
> *"Implementá todos los cambios listados en @feedback.md"*
