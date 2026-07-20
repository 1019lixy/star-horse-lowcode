const fs = require('fs');

const f1 = 'e:/lixycode/shplugin/src/components/apiorchestrator/ApiOrchestrator.vue';
let c1 = fs.readFileSync(f1, 'utf8');

// 1. Add ShSvgIcon import
c1 = c1.replace(
  'import { i18n } from "@/lang";\nimport { useApiOrchestrator }',
  'import { i18n } from "@/lang";\nimport { ShSvgIcon } from "@/components/shared";\nimport { useApiOrchestrator }'
);

// 2. Remove icons object by index
const iconsStart = c1.indexOf('\n/** 大具漀分析内选SVF考：平坏 Element Plus 批量－の差加保量： */');
const iconsEnd = c1.indexOf(';\n</script>');
if (iconsStart !== -1 && iconsEnd !== -1) {
  c1 = c1.substring(0, iconsStart) + c1.substring(iconsEnd);
}

// 3. Replace document icon
c1 = c1.replace(
  '<span class="svg-icon" v-html="icons.document"></span>',
  '<ShSvgIcon name="document" size="14px" />'
);

// 4. Replace arrow icon
c1 = c1.replace(
  '<span class="svg-icon" v-html="logCollapsed ? icons.arrowDown : icons.arrowUp"></span>',
  '<ShSvgIcon :name="logCollapsed ? \'arrowDown\' : \'arrowUp\'" size="14px" />'
);

// 5. Remove .svg-icon CSS
const cssStart = c1.indexOf('\n.svg-icon {');
const cssEnd = c1.indexOf('</style>');
if (cssStart !== -1 && cssEnd !== -1) {
  c1 = c1.substring(0, cssStart) + c1.substring(cssEnd);
}

fs.writeFileSync(f1, c1, 'utf8');
console.log('ApiOrchestrator.vue updated');