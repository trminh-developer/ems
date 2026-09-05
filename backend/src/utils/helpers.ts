export const formatVNPayDate = (date: Date): string => {
  const yyyy = date.getFullYear().toString();
  const MM = (date.getMonth() + 1).toString().padStart(2, '0');
  const dd = date.getDate().toString().padStart(2, '0');
  const HH = date.getHours().toString().padStart(2, '0');
  const mm = date.getMinutes().toString().padStart(2, '0');
  const ss = date.getSeconds().toString().padStart(2, '0');
  return `${yyyy}${MM}${dd}${HH}${mm}${ss}`;
};

export const getExpireDateVNPay = (minutes: number = 15): string => {
  const date = new Date();
  date.setMinutes(date.getMinutes() + minutes);
  return formatVNPayDate(date);
};

export const getCreateDateVNPay = (): string => {
  const date = new Date();
  return formatVNPayDate(date);
};
