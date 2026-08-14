<script setup lang="ts">
import {
  getDataIndex,
  getFormData,
  getPrefix,
} from "@/api/form_utils";

import StarHorseFormItem from "@/components/comp/StarHorseFormItem.vue";
import { ContainerPreps } from "@/components/types/ItemPreps";
import { initRelationEvent } from "@/components/formcomp/utils/ItemRelationEventUtils";
import {
  computed,
  inject,
  ModelRef,
  nextTick,
  onMounted,
  onBeforeUnmount,
  ref,
  unref,
  watch,
} from "vue";
import { i18n } from "@/lang";

const props = withDefaults(defineProps<ContainerPreps>(), {
  dataIndex: -1,
  propPrefix: "",
  parentPreps: {},
  subFormFlag: "N",
  subTableName: "subDataList",
  compSize: "default",
  source: 1,
});
const emits = defineEmits(["addRow", "removeRow"]);
const dataForm: ModelRef<any> = defineModel("dataForm");
const formFields = inject("formFields", ref<any[]>([]));

const addRow = (row: any) => emits("addRow", row);
const removeRow = (row: any) => emits("removeRow", row);

const contentRef = ref<HTMLElement>();
const activeSection = ref("");
const sectionRefs = ref<Record<string, HTMLElement>>({});

const anchorList = computed(() => props.item?.containerFields || []);

const anchorLinks = computed(() =>
  anchorList.value.map((el: any, idx: number) => ({
    title:
      el.anchorTitle ||
      el.label ||
      el.title ||
      `${i18n("dyform.container.anchorSection")} ${idx + 1}`,
    href: el.anchorHref || `#anchor-${el.subTableName}-${idx}`,
    icon: el.anchorIcon || "",
    disabled: el.anchorDisabled === true || el.anchorDisabled === "true",
    index: idx,
  })),
);

const showNavTitle = computed(() => props.item?.preps?.showNavTitle !== false);
const navWidth = computed(() => `${props.item?.preps?.navWidth || 200}px`);
const navPosition = computed(() => props.item?.preps?.navPosition || "top");
const placement = computed(() => props.item?.preps?.placement || "right");
const showSectionNumber = computed(
  () => props.item?.preps?.showSectionNumber === true,
);
const smoothScroll = computed(() => props.item?.preps?.smoothScroll !== false);
const scrollOffset = computed(() => Number(props.item?.preps?.scrollOffset) || 60);
const stickyOffset = computed(() => Number(props.item?.preps?.stickyOffset) || 0);
const highlightColor = computed(() => props.item?.preps?.highlightColor || "");
const contentMaxHeight = computed(
  () => props.item?.preps?.contentMaxHeight || "70vh",
);

const navFixedStyle = computed(() => {
  const style: Record<string, string> = {
    width: navWidth.value,
    flexShrink: "0",
    alignSelf: "flex-start",
  };
  const offset = stickyOffset.value;
  if (navPosition.value === "top") {
    style.position = "sticky";
    style.top = `${offset + 20}px`;
  } else if (navPosition.value === "center") {
    style.position = "sticky";
    style.top = "50%";
    style.transform = "translateY(-50%)";
  } else {
    style.position = "sticky";
    style.bottom = "20px";
    style.alignSelf = "flex-end";
  }
  return style;
});

const contentPaddingStyle = computed(() => {
  const style: Record<string, string> = {};
  if (placement.value === "left") {
    style.order = "2";
  } else {
    style.order = "1";
  }
  return style;
});

const navOrderStyle = computed(() => {
  if (placement.value === "left") return {order: "1"};
  return {order: "2"};
});

const scrollToSection = (href: string, disabled?: boolean) => {
  if (disabled) return;
  console.log("scrollToSection", href);
  const el = sectionRefs.value[href];
  if (el && contentRef.value) {
    const offset = Number(props.item?.preps?.offset) || 0;
    const containerRect = contentRef.value.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    const relativeTop = elRect.top - containerRect.top;
    const top = contentRef.value.scrollTop + relativeTop - offset;
    contentRef.value.scrollTo({
      top: Math.max(0, top),
      behavior: smoothScroll.value ? "smooth" : "auto",
    });
    activeSection.value = href;
  }
};

const handleScroll = () => {
  if (!contentRef.value) return;
  const containerRect = contentRef.value.getBoundingClientRect();
  let current = "";
  let minDistance = Infinity;
  anchorList.value.forEach((anchor: any, i: number) => {
    const href = `#anchor-${anchor.subTableName}-${i}`;
    const el = sectionRefs.value[href];
    if (el) {
      const elRect = el.getBoundingClientRect();
      const relativeTop = elRect.top - containerRect.top;
      if (relativeTop - scrollOffset.value <= 0) {
        current = href;
      }
      const distance = Math.abs(relativeTop - scrollOffset.value);
      if (distance < minDistance) {
        minDistance = distance;
      }
    }
  });
  activeSection.value = current;
};

const setSectionRef = (href: string, el: any) => {
  if (el) sectionRefs.value[href] = el;
};

