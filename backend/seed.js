const bcrypt = require('bcryptjs');
const { User, Game, Rating } = require('./models');

const seedData = async () => {
    console.log('🌱 Seeding database with expanded library...');

    // Create users
    const password = await bcrypt.hash('password123', 10);
    const users = await User.bulkCreate([
        { username: 'admin', email: 'admin@gamestore.com', password_hash: password, role: 'admin' },
        { username: 'john_gamer', email: 'john@example.com', password_hash: password, role: 'user' },
        { username: 'alice_pro', email: 'alice@example.com', password_hash: password, role: 'user' },
        { username: 'bob_casual', email: 'bob@example.com', password_hash: password, role: 'user' },
        { username: 'maria_rpg', email: 'maria@example.com', password_hash: password, role: 'user' },
    ]);

    // Create 55 games
    const gamesData = [
        { title: 'Cyberpunk 2077', description: 'Откройте для себя мегаполис будущего — Найт-Сити.', price: 59.99, genre: 'RPG', image_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop', avg_rating: 4.2, rating_count: 3 },
        { title: 'The Witcher 3: Wild Hunt', description: 'Вы — Геральт из Ривии, наемный убийца монстров.', price: 39.99, genre: 'RPG', image_url: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&h=300&fit=crop', avg_rating: 4.8, rating_count: 5 },
        { title: 'Red Dead Redemption 2', description: 'Эпоха Дикого Запада подходит к концу.', price: 49.99, genre: 'Action', image_url: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=300&fit=crop', avg_rating: 4.7, rating_count: 4 },
        { title: 'Elden Ring', description: 'Масштабная Action-RPG в темном фэнтези.', price: 59.99, genre: 'RPG', image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop', avg_rating: 4.9, rating_count: 6 },
        { title: 'God of War Ragnarök', description: 'Кратос и Атрей отправляются в эпическое путешествие.', price: 69.99, genre: 'Action', image_url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop', avg_rating: 4.6, rating_count: 4 },
        { title: 'Hogwarts Legacy', description: 'Станьте волшебником в мире Гарри Поттера.', price: 59.99, genre: 'RPG', image_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop', avg_rating: 4.3, rating_count: 3 },
        { title: 'Starfield', description: 'Космическая RPG нового поколения.', price: 69.99, genre: 'RPG', image_url: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=300&fit=crop', avg_rating: 3.8, rating_count: 5 },
        { title: 'Baldur\'s Gate 3', description: 'Соберите отряд и возвращайтесь в Забытые Реалмы.', price: 59.99, genre: 'RPG', image_url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&h=300&fit=crop', avg_rating: 4.9, rating_count: 7 },
        { title: 'Call of Duty: MW III', description: 'Капитан Прайс против высшей угрозы.', price: 69.99, genre: 'Shooter', image_url: 'https://images.unsplash.com/photo-1552820728-8b83bb6b2b28?w=400&h=300&fit=crop', avg_rating: 3.5, rating_count: 4 },
        { title: 'FIFA 24', description: 'Новая эра футбольных симуляторов.', price: 49.99, genre: 'Sport', image_url: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&h=300&fit=crop', avg_rating: 3.9, rating_count: 3 },
        { title: 'Minecraft', description: 'Исследуйте бесконечные блочные миры.', price: 26.99, genre: 'Sandbox', image_url: 'https://images.unsplash.com/photo-1587573089734-599d584d61de?w=400&h=300&fit=crop', avg_rating: 4.5, rating_count: 8 },
        { title: 'Grand Theft Auto V', description: 'Три преступника в Лос-Сантосе.', price: 29.99, genre: 'Action', image_url: 'https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=400&h=300&fit=crop', avg_rating: 4.6, rating_count: 9 },
        { title: 'Horizon Forbidden West', description: 'Элой на Запретном Западе.', price: 49.99, genre: 'Action', image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=300&fit=crop', avg_rating: 4.4, rating_count: 3 },
        { title: 'Resident Evil 4 Remake', description: 'Хоррор в сельской Европе.', price: 59.99, genre: 'Horror', image_url: 'https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=400&h=300&fit=crop', avg_rating: 4.7, rating_count: 5 },
        { title: 'Stardew Valley', description: 'Уютная фермерская жизнь.', price: 14.99, genre: 'Simulation', image_url: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400&h=300&fit=crop', avg_rating: 4.8, rating_count: 6 },
        { title: 'Diablo IV', description: 'Мрачная битва в Санктуарии.', price: 69.99, genre: 'RPG', image_url: 'https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=400&h=300&fit=crop', avg_rating: 4.1, rating_count: 4 },
        { title: 'Forza Horizon 5', description: 'Живописная Мексика на суперкарах.', price: 59.99, genre: 'Racing', image_url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop', avg_rating: 4.5, rating_count: 4 },
        { title: 'Hades II', description: 'Продолжение легендарного roguelike.', price: 29.99, genre: 'Roguelike', image_url: 'https://images.unsplash.com/photo-1533488765986-dfa2a9939acd?w=400&h=300&fit=crop', avg_rating: 4.7, rating_count: 3 },
        { title: 'Assassin\'s Creed Mirage', description: 'Скрытный убийца в Багдаде.', price: 49.99, genre: 'Action', image_url: 'https://images.unsplash.com/photo-1548484352-ea579e5233a8?w=400&h=300&fit=crop', avg_rating: 4.0, rating_count: 3 },
        { title: 'Persona 5 Royal', description: 'Стильная японская RPG.', price: 59.99, genre: 'JRPG', image_url: 'https://images.unsplash.com/photo-1531525645387-7f14be1bdbbd?w=400&h=300&fit=crop', avg_rating: 4.8, rating_count: 5 },
        { title: 'Civilization VI', description: 'Классическая стратегия.', price: 29.99, genre: 'Strategy', image_url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop', avg_rating: 4.4, rating_count: 5 },
        { title: 'Dota 2', description: 'Легендарная MOBA битва.', price: 0, genre: 'MOBA', image_url: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?w=400&h=300&fit=crop', avg_rating: 4.3, rating_count: 10 },
        { title: 'Valorant', description: 'Тактический шутер от Riot.', price: 0, genre: 'Shooter', image_url: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=400&h=300&fit=crop', avg_rating: 4.2, rating_count: 7 },
        { title: 'Terraria', description: '2D приключения в открытом мире.', price: 9.99, genre: 'Sandbox', image_url: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=400&h=300&fit=crop', avg_rating: 4.6, rating_count: 6 },
        { title: 'Among Us', description: 'Найдите самозванца.', price: 4.99, genre: 'Party', image_url: 'https://images.unsplash.com/photo-1614294149010-950b698f72c0?w=400&h=300&fit=crop', avg_rating: 4.0, rating_count: 8 },
        { title: 'The Last of Us Part I', description: 'Выживание в постапокалипсисе.', price: 69.99, genre: 'Adventure', image_url: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=400&h=300&fit=crop', avg_rating: 4.9, rating_count: 12 },
        { title: 'Uncharted: Legacy of Thieves', description: 'Поиски сокровищ и приключений.', price: 49.99, genre: 'Adventure', image_url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop', avg_rating: 4.8, rating_count: 5 },
        { title: 'Mortal Kombat 1', description: 'Фаталити в новом измерении.', price: 69.99, genre: 'Fighting', image_url: 'https://images.unsplash.com/photo-1533488765986-dfa2a9939acd?w=400&h=300&fit=crop', avg_rating: 4.5, rating_count: 8 },
        { title: 'Street Fighter 6', description: 'Король файтингов возвращается.', price: 59.99, genre: 'Fighting', image_url: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?w=400&h=300&fit=crop', avg_rating: 4.6, rating_count: 4 },
        { title: 'Inside', description: 'Мрачный платформер-головоломка.', price: 19.99, genre: 'Indie', image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=300&fit=crop', avg_rating: 4.9, rating_count: 15 },
        { title: 'Cuphead', description: 'Хардкорный экшен в стиле 1930-х.', price: 19.99, genre: 'Indie', image_url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&h=300&fit=crop', avg_rating: 4.8, rating_count: 10 },
        { title: 'Portal 2', description: 'Головоломки с порталами.', price: 9.99, genre: 'Puzzle', image_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop', avg_rating: 4.9, rating_count: 20 },
        { title: 'Tetris Effect: Connected', description: 'Тетрис как вы его еще не видели.', price: 39.99, genre: 'Puzzle', image_url: 'https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=400&h=300&fit=crop', avg_rating: 4.7, rating_count: 5 },
        { title: 'It Takes Two', description: 'Кооперативное приключение для двоих.', price: 39.99, genre: 'Adventure', image_url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop', avg_rating: 4.9, rating_count: 18 },
        { title: 'A Way Out', description: 'Побег из тюрьмы вдвоем.', price: 29.99, genre: 'Adventure', image_url: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=300&fit=crop', avg_rating: 4.6, rating_count: 11 },
        { title: 'Hitman 3', description: 'Мир наемных убийц в ваших руках.', price: 59.99, genre: 'Stealth', image_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop', avg_rating: 4.7, rating_count: 6 },
        { title: 'Dishonored 2', description: 'Стильный стелс-экшен с магией.', price: 39.99, genre: 'Stealth', image_url: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&h=300&fit=crop', avg_rating: 4.8, rating_count: 9 },
        { title: 'Silent Hill 2 Remake', description: 'Возвращение легендарного хоррора.', price: 69.99, genre: 'Horror', image_url: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400&h=300&fit=crop', avg_rating: 4.9, rating_count: 7 },
        { title: 'Outlast 2', description: 'Прятки с маньяками в деревне.', price: 29.99, genre: 'Horror', image_url: 'https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=400&h=300&fit=crop', avg_rating: 4.3, rating_count: 9 },
        { title: 'Dave the Diver', description: 'Рыбалка днем, суши вечером.', price: 19.99, genre: 'Indie', image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=300&fit=crop', avg_rating: 4.9, rating_count: 14 },
        { title: 'Vampire Survivors', description: 'Уничтожайте тысячи скелетов.', price: 4.99, genre: 'Roguelike', image_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop', avg_rating: 4.8, rating_count: 22 },
        { title: 'Slay the Spire', description: 'Карточный roguelike шедевр.', price: 24.99, genre: 'Roguelike', image_url: 'https://images.unsplash.com/photo-1552820728-8b83bb6b2b28?w=400&h=300&fit=crop', avg_rating: 4.8, rating_count: 12 },
        { title: 'Celeste', description: 'Сложный платформер о горе.', price: 19.99, genre: 'Platformer', image_url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop', avg_rating: 4.9, rating_count: 16 },
        { title: 'Ori and the Will of the Wisps', description: 'Невероятно красивый платформер.', price: 29.99, genre: 'Platformer', image_url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&h=300&fit=crop', avg_rating: 4.9, rating_count: 11 },
        { title: 'Sea of Stars', description: 'Классическая пошаговая JRPG.', price: 34.99, genre: 'JRPG', image_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop', avg_rating: 4.8, rating_count: 8 },
        { title: 'Final Fantasy VII Rebirth', description: 'Эпическое продолжение ремейка.', price: 69.99, genre: 'JRPG', image_url: 'https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=400&h=300&fit=crop', avg_rating: 4.9, rating_count: 14 },
        { title: 'Gran Turismo 7', description: 'Реалистичный автосимулятор.', price: 69.99, genre: 'Racing', image_url: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&h=300&fit=crop', avg_rating: 4.4, rating_count: 20 },
        { title: 'Need for Speed Unbound', description: 'Уличные гонки и стиль.', price: 59.99, genre: 'Racing', image_url: 'https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=400&h=300&fit=crop', avg_rating: 3.9, rating_count: 13 },
        { title: 'The Sims 4', description: 'Симулятор жизни без границ.', price: 0, genre: 'Simulation', image_url: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400&h=300&fit=crop', avg_rating: 4.4, rating_count: 35 },
        { title: 'Microsoft Flight Simulator', description: 'Весь мир у ваших ног.', price: 59.99, genre: 'Simulation', image_url: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=300&fit=crop', avg_rating: 4.7, rating_count: 18 },
        { title: 'Fall Guys', description: 'Безумная полоса препятствий.', price: 0, genre: 'Party', image_url: 'https://images.unsplash.com/photo-1621333100207-881b49079f83?w=400&h=300&fit=crop', avg_rating: 4.1, rating_count: 40 },
        { title: 'Jackbox Party Pack 10', description: 'Лучшая игра для компании.', price: 34.99, genre: 'Party', image_url: 'https://images.unsplash.com/photo-1614294149010-950b698f72c0?w=400&h=300&fit=crop', avg_rating: 4.6, rating_count: 5 },
        { title: 'Overwatch 2', description: 'Командный шутер от Blizzard.', price: 0, genre: 'Shooter', image_url: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=400&h=300&fit=crop', avg_rating: 4.0, rating_count: 25 },
        { title: 'Apex Legends', description: 'Быстрая королевская битва.', price: 0, genre: 'Shooter', image_url: 'https://images.unsplash.com/photo-1552820728-8b83bb6b2b28?w=400&h=300&fit=crop', avg_rating: 4.3, rating_count: 30 },
        { title: 'Ghost of Tsushima', description: 'Путь самурая по острову Цусима.', price: 49.99, genre: 'Action', image_url: 'https://images.unsplash.com/photo-1528164344885-47b1492b7ccd?w=400&h=300&fit=crop', avg_rating: 4.9, rating_count: 15 }
    ];

    await Game.bulkCreate(gamesData);

    // Seed some ratings
    const ratingData = [
        { user_id: 2, game_id: 1, rating: 4 },
        { user_id: 3, game_id: 1, rating: 5 },
        { user_id: 4, game_id: 1, rating: 4 },
        { user_id: 2, game_id: 2, rating: 5 },
        { user_id: 3, game_id: 2, rating: 5 },
        { user_id: 4, game_id: 2, rating: 4 },
        { user_id: 5, game_id: 2, rating: 5 },
    ];
    await Rating.bulkCreate(ratingData);

    console.log('✅ Database seeded successfully!');
    console.log('👤 Admin: admin@gamestore.com / password123');
    console.log('👤 User:  john@example.com / password123');
};

module.exports = seedData;
