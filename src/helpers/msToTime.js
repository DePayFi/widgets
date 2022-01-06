export default(ms)=>{
  let year,
      month,
      day,
      hour,
      minute,
      second;

  second = Math.floor(ms / 1000);
  minute = Math.floor(second / 60);
  second = second % 60;
  hour = Math.floor(minute / 60);
  minute = minute % 60;
  day = Math.floor(hour / 24);
  hour = hour % 24;
  month = Math.floor(day / 30);
  day = day % 30;
  year = Math.floor(month / 12);
  month = month % 12;

  return { year, month, day, hour, minute, second };
}
