import { Toast } from "antd-mobile";
import { browserHistory } from "react-router";

function fillZero(num) {
  return num > 9 ? String(num) : "0" + String(num);
}

function getTime(date, type) {
  if (!date || date == 0) return "";

  let time;
  let now = new Date(date),
    year = now.getFullYear(),
    month = now.getMonth() + 1,
    day = now.getDate(),
    hour = now.getHours(),
    min = now.getMinutes(),
    second = now.getSeconds();

  time =
    type == "YYYY-MM-DD"
      ? year + "-" + fillZero(month) + "-" + fillZero(day)
      : year +
        "-" +
        fillZero(month) +
        "-" +
        fillZero(day) +
        " " +
        fillZero(hour) +
        ":" +
        fillZero(min) +
        ":00";
  return time;
}

var Tool = {
  formatTime: getTime
};

export default Tool;
