import { PrismaClient, Role, MenuCategory } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...\n');

  // ========== CRIAR USUÁRIO ADMIN ==========
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@casadoporco.com.br';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
  const adminName = process.env.ADMIN_NAME || 'Administrador';

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: adminName,
        role: Role.ADMIN,
      },
    });

    console.log('✅ Usuário Admin criado:');
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Senha: ${adminPassword}`);
    console.log(`   Role: ADMIN\n`);
  } else {
    console.log('ℹ️  Usuário Admin já existe\n');
  }

  // ========== CRIAR USUÁRIO SUPERVISOR (DEMO) ==========
  const supervisorEmail = 'supervisor@casadoporco.com.br';

  const existingSupervisor = await prisma.user.findUnique({
    where: { email: supervisorEmail },
  });

  if (!existingSupervisor) {
    const hashedPassword = await bcrypt.hash('Supervisor@123', 10);

    await prisma.user.create({
      data: {
        email: supervisorEmail,
        password: hashedPassword,
        name: 'Supervisor Demo',
        role: Role.SUPERVISOR,
      },
    });

    console.log('✅ Usuário Supervisor criado:');
    console.log(`   Email: ${supervisorEmail}`);
    console.log(`   Senha: Supervisor@123`);
    console.log(`   Role: SUPERVISOR\n`);
  } else {
    console.log('ℹ️  Usuário Supervisor já existe\n');
  }

  // ========== CRIAR ITENS DO CARDÁPIO ==========
  const menuItemsCount = await prisma.menuItem.count();

  if (menuItemsCount === 0) {
    const menuItems = [
      // ENTRADAS
      {
        name: 'Bolinho de Porco',
        description: 'Crocante por fora, suculento por dentro. Servido com molho especial da casa',
        price: 28.0,
        category: MenuCategory.ENTRADAS,
        featured: true,
        sortOrder: 1,
      },
      {
        name: 'Torresmo',
        description: 'Tradicional torresmo mineiro crocante com farofa de bacon',
        price: 24.0,
        category: MenuCategory.ENTRADAS,
        featured: false,
        sortOrder: 2,
      },
      {
        name: 'Linguiça Artesanal',
        description: 'Linguiça defumada da casa com purê de batata doce',
        price: 32.0,
        category: MenuCategory.ENTRADAS,
        featured: false,
        sortOrder: 3,
      },
      {
        name: 'Pão de Queijo Recheado',
        description: 'Pão de queijo mineiro recheado com carne seca desfiada',
        price: 22.0,
        category: MenuCategory.ENTRADAS,
        featured: false,
        sortOrder: 4,
      },

      // PRATOS PRINCIPAIS
      {
        name: 'Costela Assada 12 Horas',
        description: '12 horas de cozimento lento. Acompanha farofa, vinagrete e arroz',
        price: 89.0,
        category: MenuCategory.PRATOS,
        featured: true,
        sortOrder: 1,
      },
      {
        name: 'Barriga de Porco Caramelizada',
        description: 'Barriga suína caramelizada com melaço, purê de mandioquinha e couve',
        price: 78.0,
        category: MenuCategory.PRATOS,
        featured: true,
        sortOrder: 2,
      },
      {
        name: 'Lombo ao Molho Madeira',
        description: 'Lombo suíno grelhado ao molho madeira, batatas rústicas e legumes',
        price: 72.0,
        category: MenuCategory.PRATOS,
        featured: false,
        sortOrder: 3,
      },
      {
        name: 'Pernil Confitado',
        description: 'Pernil confitado por 8 horas, farofa crocante e banana da terra',
        price: 85.0,
        category: MenuCategory.PRATOS,
        featured: true,
        sortOrder: 4,
      },
      {
        name: 'Costelinha ao Molho Barbecue',
        description: 'Costelinha baby back ao molho barbecue caseiro, batata chips',
        price: 92.0,
        category: MenuCategory.PRATOS,
        featured: false,
        sortOrder: 5,
      },
      {
        name: 'Feijoada Completa',
        description: 'Feijoada tradicional com todos os acompanhamentos. Serve 2 pessoas',
        price: 140.0,
        category: MenuCategory.PRATOS,
        featured: false,
        sortOrder: 6,
      },

      // SOBREMESAS
      {
        name: 'Doce de Leite com Queijo',
        description: 'Doce de leite cremoso com queijo minas artesanal',
        price: 24.0,
        category: MenuCategory.SOBREMESAS,
        featured: true,
        sortOrder: 1,
      },
      {
        name: 'Pudim de Chocolate Belga',
        description: 'Pudim de chocolate meio amargo com calda de caramelo',
        price: 28.0,
        category: MenuCategory.SOBREMESAS,
        featured: false,
        sortOrder: 2,
      },
      {
        name: 'Torta de Limão',
        description: 'Massa amanteigada, recheio cremoso de limão siciliano e merengue',
        price: 26.0,
        category: MenuCategory.SOBREMESAS,
        featured: false,
        sortOrder: 3,
      },
      {
        name: 'Petit Gateau',
        description: 'Bolo quente de chocolate com sorvete de creme',
        price: 32.0,
        category: MenuCategory.SOBREMESAS,
        featured: true,
        sortOrder: 4,
      },
      {
        name: 'Cocada Cremosa',
        description: 'Cocada tradicional cremosa com coco queimado',
        price: 20.0,
        category: MenuCategory.SOBREMESAS,
        featured: false,
        sortOrder: 5,
      },

      // BEBIDAS
      {
        name: 'Caipirinha Clássica',
        description: 'Cachaça artesanal, limão, açúcar e gelo',
        price: 18.0,
        category: MenuCategory.BEBIDAS,
        featured: true,
        sortOrder: 1,
      },
      {
        name: 'Caipirinha de Frutas Vermelhas',
        description: 'Morango, framboesa, amora, cachaça e açúcar',
        price: 22.0,
        category: MenuCategory.BEBIDAS,
        featured: false,
        sortOrder: 2,
      },
      {
        name: 'Vinho Tinto Casa Reserva',
        description: 'Taça de vinho tinto da casa selecionado',
        price: 24.0,
        category: MenuCategory.BEBIDAS,
        featured: false,
        sortOrder: 3,
      },
      {
        name: 'Suco Natural',
        description: 'Laranja, limão, maracujá ou abacaxi',
        price: 12.0,
        category: MenuCategory.BEBIDAS,
        featured: false,
        sortOrder: 4,
      },
      {
        name: 'Chopp Artesanal',
        description: 'Chopp gelado de produção própria - 300ml',
        price: 15.0,
        category: MenuCategory.BEBIDAS,
        featured: true,
        sortOrder: 5,
      },
      {
        name: 'Refrigerante',
        description: 'Coca-Cola, Guaraná, Sprite - 350ml',
        price: 8.0,
        category: MenuCategory.BEBIDAS,
        featured: false,
        sortOrder: 6,
      },
    ];

    await prisma.menuItem.createMany({
      data: menuItems,
    });

    console.log(`✅ ${menuItems.length} itens do cardápio criados\n`);
  } else {
    console.log(`ℹ️  Cardápio já possui ${menuItemsCount} itens\n`);
  }

  console.log('🎉 Seed concluído com sucesso!\n');
  console.log('=====================================');
  console.log('📋 Resumo:');
  console.log(`   - Usuários: ${await prisma.user.count()}`);
  console.log(`   - Itens do cardápio: ${await prisma.menuItem.count()}`);
  console.log(`   - Reservas: ${await prisma.booking.count()}`);
  console.log(`   - Horários bloqueados: ${await prisma.blockedSlot.count()}`);
  console.log('=====================================\n');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

