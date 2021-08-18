/**
 * 组件库注册业务组件
 */
const Coder = $import("dag/components/Coder")
module.exports = function (SukiiXUI) {
    SukiiXUI.Component.registFormField("coder", Coder);
};