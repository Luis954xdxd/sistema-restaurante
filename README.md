🍽️ Sistema Restaurante

Sistema completo de gestión para restaurante desarrollado con:

- ⚙️ Backend: Node.js + Express + Prisma + PostgreSQL
- 🎨 Frontend Admin: React + TypeScript + Vite
- 🔐 Autenticación con JWT
- 📦 ORM: Prisma 7 con adapter PostgreSQL

---

🚀 Requisitos

Antes de iniciar, asegúrate de tener instalado:

- Node.js (v18 o superior)
- PostgreSQL
- Git
- Visual Studio Code (recomendado)

---

📥 Clonar el proyecto

git clone https://github.com/TU_USUARIO/sistema-restaurante.git
cd sistema-restaurante

---

🧩 CONFIGURACIÓN DEL BACKEND

cd backend
npm install

---

📄 Crear archivo ".env"

Crear archivo:

backend/.env

Copiar y pegar:

PORT=5000
DATABASE_URL="postgresql://postgres:TU_PASSWORD@localhost:5432/restaurante_db"
JWT_SECRET="super_secreto"

⚠️ IMPORTANTE:

- Cambia "TU_PASSWORD" por tu contraseña real de PostgreSQL

---

🗄️ Crear base de datos

En PostgreSQL crea la base:

CREATE DATABASE restaurante_db;

---

⚙️ Configurar Prisma

npx prisma generate
npx prisma migrate dev

---

🌱 Cargar datos iniciales (SEED)

npx prisma db seed

Esto creará automáticamente:

👤 Usuarios

Rol| Email| Contraseña
Admin| admin@restaurante.com| Admin123*
Admin| jesus.bautista@restaurante.com| Jesus123*
Employee| empleado@restaurante.com| Empleado123*
Customer| cliente@restaurante.com| Cliente123*

---

▶️ Ejecutar backend

npm run dev

Servidor en:

http://localhost:5000

---

🎨 CONFIGURACIÓN DEL FRONTEND ADMIN

Abrir nueva terminal:

cd apps/admin-web
npm install
npm run dev

Abrir en navegador:

http://localhost:5173

---

🔐 LOGIN ADMIN

Usar:

Correo: admin@restaurante.com
Password: Admin123*

---

👥 TRABAJO EN EQUIPO (GIT)

📥 Descargar cambios

git pull

---

📤 Subir cambios

git add .
git commit -m "Descripción de cambios"
git push

---

🔄 Flujo recomendado

1. Siempre hacer "git pull" antes de trabajar
2. Hacer cambios
3. Probar que todo funcione
4. Subir con "git push"

---

⚠️ IMPORTANTE (BASE DE DATOS)

Cada desarrollador usa su propia base local.

Después de clonar, SIEMPRE ejecutar:

npx prisma migrate dev
npx prisma db seed

---

🧪 Reiniciar base de datos

Si algo falla:

npx prisma migrate reset

Esto:

- borra la base
- recrea tablas
- ejecuta seed automáticamente

---

📁 Estructura del proyecto

sistema-restaurante/
│
├── backend/
│   ├── prisma/
│   ├── src/
│   └── .env
│
├── apps/
│   └── admin-web/
│
└── README.md

---

🧠 Notas importantes

- Prisma usa adapter PostgreSQL (Prisma 7)
- El seed carga datos iniciales automáticamente
- No subir ".env" al repositorio
- Usar ".env.example" como referencia

---

🔥 Futuras mejoras

- Panel de empleado
- Sistema de pedidos en tiempo real
- Menú para clientes (QR)
- Dashboard con gráficas
- Animaciones UI

---

👨‍💻 Autor

Proyecto desarrollado por:

Luis Lopez 🚀