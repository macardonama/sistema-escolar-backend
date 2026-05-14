# Sistema Escolar Backend

Backend para sistema escolar institucional construido con **Node.js**, **Express**, **PostgreSQL** y **Prisma**.

El sistema permite gestionar usuarios, roles, grupos, docentes, estudiantes, acudientes, asistencia, observaciones y reportes básicos.

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

## Variables de entorno

Crear un archivo `.env` en la raíz del proyecto con la siguiente estructura:

```env
DATABASE_URL="postgresql://postgres:TU_CONTRASEÑA@localhost:5432/sistema_escolar?schema=public"
PORT=3000
JWT_SECRET="clave_super_secreta_sistema_escolar"
```

> Importante: el archivo `.env` no debe subirse a GitHub. Debe estar incluido en `.gitignore`.

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

## Prisma

### Generar Prisma Client

```bash
npx prisma generate
```

### Ejecutar migraciones

```bash
npx prisma migrate dev --name init
```

### Abrir Prisma Studio

```bash
npx prisma studio
```

---

# Endpoints

La URL base local es:

```txt
http://localhost:3000
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

> Si se envía `usuarioId`, el usuario asociado debe tener rol `ESTUDIANTE`.

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

Body:

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
  "nombre": "Acudiente Prueba",
  "telefono": "3005551234",
  "correo": "acudiente@test.com",
  "usuarioId": 4
}
```

> Si se envía `usuarioId`, el usuario asociado debe tener rol `ACUDIENTE`.

### Listar acudientes

```http
GET /api/acudientes
```

Roles permitidos:

```txt
ADMINISTRATIVO
DOCENTE
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

### Consultar asistencia por ID

```http
GET /api/asistencias/:id
```

Roles permitidos:

```txt
ADMINISTRATIVO
DOCENTE
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

Body ejemplo:

```json
{
  "estado": "PRESENTE",
  "emocion": "🙂",
  "observacion": "Llegó tarde, pero participó en clase"
}
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

Body ejemplo:

```json
{
  "tipo": "INDIVIDUAL",
  "descripcion": "Observación actualizada",
  "enviarAcudiente": true
}
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

1. Crear usuario administrativo.
2. Iniciar sesión y copiar token.
3. Crear usuario docente.
4. Crear docente asociado al usuario docente.
5. Crear grupo.
6. Crear estudiante asociado al grupo.
7. Crear acudiente.
8. Asociar estudiante con acudiente.
9. Registrar asistencia.
10. Registrar observación general.
11. Registrar observación individual.
12. Consultar reportes básicos.

---

## Comandos Git sugeridos

### Guardar cambios en rama de reportes

```bash
git status
git add .
git commit -m "Agregar modulo de reportes basicos"
git push -u origin feature/reportes-basicos
```

### Fusionar después de probar

```bash
git checkout main
git pull origin main
git merge feature/reportes-basicos
git push origin main
```

---

## Pendientes sugeridos

- Crear colección organizada en Postman.
- Agregar validaciones más robustas.
- Restringir acceso real por usuario, no solo por rol.
- Permitir que el docente vea únicamente sus grupos.
- Permitir que el acudiente vea únicamente sus acudidos.
- Permitir que el estudiante vea únicamente su información.
- Crear seeds de datos iniciales.
- Agregar pruebas automatizadas.
- Preparar despliegue en Render o Railway.
- Construir frontend en Angular.
