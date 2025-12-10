const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createDummyData() {
  try {
    console.log('Creating dummy user...');

    // Create a dummy user
    const hashedPassword = await bcrypt.hash('password123', 12);
    const user = await prisma.user.upsert({
      where: { email: 'dummy@example.com' },
      update: {},
      create: {
        email: 'dummy@example.com',
        password: hashedPassword,
      },
    });

    console.log('Dummy user created:', user);

    // Create a sample collection
    const collection = await prisma.koleksi.upsert({
      where: { id: 'sample-collection-1' },
      update: {},
      create: {
        id: 'sample-collection-1',
        nama: 'Sample Collection',
        deskripsi: 'A sample collection for testing',
        userId: user.id,
      },
    });

    console.log('Sample collection created:', collection);

    // Create sample cards
    const cards = [
      {
        koleksiId: collection.id,
        front: 'Hello',
        back: 'Halo',
        difficulty: 1,
      },
      {
        koleksiId: collection.id,
        front: 'Thank you',
        back: 'Terima kasih',
        difficulty: 1,
      },
      {
        koleksiId: collection.id,
        front: 'Good morning',
        back: 'Selamat pagi',
        difficulty: 2,
      },
      {
        koleksiId: collection.id,
        front: 'Goodbye',
        back: 'Selamat tinggal',
        difficulty: 1,
      },
      {
        koleksiId: collection.id,
        front: 'How are you?',
        back: 'Apa kabar?',
        difficulty: 2,
      },
    ];

    for (const cardData of cards) {
      const card = await prisma.kartu.create({
        data: cardData,
      });
      console.log('Sample card created:', card);
    }

    console.log('Dummy data creation completed successfully!');
    console.log('\n=== LOGIN CREDENTIALS ===');
    console.log('Email: dummy@example.com');
    console.log('Password: password123');
    console.log('========================\n');

  } catch (error) {
    console.error('Error creating dummy data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createDummyData();
