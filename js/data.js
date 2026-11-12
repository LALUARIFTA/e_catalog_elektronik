// Application Data Store
const catalogProducts = [
  {
    id: 'OLED-TV-65',
    name: 'OLED TV 65" 4K Smart Hub',
    category: 'tv',
    brand: 'Sony',
    price: 24999000,
    stock: 18,
    badge: 'NEW',
    badgeColor: 'bg-brand-lime text-brand-navy',
    img: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=500&auto=format&fit=crop&q=80',
    specs: ['Dolby Vision', '120Hz Refresh', 'Google TV', 'Garansi 2Th']
  },
  {
    id: 'LAPTOP-AI-16',
    name: 'Laptop AI Workstation Pro 16"',
    category: 'laptop',
    brand: 'Asus',
    price: 31900000,
    stock: 12,
    badge: 'BEST SELLER',
    badgeColor: 'bg-amber-100 text-amber-800',
    img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=80',
    specs: ['Core Ultra 9', 'RAM 32GB', 'RTX 4070', 'OLED 3.2K']
  },
  {
    id: 'PHONE-5G-ULTRA',
    name: 'Smartphone Flagship 5G Ultra',
    category: 'phone',
    brand: 'Samsung',
    price: 19499000,
    stock: 25,
    badge: 'PROMO',
    badgeColor: 'bg-emerald-100 text-emerald-800',
    img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=80',
    specs: ['Snapdragon 8 Gen 3', '200MP Zoom', '5000mAh', 'IP68']
  },
  {
    id: 'AUDIO-HIRES-ANC',
    name: 'Hi-Res ANC Headphone Pro',
    category: 'tv',
    brand: 'Sony',
    price: 4899000,
    stock: 40,
    badge: 'HOT',
    badgeColor: 'bg-rose-100 text-rose-800',
    img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80',
    specs: ['Active Noise Cancel', '30 Jam Baterai', 'LDAC Audio', 'Foldable']
  },
  {
    id: 'ROBOT-VACUUM-HUB',
    name: 'Smart Robot Vacuum Hub v3',
    category: 'iot',
    brand: 'Dyson',
    price: 8299000,
    stock: 14,
    badge: 'NEW',
    badgeColor: 'bg-brand-lime text-brand-navy',
    img: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=500&auto=format&fit=crop&q=80',
    specs: ['LiDAR Mapping', 'Self Empty Station', 'Mopping Tech', 'App Control']
  },
  {
    id: 'CAM-MIRRORLESS-8K',
    name: 'Kamera Mirrorless 8K Studio',
    category: 'camera',
    brand: 'Sony',
    price: 42500000,
    stock: 6,
    badge: 'PRO',
    badgeColor: 'bg-purple-100 text-purple-800',
    img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&auto=format&fit=crop&q=80',
    specs: ['Full-Frame 45MP', '8K 30fps Video', 'Dual CFexpress', '5-Axis IBIS']
  }
];

// Showroom Carousel Slides
const showroomSlides = [
  {
    title: 'OLED TV 65" 4K Smart Hub',
    desc: 'Menampilkan teknologi self-lit pixels dengan kontras tak terbatas dan refresh rate 120Hz untuk pengalaman visual terbaik.',
    price: 'Rp 24.999.000',
    badge: 'FLAGSHIP DISPLAY',
    img: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=600&auto=format&fit=crop&q=80'
  },
  {
    title: 'Laptop AI Workstation Pro 16"',
    desc: 'Ditenagai prosesor NPU AI Dedicated untuk komputasi rendering cepat, Machine Learning, dan desain arsitektur berat.',
    price: 'Rp 31.900.000',
    badge: 'WORKSTATION AI',
    img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80'
  },
  {
    title: 'Smartphone Flagship 5G Ultra',
    desc: 'Kamera 200 Megapixel dengan Periscope Zoom 100x dan layar AMOLED Dynamic 2X super cerah.',
    price: 'Rp 19.499.000',
    badge: '5G SMARTPHONE',
    img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80'
  },
  {
    title: 'Hi-Res ANC Headphone Pro',
    desc: 'Peredam bising aktif generasi terbaru dengan kualitas suara resolusi tinggi nirkabel.',
    price: 'Rp 4.899.000',
    badge: 'AUDIOPHILE SOUND',
    img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80'
  }
];
