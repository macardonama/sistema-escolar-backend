# Sistema Escolar Backend

Backend para sistema escolar institucional construido con **Node.js**, **Express**, **PostgreSQL** y **Prisma**.

El sistema permite gestionar usuarios, roles, grupos, docentes, estudiantes, acudientes, áreas académicas, asignaciones académicas, asistencia, observaciones, reportes básicos y dashboard institucional editable.

---

## Tecnologías principales

- Node.js
- Express
- PostgreSQL
- Prisma ORM
- JWT para autenticación
- Bcrypt para encriptación de contraseñas
- CORS
- Dotenv
- Neon PostgreSQL
- Render

---

## Estructura general del proyecto

```txt
src/
├── config/
│   └── prisma.js
├── middlewares/
│   ├── authMiddleware.js
│   └── roleMiddleware.js
├── modules/
│   ├── auth/
│   ├── usuarios/
│   ├── grupos/
│   ├── docentes/
│   ├── estudiantes/
│   ├── acudientes/
│   ├── areas/
│   ├── asignacionesAcademicas/
│   ├── asistencias/
│   ├── observaciones/
│   ├── reportes/
│   └── dashboard/
├── utils/
│   └── permisos.js
├── app.js
└── server.js
```

---

## Roles del sistema

El sistema maneja los siguientes roles:

```txt
ADMINISTRATIVO
DIRECTIVO
DOCENTE
ESTUDIANTE
ACUDIENTE
PSICORIENTADOR
```

### ADMINISTRATIVO

Rol con permisos globales de administración. Puede gestionar usuarios, grupos, docentes, estudiantes, acudientes, relaciones, áreas, asignaciones académicas, asistencia, observaciones, reportes y dashboard institucional.

### DIRECTIVO

Rol institucional con permisos de gestión académica y actualización de tableros.

Puede, según las rutas actualmente habilitadas:

- Ver grupos.
- Editar grupos.
- Activar grupos.
- Desactivar grupos.
- Ver docentes.
- Crear asignaciones académicas.
- Listar asignaciones académicas.
- Consultar asignaciones por docente.
- Editar asignaciones académicas.
- Consultar reportes / analítica básica.
- Desasociar estudiantes de acudientes.
- Gestionar el dashboard institucional.

No se creó un módulo `directivos`, porque por ahora `DIRECTIVO` funciona como rol con permisos sobre módulos funcionales.

### DOCENTE

Puede consultar grupos, estudiantes, acudientes, áreas, asignaciones académicas, registrar asistencias, registrar observaciones y consultar reportes, según las reglas de pertenencia configuradas.

### ESTUDIANTE

Puede consultar información propia en rutas habilitadas. No puede listar todos los estudiantes.

Para facilitar el frontend, `GET /api/auth/perfil` devuelve el registro de estudiante asociado cuando el usuario autenticado tiene rol `ESTUDIANTE`.

### ACUDIENTE

Puede consultar información asociada a sus acudidos en rutas habilitadas, respetando reglas de pertenencia.

### PSICORIENTADOR

Rol creado como base para el futuro módulo de psicoorientación. Por ahora puede autenticarse y ser utilizado por el frontend para mostrar su sección correspondiente en el sidebar.

El alcance funcional del módulo de psicoorientación queda pendiente de definición.

---

## Seguridad y permisos por pertenencia

Además de validar el rol del usuario mediante JWT, el sistema incluye validaciones de pertenencia para proteger información sensible.

Actualmente se valida que:

- Un usuario con rol `ADMINISTRATIVO` pueda consultar toda la información.
- Un usuario con rol `DOCENTE` solo pueda consultar información de estudiantes pertenecientes a grupos donde sea director.
- Un usuario con rol `ESTUDIANTE` solo pueda consultar su propio registro, asistencias, observaciones y reportes individuales.
- Un usuario con rol `ACUDIENTE` solo pueda consultar información de estudiantes asociados como acudidos.

Estas validaciones aplican actualmente en:

```txt
GET /api/estudiantes/:id
GET /api/acudientes/:id
GET /api/asistencias
GET /api/asistencias/:id
GET /api/reportes/asistencia/estudiante/:estudianteId
GET /api/observaciones
GET /api/observaciones/:id
GET /api/reportes/observaciones/estudiante/:estudianteId
```

### Reglas importantes para `ACUDIENTE`

- `GET /api/asistencias` filtra automáticamente y solo retorna asistencias de los estudiantes asociados al acudiente autenticado.
- `GET /api/asistencias?estudianteId=...` retorna `200 OK` si el estudiante pertenece al acudiente y `403 Forbidden` si no pertenece.
- `GET /api/asistencias/:id` valida que la asistencia pertenezca a un estudiante asociado al acudiente.
- `GET /api/observaciones` filtra automáticamente y solo retorna observaciones individuales de los estudiantes asociados al acudiente autenticado.
- Las observaciones generales con `estudianteId: null` no se retornan a acudientes para evitar exponer información general del grupo.
- `GET /api/observaciones/:id` valida pertenencia antes de retornar la observación.

