# 无头模式 (Headless Mode)

## 什么是无头模式？

无头模式允许 OpenCode **在没有 TUI 交互界面的情况下运行**，通过命令行参数或 HTTP API 进行交互。

这对于 CI/CD 集成、自动化脚本、批量处理等场景非常有用。

## 两种无头运行方式

### 1. `opencode run` — 单次执行

适用于：一次性任务、CI 流水线、脚本调用

```bash
# 基本用法
opencode run "解释这个项目的架构"

# 指定模型
opencode run "Review this code for bugs" --model openai/gpt-4o

# 指定 Agent
opencode run "审查代码安全" --agent "Code Reviewer"

# 引用文件
opencode run --file src/main.go "分析这个文件的性能问题"

# JSON 格式输出（适合脚本解析）
opencode run "列出所有 TODO" --format json
```

### 2. `opencode serve` — HTTP 服务

适用于：作为后端服务运行、集成到 Web 应用、多个客户端调用

```bash
# 启动 HTTP 服务
opencode serve --port 3000

# 设置密码保护
OPENCODE_SERVER_PASSWORD="mysecret" opencode serve --port 3000

# 允许特定来源的 CORS
opencode serve --port 3000 --cors "https://myapp.com"
```

## `opencode run` 详解

### 基本参数

| 参数 | 简写 | 说明 |
|------|------|------|
| `message` | | 位置参数，要执行的提示词（可多个，会拼接） |
| `--model` | `-m` | 指定模型（格式：provider/model，可加 `#variant`） |
| `--agent` | | 指定 Agent |
| `--file` | `-f` | 引用文件（可多次使用） |
| `--format` | | 输出格式：`default` 或 `json` |
| `--continue` | `-c` | 继续上次会话 |
| `--session` | `-s` | 指定会话 ID |
| `--fork` | | Fork 会话（与 --continue 或 --session 配合） |

### 实用场景

#### 场景一：代码审查流水线

```bash
# .github/workflows/code-review.yml
name: AI Code Review
on: [pull_request]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: AI Review
        run: |
          # 获取变更文件列表
          FILES=$(git diff --name-only origin/main...HEAD)

          # 对每个变更文件进行审查
          for file in $FILES; do
            opencode run \
              "审查这个文件的代码质量和安全问题，用中文给出建议" \
              --file "$file" \
              --agent "Code Reviewer" \
              --format json >> review-results.jsonl
          done

      - name: Post Review
        run: |
          # 将审查结果发布为 PR 评论
          python scripts/post-review.py review-results.jsonl
```

#### 场景二：自动化文档生成

```bash
#!/bin/bash
# scripts/generate-api-docs.sh

# 为所有 API 文件生成文档
for file in src/api/*.ts; do
  filename=$(basename "$file" .ts)
  opencode run \
    "为这个 API 文件生成中文文档，包括接口说明、参数、返回值、示例" \
    --file "$file" \
    --format json \
    > "docs/api/${filename}.json"
done

# 合并文档
python scripts/merge-api-docs.py docs/api/
```

#### 场景三：批量代码迁移

```bash
# 将项目中的 JavaScript 文件转换为 TypeScript
opencode run \
  "将这个 JavaScript 文件转换为 TypeScript，添加完整的类型定义" \
  --file src/utils/helpers.js

opencode run \
  "同上，转换为 TypeScript" \
  --file src/services/api.js
```

#### 场景四：定期安全扫描

```bash
#!/bin/bash
# cron: 0 2 * * 1 (每周一凌晨 2 点)

REPORT_DIR="security-reports/$(date +%Y-%m-%d)"
mkdir -p "$REPORT_DIR"

opencode run \
  "全面审查项目的安全性，包括：
  1. 依赖漏洞
  2. 代码注入风险
  3. 认证和授权问题
  4. 敏感信息泄露
  请生成详细的中文报告" \
  --format json \
  > "$REPORT_DIR/full-scan.json"

# 发送报告
mail -s "每周安全扫描报告" team@company.com < "$REPORT_DIR/full-scan.json"
```

## `opencode serve` 详解

### 启动服务

```bash
# 基本启动
opencode serve

# 自定义端口和主机
opencode serve --port 8080 --hostname 0.0.0.0

# 带密码保护
export OPENCODE_SERVER_PASSWORD="secure-password"
opencode serve --port 3000
```

### HTTP API（V2）

V1 的 `/api/message`、`/api/sessions` 已不存在。用内置 `api` 命令调 V2 接口（自动走本机后台服务的发现与鉴权）：

```bash
# 列出会话
opencode api get /api/session

# 看单个会话
opencode api get /api/session/abc123

# 往指定会话发消息
opencode api post /api/session/abc123/prompt --data '{"text":"给这个程序加上命令行参数支持"}'
```

完整端点与参数见 [API reference](https://opencode.ai/v2/docs/api)，原始 OpenAPI 可从运行中的服务取 `/openapi.json`。

### Docker 部署

```dockerfile
# Dockerfile
FROM ghcr.io/sst/opencode:latest

# 预配置
ENV OPENCODE_SERVER_PASSWORD="${SERVER_PASSWORD}"

EXPOSE 3000
CMD ["opencode", "serve", "--port", "3000", "--hostname", "0.0.0.0"]
```

```bash
# docker-compose.yml
version: "3.8"
services:
  opencode:
    build: .
    ports:
      - "3000:3000"
    environment:
      - SERVER_PASSWORD=${OPENCODE_SERVER_PASSWORD}
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
    volumes:
      - ./workspace:/workspace
      - opencode-config:/root/.config/opencode
    restart: unless-stopped

volumes:
  opencode-config:
```

### 与 Web 应用集成

直接调 V2 HTTP 接口（端点与参数以 `/openapi.json` 为准，不要再用 V1 的 `/api/message`）：

```bash
opencode api get /api/session
```

## 会话管理

### 查看所有会话

```bash
opencode session list
```

输出示例：

```
Session ID                          Title              Updated
abc123-def456                       API重构              2026-07-05 10:30
ghi789-jkl012                       修复登录Bug          2026-07-05 09:15
```

### 继续会话

```bash
# 继续最近一个会话
opencode run --continue "继续未完成的工作"

# 继续指定会话
opencode run --session abc123 "上次说到..."

# Fork 会话（保留上下文，独立发展）
opencode run --session abc123 --fork "尝试另一种方案"
```

## 最佳实践

1. 🔐 **始终设置密码**：`opencode serve` 时务必设置 `OPENCODE_SERVER_PASSWORD`
2. 📊 **记录日志**：将输出重定向到日志文件，便于追溯
3. 🧪 **先在 TUI 中验证**：复杂 prompt 先在 TUI 中测试，再放到脚本中
4. 📝 **使用 `--format json`**：脚本中处理输出时使用 JSON 格式
5. 🔄 **利用会话机制**：通过 `--session` 保持多步操作的上下文

## 下一步

（上下文工程笔记尚未整理。）
