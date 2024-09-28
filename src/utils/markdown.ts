export function countWordsInMarkdown(markdown: string) {
  // Remove Markdown syntax (headings, bold, italics, links, code blocks, etc.)
  const plainText = markdown
    .replace(/(\*\*|__)(.*?)\1/g, "") // Remove bold
    .replace(/(\*|_)(.*?)\1/g, "") // Remove italics
    .replace(/!\[.*?\]\(.*?\)/g, "") // Remove images
    .replace(/\[.*?\]\(.*?\)/g, "") // Remove links
    .replace(/`{1,3}.*?`{1,3}/g, "") // Remove inline code
    .replace(/```[\s\S]*?```/g, "") // Remove code blocks
    .replace(/^-{3,}/g, "") // Remove horizontal lines
    .replace(/^[#]{1,6}\s/gm, "") // Remove headings
    .replace(/>\s/g, "") // Remove blockquotes
    .replace(/(\r\n|\n|\r)/gm, " ") // Replace line breaks with spaces
    .replace(/\s+/g, " ") // Replace multiple spaces with a single space
    .trim();

  // Split by spaces and filter out any empty strings
  const words = plainText.split(" ").filter((word) => word.length > 0);

  // Return word count
  return words.length;
}
