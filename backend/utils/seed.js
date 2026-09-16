const dotenv = require('dotenv');
dotenv.config();
dotenv.config({ path: '../.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Service = require('../models/Service');
const Coupon = require('../models/Coupon');
const Banner = require('../models/Banner');
const Settings = require('../models/Settings');
const Review = require('../models/Review');
const Order = require('../models/Order');
const RepairRequest = require('../models/RepairRequest');

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/riddhi-computer';

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB at:', mongoUri);
    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected.');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Product.deleteMany({}),
      Service.deleteMany({}),
      Coupon.deleteMany({}),
      Banner.deleteMany({}),
      Settings.deleteMany({}),
      Review.deleteMany({}),
      Order.deleteMany({}),
      RepairRequest.deleteMany({}),
    ]);
    console.log('Cleared old database collections.');

    // 1. Create Users (Admin & Customer)
    const adminUser = await User.create({
      name: 'Riddhi Admin',
      email: 'admin@riddhicomputer.com',
      phone: '+919876543210',
      password: 'admin123', // will be hashed by pre-save hook
      role: 'admin',
      addresses: [{
        fullName: 'Riddhi Computer Store',
        phone: '+919876543210',
        address: 'Shop No. 12, Ground Floor, Sector 20',
        city: 'Kharghar, Navi Mumbai',
        state: 'Maharashtra',
        pincode: '410210',
        isDefault: true,
      }],
    });

    const customerUser = await User.create({
      name: 'Rahul Sharma',
      email: 'customer@gmail.com',
      phone: '+919820123456',
      password: 'customer123', // will be hashed
      role: 'customer',
      addresses: [{
        fullName: 'Rahul Sharma',
        phone: '+919820123456',
        address: 'Flat 402, Sea Breeze Heights, Sector 15',
        city: 'Kharghar, Navi Mumbai',
        state: 'Maharashtra',
        pincode: '410210',
        isDefault: true,
      }],
    });
    console.log('Seeded Users (Admin & Customer).');

    // 2. Create Categories
    const categories = await Category.create([
      {
        name: 'Laptops',
        slug: 'laptops',
        description: 'Latest high-performance gaming, business, and everyday laptops.',
        image: { url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80', publicId: 'cat_laptops' },
        featured: true,
        order: 1,
      },
      {
        name: 'Computers & Desktops',
        slug: 'computers',
        description: 'Custom gaming rigs, all-in-one PCs, and office desktop workstations.',
        image: { url: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80', publicId: 'cat_desktops' },
        featured: true,
        order: 2,
      },
      {
        name: 'Accessories',
        slug: 'accessories',
        description: 'Keyboards, mice, headsets, webcams, cables and laptop bags.',
        image: { url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80', publicId: 'cat_accessories' },
        featured: true,
        order: 3,
      },
      {
        name: 'Parts & Components',
        slug: 'components',
        description: 'SSDs, RAM modules, graphics cards, motherboards and power supplies.',
        image: { url: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&auto=format&fit=crop&q=80', publicId: 'cat_parts' },
        featured: true,
        order: 4,
      },
      {
        name: 'Printers & Peripherals',
        slug: 'printers',
        description: 'Laser & Inkjet printers, cartridges, scanners and networking routers.',
        image: { url: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800&auto=format&fit=crop&q=80', publicId: 'cat_printers' },
        featured: false,
        order: 5,
      },
    ]);
    console.log('Seeded Categories.');

    const laptopCat = categories[0]._id;
    const desktopCat = categories[1]._id;
    const accessCat = categories[2]._id;
    const componentCat = categories[3]._id;

    // 3. Create Products
    const productsData = [
      {
        name: 'HP Pavilion 15 Core i5 13th Gen',
        brand: 'HP',
        category: laptopCat,
        sku: 'HP-PAV-15-I5',
        description: 'HP Pavilion 15 with Intel Core i5-1335U 13th Gen, 16GB DDR4 RAM, 512GB NVMe SSD, 15.6" FHD Micro-Edge Display, Intel Iris Xe Graphics, Backlit Keyboard, Windows 11 Home & MS Office 2021. Ideal for students, coders, and professionals.',
        mrp: 64999,
        sellingPrice: 54990,
        stockQuantity: 12,
        specifications: {
          processor: 'Intel Core i5-1335U (10 Cores, up to 4.6 GHz)',
          ram: '16GB DDR4 3200MHz',
          storage: '512GB PCIe NVMe M.2 SSD',
          display: '15.6" Full HD (1920x1080) IPS Anti-Glare',
          graphics: 'Intel Iris Xe Graphics',
          operatingSystem: 'Windows 11 Home 64-bit',
          weight: '1.75 kg',
          warranty: '1 Year Onsite Manufacturer Warranty',
          color: 'Natural Silver',
        },
        images: [
          { url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80', publicId: 'p_hp_1' },
          { url: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&auto=format&fit=crop&q=80', publicId: 'p_hp_2' },
        ],
        thumbnail: { url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80', publicId: 'p_hp_1' },
        featured: true,
        ratings: { average: 4.8, count: 24 },
        tags: ['laptop', 'hp', 'intel', 'i5', 'bestseller'],
      },
      {
        name: 'Dell Inspiron 14 Intel Core i7 13th Gen',
        brand: 'Dell',
        category: laptopCat,
        sku: 'DELL-INSP-14-I7',
        description: 'Dell Inspiron 14 with Intel Core i7-1355U, 16GB LPDDR5 RAM, 1TB NVMe SSD, 14.0" FHD+ 16:10 ComfortView display, Fingerprint Reader, Aluminium Chassis, Thunderbolt 4 port, Fast Charging.',
        mrp: 89990,
        sellingPrice: 76990,
        stockQuantity: 8,
        specifications: {
          processor: 'Intel Core i7-1355U (10 Cores, up to 5.0 GHz)',
          ram: '16GB LPDDR5 4800MHz',
          storage: '1TB M.2 PCIe NVMe SSD',
          display: '14.0" 16:10 FHD+ (1920x1200) WVA Display',
          graphics: 'Intel Iris Xe Graphics',
          operatingSystem: 'Windows 11 Home + MS Office Home 2021',
          weight: '1.54 kg',
          warranty: '1 Year Premium Onsite Support',
          color: 'Platinum Silver',
        },
        images: [
          { url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80', publicId: 'p_dell_1' },
        ],
        thumbnail: { url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80', publicId: 'p_dell_1' },
        featured: true,
        ratings: { average: 4.9, count: 18 },
        tags: ['laptop', 'dell', 'i7', 'ultrabook', 'premium'],
      },
      {
        name: 'Lenovo IdeaPad Gaming 3 Ryzen 5 RTX 3050',
        brand: 'Lenovo',
        category: laptopCat,
        sku: 'LEN-IPG3-R5-RTX',
        description: 'Lenovo IdeaPad Gaming 3 with AMD Ryzen 5 5600H, NVIDIA GeForce RTX 3050 4GB GDDR6, 16GB RAM, 512GB SSD, 15.6" FHD 120Hz IPS, Military-grade durability, Blue backlit keyboard.',
        mrp: 72990,
        sellingPrice: 58990,
        stockQuantity: 6,
        specifications: {
          processor: 'AMD Ryzen 5 5600H (6 Cores, 12 Threads)',
          ram: '16GB DDR4 3200MHz (expandable to 32GB)',
          storage: '512GB M.2 NVMe SSD + extra SSD slot',
          display: '15.6" FHD (1920x1080) 120Hz IPS Anti-glare',
          graphics: 'NVIDIA GeForce RTX 3050 4GB GDDR6',
          operatingSystem: 'Windows 11 Home',
          weight: '2.25 kg',
          warranty: '1 Year Onsite + 3 Months Game Pass',
          color: 'Shadow Black',
        },
        images: [
          { url: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=80', publicId: 'p_len_1' },
        ],
        thumbnail: { url: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=80', publicId: 'p_len_1' },
        featured: true,
        ratings: { average: 4.7, count: 32 },
        tags: ['gaming', 'laptop', 'lenovo', 'rtx3050', 'ryzen'],
      },
      {
        name: 'Apple MacBook Air M2 13.6-inch',
        brand: 'Apple',
        category: laptopCat,
        sku: 'APL-MBA-M2-ST',
        description: 'Supercharged by Apple M2 chip with 8-core CPU and 8-core GPU, 8GB Unified Memory, 256GB SSD storage, 13.6-inch Liquid Retina Display, 1080p FaceTime HD camera, MagSafe 3 charging, up to 18 hours battery life.',
        mrp: 99900,
        sellingPrice: 87900,
        stockQuantity: 5,
        specifications: {
          processor: 'Apple M2 chip (8-core CPU, 8-core GPU)',
          ram: '8GB Unified Memory',
          storage: '256GB Superfast SSD',
          display: '13.6-inch Liquid Retina display with True Tone',
          graphics: 'Apple 8-core integrated GPU',
          operatingSystem: 'macOS Sonoma',
          weight: '1.24 kg',
          warranty: '1 Year Apple Official Warranty',
          color: 'Midnight Blue / Space Grey / Starlight',
        },
        images: [
          { url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80', publicId: 'p_mac_1' },
        ],
        thumbnail: { url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80', publicId: 'p_mac_1' },
        featured: true,
        ratings: { average: 5.0, count: 45 },
        tags: ['apple', 'macbook', 'm2', 'retina', 'premium'],
      },
      {
        name: 'Riddhi Custom Gaming Rig - Core i5 13400F + RTX 4060',
        brand: 'Riddhi Custom',
        category: desktopCat,
        sku: 'RC-DESK-GAMING-01',
        description: 'Assembled and tested in-house by Riddhi Computer certified engineers. Intel Core i5 13400F, GeForce RTX 4060 8GB, 32GB RGB DDR4 RAM, 1TB Gen4 NVMe SSD, 650W 80+ Bronze PSU, ARGB Glass Case with 4x 120mm fans. Plug & play ready.',
        mrp: 88000,
        sellingPrice: 72500,
        stockQuantity: 4,
        specifications: {
          processor: 'Intel Core i5-13400F (10 Cores, 16 Threads)',
          ram: '32GB (2x16GB) Corsair Vengeance RGB PRO 3200MHz',
          storage: '1TB Kingston NV2 PCIe 4.0 NVMe SSD',
          motherboard: 'MSI B760M PRO Gaming DDR4',
          graphics: 'ZOTAC GeForce RTX 4060 8GB GDDR6',
          powerSupply: 'Deepcool PK650D 650W 80+ Bronze',
          cabinet: 'Ant Esports ICE-410TG ARGB Gaming Cabinet',
          warranty: '3 Years Component Warranty + 1 Year Free Service',
        },
        images: [
          { url: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80', publicId: 'p_rig_1' },
        ],
        thumbnail: { url: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80', publicId: 'p_rig_1' },
        featured: true,
        ratings: { average: 4.9, count: 15 },
        tags: ['desktop', 'gaming', 'rtx4060', 'custom pc', 'kharghar'],
      },
      {
        name: 'Logitech MX Master 3S Wireless Mouse',
        brand: 'Logitech',
        category: accessCat,
        sku: 'LOGI-MXM3S-BLK',
        description: 'Quiet clicks, 8K DPI any-surface tracking including glass, MagSpeed electromagnetic scrolling, ergonomic thumb rest, multi-device connectivity up to 3 PCs.',
        mrp: 9995,
        sellingPrice: 7995,
        stockQuantity: 15,
        specifications: {
          connectivity: 'Bluetooth Low Energy & Logi Bolt USB Receiver',
          sensor: 'Darkfield High Precision (200 - 8000 DPI)',
          battery: 'Rechargeable Li-Po 500mAh (Up to 70 days per charge)',
          compatibility: 'Windows, macOS, Linux, iPadOS, ChromeOS',
          warranty: '1 Year Logitech Replacement Warranty',
        },
        images: [
          { url: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80', publicId: 'p_mouse_1' },
        ],
        thumbnail: { url: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80', publicId: 'p_mouse_1' },
        featured: false,
        ratings: { average: 4.9, count: 50 },
        tags: ['mouse', 'logitech', 'mx master', 'bluetooth', 'accessories'],
      },
      {
        name: 'Samsung 980 1TB PCIe 3.0 NVMe M.2 SSD',
        brand: 'Samsung',
        category: componentCat,
        sku: 'SAM-980-1TB-NVME',
        description: 'Upgrade your PC or laptop with blazingly fast read speeds up to 3,500 MB/s and write speeds up to 3,000 MB/s. Full Power Mode with Samsung Magician Software.',
        mrp: 8500,
        sellingPrice: 5999,
        stockQuantity: 20,
        specifications: {
          formFactor: 'M.2 2280 NVMe 1.4',
          sequentialRead: 'Up to 3,500 MB/s',
          sequentialWrite: 'Up to 3,000 MB/s',
          endurance: '600 TBW',
          warranty: '5 Years Official Samsung Warranty',
        },
        images: [
          { url: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&auto=format&fit=crop&q=80', publicId: 'p_ssd_1' },
        ],
        thumbnail: { url: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&auto=format&fit=crop&q=80', publicId: 'p_ssd_1' },
        featured: true,
        ratings: { average: 4.9, count: 68 },
        tags: ['ssd', 'samsung', 'nvme', 'storage', 'upgrade'],
      },
      {
        name: 'Crucial 16GB DDR4 3200MHz Laptop RAM',
        brand: 'Crucial',
        category: componentCat,
        sku: 'CRU-RAM-16GB-DDR4',
        description: 'Speed up your laptop responsiveness and multitasking. Easy plug-in upgrade with 100% component compatibility testing.',
        mrp: 4200,
        sellingPrice: 2899,
        stockQuantity: 25,
        specifications: {
          technology: 'DDR4 SODIMM',
          speed: '3200 MHz (PC4-25600)',
          density: '16GB Single Module',
          voltage: '1.2V',
          warranty: '10 Years Limited Lifetime Warranty',
        },
        images: [
          { url: 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=800&auto=format&fit=crop&q=80', publicId: 'p_ram_1' },
        ],
        thumbnail: { url: 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=800&auto=format&fit=crop&q=80', publicId: 'p_ram_1' },
        featured: false,
        ratings: { average: 4.8, count: 40 },
        tags: ['ram', 'crucial', 'ddr4', 'laptop ram', 'upgrade'],
      },
    ];

    const createdProducts = await Product.create(productsData);
    console.log(`Seeded ${createdProducts.length} Products.`);

    // 4. Create Services
    const servicesData = [
      {
        name: 'Laptop Screen Replacement',
        description: 'Cracked or flickering display? We replace broken LCD/LED screens with 100% genuine brand original panels for Dell, HP, Lenovo, Asus, Acer, Apple and more in under 2 hours.',
        shortDescription: 'Same-day screen replacement with 1-year warranty.',
        price: 3499,
        discountPrice: 2999,
        category: 'repair',
        icon: '🖥️',
        features: [
          'Brand new Grade-A LED/IPS panels',
          'Free brightness and dead-pixel check',
          '100% compatibility guarantee',
          '3 to 12 months warranty',
        ],
        status: 'active',
        order: 1,
      },
      {
        name: 'Laptop Motherboard Chip-Level Repair',
        description: 'Dead laptop, short-circuit, water damage, or charging IC failure? Our micro-soldering experts repair motherboards at chip level, saving you up to 70% compared to full board replacement.',
        shortDescription: 'Advanced BGA and IC chip repair with micro-soldering.',
        price: 2499,
        discountPrice: 1999,
        category: 'repair',
        icon: '⚡',
        features: [
          'Specialized microscope diagnostics',
          'Power IC, Super I/O, MOSFET replacements',
          'Water/liquid spill damage restoration',
          '3 months repair warranty',
        ],
        status: 'active',
        order: 2,
      },
      {
        name: 'High-Speed SSD & RAM Upgrade',
        description: 'Make your slow laptop or desktop 5x to 10x faster instantly. We clone your existing Windows, apps, and files with 100% zero data loss and install fast NVMe/SATA SSDs and RAM.',
        shortDescription: 'Boost system speed by 5x with zero data loss.',
        price: 1899,
        discountPrice: 1499,
        category: 'upgrade',
        icon: '🚀',
        features: [
          'Full OS & data cloning included',
          'Genuine Samsung/Crucial/Kingston SSDs',
          'Dual-channel RAM optimization',
          'Immediate dramatic speed improvement',
        ],
        status: 'active',
        order: 3,
      },
      {
        name: 'OS Installation & Virus Cleanup',
        description: 'Fresh installation of genuine Windows 10/11 or macOS, driver setup, malware/ransomware removal, browser optimization, and essential software suite setup.',
        shortDescription: 'Fresh Windows/macOS install, virus removal & drivers.',
        price: 799,
        discountPrice: 599,
        category: 'installation',
        icon: '🛡️',
        features: [
          'Official clean OS install',
          'Full driver & BIOS update',
          'Complete rootkit & spyware removal',
          'Free lifetime antivirus configuration',
        ],
        status: 'active',
        order: 4,
      },
      {
        name: 'Deep Thermal Cleaning & Fan Service',
        description: 'Overheating laptop or noisy spinning fan? We do complete disassembly, heatsink dust cleanup, and apply premium Arctic MX-4 / Thermal Grizzly thermal compound for cool and silent operation.',
        shortDescription: 'Cool down overheating laptops and fix loud fans.',
        price: 699,
        discountPrice: 499,
        category: 'maintenance',
        icon: '❄️',
        features: [
          'High-conductivity Arctic MX-4 thermal paste',
          'Fan lubrication and heatsink clearing',
          'Temperature drops by 15°C - 25°C',
          'Prevents processor throttle and crashes',
        ],
        status: 'active',
        order: 5,
      },
      {
        name: 'Doorstep Technician Home Visit',
        description: 'Don\'t have time to visit our Kharghar store? Our certified technician comes directly to your home or office anywhere in Kharghar, Navi Mumbai with diagnostic tools and replacement parts.',
        shortDescription: 'Doorstep inspection and repair in Kharghar & Navi Mumbai.',
        price: 399,
        discountPrice: 299,
        category: 'other',
        icon: '🏠',
        features: [
          'On-the-spot diagnostics and quote',
          'Repairs done right in front of you',
          'Free pickup and drop if board work required',
          'All Kharghar sectors covered',
        ],
        status: 'active',
        order: 6,
      },
    ];

    await Service.create(servicesData);
    console.log(`Seeded ${servicesData.length} Services.`);

    // 5. Create Coupons
    await Coupon.create([
      {
        code: 'WELCOME10',
        discountType: 'percentage',
        discountValue: 10,
        maxDiscount: 1000,
        minOrder: 999,
        startDate: new Date(),
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        active: true,
      },
      {
        code: 'REPAIR500',
        discountType: 'fixed',
        discountValue: 500,
        minOrder: 2000,
        startDate: new Date(),
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        active: true,
      },
      {
        code: 'FESTIVE20',
        discountType: 'percentage',
        discountValue: 20,
        maxDiscount: 2500,
        minOrder: 5000,
        startDate: new Date(),
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        active: true,
      },
    ]);
    console.log('Seeded Coupons.');

    // 6. Create Banners
    await Banner.create([
      {
        title: 'Your Trusted Laptop Sales & Repair Partner',
        subtitle: 'Shop top brand laptops, custom gaming PCs, accessories, and get instant doorstep repair in Kharghar, Navi Mumbai.',
        ctaText: 'Explore Laptops',
        ctaLink: '/laptops',
        image: { url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=1200&auto=format&fit=crop&q=80', publicId: 'banner_1' },
        status: 'active',
        order: 1,
      },
      {
        title: 'Doorstep Laptop Repair in 2 Hours',
        subtitle: 'Screen damage, dead motherboard, or slow speed? Certified engineers visit your home in Kharghar.',
        ctaText: 'Book Home Visit',
        ctaLink: '/home-repair',
        image: { url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=1200&auto=format&fit=crop&q=80', publicId: 'banner_2' },
        status: 'active',
        order: 2,
      },
    ]);
    console.log('Seeded Banners.');

    // 7. Create Site Settings
    await Settings.create({
      businessName: 'Riddhi Computer',
      tagline: 'Your Trusted Laptop & Computer Partner in Kharghar',
      phone: '+919876543210',
      whatsapp: '+919876543210',
      email: 'info@riddhicomputer.com',
      address: {
        line1: 'Shop No 12, Ground Floor',
        line2: 'Sai Aangan CHS, Sector 20',
        city: 'Kharghar',
        district: 'Navi Mumbai',
        state: 'Maharashtra',
        pincode: '410210',
      },
      deliveryCharge: 0,
      freeDeliveryAbove: 499,
      gstNumber: '27AAAAA0000A1Z5',
    });
    console.log('Seeded Settings.');

    // 8. Create Reviews
    await Review.create([
      {
        user: customerUser._id,
        userName: 'Rahul Sharma',
        product: createdProducts[0]._id,
        rating: 5,
        title: 'Excellent HP Laptop & Superfast Delivery!',
        comment: 'Bought this HP laptop from Riddhi Computer store in Kharghar. They gave the best price compared to online and set up all my required software for free. Highly recommended!',
        status: 'approved',
      },
      {
        user: customerUser._id,
        userName: 'Priya Deshmukh',
        product: createdProducts[1]._id,
        rating: 5,
        title: 'Top notch service and genuine product',
        comment: 'Dell Inspiron works flawlessly. The technician was very polite and explained all specs clearly.',
        status: 'approved',
      },
    ]);
    console.log('Seeded Reviews.');

    // 9. Create Sample Order for Customer
    await Order.create({
      user: customerUser._id,
      orderId: 'RC-179272',
      items: [{
        product: createdProducts[0]._id,
        name: createdProducts[0].name,
        image: createdProducts[0].thumbnail?.url || '',
        quantity: 1,
        mrp: createdProducts[0].mrp,
        price: createdProducts[0].sellingPrice,
        gstPercentage: 18
      }],
      shippingAddress: {
        fullName: customerUser.name,
        phone: customerUser.phone,
        email: customerUser.email,
        address: customerUser.addresses[0]?.address || 'Flat 402, Sea Breeze Heights, Sector 15',
        city: 'Kharghar, Navi Mumbai',
        state: 'Maharashtra',
        pincode: '410210'
      },
      paymentMethod: 'cod',
      paymentStatus: 'pending',
      subtotal: createdProducts[0].sellingPrice,
      total: createdProducts[0].sellingPrice,
      status: 'confirmed',
      statusHistory: [
        { status: 'placed', note: 'Order placed by customer', date: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        { status: 'confirmed', note: 'Order confirmed by store', date: new Date() }
      ]
    });
    console.log('Seeded Sample Customer Order.');

    // 10. Create Sample Repair Request for Customer
    await RepairRequest.create({
      user: customerUser._id,
      requestId: 'RPR-88294',
      customerName: customerUser.name,
      mobile: customerUser.phone,
      email: customerUser.email,
      deviceType: 'laptop',
      brand: 'HP',
      model: 'Pavilion 15',
      problem: 'Fan making loud rattling noise & system overheating',
      serviceRequired: 'laptop_cleaning',
      preferredDate: new Date('2026-08-20'),
      preferredTime: '10:00 AM - 12:00 PM',
      address: customerUser.addresses[0]?.address || 'Sector 15, Kharghar',
      homeVisit: true,
      status: 'repair_in_progress',
      statusHistory: [
        { status: 'request_received', note: 'Repair request logged', date: new Date(Date.now() - 48 * 60 * 60 * 1000) },
        { status: 'repair_in_progress', note: 'Technician working on thermal paste and fan replacement', date: new Date() }
      ]
    });
    console.log('Seeded Sample Customer Repair Request.');

    console.log('\n======================================');
    console.log('  Database Seed Completed Successfully!');
    console.log('  Admin Login: admin@riddhicomputer.com / admin123');
    console.log('  User Login:  customer@gmail.com / customer123');
    console.log('======================================\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
