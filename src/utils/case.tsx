export function toPascalCase(str: String) {
  return str
    .replace(
      /(\w)(\w*)/g,
      (_, firstChar, rest) => firstChar.toUpperCase() + rest.toLowerCase()
    )
    .replace(/\s+|_+|-+/g, "");
}
export function addSpaces(str: string) {
  return str.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase();
}

// from pascal, snake ,kebab to title case
export function toTitleCase(str: string) {
  return str
    .replace(/([A-Z])/g, " $1")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
