export const formatResultTime = (time, unit = 10) => {
  const date = new Date(time * (1000 / unit));
  const tenths = date.getMilliseconds() / 100;
  const seconds = date.getSeconds();
  const minutes = date.getMinutes();
  return `${minutes > 0 ? `${minutes}:` : ""}${seconds < 10
    ? 0
    : ""}${seconds}.${tenths}`;
};
