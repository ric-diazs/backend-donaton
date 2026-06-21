# Donaton — Backend

Repositorio del backend del sistema Donaton, construido con Next.js, Prisma ORM y MySQL.
Expone una API REST con endpoints para la gestion de donaciones, necesidades y usuarios.

---

## Requisito previo importante

Este proyecto requiere que el frontend tambien este presente en tu maquina
para tener el sistema completo funcionando.

Se recomienda trabajar ambos proyectos dentro de una misma carpeta raiz llamada `donaton/`:

```
donaton/
├── backend-donaton/      <- este proyecto
└── front-donaton/        <- debe estar presente para el sistema completo
```

---

## Herramientas requeridas

| Herramienta    | Version minima | Descarga                                          |
|----------------|----------------|---------------------------------------------------|
| Node.js        | 20.x           | https://nodejs.org                                |
| npm            | 10.x           | Incluido con Node.js                              |
| Git            | 2.x            | https://git-scm.com                               |
| Docker Desktop | 4.x            | https://www.docker.com/products/docker-desktop    |
| Navegador      | Chrome 120+ / Firefox 121+ / Edge 120+            |

Docker Desktop debe estar abierto y corriendo antes de ejecutar cualquier
comando de Docker. Para verificarlo:

```bash
docker ps
```

Si responde con la tabla de encabezados sin errores, Docker esta activo.

---

## Instalacion

### Paso 1 — Instalar dependencias

```bash
cd backend-donaton
npm install
```

### Paso 2 — Levantar la base de datos MySQL con Docker

La base de datos corre en un contenedor Docker. Debe levantarse antes del backend.

```bash
docker compose -f docker-compose.dev.yml up -d
```

Verifica que el contenedor este corriendo:

```bash
docker ps
```

Debes ver el contenedor `donaton_db_dev` con estado `Up` en el puerto `3306`.

### Paso 3 — Crear el archivo de variables de entorno

Crea un archivo `.env` en la raiz de la carpeta `backend-donaton/` con el siguiente contenido:

```env
DATABASE_URL="mysql://root:root2025@localhost:3306/donaton_db"
SHADOW_DATABASE_URL="mysql://root:root2025@localhost:3306/shadow_donaton_db"
DATABASE_USER="root"
DATABASE_PASSWORD="root2025"
DATABASE_NAME="donaton_db"
DATABASE_HOST="localhost"
DATABASE_PORT=3306
ROOT_PASSWORD="root2025"
```

Este archivo no esta incluido en el proyecto por seguridad y debe crearse manualmente.

### Paso 4 — Generar el cliente de Prisma

```bash
npx prisma generate
```

### Paso 5 — Ejecutar las migraciones

```bash
npx prisma migrate dev
```

Esto crea las 8 tablas del sistema en la base de datos MySQL.
Al finalizar debe aparecer el mensaje:

```
Your database is now in sync with your schema.
```

Para verificar que las tablas se crearon correctamente:

```bash
docker exec -it donaton_db_dev mysql -uroot -proot2025 -e "USE donaton_db; SHOW TABLES;"
```

Deben aparecer: Asignacion, CentroAcopio, Comuna, Donacion, Donante, Necesidad, Region, Usuario.

### Paso 6 — Levantar el servidor del backend

```bash
npm run dev
```

El backend estara disponible en:

```
http://localhost:3000
```

Para verificar que los endpoints responden, abre en el navegador:

```
http://localhost:3000/api/donaciones
http://localhost:3000/api/necesidades
http://localhost:3000/api/usuarios
```

---

## Endpoints disponibles

| Metodo | Ruta                      | Descripcion                                |
|--------|---------------------------|--------------------------------------------|
| GET    | /api/donaciones           | Lista todas las donaciones                 |
| POST   | /api/donaciones           | Registra una nueva donacion                |
| PATCH  | /api/donaciones/:id       | Cambia el estado de una donacion           |
| GET    | /api/necesidades          | Lista todas las necesidades                |
| POST   | /api/necesidades          | Registra una nueva necesidad               |
| PATCH  | /api/necesidades/:id      | Actualiza una necesidad                    |
| GET    | /api/usuarios             | Lista todos los usuarios internos          |
| POST   | /api/usuarios             | Crea un nuevo usuario interno              |
| GET    | /api/usuarios/:id         | Obtiene un usuario por ID                  |
| PATCH  | /api/usuarios/:id         | Actualiza un usuario                       |
| DELETE | /api/usuarios/:id         | Elimina un usuario                         |

