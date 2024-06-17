import { hopeTheme, ArticleInfo, PageInfo } from "vuepress-theme-hope"
import { defineUserConfig } from 'vuepress/cli'
import { viteBundler } from '@vuepress/bundler-vite'
import { Page } from "vuepress/core";

export default defineUserConfig({
  // base: '/mycf2hj/',  // 自定义域需要取消
  lang: 'zh-CN',
  title: 'Home Blog',
  description: 'My first VuePress Site',
  // 设置网站 favicon.ico 图标
  head: [
    [
      'link', {rel: 'icon', href: '/img/logo.png'}
    ]
  ],
  bundler: viteBundler(),
  theme: hopeTheme({
    // 'https://vuejs.press/images/hero.png'
    logo: '/img/top.png',     //  top导航栏左侧图标
    darkmode: "toggle",
    // hotReload: true,
  
    //  主页个人信息配置
    blog: {
      name: "jokenum0",
      avatar: "/img/photo.png",
      description: "暂时没有想法",
      articlePerPage: 8,
    },
    navbarLayout: {
      start: ["Brand"], center: [], end: ["Links", "Search", "Language", "Repo", "Outlook"]
    },

    navbar: [
      { text: '首页', link: '/', },
      { text: 'Music', link: '/article/audio/Music.md' },
      { text: 'Video', link: '/article/video/Video.md' },
      { text: 'Cloudflare', link: '/article/cloudflare/pages/pages1.md' },
      { text: '计算机深入', link: '/article/com408/' },
      {
        text: 'Java',
        // collapsible: false,   ts中失效
        children: [
          { text: "Java基础", link: "/article/java/basic/", },
          { text: "Spring生态", link: "/article/java/spring/", },
          { text: '数据及框架', link: '/article/java/datasource/' },
          { text: '中间件', link: '/article/java/中间件/' },
          { text: "ClassUtils", link: "/article/java/utils/utilClass.md", },
        ]
      },
      {
        text: "项目总结",
        link: "/article/java/project/Rpc.md",
        // children: [
        //   { text: "Rpc示例", link: "/article/java/project/Rpc.md"},
        //   { text: "ORM示例", link: "/article/java/project/ORM.md"},
        // ]
      }
    ],

    sidebar: {
      '/article/java/basic': [
        {
          text: "Java基础知识",
          collapsible: false,
          children: [
            {
              text: "Java基础",
              collapsible: false,
              children: [
                { text: "Java基础一", link: "/article/java/basic/base/java_base1" },
                { text: "Java基础二", link: "/article/java/basic/base/java_base2" }
              ]
            },
            {
              text: "Map&List&Collection",
              collapsible: false,
              children: [
                { text: "HashMap", link: "/article/java/basic/map/HashMap" },
                { text: "HashMap线程安全", link: "/article/java/basic/map/HashMap线程安全" },
                { text: "Java集合面试题", link: "/article/java/basic/map/Java集合高频面试题" },
                
              ]
            },
            {
              text: "Thread&Process",
              collapsible: false,
              children: [
                { text: "Java多线程基础", link: "/article/java/basic/thread/Java多线程面试-基础" },
                { text: "Java多线程总结", link: "/article/java/basic/thread/Java多线程总结版" },
                { text: "设计线程池", link: "/article/java/basic/thread/如何设计线程池" },
                { text: "Java进程通信方式", link: "/article/java/basic/thread/进程通信和线程通信的方式" },
                { text: "AQS", link: "/article/java/basic/thread/AQS" },
              ]
            }

          ]
        }
      ],
      '/article/java/datasource': [
        {
          text: 'datasource',
          // 是否折叠
          collapsible: false,
          children: [
            { text: "Mysql基础", link: "/article/java/datasource/MySQL" },
            { text: "MySQL基础、锁、事务、分库分表、优化", link: "/article/java/datasource/MySQL基础、锁、事务、分库分表、优化" },
            { text: "MySQL索引连环18问", link: "/article/java/datasource/MySQL索引连环18问" },
            { text: "Mbatis", link: "/article/java/datasource/Mybatis" },
          ]
        }
      ],
      '/article/cloudflare': [
        {
          text: 'Cloudflare',
          // 是否折叠
          collapsible: false,
          children: [
            {
              text: "pages",

              collapsible: false,
              children: [
                { text: 'pages与blog部署', link: '/article/cloudflare/pages/pages1.md' },
              ]
            },
            {
              text: "workers",
              collapsible: false,
              // link: "/article/test.md",
              children: [   // 子菜单
                { text: "hel2", link: "/article/cloudflare/workers/hel2.md", },
                { text: "hel3", link: "/article/cloudflare/workers/hel3.md", },
                { text: "hel4", link: "/article/cloudflare/workers/hel4.md", },
              ],
            },
            {
              text: "网站整合",
              collapsible: false,
              children: [
                { text: 'cloudflare博客', link: '/article/cloudflare/site/site1.md' }
              ],
            },
            {
              text: "fofa语句整理",
              collapsible: false,
              children: [
                { text: 'fofa', link: '/article/cloudflare/fofa/fofa.md' }
              ],   //子菜单
            }
          ],
        },

      ],
      '/article/com408': [
        {
          text: "计算机网络",
          collapsible: false,
          children: [
            {text: "计算机网络上", link: "/article/com408/计算机网络上"},
            {text: "计算机网络下", link: "/article/com408/计算机网络下"}
          ]
        }
      ],
      '/article/java/中间件': [
        {
          text: "中间件",
          collapsible: false,
          children: [
            {text: "Redis", link: "/article/java/中间件/Redis"},
            {text: "MQ", link: "/article/java/中间件/MQ面试题"},
            {text: "Kafka", link: "/article/java/中间件/Kafka面试题"}
          ]
        }
      ],
      '/article/java/spring': [
        {
          text: "Spring生态",
          collapsible: false,
          children: [
            {text: "Spring概述", link: "/article/java/spring/Spring"}
          ]
        }
      ],
      '/article/java/project': [
        {
          text: "项目",
          children: [
            { text: "Rpc示例", link: "/article/java/project/Rpc.md"},
            { text: "ORM示例", link: "/article/java/project/ORM.md"},
            { text: "NetDisk1", link: "/article/java/project/NetDisk1.md"},
            { text: "NetDisk2", link: "/article/java/project/NetDisk2.md"},
          ]
        }
      ]
    },

    plugins: {
      blog: {
        filter: (page: Page) => page.path.startsWith("/article") && !page.path.startsWith("/article/audio")
          && !page.path.startsWith("/article/video"),
      },
      
      mdEnhance: {
        component: true        //  可在md中 通过 ```组件名```  添加组件 （须client注册）
      },
      components: {
        components: [
          "BiliBili",
          "PDF",
          "VidStack",
        ],
      },
      searchPro: {
        indexContent: true,     //  搜索正文内容   默认只搜 题目 和摘要  及头信息
        autoSuggestions: true,  //  搜索提示
        customFields: [          //  设置可搜索字段
          // {}
        ]
      }
    },
  }),


})
