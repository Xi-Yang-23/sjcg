<template>
  <q-page>
    <q-header :class="themeStore.toolBarColor">
      <q-toolbar>
        <q-toggle
          v-model="editorDisabled"
          color="primary"
          unchecked-icon="create"
          checked-icon="format_clear"
          label="只读"
          size="md"
          keep-color
        />
        <q-space />

        <q-btn
          color="primary"
          label="发布"
          unelevated
          size="md"
          push
          @click="subContent"
        />
      </q-toolbar>
    </q-header>
    <ckeditor
      :editor="editor"
      :config="editorConfig"
      v-model="editorData"
      :disabled="editorDisabled"
    />

    <div id="ct" class="ck ck-content"></div>
  </q-page>
</template>
  
  <script setup>
import CKEditor from "@ckeditor/ckeditor5-vue";
import { Editor } from "ckeditor5-build";
import { Screen } from "quasar";
import { ref } from "vue";
import { theme } from "../stores/themeStore.js";

import Prism from "prismjs";
//主题css || 其它主题去themes导入即可
// import "prismjs/themes/prism.min.css";
// import "prismjs/themes/prism-coy.min.css";yes// 3点会样式错乱
// import "prismjs/themes/prism-dark.min.css";// 3点会样式错乱none
// import "prismjs/themes/prism-funky.min.css";// 3点会样式错乱none
import "prismjs/themes/prism-okaidia.min.css"; // 3点会样式错乱none

//右上角按钮js+css
import "prismjs/plugins/toolbar/prism-toolbar.min.js";
import "prismjs/plugins/toolbar/prism-toolbar.min.css";

//行号js+css
import "prismjs/plugins/line-numbers/prism-line-numbers.min.js";
import "prismjs/plugins/line-numbers/prism-line-numbers.min.css";

//自动链接js+css
import "prismjs/plugins/autolinker/prism-autolinker.min.js";
import "prismjs/plugins/show-language/prism-show-language.min.js";

//代码规范化，自动删除代码左右空格
import "prismjs/plugins/normalize-whitespace/prism-normalize-whitespace.min.js";

// 复制代码
import "prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard.min.js";

// 代码括号高亮+代码括号显示标识符
import "prismjs/plugins/match-braces/prism-match-braces.min.js";
import "prismjs/plugins/match-braces/prism-match-braces.min.css";

// 树结构
import "prismjs/plugins/treeview/prism-treeview.min.js";
import "prismjs/plugins/treeview/prism-treeview.min.css";

//代码规范化
Prism.plugins.NormalizeWhitespace.setDefaults({
  "remove-trailing": true,
  "remove-indent": true,
  "left-trim": true,
  "right-trim": true,

  /*'break-lines': 80,
	'indent': 2,
	'remove-initial-line-feed': false,
	'tabs-to-spaces': 4,
	'spaces-to-tabs': 4*/
});

const themeStore = theme();

// 发布按钮
const subContent = () => {
  document.querySelector("#ct").innerHTML = editorData.value;
  //高亮的代码
  const presEl = document.querySelectorAll("#ct pre");
  for (let index = 0; index < presEl.length; index++) {
    const el = presEl[index];

    // 按钮复制
    el.setAttribute("lang", "zh-Hans-CN");
    el.setAttribute("data-prismjs-copy", "复制");
    el.setAttribute("data-prismjs-copy-error", "复制失败,刷新再试");
    el.setAttribute("data-prismjs-copy-success", "已复制");

    // pre元素 的class
    el.className += " line-numbers"; // 显示行号
    // code元素的class
    el.querySelector("code").className +=
      " match-braces no-brace-hove rainbow-braces"; //括号颜色
  }
  // 高亮父元素为#ct的代码
  Prism.highlightAllUnder(document.querySelector("#ct"));
};

// 代码块配置
const codeBlockCfg = {
  languages: [
    { language: "plaintext", label: "纯文本", class: "" },
    { language: "HTML", label: "HTML" },
    { language: "CSS", label: "CSS" },
    { language: "JavaScript", label: "JavaScript" },
    { language: "markdown", label: "markdown" },
    { language: "python", label: "Python" },
    { language: "Git", label: "Git" },
    { language: "treeview", label: "树目录" },
  ],
};

