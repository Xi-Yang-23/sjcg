import { disconnect } from "mongoose";
import conDb from "./mongoose/index.js";
import Users from "./mongoose/models/usersModel.js";


export default async function aaa() {
    await conDb(1)
    const f = await Users.findOne({ email: '12345@qq.com' })
    f.online = 100
    await f.save()
    console.log(f);
    // console.log(await Users.findOne({ email: '12345@qq.com' }, { pwd: false }));
    await disconnect()
}