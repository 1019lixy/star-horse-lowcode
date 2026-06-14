<script setup lang="ts" name="CodeEditorTest">
import {ref} from "vue";
import {StarHorseCodeEditor} from "@/components/system";

const readOnly = ref(false);

const handleChange = (val: string) => {
  console.log("[CodeEditorTest] onChange, length:", val.length);
};

/**
 * 后端接口完整配置 - 与后端 Controller 注解一一对应
 *
 * CodeFilesController     /code/codeFiles
 *   POST /load           加载代码文件树
 *   POST /save           保存代码文件树
 *
 * CodeModulesController   /code/codeModules
 *   GET  /list           获取所有代码模块列表
 *   POST /create         创建新模块
 *
 * DynamicCodeController   /dynamic/code
 *   POST /compileOnly    仅编译（不注册）
 *   POST /run            运行代码
 *   POST /compile        编译并注册为Spring Bean
 *   POST /execute        执行指定Bean方法
 *   POST /templateList   获取模板列表
 *   POST /loadTemplate   加载指定模板代码
 *   POST /unregister/{beanName}  注销指定Bean
 *   POST /unregisterAll  注销全部Bean
 *   GET  /registered     已注册Bean列表
 *   GET  /source/{beanName} 获取Bean源码
 *   GET  /healthCheck    健康检查
 *   POST /draft          保存草稿
 *   GET  /draft/list     草稿列表
 *   GET  /draft/{beanName} 获取草稿源码
 */
const apiConfig = {
  // ===== CodeFilesController: /code/codeFiles =====
  /** POST /code/codeFiles/load - 加载代码文件树 */
  loadUrl: "/userdb-manage/code/codeFiles/load",
  /** POST /code/codeFiles/save - 保存代码文件树 */
  saveUrl: "/userdb-manage/code/codeFiles/save",

  // ===== CodeModulesController: /code/codeModules =====
  /** GET /code/codeModules/list - 获取所有代码模块列表 */
  moduleListUrl: "/userdb-manage/code/codeModules/list",
  /** POST /code/codeModules/create - 创建新模块 */
  createModuleUrl: "/userdb-manage/code/codeModules/create",

  // ===== DynamicCodeController: /dynamic/code - 编译运行 =====
  /** POST /dynamic/code/compileOnly - 仅编译（不注册） */
  compileUrl: "/userdb-manage/dynamic/code/compileOnly",
  /** POST /dynamic/code/run - 运行代码 */
  runUrl: "/userdb-manage/dynamic/code/run",
  /** POST /dynamic/code/compile - 编译并发布（注册为Bean） */
  compileRegisterUrl: "/userdb-manage/dynamic/code/compile",
  /** POST /dynamic/code/execute - 执行方法 */
  executeUrl: "/userdb-manage/dynamic/code/execute",
  /** POST /dynamic/code/templateList - 模板列表 */
  templateUrl: "/userdb-manage/dynamic/code/templateList",
  /** POST /dynamic/code/loadTemplate - 加载模板 */
  templateLoadUrl: "/userdb-manage/dynamic/code/loadTemplate",

  // ===== DynamicCodeController: /dynamic/code - Bean管理 =====
  /** POST /dynamic/code/unregister/{beanName} - 注销Bean */
  unregisterUrl: "/userdb-manage/dynamic/code/unregister/{beanName}",
  /** POST /dynamic/code/unregisterAll - 注销全部Bean */
  unregisterAllUrl: "/userdb-manage/dynamic/code/unregisterAll",
  /** GET /dynamic/code/registered - 已注册Bean列表 */
  registeredListUrl: "/userdb-manage/dynamic/code/registered",
  /** GET /dynamic/code/source/{beanName} - 获取Bean源码 */
  sourceCodeUrl: "/userdb-manage/dynamic/code/source/{beanName}",
  /** GET /dynamic/code/healthCheck - 健康检查 */
  healthCheckUrl: "/userdb-manage/dynamic/code/healthCheck",

  // ===== DynamicCodeController: /dynamic/code - 草稿 =====
  /** POST /dynamic/code/draft - 保存草稿 */
  draftSaveUrl: "/userdb-manage/dynamic/code/draft",
  /** GET /dynamic/code/draft/list - 草稿列表 */
  draftListUrl: "/userdb-manage/dynamic/code/draft/list",
  /** GET /dynamic/code/draft/{beanName} - 获取草稿源码 */
  draftSourceUrl: "/userdb-manage/dynamic/code/draft/{beanName}",

  // ===== LSP =====
  lspServerUrl: "ws://localhost:8900/language-server",
};
</script>

<template>
  <div class="flex flex-col h-full p-4 gap-4">
    <StarHorseCodeEditor
        :api="apiConfig"
        :read-only="readOnly"
        box-height="100%"
        @change="handleChange"
    />
  </div>
</template>

<style lang="scss" scoped>
</style>
