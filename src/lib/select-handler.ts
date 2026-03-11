/**
 * Wraps a Select onValueChange handler to handle base-ui's nullable signature.
 * base-ui Select passes (value: string | null, eventDetails) but we only need the string.
 */
export function onSelectChange(handler: (value: string) => void) {
  return (value: string | null) => {
    if (value !== null) handler(value);
  };
}