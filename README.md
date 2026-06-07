# Sistema Escolar Backend

Backend para sistema escolar institucional construido con **Node.js**, **Express**, **PostgreSQL** y **Prisma**.

El sistema permite gestionar usuarios, roles, grupos, docentes, estudiantes, acudientes, áreas académicas, asignaciones académicas, asistencia, observaciones y reportes básicos.

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
│   └── reportes/
├── app.js
└── server.js
```

---

## Roles del sistema

El sistema maneja cuatro roles principales:

```txt
ADMINISTRATIVO
DOCENTE
ESTUDIANTE
ACUDIENTE
```

### ADMINISTRATIVO

Puede gestionar usuarios, grupos, docentes, estudiantes, acudientes, relaciones, asistencia, observaciones y reportes.

### DOCENTE

Puede consultar grupos, estudiantes, acudientes, registrar asistencias, registrar observaciones y consultar reportes.

### ESTUDIANTE

Puede consultar información propia en rutas habilitadas.

### ACUDIENTE

Puede consultar información asociada a sus acudidos en rutas habilitadas.

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
npx prisma migrate dev --name init
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
DOCENTE
ESTUDIANTE
ACUDIENTE
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
Respuesta esperada:

{
  "mensaje": "Usuario activado correctamente",
  "usuario": {
    "id": 3,
    "nombre": "Agujetas",
    "correo": "agujetas@test.com",
    "rol": "ESTUDIANTE",
    "activo": true
  }
}


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
DOCENTE
```

### Consultar grupo por ID

```http
GET /api/grupos/:id
```

Roles permitidos:

```txt
ADMINISTRATIVO
DOCENTE
```

### Actualizar grupo

```http
PUT /api/grupos/:id
```

Roles permitidos:

```txt
ADMINISTRATIVO
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
DOCENTE
```

### Consultar docente por ID

```http
GET /api/docentes/:id
```

Roles permitidos:

```txt
ADMINISTRATIVO
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

Body sin usuario asociado:

```json
{
  "nombre": "Estudiante Prueba",
  "documento": "100000001",
  "grupoId": 1
}
```

Body con usuario asociado:

```json
{
  "nombre": "Estudiante Prueba",
  "documento": "100000001",
  "grupoId": 1,
  "usuarioId": 3
}
```

> Si se envía `usuarioId`, el usuario asociado debe tener rol `ESTUDIANTE`. Si no se envía `nombre`, el backend lo toma automáticamente desde el usuario asociado.

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
  "nombre": "Estudiante Actualizado",
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

Body sin usuario asociado:

```json
{
  "nombre": "Acudiente Prueba",
  "telefono": "3005551234",
  "correo": "acudiente@test.com"
}
```

Body con usuario asociado:

```json
{
  "telefono": "3005551234",
  "usuarioId": 4
}
```

> Si se envía `usuarioId`, el usuario asociado debe tener rol `ACUDIENTE`. Si no se envían `nombre` ni `correo`, el backend los toma automáticamente desde el usuario asociado.

### Listar acudientes

```http
GET /api/acudientes
```

Roles permitidos:

```txt
ADMINISTRATIVO
DOCENTE
```

La respuesta incluye el usuario asociado y las relaciones con estudiantes:

```json
{
  "id": 1,
  "nombre": "Acudiente Prueba",
  "correo": "acudiente@test.com",
  "telefono": "3005551234",
  "usuario": {
    "id": 4,
    "nombre": "Acudiente Prueba",
    "correo": "acudiente@test.com",
    "rol": "ACUDIENTE",
    "activo": true
  },
  "estudiantes": [
    {
      "estudianteId": 1,
      "parentesco": "Madre",
      "estudiante": {
        "id": 1,
        "nombre": "Estudiante Prueba",
        "grupo": {
          "id": 1,
          "nombre": "6-1"
        }
      }
    }
  ]
}
```

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
  "nombre": "Acudiente Actualizado",
  "telefono": "3115557788",
  "correo": "nuevoacudiente@test.com"
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

> Un acudiente puede estar asociado a varios estudiantes. La relación se almacena mediante `EstudianteAcudiente`.


## Áreas

El módulo de áreas permite registrar las asignaturas o áreas académicas que se imparten en la institución, por ejemplo: Matemáticas, Ciencias Naturales, Religión, Educación Física, entre otras.

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
Esto permite saber qué docente dicta determinada área a un grupo específico.

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
DOCENTE
```

