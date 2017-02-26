# node-weixin-express [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url][![Beerpay](https://beerpay.io/node-weixin/node-weixin-express/badge.svg?style=flat-square)](https://beerpay.io/node-weixin/node-weixin-express)


## 功能说明
  node-weixin-express是一个基于nodejs为基础，以expressjs作为首选http服务器框架的微信公共账号服务器。
  他旨在降低开发微信公共账号时的门槛，节约开发时间。
  

## 主要功能与计划

  1. 可以直接通过一个命令运行微信公共账号服务
  2. 基本的微信功能：
    - 验证服务器
    - OAuth 验证API
    // - 微信支付API
    - 消息接口API
  3. 可以任意基于express的框架沟通协作(基本完成)
  4. 模块化机制采用Unix开发哲学：KISS
  5. 建立一个可以方便安装数据库，并且将配置信息存放在数据库里的机制(计划中)
  6. 通过express可以无需任何开发就可以自己建设一个功能全面的微信服务器(计划中)
  

## 重要子模块
  1. [node-weixin-api](https://github.com/node-weixin/node-weixin-api):
    提供所有基础的微信api
  2. [node-weixin-router](https://github.com/node-weixin/node-weixin-router):
    提供所有的基于web框架的默认路由与回调机制
  3. [node-weixin-session](https://github.com/node-weixin/node-weixin-session):
    提供所有基于用户登录的session数据的存储机制，通过修改get/set/all来实现自定义化
  4. [node-weixin-settings](https://github.com/node-weixin/node-weixin-settings):
    提供所有基于微信的app.id的数据存储机制，通过修改get/set/all来实现自定义化


## 问题、反馈与帮助

- 论坛交流  
  [node-weixin交流论坛](http://forum.node-weixin.com/)

- 官方网站  
  [node-weixin](http://www.node-weixin.com/) 用于快速检索更新, 帮助，导航等
  
- 官方QQ群
  39287176
  
- 关注公共账号了解最新动态  
  ![](http://res.cloudinary.com/dawjytvkn/image/upload/v1464858605/qrcode_for_gh_6f66da401fef_430_b1rr96.jpg)



## node-weixin

 [node-weixin-express](https://github.com/node-weixin/node-weixin-express)是基于node-weixin-*的服务器端参考实现。

 [node-weixin-api](https://github.com/node-weixin/node-weixin-api)是基于node-weixin-*的API接口SDK。

 它们都是由下列子项目组合而成:

 1. [node-weixin-config](https://github.com/node-weixin/node-weixin-config)
    用于微信配置信息的校验

 2. [node-weixin-auth](https://github.com/node-weixin/node-weixin-auth)
    用于与微信服务器握手检验

 3. [node-weixin-util](https://github.com/node-weixin/node-weixin-util)
    一些常用的微信请求，加密，解密，检验的功能与处理

 4. [node-weixin-request](https://github.com/node-weixin/node-weixin-request)
    微信的各类服务的HTTP请求的抽象集合

 5. [node-weixin-oauth](https://github.com/node-weixin/node-weixin-oauth)
    微信OAuth相关的操作

 6. [node-weixin-pay](https://github.com/node-weixin/node-weixin-pay)
    微信支付的服务器接口

 7. [node-weixin-jssdk](https://github.com/node-weixin/node-weixin-jssdk)
    微信JSSDK相关的服务器接口

 8. [node-weixin-menu](https://github.com/node-weixin/node-weixin-menu)
    微信菜单相关的操作与命令
    
 9. [node-weixin-user](https://github.com/node-weixin/node-weixin-user)
    微信用户API
    
10. [node-weixin-media](https://github.com/node-weixin/node-weixin-media)
    微信多媒体API

11. [node-weixin-link](https://github.com/node-weixin/node-weixin-link)
    微信推广(二维码,URL)API
 
12. [node-weixin-message](https://github.com/node-weixin/node-weixin-message)
    微信消息API

## 安装

```sh
$ npm install --g node-weixin-express
```

### 说明

安装后在命令行会多出一个命令:

```sh
weixin
```

> 注意：这里的命令名是weixin，不是node-weixin-express

## 查看命令

```sh
$ weixin --help
```

## 运行

```
$ weixin [--yaml] a.yaml
```
后面接一个描述性的yaml文件

> 不需要再写代码，可以直接通过命令执行。

## yaml文件格式

```yaml
### ----必填项---- ###
port: 2048              # 服务器端口号
host: localhost         # 本地的IP或者主机地址
template: ''            # 可以替换的模板的位置，放入自己的模板，格式是nunjunck
weixin:
  # 微信服务器配置
  server:
      host: localhost     # 远程的服务器名， 需要与JSSDK的授权域名一致
      prefix: '/api'      # 格式是'/xxx'，必须带'/'
  # 微信公共号的基本配置信息
  app:
      id: 'xxx'           # 必须换成自己的
      secret: 'xxx'       # 必须换成自己的
      token: 'xxx'
  # Oauth 相关
  oauth:
      state: 'state'
      scope: '0'
  ### ----结束---- ###

  # 加密消息
  message:           
      aes: 'sdofsfd'

  # 支付相关，暂时不开放
  # merchant:
  #     id: '133'
  #     key: 'sdfsf'
  # certificate:
  #     pfxKey: 'sdfosofdf'
  #     pfx: 'sodfofosdf'
  #     path: ''
```


## URLs

服务器校验地址
```
'http://' + 域名 + '/' + 前缀 + '/auth/ack
```
JSSDK配置请求地址
```
'http://' + 域名 + '/' + 前缀 + '/jssdk/config
```
Oauth访问地址
```
'http://' + 域名 + '/' + 前缀 + '/oauth/access
```
支付回调地址
```
'http://' + 域名 + '/' + 前缀 + '/pay/callback
```

## 模板说明

目前支持的模板是nunjucks：https://mozilla.github.io/nunjucks/
可能是目前javascript下最完善的模板。
暂时不支持其它的模板。


## 特色

1. 通过一个命令就可以对接好公共帐号的主要功能
2. 可以自定义模板，方便前端测试开发
3. 配合ngrok, localtunnel等软件将会更加方便

## License

Apache-2.0 © [node-weixin](www.node-weixin.com)

[npm-image]: https://badge.fury.io/js/node-weixin-express.svg
[npm-url]: https://npmjs.org/package/node-weixin-express
[travis-image]: https://travis-ci.org/node-weixin/node-weixin-express.svg?branch=master
[travis-url]: https://travis-ci.org/node-weixin/node-weixin-express
[daviddm-image]: https://david-dm.org/node-weixin/node-weixin-express.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/node-weixin/node-weixin-express
[coveralls-image]: https://coveralls.io/repos/node-weixin/node-weixin-express/badge.svg
[coveralls-url]: https://coveralls.io/r/node-weixin/node-weixin-express
