/**
 * @license Copyright (c) 2014-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

// 主题 https://ckeditor.com/docs/ckeditor5/latest/framework/deep-dive/ui/theme-customization.html

import "./style.css";
import "./my.css";
import { ClassicEditor } from "@ckeditor/ckeditor5-editor-classic";
import { BlockToolbar } from "@ckeditor/ckeditor5-ui";
import { Alignment } from "@ckeditor/ckeditor5-alignment";
import { Autoformat } from "@ckeditor/ckeditor5-autoformat";
import { Autosave } from "@ckeditor/ckeditor5-autosave";
import {
  Bold,
  Code,
  Italic,
  Strikethrough,
  Subscript,
  Superscript,
  Underline,
} from "@ckeditor/ckeditor5-basic-styles";
import { BlockQuote } from "@ckeditor/ckeditor5-block-quote";
import { CodeBlock } from "@ckeditor/ckeditor5-code-block";
import type { EditorConfig } from "@ckeditor/ckeditor5-core";
import { Essentials } from "@ckeditor/ckeditor5-essentials";
import { FindAndReplace } from "@ckeditor/ckeditor5-find-and-replace";
import { HorizontalLine } from "@ckeditor/ckeditor5-horizontal-line";
import {
  FontBackgroundColor,
  FontColor,
  FontFamily,
  FontSize,
} from "@ckeditor/ckeditor5-font";
import { Heading, Title } from "@ckeditor/ckeditor5-heading";
import { Highlight } from "@ckeditor/ckeditor5-highlight";
import { HtmlEmbed } from "@ckeditor/ckeditor5-html-embed";
import {
  DataFilter,
  FullPage,
  GeneralHtmlSupport,
} from "@ckeditor/ckeditor5-html-support";
import {
  AutoImage,
  Image,
  ImageCaption,
  ImageResize,
  ImageStyle,
  ImageToolbar,
  ImageInsert,
  ImageUploadEditing,
} from "@ckeditor/ckeditor5-image";
import { Indent, IndentBlock } from "@ckeditor/ckeditor5-indent";
import { AutoLink, Link, LinkImage } from "@ckeditor/ckeditor5-link";
import { List, ListProperties, TodoList } from "@ckeditor/ckeditor5-list";
import {
  Markdown,
  PasteFromMarkdownExperimental,
} from "@ckeditor/ckeditor5-markdown-gfm";
import { Mention } from "@ckeditor/ckeditor5-mention";
import { Paragraph } from "@ckeditor/ckeditor5-paragraph";
import { PasteFromOffice } from "@ckeditor/ckeditor5-paste-from-office";
import { RemoveFormat } from "@ckeditor/ckeditor5-remove-format";
import { StandardEditingMode } from "@ckeditor/ckeditor5-restricted-editing";
import { SelectAll } from "@ckeditor/ckeditor5-select-all";
import { ShowBlocks } from "@ckeditor/ckeditor5-show-blocks";
import {
  SpecialCharacters,
  SpecialCharactersArrows,
  SpecialCharactersCurrency,
  SpecialCharactersEssentials,
  SpecialCharactersLatin,
  SpecialCharactersMathematical,
  SpecialCharactersText,
} from "@ckeditor/ckeditor5-special-characters";
import { Style } from "@ckeditor/ckeditor5-style";
import {
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TableToolbar,
} from "@ckeditor/ckeditor5-table";
import { TextTransformation } from "@ckeditor/ckeditor5-typing";
import { Undo } from "@ckeditor/ckeditor5-undo";
import { EditorWatchdog } from "@ckeditor/ckeditor5-watchdog";
import { WordCount } from "@ckeditor/ckeditor5-word-count";
import { Clipboard } from "@ckeditor/ckeditor5-clipboard";
import { Base64UploadAdapter } from "@ckeditor/ckeditor5-upload";
import NowTime from "./plugins/nowTime";

// 自定义插件
// You can read more about extending the build with additional plugins in the "Installing plugins" guide.
// See https://ckeditor.com/docs/ckeditor5/latest/installation/plugins/installing-plugins.html for details.

class Editor extends ClassicEditor {
  public static override builtinPlugins = [
    NowTime,
    BlockToolbar,
    // Minimap,
    Base64UploadAdapter,
    ImageUploadEditing,
    ImageInsert,
    PasteFromMarkdownExperimental,
    Clipboard,
    HorizontalLine,
    Alignment,
    AutoImage,
    AutoLink,
    Autoformat,
    Autosave,
    BlockQuote,
    Bold,
    Code,
    CodeBlock,
    DataFilter,
    Essentials,
    FindAndReplace,
    FontBackgroundColor,
    FontColor,
    FontFamily,
    FontSize,
    FullPage,
    GeneralHtmlSupport,
    Heading,
    Highlight,
    HtmlEmbed,
    HorizontalLine,
    Image,
    ImageCaption,
    ImageResize,
    ImageStyle,
    ImageToolbar,
    Indent,
    IndentBlock,
    Italic,
    Link,
    LinkImage,
    List,
    ListProperties,
    Markdown,
    Mention,
    Paragraph,
    PasteFromOffice,
    RemoveFormat,
    SelectAll,
    ShowBlocks,
    SpecialCharacters,
    SpecialCharactersArrows,
    SpecialCharactersCurrency,
    SpecialCharactersEssentials,
    SpecialCharactersLatin,
    SpecialCharactersMathematical,
    SpecialCharactersText,
    StandardEditingMode,
    Strikethrough,
    Style,
    Subscript,
    Superscript,
    Table,
    TableCaption,
    TableCellProperties,
    TableColumnResize,
    TableProperties,
    TableToolbar,
    TextTransformation,
    Title,
    TodoList,
    Underline,
    Undo,
    WordCount,
  ];

  public static override defaultConfig: EditorConfig = {
    toolbar: {
      items: [
        "NowTime",
        "codeBlock",
        "ImageInsert",
        "horizontalLine",
        "style",
        "htmlEmbed",
        "heading",
        "|",
        "bold",
        "italic",
        "link",
        "bulletedList",
        "numberedList",
        "|",
        "outdent",
        "indent",
        "|",
        "blockQuote",
        "insertTable",
        "undo",
        "redo",
      ],
    },
    blockToolbar: [],
    language: "zh-cn",
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
      ],
      toolbar: [
        "imageStyle:alignLeft",
        "imageStyle:alignRight",
        {
          name: "imageStyle:customDropdown",
          title: "文字环绕",
          items: [
            "imageStyle:alignBlockLeft",
            "imageStyle:block",
            "imageStyle:alignBlockRight",
          ],
          defaultItem: "imageStyle:block",
        },
        "|",
        "ImageResize",
        "|",
        "toggleImageCaption",
        "imageTextAlternative",
        "linkImage",
      ],
    },

    // 表格
    table: {
      contentToolbar: [
        "toggleTableCaption",
        "tableColumn",
        "tableRow",
        "mergeTableCells",
        "tableCellProperties",
        "tableProperties",
      ],
    },

    // 样式
    style: {
      definitions: [
        {
          name: "标题1",
          element: "h2",
          classes: ["document-title"],
        },
        {
          name: "标题2",
          element: "h3",
          classes: ["category"],
        },
        {
          name: "标题2-字幕",
          element: "h3",
          classes: ["document-subtitle"],
        },
        {
          name: "段落",
          element: "p",
          classes: ["info-box"],
        },
        {
          name: "引用",
          element: "blockquote",
          classes: ["side-quote"],
        },
        {
          name: "标记",
          element: "span",
          classes: ["marker"],
        },
        {
          name: "隐藏域",
          element: "span",
          classes: ["spoiler"],
        },
        {
          name: "代码块(暗色)",
          element: "pre",
          classes: ["fancy-code", "fancy-code-dark"],
        },
        {
          name: "代码块(明色)",
          element: "pre",
          classes: ["fancy-code", "fancy-code-bright"],
        },
      ],
    },
  };
}

export default { Editor, EditorWatchdog };
