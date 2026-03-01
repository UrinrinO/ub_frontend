export function getMondayYYYYMMDD(d = new Date()) {
  const monday = new Date(d);
  const day = monday.getDay(); // 0 Sun ... 6 Sat
  const diff = day === 0 ? -6 : 1 - day;
  monday.setDate(monday.getDate() + diff);
  return monday.toISOString().slice(0, 10);
}
