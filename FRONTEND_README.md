# PollBox - 前端已集成

## ✅ 前端代码已拉取完成

**来源**: https://github.com/0xsongsu/fhew-vote-box.git  
**集成时间**: 2025年10月29日  
**状态**: ✅ 已清理Git信息

---

## 📁 项目结构

```
02-PollBox/
├── contracts/              # 智能合约
│   └── PollBox.sol        # 主合约 (202行)
├── docs/                   # 文档
│   └── PROJECT_SPEC.md    # 项目规格文档
├── src/                    # 前端源码
│   ├── components/        # React组件
│   │   ├── Hero.tsx
│   │   ├── Navbar.tsx
│   │   ├── PollCard.tsx
│   │   └── ui/           # shadcn/ui组件库
│   ├── pages/            # 页面
│   │   ├── Index.tsx     # 首页
│   │   ├── Polls.tsx     # 投票列表
│   │   ├── CreatePoll.tsx # 创建投票页
│   │   ├── PollDetail.tsx # 投票详情页
│   │   └── NotFound.tsx  # 404页面
│   ├── config/           # 配置
│   │   └── wagmi.ts      # Web3配置
│   ├── hooks/            # React Hooks
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── lib/              # 工具库
│   │   └── utils.ts
│   ├── App.tsx           # 主应用
│   ├── main.tsx          # 入口文件
│   └── index.css         # 全局样式
├── public/               # 静态资源
│   ├── favicon.ico
│   ├── placeholder.svg
│   └── robots.txt
├── package.json          # 项目依赖
├── vite.config.ts        # Vite配置
├── tailwind.config.ts    # Tailwind配置
├── tsconfig.json         # TypeScript配置
└── README.md             # 项目说明
```

---

## 🛠️ 技术栈

### 前端框架
- **React** 18.3.1
- **TypeScript** 5.8.3
- **Vite** 5.4.19

### UI组件库
- **shadcn/ui** - 完整的UI组件集
- **Radix UI** - 无障碍组件原语
- **Tailwind CSS** 3.4.17
- **Lucide React** - 图标库

### Web3集成
- **wagmi** 2.19.1 - React Hooks for Ethereum
- **viem** 2.38.5 - TypeScript Ethereum库
- **RainbowKit** 2.2.9 - 钱包连接UI

### 路由和状态管理
- **React Router DOM** 6.30.1
- **TanStack Query** 5.90.5

### 表单和验证
- **React Hook Form** 7.61.1
- **Zod** 3.25.76

---

## 🚀 快速开始

### 1. 安装依赖

```bash
cd /Users/songsu/Desktop/zama/fhe-projects-collection/02-PollBox
npm install
```

### 2. 配置环境变量

创建 `.env` 文件：

```env
VITE_CONTRACT_ADDRESS=0x...  # PollBox合约地址
VITE_CHAIN_ID=11155111       # Sepolia测试网
```

### 3. 启动开发服务器

```bash
npm run dev
```

服务器将运行在 `http://localhost:5173`

### 4. 构建生产版本

```bash
npm run build
```

### 5. 预览生产构建

```bash
npm run preview
```

---

## 📄 页面说明

### 首页 (/)
- 项目介绍
- Hero section
- 快速导航

### 投票列表 (/polls)
- 展示所有投票
- 筛选功能
- 搜索功能

### 创建投票 (/create-poll)
- 创建新的二元投票
- 设置投票元数据
- 设置投票时间
- IPFS元数据哈希

### 投票详情 (/poll/:id)
- 查看投票详情
- Yes/No投票选项
- 实时投票统计
- 解密和查看结果

---

## 🎨 核心组件

### Hero.tsx
- 首页英雄区域
- 项目介绍
- CTA按钮

### Navbar.tsx
- 导航栏
- 钱包连接
- 路由导航

### PollCard.tsx
- 投票卡片组件
- 显示投票信息
- 状态展示

---

## 🔌 Web3集成

### Wagmi配置

文件: `src/config/wagmi.ts`

已配置：
- RainbowKit钱包连接
- Sepolia测试网支持
- 合约ABI导入
- 自动钱包检测

### 合约交互示例

```typescript
import { useAccount, useReadContract, useWriteContract } from 'wagmi';

// 连接钱包
const { address, isConnected } = useAccount();

// 读取合约 - 获取投票详情
const { data } = useReadContract({
  address: contractAddress,
  abi: PollBoxABI,
  functionName: 'getPollDetails',
  args: [pollId],
});

// 写入合约 - 创建投票
const { writeContract } = useWriteContract();
await writeContract({
  address: contractAddress,
  abi: PollBoxABI,
  functionName: 'createPoll',
  args: [metadataHash, durationSeconds],
});
```

---

## 🎯 核心功能实现

