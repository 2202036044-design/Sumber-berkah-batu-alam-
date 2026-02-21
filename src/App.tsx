import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingCart, 
  Menu, 
  X, 
  Search, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  Mail, 
  Twitter, 
  Instagram, 
  ArrowRight,
  ChevronRight,
  Plus,
  Minus,
  Trash2
} from 'lucide-react';
import { productsData, Product } from './data/products';

interface CartItem extends Product {
  quantity: number;
}

export default function App() {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('sbba_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentFilter, setCurrentFilter] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [displayCount, setDisplayCount] = useState(12);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [notification, setNotification] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<{ image: string; title: string; desc: string } | null>(null);

  // Persistence
  useEffect(() => {
    localStorage.setItem('sbba_cart', JSON.stringify(cart));
  }, [cart]);

  // Scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
      
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setScrollProgress(scrolled);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return productsData
      .filter(p => {
        const matchesFilter = currentFilter === 'Semua' || p.category === currentFilter;
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
      })
      .sort((a, b) => (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0));
  }, [currentFilter, searchQuery]);

  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(0, displayCount);
  }, [filteredProducts, displayCount]);

  // Cart Actions
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    showToast(`${product.name} ditambahkan!`);
    setIsCartOpen(true);
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const showToast = (text: string) => {
    setNotification(text);
    setTimeout(() => setNotification(null), 2000);
  };

  const handleCheckout = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (cart.length === 0) return alert('Keranjang kosong!');

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name');
    const address = formData.get('address');

    let message = `*PESANAN BARU - SUMBER BERKAH BATU ALAM*\n\n`;
    message += `*Nama:* ${name}\n`;
    message += `*Alamat:* ${address}\n\n`;
    message += `*Daftar Pesanan:*\n`;

    cart.forEach((item, index) => {
      const subtotal = item.price * item.quantity;
      message += `${index + 1}. ${item.name} (${item.quantity} m²) - Rp ${subtotal.toLocaleString('id-ID')}\n`;
    });

    message += `\n*Total Estimasi:* Rp ${cartTotal.toLocaleString('id-ID')}\n`;
    message += `\n_Catatan: Admin akan menghitungkan ongkir berdasarkan berat total._`;

    const waUrl = `https://wa.me/6285364551484?text=${encodeURIComponent(message)}`;
    
    setCart([]);
    window.open(waUrl, '_blank');
    setIsCartOpen(false);
  };

  return (
    <div className="bg-[#F9F9F9] text-[#1A1A1A] font-sans selection:bg-[#D4AF37] selection:text-white">
      {/* Scroll Progress */}
      <div 
        className="fixed top-0 left-0 h-1 bg-[#D4AF37] z-[60] transition-all duration-100" 
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex justify-between items-center transition-all duration-300 ${isScrolled ? 'h-16 md:h-20' : 'h-20 md:h-24'}`}>
            <div className="flex items-center">
              <a href="#" className="flex items-center gap-2 md:gap-3 group">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-[#D4AF37] rounded-lg flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 5 }}
                  >
                    <ShoppingCart size={isScrolled ? 20 : 24} />
                  </motion.div>
                </div>
                <span className={`text-sm md:text-xl font-serif font-black tracking-tighter transition-colors ${isScrolled ? 'text-[#1A1A1A]' : 'text-white'}`}>
                  SUMBER <span className="text-[#D4AF37]">BERKAH</span>
                </span>
              </a>
            </div>
            
            <div className={`hidden md:flex items-center space-x-10 font-bold text-xs uppercase tracking-[0.2em] transition-colors ${isScrolled ? 'text-[#1A1A1A]' : 'text-white'}`}>
              {['Beranda', 'Tentang', 'Katalog', 'Galeri', 'Artikel', 'Lokasi'].map((item) => (
                <a 
                  key={item} 
                  href={item === 'Artikel' ? '#' : `#${item.toLowerCase()}`} 
                  className="hover:text-[#D4AF37] transition-colors relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#D4AF37] transition-all group-hover:w-full"></span>
                </a>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsCartOpen(true)}
                className={`relative p-3 rounded-xl backdrop-blur-md border transition-all group flex items-center justify-center ${
                  isScrolled 
                    ? 'bg-black/5 border-black/5 text-[#1A1A1A] hover:bg-[#D4AF37] hover:text-white' 
                    : 'bg-white/10 border-white/20 text-white hover:bg-[#D4AF37] hover:border-[#D4AF37]'
                }`}
              >
                <ShoppingCart size={20} />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-2 -right-2 bg-[#D4AF37] text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
              <button 
                className={`md:hidden p-2 transition-colors ${isScrolled ? 'text-[#1A1A1A]' : 'text-white'}`}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full right-4 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden md:hidden"
            >
              {['Beranda', 'Tentang', 'Katalog', 'Galeri', 'Artikel', 'Lokasi'].map((item) => (
                <a 
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="block px-6 py-4 text-xs font-bold uppercase tracking-widest text-[#1A1A1A] hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] border-b border-gray-50 last:border-none text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section id="beranda" className="relative h-screen flex items-center justify-center px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1920')] bg-cover bg-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"></div>
        </div>
        <div className="relative z-10 max-w-4xl text-center text-white">
          <motion.h4 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[#D4AF37] uppercase tracking-[0.4em] font-bold mb-6 text-sm"
          >
            Estetika Alam Premium
          </motion.h4>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tight"
          >
            Keindahan Abadi <br /> <span className="text-[#D4AF37]">Batu Alam</span> Pilihan
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl mb-12 text-white/90 font-medium max-w-2xl mx-auto leading-relaxed"
          >
            Menghadirkan karakter unik dan kemewahan alami pada setiap sudut hunian Anda. Pilihan terbaik untuk dinding, lantai, dan dekorasi arsitektur modern.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-5 justify-center items-center"
          >
            <a href="#katalog" className="bg-[#D4AF37] hover:bg-[#B8962E] text-white px-10 py-4 rounded-full font-bold transition-all transform hover:scale-105 shadow-xl shadow-[#D4AF37]/20">
              Jelajahi Koleksi
            </a>
            <a href="https://wa.me/6285364551484" target="_blank" className="bg-white/10 backdrop-blur-md border border-white/30 hover:bg-white/20 text-white px-10 py-4 rounded-full font-bold transition-all">
              Konsultasi Gratis
            </a>
          </motion.div>
        </div>
      </section>

      {/* Tentang Kami */}
      <section id="tentang" className="py-24 px-4 overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -top-10 -left-10 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl"></div>
              <img src="https://picsum.photos/seed/about/800/1000" alt="Tentang Kami" className="rounded-2xl shadow-2xl relative z-10" />
              <div className="absolute -bottom-6 -right-6 bg-white p-8 rounded-xl shadow-xl z-20 hidden md:block border border-gray-50">
                <p className="text-4xl font-serif font-bold text-[#D4AF37]">15+</p>
                <p className="text-xs uppercase tracking-widest font-bold text-gray-400">Tahun Pengalaman</p>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h4 className="text-[#D4AF37] uppercase tracking-widest font-bold mb-4">Tentang Kami</h4>
              <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">Kualitas Terbaik dari <br /> Tambang Pilihan</h2>
              <p className="text-gray-500 leading-relaxed mb-6">Sumber Berkah Batu Alam adalah penyedia batu alam premium yang berfokus pada kualitas material dan estetika pemasangan. Kami percaya bahwa setiap rumah memiliki cerita, dan batu alam adalah elemen yang memberikan karakter kuat pada hunian Anda.</p>
              <p className="text-gray-500 leading-relaxed mb-8">Kami melayani pengiriman ke seluruh Indonesia dengan jaminan keamanan produk hingga sampai di lokasi proyek Anda.</p>
              <ul className="space-y-4 mb-10">
                {[
                  'Material 100% Batu Alam Asli',
                  'Harga Kompetitif Langsung dari Supplier',
                  'Tim Konsultasi & Pemasangan Ahli'
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-[#D4AF37]/20 rounded-full flex items-center justify-center text-[#D4AF37]">
                      <CheckCircle2 size={14} />
                    </span>
                    <span className="font-semibold">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Katalog Produk */}
      <section id="katalog" className="py-24 bg-[#F9F9F9] px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h4 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[#D4AF37] uppercase tracking-widest font-bold mb-4"
            >
              Koleksi Produk
            </motion.h4>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold mb-8"
            >
              Katalog Batu Alam
            </motion.h2>
            
            {/* Filter & Search */}
            <div className="flex flex-col md:flex-row gap-6 justify-center items-center mt-12">
              <div className="flex flex-wrap justify-center bg-white p-1.5 rounded-3xl border border-gray-100 shadow-sm gap-1">
                {['Semua', 'Batu Dinding', 'Batu Lantai', 'Koral & Taman', 'Marmer', 'Lain-lain'].map((cat) => (
                  <button 
                    key={cat}
                    onClick={() => {
                      setCurrentFilter(cat);
                      setDisplayCount(12);
                    }}
                    className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all ${
                      currentFilter === cat 
                        ? 'bg-[#D4AF37] text-white shadow-lg shadow-[#D4AF37]/20' 
                        : 'text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="relative w-full max-w-md">
                <input 
                  type="text" 
                  placeholder="Cari produk..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-6 py-3.5 rounded-full bg-white border border-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
                />
                <Search className="h-5 w-5 absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>

          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {displayedProducts.map((p) => (
                <motion.div 
                  key={p.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group cursor-pointer border border-gray-50"
                  onClick={() => setSelectedProduct(p)}
                >
                  <div className="relative overflow-hidden h-64">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    {p.bestSeller && (
                      <span className="absolute top-4 left-4 bg-[#D4AF37] text-white text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider shadow-lg">
                        Best Seller
                      </span>
                    )}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(p);
                        }}
                        className="bg-white text-[#1A1A1A] px-6 py-2.5 rounded-full font-bold transform translate-y-4 group-hover:translate-y-0 transition-transform hover:bg-[#D4AF37] hover:text-white shadow-xl"
                      >
                        Tambah ke Keranjang
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-[10px] text-[#D4AF37] font-black uppercase tracking-widest mb-2">{p.category}</p>
                    <h3 className="text-lg font-bold mb-3 line-clamp-1">{p.name}</h3>
                    <p className="text-xl font-serif font-bold text-[#1A1A1A]">
                      Rp {p.price.toLocaleString('id-ID')}
                      <span className="text-xs font-sans text-gray-400 font-normal ml-1">/m²</span>
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {displayCount < filteredProducts.length && (
            <div className="text-center mt-16">
              <button 
                onClick={() => setDisplayCount(prev => prev + 12)}
                className="border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white px-12 py-4 rounded-full font-bold transition-all transform hover:scale-105"
              >
                Lihat Selengkapnya
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Galeri Proyek */}
      <section id="galeri" className="py-32 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <motion.h4 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[#D4AF37] uppercase tracking-widest font-black mb-4"
            >
              Inspirasi Desain
            </motion.h4>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-black mb-6 tracking-tight"
            >
              Galeri Proyek Pilihan
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-gray-500 max-w-2xl mx-auto"
            >
              Kumpulan hasil pemasangan batu alam kami yang memberikan karakter kuat pada setiap hunian.
            </motion.p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px] md:auto-rows-[250px]">
            {[
              { id: 1, title: 'Modern Minimalist', desc: 'Andesit Bakar & Candi', span: 'row-span-2', img: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=800' },
              { id: 2, title: 'Luxury Poolside', desc: 'Bobos Lapis & Ziolit', span: 'col-span-2', img: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=800' },
              { id: 3, title: 'Elegant Wall', desc: 'Walcloding Pacito', span: '', img: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800' },
              { id: 4, title: 'Rustic Terrace', desc: 'Palimanan RTA', span: '', img: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=800' },
              { id: 5, title: 'Contemporary Facade', desc: 'Walcloding 006', span: 'col-span-2 row-span-2', img: 'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&q=80&w=800' },
              { id: 6, title: 'Natural Garden', desc: 'Andesit Bakar', span: '', img: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&q=80&w=800' },
              { id: 7, title: 'Modern Exterior', desc: 'Batu Alam Mix', span: 'row-span-2', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800' },
              { id: 8, title: 'Minimalist Path', desc: 'Andesit 3030', span: '', img: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?auto=format&fit=crop&q=80&w=800' },
              { id: 9, title: 'Luxury Entrance', desc: 'Marmer Statuario', span: 'col-span-2', img: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&q=80&w=800' },
              { id: 10, title: 'Rustic Wall', desc: 'Batu Kali Belah', span: '', img: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=800' },
            ].map((item) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className={`relative group overflow-hidden rounded-2xl cursor-pointer ${item.span}`}
                onClick={() => setLightbox({ image: item.img, title: item.title, desc: item.desc })}
              >
                <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="text-center text-white p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                    <h4 className="font-bold text-xl mb-1">{item.title}</h4>
                    <p className="text-sm opacity-80">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Artikel Terbaru */}
      <section className="py-24 bg-[#F9F9F9] px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h4 className="text-[#D4AF37] uppercase tracking-widest font-bold mb-4">Blog & Tips</h4>
            <h2 className="text-4xl font-bold">Artikel Terbaru</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              { cat: 'Tips Interior', title: 'Cara Merawat Batu Alam Agar Tetap Berkilau', desc: 'Batu alam memerlukan perawatan khusus agar tekstur dan warnanya tidak pudar seiring waktu...', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800' },
              { cat: 'Tren Desain', title: '5 Jenis Batu Alam Terpopuler untuk Dinding Luar', desc: 'Memilih batu alam untuk eksterior harus mempertimbangkan ketahanan terhadap cuaca ekstrem...', img: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=800' },
              { cat: 'Panduan', title: 'Mengenal Perbedaan Tekstur Batu Andesit dan Palimanan', desc: 'Setiap jenis batu memiliki karakteristik unik yang cocok untuk fungsi ruangan yang berbeda...', img: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800' },
            ].map((art, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group cursor-pointer bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all"
              >
                <div className="overflow-hidden h-64">
                  <img src={art.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="p-8">
                  <p className="text-[#D4AF37] text-[10px] font-black uppercase tracking-widest mb-4">{art.cat}</p>
                  <h3 className="text-2xl font-black mb-4 group-hover:text-[#D4AF37] transition-colors leading-tight">{art.title}</h3>
                  <p className="text-gray-500 text-sm mb-8 leading-relaxed">{art.desc}</p>
                  <a href="#" className="inline-flex items-center gap-2 font-black text-sm text-[#D4AF37] border-b-2 border-[#D4AF37] pb-1 hover:gap-4 transition-all">
                    Baca Selengkapnya
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lokasi Cabang */}
      <section id="lokasi" className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h4 className="text-[#D4AF37] uppercase tracking-widest font-bold mb-4">Kunjungi Kami</h4>
            <h2 className="text-4xl font-bold">Lokasi Cabang</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { city: 'Jakarta', address: 'Jl. Raya Jakarta No. 123, Jakarta Selatan. Melayani area Jabodetabek.' },
              { city: 'Tangerang', address: 'Kawasan Industri Tangerang, Blok C2. Pusat distribusi utama.' },
              { city: 'Bekasi', address: 'Jl. Harapan Indah No. 45, Bekasi Utara. Showroom terlengkap.' },
            ].map((loc, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-[#F9F9F9] p-8 rounded-2xl border border-gray-100 hover:shadow-xl transition-all group"
              >
                <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-full flex items-center justify-center text-[#D4AF37] mb-6 group-hover:bg-[#D4AF37] group-hover:text-white transition-colors">
                  <MapPin size={24} />
                </div>
                <h3 className="text-xl font-bold mb-4">{loc.city}</h3>
                <p className="text-gray-500 text-sm mb-6 leading-relaxed">{loc.address}</p>
                <a href="https://maps.app.goo.gl/abMSfc2p4LSUS24F8" target="_blank" className="text-[#D4AF37] font-bold text-sm flex items-center gap-2 hover:gap-4 transition-all">
                  Buka Google Maps <ArrowRight size={16} />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1A1A1A] text-white pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-1">
              <a href="#" className="text-2xl font-serif font-bold tracking-tighter mb-6 block">
                SUMBER <span className="text-[#D4AF37]">BERKAH</span>
              </a>
              <p className="text-gray-400 text-sm leading-relaxed mb-8">Penyedia batu alam berkualitas tinggi untuk kebutuhan konstruksi dan dekorasi hunian Anda sejak 2010.</p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-[#D4AF37] transition-colors">
                  <Twitter size={18} />
                </a>
                <a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-[#D4AF37] transition-colors">
                  <Instagram size={18} />
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-6 uppercase tracking-widest text-xs">Navigasi</h4>
              <ul className="space-y-4 text-gray-400 text-sm">
                {['Beranda', 'Tentang Kami', 'Katalog Produk', 'Galeri Proyek'].map(item => (
                  <li key={item}><a href={`#${item.toLowerCase().split(' ')[0]}`} className="hover:text-[#D4AF37] transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 uppercase tracking-widest text-xs">Kategori</h4>
              <ul className="space-y-4 text-gray-400 text-sm">
                {['Batu Dinding', 'Batu Lantai', 'Batu Taman', 'Aksesoris'].map(item => (
                  <li key={item}><a href="#katalog" className="hover:text-[#D4AF37] transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 uppercase tracking-widest text-xs">Kontak</h4>
              <ul className="space-y-4 text-gray-400 text-sm">
                <li className="flex items-start gap-3">
                  <Phone size={18} className="text-[#D4AF37] shrink-0" />
                  +62 853-6455-1484
                </li>
                <li className="flex items-start gap-3">
                  <Mail size={18} className="text-[#D4AF37] shrink-0" />
                  info@sumberberkah.com
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-gray-500 text-[10px] uppercase tracking-widest text-center md:text-left">© 2026 Sumber Berkah Batu Alam. All Rights Reserved.</p>
            <div className="flex gap-8 text-[10px] uppercase tracking-widest text-gray-500">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            <motion.aside 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 w-full max-w-md h-full bg-white z-[70] shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-xl font-bold">Keranjang Belanja</h2>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                    <ShoppingCart size={64} strokeWidth={1} className="mb-4 opacity-20" />
                    <p className="font-medium">Keranjang Anda masih kosong</p>
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="flex items-center gap-4 group">
                      <div className="w-20 h-20 shrink-0 overflow-hidden rounded-xl border border-gray-100">
                        <img src={item.image} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm truncate">{item.name}</h4>
                        <p className="text-[#D4AF37] text-sm font-serif font-bold">Rp {item.price.toLocaleString('id-ID')}</p>
                        <div className="flex items-center gap-3 mt-3">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-7 h-7 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-sm font-black w-6 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-7 h-7 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="p-6 border-t border-gray-100 bg-[#F9F9F9]">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-500 font-medium">Total Estimasi</span>
                  <span className="text-2xl font-serif font-bold text-[#D4AF37]">Rp {cartTotal.toLocaleString('id-ID')}</span>
                </div>
                
                <form onSubmit={handleCheckout} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Nama Lengkap</label>
                    <input 
                      name="name"
                      type="text" 
                      required 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Alamat Pengiriman</label>
                    <textarea 
                      name="address"
                      required 
                      rows={3} 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
                    ></textarea>
                  </div>
                  <p className="text-[10px] text-gray-400 italic">*Admin akan menghitungkan ongkir berdasarkan berat total pesanan Anda.</p>
                  <button 
                    type="submit" 
                    disabled={cart.length === 0}
                    className="w-full bg-[#D4AF37] hover:bg-[#B8962E] disabled:bg-gray-300 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-[#D4AF37]/20"
                  >
                    Checkout via WhatsApp
                  </button>
                </form>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Product Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[80]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 z-[90] flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl relative pointer-events-auto">
                <button 
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-6 right-6 p-2 bg-white/80 backdrop-blur-md rounded-full text-[#1A1A1A] hover:bg-[#D4AF37] hover:text-white transition-all z-10 shadow-lg"
                >
                  <X size={20} />
                </button>
                <div className="p-8 md:p-12">
                  <div className="grid md:grid-cols-2 gap-12">
                    <div className="relative h-80 md:h-full min-h-[350px] rounded-2xl overflow-hidden shadow-inner">
                      <img src={selectedProduct.image} alt={selectedProduct.name} className="absolute inset-0 w-full h-full object-cover" />
                      {selectedProduct.bestSeller && (
                        <span className="absolute top-4 left-4 bg-[#D4AF37] text-white text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider shadow-lg">
                          Best Seller
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col justify-center">
                      <p className="text-[10px] text-[#D4AF37] font-black uppercase tracking-[0.3em] mb-4">{selectedProduct.category}</p>
                      <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">{selectedProduct.name}</h2>
                      <p className="text-3xl font-serif font-bold text-[#1A1A1A] mb-8">
                        Rp {selectedProduct.price.toLocaleString('id-ID')}
                        <span className="text-sm font-sans text-gray-400 font-normal ml-1">/m²</span>
                      </p>
                      <div className="prose prose-sm text-gray-500 mb-10 leading-relaxed">
                        <p>{selectedProduct.description}</p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <button 
                          onClick={() => {
                            addToCart(selectedProduct);
                            setSelectedProduct(null);
                          }}
                          className="flex-1 bg-[#D4AF37] hover:bg-[#B8962E] text-white py-4 rounded-xl font-bold transition-all shadow-xl shadow-[#D4AF37]/20 flex items-center justify-center gap-2"
                        >
                          <ShoppingCart size={18} /> Tambah ke Keranjang
                        </button>
                        <a 
                          href={`https://wa.me/6285364551484?text=Halo Admin, saya ingin bertanya tentang produk: ${selectedProduct.name}`} 
                          target="_blank" 
                          className="flex-1 border-2 border-gray-100 hover:border-[#D4AF37] hover:text-[#D4AF37] py-4 rounded-xl font-bold text-center transition-all"
                        >
                          Tanya Admin
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightbox && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => setLightbox(null)}></div>
            <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center">
              <button 
                onClick={() => setLightbox(null)}
                className="absolute -top-16 right-0 text-white hover:text-[#D4AF37] transition-colors"
              >
                <X size={40} />
              </button>
              <motion.img 
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                src={lightbox.image} 
                className="max-w-full max-h-[70vh] object-contain rounded-2xl shadow-2xl" 
              />
              <div className="mt-8 text-center text-white">
                <h4 className="text-2xl font-black mb-2">{lightbox.title}</h4>
                <p className="text-gray-400">{lightbox.desc}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="fixed bottom-24 left-1/2 bg-[#1A1A1A] text-white px-6 py-3 rounded-full shadow-2xl z-[200] flex items-center gap-3"
          >
            <CheckCircle2 size={20} className="text-[#D4AF37]" />
            <span className="text-sm font-bold">{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating WA */}
      <motion.a 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1, rotate: 10 }}
        href="https://wa.me/6285364551484" 
        target="_blank" 
        className="wa-float fixed bottom-8 right-8 bg-[#25D366] text-white w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-2xl z-50"
        title="Hubungi Kami via WhatsApp"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-8 h-8">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.588-5.946 0-6.556 5.332-11.891 11.891-11.891 3.181 0 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.481 8.403 0 6.556-5.332 11.891-11.891 11.891-2.01 0-3.98-.51-5.725-1.479l-6.269 1.647zm5.99-4.469l.303.18c1.483.882 3.19 1.35 4.933 1.35 5.407 0 9.808-4.401 9.808-9.808 0-2.621-1.022-5.086-2.877-6.942-1.854-1.855-4.318-2.877-6.931-2.877-5.407 0-9.808 4.401-9.808 9.808 0 2.029.544 4.016 1.571 5.711l.197.325-1.011 3.689 3.789-.996zm11.333-6.818c-.328-.164-1.94-.957-2.241-1.067-.301-.11-.52-.164-.738.164-.219.328-.848 1.067-1.039 1.286-.192.219-.383.246-.711.082-.328-.164-1.386-.511-2.641-1.63-1.039-.926-1.74-2.071-1.944-2.427-.204-.355-.022-.547.142-.711.147-.147.328-.383.492-.575.164-.192.219-.328.328-.547.11-.219.055-.411-.027-.575-.082-.164-.738-1.778-1.011-2.435-.267-.641-.539-.554-.738-.564-.192-.01-.41-.01-.629-.01s-.575.082-.875.411c-.3.328-1.148 1.123-1.148 2.738 0 1.615 1.176 3.176 1.339 3.395.164.219 2.313 3.532 5.603 4.954.783.339 1.393.541 1.87.693.785.249 1.5.214 2.066.129.63-.095 1.94-.794 2.214-1.56.274-.767.274-1.423.192-1.56-.082-.137-.3-.219-.629-.383z"/>
        </svg>
      </motion.a>
    </div>
  );
}
