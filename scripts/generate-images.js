const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const images = [
  { name: 'sofa1.jpg', color: '#FFE4C4' },
  { name: 'sofa2.jpg', color: '#DEB887' },
  { name: 'sofa3.jpg', color: '#D2B48C' },
  { name: 'chair1.jpg', color: '#BC8F8F' },
  { name: 'chair2.jpg', color: '#F4A460' },
  { name: 'bed1.jpg', color: '#DAA520' },
  { name: 'bed2.jpg', color: '#CD853F' },
  { name: 'wardrobe1.jpg', color: '#D2691E' },
  { name: 'wardrobe2.jpg', color: '#8B4513' },
  { name: 'table1.jpg', color: '#A0522D' },
  { name: 'table2.jpg', color: '#6B4423' }
];

function generateImage(width, height, color, text) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Заливка фона
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);

  // Добавляем текст
  ctx.fillStyle = '#000000';
  ctx.font = '30px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, width / 2, height / 2);

  return canvas.toBuffer('image/jpeg');
}

async function generateAll() {
  const dir = path.join(process.cwd(), 'seed-images');
  
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  for (const image of images) {
    const buffer = generateImage(800, 600, image.color, image.name.replace('.jpg', ''));
    const filepath = path.join(dir, image.name);
    
    try {
      fs.writeFileSync(filepath, buffer);
      console.log(`Generated: ${image.name}`);
    } catch (error) {
      console.error(`Error generating ${image.name}:`, error.message);
    }
  }
}

generateAll().then(() => {
  console.log('All images generated successfully!');
}).catch(console.error); 