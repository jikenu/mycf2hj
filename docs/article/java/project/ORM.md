---
date: 2023-09-06
category:
  - Project
  - SpringBoot
tag:
  - Mybatis
---


手写简易mini-mybatis总结
<!-- more -->
# ORM框架

**手写简易mini-mybatis总结，从Main入口往下：**

### Main

```java
public class Main {
    public static void main(String[] args) {

        SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build("/conf.properties");
        SqlSession sqlSession = sqlSessionFactory.opSession();

        BookMapper bookMapper = sqlSession.getMapper(BookMapper.class);
        Book book = bookMapper.selectOne(1);
        System.out.println(book);
        List<Book> books = bookMapper.selectList();
        System.out.println(books);
    }
}
```

main中为创建流程：

1. SqlSessionFactoryBuilder： build方法创建SqlSessionFactory对象

2. SqlSessionFactory：opSession方法创建sqlSession对象，这里的SqlSessionFactory和SqlSession都是接口，有实现类(Deafult··)

3. Mapper： sqlsession调getMapper方法创建mapper对象 (Class(T) type  作mapper类型 = ··mapper.clsss)

4. 最后调用  mapper接口中的方法   (在对应xml文件中创建namespace:接口名  ， id:方法名   写sql语句 及返回类型)




##### 流程解析

1.  SqlSessionFactoryBuilder().build("/conf.properties")： 

   通过build重载，创建了SqlSessionFactory，并且new Configuration() 传递下去

2.  qlSessionFactory.opSession()  [有实现类]：

   loadMappersInfo(configuration)  **调用XMLUtil添加mapperStatememt 和 mapper   都add到了configuration中**

   openSession(confi...)  返回了  new DefaultSqlSession(configuration)

   addMapper步骤解析

   ```java
   /*
   	addMapper实际上是向MapperRegister类中添加MapperProxyFactory
   	MapperProxyFactory类中维护着Map<Class<?>, MapperProxyFactory<?>> 哈希表
   	
   	getMapper时需注意(看getMapper方法)：
   	先通过type创建factory对象，调factory对象的newInstance方法时传入sqlSession
   	sqlSession 在mapperProxy中有两个调用 取出mapperStatement、调用selectOne/List...方法
   	
   	在mapperProxy中执行selectOne/List...方法后会回到sqlSession中：
   	sqlSession的CRUD方法会调用executor执行后续sql操作(具体看executor中的7步骤)
   */
   
   // Configuration.class
   protected final MapperRegister mapperRegister = new MapperRegister();
   public void addMapper(Class<?> type) {
           mapperRegister.addMapper(type);
       }
   
   // MapperRegister.class
   private final Map<Class<?>, MapperProxyFactory<?>> mappers = new HashMap<>();
   public <T> void addMapper(Class<T> type) {
           mappers.put(type, new MapperProxyFactory<T>(type)); }
       public <T> T getMapper(Class<T> type, SqlSession sqlSession) {
           MapperProxyFactory<T> mapperProxyFactory = (MapperProxyFactory<T>) mappers.get(type);
           return mapperProxyFactory.newInstance(sqlSession); }
   
   ```

   

3.  sqlSession.getMapper(BookMapper.class) [有实现类]：

   构造方法： 接收configuration，new Executor(configuration)

   getMapper(Class《T》 type)：从configuration中拿出mapper   生成 **Mapper



### SqlSessionFactoryBuilder

```java
public class SqlSessionFactoryBuilder {

    public SqlSessionFactory build(String fileName) {
        InputStream stream = SqlSessionFactory.class.getResourceAsStream(fileName);
        System.out.println("stream:  "+stream);
        return build(stream);
    }

    public SqlSessionFactory build(InputStream stream) {
        try {
            Configuration.PROPS.load(stream);

        } catch (IOException e) {
            e.printStackTrace();
        }
        return new DefaultSqlSessionFactory(new Configuration());
    }
}
```

框架入口，build方法重载

