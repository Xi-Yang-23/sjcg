import { model, Schema } from "mongoose"

const Yzm = model('yzms', new Schema({
    val: Number,
    email: String,
    time: {
        type: Date,
        default: Date.now(),
        expires: 1000 * 60   //1分钟后删除
    }
}))

export default Yzm


