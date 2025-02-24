# 🧙🪄 **Harry Potter API - NestJS**

¡Bienvenido a la API de Harry Potter! Esta aplicación permite gestionar personajes, casas, habilidades y animales del universo mágico, con autenticación JWT, roles, y más. Desarrollada con NestJS, PostgreSQL y Prisma.

---

## 📑 **Tabla de Contenidos**

- [🧙🪄 **Harry Potter API - NestJS**](#-harry-potter-api---nestjs)
  - [📑 **Tabla de Contenidos**](#-tabla-de-contenidos)
  - [🛠 **Tecnologías**](#-tecnologías)
  - [**Introducción**](#introducción)
  - [Parte 1: Preparación del Entorno](#parte-1-preparación-del-entorno)
    - [Requisitos Previos](#requisitos-previos)
    - [Beneficios de usar `nvm-windows`](#beneficios-de-usar-nvm-windows)
    - [Creación del Proyecto con NestJS](#creación-del-proyecto-con-nestjs)
    - [Configuración de Docker y PostgreSQL](#configuración-de-docker-y-postgresql)
    - [Instalación de Prisma](#instalación-de-prisma)
    - [Verificación Final](#verificación-final)
  - [Parte 2: Definición de Modelos y Migraciones con Prisma](#parte-2-definición-de-modelos-y-migraciones-con-prisma)
    - [Creación de los Modelos en Prisma](#creación-de-los-modelos-en-prisma)
    - [Creación y Ejecución de la Migración](#creación-y-ejecución-de-la-migración)
    - [Instalar `bcrypt`:](#instalar-bcrypt)
    - [Seeders (Datos de Prueba)](#seeders-datos-de-prueba)
---

## 🛠 **Tecnologías**

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)

---

## **Introducción**

Este proyecto consiste en una **API** para gestionar:

- **Personajes** del universo de Harry Potter (nombre, tipo, casa, habilidades...).  
- **Casas** (Gryffindor, Slytherin, Ravenclaw, Hufflepuff...).  
- **Habilidades** (volar en escoba, hablar Pársel, etc.).  
- **Animales** (fantásticos o normales) asociados a personajes.  
- **Autenticación y Autorización** mediante JWT, roles y permisos.  

---

## Parte 1: Preparación del Entorno

### Requisitos Previos

1. **Instalación de NVM (Node Version Manager) en Windows 11**  
   - En Windows, `nvm` no está disponible directamente como en sistemas basados en Unix. Sin embargo, puedes usar **nvm-windows**, una herramienta similar que permite gestionar múltiples versiones de Node.js.
   - Descarga e instala **nvm-windows** desde el siguiente enlace:  
     [Descargar nvm-windows](https://github.com/coreybutler/nvm-windows/releases).
   - Ejecuta el instalador descargado (`nvm-setup.zip`) y sigue los pasos del asistente.
   - Una vez instalado, abre una nueva terminal (PowerShell o CMD) y verifica que `nvm` esté funcionando correctamente:

     ```bash
     nvm --version
     ```

2. **Instalación de Node.js LTS**  
   - Usa `nvm` para instalar la última versión LTS de Node.js:

     ```bash
     nvm install lts
     ```

   - Configura esta versión como la predeterminada:

     ```bash
     nvm use lts
     ```

   - Verifica que Node.js y npm se hayan instalado correctamente:

     ```bash
     node -v
     npm -v
     ```

3. **NestJS CLI**  
   - Instala la CLI de NestJS de forma global usando npm:

     ```bash
     npm install -g @nestjs/cli
     ```

   - Verifica la instalación:

     ```bash
     nest --version
     ```

4. **Docker y Docker Compose**  
   - Instala [Docker Desktop](https://www.docker.com/products/docker-desktop) para Windows 11.  
     > Nota: Docker Desktop incluye Docker Compose, por lo que no es necesario instalarlo por separado.
   - Durante la instalación, asegúrate de habilitar la opción **"Use the WSL 2 based engine"** si deseas aprovechar las ventajas de rendimiento de WSL 2.
   - Verifica las instalaciones con los siguientes comandos:

     ```bash
     docker --version
     docker-compose --version
     ```

5. **PostgreSQL**  
   - Usaremos PostgreSQL dentro de un contenedor de Docker. Asegúrate de tener Docker instalado (ver paso anterior).  
   - Cliente local opcional: Si deseas consultar la base de datos directamente, puedes instalar un cliente como [pgAdmin](https://www.pgadmin.org/), [DBeaver](https://dbeaver.io/) o la extensión para `Visual Studio Code` llamada [MySQL](https://marketplace.visualstudio.com/items?itemName=cweijan.vscode-mysql-client2).

---

### Beneficios de usar `nvm-windows`

- **Gestión de versiones**: Puedes cambiar fácilmente entre diferentes versiones de Node.js según los requisitos del proyecto.
- **Compatibilidad**: Al usar la versión LTS (Long Term Support), te aseguras de tener una versión estable y compatible con la mayoría de las bibliotecas y herramientas.
- **Facilidad de uso**: `nvm-windows` simplifica la instalación y gestión de Node.js en entornos Windows.

---

Con estos cambios, el proceso de instalación está optimizado para Windows 11, garantizando que el entorno sea consistente y fácil de configurar. Esto es especialmente útil para desarrolladores que trabajan en múltiples proyectos con diferentes requisitos de Node.js.

---


### Creación del Proyecto con NestJS

1. **Crear un nuevo proyecto**  
   ```bash
   nest new harry-potter-api
   ```

  Selecciona el gestor de paquetes (npm, yarn, etc.).

2. **Ejecutar la aplicación**
    ```bash
    npm run start:dev
    ```
### Configuración de Docker y PostgreSQL
1. **Crear un archivo `docker-compose.yml`** en la raíz del proyecto con la siguiente configuración:
    ```yaml
    version: '3.8'
    services:
      db:
        image: postgres:14
        container_name: harry_potter_db
        restart: always
        ports:
          - '5432:5432'
        environment:
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: harry_potter
        volumes:
          - postgres_data:/var/lib/postgresql/data

    volumes:
      postgres_data:
    ```

2. **Levantar la Base de Datos**
    ```bash
    docker-compose up -d
    ```
    Verifica con `docker ps` que el contenedor está en ejecución.

### Instalación de Prisma
1. **Instalar Prisma** en el proyecto con los comandos:
    ```bash
    npm install prisma --save-dev
    npm install @prisma/client
    ```

2. **Inicializar Prisma**
    ```bash
    npx prisma init
    ```
    Crea los archivos .env y prisma/schema.prisma.

3. **Configurar `.env`**
    ```env
    DATABASE_URL="postgresql://postgres:postgres@localhost:5432/harry_potter?schema=public"
    PORT="3000"
    ```
    Ajusta el usuario, contraseña y puerto si fuera necesario. También se puede definir el puerto por el que correrá la aplicación.

### Verificación Final
- Ejecuta `docker-compose up -d` para la BD y `npm run start:dev` para NestJS.
- Verifica que no haya errores en la aplicación.

---

## Parte 2: Definición de Modelos y Migraciones con Prisma

### Creación de los Modelos en Prisma
En `prisma/schema.prisma`, define los modelos de la base de datos:
  ```prisma
  generator client {
    provider = "prisma-client-js"
  }

  datasource db {
    provider = "postgresql"
    url      = env("DATABASE_URL")
  }

  //
  // ──────────────────────────────────────────────────────────────
  //   :: MODELO DE USUARIO (Users)
  // ──────────────────────────────────────────────────────────────
  //  - Manejo de autenticación con JWT.
  //  - Contraseñas encriptadas.
  //  - Relación con roles (user <-> role) y permisos.
  //
  model House {
    id          String       @id @default(uuid())
    name        String       @unique
    description String?
    characters  Character[]  // Relación One-to-Many con Character
    createdAt   DateTime     @default(now())
    updatedAt   DateTime     @updatedAt
  }

  //
  // ──────────────────────────────────────────────────────────────
  //   :: MODELO DE ROL (Roles)
  // ──────────────────────────────────────────────────────────────
  //  - Asignación de roles a usuarios.
  //  - Relación Many-to-Many con usuarios.
  //  - Relación Many-to-Many con permisos (opcional).
  //
  model Role {
    id          String       @id @default(uuid())
    name        String       @unique
    description String?
    users       User[]       @relation("UserRoles") // Relación Many-to-Many con User
    permissions Permission[] @relation("RolePermissions") // Relación Many-to-Many con Permission
    createdAt   DateTime     @default(now())
    updatedAt   DateTime     @updatedAt
  }

  //
  // ──────────────────────────────────────────────────────────────
  //   :: MODELO DE PERMISO (Permissions)
  // ──────────────────────────────────────────────────────────────
  //  - Lista de acciones permitidas a un rol (crear, leer, actualizar, eliminar, etc.)
  //
  model Permission {
    id          String   @id @default(uuid())
    action      String
    description String?
    roles       Role[]   @relation("RolePermissions") // Relación Many-to-Many con Role
    createdAt   DateTime @default(now())
    updatedAt   DateTime @updatedAt
  }

  //
  // ──────────────────────────────────────────────────────────────
  //   :: MODELO DE CASA (Houses)
  // ──────────────────────────────────────────────────────────────
  //  - Casas de Hogwarts u otras.
  //  - Un personaje pertenece a una sola casa.
  //
  model House {
    id          String       @id @default(uuid())
    name        String       @unique
    description String?
    characters  Character[]  // Relación One-to-Many con Character
    createdAt   DateTime     @default(now())
    updatedAt   DateTime     @updatedAt
  }

  //
  // ──────────────────────────────────────────────────────────────
  //   :: MODELO DE PERSONAJE (Characters)
  // ──────────────────────────────────────────────────────────────
  //  - Un personaje tiene:
  //    -> una casa (houseId)
  //    -> muchas habilidades (M:N)
  //    -> muchos animales (1:N)
  //
  model Character {
    id          String      @id @default(uuid())
    name        String
    type        String?     // Ej: "Humano", "Mago", "Hechicero", etc.
    houseId     String      // Relación con House (One-to-Many)
    house       House       @relation(fields: [houseId], references: [id])
    skills      Skill[]     @relation("CharacterSkills") // Relación Many-to-Many con Skill
    animals     Animal[]    // Relación One-to-Many con Animal
    createdAt   DateTime    @default(now())
    updatedAt   DateTime    @updatedAt
  }

  //
  // ──────────────────────────────────────────────────────────────
  //   :: MODELO DE HABILIDAD (Skills)
  // ──────────────────────────────────────────────────────────────
  //  - Ejemplos: "Volar en Escoba", "Hablar Pársel", etc.
  //  - Relación Many-to-Many con Character
  //
  model Skill {
    id          String      @id @default(uuid())
    name        String      @unique
    description String?
    characters  Character[] @relation("CharacterSkills") // Relación Many-to-Many con Character
    createdAt   DateTime    @default(now())
    updatedAt   DateTime    @updatedAt
  }

  //
  // ──────────────────────────────────────────────────────────────
  //   :: MODELO DE ANIMAL (Animals)
  // ──────────────────────────────────────────────────────────────
  //  - Puede ser fantástico o normal.
  //  - Relación (1:N) con Character (un personaje puede tener varios animales).
  //
  model Animal {
    id          String      @id @default(uuid())
    name        String
    // Indica si es un animal fantástico (true) o normal (false)
    isFantastic Boolean     @default(false)
    description String?
    characterId String
    character   Character   @relation(fields: [characterId], references: [id])
    createdAt   DateTime    @default(now())
    updatedAt   DateTime    @updatedAt
  }
  ```
### Creación y Ejecución de la Migración

1. Crear la migración
    ```bash
    npx prisma init
    ```
    Prisma generará el SQL necesario y creará las tablas.

2. Verificar la base de datos
    Revisar la base de datos para asegurarse de que las tablas se crearon correctamente.

3. Actualizar el modelo
    Cada vez que modifiques schema.prisma, se debe crear una nueva migración:
    ```bash
    npx prisma migrate dev --name add_new_fields
    ```

### Instalar `bcrypt`:

Primero, necesitas instalar la biblioteca `bcrypt` junto con sus tipos (si usas TypeScript):

  ```bash
  npm install bcrypt
  npm install --save-dev @types/bcrypt
  ```

### Seeders (Datos de Prueba)
Puedes crear un archivo `prisma/seed.ts` para cargar datos iniciales:

  ```typescript
  import { PrismaClient } from '@prisma/client';
  import * as bcrypt from 'bcrypt';

  const prisma = new PrismaClient();

  async function main() {
      const adminRole = await prisma.role.create({
          data: {
              name: 'admin',
              description: 'Administrador del sistema'
          }
      });

      // Crear usuario admin
      const miguel = await prisma.user.create({
          data: {
              email: 'migue.doe@mail.com',
              name: 'Luis Miguel',
              lastName: 'Gonzalez Giraldo',
              password: await bcrypt.hash('123456', 10),
              roles: {
                  connect: [{ id: adminRole.id }],
              }
          },
      });
      console.log('Seed finalizado con éxito.');
  }

  main()
      .catch(e => {
          console.error(e);
          process.exit(1);
      })
      .finally(async () => {
          await prisma.$disconnect();
      });
  ```

Agregar en el `package.json`:
  ```json
  {
    "prisma": {
      "seed": "ts-node prisma/seed.ts"
    }
  }
  ```

Y luego ejecutar el comando:
  ```bash
  npx prisma db seed
  ```

---