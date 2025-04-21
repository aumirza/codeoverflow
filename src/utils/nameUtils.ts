export function getInitials(name: string) {
  if (!name) return "";
  return name
    .split(" ")
    .map((w) => w[0])
    .join("");
}
