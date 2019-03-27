# FL.ChromeExt

## 本地测试方法

npm install
npm start

浏览器禁用安全性

OSX:

```shell
open -a "Google Chrome" --args --disable-web-security --user-data-dir
```

WINDOWS:

```bat
chrome.exe --disable-web-security --user-data-dir
```

## 更新日志

+ 0.0.6 20180505 增加实时榜单解析功能
+ 0.0.7 20180507 修复实时榜单不能刷新列表的问题
+ 0.0.8 20180718 修复超级排序失效问题 实时榜单支持直接解析排行榜页面源码
+ 0.0.9 20180718 修复实时榜单不能获取关键词查询地址的问题
+ 0.1.0 20180719 修复超级排序不能显示售罄状态的问题
