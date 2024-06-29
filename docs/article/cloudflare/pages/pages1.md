---
date: 2022-12-06
category:
  - VPN
tag:
  - Cloudflare
  - Pages
---

pages  & Blog 部署日志
<!-- more -->



## Blog 日志

1.  github pages：

   DNS： A：mycf2hj.top    185.199.108.153

   ​			 A：mycf2hj.top    185.199.109.153

   ​			 A：mycf2hj.top    185.199.110.153

   ​			 A：mycf2hj.top    185.199.111.153

   ​			CNAME：www (前缀)      jikenu.github.io (对应账户github  io的地址)

   ​	ipv4地址为： https://api.github.com/meta   中 pages 的4个ipv4地址，   若需ipv6地址  dns类型为 AAAA

   

2.   部署到 cloudflare

   注意将yml自动部署流改为txt  无需自动部署

   创建pages仓库

   构建命令： pnpm run docs:build

   输出目录：/docs/.vuepress/dist/

   根目录不变；

   **添加环境变量：NODE_VERSION   20**

   设置自定义域   最好设置一个前缀  (docs、blog)
