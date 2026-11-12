---
title: "AndClaw 使用指南：下载安装、模型接入与 Android / iOS 原理对比"
description: "从 APK 安装、DeepSeek 配置到飞书远程指令，说明 AndClaw 的工作原理、设备权限、数据流向和 iOS 能力边界。"
pubDatetime: 2026-11-12T03:28:00Z
draft: false
featured: true
tags:
  - AI
  - Android
  - iOS
  - 自动化
---

AndClaw 能把“打开某个 App、搜索内容、截图”等自然语言指令，转换为手机上的一系列动作。这篇文章面向希望体验手机 AI 自动化的 Android 用户与移动端开发者，先介绍安装和配置，再说明它为什么能操作 Android，以及这套方式为什么不能直接搬到普通 iPhone App 上。

资料复核日期：**2026 年 11 月 12 日**。依据为项目官网、公开源码与平台官方文档；本文没有进行 APK 真机安装或远程图片回传实测。

> **先了解三个要点**
>
> - AndClaw 通过 Android 无障碍服务读取界面，执行点击、滑动、输入等操作。模型可使用 OpenAI 兼容 API，包括 DeepSeek。
> - 安装 APK 与启用无障碍本身不要求重置。额外启用整机 Device Owner 通常才涉及设备初始化；官网在线安装把 USB 安装和这一步管理授权合并在同一流程中。
> - 执行器运行在手机上；接入云端模型时，界面文本和必要截图会发送到模型服务。远程图片回传需要按通道和安装版本分别验证。

## 认识 AndClaw

AndClaw 先读取当前界面，让大语言模型决定下一步，执行后重新观察页面，直到任务完成或被停止。项目源码公开在 [GitHub][repo]。

| 能力         | 用途与边界                                                                                 |
| ------------ | ------------------------------------------------------------------------------------------ |
| 手机界面操作 | 打开 App、点击、长按、滑动、输入文字、返回桌面等；效果受页面可识别程度和系统权限影响。     |
| 截图与媒体   | 截图保存到本机；拍照、录像和录屏还需要对应权限。远程回传能力随通道和版本变化。             |
| 自定义模型   | 提供 Kimi Code、Moonshot、OpenAI 三个预设，API 地址、模型名和 API Key 均可编辑。           |
| 远程指令     | 公开源码包含 Telegram、飞书、微信 ClawBot 通道；安装包是否包含对应设置，应以实际版本为准。 |
| 设备管理     | Device Owner 模式提供静默安装、Kiosk 单应用锁定等管理能力，额外初始化条件见下文。          |

首次体验建议选择“回到桌面”“打开计算器”“截图”这类结果容易观察的任务，再逐步增加搜索和多步骤操作。模型给出的“完成”反馈仍应与手机实际界面核对。

## 下载与安装

### 官方下载入口

