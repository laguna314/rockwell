export function formatCurrency(cents: number | null | undefined): string {
  if (cents == null) return "See details";
  return `$${(cents / 100).toFixed(2)}`;
}

export function formatDateTime(value: string | null | undefined): string {
  if (!value) return "";
  return new Date(value).toLocaleString();
}