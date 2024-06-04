---
date: 2022-12-21
category:
  - Java
tag:
  - utils
---

java 常用工具类 配置类
<!-- more -->

# 自定义工具类

### 比较类 CommonUtils

```java
public final class CommonUtis {
    /**
     * string is not empty
     *
     * @param src
     * @return
     */
    public static boolean isNotEmpty(String src) {
        return src != null && src.trim().length() > 0;
    }

    /**
     * list/set is not empty
     *
     * @param collection
     * @return
     */
    public static boolean isNotEmpty(Collection<?> collection) {
        return collection != null && !collection.isEmpty();
    }

    /**
     * map is not empty
     *
     * @param map
     * @return
     */
    public static boolean isNotEmpty(Map<?, ?> map) {
        return map != null && !map.isEmpty();
    }

    /**
     * 数组不为空
     * 
     * @param arr
     * @return 
     * @see 
     */
    public static boolean isNotEmpty(Object[] arr) {
        return arr != null && arr.length > 0;
    }

    /**
     * 对字符串去空白符和换行符等
     * 
     * @return 
     */
    public static String stringTrim(String src) {
        return (null != src) ? src.trim() : null;
    }
}
```



### Redis 序列化及配置类

```java
@Configuration
@EnableCaching
public class RedisConfig {

    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory factory) {
        RedisTemplate<String, Object> redisTemplate = new RedisTemplate<>();
        redisTemplate.setConnectionFactory(factory);

        redisTemplate.setKeySerializer(new StringRedisSerializer());
        redisTemplate.setValueSerializer(new GenericJackson2JsonRedisSerializer());

        redisTemplate.setHashKeySerializer(new StringRedisSerializer());
        redisTemplate.setHashValueSerializer(new Jackson2JsonRedisSerializer<Object>(Object.class));

        return redisTemplate;
    }

    @Bean
    public RedisCacheManager redisCacheManager(RedisTemplate redisTemplate) {
        RedisCacheWriter redisCacheWriter = RedisCacheWriter.nonLockingRedisCacheWriter(redisTemplate.getConnectionFactory());
        RedisCacheConfiguration redisCacheConfiguration = RedisCacheConfiguration.defaultCacheConfig()
                .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(redisTemplate.getValueSerializer()));
        return new RedisCacheManager(redisCacheWriter, redisCacheConfiguration);
    }
}

```



### MybatisPlus 分页拦截器配置类

```java
//MyBatisPlus相关配置
@Configuration
public class MpConfig {
    @Bean
    public MybatisPlusInterceptor mybatisPlusInterceptor() {
        MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();
        interceptor.addInnerInterceptor(new PaginationInnerInterceptor());//添加内部分页拦截器
        return interceptor;
    }
}

```



### JwtUtils: 搭配Interceptor   WebConfiguration

```java
@Component("JwtUtils")
public class JwtUtils {

    public static final Key SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS512);

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    public  String generateToken(String username) {
        String token = Jwts.builder().setSubject(username)
                .signWith(SECRET_KEY)
                .setIssuedAt(new Date(10))
                .compact();

        redisTemplate.opsForValue().set(username, token, 100000, TimeUnit.MILLISECONDS);
        return token;
    }

    public  boolean validateToken(String token) {
        String username = getUsernameFromToken(token);
        // 从redis 中取出 该username 真实 token   与参数token比较
        String re_token = redisTemplate.opsForValue().get(username);

        if (token.equals(re_token)) {
            System.out.println("比对成功");
            return true;
        }
        else {
            System.out.println("比对失败");
            return false;
        }

    }

    public  String getUsernameFromToken(String token) {
//        Jws<Claims> jws = Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token);
        // parser()方法弃用后的新方法
        Jws<Claims> jws = Jwts.parserBuilder().setSigningKey(SECRET_KEY).build().parseClaimsJws(token);
        Claims claims = jws.getBody();
        return claims.getSubject();
    }
}

```



### MyInterceptor 登录拦截配置

```java
@Component
public class MyInterceptor implements HandlerInterceptor {

    @Resource(name = "JwtUtils")
    JwtUtils jwtUtils;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        response.setHeader("Access-Control-Allow-Origin",request.getHeader("origin"));
        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT,OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "*");

        String token = request.getHeader("auth");
        System.out.println("TOKEN: " + token);
        if (token != null && jwtUtils.validateToken(token)) {
            System.out.println("放行");
            return true;
        } else {
            System.out.println("拦截");
            return false;
        }
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        HandlerInterceptor.super.postHandle(request, response, handler, modelAndView);
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        HandlerInterceptor.super.afterCompletion(request, response, handler, ex);
    }
}

```



### MyWebConfiguration web配置类

```java
@Configuration
public class MyWebConfig implements WebMvcConfigurer {

    @Autowired
    MyInterceptor myInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {

        registry.addInterceptor(myInterceptor).addPathPatterns("/**")
                .excludePathPatterns(
                        "/pages/login.html",
                        "/login",
                        "*.css",
                        "*.js"
                );
    }
}

```



### 全局跨域配置 GlobalCorsConfig

```java
/*全局配置：跨域*/
@Configuration
public class GlobalCorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer(){
        return new WebMvcConfigurer() {
            @Override
            //重写父类提供的跨域请求处理的接口
            public void addCorsMappings(CorsRegistry registry) {
                //放行哪些原始域
                registry.addMapping("/**")
                        //是否发送Cookie信息
                        .allowCredentials(true)
                        //放行哪些原始域(头部信息)
                        .allowedHeaders("*")
                        //放行哪些原始域(请求方式)
                        .allowedMethods("GET","POST","PUT","DELETE")
                         //放行哪些原始域
                        .allowedOrigins("*")
                        //暴露哪些头部信息（因为跨域访问默认不能获取全部头部信息）
                        .exposedHeaders("Header1","Header2");
            }
        };
    }
}

```