1. build(String fileName)方法：加载stream流，交给重载方法创建SqlSessionFactory对象；

   .class.getResourceAsStream(fileName)：加载类路径(target/classes)下的文件  class调用就是类路径

2. build(InputStream stream)：Configuration.PROPS.load(stream)加载配置文件，只能加载InputStream流，加载后才可以调用getProperties(String key)方法读取配置文件；返回DefaultSqlSessionFactory(new Configuration())  是SqlSessionFactory的实现类



### SqlSessionFactory

接口：

```java
public interface SqlSessionFactory {
    public SqlSession opSession();
}
```

实现类：

```java
public class DefaultSqlSessionFactory implements SqlSessionFactory {

    private final Configuration configuration;

    public DefaultSqlSessionFactory(Configuration configuration) {
        this.configuration = configuration;
        String dir = Configuration.getProperty(Constant.MAPPER_LOCATION).replaceAll("\\.", "/");
		//  我这里似乎不需要replace
        loadMappersInfo(dir);
    }

    @Override
    public SqlSession opSession() {
        return new DefaultSqlSession(configuration);
    }

    private void loadMappersInfo(String dirName) {

        URL url = DefaultSqlSessionFactory.class.getClassLoader().getResource(dirName);

        File mapperFile = new File(url.getFile());

        if (mapperFile.isDirectory()) {
            File[] mappers = mapperFile.listFiles();
            System.out.println(mappers[1].getName());
            if (CommonUtils.isNotEmpty(mappers)) {

                for (File file : mappers) {
                    System.out.println("currentFile:   " + file.getName());
                    if (file.isDirectory()) {
                        System.out.println("isDir");
                        loadMappersInfo(dirName + "/" + file.getName());
                    } else if (file.getName().endsWith(Constant.MAPPER_FILE_SUFFIX)){
                        System.out.println("addMapper");
                        XmlUtil.readMapperXml(file, configuration);
                    }
                }
            }
        }

    }
}
```

1. 构造方法：Configuration.getProperty(Constant.MAPPER_LOCATION) 得到xml文件路径
2. loadMappersInfo(String dirName)方法： 获取dirName下文件名，如果为路径则递归loadMappersInfo(dirName + "/" + file.getName())，如果为文件，检测是否以xml后缀结尾，是则调用XmlUtil.readMapperXml(file, configuration)，这里会解析xml配置并执行Configuration中的addMapper
3. opSession()： 返回的同样是sqlSession的default实现类



### SqlSession

接口：

```java
public interface SqlSession {

    <T> T getMapper(Class<T> paramClass);

    Configuration getConfiguration();

    <T> T selectOne(String statementId, Object parameter);

    <E> List<E> selectList(String statementId, Object parameter);

    void update(String statementId, Object parameter);

    void insert(String statementId, Object parameter);
}
```

实现类：

```java
public class DefaultSqlSession implements SqlSession {

    private final Configuration configuration;
    private final Executor executor;

    public DefaultSqlSession(Configuration configuration) {
        this.configuration = configuration;
        this.executor = new SimpleExecutor(configuration);
    }

    @Override
    public <T> T getMapper(Class<T> type) {
        return configuration.getMapper(type, this);
    }

    @Override
    public Configuration getConfiguration() {
        return configuration;
    }

    @Override
    public <T> T selectOne(String statementId, Object parameter) {
        List<T> list = selectList(statementId, parameter);
        return CommonUtils.isNotEmpty(list) ? list.get(0) : null;
    }

    @Override
    public <E> List<E> selectList(String statementId, Object parameter) {
        MapperStatement statement = configuration.getMapperStatement(statementId);
        return executor.doQuery(statement, parameter);
    }

    @Override
    public void update(String statementId, Object parameter) {
        MapperStatement statement = configuration.getMapperStatement(statementId);
        executor.doUpdate(statement, parameter);
    }

    @Override
    public void insert(String statementId, Object parameter) {
        //TODO
    }
}
```

sqlSession类通常持有配置类对象configuration和执行器对象executor，内部实现getMapper方法和CRUD方法

