---
date: 2024-03-03
category:
  - Project
  - SpringBoot
tag:
  - NetDosk
---


手写网盘总结一，验证码、登录、注册、aop切面实现自定义注解
<!-- more -->
# NetDisk Day1


### 验证码生成

主要类：  (看注释即可)

```java
public class CreateImageCode {
    // 默认验证码属性  可通过构造方法修改
    private int width = 160;// 图片的宽度
    private int height = 40;// 图片的高度
    private int codeCount = 4;// 验证码字符个数
    private int lineCount = 20;// 验证码干扰线数
    private String code = null;// 验证码
    private BufferedImage buffImg = null;// 验证码图片Buffer
    Random random = new Random();

    public CreateImageCode() {
        creatImage();
    }

    public CreateImageCode(int width, int height) {
        this.width = width;
        this.height = height;
        creatImage();
    }

    public CreateImageCode(int width, int height, int codeCount) {
        this.width = width;
        this.height = height;
        this.codeCount = codeCount;
        creatImage();
    }

    public CreateImageCode(int width, int height, int codeCount, int lineCount) {
        this.width = width;
        this.height = height;
        this.codeCount = codeCount;
        this.lineCount = lineCount;
        creatImage();
    }

    // 生成图片
    private void creatImage() {
        int fontWidth = width / codeCount;      // 字体的宽度
        int fontHeight = height - 5;            // 字体的高度
        int codeY = height - 8;

        // 图像buffer
        buffImg = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
        Graphics g = buffImg.getGraphics();
        //Graphics2D g = buffImg.createGraphics();
        // 设置背景色
        g.setColor(getRandColor(200, 250));
        g.fillRect(0, 0, width, height);
        // 设置字体
        //Font font1 = getFont(fontHeight);
        Font font = new Font("Fixedsys", Font.BOLD, fontHeight);
        g.setFont(font);

        // 设置干扰线
        for (int i = 0; i < lineCount; i++) {
            int xs = random.nextInt(width);
            int ys = random.nextInt(height);
            int xe = xs + random.nextInt(width);
            int ye = ys + random.nextInt(height);
            g.setColor(getRandColor(1, 255));
            g.drawLine(xs, ys, xe, ye);
        }

        // 添加噪点
        float yawpRate = 0.01f;// 噪声率
        int area = (int) (yawpRate * width * height);
        for (int i = 0; i < area; i++) {
            int x = random.nextInt(width);
            int y = random.nextInt(height);
            buffImg.setRGB(x, y, random.nextInt(255));
        }

        String str1 = randomStr(codeCount);// 得到随机字符
        this.code = str1;
        for (int i = 0; i < codeCount; i++) {
            String strRand = str1.substring(i, i + 1);
            g.setColor(getRandColor(1, 255));
            // g.drawString(a,x,y);
            // a为要画出来的东西，x和y表示要画的东西最左侧字符的基线位于此图形上下文坐标系的 (x, y) 位置处

            g.drawString(strRand, i * fontWidth + 3, codeY);
        }
    }
    
    /**
     * 生成随机字符
     * @param n: 字符位数
     * @return
     */
    private String randomStr(int n) {
        String str1 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
        String str2 = "";
        int len = str1.length() - 1;
        double r;
        for (int i = 0; i < n; i++) {
            r = (Math.random()) * len;
            str2 = str2 + str1.charAt((int) r);
        }
        return str2;
    }

    // 生成随机颜色
    private Color getRandColor(int fc, int bc) {// 给定范围获得随机颜色
        if (fc > 255) fc = 255;
        if (bc > 255) bc = 255;
        int r = fc + random.nextInt(bc - fc);
        int g = fc + random.nextInt(bc - fc);
        int b = fc + random.nextInt(bc - fc);
        return new Color(r, g, b);
    }

    /**
     * 产生随机字体
     */
    private Font getFont(int size) {
        Random random = new Random();
        Font font[] = new Font[5];
        font[0] = new Font("Ravie", Font.PLAIN, size);
        font[1] = new Font("Antique Olive Compact", Font.PLAIN, size);
        font[2] = new Font("Fixedsys", Font.PLAIN, size);
        font[3] = new Font("Wide Latin", Font.PLAIN, size);
        font[4] = new Font("Gill Sans Ultra Bold", Font.PLAIN, size);
        return font[random.nextInt(5)];
    }

    // 扭曲方法  分别定义扭曲X轴和Y轴的方法  在此处执行
    private void shear(Graphics g, int w1, int h1, Color color) {
        shearX(g, w1, h1, color);
        shearY(g, w1, h1, color);
    }

    private void shearX(Graphics g, int w1, int h1, Color color) {
        int period = random.nextInt(2);

        boolean borderGap = true;
        int frames = 1;
        int phase = random.nextInt(2);

        for (int i = 0; i < h1; i++) {
            double d = (double) (period >> 1) * Math.sin((double) i / (double) period + (6.2831853071795862D * (double) phase) / (double) frames);
            g.copyArea(0, i, w1, 1, (int) d, 0);
            if (borderGap) {
                g.setColor(color);
                g.drawLine((int) d, i, 0, i);
                g.drawLine((int) d + w1, i, w1, i);
            }
        }
    }

    private void shearY(Graphics g, int w1, int h1, Color color) {
        int period = random.nextInt(40) + 10; // 50;

        boolean borderGap = true;
        int frames = 20;
        int phase = 7;
        for (int i = 0; i < w1; i++) {
            double d = (double) (period >> 1) * Math.sin((double) i / (double) period + (6.2831853071795862D * (double) phase) / (double) frames);
            g.copyArea(i, 0, 1, h1, 0, (int) d);
            if (borderGap) {
                g.setColor(color);
                g.drawLine(i, (int) d, i, 0);
                g.drawLine(i, (int) d + h1, i, h1);
            }

        }
    }
    
    // 接收前端传入的response,将图像写入response中的outPutStream中
    public void write(OutputStream sos) throws IOException {
        ImageIO.write(buffImg, "png", sos);
        sos.close();
    }

    public BufferedImage getBuffImg() {
        return buffImg;
    }
    public String getCode() {
        return code.toLowerCase();
    }
}
```

