const fs = require("fs");
const path = require("path");
const dir = path.join(__dirname, "src/components/formcomp/items");
const files = fs
  .readdirSync(dir)
  .filter((f) => f.endsWith(".vue"))
  .sort();
for (const f of files) {
  const c = fs.readFileSync(path.join(dir, f), "utf8");
  const se = new Set();
  for (const m of c.matchAll(/\$emit\s*\(\s*["'](\w+)["']/g)) se.add(m[1]);
  const src = new Set();
  for (const m of c.matchAll(
    /(props\.field|field)\??\.(\w+)/g,
  )) {
    const name = m[2];
    if (
      [
        "values",
        "dataSource",
        "sourceType",
        "dataUrl",
        "dictName",
        "urlOrDictName",
        "params",
        "actions",
        "defaultValue",
        "fieldName",
        "label",
        "readonly",
        "helpMsg",
        "type",
        "itemType",
        "aliasName",
        "brotherNodes",
        "subTablePrimaryKey",
      ].includes(name)
    )
      src.add(name);
  }
  const dm = [];
  for (const m of c.matchAll(/defineModel[^)]*\)/g)) dm.push(m[0].slice(0, 60));
  const de = new Set();
  for (const m of c.matchAll(/defineEmits<[^>]*>|\(["']([\w.]+)["'][^)]*\)/g))
    if (m[1]) de.add(m[1]);
  console.log(
    "=== " +
      f.replace(".vue", "") +
      "\n$emit: " +
      [...se].join(", ") +
      "\nfield-src: " +
      [...src].join(", ") +
      "\nmodel: " +
      dm.join(" ; "),
  );
}