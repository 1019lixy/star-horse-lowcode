import {createRouter, createWebHashHistory, RouteRecordRaw} from "vue-router";
import ComplexFormValid from "@/sample/ComplexFormValid.vue";
import DytableContainerInstanceValid from "@/sample/DytableContainerInstanceValid.vue";
import {closeLoad, load} from "@/api/star_horse_utils";

const routes: RouteRecordRaw[] = [
    {
        path: "/",
        redirect: "/dashboard",
    },
    {
        path: "/dashboard",
        name: "dashboard",
        component: () => import("@/sample/Dashboard.vue"),
        meta: {title: "首页"},
        children: [
            {
                path: "/general/page/:param",
                name: "NormalPage",
                component: () => import("@/sample/commonpage/NormalPage.vue"),
                props: true,
                meta: {
                    title: "动态表单实例",
                    menuIcon: "position",
                    keepAlive: "N",
                },
            },
        ]
    },
    {
        path: "/complex-form-valid",
        name: "complex-form-valid",
        component: ComplexFormValid,
        meta: {title: "复杂表单验证"},
    },
    {
        path: "/dytable-container-instance-valid",
        name: "dytable-container-instance-valid",
        component: DytableContainerInstanceValid,
        meta: {title: "动态表格容器实例验证"},
    },
    {
        path: "/complex-form-analysis",
        name: "complex-form-analysis",
        component: () => import("@/sample/FormValid.vue"),
        meta: {title: "复杂表单分析"},
    },
    {
        path: "/dytable-container-view-valid",
        name: "dytable-container-view-valid",
        component: () => import("@/sample/DytableContainerViewValid.vue"),
        meta: {title: "动态表格容器视图验证"},
    },
    {
        path: "/box-container-view-demo",
        name: "box-container-view-demo",
        component: () => import("@/sample/BoxContainerViewDemo.vue"),
        meta: {title: "盒子容器视图演示"},
    },
    {
        path: "/image-preview-test",
        name: "image-preview-test",
        component: () => import("@/sample/ImagePreviewTest.vue"),
        meta: {title: "图片预览测试"},
    },
    {
        path: "/complex-form-valid",
        name: "complex-form-valid",
        component: () => import("@/sample/ComplexFormValid.vue"),
        meta: {title: "复杂表单验证"},
    },
    {
        path: "/:pathMatch(.*)*",
        name: "not-found",
        component: () => import("@/views/NotFound.vue"),
        meta: {title: "404"},
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;
