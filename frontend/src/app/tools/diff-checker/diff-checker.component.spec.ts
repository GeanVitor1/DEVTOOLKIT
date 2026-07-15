import { describe, it, expect } from 'vitest';

function computeLCS(a: string[], b: string[]): number[][] {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  return dp;
}

function diffLines(oldLines: string[], newLines: string[]): { type: string; content: string }[] {
  const dp = computeLCS(oldLines, newLines);
  const result: { type: string; content: string }[] = [];
  let i = oldLines.length, j = newLines.length;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldLines[i - 1] === newLines[j - 1]) {
      result.unshift({ type: 'unchanged', content: oldLines[i - 1] });
      i--; j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.unshift({ type: 'added', content: newLines[j - 1] });
      j--;
    } else {
      result.unshift({ type: 'removed', content: oldLines[i - 1] });
      i--;
    }
  }
  return result;
}

describe('Diff Checker', () => {
  describe('computeLCS', () => {
    it('should compute LCS for identical arrays', () => {
      const dp = computeLCS(['a', 'b', 'c'], ['a', 'b', 'c']);
      expect(dp[3][3]).toBe(3);
    });

    it('should compute LCS for completely different arrays', () => {
      const dp = computeLCS(['a', 'b'], ['c', 'd']);
      expect(dp[2][2]).toBe(0);
    });

    it('should compute LCS for partial match', () => {
      const dp = computeLCS(['a', 'b', 'c'], ['a', 'c']);
      expect(dp[3][2]).toBe(2);
    });
  });

  describe('diffLines', () => {
    it('should return no changes for identical input', () => {
      const result = diffLines(['a', 'b'], ['a', 'b']);
      expect(result.every(r => r.type === 'unchanged')).toBe(true);
    });

    it('should detect added lines', () => {
      const result = diffLines(['a'], ['a', 'b']);
      const added = result.filter(r => r.type === 'added');
      expect(added).toHaveLength(1);
      expect(added[0].content).toBe('b');
    });

    it('should detect removed lines', () => {
      const result = diffLines(['a', 'b'], ['a']);
      const removed = result.filter(r => r.type === 'removed');
      expect(removed).toHaveLength(1);
      expect(removed[0].content).toBe('b');
    });

    it('should detect modified content', () => {
      const result = diffLines(['hello', 'world'], ['hello', 'earth']);
      expect(result).toHaveLength(3);
      expect(result[0].type).toBe('unchanged');
      expect(result[1].type).toBe('removed');
      expect(result[1].content).toBe('world');
      expect(result[2].type).toBe('added');
      expect(result[2].content).toBe('earth');
    });
  });
});
