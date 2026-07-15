import { describe, it, expect } from 'vitest';

function getPrimitiveType(value: any): string {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (typeof value === 'string') return 'string';
  if (typeof value === 'number') return 'number';
  if (typeof value === 'boolean') return 'boolean';
  return 'any';
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function generateInterface(obj: any, name: string): string {
  const lines: string[] = [`export interface ${name} {`];
  for (const [key, value] of Object.entries(obj)) {
    const tsType = getPrimitiveType(value);
    lines.push(`  ${key}: ${tsType};`);
  }
  lines.push('}');
  return lines.join('\n');
}

describe('JSON to TypeScript', () => {
  describe('getPrimitiveType', () => {
    it('should return string for strings', () => {
      expect(getPrimitiveType('hello')).toBe('string');
    });

    it('should return number for numbers', () => {
      expect(getPrimitiveType(42)).toBe('number');
    });

    it('should return number for floats', () => {
      expect(getPrimitiveType(3.14)).toBe('number');
    });

    it('should return boolean for booleans', () => {
      expect(getPrimitiveType(true)).toBe('boolean');
      expect(getPrimitiveType(false)).toBe('boolean');
    });

    it('should return null for null', () => {
      expect(getPrimitiveType(null)).toBe('null');
    });

    it('should return any for objects', () => {
      expect(getPrimitiveType({})).toBe('any');
    });
  });

  describe('capitalize', () => {
    it('should capitalize first letter', () => {
      expect(capitalize('name')).toBe('Name');
      expect(capitalize('firstName')).toBe('FirstName');
    });

    it('should handle single char', () => {
      expect(capitalize('a')).toBe('A');
    });
  });

  describe('generateInterface', () => {
    it('should generate interface from simple object', () => {
      const result = generateInterface({ name: 'John', age: 30 }, 'User');
      expect(result).toContain('export interface User {');
      expect(result).toContain('name: string;');
      expect(result).toContain('age: number;');
      expect(result).toContain('}');
    });

    it('should handle empty object', () => {
      const result = generateInterface({}, 'Empty');
      expect(result).toContain('export interface Empty {');
      expect(result).toContain('}');
    });
  });
});
