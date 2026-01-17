const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

async function main() {
    console.log('Seeding D2E Marketplace data...');

    // 1. Create a mock company/poster
    const company = await prisma.companies.upsert({
        where: { email: 'hr@resconate.com' },
        update: {},
        create: {
            name: 'Resconate Corp',
            email: 'hr@resconate.com',
            d2e_enabled: true,
            plan: 'PREMIUM'
        }
    });

    // Create wallet for company
    await prisma.wallets.upsert({
        where: { owner_id: company.id },
        update: { available_balance: 1000000 },
        create: {
            owner_id: company.id,
            owner_type: 'COMPANY',
            available_balance: 1000000,
            pending_balance: 0
        }
    });

    // 2. Create some tasks
    const tasks = [
        {
            poster_id: company.id,
            poster_type: 'COMPANY',
            title: 'Design a Social Media Banner',
            description: 'We need a high-quality banner for our upcoming LinkedIn campaign focus on D2E features.',
            required_skills: ['Graphic Design', 'Figma'],
            total_slots: 5,
            pay_per_slot: 12000,
            deadline: new Date('2026-12-31'),
            status: 'ACTIVE',
            type: 'FIXED'
        },
        {
            poster_id: company.id,
            poster_type: 'COMPANY',
            title: 'Write Technical Documentation',
            description: 'Document the new API endpoints for the wallet service clearly for external developers.',
            required_skills: ['Technical Writing', 'API'],
            total_slots: 2,
            pay_per_slot: 25000,
            deadline: new Date('2026-11-30'),
            status: 'ACTIVE',
            type: 'FIXED'
        },
        {
            poster_id: company.id,
            poster_type: 'COMPANY',
            title: 'Beta Test Mobile App (Android)',
            description: 'Download the APK, perform 3 specific workflows and submit a bug report.',
            required_skills: ['QA', 'Android'],
            total_slots: 10,
            pay_per_slot: 5000,
            deadline: new Date('2026-10-15'),
            status: 'ACTIVE',
            type: 'FIXED'
        }
    ];

    for (const t of tasks) {
        await prisma.tasks.create({ data: t });
    }

    console.log('Seeding completed successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