Filtros disponibles:

```txt
docenteId
grupoId
areaId
activo
```

Ejemplos:

```http
GET /api/asignaciones-academicas?docenteId=20
```

```http
GET /api/asignaciones-academicas?grupoId=1
```

```http
GET /api/asignaciones-academicas?areaId=1
```

```http
GET /api/asignaciones-academicas?activo=true
```

### Consultar asignación académica por ID

```http
GET /api/asignaciones-academicas/:id
```

Roles permitidos:

```txt
ADMINISTRATIVO
DOCENTE
```

### Listar asignaciones por docente

```http
GET /api/asignaciones-academicas/docente/:docenteId
```

Roles permitidos:

```txt
ADMINISTRATIVO
DOCENTE
```

Ejemplo:

```http
GET /api/asignaciones-academicas/docente/20
```

### Actualizar asignación académica

```http
PUT /api/asignaciones-academicas/:id
```

Roles permitidos:

```txt
ADMINISTRATIVO
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

Body con fecha:

```json
{
  "estudianteId": 1,
  "docenteId": 1,
  "grupoId": 1,
  "fecha": "2026-05-14",
  "estado": "AUSENTE",
  "observacion": "No asistió a clase"
}
```

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

Ejemplos:

```http
GET /api/asistencias?grupoId=1
```

```http
GET /api/asistencias?fechaInicio=2026-05-01&fechaFin=2026-05-31
```

```http
GET /api/asistencias?estudianteId=1
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

> La consulta por ID también valida pertenencia. Si el registro pertenece a un estudiante no permitido para el usuario autenticado, responde `403 Forbidden`.

### Actualizar asistencia

```http
PUT /api/asistencias/:id
```

Roles permitidos:

```txt
ADMINISTRATIVO
DOCENTE
```

Body ejemplo:

