# 编写自定义 MCP Server

建议使用官方 SDK，不要手写不完整的 JSON-RPC 循环。

SDK: 意为：软件开发工具包.

## Python 示例

安装：

```bash
pip install "mcp[cli]"
```

代码：

```python
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("weather-server")


@mcp.tool()
def get_weather(city: str) -> str:
    """获取指定城市的天气。"""
    city = city.strip()

    if not city:
        raise ValueError("city 不能为空")

    return f"{city}：晴，25°C"


if __name__ == "__main__":
    mcp.run()
```

OpenCode 配置：

```json
{
  "mcp": {
    "servers": {
      "weather": {
        "type": "local",
        "command": [
          "python",
          "./mcp/weather_server.py"
        ]
      }
    }
  }
}
```