controller层： 

1. 只在controller中使用，接收前端传回的HttpServletResponse对象，生成图像后，将图像写入response的optPutStream流中，方法的路径就是前端img标签的src路径

2. 将验证码写入session，以便注册或登录时获取到进行比对

```java
// AccountController
@RequestMapping(value = "/checkCode")
public void checkCode(HttpServletResponse response, HttpSession session, Integer type) throws
        IOException {
    CreateImageCode vCode = new CreateImageCode(130, 38, 5, 10);
    // 2行代码：禁止浏览器缓存图片
    response.setHeader("Pragma", "no-cache");
    response.setHeader("Cache-Control", "no-cache");
    response.setDateHeader("Expires", 0);
    response.setContentType("image/jpeg");
    String code = vCode.getCode();
    // 将值写入到session 中 用于比对于
    if (type == null || type == 0) {
        session.setAttribute(Constants.CHECK_CODE_KEY, code);
    } else {
        session.setAttribute(Constants.CHECK_CODE_KEY_EMAIL, code);
    }
    // 通过 write方法将生成的 imageBuffer 写入 response的outPutStream中
    vCode.write(response.getOutputStream());
}
```



### 注册

controller层：

1. 获取session中的验证码，与接收的参数(即输入的验证码)比对，String.equalsIgnoreCase方法可不区分大小写比对
2. 去service层发送邮箱验证码
3. finally不管成功与否，都需将当前验证码从session中删除

```java
// AccountController
@RequestMapping("/sendEmailCode")
@GlobalInterceptor(checkLogin = false, checkParams = true)
public ResponseVO sendEmailCode(HttpSession session,
                                @VerifyParam(required = true, regex = VerifyRegexEnum.EMAIL, max = 150) String email,
                                @VerifyParam(required = true) String checkCode,
                                @VerifyParam(required = true) Integer type) {
    try {
        if (!checkCode.equalsIgnoreCase((String) session.getAttribute(Constants.CHECK_CODE_KEY_EMAIL))) {
            throw new BusinessException("图片验证码不正确");
        }
        emailCodeService.sendEmailCode(email, type);
        return getSuccessResponseVO(null);
    } finally {
        // 验证完后删除验证码
        session.removeAttribute(Constants.CHECK_CODE_KEY_EMAIL);
    }
}
```

service层：

1. 检查邮箱是否已注册，userInfoMapper.selectByEmail(toEmail)，此处查找的是**user对象**
2. 生成5位随机数字，调用重载方法进行发送
3. 封装邮箱类，将注册的邮箱添加到数据库，此处添加的是**验证码对象**（EmailCode：验证码类）
4. 注意验证码与user两个对象都在数据库中有表，并且都有邮箱属性

