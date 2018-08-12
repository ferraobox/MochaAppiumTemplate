module.exports = function() {
  const currentDate = new Date();
  let month = currentDate.getMonth() + 1;
  let day = currentDate.getDate();
  let year = currentDate
    .getFullYear()
    .toString()
    .substr(-2);
  let hour = currentDate.getHours();
  let min = currentDate.getMinutes();
  let shortDate = day + '/' + month + '/' + year + '/' + hour + ':' + min;
  return shortDate;
};
