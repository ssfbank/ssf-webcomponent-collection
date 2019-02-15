
export function format(first: string, middle: string, last: string): string {
  return (
    (first || '') +
    (middle ? ` ${middle}` : '') +
    (last ? ` ${last}` : '')
  );
}

export function toBoolean(val) {
  if (val === '') {
    return val
  }

  return val === 'true' || val == '1'
}
