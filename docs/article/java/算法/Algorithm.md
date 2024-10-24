# 算法



### 启示录

前缀和：判断前缀和，max(当前节点，sum + 当前节点)

快慢指针：可将慢指针移动到链表**前一半的结尾处**(快指针一次移动2步，慢指针一次移动1步)，奇偶节点都生效



### 前缀和(结合数组看)

##### 53 最大子数组和		----------	经典前缀和，最基础

```java
public int maxSubArray(int[] nums) {
     if (nums.length == 1) {
       return nums[0];    // 优化,无需看
     }
     int pre = nums[0];   // 注意 这两个值不能设置为0，因为最大值可能包含负数
     int res = pre;
     for (int i = 1; i < nums.length; i++) {
       pre = Math.max(nums[i], pre + nums[i]);
       res = Math.max(res, pre);
     }
     return res;
  }
```



##### 560 和为K的子数组			-----------		前缀和 + HashMap 优化

map结构：(nums[i], cnt)记录当前的前缀和sum[i]的次数

(pre - k)解释：

**在前缀和数组sum[]中，X1 到 Xn 中，如果减去k，差存在，则说明，X1到Xn中去掉差的部分，其他的和为k**

如果mp.containsKey(pre - k)，说明一定有某段前缀和为k

mp.getOrDefault(pre, 0) + 1：取旧值+1，没有则默认0，注意此方法

```java
public int subarraySum(int[] nums, int k) {
        int count = 0, pre = 0;
        HashMap <Integer, Integer> mp = new HashMap<>();
        mp.put(0, 1);
        for (int i = 0; i < nums.length; i++) {
            pre += nums[i];
            if (mp.containsKey(pre - k)) {				// !!!  pre - k 为当前
                count += mp.get(pre - k);        	   // 如果
            } 
            mp.put(pre, mp.getOrDefault(pre, 0) + 1);  // !!!  记录结果 x 出现的次数
        }
        return count;
    }
```



##### 724 寻找数组的中心下标

前缀和在此处的巧用：当要判断总数的一半时，利用当前和*2是否等于总和来判断；

```java
public int pivotIndex(int[] nums) {
        int all = 0;
        int sum = 0;
        for(int num : nums) {
            all += num;
        }
        for(int i = 0; i < nums.length; i++) {
            if(2 * sum + nums[i] == all) {   // 精髓: 即使所求下标出现在两端也能判断到
                return i;
            }
            sum += nums[i];
        }
        return -1;
    }
```



### 链表

##### 234 回文链表			--------------- 栈的使用，(将某一部分翻转.....)

自写思路： 7%

1、遍历链表，保存长度		2、将右指针移动到后一半的开始		3、遍历前一半链表，将值放入栈中，实现翻转		4、将栈中数出栈，一个个与右半链表比较，不同直接返回flase

**启发思路：** 9ms	26%

既然给出的链表无法双向遍历，那就**将链表所有节点全部放到数组中**，用双指针遍历数组，判断是否回文



##### 206 反转链表

自写思路： 0ms 100%   内存大

创建一个头节点，遍历链表，复制每个节点，连接到新节点 (相当与复制了链表)

```java
public ListNode reverseList(ListNode head) {
    if (head == null || head.next == null) {
      return head;
    }
    ListNode end = null;
    while (head != null) {
      ListNode tmp = new ListNode();
      tmp.val = head.val;
      tmp.next = end;
      end = tmp;			//  end相当于头节点，每次移动到头节点，以便下次插入
      head = head.next;
    }
    return end;
  }
```

递归写法：  0ms  100%  直接对链表进行反转，空间复杂度低

```java
public ListNode reverseList(ListNode head) {
        if (head == null || head.next == null) {
            return head;
        }
        ListNode res = reverseList(head.next);
        head.next.next = head;
        head.next = null;
        return res;
    }
```



### 哈希表

##### 49 字母异位词分组

解法1.    看2句解释即可

```java
public List<List<String>> groupAnagrams(String[] strs) {
        Map<String, List<String>> map = new HashMap<String, List<String>>();
        for (String str : strs) {
            char[] array = str.toCharArray();
            Arrays.sort(array);				// 将字符串重新排序作为key
            String key = new String(array);
            List<String> list = map.getOrDefault(key, new ArrayList<String>());
            list.add(str);			// 取出相同key中的List，加入新值，再放回
            map.put(key, list);
        }
        return new ArrayList<List<String>>(map.values());
    }
```

##### 205 同构字符串

学习思路：    同构的判断

两个map分别作(a, b)，(b, a)的映射，判断  s2t.get(a) != b && t2s.get(b) != a

