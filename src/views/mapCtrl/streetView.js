export default (target) => {
  mapTip.getLocation(({ coordinate }) => {
    event.$emit("streetView/show", coordinate);
  }, "点击主干道显示街景");
};