1.  构造方法：new SimpleExecutor(configuration) 为executor的default实现类
2. getMapper方法：从configuration中通过Class(T) type获取mapper对象，因为在sqlSessionFactory的loadMapperInfo中调用的XmlUtils内已经调用过addMapper和addStatement，这里get的statementId为接口+方法名
3. CRUD方法：configuration.getMapperStatement(statementId)根据statementId获取MapperStatement对象，内有namespace、sqlId、sqlType、resultType等属性；parameter参数交给executor调用参数处理方法处理

这里selectOne方法是特殊的SelectList方法，所以调用selecctList方法执行



### Executor

接口：

```java
public interface Executor {

    <E> List<E>  doQuery(MapperStatement statement, Object parameter);

    void doUpdate(MapperStatement statement, Object parameter);
}
```

实现类：

```java
public class SimpleExecutor implements Executor{

    private static Connection connection;
    private Configuration configuration;

    static {
        initConnection();
    }

    public SimpleExecutor(Configuration configuration) {
        this.configuration = configuration;
    }

    @Override
    public <E> List<E> doQuery(MapperStatement statement, Object parameter) {
        try {
            // 1. 获取连接
            Connection connection = getConnection();
            // 2. 获取config中的mapperStatement, 内含有sql信息
            MapperStatement mapperStatement = configuration.getMapperStatement(statement.getSqlId());
            // 3. 实例化StatementHandler对象
            StatementHandler statementHandler = new SimpleStatementHandler(mapperStatement);
            // 4. 通过StatementHandler和connection获取PreparedStatement
            PreparedStatement preparedStatement = statementHandler.prepare(connection);
            // 5. 实例化ParameterHandler，将SQL语句中？参数化
            ParameterHandler parameterHandler = new DefaultParameterHandler(parameter);
            parameterHandler.setParameters(preparedStatement);
            //6. 执行SQL，得到结果集ResultSet
            ResultSet resultSet = statementHandler.query(preparedStatement);
            //7. 实例化ResultSetHandler，通过反射将ResultSet中结果设置到目标resultType对象中
            ResultSetHandler resultSetHandler = new DefaultResultSetHandler(mapperStatement);
            return resultSetHandler.handleResultSets(resultSet);


        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public void doUpdate(MapperStatement statement, Object parameter) {
        //TODO 未实现
    }

    private static void initConnection() {
        String driver = Configuration.getProperty(Constant.DB_DRIVER_CONF);
        String url = Configuration.getProperty(Constant.DB_URL_CONF);
        String username = Configuration.getProperty(Constant.DB_USERNAME_CONF);
        String password = Configuration.getProperty(Constant.db_PASSWORD);

        try {
            Class.forName(driver);
            connection = DriverManager.getConnection(url,username,password);
            System.out.println("connection 建立");
        } catch (SQLException e) {
            e.printStackTrace();
        } catch (ClassNotFoundException e) {
            throw new RuntimeException(e);
        }
    }

    private Connection getConnection() throws SQLException {
        if (connection != null) {
            return connection;
        } else {
            throw new SQLException("connection为空");
        }
    }
}
```

initConnection中：xml标签解析中已经load过properties，这里getProperties将值取出用以连接jdbc，连接上的connection对象为成员变量，每次执行do***方法时调getConnect取出

doQuery中：

1.  按注释中的7步走
2. MapperStatement：configuration.getMapperStatement(statement.getSqlId())按标签id(方法名)取出sql信息，封装为MapperStatement对象
3.  StatementHaldler：处理sql语句，将语句中的#{}替换成 '?' ，返回PreparedStatememnt对象，PreparedStatememnt是java.sql中的对象，接收sql语句作为参数，执行CRUD操作；
4.  ParameterHandler：将已经封装sql语句的PreparedStatememnt传入，解析参数再次封装PreparedStatememnt
5.  ResultSetHandler： PreparedStatememnt执行qeuery返回ResultType对象，此类根据该对象利用反射获取成员变量列表并赋值，最后返回封装好的数据对象List



### MapperStatement 实体类

如code中注释，不详解

