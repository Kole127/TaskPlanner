export function sortByDate(arr) {
  return arr.sort((a, b) => new Date(a.date) - new Date(b.date));
}
