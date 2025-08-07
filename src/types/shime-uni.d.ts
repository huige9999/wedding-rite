/**
  * 针对部分第三方库补充的类型定义
  * @author: Ruan Jiazhen
  * @date: 2024-04-28 17:56:20
* */

export { };

declare module 'vue' {
  type Hooks = App.AppInstance & Page.PageInstance;
  interface ComponentCustomOptions extends Hooks { }
}