```java
public final class MapperStatement {
    // 接口名
    private String namespace;
    // 接口名 + 方法名
    private String sqlId;
    // sql语句
    private String sql;
    // xml中的resultType
    private String resultType;
    // xml中 select标签？ update标签、 insert标签？
    private Constant.SqlType sqlType;

    public String getNamespace() {
        return namespace;
    }
    public void setNamespace(String namespace) {
        this.namespace = namespace;
    }
    public String getSqlId() {
        return sqlId;
    }
    public void setSqlId(String sqlId) {
        this.sqlId = sqlId;
    }
    public String getSql() {
        return sql;
    }
    public void setSql(String sql) {
        this.sql = sql;
    }
    public String getResultType() {
        return resultType;
    }
    public void setResultType(String resultType) {
        this.resultType = resultType;
    }
    public Constant.SqlType getSqlType() {
        return sqlType;
    }
    public void setSqlType(Constant.SqlType sqlType) {
        this.sqlType = sqlType;
    }
    @Override
    public String toString() {
        return "MapperStatement{" +
                "namespace='" + namespace + '\'' +
                ", sqlId='" + sqlId + '\'' +
                ", sql='" + sql + '\'' +
                ", resultType='" + resultType + '\'' +
                ", sqlType=" + sqlType +
                '}';
    }
}
```



### Mapper

**该类无接口**

注册类：

```java
public class MapperRegister {
    // **Mapper.class 作key  对应factory类为value
    private final Map<Class<?>, MapperProxyFactory<?>> mappers = new HashMap<>();

    public <T> void addMapper(Class<T> type) {
        mappers.put(type, new MapperProxyFactory<T>(type));
    }

    public <T> T getMapper(Class<T> type, SqlSession sqlSession) {
        MapperProxyFactory<T> mapperProxyFactory = (MapperProxyFactory<T>) mappers.get(type);
        return mapperProxyFactory.newInstance(sqlSession);
    }
}
```

Mapper注册类：维护着一个(Class，MapperProxyFactory)的哈希表，注册mapper时调用传入**Mapper.class作为key，创建一个mapperProxyFactory作为值，需要时调用getMapper取出。



工厂类：

```java
public class MapperProxyFactory<T> {

    // **Mapper.class 作 类型
    private final Class<T> mapperInterface;

    public MapperProxyFactory(Class<T> mapperInterface) {
        this.mapperInterface = mapperInterface;
    }

    public  T newInstance(SqlSession sqlSession) {
        MapperProxy<T> mapperProxy = new MapperProxy<>(sqlSession, mapperInterface);
        return newInstance(mapperProxy);
    }

    protected T newInstance(MapperProxy<T> mapperProxy) {
        return (T) Proxy.newProxyInstance(mapperInterface.getClassLoader(),
                new Class[]{mapperInterface},
                mapperProxy);
    }
}
```

成员变量mapperInterface：在注册类的哈希表中维护着值

1. newInstance(SqlSession sqlSession)： 根据传入的sqlSession和mapper成员变量创建一个MapperProxy对象，将对象交给重载的方法去进行代理。
2.  newInstance(MapperProxy《T》 mapperProxy)：实现代理，参数值解析为  (···Mapper.class，Class[]{···Mapper}，mapperProxy)



代理类：

```java
public class MapperProxy<T> implements InvocationHandler, Serializable {

    private static final long serializeUid = -17524833145151L;
    private final SqlSession sqlSession;
    private final Class<T> mapperInterface;

    public MapperProxy(SqlSession sqlSession, Class<T> mapperInterface) {
        this.sqlSession = sqlSession;
        this.mapperInterface = mapperInterface;
    }

    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        if (Object.class.equals(method.getDeclaringClass())) {
            return method.invoke(this, args);
        }
        return execute(method, args);
    }

    private Object execute(Method method, Object[] args) {
        String statementId = this.mapperInterface.getName() + "." + method.getName();
        // 根据接口名+方法名获取对应 mapperStatement对象
        MapperStatement statement = this.sqlSession.getConfiguration().getMapperStatement(statementId);

        Object result = null;

        switch (statement.getSqlType()) {
            case SELECT: {
                Class<?> returnType = method.getReturnType();
				
                //检查方法 method 的返回类型 returnType 是否可以被 Collection 类或其子类所赋值
                // 即检查返回类型是否为集合
                if (Collection.class.isAssignableFrom(returnType)) {
                    result = sqlSession.selectList(statementId, args);
                } else {
                    result = sqlSession.selectOne(statementId, args);
                }
                break;
            }
            case UPDATE: {
                sqlSession.update(statementId, args);
                break;
            }
            default:
                //TODO insert  delete  方法待实现
                break;
        }
        return result;
    }
}
```