const bigScrBasCfg = {
  shouldNotGroupWhenFull: true, //显示全部 | 隐藏
  items: [
    "undo",
    "redo",
    "alignment:left",
    "alignment:right",
    "alignment:center",
    "alignment:justify",
    "outdent",
    "indent",
    "|",
    "toDoList",
    "bulletedList",
    "numberedList",
    "specialCharacters",
    "horizontalLine",
    "|",
    "heading",
    "|",
    "style",
    "|",
    "bold",
    "italic",
    "strikethrough",
    "Underline",
    "Superscript",
    "Superscript",
    "RemoveFormat",
    "|",
    "code",
    "codeBlock",
    "htmlEmbed",
    "fontSize",
    "fontFamily",
    "fontColor",
    "fontBackgroundColor",
    "|",
    "link",
    "ImageInsert",
    "insertTable",
    "blockQuote",
    "|",
    "findAndReplace",
    "SelectAll",
    "ShowBlocks",
    "NowTime",
    "AccessibilityHelp",
  ],
};

const miniBarsCfg = {
  shouldNotGroupWhenFull: false, //显示全部 | 隐藏
  items: [
    "undo",
    "redo",
    "|",
    "outdent",
    "indent",
    "|",
    "horizontalLine",
    "style",
    {
      label: "样式",
      icon: '<svg t="1709975395228" class="icon" viewBox="0 0 1026 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4302" width="200" height="200"><path d="M944.4 311.8c-32.7-2.3-63.4 3.5-101.5 54.3s-152.3 20.7-137.5-41c6.6-17.8 7.7-36.4 70.3-66.8 62.6-30.4 36.1-100.4 9.6-115 0 0-241.9-138.7-580.3 60.9-93 54-265.5 251.1-183.5 459.2C73.1 787.7 162.8 858.8 308.3 905c145.5 46.2 314.7 14.7 400.4-29.3 85.7-44 227.8-109.4 294.4-284.2 66.5-174.8-26-277.5-58.7-279.7z m-850 179.6c-3.8-26.8 24.3-53 62.9-58.5 38.5-5.5 72.9 11.8 76.7 38.6 3.8 26.8-24.3 53-62.9 58.5s-72.9-11.8-76.7-38.6z m121 203.6c-40.5 5.8-76.7-12.4-80.7-40.6-4-28.2 25.6-55.7 66.1-61.5 40.5-5.8 76.6 12.4 80.7 40.6 4.1 28.2-25.5 55.7-66.1 61.5z m18.4-325.2c-38.9 5.5-73.5-11.9-77.4-39-3.8-27.1 24.5-53.5 63.4-59s73.5 11.9 77.4 39-24.6 53.4-63.4 59z m172.9 468.8c-44.2 9.3-85.2-8.1-91.7-38.9-6.4-30.7 24.1-63.2 68.3-72.4 44.2-9.3 85.2 8.1 91.7 38.9 6.4 30.7-24.2 63.1-68.3 72.4z m28.9-582c-37 5.3-70-11.3-73.6-37.1-3.7-25.7 23.4-50.9 60.4-56.1 37-5.3 70 11.3 73.6 37.1 3.6 25.7-23.4 50.8-60.4 56.1z" p-id="4303"></path></svg>',
      items: ["fontColor", "fontBackgroundColor"],
    },

    {
      label: "文本",
      icon: '<svg t="1709975429544" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5307" width="200" height="200"><path d="M692.2597343921661 882.78857421875H331.711297750473v-30.689996480941772a563.3140236139297 563.3140236139297 0 0 1 48.088091611862176-14.83154296875c16.200274229049683-4.278552532196046 33.656305074691765-7.757592201232912 52.39561200141907-10.638445615768433v-630.340576171875h-136.73552870750427l-57.244107127189636 151.53810381889343H211.2339789867401c-2.1675199270248413-14.118209481239319-3.9642512798309326-30.233752727508545-5.419161915779114-48.23148250579833-1.4541864395141602-17.939794063568115-2.6809751987457275-36.30831241607666-3.7933409214019784-55.10410666465761-1.1123657226562498-18.59736442565918-1.9683659076690674-37.078857421875-2.6527315378189087-55.019375681877136C198.6264432668686 171.53063368797297 198.2563788890838 155.35860311985022 198.2563788890838 141.21142578125h627.4886906147003c0 14.147177338600159-0.3997564315795899 30.090361833572388-1.1123657226562498 47.689059376716614-0.7415771484374999 17.655909061431885-1.6547888517379765 35.852792859077454-2.766430377960205 54.56313192844391s-2.139276266098023 37.078857421875-3.251641988754273 55.10410666465761c-1.0841220617294314 17.998453974723816-2.7099430561065674 34.48406159877777-4.9064308404922485 49.28736090660096h-28.408053517341607l-56.75889551639557-151.53810381889343H592.8891206979752V826.6850764751434c18.71033906936645 3.5659432411193848 36.22285723686218 7.07395076751709 52.366644144058235 10.638445615768433 16.229242086410522 3.508731722831726 31.85957372188568 8.415162563323973 47.00469374656678 14.83154296875v30.633509159088135z" p-id="5308"></path></svg>',
      items: [
        "bold",
        "italic",
        "strikethrough",
        "Underline",
        "Superscript",
        "Superscript",
      ],
    },
    "|",
    "toDoList",
    "bulletedList",
    "numberedList",
    "specialCharacters",
    "|",
    "alignment:left",
    "alignment:right",
    "alignment:center",
    "alignment:justify",
    "|",
    "ImageInsert",
    "highlight",
    "blockQuote",
    "codeBlock",
    "htmlEmbed",
    "code",
    "insertTable",
    "link",
    "blockQuote",
    "|",
    "RemoveFormat",
    "findAndReplace",
    "SelectAll",
    "ShowBlocks",
    "NowTime",
    "AccessibilityHelp",
  ],
};

