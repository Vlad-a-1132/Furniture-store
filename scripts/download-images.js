const https = require('https');
const fs = require('fs');
const path = require('path');

const images = [
  { name: 'sofa1.jpg', id: '1' },
  { name: 'sofa2.jpg', id: '2' },
  { name: 'sofa3.jpg', id: '3' },
  { name: 'chair1.jpg', id: '4' },
  { name: 'chair2.jpg', id: '5' },
  { name: 'bed1.jpg', id: '6' },
  { name: 'bed2.jpg', id: '7' },
  { name: 'wardrobe1.jpg', id: '8' },
  { name: 'wardrobe2.jpg', id: '9' },
  { name: 'table1.jpg', id: '10' },
  { name: 'table2.jpg', id: '11' }
];

const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(fs.createWriteStream(filepath))
          .on('error', reject)
          .once('close', () => resolve(filepath));
      } else {
        response.resume();
        reject(new Error(`Request Failed With a Status Code: ${response.statusCode}`));
      }
    });
  });
};

async function downloadAll() {
  const dir = path.join(process.cwd(), 'seed-images');
  
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  for (const image of images) {
    const url = `https://source.unsplash.com/800x600/?furniture,${image.name.replace(/\d+\.jpg$/, '')}`;
    const filepath = path.join(dir, image.name);
    
    try {
      await downloadImage(url, filepath);
      console.log(`Downloaded: ${image.name}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Error downloading ${image.name}:`, error.message);
    }
  }
}

downloadAll().then(() => {
  console.log('All images downloaded successfully!');
}).catch(console.error); 