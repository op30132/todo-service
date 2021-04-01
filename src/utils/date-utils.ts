import dayjs = require('dayjs');
export class DateUtils {

  /**
   * UTC 時間轉為 locale 時間格式
   */
  static formatDisplayDate(list: any[], attrs: string[], format = 'YYYY/MM/DD HH:mm:ss'): any[] {
    return list.map(item => {
      for (const attr of attrs) {
        item[attr] = dayjs(item[attr]).format(format)
      }
      return item;
    })
  }

  static formatDate(date: Date): string {
    const format = 'YYYY/MM/DD HH:mm:ss:SSS';
    return dayjs(date).format(format);
  }
  // 傳入格式: 20200601070145.0Z
  static ISOStringToDateFormat(isoString: string): Date {
    if(isoString){
      const year = isoString.slice(0, 4);
      const month = isoString.slice(4, 6);
      const day = isoString.slice(6, 8);
      const hour = isoString.slice(8, 10);
      const min = isoString.slice(10, 12);
      const sec = isoString.slice(12, 14);
      const timeZone = isoString.slice(14);
      const isoFormat = `${year}-${month}-${day}T${hour}:${min}:${sec}${timeZone}`
      return new Date(isoFormat);
    }
    return new Date();
  }
}