// const miniBarsCfg = {
//   shouldNotGroupWhenFull: false, //显示全部 | 隐藏
//   items: [
//     "undo",
//     "redo",
//     "|",
//     "outdent",
//     "indent",
//     "|",
//     "horizontalLine",
//     "style",
//     {
//       label: "样式",
//       icon: '<svg t="1709975395228" class="icon" viewBox="0 0 1026 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4302" width="200" height="200"><path d="M944.4 311.8c-32.7-2.3-63.4 3.5-101.5 54.3s-152.3 20.7-137.5-41c6.6-17.8 7.7-36.4 70.3-66.8 62.6-30.4 36.1-100.4 9.6-115 0 0-241.9-138.7-580.3 60.9-93 54-265.5 251.1-183.5 459.2C73.1 787.7 162.8 858.8 308.3 905c145.5 46.2 314.7 14.7 400.4-29.3 85.7-44 227.8-109.4 294.4-284.2 66.5-174.8-26-277.5-58.7-279.7z m-850 179.6c-3.8-26.8 24.3-53 62.9-58.5 38.5-5.5 72.9 11.8 76.7 38.6 3.8 26.8-24.3 53-62.9 58.5s-72.9-11.8-76.7-38.6z m121 203.6c-40.5 5.8-76.7-12.4-80.7-40.6-4-28.2 25.6-55.7 66.1-61.5 40.5-5.8 76.6 12.4 80.7 40.6 4.1 28.2-25.5 55.7-66.1 61.5z m18.4-325.2c-38.9 5.5-73.5-11.9-77.4-39-3.8-27.1 24.5-53.5 63.4-59s73.5 11.9 77.4 39-24.6 53.4-63.4 59z m172.9 468.8c-44.2 9.3-85.2-8.1-91.7-38.9-6.4-30.7 24.1-63.2 68.3-72.4 44.2-9.3 85.2 8.1 91.7 38.9 6.4 30.7-24.2 63.1-68.3 72.4z m28.9-582c-37 5.3-70-11.3-73.6-37.1-3.7-25.7 23.4-50.9 60.4-56.1 37-5.3 70 11.3 73.6 37.1 3.6 25.7-23.4 50.8-60.4 56.1z" p-id="4303"></path></svg>',
//       items: ["fontColor", "fontBackgroundColor"],
//     },

