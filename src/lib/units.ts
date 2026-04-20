export function generateUnitNumbers(floors: number, unitsPerFloor: number): string[] {
  const units: string[] = [];
  for (let piso = Math.max(1, floors); piso >= 1; piso--) {
    for (let u = 1; u <= Math.max(1, unitsPerFloor); u++) {
      units.push(`${piso}${String(u).padStart(2, '0')}`);
    }
  }
  return units;
}
