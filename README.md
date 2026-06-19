# 🫶 Donaton — Backend

Plataforma digital de coordinación humanitaria. Este repositorio corresponde al **Backend** del sistema Donaton, construido con Next.js (API Routes) + Prisma ORM + MySQL.

---

## ⚠️ Requisito previo importante

Este proyecto funciona como la API que consume el frontend. Para tener el sistema completo funcionando, **debes clonar también el repositorio del frontend**.

**Se recomienda trabajar ambos proyectos dentro de una misma carpeta raíz**, por ejemplo `donaton/`:

```
donaton/
├── backend-donaton/     ← este repositorio
└── front-donaton/       ← repositorio del frontend (clonar también)
```

---

## 🧰 Requisitos del sistema

| Herramienta | Versión mínima | Descarga |
|-------------|---------------|----------|
| Node.js | 20.x o superior | https://nodejs.org |
| npm | 10.x o superior (viene con Node) | — |
| Git | 2.x o superior | https://git-scm.com |
| Docker Desktop | 4.x o superior | https://www.docker.com/products/docker-desktop |
| Navegador | Chrome 120+ / Firefox 121+ / Edge 120+ | — |

> **Nota importante:** Docker Desktop debe estar **abierto y corriendo** antes de ejecutar cualquier comando de Docker. Puedes verificarlo con `docker ps` en la terminal — si responde sin error, está activo.

---

## 📦 Instalación y configuración

### Paso 1 — Crear la carpeta raíz y clonar ambos repositorios

```bash
# Crear carpeta raíz del proyecto
mkdir donaton
cd donaton

# Clonar el backend (este repositorio)
git clone https://github.com/ric-diazs/backend-donaton.git

# Clonar el frontend (RECOMENDADO para tener el sistema completo)
git clone https://github.com/rem-garcia/front-donaton.git
```

Al terminar, tu estructura debe verse así:

```
donaton/
├── backend-donaton/
└── front-donaton/
```

### Paso 2 — Instalar dependencias del backend

```bash
cd backend-donaton
npm install
```

### Paso 3 — Levantar la base de datos con Docker

El backend requiere una base de datos MySQL corriendo. Levántala con Docker:

```bash
# Desde la carpeta backend-donaton/
docker compose up
```

El comando `docker compose up` se ejecutará en "attach mode". Es recomendado hacer esto, porque permite hacer un seguimiento para confirmar que el motor de MySQL está levantado o todavía no ha terminado ese proceso. Cuando este finalice, presiona la tecla "d" para entrar en "detach mode" y así poder seguir interactuando con la consola.

Al estar en "detach mode", puedes verificar que el contenedor `db_mysql` esta corriendo con el comando:

```bash
docker ps
```

Debes ver `db_mysql` con estado `Up`.

### Paso 4 — Variables de entorno

Las variables de entorno usadas en este proyecto se encuentran en el archivo `.env` ubicado en `backend-donaton/`. Esa información es solo para ejecutar localmente el backend de esta plataforma. Si se usan credenciales para ejecutar en producción, este archivo y su información no deben ser compartidos públicamente como se hace acá.


### Paso 5 — Ejecutar las migraciones de la base de datos

```bash
npx prisma migrate dev --name init
```

Esto crea todas las tablas del sistema en MySQL. Al finalizar verás:

```
Your database is now in sync with your schema.
✔ Generated Prisma Client
```

Verifica que las tablas se crearon:

```bash
docker exec -it db_mysql mysql -u donaton -p -e "USE donaton_db; SHOW TABLES;"
```

Cuando solicite la contraseña, ingresa: Duocuc2026

Debes ver las 8 tablas: `Asignacion`, `CentroAcopio`, `Comuna`, `Donacion`, `Donante`, `Necesidad`, `Region`, `Usuario`.

### Paso 6 — Levantar el backend

```bash
npm run dev
```

El backend estará disponible en:

```
http://localhost:3000
```

---

## 🗂️ Estructura del proyecto

```
backend-donaton/
├── app/
│   └── api/
│       └── donaciones/
│           ├── route.ts          # GET /api/donaciones, POST /api/donaciones
│           └── [id]/
│               └── route.ts      # PATCH /api/donaciones/:id
├── src/
│   ├── lib/
│   │   └── prisma.ts             # Cliente Prisma (singleton)
│   ├── repository/
│   │   ├── donacion.repository.ts
│   │   └── necesidad.repository.ts
│   └── service/
│       └── donacion.service.ts   # Lógica de negocio y transiciones de estado
├── prisma/
│   ├── schema.prisma             # Modelo de datos (8 tablas)
│   └── migrations/               # Historial de migraciones
├── middleware.ts                 # CORS para frontend en localhost:5173
├── docker-compose.yml            # MySQL en Docker para desarrollo
└── .env                          # Variables de entorno (crear manualmente)
```

---

## 🔌 Endpoints disponibles

### Donaciones

