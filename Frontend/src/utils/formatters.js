export function formatCGPA(value) {
  if (value === null || value === undefined) return "—";
  return Number(value).toFixed(2);
}

export function formatDate(dateString) {
  if (!dateString) return "—";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatPercent(value) {
  if (value === null || value === undefined) return "—";
  return `${Math.round(value)}%`;
}
