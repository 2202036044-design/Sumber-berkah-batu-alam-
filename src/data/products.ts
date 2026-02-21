export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  bestSeller: boolean;
  description: string;
}

export const productsData: Product[] = [
  { id: 1, name: "Walcloding Pacito Variasi", category: "Batu Dinding", price: 270000, image: "https://picsum.photos/seed/stone1/600/600", bestSeller: true, description: "Batu alam Walcloding Pacito dengan variasi tekstur yang unik, memberikan kesan artistik dan mewah pada dinding interior maupun eksterior Anda." },
  { id: 2, name: "Walcloding 006", category: "Batu Dinding", price: 270000, image: "https://picsum.photos/seed/stone2/600/600", bestSeller: true, description: "Seri Walcloding 006 menawarkan pola yang lebih teratur namun tetap mempertahankan karakter alami batu yang kuat." },
  { id: 3, name: "Walcloding 3cm dh 2140", category: "Batu Dinding", price: 270000, image: "https://picsum.photos/seed/stone3/600/600", bestSeller: true, description: "Ketebalan 3cm memberikan dimensi kedalaman yang luar biasa, sangat cocok untuk dinding aksen yang ingin menonjol." },
  { id: 4, name: "Catur 2040 Andesit", category: "Batu Lantai", price: 155000, image: "https://picsum.photos/seed/stone4/600/600", bestSeller: true, description: "Batu Andesit dengan pola catur ukuran 20x40cm, memberikan tampilan modern dan minimalis untuk lantai teras atau carport." },
  { id: 5, name: "Camel Ziolit Candi 2040", category: "Batu Dinding", price: 350000, image: "https://picsum.photos/seed/stone5/600/600", bestSeller: true, description: "Perpaduan warna camel yang hangat dengan karakter batu candi yang eksotis, menciptakan suasana yang tenang dan natural." },
  { id: 6, name: "Bobos Lapis 2040", category: "Batu Lantai", price: 185000, image: "https://picsum.photos/seed/stone6/600/600", bestSeller: true, description: "Batu Bobos Lapis dengan tekstur yang halus namun tidak licin, pilihan ideal untuk area basah seperti pinggiran kolam renang." },
  { id: 7, name: "Walcloding htm full 3cm", category: "Batu Dinding", price: 270000, image: "https://picsum.photos/seed/stone7/600/600", bestSeller: true, description: "Warna hitam pekat yang elegan dengan ketebalan 3cm, memberikan kesan maskulin dan kokoh pada bangunan." },
  { id: 8, name: "Walcloding lock acit 2040", category: "Batu Dinding", price: 270000, image: "https://picsum.photos/seed/stone8/600/600", bestSeller: true, description: "Sistem penguncian (lock) memudahkan pemasangan dan memberikan hasil akhir yang lebih rapi dan presisi." },
  { id: 9, name: "Camel variasi 3030", category: "Batu Dinding", price: 270000, image: "https://picsum.photos/seed/stone9/600/600", bestSeller: true, description: "Ukuran 30x30cm dengan variasi warna camel yang kaya, sangat fleksibel untuk berbagai konsep desain ruangan." },
  { id: 10, name: "Ziolit 2040", category: "Batu Lantai", price: 185000, image: "https://picsum.photos/seed/stone10/600/600", bestSeller: true, description: "Batu Ziolit murni dengan warna abu-abu kehijauan yang khas, memberikan efek sejuk pada lantai hunian Anda." },
  { id: 11, name: "Andesit Bakar 3030", category: "Batu Lantai", price: 165000, image: "https://picsum.photos/seed/stone11/600/600", bestSeller: true, description: "Tekstur bakar memberikan permukaan yang kasar dan anti-slip, sangat aman untuk area outdoor yang sering terkena air." },
  { id: 12, name: "Palimanan RTA", category: "Batu Dinding", price: 195000, image: "https://picsum.photos/seed/stone12/600/600", bestSeller: true, description: "Batu Palimanan dengan tekstur Rata Alam (RTA), menonjolkan keindahan serat batu yang berwarna krem kekuningan." },
  { id: 13, name: "Koral Putih Kupang", category: "Koral & Taman", price: 85000, image: "https://picsum.photos/seed/koral1/600/600", bestSeller: false, description: "Koral putih bersih dari Kupang, memberikan kesan cerah dan rapi pada taman kering atau area dekoratif lainnya." },
  { id: 14, name: "Koral Sikat Pancawarna", category: "Koral & Taman", price: 95000, image: "https://picsum.photos/seed/koral2/600/600", bestSeller: false, description: "Kombinasi warna-warni alami koral sikat, sangat populer untuk lantai carport yang artistik dan tahan lama." },
  { id: 15, name: "Marmer Ujung Pandang", category: "Marmer", price: 450000, image: "https://picsum.photos/seed/marmer1/600/600", bestSeller: false, description: "Marmer lokal kualitas ekspor dengan motif serat yang elegan, memberikan kemewahan maksimal pada lantai interior." },
  { id: 16, name: "Marmer Statuario Italy", category: "Marmer", price: 1250000, image: "https://picsum.photos/seed/marmer2/600/600", bestSeller: false, description: "Marmer premium asal Italia dengan warna dasar putih bersih dan serat abu-abu yang dramatis." },
  { id: 17, name: "Batu Kali Belah", category: "Lain-lain", price: 45000, image: "https://picsum.photos/seed/lain1/600/600", bestSeller: false, description: "Batu kali belah alami untuk pondasi bangunan yang kokoh atau dinding pagar bergaya rustic." },
  { id: 18, name: "Semen Mortar Khusus Batu", category: "Lain-lain", price: 120000, image: "https://picsum.photos/seed/lain2/600/600", bestSeller: false, description: "Semen mortar instan dengan daya rekat tinggi, diformulasikan khusus untuk pemasangan berbagai jenis batu alam." },
  { id: 19, name: "Coating Glossy Stone", category: "Lain-lain", price: 150000, image: "https://picsum.photos/seed/lain3/600/600", bestSeller: false, description: "Cairan pelapis batu alam dengan hasil akhir mengkilap (glossy), melindungi batu dari lumut dan jamur." },
  { id: 20, name: "Coating Doff Stone", category: "Lain-lain", price: 150000, image: "https://picsum.photos/seed/lain4/600/600", bestSeller: false, description: "Cairan pelapis batu alam dengan hasil akhir natural (doff), mempertahankan warna asli batu tanpa terlihat basah." }
];

// Generate more data
for (let i = 21; i <= 210; i++) {
  const categories = ["Batu Dinding", "Batu Lantai", "Koral & Taman", "Marmer", "Lain-lain"];
  const randomCat = categories[Math.floor(Math.random() * categories.length)];
  productsData.push({
    id: i,
    name: `${randomCat} Premium Type ${i}`,
    category: randomCat,
    price: 100000 + (Math.floor(Math.random() * 20) * 50000),
    image: `https://picsum.photos/seed/stone${i}/600/600`,
    bestSeller: false,
    description: `Produk batu alam berkualitas tinggi kategori ${randomCat}. Tahan lama, estetis, dan memberikan nilai tambah pada properti Anda.`
  });
}
