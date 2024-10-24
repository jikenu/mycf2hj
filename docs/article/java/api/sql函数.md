# sql语法收集



#### 查询函数

```shell
# 如果不存在(没查到)返回null  或  其他默认值
select ifnull(字段, '默认值') as 列名
```



#### 统计函数

```shell
# case when 条件 then v1 else v2 end   说明:count(*) + where 的方式只能查询一种状态的数目,查询多个状态的数量时用这个 
sum(case when status=1 then 1 else 0 end) as delist,
sum(case when status=0 then 1 else 0 end) as put
```



#### 日期函数

```sh
# 获取当前时间
curdate()
# 日期格式化
date_format(curdate(), "%Y-%m-%d %H:%i:%s")
# 日期减函数(会自动算上每月天数)
DATE_SUB(CURDATE(), INTERVAL 3 MONTH)   	# 当前时间 - 3月
DATE_SUB('2020-04-25', INTERVAL 3 MONTH)	# 指定时间 - 3月
# 可指定的日期单位: MICROSECOND:毫秒 SECOND:秒 MINUTE:分钟 HOUR:小时 DAY:天 WEEK:周 MONTH:月 QUARTER:季度 YEAR:年
# 日期加函数
DATE_ADD(CURDATE(), INTERVAL 3 MONTH)		# 当前时间 + 3月
DATE_ADD('2020-04-25', INTERVAL 3 MONTH)	# 指定时间 + 3月
```



