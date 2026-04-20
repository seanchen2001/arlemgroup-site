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
        id: 'blend-shizuoka-1',
        name: 'Shizuoka Nº 01',
        price: null,
        moq: '1 kg',
        cosecha: '2da y 3ra cosecha',
        variedades: 'Yabukita · Saemidori',
        proceso: 'Cultivo a pleno sol',
        notas: 'Cuerpo vegetal, notas herbáceas marcadas, amargor medio. Sostiene bien la leche sin perder presencia. Color verde oliva estable.',
        uso: 'Latte · Repostería · Bebidas frías'
      },
      {
        id: 'blend-shizuoka-2',
        name: 'Shizuoka Nº 02',
        price: null,
        moq: '2 kg',
        cosecha: '2da cosecha',
        variedades: 'Yabukita',
        proceso: 'Cultivo a pleno sol',
        notas: 'Perfil equilibrado para operaciones de alto volumen. Consistencia lote a lote. Grano fino y dispersión rápida.',
        uso: 'Food service · Batidos'
      }
    ]
  },
  {
    id: 'kyoto',
    name: 'Kyoto / Uji',
    coord: '34.8854°N · 135.7280°E',
    prefectures: ['Kyoto', 'Kyoto Fu'],
    headline: 'Sombreado tradicional. La referencia histórica.',
    blends: [
      {
        id: 'blend-uji-1',
        name: 'Uji Ceremonial',
        price: null,
        moq: 'A consultar',
        cosecha: '1ra cosecha',
        variedades: 'Samidori · Okumidori',
        proceso: 'Sombreado tradicional (tana)',
        notas: 'Dulzor profundo, umami pronunciado, amargor mínimo. Textura sedosa en boca. Color verde jade vibrante que se mantiene en taza.',
        uso: 'Ceremonial · Latte premium · Single origin'
      },
      {
        id: 'blend-uji-2',
        name: 'Uji Premium Blend',
        price: null,
        moq: 'A consultar',
        cosecha: '1ra y 2da cosecha',
        variedades: 'Samidori · Yabukita',
        proceso: 'Sombreado parcial',
        notas: 'Puente entre ceremonial y culinario. Retiene dulzor del tencha de primera, con cuerpo suficiente para aplicación en bebidas.',
        uso: 'Latte premium · Carta de autor'
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
        id: 'blend-kansai-1',
        name: 'Kansai Nº 01',
        price: null,
        moq: 'A consultar',
        cosecha: 'A confirmar',
        variedades: 'Okumidori · Yabukita',
        proceso: 'Sombreado parcial',
        notas: 'Perfil equilibrado, amargor moderado. Paleta intermedia entre el dulzor de Uji y la robustez de Shizuoka.',
        uso: 'Latte · Repostería fina'
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
        id: 'blend-kagoshima-1',
        name: 'Kagoshima Nº 01',
        price: null,
        moq: 'A consultar',
        cosecha: 'Cosecha temprana · Abril',
        variedades: 'Asatsuyu · Saemidori',
        proceso: 'Cultivo a pleno sol',
        notas: 'Frescura herbácea, notas cítricas sutiles. Color verde intenso. Excelente rendimiento en bebidas frías y soft serve.',
        uso: 'Latte · Food service · Soft serve'
      }
    ]
  }
];
