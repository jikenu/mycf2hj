---
date: 2023-01-06
category:
  - VPN
tag:
  - Cloudflare
---

fofa日志
<!-- more -->

# fofa 语句

**HK:  
阿里: 45102  
HK Limit 4760  
ZEN-ECN 21859  
Google 396982  
腾讯     132203  
微软     8075**  

示例：  美国  
server=="cloudflare" && port=="80" && header="Forbidden" && country=="US" && asn!="13335" && asn!="209242"  

自制：  
1、server=="cloudflare" && asn=="45102" && region=="HK" && asn!="13335" && asn!="209242" && port=="80"  
2、server=="cloudflare" && port=="80" && header="Forbidden" && country=="HK" && asn!="13335" && asn!="209242"  

附：  
1、-- region=="HK"  和 city=="Hong Kong"  相同  
2、-- asn!="132585"    该asn香港节点 非常多   且都不可用  -1  