Para que estas validaciones funcionen correctamente, los registros deben estar asociados así:

```txt
Usuario con rol ESTUDIANTE → Estudiante.usuarioId
Usuario con rol ACUDIENTE → Acudiente.usuarioId
Acudiente ↔ Estudiante mediante EstudianteAcudiente
Docente ↔ Grupo mediante Grupo.directorDocenteId
```

---

## Variables de entorno

Crear un archivo `.env` en la raíz del proyecto con la siguiente estructura:

```env
DATABASE_URL="postgresql://postgres:TU_CONTRASEÑA@localhost:5432/sistema_escolar?schema=public"
PORT=3000
JWT_SECRET="clave_super_secreta_sistema_escolar"
```

Para conectarse a la base de datos en la nube alojada en Neon, la variable `DATABASE_URL` debe usar la cadena de conexión entregada por Neon:

```env
DATABASE_URL="postgresql://usuario:password@host/database?sslmode=require"
PORT=3000
JWT_SECRET="clave_super_secreta_sistema_escolar"
```

> Importante: el archivo `.env` no debe subirse a GitHub. Debe estar incluido en `.gitignore`.

El repositorio incluye un archivo `.env.example` como referencia para configurar las variables de entorno sin exponer credenciales reales.

---

## Instalación

```bash
npm install
```

---

## Ejecutar el servidor en desarrollo

```bash
npm run dev
```

El servidor quedará disponible en:

```txt
http://localhost:3000
```

---

## Despliegue

El backend puede ejecutarse de forma local o desde la URL pública desplegada en Render.

### URL local

```txt
http://localhost:3000
```

### URL pública

```txt
https://sistema-escolar-backend-wlfg.onrender.com
```

---

## Base de datos en la nube

El proyecto utiliza PostgreSQL. Para producción/despliegue se está usando una base de datos PostgreSQL alojada en Neon.

La conexión se configura mediante la variable de entorno:

```env
DATABASE_URL="postgresql://usuario:password@host/database?sslmode=require"
```

En local, esta variable se define en el archivo `.env`.

En Render, esta variable se configura desde el panel de **Environment Variables**.

---

## Variables de entorno en Render

Para desplegar correctamente el backend en Render, se deben configurar estas variables:

```txt
DATABASE_URL
JWT_SECRET
PORT
```

Ejemplo:

```txt
DATABASE_URL = cadena de conexión de Neon
JWT_SECRET = clave segura para JWT
PORT = 3000
```

---

## Comandos usados en Render

### Build Command

```bash
npm install && npx prisma generate && npx prisma migrate deploy
```

### Start Command

```bash
npm start
```

### Recomendación de puerto para Render

En `src/server.js`, se recomienda escuchar explícitamente en `0.0.0.0`:

```js
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`Servidor corriendo en http://${HOST}:${PORT}`);
});
```

Esto ayuda a que Render detecte correctamente el servicio web.

---

## Usuario administrativo inicial

El proyecto incluye un seed para crear un usuario administrativo inicial.

```bash
npm run seed
```

Usuario creado por defecto:

```txt
Correo: mateo@test.com
Contraseña: 123456
Rol: ADMINISTRATIVO
```

> En producción se recomienda cambiar esta contraseña después del primer inicio de sesión.

---

## Prisma

### Generar Prisma Client

```bash
npx prisma generate
```

### Ejecutar migraciones en desarrollo

```bash
npx prisma migrate dev --name nombre_de_la_migracion
```

### Ejecutar migraciones en producción/Render

```bash
npx prisma migrate deploy
```

### Ejecutar seed inicial

```bash
npm run seed
```

### Abrir Prisma Studio

```bash
npx prisma studio
```

---

# Endpoints

La URL base puede ser local o pública:

```txt
Local:
http://localhost:3000

