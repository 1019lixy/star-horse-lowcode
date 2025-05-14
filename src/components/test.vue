<template>
  <div class="resume-container">
    <!-- 优化后的个人信息 -->
    <div class="section">
      <h2>个人信息</h2>
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">姓　　名</span>
          <span class="info-content">{{ personalInfo.name }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">性　　别</span>
          <span class="info-content">{{ personalInfo.gender }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">年　　龄</span>
          <span class="info-content">{{ personalInfo.age }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">出生年月</span>
          <span class="info-content">{{ personalInfo.birthDate }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">工作年限</span>
          <span class="info-content">{{ personalInfo.workYears }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">电子邮箱</span>
          <span class="info-content">{{ personalInfo.email }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">联系电话</span>
          <span class="info-content">{{ personalInfo.phone }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">微　　信</span>
          <span class="info-content">{{ personalInfo.weChat }}</span>
        </div>
        <div class="info-item full-width">
          <span class="info-label">现居地址</span>
          <span class="info-content">{{ personalInfo.address }}</span>
        </div>
      </div>
    </div>

    <!-- 其他模块保持不变 -->
  </div>
  <div class="experience-section">
    <!-- 模块标题 -->
    <h3 class="section-title">
      <i class="icon-briefcase"></i>
      工作经历
    </h3>

    <!-- 经历时间轴 -->
    <div class="timeline">
      <!-- 单条经历卡片 -->
      <div v-for="(exp, index) in reversedExperiences" 
           :key="index" 
           class="experience-card"
           :class="{ 'highlight': exp.isCurrent }">
        
        <!-- 企业信息区块 -->
        <div class="company-header">
          <span class="company-name">{{ exp.company }}</span>
          <span class="duration">{{ exp.duration }}</span>
          <tag class="industry-tag">{{ exp.industry }}</tag>
        </div>

        <!-- 职位核心信息 -->
        <div class="position-info">
          <span class="position-title">{{ exp.position }}</span>
          <span class="position-level">{{ exp.level }}</span>
          <span class="report-line">汇报对象: {{ exp.reportTo }}</span>
        </div>

        <!-- 经历详情（可折叠） -->
        <div class="experience-details">
          <!-- 核心成果 -->
          <div class="achievements-grid">
            <div class="grid-item" v-for="(achv, idx) in exp.achievements" :key="idx">
              <div class="metric">{{ achv.metric }}</div>
              <div class="description">{{ achv.description }}</div>
            </div>
          </div>

          <!-- 工作职责 -->
          <collapse-panel title="主要职责">
            <ul class="responsibilities">
              <li v-for="(resp, i) in exp.responsibilities" :key="i">
                {{ resp }}
                <tech-tag v-for="(tech, t) in exp.technologies" 
                         :key="t" 
                         :name="tech"/>
              </li>
            </ul>
          </collapse-panel>

          <!-- 项目样例 -->
          <div class="project-showcase" v-if="exp.projects">
            <h4>重点项目</h4>
            <div class="project-grid">
              <project-card v-for="(proj, p) in exp.projects" 
                          :key="p" 
                          :data="proj"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    reversedExperiences() {
      return [...this.experiences].reverse()
    }
  },
  data() {
    return {
      experiences: [
        {
          company: "字节跳动",
          duration: "2023.03-至今",
          isCurrent: true,
          industry: "互联网",
          position: "高级前端工程师",
          level: "P6",
          reportTo: "技术总监",
          achievements: [
            { 
              metric: "性能提升40%", 
              description: "通过Webpack优化构建速度" 
            },
            {
              metric: "用户增长25%",
              description: "主导新版用户中心开发"
            }
          ],
          responsibilities: [
            "负责核心业务模块架构设计",
            "主导技术方案评审与实施",
            "培养3名中级工程师成长"
          ],
          technologies: ["Vue3", "TypeScript", "Node.js"],
          projects: [
            {
              name: "直播中台系统",
              role: "技术负责人",
              impact: "支撑日均千万级流量"
            }
          ]
        }
      ],

      personalInfo: {
        name: "张三",
        gender: "男",
        age: 28,
        birthDate: "1995年3月",
        workYears: "5年",
        email: "zhangsan@email.com",
        phone: "138-1234-5678",
        weChat: "zhangsan123",
        address: "北京市朝阳区"
      },
      // 其他数据保持不变
    }
  }
}
</script>

<style scoped>
/* 新增个人信息样式 */
.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px 30px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.info-item {
  display: flex;
  align-items: center;
  min-height: 35px;
}

.info-item.full-width {
  grid-column: 1 / -1;
}

.info-label {
  flex: 0 0 100px;
  color: #666;
  font-weight: 500;
  position: relative;
  padding-right: 10px;
}

.info-label::after {
  content: "：";
  position: absolute;
  right: 5px;
}

.info-content {
  flex: 1;
  color: #333;
  border-bottom: 1px solid #eee;
  padding: 8px 0;
}
/* 时间轴样式 */
.timeline {
  border-left: 3px solid #3498db;
  margin-left: 20px;
}

.experience-card {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin: 20px 0;
  padding: 20px;
  border-radius: 8px;
  transition: transform 0.3s;
}

.company-header {
  display: flex;
  align-items: baseline;
  gap: 15px;
  margin-bottom: 15px;
}

.company-name {
  font-size: 1.2em;
  font-weight: 600;
  color: #2c3e50;
}

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin: 20px 0;
}

.metric {
  font-size: 1.4em;
  color: #e74c3c;
  font-weight: 500;
}

.responsibilities li {
  position: relative;
  padding-left: 20px;
  margin: 8px 0;
}

.responsibilities li::before {
  content: "▹";
  position: absolute;
  left: 0;
  color: #3498db;
}

.highlight {
  border-left: 3px solid #e74c3c;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .company-header {
    flex-wrap: wrap;
  }
  
  .achievements-grid {
    grid-template-columns: 1fr;
  }
}
/* 保持其他原有样式不变 */
</style>

