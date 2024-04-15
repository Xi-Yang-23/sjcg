import { Screen } from 'quasar';
import Player from 'xgplayer';
// 现在music作为一个固定的preset使用，不再继承player, 解决耦合性过大问题
import MusicPreset from 'xgplayer-music';
import 'xgplayer-music/dist/index.min.css'
import "xgplayer/dist/index.min.css";
let player = (url, el = 'au', w = Screen.width, h = 50) => new Player({
    id: el,
    mediaType: 'audio',
    url,
    volume: 1,
    width: w,
    height: h,
    preloadNext: true, // 预加载下一首
    switchKeepProgress: false, // 切换歌曲保持进度 
    preset: [MusicPreset], // 如果要同时使用默认preset，那么配置是['default', MusicPreset]
}
)

export default player