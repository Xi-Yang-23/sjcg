import Plugin from "@ckeditor/ckeditor5-core/src/plugin";
import ButtonView from "@ckeditor/ckeditor5-ui/src/button/buttonview";

/**
 * 自定义插入当前时间
 */
export default class NowTime extends Plugin {
    init() {
        const editor = this.editor,
            t = editor.t;

        // 添加元素
        editor.ui.componentFactory.add("NowTime", () => {
            const button = new ButtonView();
            // 设置提示+按钮文字
            button.set({
                label: t('当前时间'),//按钮文字
                withText: true,
                tooltip: true,
                withKeysstroke: true,
                isToggleable: true,
                keystroke: 'Ctrl+Alt+T' // 快捷键提示
            });

            // 点击事件
            button.on("execute", () => {
                const nowTime = new Date().toLocaleString();
                // 点击在当前光标位置插入内容
                editor.model.change((writer) => {
                    editor.model.insertContent(writer.createText(nowTime));
                });
            });
            return button;
        });

        // 添加文档到帮助栏目
        editor.accessibility.addKeystrokeInfos({
            keystrokes: [
                {
                    label: t('插入当前时间'),
                    keystroke: 'Ctrl+Alt+T'
                }
            ]
        });

        // 设置快捷键
        // editor.keystrokes.set('Ctrl+Alt+T', '插件名');
        editor.keystrokes.set('Ctrl+Alt+T', (event, cancel) => {
            const nowTime = new Date().toLocaleString();
            // 点击在当前光标位置插入内容
            editor.model.change((writer) => {
                editor.model.insertContent(writer.createText(nowTime));
            });
            cancel();
        });

    }
}