//     {
//       label: "文本",
//       icon: '<svg t="1709975429544" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5307" width="200" height="200"><path d="M692.2597343921661 882.78857421875H331.711297750473v-30.689996480941772a563.3140236139297 563.3140236139297 0 0 1 48.088091611862176-14.83154296875c16.200274229049683-4.278552532196046 33.656305074691765-7.757592201232912 52.39561200141907-10.638445615768433v-630.340576171875h-136.73552870750427l-57.244107127189636 151.53810381889343H211.2339789867401c-2.1675199270248413-14.118209481239319-3.9642512798309326-30.233752727508545-5.419161915779114-48.23148250579833-1.4541864395141602-17.939794063568115-2.6809751987457275-36.30831241607666-3.7933409214019784-55.10410666465761-1.1123657226562498-18.59736442565918-1.9683659076690674-37.078857421875-2.6527315378189087-55.019375681877136C198.6264432668686 171.53063368797297 198.2563788890838 155.35860311985022 198.2563788890838 141.21142578125h627.4886906147003c0 14.147177338600159-0.3997564315795899 30.090361833572388-1.1123657226562498 47.689059376716614-0.7415771484374999 17.655909061431885-1.6547888517379765 35.852792859077454-2.766430377960205 54.56313192844391s-2.139276266098023 37.078857421875-3.251641988754273 55.10410666465761c-1.0841220617294314 17.998453974723816-2.7099430561065674 34.48406159877777-4.9064308404922485 49.28736090660096h-28.408053517341607l-56.75889551639557-151.53810381889343H592.8891206979752V826.6850764751434c18.71033906936645 3.5659432411193848 36.22285723686218 7.07395076751709 52.366644144058235 10.638445615768433 16.229242086410522 3.508731722831726 31.85957372188568 8.415162563323973 47.00469374656678 14.83154296875v30.633509159088135z" p-id="5308"></path></svg>',
//       items: [
//         "bold",
//         "italic",
//         "strikethrough",
//         "Underline",
//         "Superscript",
//         "Superscript",
//       ],
//     },
//     {
//       label: "列表",
//       icon: '<svg t="1709975492314" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6322" width="200" height="200"><path d="M170.666667 298.666667h682.666666v42.666666H170.666667V298.666667z m0 426.666666h426.666666v42.666667H170.666667v-42.666667z m0-213.333333h682.666666v42.666667H170.666667v-42.666667z" fill="#444444" p-id="6323"></path></svg>',
//       items: ["toDoList", "bulletedList", "numberedList", "specialCharacters"],
//     },

//     {
//       label: "对齐",
//       icon: '<svg t="1709975518532" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7310" width="200" height="200"><path d="M191.9873 143.976364h832.001411v64.007056H191.9873zM191.9873 815.971425h575.995767v64.007056H191.9873zM0 0h64.018344v1024.011289H0zM191.9873 591.969309h832.001411v64.007055H191.9873zM191.9873 367.978481h575.995767v64.007055H191.9873z" p-id="7311"></path></svg>',
//       items: [
//         "alignment:left",
//         "alignment:right",
//         "alignment:center",
//         "alignment:justify",
//       ],
//     },

