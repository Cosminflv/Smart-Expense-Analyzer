export function toISO(date: Date) {
  return date.toISOString().slice(0, 10);
}
