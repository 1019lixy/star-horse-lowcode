<script setup lang="ts" name="CodeEditorTest">
import { ref } from "vue";
import { StarHorseCodeEditor } from "@/components/system";

const javaCode = ref(`package com.example.demo;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.ArrayList;

@RestController
@RequestMapping("/api")
public class DemoController {

    @Autowired
    private DemoService demoService;

    @GetMapping("/users")
    public List<User> getUsers() {
        return demoService.findAll();
    }

    @PostMapping("/user")
    public User createUser(@RequestBody User user) {
        return demoService.save(user);
    }
}
`);

const csharpCode = ref(`using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;

namespace DemoApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DemoController : ControllerBase
{
    private readonly IDemoService _demoService;

    public DemoController(IDemoService demoService)
    {
        _demoService = demoService;
    }

    [HttpGet("users")]
    public async Task<ActionResult<List<User>>> GetUsers()
    {
        var users = await _demoService.GetAllAsync();
        return Ok(users);
    }

    [HttpPost("user")]
    public async Task<ActionResult<User>> CreateUser([FromBody] User user)
    {
        var created = await _demoService.CreateAsync(user);
        return CreatedAtAction(nameof(GetUsers), created);
    }
}
`);

const cppCode = ref(`#include <iostream>
#include <vector>
#include <string>
#include <memory>
#include <algorithm>

class User {
private:
    std::string name_;
    int age_;
public:
    User(const std::string& name, int age) : name_(name), age_(age) {}

    const std::string& getName() const { return name_; }
    int getAge() const { return age_; }

    void print() const {
        std::cout << "User: " << name_ << ", Age: " << age_ << std::endl;
    }
};

int main() {
    std::vector<std::shared_ptr<User>> users;
    users.push_back(std::make_shared<User>("Alice", 30));
    users.push_back(std::make_shared<User>("Bob", 25));

    std::sort(users.begin(), users.end(),
        [](const auto& a, const auto& b) {
            return a->getAge() < b->getAge();
        });

    for (const auto& user : users) {
        user->print();
    }

    return 0;
}
`);

const actName = ref("java");
const lspUrl = ref("ws://localhost:8900/language-server");
const readOnly = ref(false);

const handleChange = (val: string) => {
  console.log("[CodeEditorTest] onChange, length:", val.length);
};
</script>

<template>
  <div class="flex flex-col h-full p-4 gap-4">
    <div class="text-lg font-bold">StarHorseCodeEditor 测试</div>

    <!-- 配置区 -->
    <div class="flex items-center gap-4 flex-wrap">
      <div class="flex items-center gap-2">
        <span class="text-sm">LSP Server:</span>
        <el-input v-model="lspUrl" placeholder="ws://localhost:8900/language-server" style="width: 250px" size="small" />
      </div>
      <el-checkbox v-model="readOnly">只读模式</el-checkbox>
    </div>

    <!-- 语言Tab - 使用lazy延迟加载，避免同时创建3个Monaco编辑器 -->
    <el-tabs v-model="actName" class="flex-1">
      <el-tab-pane label="Java" name="java" lazy>
        <div class="h-full">
          <StarHorseCodeEditor
load-url="/userdb/codeModule/load"
  save-url="/userdb/codeModule/save"
  module-list-url="/userdb/codeModule/list"
  create-module-url="/userdb/codeModule/create"
            v-model:value="javaCode"
            language="java"
            :lsp-server-url="lspUrl"
            file-path="/src/main/java/com/example/demo/DemoController.java"
            :read-only="readOnly"
            box-height="100%"
            @change="handleChange"
          />
        </div>
      </el-tab-pane>

      <el-tab-pane label="C#" name="csharp" lazy>
        <div class="h-full">
          <StarHorseCodeEditor
            v-model:value="csharpCode"
            language="csharp"
            :lsp-server-url="lspUrl"
            file-path="/project/Controllers/DemoController.cs"
            :read-only="readOnly"
            box-height="100%"
            @change="handleChange"
          />
        </div>
      </el-tab-pane>

      <el-tab-pane label="C++" name="cpp" lazy>
        <div class="h-full">
          <StarHorseCodeEditor
            v-model:value="cppCode"
            language="cpp"
            :lsp-server-url="lspUrl"
            file-path="/project/src/main.cpp"
            :read-only="readOnly"
            box-height="100%"
            @change="handleChange"
          />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style lang="scss" scoped>
</style>
