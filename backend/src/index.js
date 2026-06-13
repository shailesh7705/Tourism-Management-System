const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db, initDb } = require('./db');
const { verifyToken, verifyAdmin, JWT_SECRET } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Database Schema on start
initDb();

// ----------------------------------------------------
// 1. AUTHENTICATION ENDPOINTS
// ----------------------------------------------------

// User Registration
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  try {
    const existingUser = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already registered.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await db.run(
      `INSERT INTO users (name, email, password, role, phone, avatar_url)
       VALUES (?, ?, ?, 'user', ?, ?)`,
      [
        name,
        email,
        hashedPassword,
        phone || null,
        `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`
      ]
    );

    const token = jwt.sign(
      { id: result.lastID, email, role: 'user', name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: { id: result.lastID, name, email, role: 'user', phone }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during registration.' });
  }
});

// User Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar_url: user.avatar_url
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during login.' });
  }
});

// Get Current User Profile
app.get('/api/auth/me', verifyToken, async (req, res) => {
  try {
    const user = await db.get(
      'SELECT id, name, email, role, phone, avatar_url, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error retrieving profile.' });
  }
});

// Update Profile
app.put('/api/auth/profile', verifyToken, async (req, res) => {
  const { name, phone, password, avatar_url } = req.body;

  try {
    let sql = 'UPDATE users SET name = ?, phone = ?, avatar_url = ?';
    const params = [name, phone, avatar_url];

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      sql += ', password = ?';
      params.push(hashedPassword);
    }

    sql += ' WHERE id = ?';
    params.push(req.user.id);

    await db.run(sql, params);
    
    const updatedUser = await db.get(
      'SELECT id, name, email, role, phone, avatar_url FROM users WHERE id = ?',
      [req.user.id]
    );

    res.json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error updating profile.' });
  }
});


// ----------------------------------------------------
// 2. DESTINATION ENDPOINTS
// ----------------------------------------------------

