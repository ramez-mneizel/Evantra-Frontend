export const CATEGORIES = ["Music", "Conference", "Workshop", "Food", "Sports", "Art"];

export const formatDate = (d) => (d ? new Date(d).toLocaleDateString("en-GB") : "");

export const formatPrice = (p) => (p > 0 ? `$${p}` : "Free");
