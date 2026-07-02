# 布尼饮食控制

为布尼（一只黑白相间的美短折耳猫）记录每日热量摄入与体重的移动端应用。
折耳猫关节负担较大，通过控制体重来减轻关节压力。

## 功能

五个页面，底部标签切换：

- **今日** — 每日仪表盘：当前/目标体重、今日热量进度、剩余可吃克数换算、卡路里计算说明、今日进食记录
- **记录** — 选择食物并输入克数（或份数），自动计算热量
- **食物** — 食物库，支持添加/编辑/删除，热量可按 每 kg / 每 100g / 每份 多种方式录入
- **体重** — 记录体重、查看历史与周变化、超速/上升/接近目标等提醒
- **设置** — 猫咪名字、目标体重、每日热量目标、安全范围

## 技术栈

- React 18 + Vite 5 + TypeScript
- 纯前端，数据存在浏览器 `localStorage`（键名 `buni-diet-data-v1`），无后端
- 移动端优先，最大宽度 480px

## 快速开始

```bash
npm install      # 安装依赖
npm run dev      # 本地开发，默认 http://localhost:5173
npm run build    # 类型检查 + 打包到 dist/
npm run preview  # 预览打包结果
```

手机访问：电脑和手机连同一 Wi-Fi，用 `npm run dev` 打印的 Network 地址在手机浏览器打开。

## 默认数据

- 猫咪名字：布尼
- 当前体重：6.3 kg　目标：5.75 kg
- 每日热量目标：240 kcal　安全范围：230–260 kcal
- 默认食物：Orijen猫粮（3710 kcal/kg = 3.71 kcal/g）

以上均可在应用内修改。

## 卡路里计算

- 单条记录热量 = 克数 × 食物热量密度（kcal/g）
- 今日摄入 = 各条进食记录热量之和
- 剩余可吃克数 = 剩余热量 ÷ 食物热量密度

例：Orijen 3710 kcal/kg ÷ 1000 = 3.71 kcal/g，喂 65 g 即 65 × 3.71 ≈ 241 kcal。

## 添加新食物

进入「食物」→ 「+ 添加」，选择热量录入方式：

- 每 kg（如 3710）
- 每 100g（如 371）
- 每份 / 罐（如 80 kcal/罐，可选填每份重量以同时换算成 kcal/g）
- 暂无数据 — 先保存为「数据待补充」，等知道热量后再编辑

## 项目结构

```
src/
├── main.tsx              # 入口
├── App.tsx               # 标签页外壳
├── index.css             # 样式（薰衣草粉紫主题 + 猫爪波点背景）
├── types/index.ts        # Food / FoodLog / WeightLog / Settings 类型
├── constants.ts          # 食物类别标签
├── data/defaults.ts      # 默认食物、设置、初始体重
├── utils/
│   ├── calories.ts       # 热量计算与换算
│   ├── date.ts           # 日期工具
│   ├── id.ts             # id 生成
│   └── storage.ts        # localStorage 读写
├── store/DataContext.tsx # 数据 context，统一持久化
├── components/           # Card / ProgressBar / BottomNav / FoodForm
└── pages/                # Today / AddLog / FoodLibrary / Weight / Settings
public/
├── paws.svg              # 背景猫爪波点图案
└── buni.jpg              # 布尼头像
```
