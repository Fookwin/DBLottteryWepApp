import React from 'react';
export const Nav00DataSource = {
  wrapper: { className: 'header0 home-page-wrapper' },
  page: { className: 'home-page' },
  logo: {
    className: 'header0-logo',
    children: 'https://dbdatastorage.blob.core.windows.net/dblottery-webapp-res/image_welcome_screen.png',
  },
  Menu: {
    className: 'header0-menu',
    children: [
      { name: 'item0', a: { children: '首页', href: '\home' } },
      { name: 'item1', a: { children: '最新消息', href: '\history' } },
      { name: 'item2', a: { children: '数据分析', href: '\attributes' } },
      { name: 'item3', a: { children: '选号推荐', href: '\diagram' } },
      { name: 'item4', a: { children: 'APP下载', href: '\download' } },
    ],
  },
  mobileMenu: { className: 'header0-mobile-menu' },
};
export const Banner00DataSource = {
  wrapper: { className: 'banner0' },
  textWrapper: { className: 'banner0-text-wrapper' },
  title: {
    className: 'banner0-title jyfyzwmpbtk-editor_css',
    children: (
      <>
        <p>福盈双色球</p>
      </>
    ),
  },
  content: {
    className: 'banner0-content',
    children: (
      <>
        <p>数据+AI 预见未来</p>
      </>
    ),
  },
  button: { className: 'banner0-button', children: '即刻体验', href: '\history' },
};
export const Content00DataSource = {
  wrapper: { className: 'home-page-wrapper content0-wrapper' },
  page: { className: 'home-page content0' },
  OverPack: { playScale: 0.3, className: '' },
  titleWrapper: {
    className: 'title-wrapper',
    children: [{ name: 'title', children: '产品与服务' }],
  },
  block: {
    className: 'block-wrapper',
    children: [
      {
        name: 'block0',
        className: 'block',
        md: 8,
        xs: 24,
        children: {
          icon: {
            className: 'icon',
            children:
              'https://zos.alipayobjects.com/rmsportal/WBnVOjtIlGWbzyQivuyq.png',
          },
          title: { className: 'content0-title', children: '开奖信息推送' },
          content: { children: '及时推送, 信息准确，内容详尽' },
        },
      },
      {
        name: 'block1',
        className: 'block',
        md: 8,
        xs: 24,
        children: {
          icon: {
            className: 'icon',
            children:
              'https://zos.alipayobjects.com/rmsportal/YPMsLQuCEXtuEkmXTTdk.png',
          },
          title: {
            className: 'content0-title',
            children: '历史数据分析',
          },
          content: { children: '多维度数据统计和分析' },
        },
      },
      {
        name: 'block2',
        className: 'block',
        md: 8,
        xs: 24,
        children: {
          icon: {
            className: 'icon',
            children:
              'https://zos.alipayobjects.com/rmsportal/EkXWVvAaFJKCzhMmQYiX.png',
          },
          title: { className: 'content0-title', children: '号码辅助优选' },
          content: { children: '捕捉异常属性，优化号码选择' },
        },
      },
    ],
  },
};
export const Footer00DataSource = {
  wrapper: { className: 'home-page-wrapper footer0-wrapper' },
  OverPack: { className: 'home-page footer0', playScale: 0.05 },
  copyright: {
    className: 'copyright',
    children: (
      <>
        <span>
          ©2019 <a href="https://www.fookwin.com">Fookwin</a> All Rights
          Reserved
        </span>
      </>
    ),
  },
};
