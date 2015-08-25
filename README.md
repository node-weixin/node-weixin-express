#  [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]

> A deployable express based weixin server

## 功能说明
  node-weixin-express是一个基于nodejs为基础，以expressjs作为首选http服务器框架的微信公共账号服务器。
  他旨在降低开发微信公共账号时的门槛，节约开发时间。
  几个主要目标：
  1. 可以直接通过一个命令运行微信公共账号服务(已经完成)
  2. 可以任意基于express的框架沟通协作（正在开发中)
  3. 模块化机制采用Unix开发哲学：KISS（执行中)
  4. 建立一个可以方便安装数据库，并且将配置信息存放在数据库里的机制(计划中）
  5. 通过express可以无需任何开发就可以自己建设一个功能全面的微信服务器（计划中)

## 反馈与帮助

nodejs微信开发交流QQ群： 39287176

## Install

```sh
$ npm install --g node-weixin-express
```


## 使用说明

安装后在命令行会多出一个命令:

```sh
weixin
```
注意：这里的命令名是weixin，不是node-weixin-express

###查看命令

```sh
$ weixin --help
```

不需要再写代码，可以直接通过命令执行。

端口port默认是3333,需要配置HTTP代理才能更好的工作
  >如果没有代理服务器，请将port指定为80，以防微信验证无法通过。


###参数说明：

```sh
--port port         //服务器侦听的端口
--id id             //APP ID
--secret secret     //APP SECRET
--token token       //APP TOKEN 自已定义的
--jssdk-url url     //使用JSSDK的URL地址
--host oauthHost    //进行Oauth验证的主机域名
--redirect redirect //Oauth成功后的返回URL
```

###运行说明

普通命令运行

```sh
weixin --port port --id id 
```

作为永久服务器运行
```sh
forever start $(which weixin) --port port --id id 
```

1. 作为微信验证服务器

```sh
weixin --token AUTH_YOUR_TOKEN --port 3333
forever start $(which weixin) --token AUTH_YOUR_TOKEN --port 3333
```

启动后微信返回的验证需要指定到：http://YOUR_DOMAIN/weixin/auth/ack


2.作为oauth服务器

```sh
weixin --port 3333 [--port port] [--token token] [--id id] [--secret secret] [--host host] [--redirect redirect]
forever start $(which weixin) --port 3333 [--port port] [--token token] [--id id] [--secret secret] [--host host] [--redirect redirect]
```

注意: host 要是完整的URL,比如： http://weixin.domain.com

启动后让微信访问：http://yourdomain.com/weixin/oauth/access

微信就会自动验证，只要你的验证正确，在没有配置redirect参数时，会出现如下结果：

<img src="/images/oauth-success.jpg" height="400"/>

3.作为JSSDK服务器

```sh
weixin --port 3333 --id id --secret secret --token token --jssdk-url url
forever start $(which weixin) --port 333 --id id --secret secret --token token --jssdk-url url
```

启动后让微信访问：http://yourdomain.com/weixin/jssdk/main
查看功能配置情况。

<img src="/images/jssdk-success.png" height="400"/>

4.作为支付服务器

```sh
weixin --port 333 --id appid --secret appsecret --token apptoken \
 --jssdk-url http://wx.domain.com/weixin/jssdk/main --host http://wx.domain.com \
 --merchant-id mid  --merchant-key mkey \
 --cert-file apiclient_cert.p12 --cert-key ckey \
 --pay-url http://wx.domian.com/weixin/pay \
 --redirect http://wx.domain.com/weixin/pay/main
 
forever start $(which weixin) --port 333 --id appid --secret appsecret --token apptoken \
  --jssdk-url http://wx.domain.com/weixin/jssdk/main --host http://wx.domain.com \
  --merchant-id mid  --merchant-key mid \
  --cert-file apiclient_cert.p12 --cert-key ckey \
  --pay-url http://wx.domian.com/weixin/pay \
  --redirect http://wx.domain.com/weixin/pay/main
  
```
<img src="/images/pay-success.png" height="400"/>



## License

MIT © [node-weixin](blog.3gcnbeta.com)


[npm-image]: https://badge.fury.io/js/node-weixin-express.svg
[npm-url]: https://npmjs.org/package/node-weixin-express
[travis-image]: https://travis-ci.org/node-weixin/node-weixin-express.svg?branch=master
[travis-url]: https://travis-ci.org/node-weixin/node-weixin-express
[daviddm-image]: https://david-dm.org/node-weixin/node-weixin-express.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/node-weixin/node-weixin-express