> 此类返回了查询的返回结果，需实现序列化接口；  传入sqlSession与mapperInferface，实现代理方法

1.  继承InvocationHandler，实现invoke方法，在被MapperProxyFactory代理时调用
2.  execute(Method method, Object[] args)： 创建被代理方法的具体实现；通过mapperInterface拿到sqlId、再通过ssqlId拿到statement具体sql信息、取sqlType与枚举类定义中的类型比较，确定要执行的流程、最后返回结果



### Statement

接口：

```java
public interface StatementHandler {
    PreparedStatement prepare(Connection paramConnection) throws SQLException;

    ResultSet query(PreparedStatement preparedStatement) throws SQLException;

    void update(PreparedStatement preparedStatement) throws SQLException;
}
```

实现类：

```java
public class SimpleStatementHandler implements StatementHandler{

    /** #{}正则匹配 */
    private static final Pattern param_pattern = Pattern.compile("#\\{([^\\{\\}]*)\\}");
    private final MapperStatement mapperStatement;

    public SimpleStatementHandler(MapperStatement mapperStatement) {
        this.mapperStatement = mapperStatement;
    }

    @Override
    public PreparedStatement prepare(Connection paramConnection) throws SQLException {
        String originalSql = mapperStatement.getSql();

        if (CommonUtils.isNotEmpty(originalSql)) {
            // 替换#{}，预处理，防止SQL注入
            return paramConnection.prepareStatement(parseSymbol(originalSql));
        } else {
            throw new SQLException("original sql is null");
        }
    }

    @Override
    public ResultSet query(PreparedStatement preparedStatement) throws SQLException {
        return preparedStatement.executeQuery();
    }

    @Override
    public void update(PreparedStatement preparedStatement) throws SQLException {
        preparedStatement.executeUpdate();
    }

    /**
     * 将SQL语句中的#{}替换为？，源码中是在SqlSourceBuilder类中解析的
     *
     * @param originalSql
     * @return
     */
    private static String parseSymbol(String originalSql) {
        originalSql = originalSql.trim();
        Matcher matcher = param_pattern.matcher(originalSql);
        return matcher.replaceAll("?");
    }
}
```

成员变量：

Pattern：java.util.regex的正则匹配类，用以替换#{}为 '?'

MapperStatement：paramConnection.prepareStatement(parseSymbol(originalSql))，connection对象的prepareStatement方法创建PreparedStatement对象执行sql语句，需要用到的sql语句参数，从这里取

1.  prepare方法：传入connection对象，创建PreparedStatement对象执行后续CRUD
2.  query、update等自定义方法：传入PreparedStatement对象，通过它执行sql语句，并返回ResultSet对象
3.  parseSymbol方法：传入sql语句，消除两边空格，替换#{} 为 '?'



### Parameter

接口：

```java
public interface ParameterHandler {
    void setParameters(PreparedStatement paramPreparedStatement);
}
```

实现类：

```java
public class DefaultParameterHandler implements ParameterHandler{

    private Object parameter;

    public DefaultParameterHandler(Object parameter) {
        this.parameter = parameter;
    }

    @Override
    public void setParameters(PreparedStatement paramPreparedStatement) {
        try {
            if (parameter != null) {
					//parameter.getClass().isArray() 这个判断只有1个参数也为true
                if (parameter.getClass().isArray()) {
                    // 强转为数组类型
                    Object[] parames = (Object[]) parameter;

                    for (int i = 0; i < parames.length; i++) {
                        // 设置第几个参数，索引从1开始
                        paramPreparedStatement.setObject(i + 1, parames[i]);
                    }
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

    }
}
```