| 入口       | 链接                                | 说明                                             |
| ---------- | ----------------------------------- | ------------------------------------------------ |
| APK 下载   | [下载 Andclaw.apk][apk]             | 官网引用的最新发布下载地址。                     |
| 发布记录   | [GitHub Releases][releases]         | 查看版本说明与安装包；直链无法下载时从这里查找。 |
| 官网安装器 | [andclaw.app/#/install][install]    | 通过电脑浏览器和 USB 安装，并激活 Device Owner。 |
| 源码与说明 | [github.com/andforce/Andclaw][repo] | 查看 README、功能说明和构建配置。                |

本次复核时，最新发布版本为 **1.2.0**，发布于 2026 年 3 月 27 日；后续版本以发布页为准。本文源码说明基于 main 分支快照 [`3637aded`][snapshot]，它与发布安装包可能存在差异，不能把源码功能直接当作安装包的实测能力。

### 安装前准备

- **系统：**README 正文建议使用 Android 12 或更高版本，顶部另有 Android 9+ 标记，口径不一致。完整体验以正文要求和实际安装包为准。
- **网络与模型：**手机能访问所选模型 API，并准备相应 API Key 和可用额度；仅安装模型厂商的聊天 App 不能替代 API 配置。
- **权限：**启用 AndClaw 无障碍服务；按引导授予悬浮窗权限，以显示紧急停止按钮。拍照、录音、录屏等按实际任务授予对应权限。
- **远程控制：**需要单独配置消息通道；使用飞书时，还需要创建具备机器人能力的应用。

这些要求来自 [项目 README][readme]。不同系统或设备管理员可能限制权限开启，不能只依据 Android 版本判断是否可用。

### 是否需要恢复出厂设置

**安装 APK、启用无障碍服务、配置模型和飞书通道，本身都不要求恢复出厂设置。**额外将应用设为整机 Device Owner，正式部署通常才需要在新机或恢复出厂后的初始化阶段完成注册。这是普通应用授权与整机管理授权的区别。

| 操作或权限        | 是否要求重置                                                                 | 用于什么                                             |
| ----------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------- |
| 普通 APK 安装     | 不要求；按系统提示确认安装来源。                                             | 安装、启动 AndClaw。                                 |
| 无障碍服务        | 不要求；由用户在系统设置中启用，仍受系统或设备管理员限制。                   | 读取允许访问的窗口语义，执行点击、滑动、输入等动作。 |
| 模型与飞书配置    | 不要求；模型使用 API Key，飞书使用应用凭据和事件订阅。                       | 接收任务、调用模型、发送执行反馈。                   |
| 整机 Device Owner | 正式部署通常在新机或重置后的初始化阶段注册；AndClaw 官网流程要求先恢复出厂。 | 静默装卸、整机策略、Kiosk 等额外设备管理能力。       |

Device Owner 是可管理整台设备的角色，拥有普通 App 和无障碍服务没有的策略权限。Android 通常要求在受控的设备注册流程中确定该角色，避免已在使用的个人手机因一次普通应用安装就被接管。企业部署可以使用二维码等注册方式；这是 [Android 平台能力][dedicated]，不代表 AndClaw 已支持所有企业注册方式。

“通常需要”并非“任何情况下都必须重置”：Android 官方也提供 [ADB 开发测试方式][dev-setup]，在设备未配置账号等前置条件满足时，可以设置 Device Owner 而不先恢复出厂。能否使用还取决于系统版本和设备状态，它不是日常手机的通用免重置方案。采用 AndClaw 官网管理流程时，仍应遵循 [官网的前置条件][install]。

只想尝试打开 App、点击、输入和截图，可以先直接安装 APK、启用无障碍并验证基础任务；需要静默安装或 Kiosk 等管理能力时，再评估是否使用专用设备启用 Device Owner。

### 方式 A：直接安装 APK，先体验界面操作

1. 在 Android 手机下载官方 APK，打开安装包，按系统提示允许该下载来源安装应用。完成后应能找到并打开 AndClaw。
2. 进入系统“设置 → 无障碍”，找到 AndClaw 并启用服务。不同品牌的菜单位置可能不同，可在设置中搜索“无障碍”。
3. 按应用引导授予“显示在其他应用上层”权限，并检查紧急停止入口是否可用。
4. 在“AI 设置”填写模型配置，保存后进入对话页面，先发送“回到桌面”，观察手机是否执行动作。

普通 UI 操作的 Android 平台前提是启用具备相应能力的无障碍服务，无需 Root 或整机 Device Owner。当前公开源码提供未开启 Device Owner 时的对话和设置入口；发布版本若将某些入口或动作绑定到管理模式，属于该版本的实现限制，不能据此推导为“Android 无障碍必须先重置”。具体任务仍需在实际安装包上验证。参见 [Android 无障碍指南][accessibility]、[AndClaw 页面入口实现][setup]。

### 方式 B：官网在线安装，启用设备管理

> **先确认设备可用于管理模式。**官网流程要求先恢复出厂设置，会清除设备数据。仅在已备份且设备所有者明确授权的专用设备上执行；借用或共享设备应先采用普通安装路径。

1. 按官网要求准备可重置的 Android 设备，备份数据并完成恢复出厂设置。
2. 开启开发者选项和 USB 调试，使用支持数据传输的 USB 线连接电脑。
3. 在电脑的 Chrome、Edge 等 Chromium 浏览器中打开官网安装页，通过 HTTPS 访问。
4. 点击“下载 APK”，保存到电脑，再点击“选择已下载的 APK”选中文件。
5. 点击“开始安装”，选择 USB 设备，并在手机上确认调试授权。安装器依次连接设备、安装应用、设置 Device Owner。
6. 完成后打开 AndClaw，检查设备管理员状态，并继续启用无障碍服务和配置模型。

“在线安装”表示无需手动安装 ADB 工具，该安装流程仍需要电脑和 USB。安装完成后的日常手机操作可以在设备上运行。官网标注 Chrome 61+、Edge 79+，实际应使用仍受支持的浏览器版本，步骤以 [实时页面][install] 为准。

## 模型配置：包括 DeepSeek

### 三个选项代表什么

“Kimi Code / Moonshot / OpenAI”是连接预设。选择预设后仍可修改 API 地址、模型名和 API Key。DeepSeek 可以通过 OpenAI 兼容协议接入；切换服务商可能重置预填值，应先选服务商，再填写地址和模型。参见 [设置页源码][ai-settings]、[DeepSeek 官方调用说明][deepseek]。

| 服务商选项        | AndClaw 中填写的 API 地址                    | 配置说明                                               |
| ----------------- | -------------------------------------------- | ------------------------------------------------------ |
| Kimi Code         | `https://api.kimi.com/coding`                | 使用 Kimi Code Key；客户端按此预设追加 Messages 路径。 |
| Moonshot          | `https://api.moonshot.cn/v1`                 | 使用 Moonshot 开放平台 Key；客户端追加聊天请求路径。   |
| OpenAI            | `https://api.openai.com/v1/chat/completions` | 默认 OpenAI 地址，可修改为其他兼容服务端点。           |
| OpenAI → DeepSeek | `https://api.deepseek.com/chat/completions`  | 使用 DeepSeek Key；填写完整端点，便于核对。            |

Kimi Code 与 Moonshot 是两套 API 服务，Key 不通用。模型名可手填，也可点击“获取模型列表”查询，再选择账号可用的模型。

### DeepSeek 填写示例

| 字段                | 填写内容                                                                                        |
| ------------------- | ----------------------------------------------------------------------------------------------- |
| 服务商              | OpenAI                                                                                          |
| API 地址 / Base URL | `https://api.deepseek.com/chat/completions`                                                     |
| API Key             | 在 [DeepSeek 开放平台](https://platform.deepseek.com/api_keys) 创建的 Key，仅填写到应用配置中。 |
| 模型名              | `deepseek-flash`；这是复核时官方文档列出的模型名称，后续以官方文档和账号模型列表为准。          |

1. 在“AI 设置”先选择 OpenAI，再按上表填写地址、Key 和模型名。
2. 点击“测试连接”，检查是否获得有效模型回复；随后点击“保存”。
3. 进入本地对话，发送“回到桌面”，再尝试“打开计算器”，分别观察实际动作。

复核时，DeepSeek 官方列明 `deepseek-flash` 支持视觉输入，而 `deepseek-v4-pro` 不支持视觉。AndClaw 在浏览器、WebView 或循环重试时可能附加截图，选择模型时要同时核对图片输入能力。**协议兼容并不代表手机任务已经通过实测。**参见 [DeepSeek 模型能力说明][deepseek-models]、[AndClaw 任务控制源码][controller]。

> **测试连接出现空回复时：**当前源码的测试请求只允许 64 个输出 token，并读取最终 `content`。DeepSeek 默认开启思考模式，可能尚未产生最终回复就耗尽测试额度。先检查错误信息、模型列表和本地简单任务，不能仅凭空回复判定 Key 无效。若始终无法完成测试或动作，应使用已兼容的模型，或由开发者调整测试额度和思考参数；当前设置页未提供该开关。参见 [测试实现][ai-settings]、[DeepSeek 思考模式][thinking]。

## 通过飞书下发手机指令

飞书通道由手机上的 AndClaw 连接飞书开放平台，接收机器人消息并交给 Agent 执行。手机只安装飞书客户端并不足以建立这条链路，需要配置飞书应用和 AndClaw 中的远程连接。以下以机器人单聊为例，依据 [飞书桥接源码][feishu-bridge] 与 [官方应用配置说明][feishu-faq]。

### 创建机器人并连接手机

1. 进入 [飞书开发者后台](https://open.feishu.cn/app)，在自己有权限管理的租户创建自建应用，添加“机器人”能力，取得 App ID 和 App Secret。企业租户按管理员要求申请。
2. 在“权限管理”添加下表所列的应用身份权限；新增权限后需发布版本才会生效。
3. 在 AndClaw“远程连接”选择“飞书”，填写 App ID、App Secret，点击“测试连接”，然后保存。
4. 保持手机联网、AndClaw 运行，确认远程通道实际显示“已连接”。测试按钮主要验证凭据可获取访问令牌，不能替代长连接状态检查。
5. 回到开发者后台，在“事件与回调”选择“使用长连接接收事件”，保存，并订阅“接收消息”事件 `im.message.receive_v1`。保存长连接方式前，需要客户端已经建立连接。
6. 创建并发布应用版本，将可用范围限制为测试账号。在飞书中打开机器人单聊，先发送 `/status` 验证收发链路。

| 应用身份权限                  | 用途                                                                                   |
| ----------------------------- | -------------------------------------------------------------------------------------- |
| `im:message.p2p_msg:readonly` | 获取用户发给机器人的单聊消息。                                                         |
| `im:message:send_as_bot`      | 以应用机器人身份发送状态和执行反馈。                                                   |
| `im:resource`                 | 读取、上传图片或其他文件，用于媒体回传；权限名称或替代项以当前后台及图片上传接口为准。 |

单聊消息、机器人能力、长连接和发布流程来自 [飞书官方指南][feishu-faq]；图片上传还需要 [对应资源权限][feishu-image]。App Secret 和模型 API Key 只填入受控配置，对外截图要完整遮盖这些字段。不要为了测试扩大到全员可用或申请无关业务权限。

### 指令示例与完成标准

| 验证阶段 | 发送内容                       | 观察结果                                      |
| -------- | ------------------------------ | --------------------------------------------- |
| 连接检查 | `/status`                      | 机器人返回 Agent 状态，确认消息收发均正常。   |
| 基础动作 | 回到桌面                       | 手机回到桌面，确认无障碍执行可用。            |
| 打开应用 | 打开计算器 App，等界面加载完成 | 手机进入已安装 App 的界面；提前处理首次弹窗。 |
| 本地截图 | 截图并保存到本机               | 在相册或 `Pictures/Andclaw` 中找到新截图。    |
| 远程图片 | 把刚才的截图发给我             | 飞书单聊实际出现图片，才算图片回传验证通过。  |
| 停止任务 | `/stop`                        | 停止当前任务，也可使用手机上的紧急停止入口。  |

这些是用于验证的指令示例，**不代表已完成真机演示**。先逐项验证，再组合成“打开计算器 App，等待界面加载完成，然后截图并发给我”。执行期间保持手机解锁亮屏，并允许 AndClaw 在后台运行。任务忙碌时先查询状态或发送 `/stop`，再下发新任务。

### 飞书图片回传的已知限制

> **飞书收消息、手机截图、飞书发图片是三个独立环节。**本次复核的公开源码虽然包含飞书通道，但图片上传与消息发送参数存在和官方接口不一致的实现。不能将“连接成功”或“截图保存成功”视为飞书图片已经送达。

具体来说，官方 [图片上传接口][feishu-image] 要求同时包含 `image_type` 文本字段和 `image` 文件字段，复核的 [源码][feishu-api] 未按这两个字段分别构造；官方 [发送消息接口][feishu-message] 要求 `receive_id_type` 放在 URL 查询参数中，源码放在请求正文。

遇到“本机有截图、飞书没有图片”时，先核对安装版本与项目修复进展，并在本机查看文件。继续修改模型地址通常无法解决通道上传问题。这个结论来自静态源码与接口文档核对，未做真机复现。

项目 README 将 Telegram 描述为媒体文件回传通道，微信 ClawBot 当前主要提供媒体已本地保存的文本说明。选择其他通道时，也应分别验证指令接收、执行反馈和图片送达。

## 工作原理：手机如何被 AI 操作

### 观察、决策、执行的循环

AndClaw 优先读取 UI 树，也就是页面提供给无障碍系统的结构化界面信息。当前实现主要提取文字与屏幕位置；遇到浏览器、WebView 或重复动作时，会附加截图帮助模型判断。模型返回结构化动作后，由手机执行，再读取更新后的页面。参见 [无障碍执行源码][service]、[任务控制源码][controller]。

![AndClaw 执行循环：本地或远程指令进入手机，读取界面后发送到模型 API，返回动作并执行，再读取界面直到完成或停止。](@/assets/images/andclaw-guide/agent-loop.jpg)

图中蓝色连线表示与模型 API 的通信，灰色连线表示指令、手机动作和结果反馈。远程通道只是指令入口，本地对话也会进入同一个 Agent 执行循环。任务可能因页面无法识别、模型回复不符合动作格式、网络错误或用户停止而结束。

### Android 无障碍服务怎么工作

无障碍服务是 Android 为辅助用户理解和操作界面提供的系统机制，屏幕阅读器、切换控制和语音操作都可以利用它。AndClaw 把这一机制作为界面执行器，再接入模型完成“观察 → 决策 → 执行”的任务循环。无障碍本身提供界面信息和动作入口，不负责判断用户任务，也不自动授予设备管理权限。

![Android 无障碍链路：AndClaw 服务向系统查询，系统检查授权并通过 Binder 转发，目标 App 提供节点信息和支持的动作，系统将结果返回服务。](@/assets/images/andclaw-guide/android-accessibility.jpg)

#### 用户授权与系统连接

应用首先在清单中声明无障碍服务和需要使用的能力。AndClaw 当前配置包括读取窗口内容、执行手势和截图。声明能力只告诉系统“服务需要什么”；安装应用后，仍须由用户在系统设置中启用服务，系统才会绑定并建立连接。

关闭服务后，AndClaw 就失去这条无障碍操作链路。模型配置或飞书凭据仍可能保留，但不能因此继续通过该服务控制界面。参见 [服务声明与生命周期][service-lifecycle]、[AndClaw 能力配置][service-config]。

系统中的无障碍管理服务负责权限检查、窗口与服务连接管理。查询通过 Android 的 Binder 跨进程机制到达目标 App 的无障碍交互接口，再把结果返回给服务；节点动作也沿受控接口转发。这样可以跨 App 访问被允许的界面语义，同时不必直接读取目标进程的内存。参见 [AOSP 系统无障碍管理实现][aosp]。

#### 读取到的是无障碍节点

目标 App 的 View、Compose 语义或虚拟节点会提供 `AccessibilityNodeInfo`。节点可以包含文字、描述、屏幕坐标、可点击或可编辑状态，以及支持的动作。

这是面向辅助功能的界面表示，可能合并多个控件、隐藏部分节点，也可能遗漏没有提供语义的自绘内容。因此不能等同于完整视图层级，更不能据此取得 App 的私有数据库、文件或全部业务数据。

Android 既能发送窗口、内容、焦点等变化事件，也允许服务主动查询窗口节点。AndClaw 当前采用任务循环主动读取 `rootInActiveWindow`，并遍历当前活动窗口；事件回调未承担界面解析工作。当前文本提取主要保留“有文字或可点击节点”的文字和屏幕范围，不应写成已经完整利用了系统提供的全部语义字段。参见 [源码][service]。

#### 模型决策如何变成动作

读取结果交给模型后，模型决定下一步操作。手机再调用相应接口执行，执行完成后等待页面更新并重新读取界面。各类动作走不同入口，不能笼统理解为所有操作都直接点击一个节点。

| 动作                 | Android 的执行机制                                                                 | AndClaw 当前用法                                                                 |
| -------------------- | ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| 节点点击、设置文字   | 节点 `performAction` 请求由目标 App 的无障碍实现处理，只能执行节点实际支持的动作。 | 输入优先使用 `ACTION_SET_TEXT`，失败时尝试节点粘贴；点击主要走下一行的坐标手势。 |
| 坐标点击、长按、滑动 | `dispatchGesture` 请求系统派发触摸手势，经输入链路到当前界面。                     | 根据模型给出的坐标和路径执行；页面移动或弹窗变化会影响命中位置。                 |
| 返回、Home 等导航    | `performGlobalAction` 执行系统提供的全局动作，可用性受当前系统状态影响。           | 用于返回、回到桌面等任务。                                                       |
| 打开 App             | 可通过 Intent 请求系统启动目标应用，不必先在桌面定位图标。                         | 结合启动结果与随后读取到的页面继续判断任务。                                     |
| 获取截图             | 使用单独的截图接口，需要对应能力和系统版本；受保护窗口可能无法捕获。               | 保存本地截图，或在浏览器、WebView 和循环重试时附加给模型。                       |

执行机制依据 [Android 官方指南][accessibility]，具体调用依据 [无障碍服务源码][service] 与 [任务控制源码][controller]。

#### 能力边界与失败原因

**无障碍、Device Owner、Root 是三种不同机制。**无障碍提供受授权的界面读取和交互，Device Owner 提供整机策略管理，Root 涉及更高的系统权限。AndClaw 的普通无障碍 UI 操作不需要后两者，开启 Device Owner 也不会自动让原本缺少语义的页面变成完整可读的节点树。

自绘画布和缺少标签的图标可能没有可用文字，网页节点可能不完整；页面动画、加载或弹窗会让坐标与实际界面发生偏移；锁屏、受保护窗口及系统权限也可能阻止操作。截图可补充视觉信息，但不能解除权限限制。

是否成功，应检查更新后的真实页面或本地文件，不能只依据动作已发出或模型已报告完成。

### 数据流向与使用边界

使用云端模型 API 时，任务描述、当前界面文字、部分对话历史，以及视觉分析时附加的截图，会发送到所配置的模型服务。远程控制还会让指令和反馈经过飞书等消息平台。**“在手机上运行”不等于“数据只留在手机里”。**这一点也在 [项目 README][readme] 中明确提醒。

- 首次体验使用专用测试设备和普通页面，避免将私人聊天、支付信息、账号凭据或企业内部页面放入任务上下文。
- 使用自己创建并有权使用的模型 Key 和机器人配置，设置合理额度；截图、录屏和日志中完整遮盖密钥及个人信息。
- 只在本人所有或已获授权的设备和账号上操作。支付、删除数据、发消息等有实际后果的步骤保留人工确认，不把界面内容中的文字当作新的授权。
- 企业设备、企业应用或业务数据接入第三方模型时，仍需遵守所属组织的审批、数据处理及第三方服务规则；无障碍授权本身不能替代这些要求。

## 与 iOS 的原理和能力对比

**普通 iPhone 第三方 App 无法直接复制 AndClaw 的 Android 无障碍执行方式。**iOS 的 UIAccessibility 用于让自身 App 向系统辅助功能提供可访问语义。在公开 API 和正常沙盒下，它没有向普通第三方 App 提供等价的跨 App UI 树读取与任意触摸注入能力。这是系统接口与权限边界的差异。参见 [UIAccessibility][ios-accessibility]、[Apple 沙盒安全说明][ios-security]。

| 比较维度            | Android / AndClaw                                                                 | iOS / 普通第三方 App                                                                         |
| ------------------- | --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| 无障碍接口          | 用户可启用第三方 `AccessibilityService`，读取允许访问的窗口语义并执行受支持动作。 | UIAccessibility 主要描述自身界面；VoiceOver、语音控制等跨界面辅助功能由系统提供。            |
| 任意 App 的 UI 操作 | 可基于当前窗口节点或坐标执行点击、输入和滑动，依赖权限与界面可识别性。            | 没有供普通第三方 App 使用的等价通用执行接口；不能因用户打开辅助功能就获得其他 App 的控制权。 |
| 跨 App 任务         | 可组合 Intent 与 UI 操作，不要求目标 App 为该 Agent 单独适配。                    | 可使用 App Intents、快捷指令、URL Scheme 或正式 API；业务动作通常需要目标 App 主动提供支持。 |
| 测试自动化          | 也可使用独立的测试工具；AndClaw 日常执行主要依赖无障碍服务。                      | XCUIAutomation / XCTest 可在 UI 测试环境检查界面和执行交互，依赖开发、测试运行器与设备配置。 |
| 远程模型指令        | 消息平台可把指令交给手机上的无障碍执行器，形成界面任务循环。                      | 接收模型或消息平台指令并不会扩大沙盒权限，仍需通过系统允许的动作接口完成任务。               |

### iOS 上可选择的实现方式

- **面向日常业务：**使用 [App Intents][app-intents]、快捷指令和正式 API，让目标 App 明确提供“搜索”“创建记录”“播放”等动作。
- **面向研发测试：**使用 [XCUIAutomation / XCTest][xcui]，在测试环境中执行点击、查询界面和截图；这类测试能力不能作为普通上架 App 的运行权限。
- **面向人工辅助：**使用系统语音控制、切换控制等功能。系统可以辅助用户操作屏幕，不意味着任意第三方 Agent 获得相同接口。

App Intents 支持的是应用主动声明的动作与数据，UI 测试支持的是测试环境交互。因此，“有跨 App 自动化方案”与“可以安装一个 App 通用控制其他 App”应分别判断。macOS 的辅助功能授权模型也不能直接套用到 iPhone。

## 常见问题与核对顺序

| 现象                           | 先核对什么                                                                                           |
| ------------------------------ | ---------------------------------------------------------------------------------------------------- |
| 只有三个模型选项               | 选择 OpenAI，编辑 API 地址与模型名；它是兼容协议预设。使用 DeepSeek 时填写本文中的完整端点。         |
| 模型测试失败或回复为空         | 检查地址、Key、额度、模型名、手机网络和具体错误；空回复还可能受思考模式与测试输出额度影响。          |
| 模型有回复，手机没有动作       | 检查 AndClaw 无障碍服务、手机解锁状态和当前界面；先用“回到桌面”确认基础动作，再处理 App 登录或弹窗。 |
| 飞书测试连接成功，却收不到指令 | 检查实际长连接状态、接收消息事件、应用身份权限、版本发布和可用范围；凭据测试通过不代表订阅已完成。   |
| 后台无法保存长连接订阅         | 先让 AndClaw 保存飞书配置并实际连接，再回后台保存订阅方式；官方要求已有客户端长连接。                |
| 本机有截图，飞书没有图片       | 检查图片权限与安装版本，并核对本文的飞书接口兼容问题；以聊天中实际出现图片为完成标准。               |
| 设备管理初始化失败             | 核对官网前置条件、设备初始化状态、USB 调试授权和连接；不要为普通 UI 测试直接重置日常设备。           |

以上是依据项目配置逻辑和平台文档整理的核对顺序，不替代具体设备上的错误分析。页面行为、系统权限和模型服务变化，都可能需要重新验证。

## 资料来源与验证范围

**验证范围：**本文核对了官方下载安装页面、公开源码中的模型设置、无障碍执行与飞书桥接实现，并复核了相关平台官方资料。未执行 APK 真机安装、具体 App 任务或飞书图片回传闭环；示例为操作指导，不能当作实测成功记录。

**版本维护：**源码引用固定到快照 `3637aded61a98c4c3817ab14e4e7bec100d3eb6f`，便于追溯。APK 功能以实际发布版本为准；模型名称、权限名称和官网安装流程以后续官方文档为准。飞书回传问题应随项目修复版本重新验证。

**许可说明：**项目 README 标注为 MIT，但本次复核未在该源码快照找到独立的 `LICENSE` 文件。本文只介绍操作与原理，未转载项目源码或分发 APK；若要复用代码或再分发软件，应先向维护者确认许可，并核对相关依赖的许可要求。

1. [AndClaw 项目与 README][readme]、[源码快照][snapshot]、[发布记录][releases]、[官网安装页][install]。
2. AndClaw 源码：[页面入口][setup]、[模型设置][ai-settings]、[任务控制][controller]、[无障碍服务][service]、[能力配置][service-config]。
3. AndClaw 飞书通道：[桥接实现][feishu-bridge]、[API 请求实现][feishu-api]。
4. Android 官方：[创建无障碍服务][accessibility]、[声明与生命周期][service-lifecycle]、[专用设备与整机注册][dedicated]、[Device Owner 开发测试条件][dev-setup]。
5. [AOSP：系统无障碍管理与跨进程连接][aosp]。
6. DeepSeek 官方：[首个 API 调用][deepseek]、[模型名称与能力][deepseek-models]、[思考模式][thinking]。
7. 飞书官方：[应用配置说明][feishu-faq]、[上传图片][feishu-image]、[发送消息][feishu-message]。
8. Apple 官方：[UIAccessibility][ios-accessibility]、[iOS 运行时与沙盒安全][ios-security]、[App Intents][app-intents]、[XCUIAutomation][xcui]。

[repo]: https://github.com/andforce/Andclaw
[readme]: https://github.com/andforce/Andclaw/blob/3637aded61a98c4c3817ab14e4e7bec100d3eb6f/README.md
[snapshot]: https://github.com/andforce/Andclaw/tree/3637aded61a98c4c3817ab14e4e7bec100d3eb6f
[apk]: https://github.com/andforce/Andclaw/releases/latest/download/Andclaw.apk
[releases]: https://github.com/andforce/Andclaw/releases
[install]: https://andclaw.app/#/install
[setup]: https://github.com/andforce/Andclaw/blob/3637aded61a98c4c3817ab14e4e7bec100d3eb6f/mdm/src/main/java/com/afwsamples/testdpc/policy/locktask/SetupKioskModeActivity.kt
[ai-settings]: https://github.com/andforce/Andclaw/blob/3637aded61a98c4c3817ab14e4e7bec100d3eb6f/mdm/src/main/java/com/afwsamples/testdpc/policy/locktask/AiSettingsActivity.kt
[controller]: https://github.com/andforce/Andclaw/blob/3637aded61a98c4c3817ab14e4e7bec100d3eb6f/app/src/main/java/com/andforce/andclaw/AgentController.kt
[service]: https://github.com/andforce/Andclaw/blob/3637aded61a98c4c3817ab14e4e7bec100d3eb6f/app/src/main/java/com/andforce/andclaw/AgentAccessibilityService.kt
[service-config]: https://github.com/andforce/Andclaw/blob/3637aded61a98c4c3817ab14e4e7bec100d3eb6f/app/src/main/res/xml/accessibility_config.xml
[feishu-bridge]: https://github.com/andforce/Andclaw/blob/3637aded61a98c4c3817ab14e4e7bec100d3eb6f/app/src/main/java/com/andforce/andclaw/bridge/feishu/FeishuBridge.kt
[feishu-api]: https://github.com/andforce/Andclaw/blob/3637aded61a98c4c3817ab14e4e7bec100d3eb6f/app/src/main/java/com/andforce/andclaw/bridge/feishu/FeishuApiClient.kt
[accessibility]: https://developer.android.com/guide/topics/ui/accessibility/service
[service-lifecycle]: https://developer.android.com/guide/topics/ui/accessibility/views/service
[dedicated]: https://developer.android.com/work/dpc/dedicated-devices
[dev-setup]: https://developer.android.com/work/dpc/dedicated-devices/cookbook#dev-setup
[aosp]: https://github.com/aosp-mirror/platform_frameworks_base/blob/master/services/accessibility/java/com/android/server/accessibility/AccessibilityManagerService.java
[deepseek]: https://api-docs.deepseek.com/
[deepseek-models]: https://api-docs.deepseek.com/quick_start/pricing
[thinking]: https://api-docs.deepseek.com/guides/thinking_mode
[feishu-faq]: https://open.feishu.cn/document/develop-an-echo-bot/faq
[feishu-image]: https://open.feishu.cn/document/server-docs/im-v1/image/create
[feishu-message]: https://open.feishu.cn/document/server-docs/im-v1/message/create
[ios-accessibility]: https://developer.apple.com/documentation/uikit/uiaccessibility
[ios-security]: https://support.apple.com/guide/security/security-of-runtime-process-sec15bfe098e/web
[app-intents]: https://developer.apple.com/documentation/appintents
[xcui]: https://developer.apple.com/documentation/xcuiautomation
