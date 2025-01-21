export function getCurrentTime(timeZone: string) {
  const localDate = new Date();
  const options = { timeZone: timeZone, hour12: false };
  const formattedTime = new Intl.DateTimeFormat("en-GB", {
    ...options,
    hour: "2-digit",
    minute: "2-digit",
  }).format(localDate);

  return formattedTime
}
