# 💊 Sistema POS Farmacia

Sistema de Punto de Venta (POS) para farmacias desarrollado con Angular y Node.js. Gestiona ventas de medicamentos, control de inventario, stock, productos farmacéuticos, devoluciones y contabilidad de manera eficiente y segura.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Ejecución](#-ejecución)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [API Endpoints](#-api-endpoints)

## ✨ Características

### Gestión de Ventas
- ✅ Registro de ventas con múltiples productos farmacéuticos
- 📊 Dashboard con estadísticas en tiempo real
- 💰 Seguimiento de ingresos y ganancias diarias/mensuales
- 📈 Comparación de ventas (día actual vs anterior, mes actual vs anterior)
- 🧾 Generación de recibos e impresión de facturas
- 🔄 Sistema de devoluciones de productos
- 📉 Control de stock en ventas (evita vender sin inventario)

### Gestión de Productos Farmacéuticos
- 📦 CRUD completo de productos/medicamentos
- 🖼️ Carga de imágenes para productos
- 🏷️ Categorización de productos (medicamentos, suplementos, cuidado personal, etc.)
- 💵 Control de precios y márgenes de ganancia
- 📊 **Control de Stock**: Gestión de inventario con alertas
- ⚠️ **Alertas de Stock**: Indicadores visuales (agotado, bajo, suficiente)
- ✅ Gestión de disponibilidad automática según stock
- 🔍 Validación de stock al agregar al carrito

### Gestión de Ventas y Carrito
- 🛒 Carrito de compras interactivo con validación de stock
- 🚚 Soporte para entregas a domicilio
- 💳 Múltiples métodos de pago (efectivo, tarjeta, transferencia)
- 🔢 **Entrada directa de cantidad**: Campo numérico modificable en el carrito
- 📦 **Visualización de stock disponible**: Indicador en productos y carrito
- ⚡ Cálculo automático de totales según cantidad ingresada
- 👤 Registro de información del cliente

### Devoluciones de Productos
- 🔙 **Sistema completo de devoluciones**
- 🔍 Búsqueda de ventas por cliente
- ✅ Selección de productos a devolver
- 🔢 Cantidad ajustable de devolución
- 💰 Cálculo automático de reembolso
- 📝 Registro de motivo de devolución
- ✔️ Validaciones de cantidad y datos

### Contabilidad y Reportes
- 💸 Registro de gastos y facturas con autoincremento
- 📊 Reportes de ventas con filtros avanzados
- 🔍 Búsqueda y ordenamiento de transacciones
- 📅 Filtrado por rango de fechas
- 📈 Análisis de ganancias y gastos
- 💼 Gestión de caja con historial de cierres

### Gestión de Categorías
- 🗂️ Organización de productos farmacéuticos por categorías
- ✏️ Activación/desactivación de categorías
- 🎨 Interfaz intuitiva y fácil de usar
- 📋 Categorías predefinidas y personalizables

### Gestión de Usuarios
- 👥 Sistema de roles (Admin y Colaborador)
- 🔐 Control de acceso y permisos
- 👤 Visualización de usuarios activos en dashboard
- ✏️ CRUD completo de usuarios

## 🛠️ Tecnologías

### Frontend
- **Angular 20** - Framework principal
- **Tailwind CSS 4** - Estilos y diseño responsivo
- **Angular Material** - Componentes UI
- **RxJS** - Programación reactiva
- **SweetAlert2** - Alertas y notificaciones
- **Font Awesome** - Iconos

### Backend
- **Node.js** - Entorno de ejecución
- **Express 5** - Framework web
- **TypeScript** - Tipado estático
- **PostgreSQL** - Base de datos
- **JWT** - Autenticación
- **Bcrypt** - Encriptación de contraseñas
- **Multer** - Manejo de archivos
- **CORS** - Control de acceso

## 📦 Requisitos Previos

- **Node.js** >= 18.x
- **npm** >= 9.x
- **PostgreSQL** >= 14.x
- **Angular CLI** >= 20.x

## 

> **Nota**: Este proyecto fue adaptado de un sistema POS para restaurantes a un sistema POS para farmacias.🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/Jesus-Gonzalez-Arroyo/POS_RESTAURANT.git
cd POS_RESTAURANT
```

### 2. Instalar dependencias del Backend

```bash
cd Backend
npm install
```

### 3. Instalar dependencias del Frontend

```bash
cd ../Frontend
npm install
```

## ⚙️ Configuración

### Backend

1. Crear archivo `.env` en la carpeta `Backend`:

```env
PORT=3000

# Opción 1: URL de conexión completa (Railway/Producción)
DATABASE_URL=postgresql://user:password@host:port/database

# Opción 2: Parámetros individuales (Desarrollo local)
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=tu_password
DB_NAME=pos_restaurafarmacia;
```

3. Ejecutar las migraciones necesarias:

```bash
cd Backend
npm run migrate 001_add_stock_to_products.sql
npm run migrate 002_modify_box_bills_id_to_bigserial.sql
```

Esto agregará:
- Campo `stock` (BIGINT) a la tabla `products` para control de inventario
- Autoincremento en columnas `id` de las tablas `box` y `bills
NODE_ENV=development
JWT_SECRET=tu_secret_key_super_segura
```

2. Crear la base de datos PostgreSQL:

```sql
CREATE DATABASE pos_restaurant;
```

### Frontend

El frontend se conecta al backend por defecto en `http://localhost:3000`. Si necesitas cambiar la URL, edita los servicios en `Frontend/src/app/core/services/`.

## 🎯 Ejecución

### Desarrollo

**Backend:**
```bash
cd Backend
npm run dev
```
El servidor estará disponible en `http://localhost:3000`

**Frontend:**
```bash
cd Frontend
npm start
```
La aplicación estará disponible en `http://localhost:4200`

### Docker (Backend)

**1. Construir la imagen Docker:**
```bash
cd Backend
docker build -t api_restaurant .
```

**2. Ejecutar el contenedor con archivo .env:**
```bash
docker run -d -p 3000:3000 --name restaurant-container --env-file .env api_restaurant
```

## 📁 Estructura del Proyecto

```
Pos_restaurant/
├── Backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── connectDB.ts         # Configuración de BD
│   │   ├── controllers/             # Controladores
│   │   ├── services/                # Lógica de negocio
│   │   ├── routes/                  # Rutas de la API
│   │   ├── middlewares/             # Middlewares
│   │   ├── interfaces/              # Tipos TypeScript
│   │   ├── utils/                   # Utilidades
│   │   ├── app.ts                   # Configuración Express
│   │   └── server.ts                # Punto de entrada
│   ├── scripts/                     # Scripts de migración
│   ├── .env.example                 # Ejemplo de variables de entorno
│   ├── package.json
│   └── tsconfig.json
│
├── Frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/
│   │   │   │   ├── guards/          # Guards de autenticación
│   │   │   │   ├── interceptors/    # Interceptores HTTP
│   │   │   │   ├── models/          # Interfaces
│   │   │   │   └── services/        # Servicios
│   │   │   ├── pages/               # Páginas/Componentes
│   │   │   │   ├── dashboard/
│   │   │   │   ├── products/
│   │   │   │   ├── sales/
│   │   │   │   ├── orders/
│   │   │   │   ├── accounting/
│   │   │   │   ├── bills/
│   │   │   │   └── settings/
│   │   │   ├── shared/              # Componentes compartidos
│   │   │   └── app.routes.ts        # Rutas
│   │   ├── assets/                  # Recursos estáticos
│   │   └── s/Medicamentos
- `GET /api/products` - Obtener todos los productos
- `GET /api/products/:id` - Obtener producto por ID
- `POST /api/products` - Crear producto (incluye stock, precio, ganancias, imagen)
- `PUT /api/products/:id` - Actualizar producto (incluye actualización de stock)
└── README.md
```

## 🔌 API Endpoints
 (con control de stock automático)

### Pedidos
- `GET /api/orders` - Obtener todos los pedidos
- `POST /api/orders` - Crear pedido
- `DELETE /api/orders/:id` - Eliminar pedido

### Usuarios
- `GET /api/users` - Obtener todos los usuarios
- `POST /api/users/create` - Crear usuario
- `PUT /api/users/update/:id` - Actualizar usuario
- `DELETE /api/users/delete/:id` - Eliminar usuariroductos
- `GET /api/products/:id` - Obtener producto por ID
- `POST /api/products` - Crear producto
- `PUT /api/products/:id` - Actualizar producto
- `DELETE /api/products/:id` - Eliminar producto

### Ventas
- `GET /api/sales` - Obtener todas las ventas
- `POST /api/sales` - Registrar venta

### Pedidos
- `GET /api/orders` - Obtener todos los pedidos
- `POST /api/orders` - Crear pedido
<!-- - `PUT /api/orders/:id` - Actualizar pedido -->
- `DELETE /api/orders/:id` - Eliminar pedido

### Categorías
- `GET /api/categories` - Obtener categorías
- `POST /api/categories` - Crear categoría
- `PUT /api/categories/:id` - Actualizar categ de caja
- `POST /api/box` - Cerrar caja y guardar datos (ID con autoincremento BIGSERIAL)

## 🗄️ Migraciones de Base de Datos

El proyecto incluye un sistema de migraciones SQL para gestionar cambios en la base de datos:

### Migraciones Disponibles

#### 001_add_stock_to_products.sql
- Agrega el campo `stock` (BIGINT) a la tabla `products`
- Incluye restricción CHECK para evitar stock negativo
- Valor por defecto: 0

---

## 📸 Capturas de Pantalla

### Dashboard Principal
- Métricas de ventas diarias y mensuales
- Comparación con períodos anteriores
- Visualización de usuarios activos
- Top productos más vendidos

### Gestión de Productos
- Tabla completa con stock visible
- Indicadores de estado de stock con colores
- Formulario para agregar/editar productos
- Carga de imágenes

### Módulo de Ventas
- Catálogo de productos con stock disponible
- Carrito interactivo con entrada directa de cantidad
- Múltiples métodos de pago
- Generación de recibos

### Sistema de Devoluciones
- Búsqueda de ventas por cliente
- Selección de productos a devolver
- Cálculo automático de reembolso
- Registro de motivos

---

**💡 Sistema POS Farmacia** - Desarrollado para optimizar la gestión de farmacias con control de inventario robusto y funcionalidades avanzadas.


## 🎯 Características Destacadas del Sistema

### Control de Inventario Inteligente
- **Stock en tiempo real**: Actualización automática al realizar ventas
- **Alertas visuales**: Códigos de color para identificar stock (agotado, bajo, suficiente)
- **Prevención de sobreventa**: Validación antes de agregar al carrito
- **Entrada manual de cantidad**: Los usuarios pueden ingresar directamente la cantidad deseada

### Sistema de Devoluciones
- **Búsqueda rápida**: Localiza ventas por nombre del cliente
- **Selección flexible**: Elige qué productos devolver y en qué cantidad
- **Cálculo automático**: El sistema calcula el reembolso total
- **Trazabilidad**: Registro del motivo de devolución

### Tarjetas de Producto
- **Badge de stock**: Indicador en esquina superior con cantidad disponible
- **Estados visuales**: Overlay de "AGOTADO" cuando no hay stock
- **Información clara**: Precio, nombre y estado de disponibilidad
- **Botones inteligentes**: Se deshabilitan automáticamente cuando no hay stockoría

### Metodos de pago
- `GET /api/paymentMethods` - Obtener metodos de pago
- `POST /api/paymentMethods` - Crear metodos de pago
- `PUT /api/paymentMethods/:id` - Actualizar metodos de pago
- `DELETE /api/paymentMethods/:id` - Eliminar metodos de pago

### Gastos
- `GET /api/bills` - Obtener gastos
- `POST /api/bills` - Registrar gasto
- `PUT /api/bills/:id` - Actualizar gasto
- `DELETE /api/bills/:id` - Eliminar gasto

### Dashboard
- `GET /api/dashboard` - Obtener estadísticas del dashboard

### Caja registradora
- `GET /api/box` - Obtener todos los registros
- `POST /api/box` - Cerrar caja y guardar datos

## 📝 Licencia

Este proyecto es de código abierto y está disponible bajo la Licencia MIT.

## 👨‍💻 Autor

**Jesus Gonzalez Arroyo**
- GitHub: [@Jesus-Gonzalez-Arroyo](https://github.com/Jesus-Gonzalez-Arroyo)
