const fs = require("fs");
const base = "E:/lixycode/shplugin/src/components/comp/items/";
for (const f of ["dialogItem.vue", "drawerItem.vue"]) {
  const c = fs.readFileSync(base + f, "utf8");
  const props = new Set();
  for (const m of c.matchAll(/preps\s*\?\.\s*(\w+)|preps\.(\w+)/g))
    props.add(m[1] || m[2]);
  console.log("=== " + f);
  console.log("preps: " + [...props].join(", "));
  const lines = c.split("\n");
  lines.forEach((l, i) => {
    if (/defineProps|itemType|compType|name=|boxWidth|boxHeight/.test(l) && i < 120)
      console.log((i + 1) + ": " + l.trim().slice(0, 110));
  });
}