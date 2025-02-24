import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    // Crear rol admin
    const adminRole = await prisma.role.create({
        data: {
            name: 'admin',
            description: 'Administrador del sistema'
        }
    });

    // Crear permisos
    const permissions = await Promise.all([
        'manage_users',
        'manage_roles',
        'manage_permissions',
        'manage_characters',
        'manage_houses',
        'manage_skills',
        'manage_animals'
    ].map(action =>
        prisma.permission.create({
            data: {
                action,
                description: `Permiso para ${action.replace('_', ' ')}`
            }
        })
    ));

    // Asignar permisos al rol admin
    await prisma.role.update({
        where: { id: adminRole.id },
        data: {
            permissions: {
                connect: permissions.map(p => ({ id: p.id }))
            }
        }
    });

    // Crear usuario admin
    await prisma.user.create({
        data: {
            email: 'miguel.doe@mail.com',
            name: 'Luis Miguel',
            lastName: 'Gonzalez Giraldo',
            password: await bcrypt.hash('123456', 10),
            roles: {
                connect: [{ id: adminRole.id }]
            }
        }
    });

    // Crear casas de Hogwarts
    const houses = await Promise.all([
        { name: 'Gryffindor', description: 'Valentía y coraje' },
        { name: 'Hufflepuff', description: 'Lealtad y justicia' },
        { name: 'Ravenclaw', description: 'Sabiduría e inteligencia' },
        { name: 'Slytherin', description: 'Ambición y astucia' }
    ].map(house => prisma.house.create({ data: house })));

    // Crear habilidades
    const skills = await Promise.all([
        { name: 'Volar en escoba', description: 'Habilidad para volar en escobas mágicas' },
        { name: 'Hechizos defensivos', description: 'Protección contra ataques mágicos' },
        { name: 'Poción multijugos', description: 'Preparación de pociones complejas' },
        { name: 'Metamorfosis', description: 'Cambio de forma física' },
        { name: 'Hablar pársel', description: 'Comunicación con serpientes' },
        { name: 'Patronus', description: 'Defensa contra dementores' }
    ].map(skill => prisma.skill.create({ data: skill })));

    // Crear personajes principales
    const characters = await Promise.all([
        {
            name: 'Harry Potter',
            type: 'Mago',
            houseId: houses[0].id,
            skills: [skills[0], skills[1], skills[4]],
            animals: [
                { name: 'Hedwig', isFantastic: true, description: 'Lechuza blanca mensajera' }
            ]
        },
        {
            name: 'Hermione Granger',
            type: 'Maga',
            houseId: houses[0].id,
            skills: [skills[2], skills[3], skills[1]],
            animals: [
                { name: 'Crookshanks', isFantastic: true, description: 'Gato mestizo con sangre de kneazle' }
            ]
        },
        {
            name: 'Ron Weasley',
            type: 'Mago',
            houseId: houses[0].id,
            skills: [skills[0], skills[5]],
            animals: [
                { name: 'Scabbers', isFantastic: false, description: 'Rata común (aparentemente)' }
            ]
        },
        {
            name: 'Draco Malfoy',
            type: 'Mago',
            houseId: houses[3].id,
            skills: [skills[2], skills[4]],
            animals: [
                { name: 'Aguijón Blanco', isFantastic: true, description: 'Halcón blanco de lujo' }
            ]
        }
    ].map(async character => {
        const created = await prisma.character.create({
            data: {
                name: character.name,
                type: character.type,
                houseId: character.houseId,
                skills: {
                    connect: character.skills.map(s => ({ id: s.id }))
                }
            }
        });

        await Promise.all(character.animals.map(animal =>
            prisma.animal.create({
                data: {
                    ...animal,
                    characterId: created.id
                }
            })
        ));

        return created;
    }));

    // Animales adicionales
    const fantasticAnimals = await Promise.all([
        { name: 'Fawkes', isFantastic: true, description: 'Fénix de Dumbledore', characterId: characters[0].id },
        { name: 'Nagini', isFantastic: true, description: 'Serpiente Horrocrux', characterId: characters[3].id },
        { name: 'Buckbeak', isFantastic: true, description: 'Hipogrifo', characterId: characters[0].id }
    ].map(animal => prisma.animal.create({ data: animal })));

    console.log('Seed completado con éxito!');
    console.log(`Datos creados:`);
    console.log(`- ${houses.length} Casas`);
    console.log(`- ${skills.length} Habilidades`);
    console.log(`- ${characters.length} Personajes`);
    console.log(`- ${fantasticAnimals.length} Animales`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });