const fs = require("fs-extra");
const concat = require("concat");
const { join } = require("path");
const demoDir = "projects/apicuron-consent-wc/demo/";
(async function build() {
  const files = [
    "./dist/apicuron-consent-wc/polyfills.js",
    "./dist/apicuron-consent-wc/main.js",
  ];
  // await fs.ensureDir('dist/apicuron-consent-wc/elements');
  // await concat(files, 'dist/apicuron-consent-wc/elements/apicuron-consent-wc.js');

  const widgetPath = join(demoDir, "widget.js");

  await concat(files, widgetPath);
  console.log(
    `Concatenated files \n\t${files.join(",\n\t")}\ninto ${widgetPath}`
  );
})();