```java
public boolean isIsomorphic(String s, String t) {
        Map<Character, Character> s2t = new HashMap<>(), t2s = new HashMap<>();
        for (int i = 0; i < s.length(); i++) {
            char a = s.charAt(i), b = t.charAt(i);
            // 重点：  先判断，再put放入，这样如果不同构的话就会先判断出来
            if (s2t.containsKey(a) && s2t.get(a) != b || 
                t2s.containsKey(b) && t2s.get(b) != a)
                return false;
            s2t.put(a, b);
            t2s.put(b, a);
        }
        return true;
    }
```

##### 169 招式拆解

题目简单，看boolean类型的巧妙使用

```java
 public char dismantlingAction(String arr) {
        HashMap<Character, Boolean> map = new HashMap<>();
        char[] sc = arr.toCharArray();
        for(char c : sc) {
            // 第一次key 不存在时为(a,true), key存在后，都为false，即首次为true，2与次以上都为false
           map.put(c, !map.containsKey(c));
        }
        for(char c : sc)
            if(map.get(c)) return c;
        return ' ';
    }
```

#### HashSet的使用

##### 128 最长连续序列

```java
public int longestConsecutive(int[] nums) {
        Set<Integer> set = new HashSet<Integer>();
        int res = 0;
        for(int i : nums) {
            set.add(i);
        }
        for(int num : set) {		// set可用增强for遍历
            if(!set.contains(num - 1)) {  //  精髓:非判断， 即一定是一段连续数字的开始 才进行操作
                int curNum = num;
                int curLen = 1;
                while(set.contains(curNum + 1)) {
                    curNum += 1;
                    curLen += 1;
                }
                res = Math.max(curLen, res);
            }
        }
        return res;
    }
```



### 数组(双指针)

##### 27 移除元素

思考双指针的使用：先同时移动，达到条件后只有右指针移动

```java
public int removeElement(int[] nums, int val) {
        int left = 0;
        for(int right = 0; right < nums.length; right++) {
            if(nums[right] != val) {		// 符合:两指针一起移动,  不符:右指针移动,将右值赋值到左边,左指针++
                nums[left] = nums[right];
                left++;
            }
        }
        return left;
    }
```

##### 80 删除有序数组中的重复项2 (包括一)

快慢指针的运用，快指针遍历，**满指针-索引做判断、判断后给不减索引的满指针直接赋值**

```java
public int removeDuplicates(int[] nums) {
        int len = nums.length;
        if(len <= 2) {
            return len;
        }
        int fast = 2, slow = 2;
        while(fast < len) {
            if(nums[slow - 2] != nums[fast]) {		//  -2  判断
                nums[slow] = nums[fast];			//  通过判断不减 赋值
                slow++;
            }
            fast++;
        }
        return slow;
    }
```



### 贪心

##### 121 买股票的最佳时机

--- 只买一次  与二、三区别

自写贪心，循环内未作判断(示例题解中在循环中作判断)

```java
public int maxProfit(int[] prices) {
        int min = Integer.MAX_VALUE;
        int benefit = 0;

        for(int i = 0; i < prices.length; i++) {
            min = Math.min(min, prices[i]);
            benefit = Math.max(benefit, prices[i] - min);
        }
        return benefit;
    }
```



### 动态规划

##### 122 买股票的最佳时机2

--- 买多次，同一天只可买/卖，只要保证利润最大即可

解法1、二维数组动态规划   3ms 27%

```java
public int maxProfit(int[] prices) {
        int len = prices.length;
        if(len < 2) {
            return 0;
        }
        int[][] dp = new int[len][2];
        dp[0][0] = 0;
        dp[0][1] = -prices[0];			// 两种状态，买和不买
        for(int i = 1; i < len; i++) {
            dp[i][0] = Math.max(dp[i-1][0], dp[i-1][1] + prices[i]); //上步不买和(上步买加这步卖)
            dp[i][1] = Math.max(dp[i-1][1], dp[i-1][0] - prices[i]); //上步买和(上步不买加这步买)
        }
        return dp[len-1][0];
    }
```

解法2：空间改进，将二维数组替换为int变量	2ms 33%

```java
public int maxProfit(int[] prices) {
        int len = prices.length;
        if(len < 2) {
            return 0;
        }
        int no_buy = 0;
        int buy = -prices[0];
        int res_no_buy = no_buy;		// 多创建一组变量，因为在Math取最大值时 当前变量组被使用
        int res_buy = buy;
        for(int i = 1; i < len; i++) {
            no_buy = Math.max(no_buy, buy + prices[i]);
            buy = Math.max(buy, no_buy - prices[i]);
            res_no_buy = no_buy;
            res_buy = buy;
        }
        return res_no_buy;
    }
```

解法3：贪心，此题的特殊解法  1ms 80%

思路：从1开始遍历，只要(i)-(i-1)有利润就卖出

```java
 public int maxProfit(int[] prices) {
        int benefit = 0;
        for(int i = 1; i < prices.length; i++) {
            int bnf = prices[i] - prices[i - 1];
            if(bnf > 0)
                benefit += bnf;
        }
        return benefit; 
    }
```