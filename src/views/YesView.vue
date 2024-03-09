 <template>
  <ckeditor
    :editor="editor"
    :config="editorConfig"
    v-model="editorData"
    :disabled="editorDisabled"
    @ready="ready"
  ></ckeditor>
</template>

<script setup>
import CKEditor from "@ckeditor/ckeditor5-vue";
import { Editor } from "ckeditor5-build";
import { ref } from "vue";

const ready = (editor) => {};

const ckeditor = CKEditor.component;
const editor = ref(Editor);
const editorDisabled = ref(false);
const editorData = ref("");
const editorConfig = ref({
  // 样式
  style: {
    definitions: [
      {
        name: "Article category",
        element: "h3",
        classes: ["category"],
      },
      {
        name: "Title",
        element: "h2",
        classes: ["document-title"],
      },
      {
        name: "Subtitle",
        element: "h3",
        classes: ["document-subtitle"],
      },
      {
        name: "Info box",
        element: "p",
        classes: ["info-box"],
      },
      {
        name: "Side quote",
        element: "blockquote",
        classes: ["side-quote"],
      },
      {
        name: "Marker",
        element: "span",
        classes: ["marker"],
      },
      {
        name: "Spoiler",
        element: "span",
        classes: ["spoiler"],
      },
      {
        name: "Code (dark)",
        element: "pre",
        classes: ["fancy-code", "fancy-code-dark"],
      },
      {
        name: "Code (bright)",
        element: "pre",
        classes: ["fancy-code", "fancy-code-bright"],
      },
    ],
  },

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
  toolbar: {
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
  },

 
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
// @背景色
:root
  --ck-color-mention-background: hsla(220, 100%, 54%, 0.4)
  --ck-color-mention-text: hsl(0, 0%, 15%)
</style>