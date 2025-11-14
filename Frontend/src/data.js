import product1 from './assets/product1.png';
import product2 from './assets/Product2.png';
import product3 from './assets/product3.jpg';
import product4 from './assets/product4.png';
// Add your new images here:
import product5 from './assets/product5.png';
import product6 from './assets/product6.png';

// Category Images
import powerToolsImg from './assets/category-power-tools.svg';
import machiningCoilImg from './assets/category-machining-coil.svg';
import machineArmatureImg from './assets/category-machine-armature.svg';

export const categories = [
  {
    id: 'power-tools',
    name: 'Power Tools',
    image: powerToolsImg,
    products: [
      { id: 'drill', name: 'Drill Machine', image: product5 },
      { id: 'grinder', name: 'Angle Grinder', image: product6 },
      { id: 'saw', name: 'Circular Saw', image: product4 },
      // Example of using external URL:
      // { id: 'drill', name: 'Drill Machine', image: 'https://example.com/drill-image.jpg' },
    ],
  },
  {
    id: 'machining-coil',
    name: 'Machining Coil',
    image: machiningCoilImg,
    products: [
      { id: 'AWG22', name: 'Machining Coil AWG22', image: product2 },
      { id: 'AWG20', name: 'High Temp Coil AWG20', image: product1 },
    ],
  },
  {
    id: 'machine-armature',
    name: 'Machine Armature',
    image: machineArmatureImg,
    products: [
      { id: 'coil-bM-9513-B', name: 'coil-bM-9513-B Armature', image: product3 },
      { id: 'DV13VSS', name: 'DV13VSS Armature', image: product3 },
    ],
  },
];

export const productDetails = {
  'drill': {
    brands: [
      { name: 'Bosch', sizes: ['10mm', '13mm', '16mm'] },
      { name: 'Makita', sizes: ['10mm', '13mm'] },
    ],
  },
  'grinder': {
    brands: [
      { name: 'Dewalt', sizes: ['100mm', '125mm'] },
      { name: 'Bosch', sizes: ['100mm', '125mm', '150mm'] },
    ],
  },
  'saw': {
    brands: [
      { name: 'Hitachi', sizes: ['185mm', '210mm'] },
    ],
  },
  'coil-a': {
    brands: [
      { name: 'Generic', sizes: ['1kg', '2kg', '5kg'] },
    ],
  },
  'coil-b': {
    brands: [
      { name: 'Generic', sizes: ['1kg', '3kg'] },
    ],
  },
  'armature-x': {
    brands: [
      { name: 'ArmaturePro', sizes: ['Small', 'Medium', 'Large'] },
    ],
  },
  'armature-y': {
    brands: [
      { name: 'ArmaturePro', sizes: ['Standard'] },
    ],
  },
}; 