const reTriggerRelation = (fields: any[], visited?: WeakSet<any>) => {
  if (!Array.isArray(fields)) return;
  if (!visited) visited = new WeakSet();
  fields.forEach((field: any) => {
    if (Array.isArray(field)) {
      reTriggerRelation(field, visited);
    } else if (field == null || typeof field !== "object") {
      return;
    } else if (visited.has(field)) {
      return;
    } else {
      visited.add(field);
      if (field?.preps?.dataRelation?.actionName) {
        const formInfoVal = unref(formFields);
        initRelationEvent({ field, formInfo: formInfoVal }, dataForm, true);
      }
    }
  });
};

watch(
  () =>
    Array.isArray(anchorList.value)
      ? anchorList.value.map((c: any) => c?.formVisible)
      : [],
  (newVals, oldVals) => {
    if (!Array.isArray(anchorList.value)) return;
    anchorList.value.forEach((child: any, index: number) => {
      if (child == null) return;
      const wasVisible = oldVals?.[index] !== false;
      const isVisible = newVals?.[index] !== false;
      if (!wasVisible && isVisible) {
        nextTick(() => reTriggerRelation(child.fieldList));
      }
    });
  },
  { deep: true, immediate: true },
);

onMounted(() => {
  nextTick(() => {
    contentRef.value?.addEventListener("scroll", handleScroll);
    handleScroll();
  });
});

onBeforeUnmount(() => {
  contentRef.value?.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <div
    v-if="anchorList.length > 0"
    class="anchor-layout"
    :style="{
      '--anchor-highlight-color': highlightColor,
      '--anchor-content-max-height': contentMaxHeight,
    }"
  >
    <div class="anchor-content" ref="contentRef" :style="contentPaddingStyle">
      <template v-for="(anchorItem, idx) in anchorList" :key="idx">
        <div
          v-if="anchorItem.formVisible !== false"
          :ref="(el) => setSectionRef(`#anchor-${anchorItem.subTableName}-${idx}`, el)"
          class="anchor-section"
        >
          <div class="section-title-bar">
            <span v-if="showSectionNumber" class="section-dot">{{
              idx + 1
            }}</span>
            <span class="section-name">{{
              anchorItem.anchorTitle ||
              anchorItem.label ||
              anchorItem.title ||
              i18n("dyform.container.anchorSection") + " " + (idx + 1)
            }}</span>
          </div>
          <div class="section-items">
            <star-horse-form-item
              :source="source"
              :compUrl="compUrl"
              :compSize="compSize"
              :commonFormat="commonFormat"
              :dataForm="
                getFormData(
                  anchorItem,
                  dataForm,
                  propPrefix,
                  dataIndex,
                  item.groupData ? idx : 0,
                )
              "
              :dataIndex="
                getDataIndex(
                  anchorItem,
                  propPrefix,
                  dataIndex,
                  item.groupData ? idx : 0,
                )
              "
              :propPrefix="
                getPrefix(
                  anchorItem,
                  propPrefix,
                  dataIndex,
                  item.groupData ? idx : 0,
                )
              "
              :subTableName="anchorItem.subTableName"
              @addRow="addRow"
              @removeRow="removeRow"
              :fieldList="anchorItem"
              :rules="rules"
              :subFormFlag="anchorItem.subFormFlag"
              :enableSubNode="anchorItem.enableSubNode"
              :primaryKey="primaryKey"
            />
          </div>
        </div>
      </template>
    </div>
    <div class="anchor-nav" :style="[navFixedStyle, navOrderStyle]">
      <div v-if="showNavTitle" class="anchor-nav-title">
        <span>{{ i18n("dyform.container.anchorNavTitle") }}</span>
      </div>
      <div class="anchor-nav-list">
        <a
          v-for="link in anchorLinks"
          :key="link.href"
          :class="[
            'anchor-link',
            { active: activeSection === link.href, disabled: link.disabled },
          ]"
          @click.prevent="scrollToSection(link.href, link.disabled)"
        >
          <span class="link-dot"></span>
          <span class="link-text">{{ link.title }}</span>
        </a>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.anchor-layout {
  display: flex;
  gap: 16px;
  width: 100%;
  position: relative;
}

.anchor-content {
  flex: 1;
  max-height: var(--anchor-content-max-height, 70vh);
  overflow-y: auto;
  scroll-behavior: smooth;
}

.anchor-section {
  margin-bottom: 24px;
  scroll-margin-top: 20px;
}



.section-items {
  padding: 0 12px;
}

.anchor-nav {

  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  max-height: 80vh;
  overflow-y: auto;
}

.anchor-nav-title {
  display: flex;
  align-items: center;
  gap: 4px;
  padding-bottom: 8px;
  margin-bottom: 8px;
  border-bottom: 1px solid #ebeef5;
  font-size: 13px;
  font-weight: 600;
  color: #303133;
}

.anchor-nav-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.anchor-link {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  color: #606266;
  font-size: 13px;

  .link-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #c0c4cc;
    transition: all 0.2s ease;
    flex-shrink: 0;
  }

  &:hover {
    background: #ecf5ff;
    color: var(--star-horse-style, #409eff);

    .link-dot {
      background: var(--star-horse-style, #409eff);
    }
  }

  &.active {
    background: var(
      --anchor-highlight-color,
      var(--star-horse-style, #409eff)
    );
    color: #fff;
    font-weight: 500;

    .link-dot {
      background: #fff;
      transform: scale(1.3);
    }
  }

  &.disabled {
    cursor: not-allowed;
    opacity: 0.5;
    pointer-events: none;
  }
}
</style>
