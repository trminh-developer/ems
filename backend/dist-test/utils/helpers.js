"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCreateDateVNPay =
  exports.getExpireDateVNPay =
  exports.formatVNPayDate =
    void 0;
const formatVNPayDate = (date) => {
  const yyyy = date.getFullYear().toString();
  const MM = (date.getMonth() + 1).toString().padStart(2, "0");
  const dd = date.getDate().toString().padStart(2, "0");
  const HH = date.getHours().toString().padStart(2, "0");
  const mm = date.getMinutes().toString().padStart(2, "0");
  const ss = date.getSeconds().toString().padStart(2, "0");
  return `${yyyy}${MM}${dd}${HH}${mm}${ss}`;
};
exports.formatVNPayDate = formatVNPayDate;
const getExpireDateVNPay = (minutes = 15) => {
  const date = new Date();
  date.setMinutes(date.getMinutes() + minutes);
  return (0, exports.formatVNPayDate)(date);
};
exports.getExpireDateVNPay = getExpireDateVNPay;
const getCreateDateVNPay = () => {
  const date = new Date();
  return (0, exports.formatVNPayDate)(date);
};
exports.getCreateDateVNPay = getCreateDateVNPay;
