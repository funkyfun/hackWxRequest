# hackWxRequest

## 场景
微信小游戏/小程序的request请求并发数限制为10，超过并发限制的请求会直接fail
使用第三方引擎库，资源请求和业务请求被封装，不好统计当前请求的并发数，于是从源头上拦截请求，做队列处理

## 使用
直接引入
传入参数true开启请求日志，打印当前请求信息，默认关闭
``` js

var hackWxRequest = require("...topath/hackWxRequest.js");
hackWxRequest(true);

```
