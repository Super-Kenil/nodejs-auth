
export const getFutureDate = async (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days)
  return date;
}
