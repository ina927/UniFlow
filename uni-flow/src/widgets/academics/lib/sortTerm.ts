export const sortTerm = <
  T extends { academicYear?: number | null; title?: string | null }
>(
  a: T,
  b: T
) => {
  const yA = a.academicYear ?? 0;
  const yB = b.academicYear ?? 0;
  if (yA !== yB) return yB - yA;

  const tA = (a.title ?? "").toLocaleLowerCase();
  const tB = (b.title ?? "").toLocaleLowerCase();
  return tB.localeCompare(tA);
};