//     {
//       label: "插入",
//       icon: '<svg t="1709975592565" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14289" width="200" height="200"><path d="M777.244444 345.0176c0 26.635378-21.592178 48.226844-48.227556 48.226844l-0.255289 0c-26.635378 0-48.227556-21.592178-48.227556-48.226844l0-0.256711c0-26.635378 21.592178-48.226844 48.227556-48.226844l0.255289 0c26.635378 0 48.227556 21.592178 48.227556 48.226844L777.244444 345.0176z" p-id="14290"></path><path d="M798.577778 193.422222l187.022222 0 0 44.8-187.022222 0 0-44.8Z" p-id="14291"></path><path d="M868.977778 122.311111l44.8 0 0 187.022222-44.8 0 0-187.022222Z" p-id="14292"></path><path d="M913.066667 856.940089 913.066667 438.755556l-41.955556 0 0 361.441422L599.657244 433.065956l-165.4784 89.891556-66.388622-89.8496L93.155556 582.2784 93.155556 236.8l581.688889 0 0-42.666667L51.2 194.133333l0 410.934044L51.2 835.555556l0 22.044444 574.712178 0L913.066667 857.6l0.487822 0L913.066667 856.940089zM586.801067 491.032178 824.713956 812.8 648.507022 812.8 461.112178 559.3088 586.801067 491.032178zM96 815.644444 96 631.716267 354.921956 491.079111l54.8544 74.239289 0.042667-0.031289L594.896356 815.644444 96 815.644444z" p-id="14293"></path></svg>',
//       items: [
//         "ImageInsert",
//         "highlight",
//         "blockQuote",
//         "codeBlock",
//         "htmlEmbed",
//         "code",
//         "insertTable",
//         "link",
//         "blockQuote",
//         "NowTime",
//       ],
//     },

//     {
//       label: "更多",
//       icon: "threeVerticalDots",
//       items: [
//         "RemoveFormat",
//         "findAndReplace",
//         "SelectAll",
//         "ShowBlocks",
//         "AccessibilityHelp",
//       ],
//     },
//   ],
// };
//

const ckeditor = CKEditor.component;

