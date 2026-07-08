import { Product } from './types';

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'etz-p1',
    name: 'Vintage Brown Corduroy Jacket',
    price: 450,
    category: 'mens',
    size: 'L (Chest: 44", Length: 28")',
    condition: 'Like New',
    conditionNote: 'Crisp collar, deep color, zero fading or fabric wear. All original brass buttons intact.',
    quantity: 1,
    images: [
      '/images/mens_vintage_jacket_1783176811459.jpg',
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=600&q=80'
    ],
    description: 'A heavyweight, incredibly warm corduroy jacket in a rich chestnut brown. Perfect for cool evenings. Hand-brushed and sanitized.',
    isSold: false,
    dateAdded: '2026-06-30'
  },
  {
    id: 'etz-p2',
    name: 'Cottagecore Linen Floral Dress',
    price: 490,
    category: 'womens',
    size: 'M (Bust: 36", Waist: 28-30" stretch, Length: 42")',
    condition: 'Like New',
    conditionNote: 'Perfect seams, no piling or color fading. Includes the original linen belt tie.',
    quantity: 1,
    images: [
      '/images/womens_floral_dress_1783176824055.jpg',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80'
    ],
    description: 'An elegant floral print midi dress made of durable, breathable flax linen. Fitted waist with a flowing skirt. Perfect for weekend markets or beach strolls.',
    isSold: false,
    dateAdded: '2026-07-01'
  },
  {
    id: 'etz-p3',
    name: 'Durable Denim Kids Overalls',
    price: 180,
    category: 'kids',
    size: '4-5 Years (Height: 104-110cm)',
    condition: 'Gently Loved',
    conditionNote: 'Slight softening of the denim around the knees, which actually makes it extra comfortable. No tears or stains.',
    quantity: 1,
    images: [
      '/images/kids_denim_overalls_1783176838795.jpg',
      'https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=600&q=80'
    ],
    description: 'Thick, high-quality dark-wash denim overalls that can handle any playground adventure. Adjustable shoulder straps and sturdy side buttons.',
    isSold: false,
    dateAdded: '2026-07-02'
  },
  {
    id: 'etz-p4',
    name: 'Vintage Tan Leather Messenger Satchel',
    price: 550,
    category: 'accessories',
    size: 'One Size (13" x 10" fits tablets & small laptops)',
    condition: 'Well-Loved',
    conditionNote: 'Features a beautiful, authentic aged patina on the leather. Small scuff on the rear bottom corner (shown in photo), but seams and strap are perfectly sturdy.',
    quantity: 1,
    images: [
      '/images/vintage_leather_bag_1783176854555.jpg',
      'https://images.unsplash.com/photo-1572426313414-2f785c4c0043?auto=format&fit=crop&w=600&q=80'
    ],
    description: 'A genuine full-grain leather messenger bag hand-checked by us. Solid brass hardware, adjustable crossbody shoulder strap, and multiple compartments.',
    isSold: false,
    dateAdded: '2026-06-25'
  },
  {
    id: 'etz-p5',
    name: 'Earthy Striped Knit Sweater',
    price: 380,
    category: 'mens',
    size: 'M (Chest: 40", Length: 26")',
    condition: 'Gently Loved',
    conditionNote: 'Very soft hand-feel. Tiny weave snag on the inner back hem, fully repaired and invisible from the outside.',
    quantity: 1,
    images: [
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=600&q=80'
    ],
    description: 'A wonderfully cozy knit sweater with alternating forest green, cream, and warm brown stripes. Unbelievably comfortable and hand-washed.',
    isSold: false,
    dateAdded: '2026-06-29'
  },
  {
    id: 'etz-p6',
    name: 'Moss Green Tiered Midi Skirt',
    price: 320,
    category: 'womens',
    size: 'S-M (Waist: 26-29" elasticated)',
    condition: 'Gently Loved',
    conditionNote: 'Very clean drape, waistband elastic is strong and stretchy. No stains or loose threads.',
    quantity: 1,
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80'
    ],
    description: 'A beautiful three-tiered flowing skirt in a soft, washed moss green. Features two hidden deep side pockets (a massive plus!). Made of a soft cotton-rayon blend.',
    isSold: false,
    dateAdded: '2026-07-03'
  },
  {
    id: 'etz-p7',
    name: 'Cozy Yellow Cotton Romper',
    price: 150,
    category: 'kids',
    size: '12-18 Months',
    condition: 'Like New',
    conditionNote: 'Worn only once or twice. Fabric is pristine, snap closures at the diaper line work perfectly.',
    quantity: 1,
    images: [
      'https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=600&q=80'
    ],
    description: 'An organic, ultra-soft knit romper in a sunny mustard yellow. Snaps along the inner legs make changing effortless.',
    isSold: false,
    dateAdded: '2026-07-04'
  },
  {
    id: 'etz-p8',
    name: 'Hand-woven Native Straw Tote',
    price: 280,
    category: 'accessories',
    size: 'One Size (Width: 14", Height: 12" excluding handles)',
    condition: 'Like New',
    conditionNote: 'The weave is completely tight and flawless. Inner lining is clean with no pen marks or cosmetic stains.',
    quantity: 1,
    images: [
      'https://images.unsplash.com/photo-1572426313414-2f785c4c0043?auto=format&fit=crop&w=600&q=80'
    ],
    description: 'A charming, sturdy native straw basket bag hand-woven locally in Cebu. Fully lined with a soft cream canvas lining and a secure zipper closure.',
    isSold: false,
    dateAdded: '2026-06-27'
  }
];
