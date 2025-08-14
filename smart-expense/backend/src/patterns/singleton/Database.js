let instance;

class Database {
  constructor() {
    if (!instance) {
      instance = this;
    }
    return instance;
  }

  // Database methods go here
}

export default Database;
