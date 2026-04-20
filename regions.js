/* =====================================================================
   Kura Matcha — blend catalog (single source of truth)
   Consumed by: map.js (Japan map panel) and catalogo.html (product list)
   Prefecture names must match GeoJSON nam field from dataofjapan/land.
   ===================================================================== */

window.REGIONS = [
  {
    id: 'shizuoka',
    name: 'Shizuoka',
    coord: '34.9769°N · 138.3831°E',
    prefectures: ['Shizuoka'],
    headline: 'Cultivo a pleno sol, volumen consistente.',
    blends: [
      {
        id: 'blend-shizuoka-maki',
        name: 'Maki',
        price: null,
        moq: '1 kg',
        cosecha: '2da y 3ra cosecha · 2026',
        variedades: 'Yabukita · Tsuyuhikari · Okumidori',
        proceso: 'Cultivo a pleno sol',
        notas: 'Chicory, nuez verde, pradera silvestre. Cuerpo vegetal con amargor controlado. Excelente rendimiento en latte, smoothies y repostería. Color verde profundo estable.',
        uso: 'Latte · Repostería · Bebidas frías'
      },
      {
        id: 'blend-shizuoka-rin',
        name: 'Rin',
        price: null,
        moq: 'A consultar',
        cosecha: '1ra cosecha · 2026',
        variedades: 'Yabukita (blend)',
        proceso: 'Cultivo a pleno sol',
        notas: 'Arroz tostado, pasto primaveral, anacardo crudo. Perfil equilibrado con dulzor sutil y cuerpo medio. Sostiene bien la leche en bebidas de autor.',
        uso: 'Latte · Menú de autor'
      }
    ]
  },
  {
    id: 'kyoto',
    name: 'Kyoto',
    coord: '34.8854°N · 135.7280°E',
    prefectures: ['Kyoto', 'Kyoto Fu'],
    headline: 'La referencia histórica. Sombreado tradicional.',
    blends: [
      {
        id: 'blend-kyoto-haku',
        name: 'Haku',
        price: null,
        moq: 'A consultar',
        cosecha: '1ra cosecha · 2026',
        variedades: 'Saemidori (blend)',
        proceso: 'Sombreado tradicional (tana)',
        notas: 'Espinaca joven, cáscara de cacao, pasto seco. Umami profundo con amargor elegante. Referencia para latte premium y servicio ceremonial.',
        uso: 'Ceremonial · Latte premium · Single origin'
      },
      {
        id: 'blend-kyoto-kai',
        name: 'Kai',
        price: null,
        moq: 'A consultar',
        cosecha: '1ra cosecha · 2026',
        variedades: 'Okumidori',
        proceso: 'Sombreado tradicional (tana)',
        notas: 'Matcha ceremonial balanceado con notas vegetales suaves y final limpio. Textura sedosa. Versátil para servicio batido y latte premium.',
        uso: 'Ceremonial · Latte premium · Single origin'
      }
    ]
  },
  {
    id: 'kansai',
    name: 'Kansai',
    coord: '34.6937°N · 135.5023°E',
    prefectures: ['Osaka', 'Osaka Fu', 'Hyogo', 'Nara'],
    headline: 'Corredor productor al sur de Kyoto.',
    blends: [
      {
        id: 'blend-kansai-ichi',
        name: 'Ichi',
        price: null,
        moq: 'A consultar',
        cosecha: '1ra cosecha · 2026',
        variedades: 'Yabukita (blend)',
        proceso: 'Sombreado parcial',
        notas: 'Crema dulce, almendra verde, chocolate blanco. Dulzor expresivo con estructura limpia. Ideal para lattes con carácter sin perder elegancia.',
        uso: 'Latte premium · Carta de autor'
      }
    ]
  },
  {
    id: 'kagoshima',
    name: 'Kagoshima',
    coord: '31.5602°N · 130.5581°E',
    prefectures: ['Kagoshima'],
    headline: 'Cosecha temprana del sur. Perfil vivo.',
    blends: [
      {
        id: 'blend-kagoshima-tsuyu',
        name: 'Tsuyu',
        price: null,
        moq: 'A consultar',
        cosecha: '1ra cosecha · 2026',
        variedades: 'Saemidori · Yutakamidori',
        proceso: 'Cultivo en alturas · Kagoshima highlands',
        notas: 'Fruta de hueso, crema fresca, pasto dulce. Umami pronunciado con frescura frutal. Perfil de altura, cosecha temprana. Referencia premium de la región.',
        uso: 'Ceremonial · Latte premium · Single origin'
      },
      {
        id: 'blend-kagoshima-tsune',
        name: 'Tsune',
        price: null,
        moq: 'A consultar',
        cosecha: '2da cosecha · 2026',
        variedades: 'Yabukita',
        proceso: 'Cultivo a pleno sol',
        notas: 'Matcha de servicio diario, alto volumen. Verde claro con perfil suave. Dulzor gentil, amargor mínimo. Mezcla bien en lattes y bebidas frías.',
        uso: 'Latte · Food service · Bebidas frías'
      }
    ]
  }
];
