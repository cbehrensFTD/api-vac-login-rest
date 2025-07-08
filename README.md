# Farmatodo Portal Vacaciones API

API REST desarrollada en **TypeScript** sobre **Express.js** que habilita la gestión de solicitudes de vacaciones para los colaboradores de **Farmatodo**. Provee autenticación, validación de políticas y notificaciones por correo, integrándose con bases de datos **Oracle** y servicios de **Firebase**.

---

## Tabla de Contenido
1. [Características](#características)
2. [Arquitectura y Módulos](#arquitectura-y-módulos)
3. [Requisitos Previos](#requisitos-previos)
4. [Instalación](#instalación)
5. [Variables de Entorno](#variables-de-entorno)
6. [Scripts NPM](#scripts-npm)
7. [Modo Desarrollo](#modo-desarrollo)
8. [Build & Deploy](#build--deploy)
9. [Endpoints Principales](#endpoints-principales)
---

## Características
- API RESTful con **Express 4** y validaciones con **Zod**.
- Written 100 % in **TypeScript** (tipado estricto, `ts-node` en dev, `tsc` para producción).
- **JWT** para autenticación y manejo de sesiones.
- Conexión **Oracle** (driver oficial) para persistencia de datos.
- **Firebase Admin** para envío de notificaciones push / correos a empleados.
- Arquitectura en capas: *Routes → Controllers → Services → Repositories* (Drivers) para un código desacoplado y testeable.
- Soporte para variables de entorno por ambiente (`.env.dev`, `.env.stg`, `.env.prod`).
- Preparado para integración con **Docker** / **CI-CD**.

## Arquitectura y Módulos
```
api-vac-login-rest
│
├── src/
   ├── index.ts               # Punto de entrada, bootstrap del servidor Express
   ├── config/                # Configuración externa
   │   ├── oracle.ts          # Pool Oracle
   │   └── firebase.ts        # Firebase Admin SDK
   ├── controllers/           # Lógica HTTP (traducen request ⇄ service)
   │   └── auth.controller.ts # Endpoints de autenticación
   ├── services/              # Reglas de negocio↕︎integraciones externas
   │   ├── auth.service.ts    # Validaciones de usuarios
   │   └── email.service.ts   # Envío de correos vía nodemailer
   ├── routes/                # Definición de rutas Express
   │   └── auth.route.ts
   ├── middleware/            # Middlewares reutilizables
   │   └── validateResource.middleware.ts
   └── schemas/               # Validaciones y tipados con Zod
       └── auth.schema.ts

```

### Flujo de petición
1. **Route** determina el path y aplica middlewares de validación.
2. **Controller** recibe la petición, extrae parámetros y delega al service.
3. **Service** implementa la lógica de negocio, accediendo a BD u otros servicios.
4. Respuesta estándar JSON enviada al cliente (status, data, message).

## Requisitos Previos
- **Node.js ≥ 20** y **npm ≥ 10**
- **Oracle Client / InstantClient** accesible en la máquina (o Docker network)
- Cuenta de **Firebase** con credenciales de servicio (archivo `*.json`).
- (Opcional) **Docker** 20+ para contenedorización

## Instalación
```bash
# 1. Instalar dependencias
$ npm install

# 2. Copiar variables de entorno
Se le pide al admnistrador del proyecto que le envíe las variables de entorno
```

## Variables de Entorno
| Variable | Descripción |
|----------|-------------|
| `PORT` | Puerto donde se levantará Express (por defecto 3000) |
| `JWT_SECRET` | Llave secreta para firmar tokens JWT |
| `ORACLE_USER` / `ORACLE_PASSWORD` / `ORACLE_CONNECTION_STRING` | Credenciales Oracle |
| `NODEMAILER_USER` / `NODEMAILER_PASS` | SMTP para notificaciones |

> Crea un archivo `.env.dev` (dev), `.env.stg` (staging) o `.env.prod` (prod) con las variables anteriores.

## Scripts NPM
| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia servidor en modo *watch* con **nodemon** y **ts-node** |
| `npm run build` | Compila TypeScript a JavaScript (directorio `dist/`) |
| `npm start` | Ejecuta la versión compilada (`dist/index.js`) |

## Modo Desarrollo
```bash
# lanzó nodemon + ts-node
$ npm run dev

# servidor vivo en: http://localhost:3000
```
Cada cambio en `src/**` se refleja en caliente.

## Build & Deploy
```bash
# Generar artefacto de producción
$ npm run build

# Ejecutar
$ npm start
```


## Endpoints Principales
Rutas prefijadas con `/api/v1/auth`:
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/verify-token` | Valida el JWT y devuelve la información de sesión |
| POST | `/generate-otp` | Genera un OTP y lo envía al usuario |
| POST | `/verify-otp` | Verifica el OTP enviado por el usuario |
