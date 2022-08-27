export function stripNullValues(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(stripNullValues);
  }
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, value]) => [
        key,
        stripNullValues(value),
      ]),
    );
  }
  if (value !== null) {
    return value;
  }
}
