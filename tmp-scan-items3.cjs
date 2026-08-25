const fs = require("fs");
const rd = (p) =>
  fs.readFileSync("E:/lixycode/shplugin/src/components/formcomp/items/" + p, "utf8");
const scan = (file, re) => {
  const c = rd(file);
  c.split("\n").forEach((l, i) => {
    if (re.test(l)) console.log(file.slice(0, -4) + ":" + (i + 1) + ": " + l.trim());
  });
};
scan("cascade-item.vue", /displayName|displayValue|showFooter|preps\?\.options/);
console.log("---upload---");
scan("upload-item.vue", /action|commonFiles|context/i);
console.log("---audio---");
const a = rd("audio-item.vue").split("\n").slice(0, 40);
a.forEach((l, i) => console.log("audio:" + (i + 1) + ": " + l.trim()));
console.log("---checkbox values keys---");
scan("checkbox-item.vue", /labelKey|valueKey|props\?\.(label|value)/);
console.log("---dialogItem refs---");
const dir = "E:/lixycode/shplugin/src";
function walk(d) {
  for (const f of fs.readdirSync(d)) {
    const fp = d + "/" + f;
    const st = fs.statSync(fp);
    if (st.isDirectory()) walk(fp);
    else if (/\.vue$|\.ts$/.test(f)) {
      const c = fs.readFileSync(fp, "utf8");
      if (/['"](dialog-item|drawer-item)['"]/.test(c))
        console.log(fp + " => uses dialog-item/drawer-item string");
    }
  }
}
walk(dir);