```
// EmailCodeServiceImpl
@Override
@Transactional(rollbackFor = Exception.class)
public void sendEmailCode(String toEmail, Integer type) {
    //如果是注册，校验邮箱是否已存在
    if (type == Constants.ZERO) {
        UserInfo userInfo = userInfoMapper.selectByEmail(toEmail);
        if (null != userInfo) {
            throw new BusinessException("邮箱已经存在");
        }
    }

    String code = StringTools.getRandomNumber(Constants.LENGTH_5); // 生成5位随机字符串
    // 调用本方法的重载方法
    sendEmailCode(toEmail, code);

    emailCodeMapper.disableEmailCode(toEmail);
    EmailCode emailCode = new EmailCode();
    emailCode.setCode(code);
    emailCode.setEmail(toEmail);
    emailCode.setStatus(Constants.ZERO);
    emailCode.setCreateTime(new Date());
    emailCodeMapper.insert(emailCode);  //  将注册的邮箱信息保存
}

// 重载的方法  发送邮件实现
    private void sendEmailCode(String toEmail, String code) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();

            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            //从配置文件中获取发件人
            helper.setFrom(appConfig.getSendUserName());
            //邮件收件人 1或多个
            helper.setTo(toEmail);

            SysSettingsDto sysSettingsDto = redisComponent.getSysSettingsDto();

            //邮件主题
            helper.setSubject(sysSettingsDto.getRegisterEmailTitle());
            //设置邮件内容   将验证码中的%s 替换为验证码
            helper.setText(String.format(sysSettingsDto.getRegisterEmailContent(), code));
            //邮件发送时间
            helper.setSentDate(new Date());
            javaMailSender.send(message);
        } catch (Exception e) {
            logger.error("邮件发送失败", e);
            throw new BusinessException("邮件发送失败");
        }
    }
```



### 登录

controller层：

1. 获取session中的验证码，与接收的参数(即输入的验证码)比对，String.equalsIgnoreCase方法可不区分大小写比对
2. 到service层执行登录流程，返回SessionWebUserDto对象，这是一个**值对象**(在数据库中无映射)
3. 将拿到的SessionWebUserDto对象存到session中作为登录信息，以便前端取值(头像、id等)
4. 封装结果对象返回，当然，最后要删除session中的验证码

```java
// AccountController
@RequestMapping("/login")
@GlobalInterceptor(checkLogin = false, checkParams = true)
public ResponseVO login(HttpSession session, HttpServletRequest request,
                        @VerifyParam(required = true) String email,
                        @VerifyParam(required = true) String password,
                        @VerifyParam(required = true) String checkCode) {
    try {
        if (!checkCode.equalsIgnoreCase((String) session.getAttribute(Constants.CHECK_CODE_KEY))) {
            throw new BusinessException("图片验证码不正确");
        }
        SessionWebUserDto sessionWebUserDto = userInfoService.login(email, password);
        session.setAttribute(Constants.SESSION_KEY, sessionWebUserDto);
        return getSuccessResponseVO(sessionWebUserDto);
    } finally {
        session.removeAttribute(Constants.CHECK_CODE_KEY);
    }
}
```

service层： 见注释

```java
@Override
public SessionWebUserDto login(String email, String password) {
    UserInfo userInfo = this.userInfoMapper.selectByEmail(email);
    // 非空判断
    if (null == userInfo || !userInfo.getPassword().equals(password)) {
        throw new BusinessException("账号或者密码错误");
    }
    // 账号状态 ? 禁用 : 正常
    if (UserStatusEnum.DISABLE.getStatus().equals(userInfo.getStatus())) {
        throw new BusinessException("账号已禁用");
    }
    // 更新最后登录时间
    UserInfo updateInfo = new UserInfo();
    updateInfo.setLastLoginTime(new Date());
    this.userInfoMapper.updateByUserId(updateInfo, userInfo.getUserId());
    // 封装值对象
    SessionWebUserDto sessionWebUserDto = new SessionWebUserDto();
    sessionWebUserDto.setNickName(userInfo.getNickName());
    sessionWebUserDto.setUserId(userInfo.getUserId());
    // 判断是否为管理员
    if (ArrayUtils.contains(appConfig.getAdminEmails().split(","), email)) {
        sessionWebUserDto.setAdmin(true);
    } else {
        sessionWebUserDto.setAdmin(false);
    }
    //用户空间  UserSpaceDto：总空间&已用空间
    UserSpaceDto userSpaceDto = new UserSpaceDto();
    userSpaceDto.setUseSpace(fileInfoService.getUserUseSpace(userInfo.getUserId()));
    userSpaceDto.setTotalSpace(userInfo.getTotalSpace());
    // 将{userId: 空间信息}  数据放入redis
    redisComponent.saveUserSpaceUse(userInfo.getUserId(), userSpaceDto);
    return sessionWebUserDto;
}
```