// Get All Destinations (with state/category filter)
app.get('/api/destinations', async (req, res) => {
  const { state, category } = req.query;
  let sql = 'SELECT * FROM destinations';
  const params = [];

  if (state || category) {
    sql += ' WHERE ';
    const filters = [];
    if (state) {
      filters.push('state = ?');
      params.push(state);
    }
    if (category) {
      filters.push('category = ?');
      params.push(category);
    }
    sql += filters.join(' AND ');
  }

  try {
    const destinations = await db.all(sql, params);
    res.json(destinations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error loading destinations.' });
  }
});

// Get Destination Details (includes packages and reviews)
app.get('/api/destinations/:id', async (req, res) => {
  try {
    const destination = await db.get('SELECT * FROM destinations WHERE id = ?', [req.params.id]);
    if (!destination) {
      return res.status(404).json({ error: 'Destination not found.' });
    }

    const packages = await db.all('SELECT * FROM packages WHERE destination_id = ?', [destination.id]);
    
    // Add avg rating to packages
    for (const pkg of packages) {
      const ratingInfo = await db.get(
        'SELECT AVG(rating) as avgRating, COUNT(*) as count FROM reviews WHERE package_id = ?',
        [pkg.id]
      );
      pkg.rating = ratingInfo.avgRating ? parseFloat(ratingInfo.avgRating.toFixed(1)) : 0;
      pkg.reviewsCount = ratingInfo.count;
    }

    res.json({ ...destination, packages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error loading destination details.' });
  }
});

// Create Destination (Admin only)
app.post('/api/destinations', verifyAdmin, async (req, res) => {
  const { name, state, description, image_url, category } = req.body;

  if (!name || !state || !description || !image_url || !category) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const result = await db.run(
      `INSERT INTO destinations (name, state, description, image_url, category)
       VALUES (?, ?, ?, ?, ?)`,
      [name, state, description, image_url, category]
    );
    res.status(201).json({ id: result.lastID, name, state, description, image_url, category });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error creating destination.' });
  }
});

// Update Destination (Admin only)
app.put('/api/destinations/:id', verifyAdmin, async (req, res) => {
  const { name, state, description, image_url, category } = req.body;

  try {
    await db.run(
      `UPDATE destinations
       SET name = ?, state = ?, description = ?, image_url = ?, category = ?
       WHERE id = ?`,
      [name, state, description, image_url, category, req.params.id]
    );
    res.json({ message: 'Destination updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error updating destination.' });
  }
});

// Delete Destination (Admin only)
app.delete('/api/destinations/:id', verifyAdmin, async (req, res) => {
  try {
    await db.run('DELETE FROM destinations WHERE id = ?', [req.params.id]);
    res.json({ message: 'Destination deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error deleting destination.' });
  }
});


// ----------------------------------------------------
// 3. PACKAGES ENDPOINTS
// ----------------------------------------------------

// Get All Packages (with filter)
app.get('/api/packages', async (req, res) => {
  const { maxBudget, state, duration } = req.query;
  
  let sql = `
    SELECT p.*, d.name as destination_name, d.state as destination_state 
    FROM packages p
    JOIN destinations d ON p.destination_id = d.id
    WHERE p.status = 'active'
  `;
  const params = [];

  if (maxBudget) {
    sql += ' AND p.price <= ?';
    params.push(maxBudget);
  }
  if (state) {
    sql += ' AND d.state = ?';
    params.push(state);
  }
  if (duration) {
    sql += ' AND p.duration_days <= ?';
    params.push(duration);
  }

  try {
    const packages = await db.all(sql, params);
    
    // Add reviews metadata
    for (const pkg of packages) {
      const ratingInfo = await db.get(
        'SELECT AVG(rating) as avgRating, COUNT(*) as count FROM reviews WHERE package_id = ?',
        [pkg.id]
      );
      pkg.rating = ratingInfo.avgRating ? parseFloat(ratingInfo.avgRating.toFixed(1)) : 0;
      pkg.reviewsCount = ratingInfo.count;
    }

    res.json(packages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error loading packages.' });
  }
});

// Get Detailed Package (includes destination info and reviews with reviewer names)
app.get('/api/packages/:id', async (req, res) => {
  try {
    const pkg = await db.get(
      `SELECT p.*, d.name as destination_name, d.state as destination_state, d.description as destination_desc
       FROM packages p
       JOIN destinations d ON p.destination_id = d.id
       WHERE p.id = ?`,
      [req.params.id]
    );

    if (!pkg) {
      return res.status(404).json({ error: 'Package not found.' });
    }

    const reviews = await db.all(
      `SELECT r.*, u.name as user_name, u.avatar_url 
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.package_id = ?
       ORDER BY r.created_at DESC`,
      [pkg.id]
    );

    const ratingInfo = await db.get(
      'SELECT AVG(rating) as avgRating FROM reviews WHERE package_id = ?',
      [pkg.id]
    );
    
    pkg.rating = ratingInfo.avgRating ? parseFloat(ratingInfo.avgRating.toFixed(1)) : 0;
    pkg.reviews = reviews;

    res.json(pkg);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error loading package details.' });
  }
});

// Create Package (Admin only)
app.post('/api/packages', verifyAdmin, async (req, res) => {
  const { destination_id, title, description, price, duration_days, duration_nights, max_people, image_url } = req.body;

  if (!destination_id || !title || !price || !duration_days || !duration_nights || !max_people || !image_url) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const result = await db.run(
      `INSERT INTO packages (destination_id, title, description, price, duration_days, duration_nights, max_people, image_url, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
      [destination_id, title, description, price, duration_days, duration_nights, max_people, image_url]
    );
    res.status(201).json({ id: result.lastID, ...req.body });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error creating package.' });
  }
});

// Update Package (Admin only)
app.put('/api/packages/:id', verifyAdmin, async (req, res) => {
  const { destination_id, title, description, price, duration_days, duration_nights, max_people, image_url, status } = req.body;

  try {
    await db.run(
      `UPDATE packages
       SET destination_id = ?, title = ?, description = ?, price = ?, duration_days = ?, duration_nights = ?, max_people = ?, image_url = ?, status = ?
       WHERE id = ?`,
      [destination_id, title, description, price, duration_days, duration_nights, max_people, image_url, status || 'active', req.params.id]
    );
    res.json({ message: 'Package updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error updating package.' });
  }
});

// Delete Package (Admin only)
app.delete('/api/packages/:id', verifyAdmin, async (req, res) => {
  try {
    await db.run('DELETE FROM packages WHERE id = ?', [req.params.id]);
    res.json({ message: 'Package deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error deleting package.' });
  }
});


// ----------------------------------------------------
// 4. BOOKINGS ENDPOINTS
// ----------------------------------------------------

// Create Booking (User only)
app.post('/api/bookings', verifyToken, async (req, res) => {
  const { package_id, travel_date, total_guests } = req.body;

  if (!package_id || !travel_date || !total_guests) {
    return res.status(400).json({ error: 'Package ID, travel date, and guest count are required.' });
  }

  try {
    const pkg = await db.get('SELECT * FROM packages WHERE id = ?', [package_id]);
    if (!pkg) {
      return res.status(404).json({ error: 'Tour package not found.' });
    }

    if (total_guests > pkg.max_people) {
      return res.status(400).json({ error: `Maximum size limit is ${pkg.max_people} guests.` });
    }

    const totalPrice = pkg.price * total_guests;

    const result = await db.run(
      `INSERT INTO bookings (user_id, package_id, travel_date, total_guests, total_price, status, payment_status)
       VALUES (?, ?, ?, ?, ?, 'pending', 'unpaid')`,
      [req.user.id, package_id, travel_date, total_guests, totalPrice]
    );

    res.status(201).json({
      message: 'Booking created successfully. Awaiting approval.',
      bookingId: result.lastID,
      totalPrice
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error processing booking.' });
  }
});

// Get Current User's Booking History
app.get('/api/bookings/my-bookings', verifyToken, async (req, res) => {
  try {
    const bookings = await db.all(
      `SELECT b.*, p.title as package_title, p.image_url as package_image, p.duration_days, p.duration_nights, d.name as destination_name
       FROM bookings b
       JOIN packages p ON b.package_id = p.id
       JOIN destinations d ON p.destination_id = d.id
       WHERE b.user_id = ?
       ORDER BY b.booking_date DESC`,
      [req.user.id]
    );
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching bookings.' });
  }
});

// Get All Bookings (Admin only)
app.get('/api/bookings', verifyAdmin, async (req, res) => {
  try {
    const bookings = await db.all(
      `SELECT b.*, u.name as user_name, u.email as user_email, p.title as package_title, d.name as destination_name
       FROM bookings b
       JOIN users u ON b.user_id = u.id
       JOIN packages p ON b.package_id = p.id
       JOIN destinations d ON p.destination_id = d.id
       ORDER BY b.booking_date DESC`
    );
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error loading admin bookings.' });
  }
});

// Update Booking Status Approve/Reject (Admin only)
app.put('/api/bookings/:id/status', verifyAdmin, async (req, res) => {
  const { status } = req.body;

  if (!['approved', 'rejected', 'pending'].includes(status)) {
    return res.status(400).json({ error: 'Invalid booking status.' });
  }

  try {
    const booking = await db.get('SELECT * FROM bookings WHERE id = ?', [req.params.id]);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found.' });
    }

    // Automatically mark payment status paid if booking approved
    let paymentStatus = booking.payment_status;
    if (status === 'approved') {
      paymentStatus = 'paid';
    }

    await db.run(
      'UPDATE bookings SET status = ?, payment_status = ? WHERE id = ?',
      [status, paymentStatus, req.params.id]
    );

    res.json({ message: `Booking status updated to ${status}.` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error updating booking status.' });
  }
});


// ----------------------------------------------------
// 5. REVIEWS ENDPOINTS
// ----------------------------------------------------

// Submit Package Review (User only)
app.post('/api/reviews', verifyToken, async (req, res) => {
  const { package_id, rating, comment } = req.body;

  if (!package_id || !rating) {
    return res.status(400).json({ error: 'Package ID and rating are required.' });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5.' });
  }

  try {
    // Check if user already reviewed this package
    const existing = await db.get(
      'SELECT id FROM reviews WHERE user_id = ? AND package_id = ?',
      [req.user.id, package_id]
    );

    if (existing) {
      await db.run(
        'UPDATE reviews SET rating = ?, comment = ? WHERE id = ?',
        [rating, comment || null, existing.id]
      );
      return res.json({ message: 'Review updated successfully' });
    }

    await db.run(
      `INSERT INTO reviews (user_id, package_id, rating, comment)
       VALUES (?, ?, ?, ?)`,
      [req.user.id, package_id, rating, comment || null]
    );

    res.status(201).json({ message: 'Review posted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error posting review.' });
  }
});


// ----------------------------------------------------
// 6. WISHLIST ENDPOINTS
// ----------------------------------------------------

// Get Wishlist items
app.get('/api/wishlist', verifyToken, async (req, res) => {
  try {
    const list = await db.all(
      `SELECT w.id as wishlist_id, p.*, d.name as destination_name
       FROM wishlist w
       JOIN packages p ON w.package_id = p.id
       JOIN destinations d ON p.destination_id = d.id
       WHERE w.user_id = ?`,
      [req.user.id]
    );
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error loading wishlist.' });
  }
});

// Add to Wishlist
app.post('/api/wishlist', verifyToken, async (req, res) => {
  const { package_id } = req.body;

  if (!package_id) {
    return res.status(400).json({ error: 'Package ID is required.' });
  }

  try {
    await db.run(
      'INSERT OR IGNORE INTO wishlist (user_id, package_id) VALUES (?, ?)',
      [req.user.id, package_id]
    );
    res.status(201).json({ message: 'Added to wishlist.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error adding to wishlist.' });
  }
});

// Remove from Wishlist
app.delete('/api/wishlist/:id', verifyToken, async (req, res) => {
  try {
    // Allow deleting by package_id
    await db.run(
      'DELETE FROM wishlist WHERE user_id = ? AND package_id = ?',
      [req.user.id, req.params.id]
    );
    res.json({ message: 'Removed from wishlist.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error removing from wishlist.' });
  }
});


// ----------------------------------------------------
// 7. CONTACT FORM ENDPOINTS
// ----------------------------------------------------

// Submit Message
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    await db.run(
      'INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)',
      [name, email, message]
    );
    res.status(201).json({ message: 'Thank you for your message. We will get back to you shortly!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error sending message.' });
  }
});

// Get Messages (Admin only)
app.get('/api/contact', verifyAdmin, async (req, res) => {
  try {
    const messages = await db.all('SELECT * FROM contact_messages ORDER BY created_at DESC');
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error loading messages.' });
  }
});


// ----------------------------------------------------
// 8. ADMIN DASHBOARD STATS
// ----------------------------------------------------
app.get('/api/admin/stats', verifyAdmin, async (req, res) => {
  try {
    const totalRevenueRow = await db.get(
      "SELECT SUM(total_price) as total FROM bookings WHERE status = 'approved'"
    );
    const totalBookingsRow = await db.get('SELECT COUNT(*) as count FROM bookings');
    const totalUsersRow = await db.get("SELECT COUNT(*) as count FROM users WHERE role = 'user'");
    const totalPackagesRow = await db.get('SELECT COUNT(*) as count FROM packages');
    const totalDestinationsRow = await db.get('SELECT COUNT(*) as count FROM destinations');

    // Revenue per month (simple aggregation)
    const monthlyRevenue = await db.all(
      `SELECT strftime('%m', booking_date) as month, SUM(total_price) as revenue 
       FROM bookings 
       WHERE status = 'approved'
       GROUP BY month`
    );

    // Bookings split by destination state (Kerala vs TN)
    const stateSplit = await db.all(
      `SELECT d.state, COUNT(b.id) as count
       FROM bookings b
       JOIN packages p ON b.package_id = p.id
       JOIN destinations d ON p.destination_id = d.id
       GROUP BY d.state`
    );

    // Recent Bookings (limit 5)
    const recentBookings = await db.all(
      `SELECT b.*, u.name as user_name, p.title as package_title
       FROM bookings b
       JOIN users u ON b.user_id = u.id
       JOIN packages p ON b.package_id = p.id
       ORDER BY b.booking_date DESC
       LIMIT 5`
    );

    res.json({
      revenue: totalRevenueRow.total || 0,
      bookingsCount: totalBookingsRow.count || 0,
      usersCount: totalUsersRow.count || 0,
      packagesCount: totalPackagesRow.count || 0,
      destinationsCount: totalDestinationsRow.count || 0,
      monthlyRevenue,
      stateSplit,
      recentBookings
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error loading dashboard analytics.' });
  }
});


// Start server
app.listen(PORT, () => {
  console.log(`Tourism Management System Backend Server is running on port ${PORT}`);
});
