const bcrypt = require('bcryptjs');
const { db, initDb } = require('./db');

async function seed() {
  console.log('Seeding database...');
  await initDb();

  try {
    // Clear existing data
    await db.exec('DELETE FROM wishlist');
    await db.exec('DELETE FROM reviews');
    await db.exec('DELETE FROM bookings');
    await db.exec('DELETE FROM packages');
    await db.exec('DELETE FROM destinations');
    await db.exec('DELETE FROM users');
    await db.exec('DELETE FROM contact_messages');
    console.log('Cleared existing data.');

    // 1. Seed Users
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('adminpassword', salt);
    const userPassword = await bcrypt.hash('userpassword', salt);

    const adminUser = await db.run(
      `INSERT INTO users (name, email, password, role, phone, avatar_url)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        'Shailesh Kumar (Admin)',
        'admin@voyaluxe.com',
        adminPassword,
        'admin',
        '+91 9876543210',
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
      ]
    );

    const regularUser = await db.run(
      `INSERT INTO users (name, email, password, role, phone, avatar_url)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        'Aditya Verma',
        'user@voyaluxe.com',
        userPassword,
        'user',
        '+91 9988776655',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'
      ]
    );

    console.log('Users seeded.');

    // 2. Seed Destinations
    const destinationsData = [
      {
        name: 'Munnar',
        state: 'Kerala',
        description: 'Breathtaking hills, winding roads, tea plantations, and mist-covered valleys make Munnar a romantic getaway in the Western Ghats.',
        image_url: '/images/munnar.png',
        category: 'Hills'
      },
      {
        name: 'Alleppey',
        state: 'Kerala',
        description: 'Famous for its houseboat cruises through the serene backwaters, Alleppey (Alappuzha) is the Venice of the East, showing rural Kerala life.',
        image_url: '/images/alleppey.png',
        category: 'Backwaters'
      },
      {
        name: 'Ooty',
        state: 'Tamil Nadu',
        description: 'Known as the Queen of Hill Stations, Ooty offers cool weather, beautiful botanical gardens, lakes, and the historic toy train.',
        image_url: '/images/ooty.png',
        category: 'Hills'
      },
      {
        name: 'Madurai',
        state: 'Tamil Nadu',
        description: 'An ancient cultural hub, home to the magnificent Meenakshi Amman Temple, with vibrant markets and legendary South Indian food.',
        image_url: '/images/madurai.png',
        category: 'Temples'
      },
      {
        name: 'Kanyakumari',
        state: 'Tamil Nadu',
        description: 'The southern tip of mainland India, where three oceans merge. Popular for spectacular sunsets and the Vivekananda Rock Memorial.',
        image_url: '/images/kanyakumari.png',
        category: 'Beaches'
      },
      {
        name: 'Wayanad',
        state: 'Kerala',
        description: 'A spice garden paradise with lush forests, ancient caves, and waterfalls, perfect for adventure seekers and nature enthusiasts.',
        image_url: '/images/wayanad.png',
        category: 'Wildlife'
      }
    ];

    const destIds = {};
    for (const dest of destinationsData) {
      const res = await db.run(
        `INSERT INTO destinations (name, state, description, image_url, category)
         VALUES (?, ?, ?, ?, ?)`,
        [dest.name, dest.state, dest.description, dest.image_url, dest.category]
      );
      destIds[dest.name] = res.lastID;
    }
    console.log('Destinations seeded.');

    // 3. Seed Packages
    const packagesData = [
      {
        destName: 'Munnar',
        title: 'Munnar Luxury Tea Estate Escape',
        description: 'Indulge in a premium stay amidst rolling tea plantations. Includes private estate tours, tea tasting sessions, bonfire nights, and trekking to Anamudi Peak.',
        price: 18500,
        duration_days: 3,
        duration_nights: 2,
        max_people: 4,
        image_url: '/images/munnar.png'
      },
      {
        destName: 'Alleppey',
        title: 'Premium Private Houseboat Cruise',
        description: 'A magical night aboard a luxury glass-walled houseboat. Glide past coconut groves, enjoy traditional Kerala meals prepared by a personal chef, and explore narrow canals.',
        price: 24900,
        duration_days: 2,
        duration_nights: 1,
        max_people: 6,
        image_url: '/images/alleppey.png'
      },
      {
        destName: 'Ooty',
        title: 'Ooty Heritage Resort & Toy Train Experience',
        description: 'Stay at a colonial-era luxury villa. Take a first-class ride on the Nilgiri Mountain Toy Train (UNESCO Site), visit the Rose Garden, and row on Ooty Lake.',
        price: 15500,
        duration_days: 4,
        duration_nights: 3,
        max_people: 5,
        image_url: '/images/ooty.png'
      },
      {
        destName: 'Madurai',
        title: 'Divine Temple Architecture & Food Tour',
        description: 'Immerse in the culture of Madurai. Get VIP fast-track entry to Meenakshi Temple, explore Thirumalai Nayakkar Palace, and enjoy a curated street-food crawl.',
        price: 9800,
        duration_days: 2,
        duration_nights: 1,
        max_people: 8,
        image_url: '/images/madurai.png'
      },
      {
        destName: 'Kanyakumari',
        title: 'Kanyakumari Sunset Splendor & Yacht Cruise',
        description: 'Experience where three seas meet from a private yacht. Includes visits to Vivekananda Rock Memorial, Thiruvalluvar Statue, and the Gandhi Memorial with beachside stay.',
        price: 14500,
        duration_days: 3,
        duration_nights: 2,
        max_people: 4,
        image_url: '/images/kanyakumari.png'
      },
      {
        destName: 'Wayanad',
        title: 'Wayanad Rainforest Treehouse Adventure',
        description: 'Wake up to the sounds of wildlife in a premium canopy treehouse. Trek to Chembra Peak, visit the prehistoric Edakkal Caves, and enjoy bamboo rafting.',
        price: 21000,
        duration_days: 3,
        duration_nights: 2,
        max_people: 3,
        image_url: '/images/wayanad.png'
      },
      {
        destName: 'Munnar',
        title: 'Munnar Tea Valley Trek & Spice Walk',
        description: 'A deeper dive into Munnar’s ecology. Explore private cardamom and pepper gardens, trek along ridge-lines overlooking Tamil Nadu, and stay at a bio-reserve eco-lodge.',
        price: 16500,
        duration_days: 4,
        duration_nights: 3,
        max_people: 6,
        image_url: '/images/munnar.png'
      },
      {
        destName: 'Alleppey',
        title: 'Alleppey Kayaking & Village Heritage Tour',
        description: 'Experience the backwaters actively. Guided kayaking through shallow waterways inaccessible by houseboats, toddy tapping workshops, and clay-pot cooking lessons with a local family.',
        price: 13800,
        duration_days: 3,
        duration_nights: 2,
        max_people: 5,
        image_url: '/images/alleppey.png'
      },
      {
        destName: 'Ooty',
        title: 'Ooty Botanical Garden & Romantic Hill Escape',
        description: 'Ideal short retreat. Visit Pykara Lake waterfalls, take guided tours of the 170-year old Botanical Garden, and enjoy fine colonial dining in Ooty’s premium country houses.',
        price: 11500,
        duration_days: 3,
        duration_nights: 2,
        max_people: 4,
        image_url: '/images/ooty.png'
      },
      {
        destName: 'Madurai',
        title: 'Madurai Heritage & Culinary Craft Expedition',
        description: "Dive deep into Madurai's history and street foods. Includes visits to old city textile markets, Gandhi Memorial Museum, and workshops showing how traditional Madurai Sungudi sarees are woven.",
        price: 10200,
        duration_days: 3,
        duration_nights: 2,
        max_people: 6,
        image_url: '/images/madurai.png'
      }
    ];

    const packageIds = [];
    for (const pkg of packagesData) {
      const res = await db.run(
        `INSERT INTO packages (destination_id, title, description, price, duration_days, duration_nights, max_people, image_url, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
        [
          destIds[pkg.destName],
          pkg.title,
          pkg.description,
          pkg.price,
          pkg.duration_days,
          pkg.duration_nights,
          pkg.max_people,
          pkg.image_url
        ]
      );
      packageIds.push(res.lastID);
    }
    console.log('Packages seeded.');

    // 4. Seed Reviews
    await db.run(
      `INSERT INTO reviews (user_id, package_id, rating, comment)
       VALUES (?, ?, 5, 'The Munnar Tea Estate Tour was absolutely breathtaking! The villa was extremely luxurious, and the early morning trek was worth it.')`,
      [regularUser.lastID, packageIds[0]]
    );

    await db.run(
      `INSERT INTO reviews (user_id, package_id, rating, comment)
       VALUES (?, ?, 4, 'Wonderful houseboat experience in Alleppey. Food was amazing, and the staff was extremely friendly. Highly recommended for couples!')`,
      [regularUser.lastID, packageIds[1]]
    );

    await db.run(
      `INSERT INTO reviews (user_id, package_id, rating, comment)
       VALUES (?, ?, 5, 'The heritage hotel in Ooty had a beautiful vibe. The toy train ride felt like a step back in time.')`,
      [regularUser.lastID, packageIds[2]]
    );
    console.log('Reviews seeded.');

    // 5. Seed Contact Messages
    await db.run(
      `INSERT INTO contact_messages (name, email, message)
       VALUES (?, ?, ?)`,
      [
        'John Doe',
        'johndoe@example.com',
        'Hello, I would like to inquire if you customize packages for large corporate teams visiting Munnar.'
      ]
    );
    console.log('Contact messages seeded.');

    console.log('Database successfully seeded!');
  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    process.exit(0);
  }
}

if (require.main === module) {
  seed();
}
