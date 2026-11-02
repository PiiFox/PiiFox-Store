const fs = require('fs');
const path = 'snippets/more-variant-form.liquid';
let src = fs.readFileSync(path, 'utf8');
const hasCRLF = /\r\n/.test(src);

// 统一成 LF 做匹配
let s = src.replace(/\r\n/g, '\n');

const replacements = [
  // L951 restoreDefaultImage 前的 if 缩进（28 -> 14）
  [
    "              const remainingSelected = setup1List.querySelectorAll('.bundle-keycap-card.is-selected');\n                            if (remainingSelected.length > 0) {",
    "              const remainingSelected = setup1List.querySelectorAll('.bundle-keycap-card.is-selected');\n              if (remainingSelected.length > 0) {"
  ],
  // L1031 initBundleAnchorUrl 注释缩进（16 -> 4）
  [
    "                // 搭配区商品卡片选中状态 <-> 地址栏 p 参数 同步（支持多选，逗号分隔；取消选中则移除）\n    function initBundleAnchorUrl() {",
    "    // 搭配区商品卡片选中状态 <-> 地址栏 p 参数 同步（支持多选，逗号分隔；取消选中则移除）\n    function initBundleAnchorUrl() {"
  ],
  // L1062 syncAnchorFromSelection 注释缩进（12 -> 6）
  [
    "            // 收集当前所有已选中卡片的锚点，并同步到地址栏\n      function syncAnchorFromSelection() {",
    "      // 收集当前所有已选中卡片的锚点，并同步到地址栏\n      function syncAnchorFromSelection() {"
  ],
  // L1461 initBundleAddonGroups(); 缩进（8 -> 4）
  [
    "        initBundleAddonGroups();\n    initBundleQtySelectors();",
    "    initBundleAddonGroups();\n    initBundleQtySelectors();"
  ]
];

let okCount = 0;
for (const [oldS, newS] of replacements) {
  const n = s.split(oldS).length - 1;
  if (n === 1) {
    s = s.replace(oldS, newS);
    okCount++;
  } else {
    console.log('WARN: expected 1 match, found ' + n + ' for: ' + oldS.slice(0, 40).replace(/\n/g, '\\n'));
  }
}

// addon 里 const checkbox 前多余缩进（20 -> 10）
const addonOld = "card.addEventListener('click', function () {\n          if (this.classList.contains('sold-out')) return;\n\n                    const checkbox = this.querySelector('.bundle-product-checkbox');\n          const isSelected = this.classList.contains('is-selected');";
const addonNew = "card.addEventListener('click', function () {\n          if (this.classList.contains('sold-out')) return;\n\n          const checkbox = this.querySelector('.bundle-product-checkbox');\n          const isSelected = this.classList.contains('is-selected');";
const addonN = s.split(addonOld).length - 1;
if (addonN === 1) {
  s = s.replace(addonOld, addonNew);
  okCount++;
} else {
  console.log('WARN addon: expected 1 match, found ' + addonN);
}

const out = hasCRLF ? s.replace(/\n/g, '\r\n') : s;
fs.writeFileSync(path, out, 'utf8');
console.log('Applied ' + okCount + '/5 fixes. CRLF=' + hasCRLF);
