#  [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]

> A deployable express based weixin server


## Install

```sh
$ npm install --g node-weixin-express
```


## Usage

###查看命令

```sh
$ node-weixin-express --help
```

不需要再写代码，可以直接通过命令执行。

端口port默认是3333,需要配置HTTP代理才能更好的工作
  >如果没有代理服务器，请将port指定为80，以防微信验证无法通过。


###参数说明：

--id id             //APP ID
--secret secret     //APP SECRET
--token token       //APP TOKEN 自已定义的
--jssdk-url url     //使用JSSDK的URL地址
--host oauthHost    //进行Oauth验证的主机域名
--redirect redirect //Oauth成功后的返回URL



###运行说明

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

![Oauth-Success-Image](/images/oauth-success.jpg =40x)

3.作为JSSDK服务器

```sh
--id wx0201661ce8fb3e11 --secret 483585a84eacd76693855485cb88dc8a --token c9be82f386afdb214b0285e96cb9cb82 --jssdk-url http://wx.t1bao.com/weixin/jssdk/main
```

启动后让微信访问：http://yourdomain.com/weixin/jssdk/main
查看功能配置情况。



## License

MIT © [JSSDKCN](blog.3gcnbeta.com)


[npm-image]: https://badge.fury.io/js/node-weixin-express.svg
[npm-url]: https://npmjs.org/package/node-weixin-express
[travis-image]: https://travis-ci.org/JSSDKCN/node-weixin-express.svg?branch=master
[travis-url]: https://travis-ci.org/JSSDKCN/node-weixin-express
[daviddm-image]: https://david-dm.org/JSSDKCN/node-weixin-express.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/JSSDKCN/node-weixin-express
