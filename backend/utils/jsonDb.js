const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');

// Asegurar que existe el directorio de datos
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

class JsonDB {
  constructor(collectionName) {
    this.collectionName = collectionName;
    this.filePath = path.join(DATA_DIR, `${collectionName}.json`);
    this.ensureFile();
  }

  ensureFile() {
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([]));
    }
  }

  readData() {
    try {
      const content = fs.readFileSync(this.filePath, 'utf8');
      return JSON.parse(content) || [];
    } catch (err) {
      return [];
    }
  }

  writeData(data) {
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
  }

  create(docData) {
    const data = this.readData();
    const newDoc = {
      _id: new Date().getTime() + Math.random().toString(36).substring(7),
      ...docData,
      createdAt: new Date(),
    };
    data.push(newDoc);
    this.writeData(data);
    return newDoc;
  }

  findById(id) {
    const data = this.readData();
    return data.find(doc => doc._id === id);
  }

  findOne(query) {
    const data = this.readData();
    return data.find(doc => {
      for (const key in query) {
        if (doc[key] !== query[key]) return false;
      }
      return true;
    });
  }

  find(query = {}) {
    const data = this.readData();
    if (Object.keys(query).length === 0) return data;
    
    return data.filter(doc => {
      for (const key in query) {
        if (doc[key] !== query[key]) return false;
      }
      return true;
    });
  }

  updateOne(query, update) {
    const data = this.readData();
    const docIndex = data.findIndex(doc => {
      for (const key in query) {
        if (doc[key] !== query[key]) return false;
      }
      return true;
    });

    if (docIndex !== -1) {
      data[docIndex] = { ...data[docIndex], ...update.set || update, updatedAt: new Date() };
      this.writeData(data);
      return { modifiedCount: 1 };
    }
    return { modifiedCount: 0 };
  }

  deleteOne(query) {
    const data = this.readData();
    const docIndex = data.findIndex(doc => {
      for (const key in query) {
        if (doc[key] !== query[key]) return false;
      }
      return true;
    });

    if (docIndex !== -1) {
      data.splice(docIndex, 1);
      this.writeData(data);
      return { deletedCount: 1 };
    }
    return { deletedCount: 0 };
  }

  countDocuments(query = {}) {
    return this.find(query).length;
  }
}

module.exports = JsonDB;
