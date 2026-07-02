
const fs = require("fs");
let code = fs.readFileSync("src/pages/Landing.tsx", "utf8");
code = code.replace(/^\uFEFF/, "");
code = code.replace(/^\W+import/, "import");
fs.writeFileSync("src/pages/Landing.tsx", code);

