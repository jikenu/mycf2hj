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
Hong Kong Broadband Network Ltd   9269  ---  150ms  快

ZEN-ECN 21859	 ---- 200ms 快

CNSERVERS		40065 ----- 200ms  很快

VMISS	400464     ----    200ms   还不错

Google 396982

微软     8075
阿里: 45102

HK Limit 4760

腾讯(Tencent Building, Kejizhongyi Avenue)     132203
华为(HUAWEI CLOUDS)     136907

 Cloudie Limited	55933  ----   200ms


示例：  美国
server=="cloudflare" && port=="80" && header="Forbidden" && country=="US" && asn!="13335" && asn!="209242"

自制：
1、server=="cloudflare" && asn=="45102" && region=="HK" && asn!="13335" && asn!="209242" && port=="80"

2、server=="cloudflare" && port=="80" && header="Forbidden" && country=="HK" && asn!="13335" && asn!="209242"

3、 查询443 server=="cloudflare" && port=="443" && header="Forbidden" && region=="HK" && asn!="13335" && asn!="209242" && asn!="132585" && asn!="45102"

附：
1、-- region=="HK"  和 city=="Hong Kong"  相同

2、-- asn!="132585"    该asn香港节点 非常多   且都不可用  -1