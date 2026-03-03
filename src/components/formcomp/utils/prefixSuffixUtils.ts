import { computed, ref, watch, type ComputedRef, type Ref } from "vue";
import { convertData } from "./ItemRelationEventUtils";

export interface PrefixSuffixOptions {
  field: any;
  formData: Ref<any>;
  mergePrefix?: boolean;
  mergeAppend?: boolean;
}

export interface PrefixSuffixResult {
  preName: ComputedRef<string>;
  appName: ComputedRef<string>;
  prependList: ComputedRef<any[]>;
  appendList: ComputedRef<any[]>;
  normalData: Ref<string>;
  findMatchingPrefix: (mainValue: string) => string;
  findMatchingSuffix: (mainValue: string) => string;
  parseMainValue: () => string;
  extractPrefixFromInput: (inputValue: string) => {
    prefix: string;
    remaining: string;
  };
  extractSuffixFromInput: (inputValue: string) => {
    suffix: string;
    remaining: string;
  };
  mergeData: (isParsing?: boolean) => void;
  setupWatchers: () => void;
}

export const usePrefixSuffix = (
  options: PrefixSuffixOptions,
): PrefixSuffixResult => {
  const { field, formData, mergePrefix, mergeAppend } = options;

  const normalData = ref<string>("");

  const preName = computed(() => {
    return field?.preps?.preName ?? "pre" + field.fieldName;
  });

  const appName = computed(() => {
    return field?.preps?.appName ?? "app" + field.fieldName;
  });

  const appendList = computed(() => convertData(field?.preps?.appendList));
  const prependList = computed(() => convertData(field?.preps?.prependList));

  const shouldMergePrefix = computed(
    () => mergePrefix ?? field?.preps?.mergePrefix,
  );
  const shouldMergeAppend = computed(
    () => mergeAppend ?? field?.preps?.mergeAppend,
  );

  const findMatchingPrefix = (mainValue: string): string => {
    if (formData.value[preName.value]) {
      return formData.value[preName.value];
    }

    if (prependList.value && prependList.value.length > 0) {
      for (const item of prependList.value) {
        const itemValue = item.value || "";
        if (mainValue.startsWith(itemValue)) {
          formData.value[preName.value] = itemValue;
          return itemValue;
        }
      }
    }

    return "";
  };

  const findMatchingSuffix = (mainValue: string): string => {
    if (formData.value[appName.value]) {
      return formData.value[appName.value];
    }

    if (appendList.value && appendList.value.length > 0) {
      for (const item of appendList.value) {
        const itemValue = item.value || "";
        if (mainValue.endsWith(itemValue)) {
          formData.value[appName.value] = itemValue;
          return itemValue;
        }
      }
    }

    return "";
  };

  const parseMainValue = (): string => {
    const mainValue = formData.value[field.fieldName] || "";
    let parsedValue = String(mainValue);

    if (shouldMergePrefix.value) {
      const prefixValue = findMatchingPrefix(parsedValue);
      if (prefixValue && parsedValue.startsWith(prefixValue)) {
        parsedValue = parsedValue.slice(prefixValue.length);
      }
    }

    if (shouldMergeAppend.value) {
      const suffixValue = findMatchingSuffix(parsedValue);
      if (suffixValue && parsedValue.endsWith(suffixValue)) {
        parsedValue = parsedValue.slice(0, -suffixValue.length);
      }
    }

    return parsedValue;
  };

  const extractPrefixFromInput = (
    inputValue: string,
  ): { prefix: string; remaining: string } => {
    if (
      shouldMergePrefix.value &&
      prependList.value &&
      prependList.value.length > 0
    ) {
      for (const item of prependList.value) {
        const itemValue = item.value || "";
        if (itemValue && inputValue.startsWith(itemValue)) {
          return {
            prefix: itemValue,
            remaining: inputValue.slice(itemValue.length),
          };
        }
      }
    }
    return { prefix: "", remaining: inputValue };
  };

  const extractSuffixFromInput = (
    inputValue: string,
  ): { suffix: string; remaining: string } => {
    if (
      shouldMergeAppend.value &&
      appendList.value &&
      appendList.value.length > 0
    ) {
      for (const item of appendList.value) {
        const itemValue = item.value || "";
        if (itemValue && inputValue.endsWith(itemValue)) {
          return {
            suffix: itemValue,
            remaining: inputValue.slice(0, -itemValue.length),
          };
        }
      }
    }
    return { suffix: "", remaining: inputValue };
  };

  const mergeData = (isParsing = false) => {
    let baseValue = isParsing ? parseMainValue() : normalData.value || "";

    if (isParsing) {
      normalData.value = baseValue;
      return;
    }

    let cleanValue = baseValue;

    if (
      shouldMergePrefix.value &&
      prependList.value &&
      prependList.value.length > 0
    ) {
      const { prefix, remaining } = extractPrefixFromInput(cleanValue);
      if (prefix) {
        formData.value[preName.value] = prefix;
        cleanValue = remaining;
      }
    }

    if (
      shouldMergeAppend.value &&
      appendList.value &&
      appendList.value.length > 0
    ) {
      const { suffix, remaining } = extractSuffixFromInput(cleanValue);
      if (suffix) {
        formData.value[appName.value] = suffix;
        cleanValue = remaining;
      }
    }

    if (normalData.value !== cleanValue) {
      normalData.value = cleanValue;
      return;
    }

    let mergedValue = cleanValue;

    if (shouldMergePrefix.value) {
      const prefixValue = formData.value[preName.value];
      if (prefixValue) {
        mergedValue = prefixValue + mergedValue;
      }
    }

    if (shouldMergeAppend.value) {
      const suffixValue = formData.value[appName.value];
      if (suffixValue) {
        mergedValue = mergedValue + suffixValue;
      }
    }

    if (formData.value[field.fieldName] !== mergedValue) {
      formData.value[field.fieldName] = mergedValue;
    }

    if (!formData.value[appName.value] && field?.preps?.appendDefaultValue) {
      formData.value[appName.value] = field?.preps?.appendDefaultValue;
    }
    if (!formData.value[preName.value] && field?.preps?.prependDefaultValue) {
      formData.value[preName.value] = field?.preps?.prependDefaultValue;
    }
  };

  const setupWatchers = () => {
    watch(
      () => normalData.value,
      () => {
        mergeData();
      },
      { immediate: false },
    );

    watch(
      () => formData.value[preName.value],
      () => {
        mergeData();
      },
    );

    watch(
      () => formData.value[appName.value],
      () => {
        mergeData();
      },
    );

    watch(
      () => formData.value[field.fieldName],
      () => {
        mergeData(true);
      },
      { immediate: true },
    );

    watch([prependList, appendList], () => {
      if (
        (shouldMergePrefix.value && prependList.value.length > 0) ||
        (shouldMergeAppend.value && appendList.value.length > 0)
      ) {
        if (shouldMergePrefix.value) {
          formData.value[preName.value] = undefined;
        }
        if (shouldMergeAppend.value) {
          formData.value[appName.value] = undefined;
        }
        mergeData(true);
      }
    });
  };

  return {
    preName,
    appName,
    prependList,
    appendList,
    normalData,
    findMatchingPrefix,
    findMatchingSuffix,
    parseMainValue,
    extractPrefixFromInput,
    extractSuffixFromInput,
    mergeData,
    setupWatchers,
  };
};
