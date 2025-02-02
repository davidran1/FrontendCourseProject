let idb = {};
idb.dbName = "costsdb";// Name of the IndexedDB database
idb.version = 1;// Version of the IndexedDB database

// List of categories for costs
idb.categories = ['Food','Transportation','Housing','Entertainment','Healthcare','Other'];


/**
 * Initializes the IndexedDB database by opening it or creating it if it doesn't exist.
 * 
 * This function creates the "costs" object store and indexes for "date" and "category" if the database 
 * is being created or upgraded.
 */
idb.init = async function () {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(idb.dbName, idb.version);

    // Handle any error that occurs when opening the database
    request.onerror = () => reject(request.error);
    // On success, resolve the promise with the database instance
    request.onsuccess = () => {
      idb.db = request.result;
      resolve(idb.db);
    };

    // Handle the case when the database is being upgraded 
    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // If the "costs" object store doesn't exist, create it and define indexes
      if (!db.objectStoreNames.contains("costs")) {
        const costStore = db.createObjectStore("costs", {keyPath: "id",autoIncrement: true,});
        costStore.createIndex("date", "date", { unique: false });
        costStore.createIndex("category", "category", { unique: false });
      }
    };
  });
};


/**
 * Adds a new cost item to the "costs" object store in IndexedDB.
 */
idb.addCost = function (cost) {
  return new Promise((resolve, reject) => {
    const transaction = idb.db.transaction(["costs"], "readwrite");
    const store = transaction.objectStore("costs");
    // Add the cost to the store, including the date
    const request = store.add({...cost,date: new Date(cost.date),});
    // Resolve or reject based on the success or failure of the request
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

/**
 * Return all cost items for a specific month and year from the "costs" object store.
 */
idb.getCostsByMonth = async function (year, month) {
  return new Promise((resolve, reject) => {
    const transaction = idb.db.transaction(["costs"], "readonly");
    const store = transaction.objectStore("costs");
    const costs = [];

    const request = store.openCursor();
    // Iterate over all records in the object store using a cursor
    request.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        const cost = cursor.value;
        // Filter by year and month, adjust the month (indexes start from 0)
        if (cost.date.getFullYear() === year &&cost.date.getMonth() === month - 1) {
          costs.push(cost);
        }
        // Continue to the next record
        cursor.continue();
      } 
      // Resolve the promise with the filtered costs
      else {resolve(costs);}
    };
    // Reject the promise if there is any error
    request.onerror = () => reject(request.error);
  });
};

/**
 * Return the total sum of costs for each category for a specific month and year.
 */
idb.getCategoryTotalsByMonth = async function (year, month) {
  // Store the costs for the given month and year
  const costs = await idb.getCostsByMonth(year, month);
  // Reduce the array of costs into a summary object by category
  return costs.reduce((acc, cost) => {acc[cost.category] = (acc[cost.category] || 0) + cost.sum;
    return acc;}, {});
};

export default idb;
