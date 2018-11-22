import dbCfg from './db.cfg';
import { DataBase } from "./../src/database";

const db = new DataBase(dbCfg.dbConfig, dbCfg.storeConfig);

document.querySelector('#add').addEventListener('click', e => {
  addData();
});
document.querySelector('#getAll').addEventListener('click', e => {
  queryAll();
});
document.querySelector('#get').addEventListener('click', e => {
  query();
});
document.querySelector('#update').addEventListener('click', e => {
  update();
});
document.querySelector('#delete').addEventListener('click', e => {
  deletes();
});

const addData = () => {
  let name = document.querySelector('#add_name').value;
  let age = document.querySelector('#add_age').value;

  if (name.length === 0 || age.length === 0) {
    alert('请输入姓名和年龄');
    return;
  }

  let data = {
    name: name,
    age: age
  };
  db.add(data).then(res => {
    let resHtml = document.querySelector('#add_result');

    if (res.status) {
      resHtml.innerHTML = res.message;
    } else {
      resHtml.innerHTML = res.message;
    }
  });
};

const queryAll = () => {
  db.getAll().then(res => {
    let dataListDom = document.querySelector('.all-data');

    if (res.status) {
      let list = '';
      res.data.map(item => {
        list += `<li>`
          + `<span style="margin-left:30px;">id: ${item.id}</span>`
          + `<span style="margin-left:30px;">name: ${item.name}</span>`
          + `<span style="margin-left:30px;">age: ${item.age}</span>`
          + `</li>`;
      });
      dataListDom.innerHTML = list;
    } else {
      dataListDom.innerHTML = '<li>暂无数据</li>';
    }
  });
};

const query = () => {
  db.get('name', '哈哈').then(res => {
    let dataDom = document.querySelector('.data');

    if (res.status) {
      let result = '';
      res.data.map(item => {
        result += `<li>`
          + `<span style="margin-left:30px;">id: ${item.id}</span>`
          + `<span style="margin-left:30px;">name: ${item.name}</span>`
          + `<span style="margin-left:30px;">age: ${item.age}</span>`
          + `</li>`;
      });

      dataDom.innerHTML = result;
    } else {
      dataDom.innerHTML = '<li>暂无数据</li>';
    }
  });
};

const update = () => {
  let id = document.querySelector('#update_id').value;
  let name = document.querySelector('#update_name').value;
  let age = document.querySelector('#update_age').value;

  if (id.length === 0) {
    alert('请输入ID');
    return;
  }

  if (name.length === 0 && age.length === 0) {
    alert('请输入姓名或年龄');
    return;
  }
  let data = {
    name: name,
    age: age
  }
  db.update(id, data).then(res => {
    let resHtml = document.querySelector('#update_result');

    if (res.status) {
      resHtml.innerHTML = res.message;
    } else {
      resHtml.innerHTML = res.message;
    }
  });

};

const deletes = () => {
  let id = document.querySelector('#delete_id').value;

  db.delete(id).then(res => {
    let resHtml = document.querySelector('#delete_result');

    if (res.status) {
      resHtml.innerHTML = res.message;
    } else {
      resHtml.innerHTML = res.message;
    }
  });
};



