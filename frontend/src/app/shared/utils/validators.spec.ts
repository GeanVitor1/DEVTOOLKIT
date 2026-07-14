import { isJson, isJwt, isUrl } from './validators';

describe('isJson', () => {
  it('should return true for valid JSON', () => {
    expect(isJson('{"key": "value"}')).toBe(true);
    expect(isJson('[]')).toBe(true);
    expect(isJson('123')).toBe(true);
  });

  it('should return false for invalid JSON', () => {
    expect(isJson('{invalid}')).toBe(false);
    expect(isJson('')).toBe(false);
  });
});

describe('isJwt', () => {
  it('should return true for valid JWT format', () => {
    expect(isJwt('header.payload.signature')).toBe(true);
  });

  it('should return false for invalid JWT format', () => {
    expect(isJwt('not-a-jwt')).toBe(false);
    expect(isJwt('')).toBe(false);
  });
});

describe('isUrl', () => {
  it('should return true for valid URLs', () => {
    expect(isUrl('https://example.com')).toBe(true);
    expect(isUrl('http://localhost:3000')).toBe(true);
  });

  it('should return false for invalid URLs', () => {
    expect(isUrl('not-a-url')).toBe(false);
    expect(isUrl('')).toBe(false);
  });
});