### 自定义注解

2个注解：

```java
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.PARAMETER, ElementType.FIELD})  //可以被应用于 PARAMETER：方法参数 或 FIELD：字段
public @interface VerifyParam {
    /**
     * 校验正则
     * 没有正则校验。这个方法应该返回一个 自定义VerifyRegexEnum枚举值
     * @return
     */
    VerifyRegexEnum regex() default VerifyRegexEnum.NO;


    // 最小长度
    int min() default -1;

 
    // 最大长度
    int max() default -1;

    boolean required() default false;
}
```

```java
@Target({ElementType.METHOD, ElementType.TYPE}) // 可应用于：METHOD 方法  或  TYPE：类
@Retention(RetentionPolicy.RUNTIME)             //注解的信息将被保留在运行时， 可被反射获取
@Documented                                    // 注解会被Javadoc工具处理，当生成Javadoc时，这个注解会被包含在文档中
@Mapping
public @interface GlobalInterceptor {

    // 校验登录
    boolean checkLogin() default true;

    // 校验参数
    boolean checkParams() default false;

    // 校验管理员
    boolean checkAdmin() default false;
}
```

自定义注解实现详解：  以下详解代码都是在GlobalOperationAspect类中

1. 设置一个处理注解的类，将其加上@aspect注解，设置为切面(AOP)，当然，需要交给spring管理

   ```java
   @Component("operationAspect")
   @Aspect
   public class GlobalOperationAspect {
   ```

2. 定义一个切入点，所有添加@Pointcut括号内注解的方法都会被拦截，并先执行此处的方法；但这里我们没有直接在这个方法里写内容，而是通过@Before，定义在切入点之前执行的方法，在这里面写逻辑

   ```java
   @Pointcut("@annotation(com.easypan.annotation.GlobalInterceptor)")
   private void requestInterceptor() {
   }
   ```

3. 切入点之前的方法，定义了具体的执行内容。  

   首先通过JoinPoint参数获取类、参数、方法名、参数类型信息，通过这些信息得到method对象，调用反射获取到注解；  

   然后获取注解中定义的方法的值(默认值或调用注解时赋的值)，通过值判断要执行的方法(即注解的处理过程)

   ```java
   @Before("requestInterceptor()")
   public void interceptorDo(JoinPoint point) throws BusinessException {
       try {
           Object target = point.getTarget();
           Object[] arguments = point.getArgs();
           String methodName = point.getSignature().getName();
           Class<?>[] parameterTypes = ((MethodSignature) point.getSignature()).getMethod().getParameterTypes();
           // 上面步骤是为了获取这里的 method对象，以便通过反射获取注解
           Method method = target.getClass().getMethod(methodName, parameterTypes);
           GlobalInterceptor interceptor = method.getAnnotation(GlobalInterceptor.class);
           if (null == interceptor) {
               return;
           }
           /**
            * 校验登录
            */
           if (interceptor.checkLogin() || interceptor.checkAdmin()) {
               checkLogin(interceptor.checkAdmin());
           }
           /**
            * 校验参数
            */
           if (interceptor.checkParams()) {
               validateParams(method, arguments);
           }
       } catch (BusinessException e) {
           logger.error("全局拦截器异常", e);
           throw e;
       } catch (Exception e) {
           logger.error("全局拦截器异常", e);
           throw new BusinessException(ResponseCodeEnum.CODE_500);
       } catch (Throwable e) {
           logger.error("全局拦截器异常", e);
           throw new BusinessException(ResponseCodeEnum.CODE_500);
       }
   }
   ```

4. 登录校验详解

   ```java
   //校验登录
   private void checkLogin(Boolean checkAdmin) {
       // 获取httpServletRequest对象
       HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
       HttpSession session = request.getSession();
       // 获取session中的user信息
       SessionWebUserDto sessionUser = (SessionWebUserDto) session.getAttribute(Constants.SESSION_KEY);
       // dev为从properties中取的值  默认false  是否开发环境
       if (sessionUser == null && appConfig.getDev() != null && appConfig.getDev()) {
           List<UserInfo> userInfoList = userInfoService.findListByParam(new UserInfoQuery());
           if (!userInfoList.isEmpty()) {
               UserInfo userInfo = userInfoList.get(0);
               sessionUser = new SessionWebUserDto();
               sessionUser.setUserId(userInfo.getUserId());
               sessionUser.setNickName(userInfo.getNickName());
               sessionUser.setAdmin(true);
               session.setAttribute(Constants.SESSION_KEY, sessionUser);
           }
       }
       if (null == sessionUser) {
           throw new BusinessException(ResponseCodeEnum.CODE_901);
       }
   
       if (checkAdmin && !sessionUser.getAdmin()) {
           throw new BusinessException(ResponseCodeEnum.CODE_404);
       }
   }
   ```

