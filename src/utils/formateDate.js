import { date } from "quasar";
// 解构只保留需要的东西
const { getDateDiff, formatDate, subtractFromDate } = date;

/**
 * # 格式化时间
 * @param {时间戳} endTime 结束时间戳
 * @param {时间戳} [startTime]?可选,默认为当前时间戳 开始时间戳
 * @returns String 返回格式化的时间文本
 */
const formatDates = (endTime, startTime = Number(new Date().getTime())) => {
    endTime = Number(endTime)
    const toNowDateSec = getDateDiff(startTime, endTime, "second");

    const inOneHour = 60 * 60, //一个小时之内
        inOneDay = inOneHour * 24, //一天之内
        threeDayAfter = inOneDay * 3; //3天后

    //一分钟之内
    if (toNowDateSec <= 60) return "刚刚";
    //一个小时之内
    if (toNowDateSec <= inOneHour) return getDateDiff(startTime, endTime, "minute") + "分钟前";
    //一天之内
    if (toNowDateSec <= inOneDay) return getDateDiff(startTime, endTime, "hour") + "小时前";
    //3天之内
    if (toNowDateSec <= threeDayAfter) return getDateDiff(startTime, endTime) + "天前";

    //3天后
    return formatDate(endTime, "YYYY/M/D")
}

export default formatDates