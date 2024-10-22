export function timeAgo(timestamp: string | number | Date) {
  // Convert the timestamp to a Date object if it's not already
  const now = new Date();
  const past = new Date(timestamp);

  // Ensure the result is a number for the arithmetic operation
  const timeDifference = Math.floor((now.getTime() - past.getTime()) / 1000); // Both are numbers

  // Rest of your logic
  const units = [
    { label: "year", seconds: 60 * 60 * 24 * 365 },
    { label: "month", seconds: 60 * 60 * 24 * 30 },
    { label: "week", seconds: 60 * 60 * 24 * 7 },
    { label: "day", seconds: 60 * 60 * 24 },
    { label: "hour", seconds: 60 * 60 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ];

  for (const unit of units) {
    const interval = Math.floor(timeDifference / unit.seconds);
    if (interval >= 1) {
      return `${interval} ${unit.label}${interval !== 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
}