> 注意：

该类与其他类不耦合，只为PreparedStatement设置参数，也无返回值；接收Object parameter作为参数，parameter.getClass().isArray() 此判断中即使参数只有一个也为true，Object[] parames = (Object[]) parameter 强转数组获取参数列表，paramPreparedStatement.setObject(i + 1, parames[i])，设置第几个参数，方法默认索引从1开始



### ResultSet

接口：

```java
public interface ResultSetHandler {
    <E> List<E> handleResultSets(ResultSet resultSet);
}
```

实体类：

```java
public class DefaultResultSetHandler implements ResultSetHandler{

    private final MapperStatement mapperStatement;

    public DefaultResultSetHandler(MapperStatement mapperStatement) {
        this.mapperStatement = mapperStatement;
    }

    @Override
    public <E> List<E> handleResultSets(ResultSet resultSet) {
        try {
            List<E> result = new ArrayList<>();
            if (result == null) {
                return null;
            }

            while (resultSet.next()) {
                // 通过反射实例化返回类 解析xml设置mapperStatement时 标签的resultType即为目标类路径
                Class<?> entrtyClass =  Class.forName(mapperStatement.getResultType());
                // 获取实体类  泛型
                E entry = (E) entrtyClass.newInstance();
                // 获取成员变量列表
                Field[] fields = entry.getClass().getDeclaredFields();

                for (Field field : fields) {
                    // 设置访问权限，为true则表示对象应该允许访问，即使它是私有的或者受保护的
                    // 为false则正常进行权限检测
                    field.setAccessible(true);
                    Class<?> fieldType = field.getType();

                    if (String.class.equals(fieldType)) {
                        field.set(entry, resultSet.getString(field.getName()));
                    } else if (Integer.class.equals(fieldType)) {
                        field.set(entry, resultSet.getInt(field.getName()));
                    } else {
                        // 其他类型未一一实现
                        field.set(entry, resultSet.getObject(field.getName()));
                    }
                }

                result.add(entry);
            }

            return result;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        } catch (ClassNotFoundException e) {
            throw new RuntimeException(e);
        } catch (InstantiationException e) {
            throw new RuntimeException(e);
        } catch (IllegalAccessException e) {
            throw new RuntimeException(e);
        }

    }
}
```

该类也与其他类不耦合，创建实现类，解析字段封装结果类后，返回结果类的List对象

成员变量：mapperStatement，内有sql信息，这里是为了取里面的mapperStatement.getResultType()返回类型， 类型为xml解析时标签的的resultType，即为返回类的路径

List(E) handleResultSets(ResultSet resultSet)：

1. entry.getClass().getDeclaredFields()： 获取成员变量列表
2. Class<?> fieldType = field.getType()：遍历成员变量列表，获取每个变量类型
3. String/Integer.class.equals(fieldType)：根据变量类型，设置变量值 field.set(entry, resultSet.getString(field.getName()))
4. 将填充好变量值的类添加到结果集中，继续resultSet.next() 遍历下一条数据



### Utils包下类

Constant:

```java
public interface Constant {
    /**
     * UTF-8编码
     */
    String CHARSET_UTF8 = "UTF-8";

    /******** 在properties文件中配置信息 **************/
    String MAPPER_LOCATION = "mapper.location";

    String DB_DRIVER_CONF = "db.driver";

    String DB_URL_CONF = "db.url";

    String DB_USERNAME_CONF = "db.username";

    String db_PASSWORD = "db.password";

    /************ mapper xml  ****************/

    /**
     * mapper文件后缀
     */
    String MAPPER_FILE_SUFFIX = ".xml";

    String XML_ROOT_LABEL = "mapper";

    String XML_ELEMENT_ID = "id";

    String XML_SELECT_NAMESPACE = "namespace";

    String XML_SELECT_RESULTTYPE = "resultType";

    /**
     * SQL类型枚举，如select、insert、update
     */
    public enum SqlType {
        SELECT("select"),
        INSERT("insert"),
        UPDATE("update"),
        DEFAULT("default");

        private String value;

        private SqlType(String value) {
            this.value = value;
        }

        public String value() {
            return this.value;
        }
    }

}
```