```json
{
  "estado": "PRESENTE",
  "emocion": "🙂",
  "observacion": "Llegó tarde, pero participó en clase"
}
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

Respuesta esperada:

```json
{
  "mensaje": "Asistencias masivas registradas correctamente",
  "resultado": {
    "total": 2,
    "creadas": 2,
    "actualizadas": 0
  }
}
```

Respuesta cuando un estudiante no pertenece al grupo de la asignación:

```json
{
  "mensaje": "Los siguientes estudiantes no pertenecen al grupo de la asignación académica: Nombre Estudiante (ID: 1)"
}
```


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

Ejemplos:

```http
GET /api/observaciones?estudianteId=1
```

```http
GET /api/observaciones?grupoId=1&tipo=GENERAL
```

Reglas por pertenencia:

- `ADMINISTRATIVO` puede consultar todas las observaciones.
- `DOCENTE` consulta observaciones de estudiantes de sus grupos dirigidos.
- `ESTUDIANTE` consulta únicamente sus propias observaciones individuales.
- `ACUDIENTE` consulta únicamente observaciones individuales de sus estudiantes asociados.
- Las observaciones generales con `estudianteId: null` no se retornan a `ESTUDIANTE` ni `ACUDIENTE`.
- Si `ACUDIENTE` o `ESTUDIANTE` consultan un `estudianteId` no permitido, el backend responde `403 Forbidden`.
- Si `ACUDIENTE` consulta sin `estudianteId`, el backend filtra automáticamente por sus acudidos.

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

> La consulta por ID valida pertenencia. Si la observación es general (`estudianteId: null`), solo `ADMINISTRATIVO` puede consultarla por ID. Si pertenece a un estudiante no permitido para el usuario autenticado, responde `403 Forbidden`.

### Actualizar observación

```http
PUT /api/observaciones/:id
```

Roles permitidos:

```txt
ADMINISTRATIVO
DOCENTE
```

Body ejemplo:

```json
{
  "tipo": "INDIVIDUAL",
  "descripcion": "Observación actualizada",
  "enviarAcudiente": true
}
```

## Reportes básicos

### Reporte de asistencia por grupo

```http
GET /api/reportes/asistencia/grupo/:grupoId
```

Roles permitidos:

```txt
ADMINISTRATIVO
DOCENTE
```

Query params opcionales:

```txt
fechaInicio
fechaFin
```

Ejemplo:

```http
GET /api/reportes/asistencia/grupo/1?fechaInicio=2026-05-01&fechaFin=2026-05-31
```

### Reporte de asistencia por estudiante

```http
GET /api/reportes/asistencia/estudiante/:estudianteId
```

Roles permitidos:

```txt
ADMINISTRATIVO
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
DOCENTE
```

Query params opcionales:

```txt
fechaInicio
fechaFin
```

---

## Flujo recomendado de prueba

1. Ejecutar migraciones.
2. Ejecutar seed inicial para crear usuario administrativo.
3. Iniciar sesión y copiar token.
4. Crear usuario docente.
5. Crear docente asociado al usuario docente.
6. Crear grupo.
7. Crear estudiante asociado al grupo.
8. Crear acudiente.
9. Asociar estudiante con acudiente.
10. Crear área académica.
11. Crear asignación académica asociando docente, grupo y área.
12. Registrar asistencia individual.
13. Registrar asistencias masivas por asignación académica.
14. Registrar observación general.
15. Registrar observación individual.
16. Consultar reportes básicos.
17. Probar permisos por pertenencia con usuarios `ESTUDIANTE` y `ACUDIENTE`.
18. Probar nuevamente usando la URL pública de Render.

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
## Colección de Postman

El proyecto cuenta con una colección de Postman organizada por módulos para probar los endpoints del backend.

La colección incluye carpetas para:

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
```

Variables recomendadas en Postman:

```txt
base_url
token
usuario_id
docente_id
grupo_id
estudiante_id
acudiente_id
area_id
asignacion_academica_id
asistencia_id
observacion_id
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


Requests nuevos recomendados:

```txt
Áreas / Crear área
POST {{base_url}}/api/areas

Áreas / Listar áreas
GET {{base_url}}/api/areas

Áreas / Consultar área por ID
GET {{base_url}}/api/areas/{{area_id}}

Áreas / Actualizar área
PUT {{base_url}}/api/areas/{{area_id}}

Asignaciones Académicas / Crear asignación académica
POST {{base_url}}/api/asignaciones-academicas

Asignaciones Académicas / Listar asignaciones académicas
GET {{base_url}}/api/asignaciones-academicas

Asignaciones Académicas / Consultar asignación académica por ID
GET {{base_url}}/api/asignaciones-academicas/{{asignacion_academica_id}}

Asignaciones Académicas / Listar asignaciones por docente
GET {{base_url}}/api/asignaciones-academicas/docente/{{docente_id}}

Asignaciones Académicas / Actualizar asignación académica
PUT {{base_url}}/api/asignaciones-academicas/{{asignacion_academica_id}}

Asistencias / Registrar asistencias masivas
POST {{base_url}}/api/asistencias/masiva
```

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

## Pendientes sugeridos

- Mantener actualizada la colección de Postman cuando se agreguen nuevos endpoints o filtros.
- Compartir la colección de Postman directamente con el equipo frontend.
- Probar nuevamente los permisos por rol después de cada cambio sensible.
- Mejorar mensajes de error para duplicados y restricciones de Prisma.
- Crear módulo de catálogos para roles, estados de asistencia y tipos de observación.
- Revisar reportes grupales con filtros por fecha.
- Actualizar README y Postman después de cada historia cerrada.
- Migrar y ordenar el backend dentro del repositorio `ppda-platform/backend` cuando el frontend esté listo.
- Cambiar la contraseña del usuario administrativo inicial después del primer acceso en producción.
- Validar el ambiente de producción después de cada despliegue en Render.
- Agregar pruebas automatizadas.
