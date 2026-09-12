# 单号生成后端实现（id-generator + devops-utils）

与前端 `shplugin/src/utils/workorder/` 引擎规则完全一致的 Java 实现，支持前后端同源生成。后端额外提供 Redis 存储保证多实例下流水号连续性。

## 模块结构

```
id-generator/  （纯 Java 库，无 Spring/Redis 依赖）
  src/main/java/com/starhorse/devops/idgenerator/workorder/
    WorkorderSegment.java        段配置 PO
    WorkorderConfig.java         引擎配置 PO
    WorkorderContext.java        运行时上下文 PO
    WorkorderSegmentResult.java  段结果 PO
    WorkorderGenerateResult.java 生成结果 PO
    SeqStore.java                序列存储接口
    MemorySeqStore.java          内存存储实现
    DateFormatter.java           日期格式化
    SeqFormatter.java            流水号格式化（进制 + 填充 + 溢出 + 范围约束）
    WorkorderValidator.java      配置校验 + 长度校验
    WorkorderGenerator.java      生成引擎
    WorkorderCategoryPresets.java 类别预设库

devops-utils/  （Spring Boot Web + Redis）
  src/main/java/com/starhorse/devops/utils/workorder/
    RedisSeqStore.java            Redis 存储实现（Lua 原子 INCR）
    WorkorderGenerateRequest.java 请求 PO
  src/main/java/com/starhorse/devops/utils/api/
    IdGenerateController.java     REST 接口
```

## 设计原则

| 原则 | 说明 |
| --- | --- |
| id-generator 纯净 | 不引入 Spring/Redis 依赖，可被任意 Java 程序引用 |
| 存储可注入 | SeqStore 接口，id-generator 提供 MemorySeqStore，devops-utils 提供 RedisSeqStore |
| 前后端一致 | 段模型、格式化、校验、溢出策略、类别预设与前端 TS 引擎逐一对齐 |
| 原子递增 | RedisSeqStore 用 Lua 脚本保证 exists + incr 原子性 |

## 段类型

与前端一致，5 种段类型：static / date / sequence / field / random。

### sequence 段参数

| 参数 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `length` | Integer | — | 位数（必填） |
| `radix` | Integer | 10 | 进制 2-62 |
| `fillChar` | String | "0" | 填充字符 |
| `fillSide` | String | "left" | 填充方向 left/right |
| `start` | Long | 1 | 起始值 |
| `minValue` | Long | start | 数值下限 |
| `maxValue` | Long | radix^length - 1 | 数值上限 |
| `overflowStrategy` | String | "reset" | 溢出策略 reset/error/expand |
| `seqKey` | String | 命名空间 | 序列键 |

溢出判断用 BigInteger 精确计算，避免大进制大位数溢出。

## 类别预设

内置 6 个类别：serial / student / workorder / order / contract / invoice。

```java
// 按类别生成
WorkorderGenerateResult result = WorkorderCategoryPresets.generateByCategory("student", null, context);

// 覆盖预设
WorkorderConfig overrides = new WorkorderConfig();
overrides.setSeparator("-");
WorkorderGenerateResult result2 = WorkorderCategoryPresets.generateByCategory("workorder", overrides, context);

// 注册自定义类别
WorkorderCategoryPresets.register("device", config);
```

## Redis 存储实现（RedisSeqStore）

- 键前缀：`workorder:seq:{seqKey}`
- `next(key, start)`：Lua 脚本原子操作——键不存在则 SET start 返回 start，键存在则 INCR 返回递增值。
- `get/set/reset`：直接操作 Redis 原始字节，绕过 Jackson 序列化器，确保数值为纯字符串。

Lua 脚本：

```lua
if redis.call('exists', KEYS[1]) == 0 then
  redis.call('set', KEYS[1], ARGV[1])
  return tonumber(ARGV[1])
else
  return redis.call('incr', KEYS[1])
end
```

## REST 接口

### POST /idGenerate/generate

按配置生成单号。

请求体：

```json
{
  "config": {
    "segments": [
      { "type": "static", "value": "WO" },
      { "type": "date", "format": "YYYYMMDD" },
      { "type": "sequence", "length": 4, "radix": 10, "fillChar": "0", "fillSide": "left" }
    ],
    "seqNamespace": "workorder"
  },
  "fields": { "deptCode": "A01" },
  "useRedis": true
}
```

响应：

```json
{
  "data": {
    "success": true,
    "value": "WO202609120001",
    "segments": [...],
    "sequenceValues": { "workorder": 1 },
    "warnings": []
  },
  "code": 200,
  "message": "OK",
  "cnMessage": "操作成功"
}
```

### POST /idGenerate/generateByCategory

按类别预设生成单号，`config` 字段可覆盖预设规则。

```json
{
  "category": "student",
  "fields": { "deptCode": "CS" },
  "useRedis": true
}
```

### GET /idGenerate/categories

列出所有已注册类别预设。

```json
{
  "data": ["serial", "student", "workorder", "order", "contract", "invoice"],
  "code": 200
}
```

### POST /idGenerate/registerCategory

注册自定义类别预设。

```json
{
  "category": "device",
  "config": {
    "segments": [
      { "type": "static", "value": "DEV" },
      { "type": "date", "format": "YYYYMMDD" },
      { "type": "sequence", "length": 5, "radix": 10, "fillChar": "0", "fillSide": "left" }
    ],
    "seqNamespace": "device"
  }
}
```

## 直接调用（不经过 HTTP）

```java
// 内存存储
WorkorderConfig config = new WorkorderConfig();
config.setSegments(List.of(...));
WorkorderContext context = new WorkorderContext();
context.setStorage(new MemorySeqStore());
WorkorderGenerateResult result = new WorkorderGenerator(config).generate(context);

// Redis 存储（Spring 环境注入）
@Resource
private RedisSeqStore redisSeqStore;

WorkorderContext ctx = new WorkorderContext();
ctx.setStorage(redisSeqStore);
WorkorderGenerateResult r = WorkorderCategoryPresets.generateByCategory("workorder", null, ctx);
```

## 溢出策略与存储同步

| 策略 | 存储操作 | 说明 |
| --- | --- | --- |
| `reset` | `storage.set(seqKey, usedSeq)` | 回到 start 重新计数 |
| `error` | `storage.set(seqKey, seq - 1)` | 回滚不消耗序号，生成失败 |
| `expand` | 无 | 保持递增，原样输出 |

前后端均按此规则处理，确保存储状态一致。