5. 参数校验详解

   ```java
   //成员变量：
   /*
   	private static final String TYPE_STRING = "java.lang.String";
       private static final String TYPE_INTEGER = "java.lang.Integer";
       private static final String TYPE_LONG = "java.lang.Long";
   */
   private void validateParams(Method m, Object[] arguments) throws BusinessException {
       Parameter[] parameters = m.getParameters(); // 获取方法的参数列表
       for (int i = 0; i < parameters.length; i++) {
           Parameter parameter = parameters[i];
           Object value = arguments[i];
           // 获取的参数列表中可能有参数没加注解, 所以作null判断
           VerifyParam verifyParam = parameter.getAnnotation(VerifyParam.class);
           if (verifyParam == null) {
               continue;
           }
           //基本数据类型，这里指java的所有数据对象
           if (TYPE_STRING.equals(parameter.getParameterizedType().getTypeName()) || TYPE_LONG.equals(parameter.getParameterizedType().getTypeName()) || TYPE_INTEGER.equals(parameter.getParameterizedType().getTypeName())) {
               checkValue(value, verifyParam);
               // 如果传递的是对象， 即非java自带的数据类型
           } else {
               checkObjValue(parameter, value);
           }
       }
   }
   ```

   值对象&自定义对象：

   ```java
   private void checkObjValue(Parameter parameter, Object value) {
       try {
           String typeName = parameter.getParameterizedType().getTypeName();
           // 根据自定义对象的类型  获取到对象
           Class classz = Class.forName(typeName);
           // 获取到对象的变量(字段)列表
           Field[] fields = classz.getDeclaredFields();
           for (Field field : fields) {
               // 遍历对象内部的变量，看是否有VerifyParam注解存在
               VerifyParam fieldVerifyParam = field.getAnnotation(VerifyParam.class);
               if (fieldVerifyParam == null) {
                   continue;
               }
               // 如果存在注解， 调用基本检测对象的方法（可能有问题？？？？？？？如果仍然是自定义对象？）
               field.setAccessible(true);
               Object resultValue = field.get(value);
               checkValue(resultValue, fieldVerifyParam);
           }
       } catch (BusinessException e) {
           logger.error("校验参数失败", e);
           throw e;
       } catch (Exception e) {
           logger.error("校验参数失败", e);
           throw new BusinessException(ResponseCodeEnum.CODE_600);
       }
   }
   ```

   ```java
   // 基本数据对象校验   校验VerifyParam注解的3个规则
   private void checkValue(Object value, VerifyParam verifyParam) throws BusinessException {
       Boolean isEmpty = value == null || StringTools.isEmpty(value.toString());
       Integer length = value == null ? 0 : value.toString().length();
   
       // 校验空
       if (isEmpty && verifyParam.required()) {
           throw new BusinessException(ResponseCodeEnum.CODE_600);
       }
   
       // 校验长度
       if (!isEmpty && (verifyParam.max() != -1 && verifyParam.max() < length || verifyParam.min() != -1 && verifyParam.min() > length)) {
           throw new BusinessException(ResponseCodeEnum.CODE_600);
       }
   
       // 校验正则
       if (!isEmpty && !StringTools.isEmpty(verifyParam.regex().getRegex()) && !VerifyUtils.verify(verifyParam.regex(), String.valueOf(value))) {
           throw new BusinessException(ResponseCodeEnum.CODE_600);
       }
   }
   ```




### Redis结构设计

RedisConfig：序列化配置类

RedisUtils： 设置添加、删除缓存的操作方法

RedisComponent：调用RedisUtils中的方法，编写一些业务中可能用到的缓存方法

K，V设计：

```java
// Constants
public static final Integer REDIS_KEY_EXPIRES_FIVE_MIN = REDIS_KEY_EXPIRES_ONE_MIN * 5;

public static final String REDIS_KEY_DOWNLOAD = "easypan:download:";
//邮箱类的key，取到value后强转为SysSettingsDto邮箱类
public static final String REDIS_KEY_SYS_SETTING = "easypan:syssetting:";
// 用户空间的key，存放时后面加对应 userId
public static final String REDIS_KEY_USER_SPACE_USE = "easypan:user:spaceuse:";

public static final String REDIS_KEY_USER_FILE_TEMP_SIZE = "easypan:user:file:temp:";
```

