let data = [];

function hasChildren(node) {
  let children = [];
  for (let i = 0; i < data.length;) {
    const e = data[i];
    if (node.id == e.pId) {
      children.push(e);
      data.splice(i, 1);
    } else {
      i++;
    }
  }
  if (children.length) {
    node.children = children;
    children.forEach(e => {
      hasChildren(e);
    });
  }
};

export default (params) => {
  // 避免影响元数据
  data = [...params].map(e => Object.assign({}, e));
  data.forEach(e => {
    hasChildren(e);
  });
  return data;
};
// ztree数据转为iview tree格式的数据
