export class DataBase {

  constructor(dbConfig, storeConfig) {
    this.dbName = dbConfig.dbName; //数据库名称
    this.dbVersion = dbConfig.version; //数据库版本【只能是整数】
    this.storeName = storeConfig.storeName; //数据库存储对象名称
    this.keyPath = storeConfig.keyPath; //识别数据的唯一标识
    this.indexList = storeConfig.indexList; //数据库索引列表
    this.IDBKeyRange =  window.IDBKeyRange || window.webkitIDBKeyRange || window.mozIDBKeyRange || window.msIDBKeyRange;

    this.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
    this.db = null;

    this.createStore().then(res => {
      console.log(res.message);
    });
  }


  /**
   * 生成key
   */
  genaratorKey() {
    let num = Math.round(Math.random() * 10);
    let timestamp = new Date().getTime();
    return timestamp + num.toString();
  }

  /**
   * 创建store
   */
  createStore() {
    const request = this.indexedDB.open(this.dbName, this.dbVersion);

    return new Promise(resolve => {

      /**
       * 创建数据库失败事件
       */
      request.onerror = () => {
        resolve({
          status: false,
          message: `DataBase '${this.dbName}' connect failed.`
        });
      };

      /**
       * 创建数据库成功事件
       */
      request.onsuccess = e => {
        this.db = e.currentTarget.result;
        resolve({
          status: true,
          message: `DataBase '${this.dbName}' connect success.`
        });
      };

      /**
       * 数据库版本改变事件
       */
      request.onupgradeneeded = e => {
        let db = e.currentTarget.result;
        let storeName = this.storeName;

        /**
         * 存储对象不存在时创建存储对象
         */
        if (!db.objectStoreNames.contains(storeName)) {
          let objectStore = db.createObjectStore(storeName, { keyPath: this.keyPath });

          /**
           * 创建索引
           */
          this.indexList.map(item => {
            objectStore.createIndex(item, item, { unique: false });
          });
          resolve({
            status: true,
            message: `ObjectStore '${storeName}' create success.`
          });
        }
      }

    });
  }

  /**
   * 添加数据
   * @param {Object} data 
   */
  add(data) {
    let storeName = this.storeName;
    let openRequest = this.indexedDB.open(this.dbName, this.dbVersion);
    let id = this.genaratorKey();
    let temp = Object.assign({
      id: id
    }, data);

    return new Promise(resolve => {

      /**
       * 打开数据库成功事件
       */
      openRequest.onsuccess = e => {
        let db = e.currentTarget.result;
        let store = db.transaction(storeName, 'readwrite').objectStore(storeName);
        let addAction = store.add(temp);

        /**
         * 添加数据失败事件
         */
        addAction.onerror = () => {
          resolve({
            status: false,
            message: 'Data has existed.',
            data: data
          });
        };

        /**
         * 添加数据成功事件
         */
        addAction.onsuccess = () => {
          resolve({
            status: true,
            message: 'Data add success.',
            data: data
          });
        };
      };
    });
  }

  /**
   * 查询所有数据
   */
  async getAll() {
    let resultList = [];
    let storeName = this.storeName;
    let openRequest = this.indexedDB.open(this.dbName, this.dbVersion);

    let res = await new Promise(resolve => {

      /**
       * 打开数据库成功事件
       */
      openRequest.onsuccess = e => {
        let db = e.currentTarget.result;
        let objectStore = db.transaction(storeName).objectStore(storeName);

        /**
         * 打开游标成功事件
         */
        objectStore.openCursor().onsuccess = e => {
          var cursor = e.currentTarget.result;
          if (cursor) {
            resultList.push(cursor.value);
            cursor.continue();
          } else {
            /**
             * 遍历完毕游标，返回查询到的数据
             */
            resolve({
              status: true,
              message: `Record query all data successed.The result's size is ${resultList.length}.`,
              data: resultList
            });
          }
        };
      };
    });
    return res;
  }

  /**
   * 查询数据
   * @param {String} indexKey 索引key
   * @param {any} query 查询词
   */
  get(indexKey, query) {
    let storeName = this.storeName;
    let openRequest = this.indexedDB.open(this.dbName, this.dbVersion);

    if (this.indexList.indexOf(indexKey) === -1) {
      throw new Error(`"${indexKey}" is avalible index.Please use one index in this list [${this.indexList.join()}]`);
    }

    return new Promise(resolve => {

      /**
       * 打开数据库成功事件
       */
      openRequest.onsuccess = e => {
        let db = e.currentTarget.result;
        let store = db.transaction(storeName, 'readwrite').objectStore(storeName);
        let resultList = [];
        let index = store.index(indexKey);
        
        index.openCursor(this.IDBKeyRange.only(query)).onsuccess = e => {
          var cursor = e.currentTarget.result;

          if (cursor) {
            resultList.push(cursor.value);
            cursor.continue();
          } else {

            /**
             * 遍历完毕游标，返回查询到的数据
             */
            resolve({
              status: true,
              message: `Record query data successed.The result's size is ${resultList.length}.`,
              data: resultList
            });
          }
        };
      };
    });
  }

  /**
   * 更新数据
   * @param {String} key 
   * @param {JSON} data 
   */
  update(key, data) {
    let storeName = this.storeName;
    let openRequest = this.indexedDB.open(this.dbName, this.dbVersion);

    return new Promise(resolve => {

      /**
       * 打开数据库成功事件
       */
      openRequest.onsuccess = e => {
        let db = e.currentTarget.result;
        let store = db.transaction(storeName, 'readwrite').objectStore(storeName);
        let getKey = store.index('id').getKey(key);

        /**
         * 查询key是否存在
         */
        getKey.onsuccess = e => {
          let res = e.currentTarget.result;

          if (typeof res !== 'undefined') {
            store.get(key).onsuccess = e => {
              let res = e.currentTarget.result;
              for (let prop in data) {
                res[`${prop}`] = data[prop];
              }
              store.put(res)
              resolve({
                status: true,
                message: `Record update successed by id ${key}`,
                data: res
              });
            };
          } else {
            resolve({
              status: false,
              message: `Record update failed. The id "${key}" not exist.`,
              data: null
            });
          }
        };
      }
    });
  }

  /**
   * 删除数据
   * @param {Object} key
   */
  delete(key) {
    let storeName = this.storeName;
    let openRequest = this.indexedDB.open(this.dbName, this.dbVersion);

    return new Promise(resolve => {

      /**
       * 打开数据库成功事件
       */
      openRequest.onsuccess = e => {
        let db = e.currentTarget.result;

        let store = db.transaction(storeName, 'readwrite').objectStore(storeName);
        let getKey = store.index('id').getKey(key);

        /**
         * 查询key是否存在
         */
        getKey.onsuccess = e => {
          let res = e.currentTarget.result;

          if (typeof res !== 'undefined') {
            store.delete(key);
            resolve({
              status: true,
              message: `Record delete successed by id "${key}".`,
              data: res
            });
          } else {
            resolve({
              status: false,
              message: `Record delete failed. The id "${key}" not exist.`,
              data: null
            });
          }
        };
      };
    });
  }


}




