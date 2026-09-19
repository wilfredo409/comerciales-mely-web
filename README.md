# Comerciales Mely — Sistema de Gestión (Web)

Aplicación web desarrollada con **React + Next.js** para la Etapa 2 (Desarrollo Base del Proyecto — Web) de la asignatura **Diseño y Programación de Software Multiplataforma (DPS941)**, Universidad Don Bosco, UDB Virtual. Ciclo II-2026. Equipo **R.E.F.E.S**.

Digitaliza la gestión de **inventario, ventas y facturación** de Comerciales Mely, un comercio de productos variados que actualmente maneja todo en Excel (ver Etapa 1 — Análisis y Planificación).

---

## 1. Requisitos previos

- Node.js 18.18 o superior (recomendado 20+)
- npm 9+

## 2. Instalación y ejecución local

```bash
# 1) Instalar dependencias
npm install

# 2) (Opcional) crear variables de entorno propias
cp .env.example .env.local
# Edita JWT_SECRET en .env.local con una cadena aleatoria propia.
# Si no lo haces, la app usa un valor de desarrollo por defecto y funciona igual.

# 3) Levantar en modo desarrollo
npm run dev
# Abre http://localhost:3000

# 4) Build de producción (el que usa Vercel)
npm run build
npm run start
```

No se requiere base de datos externa ni ninguna cuenta de servicio para correr el proyecto: el "backend propio" (ver sección 4) trae datos de ejemplo precargados.

## 3. Usuarios de prueba

| Rol            | Usuario      | Contraseña   |
|----------------|--------------|--------------|
| Administrador  | `admin`      | `admin123`   |
| Empleado       | `empleado`   | `empleado123`|
| Facturador     | `facturador` | `factura123` |

También puedes registrar una cuenta nueva desde `/registro` (el registro público solo permite los roles Empleado o Facturador; el rol Administrador únicamente se crea desde el módulo **Usuarios** por un administrador ya autenticado).

---

## 4. Arquitectura del proyecto

Separación en capas UI / lógica de negocio / datos, tal como se planteó en la Etapa 1:

```
pages/                  → Capa de presentación (rutas Next.js)
  api/                   → "Backend propio": API REST (auth, productos, movimientos, facturas, reportes, usuarios)
  login.js, registro.js, dashboard.js, inventario/, facturacion.js, reportes.js, usuarios.js

components/             → Componentes de UI reutilizables (Layout, Sidebar, Modal, formularios, etc.)

context/                → Gestión de estado con Context API
  AuthContext.js          sesión activa, login/registro/logout
  InventarioContext.js    estado de productos compartido entre Inventario y Facturación,
                           con actualización dinámica tras cada operación (sin recargar la página)

services/               → Capa de lógica/cliente HTTP (llama a la API REST desde el navegador)

lib/
  db.js                  → Capa de datos: "backend propio" en memoria (usuarios, productos,
                           movimientos, facturas) con las reglas de negocio (descuento de stock,
                           cálculo de IVA/totales, validaciones)
  auth.js                → JWT + cookies httpOnly (sesión)
  authSSR.js              → protección de rutas en el servidor (getServerSideProps) por rol
  validators.js           → esquemas de validación de entradas (Zod)
```

### Nota importante sobre persistencia de datos

La capa de datos (`lib/db.js`) usa **almacenamiento en memoria** con datos semilla, para cumplir el
requisito de la Etapa 2 de "Integración con API REST (JSON Server, mock o backend propio)" sin
depender de servicios externos ni de configurar credenciales. Esto significa que **los datos se
reinician** si el servidor se reinicia (por ejemplo, en un *cold start* de una función serverless en
Vercel). Para una versión de producción real, la recomendación (ya prevista desde la Etapa 1) es
sustituir `lib/db.js` por Firebase Firestore u otra base de datos persistente — el resto de la
aplicación (rutas API, contexts, servicios, páginas) no necesitaría cambiar, porque toda la
aplicación accede a los datos únicamente a través de las funciones exportadas por ese módulo.

---

## 5. Cómo se cumple cada criterio de evaluación de la Etapa 2

### 1. Implementación de requerimientos funcionales
- **Módulo de autenticación**: registro (`/registro`), login (`/login`), rutas protegidas por rol vía `getServerSideProps` + `requireAuthSSR`.
- **Módulo de gestión principal (CRUD)**: Inventario — crear, listar, actualizar y eliminar productos (`/inventario`).
- **Módulo de lógica de negocio central**: Facturación (`/facturacion`) — arma la venta, calcula subtotal/IVA/total, **descuenta el stock del inventario de forma atómica** y genera un comprobante numerado.
- **Dashboard**: KPIs (productos activos, stock bajo, ventas de hoy, facturas emitidas), gráfica de ventas de los últimos 7 días y alertas de stock bajo.
- **Actualización dinámica de datos**: los Context (`InventarioContext`) actualizan el estado en memoria inmediatamente después de cada operación (crear/editar/eliminar producto, registrar movimiento, generar factura), reflejando los cambios en la interfaz sin recargar la página.

### 2. Arquitectura, componentes y buenas prácticas
- Separación de capas: presentación (`pages`, `components`) → lógica de negocio (`context`, `services`) → datos (`lib/db.js`, `pages/api`).
- Gestión de estado global con **Context API** (`AuthContext`, `InventarioContext`).
- Componentes reutilizables (`Panel`, `Modal`, `Button`, `FormField`, formularios de dominio) y hooks personalizados (`useAuth`, `useInventario`).

### 3. Integración con API REST y manejo de datos
- API REST propia construida con **Next.js API Routes** (`pages/api/**`), consumida desde el cliente vía `fetch` (capa `services/`).
- Manejo de estados de carga y error en cada página (`cargando`, `error`, componentes `Alert`/`EmptyState`).
- Validación de entradas con **Zod** tanto en el cliente como en el servidor, y manejo estructurado de errores HTTP (400/401/403/404/405).

### 4. Despliegue y trabajo colaborativo en GitHub
- Ver la sección 6 de este README para el flujo de trabajo recomendado en GitHub y el despliegue en Vercel.

---

## 6. Flujo recomendado para GitHub y Vercel (equipo R.E.F.E.S)

1. Crear el repositorio en GitHub y subir este proyecto a la rama `main`.
2. Cada integrante crea su propia rama (`feature/nombre-modulo`) y la usa para sus commits — la guía exige que **todos los integrantes tengan rama y commits propios**.
3. Agregar a todos los integrantes como colaboradores del repositorio.
4. Abrir un Pull Request de cada rama hacia `main` antes de la fecha de entrega, con una descripción breve de lo trabajado.
5. Conectar el repositorio a [Vercel](https://vercel.com) (Import Project → seleccionar el repo).
6. En la configuración del proyecto en Vercel, agregar la variable de entorno `JWT_SECRET` (cualquier cadena aleatoria y secreta).
7. Desplegar. Vercel detecta Next.js automáticamente (no requiere configuración adicional).
8. Agregar el enlace del despliegue y capturas de pantalla al README antes de la entrega final (recomendación del docente en el dictamen de la Etapa 1).

---

## 7. Próximos pasos (Etapa 3 — Móvil)

Según lo planteado en la Etapa 1, la Etapa 3 migrará la app a **React Native**, reutilizando la misma
lógica de negocio y sustituyendo `lib/db.js` por **Firebase** (Authentication, Firestore y Storage)
como base de datos persistente compartida entre la web y la app móvil.