### 1. 创建投票
- 表单验证
- 元数据处理
- FHE加密集成（待实现）
- 交易提交

### 2. 二元投票 (Yes/No)
- 选择Yes或No
- 加密投票数据
- 提交投票交易
- 防重复投票

### 3. 解密结果
- 请求解密
- 等待Oracle回调
- 展示Yes/No结果
- 投票统计可视化

### 4. 取消解密
- 超时检测
- 创建者取消权限
- 重新请求解密

---

## 📊 项目统计

| 指标 | 数量 |
|------|------|
| 合约文件 | 1 |
| 前端组件 | 51 |
| 页面文件 | 5 |
| UI组件 | 48 |

---

## 📦 可用脚本

```bash
# 开发模式
npm run dev

# 生产构建
npm run build

# 开发环境构建
npm run build:dev

# 代码检查
npm run lint

# 预览构建
npm run preview
```

---

## 🔧 配置文件

### Vite配置 (vite.config.ts)
- React SWC插件
- 路径别名配置
- 开发服务器设置

### Tailwind配置 (tailwind.config.ts)
- 主题定制
- 颜色方案
- 动画配置
- 响应式断点

### TypeScript配置 (tsconfig.json)
- 严格模式
- 路径映射
- 编译选项

---

## 🎨 样式系统

### Tailwind CSS
- 实用优先的CSS框架
- 自定义主题
- 暗色模式支持
- 响应式设计

### CSS变量
文件: `src/index.css`

已定义：
- 颜色系统
- 字体大小
- 间距
- 圆角
- 阴影

---

## 🔐 PollBox特性

### 二元投票
- Yes/No选择
- 加密布尔值存储
- 使用 `ebool` FHE类型
- 条件同态运算

### 超时保护
- `MAX_PENDING_DURATION = 10 minutes`
- 创建者可取消卡住的解密
- 防止Oracle失败导致的卡死

### 元数据管理
- IPFS哈希存储
- 链下元数据
- Gas优化

---

## 🔄 工作流程

### 创建投票流程
1. 填写投票信息
2. 生成IPFS哈希（或使用bytes32哈希）
3. 设置投票时长
4. 调用 `createPoll(metadataHash, durationSeconds)`

### 投票流程
1. 选择 Yes 或 No
2. 前端加密布尔值
3. 生成零知识证明
4. 调用 `vote(pollId, encChoice, inputProof)`

### 解密流程
1. 投票结束后请求解密
2. 调用 `requestReveal(pollId)`
3. 等待Oracle回调
4. 查看Yes/No结果

### 取消解密流程
1. 检测超时（10分钟）
2. 创建者调用 `cancelReveal(pollId)`
3. 重置解密状态
4. 可重新请求解密

---

## 📚 相关资源

### 官方文档
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [wagmi](https://wagmi.sh/)
- [RainbowKit](https://www.rainbowkit.com/)

### 项目文档
- `docs/PROJECT_SPEC.md` - 完整项目规格
- `contracts/PollBox.sol` - 智能合约
- `README.md` - 项目概述

---

## 🐛 常见问题

### 1. 钱包连接失败
- 确保安装了MetaMask或其他Web3钱包
- 切换到Sepolia测试网
- 检查网络配置

### 2. 合约调用失败
- 检查合约地址是否正确
- 确保钱包有足够的测试币
- 查看浏览器控制台错误

### 3. 解密超时
- 等待10分钟后可以取消
- 创建者可调用 `cancelReveal`
- 重新请求解密

### 4. FHE加密问题
- 确保正确导入FHE SDK
- 检查加密参数
- 参考项目文档

---

## 📝 待办事项

- [ ] 集成FHE SDK (@zama-fhe/relayer-sdk)
- [ ] 实现ebool投票加密逻辑
- [ ] 添加IPFS集成
- [ ] 添加解密结果可视化
- [ ] 优化移动端体验
- [ ] 添加加载状态动画
- [ ] 实现错误边界
- [ ] 添加单元测试
- [ ] 优化SEO

---

## ✅ 已完成

- [x] 前端代码拉取
- [x] Git信息清理
- [x] 项目结构整理
- [x] UI组件集成
- [x] Web3基础配置
- [x] 路由配置
- [x] 响应式设计
- [x] 二元投票UI

---

## 🔄 与ChainVote的区别

| 特性 | ChainVote | PollBox |
|------|-----------|---------|
| 投票类型 | 多选项 | 二元(Yes/No) |
| FHE类型 | euint64 | euint128 + ebool |
| 元数据 | 链上存储 | IPFS哈希 |
| 解密保护 | 基础 | 超时取消机制 |
| 页面数量 | 5 | 5 |
| 组件数量 | 51 | 51 |

---

**前端已准备就绪，可以开始开发FHE功能集成！** 🚀