Render:
https://sistema-escolar-backend-wlfg.onrender.com
```

Para las rutas protegidas se debe enviar el token JWT en el header:

```txt
Authorization: Bearer TU_TOKEN
```

---

## Auth

### Iniciar sesión

```http
POST /api/auth/login
```

Body:

```json
{
  "correo": "mateo@test.com",
  "password": "123456"
}
```

Respuesta esperada:

```json
{
  "mensaje": "Inicio de sesión exitoso",
  "token": "TOKEN_JWT",
  "usuario": {
    "id": 1,
    "nombre": "Mateo Cardona",
    "correo": "mateo@test.com",
    "rol": "ADMINISTRATIVO",
    "activo": true
  }
}
```

### Consultar perfil autenticado

```http
GET /api/auth/perfil
```

Headers:

```txt
Authorization: Bearer TU_TOKEN
```

Respuesta base:

```json
{
  "mensaje": "Perfil obtenido correctamente",
  "usuario": {
    "id": 1,
    "nombre": "Mateo Cardona",
    "correo": "mateo@test.com",
    "rol": "ADMINISTRATIVO",
    "activo": true
  }
}
```

Cuando el usuario autenticado tiene rol `ESTUDIANTE`, la respuesta también incluye el registro de estudiante asociado:

```json
{
  "mensaje": "Perfil obtenido correctamente",
  "usuario": {
    "id": 10,
    "nombre": "Estudiante Prueba",
    "correo": "estudiante@test.com",
    "rol": "ESTUDIANTE",
    "activo": true,
    "estudiante": {
      "id": 5,
      "documento": "100000001",
      "grupoId": 1,
      "grupo": {
        "id": 1,
        "nombre": "6-1",
        "grado": "Sexto",
        "activo": true
      }
    }
  }
}
```

---

## Usuarios

### Crear usuario

```http
POST /api/usuarios
```

Roles permitidos:

```txt
ADMINISTRATIVO
```

Body:

```json
{
  "nombre": "Profesor Prueba",
  "correo": "docente@test.com",
  "password": "123456",
  "rol": "DOCENTE"
}
```

Roles válidos:

```txt
ADMINISTRATIVO
DIRECTIVO
DOCENTE
ESTUDIANTE
ACUDIENTE
PSICORIENTADOR
```

### Listar usuarios

```http
GET /api/usuarios
```

Roles permitidos:

```txt
ADMINISTRATIVO
```

### Consultar usuario por ID

```http
GET /api/usuarios/:id
```

Roles permitidos:

```txt
ADMINISTRATIVO
```

### Actualizar usuario

```http
PUT /api/usuarios/:id
```

Roles permitidos:

```txt
ADMINISTRATIVO
```

Body ejemplo:

```json
{
  "nombre": "Nuevo Nombre",
  "correo": "nuevo@test.com",
  "rol": "DOCENTE",
  "activo": true
}
```

### Actualizar contraseña de usuario

```http
PATCH /api/usuarios/:id/password
```

Roles permitidos:

```txt
ADMINISTRATIVO
```

Body:

```json
{
  "password": "654321"
}
```

Respuesta esperada:

```json
{
  "mensaje": "Contraseña actualizada correctamente",
  "usuario": {
    "id": 3,
    "nombre": "Estudiante Prueba",
    "correo": "estudiante@test.com",
    "rol": "ESTUDIANTE",
    "activo": true
  }
}
```

### Desactivar usuario

```http
PATCH /api/usuarios/:id/desactivar
```

Roles permitidos:

```txt
ADMINISTRATIVO
```

### Activar usuario

```http
PATCH /api/usuarios/:id/activar
```

Roles permitidos:

```txt
ADMINISTRATIVO
```

---

## Grupos

### Crear grupo

```http
POST /api/grupos
```

Roles permitidos:

```txt
ADMINISTRATIVO
```

Body:

```json
{
  "nombre": "6-1",
  "grado": "Sexto"
}
```

Body con director de grupo:

```json
{
  "nombre": "6-1",
  "grado": "Sexto",
  "directorDocenteId": 1
}
```

### Listar grupos

```http
GET /api/grupos
```

Roles permitidos:

```txt
ADMINISTRATIVO
DIRECTIVO
DOCENTE
```

### Consultar grupo por ID

```http
GET /api/grupos/:id
```

Roles permitidos:

```txt
ADMINISTRATIVO
DIRECTIVO
DOCENTE
```

### Actualizar grupo

```http
PUT /api/grupos/:id
```

Roles permitidos:

```txt
ADMINISTRATIVO
DIRECTIVO
```

Body ejemplo:

```json
{
  "nombre": "6-2",
  "grado": "Sexto",
  "directorDocenteId": 1,
  "activo": true
}
```

### Desactivar grupo

```http
PATCH /api/grupos/:id/desactivar
```

Roles permitidos:

```txt
ADMINISTRATIVO
DIRECTIVO
```

### Activar grupo

```http
PATCH /api/grupos/:id/activar
```

Roles permitidos:

```txt
ADMINISTRATIVO
DIRECTIVO
```

---

## Docentes

### Crear docente

```http
POST /api/docentes
```

Roles permitidos:

```txt
ADMINISTRATIVO
```

Body:

```json
{
  "usuarioId": 2,
  "documento": "123456789",
  "telefono": "3001234567"
}
```

> El usuario asociado debe tener rol `DOCENTE`.

### Listar docentes

```http
GET /api/docentes
```

Roles permitidos:

```txt
ADMINISTRATIVO
DIRECTIVO
DOCENTE
```

### Consultar docente por ID

```http
GET /api/docentes/:id
```

Roles permitidos:

```txt
ADMINISTRATIVO
DIRECTIVO
DOCENTE
```

### Actualizar docente

```http
PUT /api/docentes/:id
```

Roles permitidos:

```txt
ADMINISTRATIVO
```

Body ejemplo:

```json
{
  "documento": "987654321",
  "telefono": "3112223344"
}
```

---

## Estudiantes

### Crear estudiante

```http
POST /api/estudiantes
```

Roles permitidos:

```txt
ADMINISTRATIVO
```

Body recomendado:

```json
{
  "documento": "100000001",
  "grupoId": 1,
  "usuarioId": 3
}
```

> El usuario asociado debe tener rol `ESTUDIANTE`. El nombre del estudiante se toma automáticamente desde `Usuario.nombre`.

### Listar estudiantes

```http
GET /api/estudiantes
```

Roles permitidos:

```txt
ADMINISTRATIVO
DOCENTE
```

### Consultar estudiante por ID

```http
GET /api/estudiantes/:id
```

Roles permitidos:

```txt
ADMINISTRATIVO
DOCENTE
ESTUDIANTE
ACUDIENTE
```

### Actualizar estudiante

```http
PUT /api/estudiantes/:id
```

Roles permitidos:

```txt
ADMINISTRATIVO
```

Body ejemplo:

```json
{
  "documento": "100000002",
  "grupoId": 1,
  "activo": true
}
```

### Desactivar estudiante

```http
PATCH /api/estudiantes/:id/desactivar
```

Roles permitidos:

```txt
ADMINISTRATIVO
```

---

## Acudientes

### Crear acudiente

```http
POST /api/acudientes
```

Roles permitidos:

```txt
ADMINISTRATIVO
```

Body recomendado:

```json
{
  "telefono": "3005551234",
  "usuarioId": 4
}
```

> El usuario asociado debe tener rol `ACUDIENTE`. El nombre y correo del acudiente se toman automáticamente desde `Usuario`.

### Listar acudientes

```http
GET /api/acudientes
```

Roles permitidos:

```txt
ADMINISTRATIVO
DOCENTE
```

La respuesta incluye el usuario asociado y las relaciones con estudiantes.

### Consultar acudiente por ID

```http
GET /api/acudientes/:id
```

Roles permitidos:

```txt
ADMINISTRATIVO
DOCENTE
ACUDIENTE
```

> El rol `ACUDIENTE` solo puede consultar su propio registro de acudiente.

### Actualizar acudiente

```http
PUT /api/acudientes/:id
```

Roles permitidos:

```txt
ADMINISTRATIVO
```

Body ejemplo:

```json
{
  "telefono": "3115557788"
}
```

### Asociar estudiante a acudiente

```http
POST /api/acudientes/asociar-estudiante
```

Roles permitidos:

```txt
ADMINISTRATIVO
```

Body:

```json
{
  "estudianteId": 1,
  "acudienteId": 1,
  "parentesco": "Madre"
}
```

### Desasociar estudiante de acudiente

```http
DELETE /api/acudientes/desasociar-estudiante
```

Roles permitidos:

```txt
ADMINISTRATIVO
DIRECTIVO
```

Body:

```json
{
  "estudianteId": 1,
  "acudienteId": 1
}
```

> Este endpoint elimina únicamente la relación en `EstudianteAcudiente`; no elimina el estudiante ni el acudiente.

---

## Áreas

El módulo de áreas permite registrar las asignaturas o áreas académicas que se imparten en la institución.

### Crear área

```http
POST /api/areas
```

Roles permitidos:

```txt
ADMINISTRATIVO
```

Body:

```json
{
  "nombre": "Matemáticas",
  "descripcion": "Área de matemáticas"
}
```

### Listar áreas

```http
GET /api/areas
```

Roles permitidos:

```txt
ADMINISTRATIVO
DOCENTE
```

Filtro opcional:

```http
GET /api/areas?activo=true
```

### Consultar área por ID

```http
GET /api/areas/:id
```

Roles permitidos:

```txt
ADMINISTRATIVO
DOCENTE
```

### Actualizar área

```http
PUT /api/areas/:id
```

Roles permitidos:

```txt
ADMINISTRATIVO
```

Body ejemplo:

```json
{
  "nombre": "Matemáticas",
  "descripcion": "Área de pensamiento matemático",
  "activo": true
}
```

> El nombre del área debe ser único.

---

## Asignaciones académicas

El módulo de asignaciones académicas permite relacionar un docente, un grupo y un área.

Ejemplo:

```txt
Docente: Docente Prueba
Grupo: 6-2
Área: Matemáticas
```

### Crear asignación académica

```http
POST /api/asignaciones-academicas
```

Roles permitidos:

```txt
ADMINISTRATIVO
DIRECTIVO
```

Body:

```json
{
  "docenteId": 20,
  "grupoId": 1,
  "areaId": 1
}
```

> No se puede crear una asignación duplicada con el mismo `docenteId`, `grupoId` y `areaId`.

### Listar asignaciones académicas

```http
GET /api/asignaciones-academicas
```

Roles permitidos:

```txt
ADMINISTRATIVO
DIRECTIVO
DOCENTE
```

Filtros disponibles:

```txt
docenteId
grupoId
areaId
activo
```

### Consultar asignación académica por ID

```http
GET /api/asignaciones-academicas/:id
```

Roles permitidos:

```txt
ADMINISTRATIVO
DIRECTIVO
DOCENTE
```

### Listar asignaciones por docente

```http
GET /api/asignaciones-academicas/docente/:docenteId
```

Roles permitidos:

```txt
ADMINISTRATIVO
DIRECTIVO
DOCENTE
```

### Actualizar asignación académica

```http
PUT /api/asignaciones-academicas/:id
```

Roles permitidos:

```txt
ADMINISTRATIVO
DIRECTIVO
```

Body ejemplo:

```json
{
  "docenteId": 20,
  "grupoId": 1,
  "areaId": 1,
  "activo": true
}
```

---

## Asistencias

### Registrar asistencia

```http
POST /api/asistencias
```

Roles permitidos:

```txt
ADMINISTRATIVO
DOCENTE
```

Body:

```json
{
  "estudianteId": 1,
  "docenteId": 1,
  "grupoId": 1,
  "estado": "PRESENTE",
  "emocion": "😊",
  "observacion": "Participó activamente en clase"
}
```

Estados válidos:

```txt
PRESENTE
AUSENTE
TARDE
CITA
HOSPITALIZADO
EN_CUARTO
```

> La emoción solo debe enviarse cuando el estado sea `PRESENTE`.

### Listar asistencias

```http
GET /api/asistencias
```

Roles permitidos:

```txt
ADMINISTRATIVO
DOCENTE
ESTUDIANTE
ACUDIENTE
```

Filtros disponibles por query params:

```txt
estudianteId
docenteId
grupoId
fechaInicio
fechaFin
```

Reglas por pertenencia:

- `ADMINISTRATIVO` puede consultar todas las asistencias.
- `DOCENTE` consulta asistencias de estudiantes de sus grupos dirigidos.
- `ESTUDIANTE` consulta únicamente sus propias asistencias.
- `ACUDIENTE` consulta únicamente asistencias de sus estudiantes asociados.
- Si `ACUDIENTE` o `ESTUDIANTE` consultan un `estudianteId` no permitido, el backend responde `403 Forbidden`.
- Si `ACUDIENTE` consulta sin `estudianteId`, el backend filtra automáticamente por sus acudidos.

### Consultar asistencia por ID

```http
GET /api/asistencias/:id
```

Roles permitidos:

```txt
ADMINISTRATIVO
DOCENTE
ESTUDIANTE
ACUDIENTE
```

### Actualizar asistencia

```http
PUT /api/asistencias/:id
```

Roles permitidos:

```txt
ADMINISTRATIVO
DOCENTE
```

### Registrar asistencias masivas

```http
POST /api/asistencias/masiva
```

Roles permitidos:

```txt
ADMINISTRATIVO
DOCENTE
```

Este endpoint permite registrar la asistencia de varios estudiantes en una sola petición usando una asignación académica.

Body:

```json
{
  "asignacionAcademicaId": 1,
  "fecha": "2026-06-07",
  "asistencias": [
    {
      "estudianteId": 8,
      "estado": "PRESENTE",
      "emocion": "😊",
      "observacion": "Participó correctamente."
    },
    {
      "estudianteId": 10,
      "estado": "AUSENTE",
      "emocion": null,
      "observacion": "No asistió."
    }
  ]
}
```

Funcionamiento:

- El backend toma `docenteId` y `grupoId` desde la asignación académica.
- Valida que la asignación académica exista y esté activa.
- Valida que los estudiantes existan.
- Valida que los estudiantes pertenezcan al grupo de la asignación académica.
- Si la asistencia no existe, la crea.
- Si ya existe una asistencia para el mismo estudiante, asignación académica y fecha, la actualiza mediante `upsert`.
- La emoción solo se guarda cuando el estado es `PRESENTE`.

Llave lógica usada para evitar duplicados:

```txt
estudianteId + asignacionAcademicaId + fecha
```

---

## Observaciones

### Registrar observación

```http
POST /api/observaciones
```

Roles permitidos:

```txt
ADMINISTRATIVO
DOCENTE
```

Observación general:

```json
{
  "docenteId": 1,
  "grupoId": 1,
  "tipo": "GENERAL",
  "descripcion": "El grupo trabajó de forma ordenada durante la clase.",
  "enviarAcudiente": false
}
```

Observación individual:

```json
{
  "estudianteId": 1,
  "docenteId": 1,
  "grupoId": 1,
  "tipo": "INDIVIDUAL",
  "descripcion": "El estudiante participó activamente y entregó la actividad completa.",
  "enviarAcudiente": true
}
```

### Listar observaciones

```http
GET /api/observaciones
```

Roles permitidos:

```txt
ADMINISTRATIVO
DOCENTE
ESTUDIANTE
ACUDIENTE
```

Filtros disponibles por query params:

```txt
estudianteId
docenteId
grupoId
fechaInicio
fechaFin
tipo
```

Reglas por pertenencia:

- `ADMINISTRATIVO` puede consultar todas las observaciones.
- `DOCENTE` consulta observaciones de estudiantes de sus grupos dirigidos.
- `ESTUDIANTE` consulta únicamente sus propias observaciones individuales.
- `ACUDIENTE` consulta únicamente observaciones individuales de sus estudiantes asociados.
- Las observaciones generales con `estudianteId: null` no se retornan a `ESTUDIANTE` ni `ACUDIENTE`.

### Consultar observación por ID

```http
GET /api/observaciones/:id
```

Roles permitidos:

```txt
ADMINISTRATIVO
DOCENTE
ACUDIENTE
ESTUDIANTE
```

### Actualizar observación

```http
PUT /api/observaciones/:id
```

Roles permitidos:

```txt
ADMINISTRATIVO
DOCENTE
```

---

## Reportes básicos

### Reporte de asistencia por grupo

```http
GET /api/reportes/asistencia/grupo/:grupoId
```

Roles permitidos:

```txt
ADMINISTRATIVO
DIRECTIVO
DOCENTE
```

Query params opcionales:

```txt
fechaInicio
fechaFin
```

### Reporte de asistencia por estudiante

```http
GET /api/reportes/asistencia/estudiante/:estudianteId
```

Roles permitidos:

```txt
ADMINISTRATIVO
DIRECTIVO
DOCENTE
ESTUDIANTE
ACUDIENTE
```

Query params opcionales:

```txt
fechaInicio
fechaFin
```

### Reporte de observaciones por estudiante

```http
GET /api/reportes/observaciones/estudiante/:estudianteId
```

Roles permitidos:

```txt
ADMINISTRATIVO
DIRECTIVO
DOCENTE
ESTUDIANTE
ACUDIENTE
```

Query params opcionales:

```txt
fechaInicio
fechaFin
tipo
```

### Resumen de grupo

```http
GET /api/reportes/resumen/grupo/:grupoId
```

Roles permitidos:

```txt
ADMINISTRATIVO
DIRECTIVO
DOCENTE
```

Query params opcionales:

```txt
fechaInicio
fechaFin
```

---

## Dashboard institucional

El módulo de dashboard permite administrar el contenido que se muestra en la pantalla principal institucional.

Incluye:

```txt
Noticias institucionales
Próximos eventos
Galería institucional
```

### Consultar dashboard público

```http
GET /api/dashboard
```

Roles permitidos:

```txt
ADMINISTRATIVO
DIRECTIVO
DOCENTE
ESTUDIANTE
ACUDIENTE
PSICORIENTADOR
```

Devuelve únicamente elementos activos.

Respuesta esperada:

```json
{
  "mensaje": "Dashboard obtenido correctamente",
  "dashboard": {
    "noticias": [],
    "eventos": [],
    "galeria": []
  }
}
```

### Consultar dashboard para edición

```http
GET /api/dashboard/gestion
```

Roles permitidos:

```txt
ADMINISTRATIVO
DIRECTIVO
```

Devuelve elementos activos e inactivos para que el frontend pueda pintar un tablero editable.

### Guardar dashboard completo desde JSON

```http
PUT /api/dashboard
```

Roles permitidos:

```txt
ADMINISTRATIVO
DIRECTIVO
```

Este endpoint permite guardar el dashboard completo desde un tablero editable en el frontend.

Reglas:

- Elementos con `id` se actualizan.
- Elementos sin `id` se crean.
- Elementos con `activo: false` se ocultan del dashboard público.
- Los elementos no se eliminan físicamente.

Body ejemplo:

```json
{
  "noticias": [
    {
      "id": 1,
      "titulo": "Semana cultural PPDA",
      "descripcion": "Actividades académicas, artísticas y deportivas durante la próxima semana.",
      "color": "azul",
      "orden": 1,
      "activo": true
    },
    {
      "titulo": "Escuela de padres",
      "descripcion": "Encuentro institucional para fortalecer el acompañamiento familiar.",
      "color": "verde",
      "orden": 2,
      "activo": true
    }
  ],
  "eventos": [
    {
      "id": 1,
      "titulo": "Izada de bandera",
      "fecha": "2026-05-27",
      "color": "azul",
      "orden": 1,
      "activo": true
    }
  ],
  "galeria": [
    {
      "id": 1,
      "titulo": "Actividad académica",
      "descripcion": "Registro institucional de actividad académica.",
      "imagenUrl": null,
      "orden": 1,
      "activo": true
    }
  ]
}
```

### Crear noticia

```http
POST /api/dashboard/noticias
```

Roles permitidos:

```txt
ADMINISTRATIVO
DIRECTIVO
```

Body:

```json
{
  "titulo": "Semana cultural PPDA",
  "descripcion": "Actividades académicas, artísticas y deportivas durante la próxima semana.",
  "color": "azul",
  "orden": 1
}
```

### Actualizar noticia

```http
PUT /api/dashboard/noticias/:id
```

Roles permitidos:

```txt
ADMINISTRATIVO
DIRECTIVO
```

### Activar noticia

```http
PATCH /api/dashboard/noticias/:id/activar
```

Roles permitidos:

```txt
ADMINISTRATIVO
DIRECTIVO
```

### Desactivar noticia

```http
PATCH /api/dashboard/noticias/:id/desactivar
```

Roles permitidos:

```txt
ADMINISTRATIVO
DIRECTIVO
```

### Crear evento

```http
POST /api/dashboard/eventos
```

Roles permitidos:

```txt
ADMINISTRATIVO
DIRECTIVO
```

Body:

```json
{
  "titulo": "Izada de bandera",
  "fecha": "2026-05-27",
  "color": "azul",
  "orden": 1
}
```

### Actualizar evento

```http
PUT /api/dashboard/eventos/:id
```

Roles permitidos:

```txt
ADMINISTRATIVO
DIRECTIVO
```

### Activar evento

```http
PATCH /api/dashboard/eventos/:id/activar
```

Roles permitidos:

```txt
ADMINISTRATIVO
DIRECTIVO
```

### Desactivar evento

```http
PATCH /api/dashboard/eventos/:id/desactivar
```

Roles permitidos:

```txt
ADMINISTRATIVO
DIRECTIVO
```

### Crear elemento de galería

```http
POST /api/dashboard/galeria
```

Roles permitidos:

```txt
ADMINISTRATIVO
DIRECTIVO
```

Body:

```json
{
  "titulo": "Actividad académica",
  "descripcion": "Registro institucional",
  "imagenUrl": null,
  "orden": 1
}
```

### Actualizar elemento de galería

```http
PUT /api/dashboard/galeria/:id
```

Roles permitidos:

```txt
ADMINISTRATIVO
DIRECTIVO
```

### Activar elemento de galería

```http
PATCH /api/dashboard/galeria/:id/activar
```

Roles permitidos:

```txt
ADMINISTRATIVO
DIRECTIVO
```

### Desactivar elemento de galería

```http
PATCH /api/dashboard/galeria/:id/desactivar
```

Roles permitidos:

```txt
ADMINISTRATIVO
DIRECTIVO
```

---

## Flujo recomendado de prueba

1. Ejecutar migraciones.
2. Ejecutar seed inicial para crear usuario administrativo.
3. Iniciar sesión y copiar token.
4. Crear usuario docente.
5. Crear docente asociado al usuario docente.
6. Crear usuario estudiante.
7. Crear estudiante asociado al usuario estudiante.
8. Crear usuario acudiente.
9. Crear acudiente asociado al usuario acudiente.
10. Crear grupo.
11. Asociar estudiante con grupo.
12. Asociar estudiante con acudiente.
13. Crear área académica.
14. Crear asignación académica asociando docente, grupo y área.
15. Registrar asistencia individual.
16. Registrar asistencias masivas por asignación académica.
17. Registrar observación general.
18. Registrar observación individual.
19. Consultar reportes básicos.
20. Crear usuario directivo.
21. Probar permisos de directivo en grupos, asignaciones, reportes y dashboard.
22. Crear usuario psicorientador.
23. Consultar dashboard desde todos los roles autenticados.
24. Probar edición del dashboard desde `ADMINISTRATIVO` y `DIRECTIVO`.
25. Probar permisos por pertenencia con usuarios `ESTUDIANTE` y `ACUDIENTE`.
26. Probar nuevamente usando la URL pública de Render.

---

## Colección de Postman

El proyecto cuenta con una colección de Postman organizada por módulos para probar los endpoints del backend.

La colección debe incluir carpetas para:

```txt
General
Auth
Usuarios
Grupos
Docentes
Estudiantes
Acudientes
Áreas
Asignaciones Académicas
Asistencias
Observaciones
Reportes
Dashboard
```

Variables recomendadas en Postman:

```txt
base_url
token
token_admin
token_directivo
token_docente
token_estudiante
token_acudiente
token_psicorientador
usuario_id
docente_id
grupo_id
estudiante_id
acudiente_id
area_id
asignacion_academica_id
asistencia_id
observacion_id
dashboard_noticia_id
dashboard_evento_id
dashboard_galeria_id
```

La variable `base_url` puede apuntar al servidor local o al backend desplegado en Render:

```txt
Local:
http://localhost:3000

