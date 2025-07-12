export async function getCurrencySymbol() {
  try {
    const res = await fetch("https://ipapi.co/json");
    const data = await res.json();
    return data.currency_symbol || "₦";
  } catch (err) {
    console.error("Currency detection failed:", err);
    return "₦"; // fallback
  }
}