XMLUtil:

```java
public final class XmlUtil {

    /**
     * readMapperXml
     *
     * @param fileName
     * @param configuration
     * @see
     */
    public static void readMapperXml(File fileName, Configuration configuration) {

        try {
            // 创建一个读取器
            SAXReader saxReader = new SAXReader();
            saxReader.setEncoding(Constant.CHARSET_UTF8);

            // 读取文件内容
            Document document = saxReader.read(fileName);

            // 获取xml中的根元素
            Element rootElement = document.getRootElement();

            // 不是beans根元素的，文件不对
            if (!Constant.XML_ROOT_LABEL.equals(rootElement.getName())) {
                System.err.println("mapper xml文件根元素不是mapper");
                return;
            }
            
            // 获取 根标签的属性  :namespace
            String namespace = rootElement.attributeValue(Constant.XML_SELECT_NAMESPACE);

            List<MapperStatement> statements = new ArrayList<>();
            for (Iterator iterator = rootElement.elementIterator(); iterator.hasNext(); ) {
                // 获取mapper根标签下的  每个子标签
                Element element = (Element) iterator.next();
                // 获取子标签名  
                String eleName = element.getName();

                MapperStatement statement = new MapperStatement();
                // 子标签名  与sqlType枚举类比对，  确认是select、update等四种标签的哪种
                if (Constant.SqlType.SELECT.value().equals(eleName)) {
                    String resultType = element.attributeValue(Constant.XML_SELECT_RESULTTYPE);
                    // 根据获得的标签属性为 mapperStatement 对象赋值
                    statement.setResultType(resultType);
                    statement.setSqlType(Constant.SqlType.SELECT);
                } else if (Constant.SqlType.UPDATE.value().equals(eleName)) {
                    statement.setSqlType(Constant.SqlType.UPDATE);
                } else {
                    // 其他标签自己实现
                    System.err.println("不支持此xml标签解析:" + eleName);
                    statement.setSqlType(Constant.SqlType.DEFAULT);
                }

                //设置SQL的唯一ID
                String sqlId = namespace + "." + element.attributeValue(Constant.XML_ELEMENT_ID);

                statement.setSqlId(sqlId);
                statement.setNamespace(namespace);
                statement.setSql(CommonUtils.stringTrim(element.getStringValue()));
                statements.add(statement);

                configuration.addMapperStatement(sqlId, statement);

                //这里其实是在MapperRegistry中生产一个mapper对应的代理工厂
                System.out.println("namespace   "+namespace);
                configuration.addMapper(Class.forName(namespace));
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

CommonUtil:

```java
public class CommonUtils {

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



### 所需实体类及mapper接口、xml文件、配置文件

Book：

```java
public class Book {

    private Integer id;
    private String type;
    private String name;
    private String description;
	
	// 省略构造方法、Getter、Setter、toString方法
}
```

BookMapper：

```java
public interface BookMapper {
    Book selectOne(Integer id);
    List<Book> selectList();
    int update(Integer id);
}
```

BookMapper.xml：

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<mapper namespace="com.minibatis.mapper.BookMapper">

    <select id="selectOne" resultType="com.minibatis.mapper.Book">
        select * from book where id = #{id}
    </select>

    <select id="selectList" resultType="com.minibatis.mapper.Book">
        select * from book
    </select>

    <update id="update">
        update book set description = "update方法" where id = #{id}
    </update>
</mapper>
```

conf.properties

```properties
mapper.location=com.minibatis.mapper

db.driver=com.mysql.cj.jdbc.Driver
db.url=jdbc:mysql://localhost:3306/test?useUnicode=true&characterEncoding=utf8
db.username=root
db.password=root
```