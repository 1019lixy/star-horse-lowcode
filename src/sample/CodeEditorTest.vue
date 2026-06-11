<script setup lang="ts" name="CodeEditorTest">
import {ref} from "vue";
import {StarHorseCodeEditor} from "@/components/system";

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

const readOnly = ref(false);

const handleChange = (val: string) => {
  console.log("[CodeEditorTest] onChange, length:", val.length);
};
</script>

<template>
  <div class="flex flex-col h-full p-4 gap-4">
    <StarHorseCodeEditor
        :api="{
               loadUrl: '/userdb-manage/code/codeFiles/load',
               saveUrl: '/userdb-manage/code/codeFiles/save',
               moduleListUrl: '/userdb-manage/code/codeModules/list',
               createModuleUrl: '/userdb-manage/code/codeModules/create',
               lspServerUrl:'ws://localhost:8900/language-server',
              }"
        v-model:value="javaCode"
        language="java"
        file-path="/src/main/java/com/example/demo/DemoController.java"
        :read-only="readOnly"
        box-height="100%"
        @change="handleChange"
    />
  </div>
</template>

<style lang="scss" scoped>
</style>
