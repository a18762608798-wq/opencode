# 安装指南

## 脚本安装

```bash
curl -fsSL https://opencode.ai/v2/install | bash
```

然后激活变量：

```bash
source ~/.bashrc
```

## 网页安装

**注意opencode限制代理每小时访问github数量, 实在不行就从网页好了**

从网页下载: `https://github.com/anomalyco/opencode/releases`, 下载类似于: `
opencode-linux-x64.tar.gz `

```bash
tar -xzf opencode-linux-x64.tar.gz
sudo install -m 755 opencode /usr/local/bin/opencode
```

## 验证安装

安装完成后，验证是否成功：

```bash
opencode --version
which opencode
```

## 查看帮助

```bash
# 查看所有命令
opencode --help

# 查看子命令帮助
opencode models --help
opencode session --help
opencode run --help
```

## 升级

```bash
# 使用安装脚本升级
curl -fsSL https://opencode.ai/v2/install | bash
```

## 卸载

```bash
# 删除二进制文件
sudo rm /usr/local/bin/opencode

# 删除配置目录（可选）
rm -rf ~/.config/opencode
```
