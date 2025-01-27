let idb = {};
idb.dbName = "costsdb";
idb.version = 1;

idb.categories = ['Food','Transportation','Housing','Entertainment','Healthcare','Other'];

idb.init = async function () {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(idb.dbName, idb.version);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      idb.db = request.result;
      resolve(idb.db);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains("costs")) {
        const costStore = db.createObjectStore("costs", {keyPath: "id",autoIncrement: true,});
        costStore.createIndex("date", "date", { unique: false });
        costStore.createIndex("category", "category", { unique: false });
      }
    };
  });
};

idb.addCost = function (cost) {
  return new Promise((resolve, reject) => {
    const transaction = idb.db.transaction(["costs"], "readwrite");
    const store = transaction.objectStore("costs");
    const request = store.add({...cost,date: new Date(cost.date),});
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

idb.getCostsByMonth = async function (year, month) {
  return new Promise((resolve, reject) => {
    const transaction = idb.db.transaction(["costs"], "readonly");
    const store = transaction.objectStore("costs");
    const costs = [];

    const request = store.openCursor();

    request.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        const cost = cursor.value;
        if (cost.date.getFullYear() === year &&cost.date.getMonth() === month - 1) {
          costs.push(cost);
        }
        cursor.continue();
      } 
      else {resolve(costs);}
    };
    request.onerror = () => reject(request.error);
  });
};

idb.getCategoryTotalsByMonth = async function (year, month) {
  const costs = await idb.getCostsByMonth(year, month);
  return costs.reduce((acc, cost) => {acc[cost.category] = (acc[cost.category] || 0) + cost.sum;
    return acc;}, {});
};

export default idb;
