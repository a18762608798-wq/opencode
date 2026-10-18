- 手机浏览器最省事的连法（同机后台服务，链接一次有效、5 分钟过期）：

```bash
opencode pair
```

浏览器打开它给出的链接即可。下面是常驻方案：Linux Mint 用 `serve` 起 Web 界面（V2 用 `serve` 提供 Web 界面），再经 Tailscale 暴露出去：

```bash
opencode serve --port 1314
```

- Linux Mint 安装并登录 Tailscale：

```bash
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up
```

- 手机安装 Tailscale，并登录同一个账号。

- Linux Mint 把 OpenCode Web 挂到 Tailscale：

```bash
tailscale serve --bg 1314 
```

- 查看固定访问地址：

```bash
tailscale serve status
```

会得到类似：

```text
https://mintsystem.tailce3f31.ts.net
```

- 手机连着 Tailscale，浏览器打开这个地址，就能直接访问 OpenCode Web。

可以用

```
tailscale status
```

检查具体的连接设备.

以后日常只要确保：

```bash
opencode serve --port 1314
```

在运行，Tailscale 在线即可。`tailscale serve` 一般不用每次重新配置。
