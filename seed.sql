-- VoyaLuxe SQL Seeding Script

-- 1. Insert Seed Users (Passwords are pre-hashed using bcrypt for standard reference)
-- Admin Password: 'adminpassword' (hashed: $2a$10$xyz...)
-- User Password: 'userpassword' (hashed: $2a$10$abc...)
INSERT INTO users (name, email, password, role, phone, avatar_url) VALUES
('Shailesh Kumar (Admin)', 'admin@voyaluxe.com', '$2a$10$R9h/lIPzMRFhQ1RgpG7T/.zJ/6k3aYk6YI2J2N2e2K2K2K2K2K2K2', 'admin', '+91 9876543210', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'),
('Aditya Verma', 'user@voyaluxe.com', '$2a$10$Q9h/lIPzMRFhQ1RgpG7T/.zJ/6k3aYk6YI2J2N2e2K2K2K2K2K2K2', 'user', '+91 9988776655', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80');

-- 2. Insert Destinations
INSERT INTO destinations (id, name, state, description, image_url, category) VALUES
(1, 'Munnar', 'Kerala', 'Breathtaking hills, winding roads, tea plantations, and mist-covered valleys make Munnar a romantic getaway in the Western Ghats.', '/images/munnar.png', 'Hills'),
(2, 'Alleppey', 'Kerala', 'Famous for its houseboat cruises through the serene backwaters, Alleppey is the Venice of the East, showing rural Kerala life.', '/images/alleppey.png', 'Backwaters'),
(3, 'Ooty', 'Tamil Nadu', 'Known as the Queen of Hill Stations, Ooty offers cool weather, beautiful botanical gardens, lakes, and the historic toy train.', '/images/ooty.png', 'Hills'),
(4, 'Madurai', 'Tamil Nadu', 'An ancient cultural hub, home to the magnificent Meenakshi Amman Temple, with vibrant markets and legendary South Indian food.', '/images/madurai.png', 'Temples'),
(5, 'Kanyakumari', 'Tamil Nadu', 'The southern tip of mainland India, where three oceans merge. Popular for spectacular sunsets and the Vivekananda Rock Memorial.', '/images/kanyakumari.png', 'Beaches'),
(6, 'Wayanad', 'Kerala', 'A spice garden paradise with lush forests, ancient caves, and waterfalls, perfect for adventure seekers and nature enthusiasts.', '/images/wayanad.png', 'Wildlife');

-- 3. Insert Tour Packages
INSERT INTO packages (id, destination_id, title, description, price, duration_days, duration_nights, max_people, image_url, status) VALUES
(1, 1, 'Munnar Luxury Tea Estate Escape', 'Indulge in a premium stay amidst rolling tea plantations. Includes private estate tours, tea tasting sessions, bonfire nights, and trekking to Anamudi Peak.', 18500, 3, 2, 4, '/images/munnar.png', 'active'),
(2, 2, 'Premium Private Houseboat Cruise', 'A magical night aboard a luxury glass-walled houseboat. Glide past coconut groves, enjoy traditional Kerala meals prepared by a personal chef, and explore narrow canals.', 24900, 2, 1, 6, '/images/alleppey.png', 'active'),
(3, 3, 'Ooty Heritage Resort & Toy Train Experience', 'Stay at a colonial-era luxury villa. Take a first-class ride on the Nilgiri Mountain Toy Train (UNESCO Site), visit the Rose Garden, and row on Ooty Lake.', 15500, 4, 3, 5, '/images/ooty.png', 'active'),
(4, 4, 'Divine Temple Architecture & Food Tour', 'Immerse in the culture of Madurai. Get VIP fast-track entry to Meenakshi Temple, explore Thirumalai Nayakkar Palace, and enjoy a curated street-food crawl.', 9800, 2, 1, 8, '/images/madurai.png', 'active'),
(5, 5, 'Kanyakumari Sunset Splendor & Yacht Cruise', 'Experience where three seas meet from a private yacht. Includes visits to Vivekananda Rock Memorial, Thiruvalluvar Statue, and the Gandhi Memorial with beachside stay.', 14500, 3, 2, 4, '/images/kanyakumari.png', 'active'),
(6, 6, 'Wayanad Rainforest Treehouse Adventure', 'Wake up to the sounds of wildlife in a premium canopy treehouse. Trek to Chembra Peak, visit the prehistoric Edakkal Caves, and enjoy bamboo rafting.', 21000, 3, 2, 3, '/images/wayanad.png', 'active'),
(7, 1, 'Munnar Tea Valley Trek & Spice Walk', 'A deeper dive into Munnar’s ecology. Explore private cardamom and pepper gardens, trek along ridge-lines overlooking Tamil Nadu, and stay at a bio-reserve eco-lodge.', 16500, 4, 3, 6, '/images/munnar.png', 'active'),
(8, 2, 'Alleppey Kayaking & Village Heritage Tour', 'Experience the backwaters actively. Guided kayaking through shallow waterways inaccessible by houseboats, toddy tapping workshops, and clay-pot cooking lessons with a local family.', 13800, 3, 2, 5, '/images/alleppey.png', 'active'),
(9, 3, 'Ooty Botanical Garden & Romantic Hill Escape', 'Ideal short retreat. Visit Pykara Lake waterfalls, take guided tours of the 170-year old Botanical Garden, and enjoy fine colonial dining in Ooty’s premium country houses.', 11500, 3, 2, 4, '/images/ooty.png', 'active'),
(10, 4, 'Madurai Heritage & Culinary Craft Expedition', 'Dive deep into Madurai history and street foods. Includes visits to old city textile markets, Gandhi Memorial Museum, and workshops showing how traditional Madurai Sungudi sarees are woven.', 10200, 3, 2, 6, '/images/madurai.png', 'active');

-- 4. Insert Reviews
INSERT INTO reviews (user_id, package_id, rating, comment) VALUES
(2, 1, 5, 'The Munnar Tea Estate Tour was absolutely breathtaking! The villa was extremely luxurious, and the early morning trek was worth it.'),
(2, 2, 4, 'Wonderful houseboat experience in Alleppey. Food was amazing, and the staff was extremely friendly. Highly recommended for couples!'),
(2, 3, 5, 'The heritage hotel in Ooty had a beautiful vibe. The toy train ride felt like a step back in time.');

-- 5. Insert Contact Inquiries
INSERT INTO contact_messages (name, email, message) VALUES
('John Doe', 'johndoe@example.com', 'Hello, I would like to inquire if you customize packages for large corporate teams visiting Munnar.');
