export function formatWhatsAppUrl(input: string): string {
  if (!input?.trim()) return "";

  const trimmed = input.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  const phone = trimmed.replace(/\D/g, "");
  if (!phone) return "";

  return `https://wa.me/${phone}`;
}