| Método | Ruta | Descripción | Actor |
|--------|------|-------------|-------|
| `GET` | `/api/donaciones` | Lista todas las donaciones | Coordinador |
| `POST` | `/api/donaciones` | Registra una nueva donación | Donante |
| `PATCH` | `/api/donaciones/:id` | Cambia el estado de una donación | Coordinador |
| `GET` | `/api/necesidades` | Lista todas las necesidades | Voluntario |
| `POST` | `/api/necesidades` | Registra una nueva necesidad | Voluntario |
| `GET` | `/api/usuarios` | Lista todos los usuarios |  |
| `GET` | `/api/usuarios/:id` | Obtiene un usuario por su ID | |
| `POST` | `/api/usuarios` | Registra un nuevo usuario | |
| `DELETE` | `/api/usuarios` | Elimina un usuario por su ID | |

### Ejemplo — Crear una donación (POST)

```json
// Body
{
  "tipo": "Ropa",
  "cantidad": 50,
  "unidad": "unidades",
  "origen": "Campaña Las Condes",
  "donanteNombre": "Juan Pérez",
  "donanteCorreo": "juan@mail.com"
}

// Respuesta 201
{
  "id": 1,
  "tipo": "Ropa",
  "cantidad": 50,
  "estado": "PENDIENTE",
  "ot": null,
  "fecha": "2026-06-19T..."
}
```

### Ejemplo — Cambiar estado (PATCH)

```json
// PATCH /api/donaciones/1
// Body
{ "nuevoEstado": "RECIBIDA" }

// Respuesta 200
{
  "id": 1,
  "estado": "RECIBIDA",
  "ot": "OT-2026-0001"
}
```

### Transiciones de estado válidas

```
PENDIENTE → RECIBIDA    (genera OT automáticamente)
RECIBIDA  → DISPONIBLE
DISPONIBLE → ASIGNADA   (requiere necesidadId en el body)
ASIGNADA  → EN_TRANSITO
EN_TRANSITO → ENTREGADA
```

---

## 🧱 Arquitectura por capas

```
route.ts (Controller)
    ↓  recibe petición HTTP, delega al service
donacion.service.ts (Service)
    ↓  lógica de negocio, validación de transiciones, generación de OT
donacion.repository.ts (Repository)
    ↓  acceso a datos vía Prisma ORM
MySQL (Base de datos)
```

---

## 🗄️ Modelo de datos

El schema de Prisma define 8 tablas:

| Tabla | Descripción |
|-------|-------------|
| `Usuario` | Usuarios internos (Admin, Coordinador, Voluntario) |
| `Donante` | Personas o empresas que realizan donaciones |
| `Donacion` | Registro central del ciclo de vida de cada donación |
| `Necesidad` | Necesidades reportadas por comunidades afectadas |
| `Asignacion` | Vinculación entre donación y necesidad |
| `CentroAcopio` | Centros físicos de recepción y distribución |
| `Region` | Regiones de Chile |
| `Comuna` | Comunas vinculadas a cada región |

---

## 🛠️ Scripts disponibles

```bash
npm run dev       # Levanta el servidor en localhost:3000
npm run build     # Build de producción
npm run start     # Inicia el servidor en modo producción

npx prisma migrate dev    # Aplica migraciones pendientes
npx prisma migrate reset  # Resetea la base de datos (⚠️ borra datos)
npx prisma studio         # Interfaz visual de la base de datos
```

---

## 🐳 Comandos útiles de Docker

```bash
# Levantar MySQL
docker compose up -d

# Detener MySQL: Presionar la tecla "d" y luego ejecutar
docker compose down db-mysql

# Ver contenedores activos
docker ps

# Ver las tablas en la base de datos
docker exec -it db_mysql mysql -u donaton -p -e "USE donaton_db; SHOW TABLES;"

# Ver donaciones guardadas
docker exec -it db_mysql mysql -u donaton -p -e "USE donaton_db; SELECT id, tipo, cantidad, estado, ot FROM Donacion;"
```

---

## ⚠️ Notas importantes

- La versión de Prisma usada es la **6.x** (no la 7). Si al instalar aparece Prisma 7, ejecuta: `npm install -D prisma@6 && npm install @prisma/client@6`
- El archivo `.env` **no se sube a Git**. Acá se hace para facilitar revisión del backend, pero es buena práctica que cada integrante del equipo lo cree manualmente y lo mantenga en su dispositivo local, sin compartirlo.
- Si Docker Desktop se reinicia, el contenedor de MySQL puede detenerse. Vuélvelo a levantar con `docker compose up`.
- El CORS está configurado para aceptar peticiones desde `http://localhost:5173` (el frontend en desarrollo). Si el frontend corre en otro puerto, ajusta el `middleware.ts`.

---

## 🔗 Repositorio relacionado

| Repositorio | Descripción |
|-------------|-------------|
| [front-donaton](https://github.com/rem-garcia/front-donaton) | Frontend React + Vite — Interfaz de usuario |

---

## 🏫 Contexto académico

Proyecto desarrollado para la asignatura **GPY1101 — Evaluación de Proyectos de Software**, DuocUC, 2026.

**Equipo:**
- Remi García ([@rem-garcia](https://github.com/rem-garcia))
- Ricardo Díaz ([@ric-diazs](https://github.com/ric-diazs))
