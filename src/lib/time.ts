export const toISO = (value: Date | number) =>
  (value instanceof Date ? value : new Date(value)).toISOString();

export const getDayKey = (value: Date = new Date()) => {
  const year = value.getUTCFullYear();
  const month = `${value.getUTCMonth() + 1}`.padStart(2, "0");
  const day = `${value.getUTCDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const readableTime = (iso: string) =>
  new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
