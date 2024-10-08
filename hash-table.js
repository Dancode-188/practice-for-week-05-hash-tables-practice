const sha256 = require('js-sha256');

class KeyValuePair {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.next = null;
  }
}

class HashTable {

  constructor(numBuckets = 4) {
    this.numBuckets = numBuckets;
    this.count = 0;
    this.capacity = numBuckets;
    this.data = new Array(this.capacity).fill(null);
  }

  hash(key) {
    const hash = sha256(key);
    const first8 = hash.slice(0, 8);
    return parseInt(first8, 16);
  }

  hashMod(key) {
    return this.hash(key) % this.capacity;
  }

  insertNoCollisions(key, value) {
    const index = this.hashMod(key);
    const kvp = new KeyValuePair(key, value);
    const errorMessage = 'hash collision or same key/value pair already exists!';

    if (this.data[index] !== null) {
      throw new Error(errorMessage);
    }

    this.data[index] = kvp;
    this.count++;
  }

  insertWithHashCollisions(key, value) {
    const index = this.hashMod(key);
    const kvp = new KeyValuePair(key, value);

    if (this.data[index] === null) {
      this.data[index] = kvp;
      this.count++;
    } else {
      let current = this.data[index];
      while (current.next !== null) {
        if (current.key === key) {
          current.value = value;
          return;
        }
        current = current.next;
      }
      if (current.key === key) {
        current.value = value;
      } else {
        kvp.next = this.data[index];
        this.data[index] = kvp;
        this.count++;
      }
    }
  }


  insert(key, value) {
    try {
      this.insertNoCollisions(key, value);
    } catch (error) {
      this.insertWithHashCollisions(key, value);
    }
  }

}


module.exports = HashTable;