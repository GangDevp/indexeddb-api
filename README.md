## Database API 使用介绍

### 配置数据库

  数据库配置项存储在例如db.cfg.js文件

    export default {
      dbConfig: {
        dbName: "face",
        dbVersion: 1
      },
      storeConfig: {
        storeName: "person",
        keyPath: "id",
        indexList: ["id"]
      }
    }

  配置项字段必须和以上示例中的一致:

    dbConfig: 数据库配置项

      dbName: 数据库名称

      dbVersion: 数据库版本，必须是整数

    storeConfig: 存储对象配置项，类似关系型数据库中的表

      storeName: 存储对象名称

      keyPath: 存储对象中每条数据的唯一标识的字段

      indexList: 存储对象中要创建的索引字段    



### 初始化数据库对象: new DataBase(dbConfig, storeConfig)

  1.引入数据库配置项及数据库 API class

  `import dbCfg from './db.cfg';`

  `import { DataBase } from "./../src/database";`

  2.创建数据库对对象

  `let db = new DataBase(dbCfg.dbConfig, dbCfg.storeConfig);`


### 添加数据: add(data)

  `let data = {name: 'anny', age: 20};`

  `let addAction = db.add(data);`

  `addAction.then( res => { // 获取添加数据的响应结果 });`

  响应结果res的结构体：

    {
      status: true | false,
      message: String,
      data: Object
    }

    status: 表示操作数据库成功或失败的状态，true表示成功，false表示失败

    message: 操作数据库成功或失败时的提示语

    data: 操作数据库后返回的数据，所有操作成功时会返回原数据，失败时会返回null

### 更新数据: update(id, data)

  `let data = { name: 'anny', age: 18};`

  `let id = '1000000';`

  `db.update(id, data).then(res => { // 获取更新数据的响应结果});`


### 查询单条数据: get(indexKey, queryWords)

  `let indexKey = 'name';`

  `let queryWords = 'anny';`

  `db.get(indexKey, queryWords).then(res => { // 获取查询数据的响应结果});`


### 查询所有数据: getAll()

  `db.getAll().then(res => { // 获取查询所有数据的响应结果});`

### 删除数据: delete(id)

  `let id = '10000';`

  `db.delete(id).then(res => { // 获取删除数据的响应结果});`


