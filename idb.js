let idb = {};

idb.categories = [
    'Food',
    'Transportation',
    'Housing',
    'Entertainment',
    'Healthcare',
    'Other'
];

idb.openCostsDB = async function (dbName, dbVersion) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, dbVersion);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            idb.db = request.result;
            idb.db.addCost = function (cost) {
                return new Promise((resolve, reject) => {
                    const transaction = this.transaction(["costs"], "readwrite");
                    const store = transaction.objectStore("costs");

                    const request = store.add({
                        ...cost,
                        date: new Date(cost.date),
                    });

                    request.onsuccess = () => resolve(request.result);
                    request.onerror = () => reject(request.error);
                });
            };

            idb.db.getCostsByMonth = function (year, month) {
                return new Promise((resolve, reject) => {
                    const transaction = this.transaction(["costs"], "readonly");
                    const store = transaction.objectStore("costs");
                    const costs = [];

                    const request = store.openCursor();

                    request.onsuccess = (event) => {
                        const cursor = event.target.result;
                        if (cursor) {
                            const cost = cursor.value;
                            if (
                                cost.date.getFullYear() === year &&
                                cost.date.getMonth() === month - 1
                            ) {
                                costs.push(cost);
                            }
                            cursor.continue();
                        } else {
                            resolve(costs);
                        }
                    };

                    request.onerror = () => reject(request.error);
                });
            };

            resolve(idb.db);
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;

            if (!db.objectStoreNames.contains("costs")) {
                const costStore = db.createObjectStore("costs", {
                    keyPath: "id",
                    autoIncrement: true,
                });

                costStore.createIndex("date", "date", { unique: false });
                costStore.createIndex("category", "category", { unique: false });
            }
        };
    });
};