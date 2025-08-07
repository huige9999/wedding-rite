# wedding-rite 项目文档

本项目使用前端框架为Uniapp+Vue3(setup)，使用脚手架创建，无需使用HBuilderX进行编译。

本项目目前编译产物只有「Wedding Rite」微信小程序，除了Wedding Rite主功能模块，同时还兼有主持人问卷调查、新人反馈等模块（通过特定分享链接进入）。

## 【Wedding Rite】模块

本项目的主要内容，通过微信小程序菜单直接进入时接触到的模块。

提供给主持人使用，主要分为3部分功能：

* 主持人上传个人照片、动态、作品等内容用于分享展示个人；
* 通过主持人的分享链接，其他人可以直接预定主持人档期，帮助主持人收集预定；
* 主持人手动添加档期信息，对档期进行管理、查看。

## 【婚礼人】模块（待补充）

通过特殊分享链接进入，查看主持人信息。

## ⏬ 运行

### 编译环境

本项目推荐在`node.js 18.14.2`和`npm 9.5.0`环境下进行编译，其他环境下未测试

### 运行

#### 安装npm包：
```
npm install
```
注意，不要运行`npm audit fix --force`命令，可能会因为npm版本过高导致无法正常编译。
同时本模板在`package.json`中限制了`pinia`、`sass`、`sass-loader`的版本，请谨慎更新这几个库的版本，可能出现版本不兼容的问题。

#### 启动h5项目

本项目中有部分内嵌h5页面，页面链接由环境变量指定，默认配置的h5地址为线上正式环境地址。

如需调试h5项目，需要启动wedding-rite-h5项目，并且将本项目中的环境变量中的`VITE_H5_URL`变量修改为'http://dev.joymew.com'。

