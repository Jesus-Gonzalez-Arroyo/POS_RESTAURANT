# 🍽️ POS Restaurant

Sistema de Punto de Venta (POS) para restaurantes desarrollado con Angular y Node.js. Gestiona ventas, productos, inventario, pedidos, categorías y contabilidad de manera eficiente.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Ejecución](#-ejecución)
- [Scripts de Migración](#-scripts-de-migración)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [API Endpoints](#-api-endpoints)
- [Contribución](#-contribución)

## ✨ Características

### Gestión de Ventas
- ✅ Registro de ventas con múltiples productos
- 📊 Dashboard con estadísticas en tiempo real
- 💰 Seguimiento de ingresos y ganancias
- 📈 Comparación de ventas (día actual vs anterior, mes actual vs anterior)
- 🧾 Generación de recibos e impresión

### Gestión de Productos
- 📦 CRUD completo de productos
- 🖼️ Carga de imágenes para productos
- 🏷️ Categorización de productos
- 💵 Control de precios y ganancias
- ✅ Gestión de disponibilidad

### Gestión de Pedidos
- 🛒 Carrito de compras interactivo
- 🚚 Soporte para entregas a domicilio
- 💳 Múltiples métodos de pago (efectivo, tarjeta, transferencia)
- 📋 Estados de pedidos en tiempo real
- 👤 Registro de clientes

### Contabilidad
- 💸 Registro de gastos y facturas
- 📊 Reportes de ventas con filtros avanzados
- 🔍 Búsqueda y ordenamiento de transacciones
- 📅 Filtrado por rango de fechas
- 📈 Análisis de ganancias

### Gestión de Categorías
- 🗂️ Organización de productos por categorías
- ✏️ Activación/desactivación de categorías
- 🎨 Interfaz intuitiva

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

## 🚀 Instalación

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
DB_NAME=pos_restaurant

NODE_ENV=development
JWT_SECRET=tu_secret_key_super_segura
```

2. Crear la base de datos PostgreSQL:

```sql
CREATE DATABASE pos_restaurant;
```

3. Ejecutar las migraciones (si es necesario):

```bash
npm run migrate:sales
npm run migrate:categories
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

### Producción

**Backend:**
```bash
cd Backend
npm run build
npm start
```

**Frontend:**
```bash
cd Frontend
npm run build
```
Los archivos compilados estarán en `Frontend/dist/`

## 🔄 Scripts de Migración

### Convertir columna products a JSONB
```bash
cd Backend
npm run migrate:sales
```

### Renombrar columna update_at a updated_at
```bash
cd Backend
npm run migrate:categories
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
│   │   └── styles.css               # Estilos globales
│   ├── package.json
│   ├── angular.json
│   └── tsconfig.json
│
└── README.md
```

## 🔌 API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario

### Productos
- `GET /api/products` - Obtener todos los productos
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
- `PUT /api/orders/:id` - Actualizar pedido
- `DELETE /api/orders/:id` - Eliminar pedido

### Categorías
- `GET /api/categories` - Obtener categorías
- `POST /api/categories` - Crear categoría
- `PUT /api/categories/:id` - Actualizar categoría
- `DELETE /api/categories/:id` - Eliminar categoría

### Gastos
- `GET /api/bills` - Obtener gastos
- `POST /api/bills` - Registrar gasto

### Dashboard
- `GET /api/dashboard` - Obtener estadísticas del dashboard

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto es de código abierto y está disponible bajo la Licencia MIT.

## 👨‍💻 Autor

**Jesus Gonzalez Arroyo**
- GitHub: [@Jesus-Gonzalez-Arroyo](https://github.com/Jesus-Gonzalez-Arroyo)

## 🙏 Agradecimientos

- Angular Team
- Node.js Community
- PostgreSQL Team
- Tailwind CSS Team

---

⭐ Si este proyecto te fue útil, considera darle una estrella en GitHub!
