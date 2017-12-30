export const shortDate = (date: Date) =>
  `${date.toLocaleDateString("en", { day: "numeric" })} ${date.toLocaleDateString("en", { year: "numeric", month: "long" })}`;

export const shortDateStylized = (date: Date) =>
  `YMD | ${date.toLocaleDateString("en", { year: "numeric" })}-${date.toLocaleDateString("en", { month: "numeric" })}-${date.toLocaleDateString("en", { day: "numeric" })} `;