#### 编译为开发环境的微信小程序：
```
npm run dev:mp-weixin
```
编译完成后，在微信开发者工具中导入运行，其他编译命令参考[uniapp官方文档](https://uniapp.dcloud.net.cn/quickstart-cli.html#%E8%BF%90%E8%A1%8C%E3%80%81%E5%8F%91%E5%B8%83uni-app)。

#### 编译为本地测试环境微信小程序：
```
npm run dev-local:mp-weixin
```
自定义环境配置参考[Vite官方文档](https://cn.vitejs.dev/guide/env-and-mode.html#modes)

#### 编译为生产环境的微信小程序：
```
npm run build:mp-weixin
```
该版本用于正式发行


## 💻 开发

本项目根据uniapp官方vue3+vite+ts模板创建。

### npm包

除原官方模板项目自带npm包，本项目还添加了以下npm包：

* `@dcloudio/uni-ui`：uniapp官方ui库；
* `@types/XXX`：typescript类型包；
* `@typescript-eslint/XXX`：typescript的eslint插件；
* `@uni-helper/XXX`：uni-helper团队制作的uniapp的api的ts类型包；
* `@vue/tsconfig`: Vue官方提供的Vue3项目的ts配置；
* `eslint`、`eslint-XXX`：`eslint`及相关的配置扩展和插件，用于规范ts代码检查和风格规范；
* `pinia`：Vue官方推荐状态管理包；
* `postcss-html`：css样式转换器，用于`stylelint`；
* `sass`、`sass-loader`：scss语法支持，uni-ui必备；
* `stylelint`、`stylelint-XXX`：stylelint及相关配置扩展，用于样式代码的检查与风格规范；
* `typescript`：ts支持；
* `unplugin-auto-import`：自动引入vue、pinia、uniapp等的API；

### 插件

如果使用VScode开发，可以在扩展搜索栏中输入`@recommended`查看本项目推荐使用的扩展。

在`.vscode/settings.json`文件中对部分插件进行了配置。

**强烈推荐**的插件：

* [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar)：Vue官方推荐插件，拥有语法检测、代码提示等适配Vue的功能；
* [Eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)：实时检测代码是否符合.eslintrc.js中配置的规则；
* [Format Code Action](https://marketplace.visualstudio.com/items?itemName=rohit-gohri.format-code-action&ssr=false#overview)：在Volar格式化文档后能调用Eslint进行修复；
* [Auto Rename Tag](https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-rename-tag)：自动重命名配对的HTML标签；
* [uni-create-view](https://marketplace.visualstudio.com/items?itemName=mrmaoddxxaa.create-uniapp-view)：快速创建uniapp视图；
* [uni-app-schemas](https://marketplace.visualstudio.com/items?itemName=uni-helper.uni-app-schemas-vscode)：校验 uni-app 中的 androidPrivacy.json、pages.json 和 manifest.json 格式；
* [uni-app-snippets](https://marketplace.visualstudio.com/items?itemName=uni-helper.uni-app-snippets-vscode)：uniapp代码片段；
* [uni-ui-snippets](https://marketplace.visualstudio.com/items?itemName=uni-helper.uni-ui-snippets-vscode)：uni-ui代码片段；
* [TortoiseSVN]([TortoiseSVN - Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=fantasytyx.tortoise-svn))：VScode内查看svn代码变动和执行相关操作；
* [Path Intellisense](https://marketplace.visualstudio.com/items?itemName=christian-kohler.path-intellisense)：路径提示插件。

**推荐**插件：

* [Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker)：单词拼写检查；
* [Error Lens](https://marketplace.visualstudio.com/items?itemName=usernamehw.errorlens)：行内显示报错信息；
* [Todo Tree](https://marketplace.visualstudio.com/items?itemName=Gruntfuggly.todo-tree)：显示TODO、FIXME等特殊注释；

## 📖 项目结构

```
joymew-wedding-master
├─ .eslintrc-auto-import.json                          unplugin-auto-import自动生成文件
├─ .eslintrc.js                                        ESLint配置规则
├─ .stylelintrc.js                                     StyleLint配置文件
├─ .vscode                                             VScode设置目录
│   ├─ extensions.json                                 推荐插件文件
│   └─ settings.json                                   工作区设置文件
├─ dist                                                打包目录
├─ index.html                                          入口文件
├─ package-lock.json
├─ package.json
├─ README.md                                           项目文档
├─ src
│   ├─ api                                             接口文件目录
│   │   ├─ activity-api.ts                             动态相关接口
│   │   ├─ booking-api.ts                              预定相关接口
│   │   ├─ hlr-api.ts                                  婚礼人相关接口
│   │   ├─ invite-api.ts                               邀请好友相关接口
│   │   ├─ others.ts                                   其他零散接口
│   │   ├─ request.ts                                  请求方法
│   │   ├─ schedule-api.ts                             档期相关接口
│   │   ├─ user-api.ts                                 用户信息相关接口
│   │   └─ work-api.ts                                 作品相关接口
│   ├─ App.vue
│   ├─ components                                      组件目录
│   │   ├─ BottomMenuPopup.vue                         底部菜单弹窗（待弃用）
│   │   ├─ bt-cropper                                  图片剪切器
│   │   ├─ CircleProgress.vue                          环型进度条
│   │   ├─ KeyboardFollowInput.vue                     随键盘抬升的输入栏
│   │   ├─ MyUniCalendar                               根据uni-calendar封装的日历
│   │   ├─ ScheduleDatePicker.vue                      档期的日期选择器
│   │   ├─ wedding-link                                【Wedding Rite】模块专用的组件
│   │   └─ YearPickerPopup.vue
│   ├─ env                                             环境变量目录
│   ├─ main.ts
│   ├─ manifest.json                                   uniapp项目配置文件
│   ├─ pages                                           主包页面目录
│   │   ├─ bye
│   │   ├─ hlr                                         【婚礼人】模块相关页面
│   │   └─ wedding-link                                【Wedding Rite】模块主包页面目录
│   ├─ pages.json                                      页面路由相关配置
│   ├─ static                                          静态文件目录
│   │   ├─ constants                                   常量目录
│   │   ├─ icons                                       图标目录
│   │   ├─ images                                      图片目录
│   │   └─ styles                                      样式文件目录
│   │       ├─ common.scss                             通用样式
│   │       └─ patch.scss                              补丁性质的样式
│   ├─ stores                                          store目录
│   │   ├─ activity-store.ts                           动态store
│   │   ├─ booking-store.ts                            预定store
│   │   ├─ hlr-store.ts                                婚礼人store
│   │   ├─ schedule-store.ts                           档期store
│   │   ├─ user-store.ts                               用户store
│   │   └─ work-store.ts                               作品store
│   ├─ subpkg                                          分包页面
│   │   └─ wedding-link                                【Wedding Rite】模块分包页面目录
│   ├─ types                                           类型相关文件目录
│   │   ├─ auto-imports.d.ts                           unplugin-auto-import自动生成文件
│   │   ├─ env.d.ts                                    全局类型
│   │   ├─ res.d.ts                                    接口相应数据类型
│   │   └─ shime-uni.d.ts                              uniapp模板自带文件
│   └─ utils                                           方法
│       ├─ hlr.ts                                      【婚礼人】相关方法
│       ├─ navigate.ts                                 导航相关方法
│       ├─ parse.ts                                    解析数据方法
│       ├─ token.ts                                    token相关方法
│       ├─ tools.ts                                    工具方法
│       └─ uniapp-api-promised.ts                      promised化的uniapp方法（待弃用）
├─ tsconfig.json                                       typescript配置文件
├─ vite.config.ts                                      vite配置文件
└─ vue.config.js                                       vue配置文件（为适配uni-ui添加）

```

## 🦒 代码风格

本项目推荐代码遵循[Vue3官方的风格指南](https://v2.cn.vuejs.org/v2/style-guide/)和[Vue3组合式API风格指南（英文）](https://cn.vuejs.org/style-guide/)，js/ts代码风格已使用`eslint`进行限制，css/scss代码已使用`stylelint`进行限制，请在开发过程中打开VScode的`ESLint`和`Stylelint`插件，在保存文件时会自动使用插件对文件进行修复（已在`settings.json`中配置）。

未限制的代码风格可以参考个人博文——[个人Vue项目代码风格及各类规范](https://blog.rjiazhen.top/posts/%E4%B8%AA%E4%BA%BAVue%E9%A1%B9%E7%9B%AE%E4%BB%A3%E7%A0%81%E9%A3%8E%E6%A0%BC%E5%8F%8A%E5%90%84%E7%B1%BB%E8%A7%84%E8%8C%83.html)，并且任何变更需与前端同事确认后再实际应用。

## 🧩可优化的内容

### 添加文件头部注释

大部分文件未添加头部注释说明，对后续持续开发有影响。

### 根据环境动态生成`manifest.json`

目前无论是开发环境还是生产环境，其编译产物的`projectname`都是相同，就导致使用微信开发者工具打开变异产物时，无法便捷判断哪个是生产环境的产物，哪个是开发环境的产物。

同时，动态生成`mainfest.json`可以方便在编译不同环境产物时进行一些定制化的操作。

目前考虑方案为使用`@uni-helper/vite-plugin-uni-manife`实现

### 重新编写部分组件

部分组件在最初编写时考虑不周，成品代码过于臃肿、复杂，不利于后续复用和扩展。

例如`MyUniCalendar.vue`是直接复制uni-calendar代码进行修改的，虽然完成了需求，但是过于臃肿，也不利于后续二次修改。

### 将currentInstance.refs的形式改为ref()
