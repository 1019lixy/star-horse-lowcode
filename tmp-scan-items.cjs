const fs = require("fs");
const path = require("path");
const dir = path.join(__dirname, "src/components/formcomp/items");
const files = fs
  .readdirSync(dir)
  .filter((f) => f.endsWith(".vue"))
  .sort();
for (const f of files) {
  const c = fs.readFileSync(path.join(dir, f), "utf8");
  const props = new Set();
  for (const m of c.matchAll(/preps\s*\?\.\s*(\w+)|preps\.(\w+)/g)) {
    props.add(m[1] || m[2]);
  }
  const events = new Set();
  for (const m of c.matchAll(/emit\s*\(\s*["'](\w+)["']/g)) {
    events.add(m[1]);
  }
  const models = [];
  if (/defineModel/.test(c)) models.push("defineModel(formData)");
  const override = /getOptionsOverride|optionsOverride/i.test(c);
  const debounce = /debounce/i.test(c);
  console.log("=== " + f.replace(".vue", ""));
  console.log("preps: " + [...props].join(", "));
  console.log(
    "emits: " +
      [...events].join(", ") +
      (override ? " | optionsOverride=YES" : "") +
      (debounce ? " | debounce=YES" : ""),
  );
}