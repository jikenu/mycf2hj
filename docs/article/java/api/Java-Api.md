Java 日期、线程创建等工具类Api记录
<!-- more -->

# Java - API

#### 日期

```java
// 日期转换与相加减
date = "2020-05-02"
// 字符串转Date
DateUtil.pareDate(date)
// 日期加减   增加或减去多少天/月/年
DateUtil.addDays(Date date, int amount)
DateUtil.addMonths(Date date, int amount)
DateUtil.addYears(Date date, int amount)
// 常结合使用:  获取当月1号,增加1月,再减去1天,  得到月末日期
DateUtil.formatDate(DateUtil.addDays(DateUtil.addMonths(DateUtil.parseDate(dateStart),1),-1))
```





#### 普通线程池 - ThreadPoolExecutor

1、创建异步线程池

```java
@EnableAsync
@Configuration  // 两个注解一起加才会生效
public class AsyncPool {
    @Bean("taskExecutor")
    public Executor initExecutor() {
        System.out.println("Pool");
        ThreadPoolExecutor threadPoolExecutor = new ThreadPoolExecutor(
                2,		// 核心线程数
                10,		// 最大线程数
                20,		// 
                TimeUnit.SECONDS,	// 时间单位
                new ArrayBlockingQueue<>(3) 	// 队列 与 最大队列数
        );
        return threadPoolExecutor;
    }
}
```

2、创建异步任务: 等待3秒,打印执行时间

```java
@Slf4j
@Component
public class AsyncTask {
    @Async("taskExecutor")
    public void doTaskOne() throws InterruptedException {
        log.info("start 任务一");
        long start = System.currentTimeMillis();
        Thread.sleep(3000);
        long end = System.currentTimeMillis();
        log.info("任务一耗时： " + (end - start) + " 毫秒");
    }
    // 任务二、三省略， 代码一致
```

3、测试

```java
@SpringBootTest
@RunWith(SpringRunner.class)
public class AsyncTaskTest {
    @Autowired
    AsyncTask asyncTask;
    @Test
    public void testAsync() throws InterruptedException {
        asyncTask.doTaskOne();
        asyncTask.doTaskTwo();
        asyncTask.doTaskThree();
        asyncTask.doTaskThree();
//        Thread.currentThread().join();
    }
}
```



#### 多线程3种创建方式

##### 1. 继承Thread类

创建继承Thread的子类，重写run方法；直接new子类对象，调start()方法

```java
public class MyThread1_Thread extends Thread {
    // 第一种实现方式，继承Thread类，实现run方法，调用start方法
    @Override
    public void run() {
        for (int i = 0; i < 100; i++) {
            System.out.println(getName() + "  " + i);
        }
    }
}
// main中
public static void ThreadTest() {
        // Thread方式测试   直接执行继承Thread类的多线程业务类的  start方法
        MyThread1_Thread thread1 = new MyThread1_Thread();
        MyThread1_Thread thread2 = new MyThread1_Thread();
        thread1.setName("线程1");
        thread2.setName("线程2");
        thread1.start();
        thread2.start();
    }
```



##### 2. 实现Runnable接口

创建Runnable接口实现类，重写run方法；创建Thread(new runnable)对象，将实现类放入thread类中，调thread的start()方法

```java
public class MyThread2_Runnable implements Runnable{
    @Override
    public void run() {
        for (int i = 0; i <= 50; i++) {
            Thread thread = Thread.currentThread();
            System.out.println(thread.getName() +  "   " + i);
        }
    }
}
// main中
public static void RunnableTest() {
        // Runnable方式测试   创建不Thread类管理同一个实现Runnable接口的业务类
        MyThread2_Runnable runnable = new MyThread2_Runnable();
        Thread thread1 = new Thread(runnable);
        Thread thread2 = new Thread(runnable);
        thread1.setName("线程1");
        thread2.setName("线程2");
        thread1.start();
        thread2.start();
    }
```



##### 3. 实现Callable(T)接口

创建Callable(T)接口实现类，重写call方法；**创建FutureTask(callable)对象接收返回结果，传入callable对象，再创建Thread(task)对象，**传入FutureTask对象，调thread的start方法，**从task.get()中取返回值**

```java
public class MyThread3_Callable implements Callable<Integer> {
    // 求1~100的和
    @Override
    public Integer call() throws Exception {
        int sum = 0;
        for (int i = 0; i <= 100; i++) {
            sum += i;
        }
        return sum;
    }
}
// main中
    public static void ThreadCallable() throws ExecutionException, InterruptedException {
        // Callable方式实现
        MyThread3_Callable callable = new MyThread3_Callable();
        // 创建FutureTask对象， 用于管理多线程的运行结果
        FutureTask<Integer> task = new FutureTask(callable);
        Thread thread = new Thread(task);
        thread.start();
        System.out.println(task.get());//  获取多线程运行结果
    }
```



#### 锁的实现

##### 卖票问题 -- ReentrantLock()锁

卖票问题：多个窗口同时卖票，如何保证不重卖、超卖

**加锁心得：将业务整个放入try，catch代码块中，在try之前加锁；在finally代码块中解锁，保证锁的正确有效**

```java
public class LockTicket implements Runnable {
    private static int tickets = 0;
    // 若继承Thread类，此处需要加static修饰，表示所有此线程共享一把锁  ,runnable接口的任务要传到thread对象中执行
    Lock lock = new ReentrantLock();
    @Override
    public void run() {
        while (true){
            lock.lock();
            try {
                if (tickets < 100) {
                    Thread.sleep(50);
                    tickets++;
                    System.out.println(Thread.currentThread().getName() + " 出售了第 " + tickets + "张票");
                } else {
                    break;
                }
            } catch (InterruptedException e){
                throw new RuntimeException(e);
            } finally {
                lock.unlock();
            }
        }
    }
}
// main中
 public static void main(String[] args) {
        LockTicket runnable = new LockTicket();
        Thread thread1 = new Thread(runnable);
        Thread thread2 = new Thread(runnable);
        Thread thread3 = new Thread(runnable);
        thread1.setName("窗口1");
        thread2.setName("窗口2");
        thread3.setName("窗口3");
        thread1.start();
        thread2.start();
        thread3.start();
    }
```