---
date: 2022-12-06
category:
  - VPN
tag:
  - Cloudflare
sticky: true
---

<!-- more -->

# Cloudflare 技术博客整合





## **1、一键生成免费订阅链接** 

**发布于 2024-04-02**

> 源： https://www.tweek.top/archives/1712021855314



#### 一键生成免费订阅链接，订阅动态更新，自动添加优选域名和优选IP,CF CDN 免费节点，任意一个节点,可通过此方法，生产订阅链接。。。视频教程：

#### 1，搭建workers订阅节点

代码地址：https://raw.githubusercontent.com/dockkkk/CF-WORKERS/main/worker.js

推荐订阅器

cm.godns.onflashdrive.app 天城大佬

3k.fxxk.dedyn.io 3K大佬

vmess.fxxk.dedyn.io CM大佬

vless.fxxk.dedyn.io CM大佬

变量：

SUB=订阅器

UUID=UUID

PROXYIP=推荐几个

[proxyip.fxxk.dedyn.io](http://proxyip.fxxk.dedyn.io/)

IP落地区域: 美国 维护频率: 12小时/次

[proxyip.sg.fxxk.dedyn.io](http://proxyip.sg.fxxk.dedyn.io/)

IP落地区域: 新加坡 维护频率: 12小时/次

[proxyip.jp.fxxk.dedyn.io](http://proxyip.jp.fxxk.dedyn.io/)

IP落地区域: 日本 维护频率: 12小时/次

[proxyip.hk.fxxk.dedyn.io](http://proxyip.hk.fxxk.dedyn.io/)

IP落地区域: 香港 维护频率: 12小时/次

[proxyip.aliyun.fxxk.dedyn.io](http://proxyip.aliyun.fxxk.dedyn.io/)

IP落地区域: 阿里云 维护频率: 4小时/次

[proxyip.oracle.fxxk.dedyn.io  ](http://proxyip.oracle.fxxk.dedyn.io/)

IP落地区域: 甲骨文 维护频率: 4小时/次

[proxyip.digitalocean.fxxk.dedyn.io](http://proxyip.digitalocean.fxxk.dedyn.io/)

IP落地区域: 数码海 维护频率: 4小时/次

#### 2，订阅器部署

代码地址：https://raw.githubusercontent.com/dockkkk/CF-WORKERS/main/dingyue.js

优选域名推荐

[cfip.xxxxxxxx.tk:2096](http://cfip.xxxxxxxx.tk:2096/)

[cdn.kaiche.tk:2096](http://cdn.kaiche.tk:2096/)

[c.xf.free.hr:2087](http://c.xf.free.hr:2087/)

[cf.090227.xyz:443](http://cf.090227.xyz:443/)

[sp.rweek.top:443](http://sp.rweek.top:443/)

[hk.rweek.top:2052](http://hk.rweek.top:2052/)

推荐api地址

https://raw.githubusercontent.com/ymyuuu/IPDB/main/bestcf.txt

变量自动：

UUID=UUID

HOST=伪装域名

PATH=路径

TOKEN=订阅入口

手动填写：https://生成器地址/sub?host=伪装域名&uuid=你的UUID&path=路径





## **2、2023最佳免费vpn方式**

**发布于 2023-07-21**

> 源： https://jdssl.top/index.php/2023/07/21/2023vpn/



###### **WIN:**

v2rayN 最新版[下载地址>>](https://github.com/2dust/v2rayN/releases)

cloudflare[网站链接>>](https://dash.cloudflare.com/)

临时邮箱：https://www.linshiyouxiang.net/

部署代码：https://github.com/leilei223/edgetunnel/blob/main/src/worker-vless.js

uuid生成：https://1024tools.com/uuid

免费域名注册：https://www.dynadot.com/register-your-free-link-domain

付费域名注册：[www.namesilo.com](http://www.namesilo.com/)（付费域名注册和解析[点击查看这个视频>>跳转到4分17秒处](https://www.youtube.com/watch?v=5pb4yQwu1T4)）

workers win专用ip优选：[下载地址>>](https://jdssl.top/wp-content/uploads/2023/07/works专用ip优选.zip)

ip查看：https://whatismyipaddress.com/

cf ip优选；https://stock.hostmonit.com/CloudFlareYes

网络测速：https://www.speedtest.net/result/14952074175

openclash转换订阅网址：https://sub-web.netlify.app/

##### **代理ips**

```
cdn-all.xn--b6gac.eu.org
cdn.xn--b6gac.eu.org 
cdn-b100.xn--b6gac.eu.org 
edgetunnel.anycast.eu.org 
cdn.anycast.eu.org 
```

1.有域名（有tls加密，443端口)，推荐！
Custom Domains查看——添加自定义域——填1个二级域名
点击自定义域，在二级域名后加/UUID，就能看到VLESS节点URL和Clash-meta配置
在v2rayN导入URL，地址栏改为优选ip

2.无域名（没tls加密，80或者2052端口）
进去worker.dev，加上/uuid就能看到VLESS节点URL和Clash-meta配置。v2ray,shadowrocket等客户端要去掉tls加密，端口改为80或者2052，地址修为优选 ip

无法优选ip 可以使用这个（youxuan.jdssl.link）域名在v2ray 填优选ip处填写，把端口改为：80 并把下面的tls关闭。



cloudflare颁发证书网站

#### **ip优选下载为0 可以直接使用下方域名，去\*[站长>>](https://ping.chinaz.com/)\*或[\*itdog>>\* ](https://www.itdog.cn/ping/)**

**挑选下方任意一个域名，然后粘贴，ping检测后，看地图上自己所属省份是否能使用，若颜色是绿色和黄色，说明这个域名可以使用，若你的省份为红色，则无法使用，换另一个域名测试，如果ping后是绿色或黄色，可以直接使用下方域名，或者使用解析出来的ip 作为优选ip到v2rayn中替换使用。**

![img](https://i0.wp.com/jdssl.top/wp-content/uploads/2023/08/Snipaste_2023-12-11_22-14-38-scaled.jpg?fit=1024%2C668&ssl=1)

```
gamer.com.tw
steamdb.info
toy-people.com
silkbook.com
cdn.anycast.eu.org
icook.hk
shopify.com
www.visa.com.tw
time.is
japan.com
www.hugedomains.com
www.visa.com.sg
www.whoer.net
www.visa.com.hk
malaysia.com
www.visa.co.jp
www.ipget.net
icook.tw
www.visa.com
www.gov.ua
www.udacity.com
www.shopify.com
www.whatismyip.com
singapore.com
www.visakorea.com
www.csgo.com
russia.com
ip.sb
www.4chan.org
www.glassdoor.com
xn--b6gac.eu.org
www.digitalocean.com
www.udemy.com
cdn-all.xn--b6gac.eu.org
dnschecker.org
tasteatlas.com
toy-people.com
pixiv.net
comicabc.com
icook.tw
gamer.com.tw
steamdb.info
toy-people.com
silkbook.com
```







## **3、如何只优选美国德国法国等特定国家ip**

**发布于 2023-.8-05**

> 源 https://jdssl.top/index.php/2023/08/05/problem/



**问题1：无法运行bat后缀文件问题**

**问题2：IP优选，特定国家ip段，ip跳动问题**

**问题3：无法免费注册link域名**

**问题4：新版 vless 众多TLS节点无法使用。**

**问题5：vless节点怎么在clash当中分流使用？**



###### ***win 电脑解决方案\***

 

```
./CloudflareST -url https://jp.cloudflarest.link -tl 200 -sl 3 -dn 10
```

win 32位 优选ip 下载：https://jdssl.lanzouw.com/iWdrN14wmola

win64位 ip&域名优选打包：[点击下载>> ](https://jdssl.lanzouw.com/iL5Ww14i3lib)

##### **问题2解决方案：**

临时邮箱：https://www.linshiyouxiang.net/

fofa：https://fofa.info/

美国地区cf反代ip查询代码：

```
server=="cloudflare" && port=="80" && header="Forbidden" && country=="US" && asn!="13335" && asn!="209242"
```

需要其他地区可更改以上代码的“US” 的国家简写

比如德国：简写”DE” 代码如下：

```
server=="cloudflare" && port=="80" && header="Forbidden" && country=="DE" && asn!="13335" && asn!="209242"
```

国家简写网站查询：http://m.news.xixik.com/content/6bb1b9873c71c353/

美国，法国，德国ip段可直接导入ip.txt，[点击下载>>](https://jdssl.lanzouw.com/icAby14xrwve)

##### **问题3解决方案：**

无法注册或已经不免费，可以去其他网站注册便宜的域名，

提供一个便宜域名注册网站：[www.namesilo.com](http://www.namesilo.com/)

（付费域名注册和解析[点击查看这个视频>>跳转到4分17秒处](https://www.youtube.com/watch?v=5pb4yQwu1T4)）

##### **问题4解决方案：**

使用域名用tls，可参考[这个视频>>的11:56处查看，](https://youtu.be/5fvhws6ZXrM)来使域名使用tls节点。

##### **问题5解决方案：**

clash meta版本下载地址：https://github.com/zzzgydi/clash-verge/releases/tag/v1.3.5

win版本：https://github.com/zzzgydi/clash-verge/releases/download/v1.3.5/Clash.Verge_1.3.5_x64-setup.exe

mac版本：https://github.com/zzzgydi/clash-verge/releases/download/v1.3.5/Clash.Verge_1.3.5_x64.dmg

轻量代码编辑器下载：https://www.sublimetext.com/3

sublimetext汉化高亮win这里下载：https://jdssl.lanzouw.com/iloSz14mra9e

clash yaml配置文件：https://jdssl.lanzouw.com/iyJDV14ueruh