const editor = ref(Editor);
const editorDisabled = ref(false);
const editorData = ref("");
const editorConfig = ref({
  // 语言配置
  codeBlock: codeBlockCfg,

  image: {
    resizeOptions: [
      {
        name: "resizeImage:原始大小",
        value: null,
        label: "原始大小",
        icon: "original",
      },

      {
        name: "resizeImage:25",
        value: "25",
        label: "25%",
        icon: "small",
      },

      {
        name: "resizeImage:50",
        value: "50",
        label: "50%",
        icon: "medium",
      },
      {
        name: "resizeImage:75",
        value: "75",
        label: "75%",
        icon: "large",
      },
      {
        name: "resizeImage:100",
        value: "100",
        label: "100%",
        icon: "large",
      },
    ],
  },
  // 样式
  // style: {
  //   definitions: [
  //     {
  //       name: "Article category",
  //       element: "h3",
  //       classes: ["category"],
  //     },
  //     {
  //       name: "Title",
  //       element: "h2",
  //       classes: ["document-title"],
  //     },
  //     {
  //       name: "Subtitle",
  //       element: "h3",
  //       classes: ["document-subtitle"],
  //     },
  //     {
  //       name: "Info box",
  //       element: "p",
  //       classes: ["info-box"],
  //     },
  //     {
  //       name: "Side quote",
  //       element: "blockquote",
  //       classes: ["side-quote"],
  //     },
  //     {
  //       name: "Marker",
  //       element: "span",
  //       classes: ["marker"],
  //     },
  //     {
  //       name: "Spoiler",
  //       element: "span",
  //       classes: ["spoiler"],
  //     },
  //     {
  //       name: "Code (dark)",
  //       element: "pre",
  //       classes: ["fancy-code", "fancy-code-dark"],
  //     },
  //     {
  //       name: "Code (bright)",
  //       element: "pre",
  //       classes: ["fancy-code", "fancy-code-bright"],
  //     },
  //   ],
  // },

  // htmlEmbed: {
  //   showPreviews: true,
  //   sanitizeHtml: (inputHtml) => {
  //     // 校验危险script
  //     // const outputHtml = sanitize(inputHtml);

  //     return {
  //       html: outputHtml,
  //       // true or false depending on whether the sanitizer stripped anything.
  //       hasChanged: true,
  //     };
  //   },
  // },

  // 标题
  title: {
    placeholder: "标题...",
  },
  placeholder: "输入的内容...",

  heading: {
    options: [
      { model: "paragraph", title: "Paragraph", class: "ck-heading_paragraph" },
      {
        model: "heading1",
        view: "h1",
        title: "Heading 1",
        class: "ck-heading_heading1",
      },
      {
        model: "heading2",
        view: "h2",
        title: "Heading 2",
        class: "ck-heading_heading2",
      },
      {
        model: "heading3",
        view: "h3",
        title: "Heading 3",
        class: "ck-heading_heading3",
      },
    ],
  },
  // 查找替换
  findAndReplace: {
    uiType: "dropdown",
  },

  // 高亮
  highlight: {
    options: [
      {
        model: "greenMarker",
        class: "marker-green",
        title: "Green marker",
        color: "var(--ck-highlight-marker-green)",
        type: "marker",
      },
      {
        model: "redPen",
        class: "pen-red",
        title: "Red pen",
        color: "var(--ck-highlight-pen-red)",
        type: "pen",
      },
      {
        model: "yellowMarker",
        class: "marker-yellow",
        title: "Yellow Marker",
        color: "var(--ck-highlight-marker-yellow)",
        type: "marker",
      },
      {
        model: "greenMarker",
        class: "marker-green",
        title: "Green marker",
        color: "var(--ck-highlight-marker-green)",
        type: "marker",
      },
      {
        model: "pinkMarker",
        class: "marker-pink",
        title: "Pink marker",
        color: "var(--ck-highlight-marker-pink)",
        type: "marker",
      },
      {
        model: "blueMarker",
        class: "marker-blue",
        title: "Blue marker",
        color: "var(--ck-highlight-marker-blue)",
        type: "marker",
      },
      {
        model: "redPen",
        class: "pen-red",
        title: "Red pen",
        color: "var(--ck-highlight-pen-red)",
        type: "pen",
      },
      {
        model: "greenPen",
        class: "pen-green",
        title: "Green pen",
        color: "var(--ck-highlight-pen-green)",
        type: "pen",
      },
    ],
  },

  // 左侧迷你bar
  blockToolbar: [],
  // bar
  toolbar: Screen.gt.xs ? bigScrBasCfg : miniBarsCfg,

  // @
  mention: {
    feeds: [
      {
        marker: "@",
        feed: [
          "@apple",
          "@bears",
          "@brownie",
          "@cake",
          "@cake",
          "@candy",
          "@canes",
          "@chocolate",
          "@cookie",
          "@cotton",
          "@cream",
          "@cupcake",
          "@danish",
          "@donut",
          "@dragée",
          "@fruitcake",
          "@gingerbread",
          "@gummi",
          "@ice",
          "@jelly-o",
          "@liquorice",
          "@macaroon",
          "@marzipan",
          "@oat",
          "@pie",
          "@plum",
          "@pudding",
          "@sesame",
          "@snaps",
          "@soufflé",
          "@sugar",
          "@sweet",
          "@topping",
          "@wafer",
        ],
        minimumCharacters: 1,
      },
    ],
  },
});
</script>

<style lang="sass">
// 编辑器复制按钮+代码名称美化
.toolbar-item>button,.toolbar>.toolbar-item>span
  background: var(--ck-color-code-block-label-background) !important
  color: white !important
  box-shadow: none !important
  border-radius: 3px !important
  font-family: var(--ck-font-face)!important
  padding: 2px 8px!important

.toolbar>.toolbar-item>span
  padding: 3.6px 5px!important

.toolbar>.toolbar-item:first-child
  transform: translateY(-1px)

.toolbar-item>button
  margin: 0 6px
  cursor: pointer
  &:hover
    background: rgb(67, 67, 67)!important
    &:active
      background: black!important

.fancy-code-dark code
  color: white !important
  text-shadow: none !important

// 编辑器高度 
.ck-editor__editable_inline:not(.ck-comment__input *)
  height: calc( 100vh - 76px - 51px)
  overflow-y: auto

// @背景色
:root
  --ck-color-mention-background: hsla(220, 100%, 54%, 0.4)
  --ck-color-mention-text: hsl(0, 0%, 15%)

// 隐藏logo
.ck-powered-by
  display: none !important
  opacity: 0!important
  width: 0!important
  height: 0!important
</style>