Render:
https://sistema-escolar-backend-wlfg.onrender.com
```

Para rutas protegidas, la colección utiliza autenticación tipo Bearer Token:

```txt
Authorization: Bearer {{token}}
```

Primero se debe ejecutar el endpoint de login para generar y guardar el token en Postman.

> La colección de Postman no se sube al repositorio por seguridad. Se comparte directamente con el equipo de frontend.

---

## Diagrama ERD

El proyecto puede generar un diagrama entidad-relación desde Prisma usando `prisma-erd-generator`.

El diagrama técnico se genera a partir de:

```txt
prisma/schema.prisma
```

Comando recomendado:

```bash
npx prisma generate
```

El archivo generado puede dejarse en la carpeta `prisma/` como evidencia técnica de la estructura de la base de datos.

---

## Comandos Git sugeridos

### Guardar cambios

```bash
git status
git add .
git commit -m "Descripcion clara del cambio realizado"
git push
```

### Fusionar una rama después de probar

```bash
git checkout main
git pull origin main
git merge nombre-de-la-rama
git push origin main
```

---

## Pendientes actuales y recomendaciones

### Alta prioridad

- Actualizar la colección de Postman con los endpoints nuevos:
  - `PATCH /api/usuarios/:id/password`
  - `PATCH /api/grupos/:id/activar`
  - `DELETE /api/acudientes/desasociar-estudiante`
  - Endpoints del módulo `dashboard`
  - `GET /api/dashboard/gestion`
  - `PUT /api/dashboard`
- Verificar en Render que las migraciones del módulo dashboard estén aplicadas correctamente.
- Confirmar que `src/server.js` escuche en `0.0.0.0` para evitar problemas de detección de puerto en Render.
- Probar `GET /api/auth/perfil` con usuario `ESTUDIANTE` para confirmar que devuelve `usuario.estudiante`.

### Permisos por revisar

- Evaluar si `DIRECTIVO` también debe poder listar y consultar estudiantes:
  - `GET /api/estudiantes`
  - `GET /api/estudiantes/:id`
- Evaluar si `DIRECTIVO` también debe poder listar y consultar acudientes:
  - `GET /api/acudientes`
  - `GET /api/acudientes/:id`
- Revisar inconsistencia actual:
  - `DIRECTIVO` puede desasociar estudiante-acudiente.
  - `DIRECTIVO` todavía no puede asociar estudiante-acudiente.
- Evaluar si `DIRECTIVO` debe poder listar y consultar áreas:
  - `GET /api/areas`
  - `GET /api/areas/:id`

### Funcionalidades pendientes

- Crear endpoint de carga masiva de usuarios desde JSON.
- Crear carga masiva desde Excel o CSV.
- Crear flujo de recuperación de contraseña desde login:
  - `POST /api/auth/solicitar-recuperacion`
  - `POST /api/auth/restablecer-password`
  - Modelo `PasswordResetToken`
  - Envío de correo real.
- Crear módulo de psicoorientación:
  - Informes PIAR.
  - Seguimientos.
  - Remisiones.
  - Archivos o enlaces de soporte.
  - Historial por estudiante.
- Refactorizar observaciones para permitir autores no docentes:
  - Directivo.
  - Psicorientador.
  - Administrativo.
- Definir manejo real de imágenes de galería:
  - Por ahora `imagenUrl` guarda una URL.
  - Falta definir si se usará Cloudinary, S3, Firebase Storage u otro servicio.
- Agregar pruebas automatizadas.
- Crear documentación OpenAPI/Swagger si el proyecto crece.
- Migrar y ordenar el backend dentro del repositorio `ppda-platform/backend` cuando el frontend esté listo.
- Cambiar la contraseña del usuario administrativo inicial después del primer acceso en producción.
- Validar el ambiente de producción después de cada despliegue en Render.

---

## Estado general del backend

El backend cuenta actualmente con módulos base para gestión institucional, autenticación, permisos por rol, permisos por pertenencia, asistencia individual y masiva, reportes, roles nuevos, directivo, psicorientador y dashboard institucional editable.

La prioridad técnica siguiente es estabilizar documentación, Postman, permisos de `DIRECTIVO`, carga masiva, recuperación de contraseña y módulo de psicoorientación.
