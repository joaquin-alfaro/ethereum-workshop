import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

function parseDate(date: string, format: string = 'YYYY-MM-DD HH:mm') {
    return dayjs(date, format).utc(true).unix()
}

function formatDate(xDate: number, format: string = 'YYYY-MM-DD HH:mm') {
    return dayjs.unix(xDate).utc().format(format)
}

export {
    parseDate,
    formatDate,
}