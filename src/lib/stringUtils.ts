export const buildURL = <T extends Record<string, string | number>>(
  template: string,
  values: T
): string => {
  return template.replace(/\${(.*?)}/g, (_, key: string) => {
    return key in values ? String(values[key as keyof T]) : '';
  });
};

export function getPreviewText(html: string): string {
  // Remove HTML tags
  const text = html.replace(/<[^>]*>/g, '');

  // Trim and split into words
  const words = text.trim().split(/\s+/);

  // Limit to 100 words
  const preview = words.slice(0, 50).join(' ');

  // Add ellipsis if there are more than 100 words
  return words.length > 50 ? preview + '…' : preview;
}
