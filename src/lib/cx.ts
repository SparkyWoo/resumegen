type ClassValue = string | number | boolean | undefined | null;
type ClassArray = ClassValue[];
type ClassObject = { [key: string]: any };
type ClassInput = ClassValue | ClassArray | ClassObject;

/**
 * Concatenates and deduplicates className strings
 * @param inputs - Any number of className strings, arrays, or objects
 * @returns A single className string
 */
export function cx(...inputs: ClassInput[]): string {
  const classes = new Set<string>();

  for (const input of inputs) {
    if (!input) continue;

    if (typeof input === 'string') {
      input.split(' ').filter(Boolean).forEach(c => classes.add(c));
    } else if (Array.isArray(input)) {
      input.forEach(i => {
        if (i) classes.add(String(i));
      });
    } else if (typeof input === 'object') {
      Object.entries(input).forEach(([key, value]) => {
        if (value) classes.add(key);
      });
    }
  }

  return Array.from(classes).join(' ');
} 