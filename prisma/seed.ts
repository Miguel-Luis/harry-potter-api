// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    // Crear roles por defecto
    const adminRole = await prisma.role.create({
        data: {
            name: 'admin',
            description: 'Administrador del sistema'
        }
    })

    const editorRole = await prisma.role.create({
        data: {
            name: 'editor',
            description: 'Puede editar recursos'
        }
    })

    // Ejemplo: Crear un usuario admin
    const user = await prisma.user.create({
        data: {
            email: 'admin@example.com',
            password: 'HASHED_PASSWORD', // Recuerda encriptar la contraseña
            roles: {
                connect: [{ id: adminRole.id }]
            }
        }
    })
    console.log('Seed finalizado con éxito.')
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
