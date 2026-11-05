const fs = require('fs');
const path = require('path');

const storageFile = path.join(__dirname, 'data.json');

// Default initial data for users and products
const defaultData = {
  users: [
    { id: 1, name: 'Ashish Nagar', email: 'ashish@example.com', role: 'admin', age: 24 },
    { id: 2, name: 'Rahul Sharma', email: 'rahul@example.com', role: 'user', age: 26 },
    { id: 3, name: 'Pooja Verma', email: 'pooja@example.com', role: 'user', age: 23 }
  ],
  products: [
    { id: 1, title: 'Mechanical Keyboard', price: 2500, stock: 15, category: 'electronics' },
    { id: 2, title: 'Wireless Mouse', price: 1200, stock: 30, category: 'electronics' },
    { id: 3, title: 'USB-C Fast Cable', price: 450, stock: 50, category: 'accessories' }
  ]
};

// Read data from local JSON storage
const readStorage = () => {
  try {
    if (!fs.existsSync(storageFile)) {
      writeStorage(defaultData);
      return defaultData;
    }
    const raw = fs.readFileSync(storageFile, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return defaultData;
  }
};

// Write updated data back to JSON storage
const writeStorage = (data) => {
  try {
    fs.writeFileSync(storageFile, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Storage write error:', err.message);
  }
};

module.exports = {
  readStorage,
  writeStorage
};
