/* eslint-disable @typescript-eslint/no-unused-vars */
export function getEnumLabels<T extends Record<string, string | number>>(enumObj: T): Record<number, string> {
  return Object.fromEntries(
    Object.entries(enumObj)
      .filter(([_, value]) => typeof value === 'number')
      .map(([key, value]) => [value as number, key])
  )
}
