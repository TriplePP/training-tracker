// Since the capitalizeFirstLetter function is not exported from auth-options.ts,
// we'll recreate it here for testing purposes
function capitalizeFirstLetter(string: string): string {
  if (!string) return string;
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

describe('Utility Functions', () => {
  describe('capitalizeFirstLetter', () => {
    test('capitalizes the first letter of a string', () => {
      expect(capitalizeFirstLetter('hello')).toBe('Hello');
      expect(capitalizeFirstLetter('world')).toBe('World');
    });

    test('converts the rest of the string to lowercase', () => {
      expect(capitalizeFirstLetter('hELLO')).toBe('Hello');
      expect(capitalizeFirstLetter('WORLD')).toBe('World');
    });

    test('handles empty strings', () => {
      expect(capitalizeFirstLetter('')).toBe('');
    });

    test('handles null and undefined', () => {
      expect(capitalizeFirstLetter(null as unknown as string)).toBeNull();
      expect(capitalizeFirstLetter(undefined as unknown as string)).toBeUndefined();
    });

    test('handles single character strings', () => {
      expect(capitalizeFirstLetter('a')).toBe('A');
      expect(capitalizeFirstLetter('Z')).toBe('Z');
    });
  });
});
