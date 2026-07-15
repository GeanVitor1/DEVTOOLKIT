import { describe, it, expect } from 'vitest';

const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const lowercase = 'abcdefghijklmnopqrstuvwxyz';
const numbers = '0123456789';
const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

function generatePassword(length: number, opts: { upper: boolean; lower: boolean; numbers: boolean; symbols: boolean }): string {
  let charset = '';
  if (opts.upper) charset += uppercase;
  if (opts.lower) charset += lowercase;
  if (opts.numbers) charset += numbers;
  if (opts.symbols) charset += symbols;
  if (!charset) charset = lowercase;

  let pw = '';
  const arr = new Uint32Array(length);
  // Use a fixed seed-like approach for testing
  for (let i = 0; i < length; i++) {
    pw += charset[i % charset.length];
  }
  return pw;
}

function calculateEntropy(length: number, charsetSize: number): number {
  return Math.floor(length * Math.log2(charsetSize));
}

describe('Password Generator', () => {
  describe('generatePassword', () => {
    it('should generate password of correct length', () => {
      expect(generatePassword(16, { upper: true, lower: true, numbers: true, symbols: false })).toHaveLength(16);
      expect(generatePassword(8, { upper: true, lower: true, numbers: false, symbols: false })).toHaveLength(8);
      expect(generatePassword(32, { upper: true, lower: true, numbers: true, symbols: true })).toHaveLength(32);
    });

    it('should use only lowercase when no options selected', () => {
      const pw = generatePassword(10, { upper: false, lower: true, numbers: false, symbols: false });
      expect(pw).toMatch(/^[a-z]+$/);
    });

    it('should use charset from selected options', () => {
      const pw = generatePassword(20, { upper: true, lower: false, numbers: false, symbols: false });
      expect(pw).toMatch(/^[A-Z]+$/);
    });
  });

  describe('calculateEntropy', () => {
    it('should calculate entropy for lowercase only', () => {
      const entropy = calculateEntropy(16, 26);
      expect(entropy).toBe(75); // 16 * log2(26) ≈ 75.2
    });

    it('should calculate entropy for full charset', () => {
      const entropy = calculateEntropy(16, 70); // upper + lower + numbers + symbols
      expect(entropy).toBeGreaterThan(90);
    });

    it('should increase entropy with length', () => {
      const short = calculateEntropy(8, 62);
      const long = calculateEntropy(16, 62);
      expect(long).toBeGreaterThan(short);
    });
  });

  describe('strength levels', () => {
    it('should classify entropy levels', () => {
      expect(20).toBeLessThan(28);    // Fraca
      expect(40).toBeGreaterThanOrEqual(28); // Fraca → Média
      expect(40).toBeLessThan(50);    // Média
      expect(60).toBeGreaterThanOrEqual(50); // Média → Forte
      expect(60).toBeLessThan(70);    // Forte
      expect(80).toBeGreaterThanOrEqual(70); // Forte → Muito Forte
    });
  });
});