---

## Ciclo de estados de una donacion

Las transiciones de estado son validadas por el backend. No se pueden saltar pasos.

```
PENDIENTE  ->  RECIBIDA  (genera codigo OT automaticamente)
RECIBIDA   ->  DISPONIBLE
DISPONIBLE ->  ASIGNADA  (requiere necesidadId en el body)
ASIGNADA   ->  EN_TRANSITO
EN_TRANSITO -> ENTREGADA
```

---

## Comandos utiles durante el desarrollo

Ver las donaciones registradas en la base de datos:

```bash
docker exec -it donaton_db_dev mysql -uroot -proot2025 -e "USE donaton_db; SELECT id, tipo, cantidad, estado, ot FROM Donacion;"
```

Ver donaciones con datos del donante:

```bash
docker exec -it donaton_db_dev mysql -uroot -proot2025 -e "USE donaton_db; SELECT d.id, d.tipo, d.estado, d.ot, don.nombre FROM Donacion d LEFT JOIN Donante don ON d.donanteId = don.id;"
```

Abrir la interfaz visual de Prisma para explorar la base de datos:

```bash
npx prisma studio
```

Detener el contenedor de MySQL:

```bash
docker compose -f docker-compose.dev.yml down
```

Resetear la base de datos (elimina todos los datos y vuelve a migrar):

```bash
npx prisma migrate reset
```

---

## Notas importantes

- El archivo `.env` no debe compartirse ni subirse a repositorios.
  Cada integrante del equipo debe crearlo manualmente con sus propias credenciales locales.

- Si el backend arranca en el puerto 3001 en vez del 3000, significa que otro proceso
  esta ocupando el puerto 3000. El mas comun es Grafana si esta corriendo como contenedor.
  Para liberarlo: `docker stop grafana`. Luego reinicia el backend.

- Si aparece el error `Authentication failed against database server`, verifica que
  las credenciales del `.env` coincidan con las del contenedor MySQL y reinicia
  el servidor con `Ctrl+C` y `npm run dev`.

- Si aparece el error `Cannot find module` relacionado con Prisma, ejecuta
  `npx prisma generate` para regenerar el cliente y reinicia el servidor.

- La version de Prisma utilizada es la 6. Si al instalar aparece Prisma 7,
  ejecuta: `npm install -D prisma@6 && npm install @prisma/client@6`.

---

## Stack tecnologico

| Tecnologia  | Version | Uso                                       |
|-------------|---------|-------------------------------------------|
| Next.js     | 16.x    | Framework para API Routes                 |
| TypeScript  | 5.x     | Tipado estatico                           |
| Prisma ORM  | 6.x     | Acceso a base de datos                    |
| MySQL       | 8.0     | Base de datos relacional                  |
| Docker      | 4.x     | Contenedor de la base de datos            |

---

## Arquitectura por capas

```
route.ts  (Controller)
    |
service.ts  (Logica de negocio y validacion de transiciones)
    |
repository.ts  (Acceso a datos via Prisma)
    |
MySQL  (Base de datos en Docker)
```

---

## Repositorio relacionado

| Proyecto      | Descripcion                              |
|---------------|------------------------------------------|
| front-donaton | Frontend React + Vite + Tailwind CSS     |

---

## Contexto academico

Proyecto desarrollado para la asignatura GPY1101 — Evaluacion de Proyectos de Software, DuocUC, 2026.

Equipo:
- Remi Garcia
- Ricardo Diaz

## Comentarios Adicionales

Aunque el archivo .env no se encuentra dentro del archivo gitignore se descarto para que el profesor pueda llegar y levantar el proyecto de manera local. Se entiende que en las buenas practicas esta no es la mas adecuada elaborar en entornos de produccion.
