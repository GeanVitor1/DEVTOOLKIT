import { describe, it, expect } from 'vitest';

function ipToNum(parts: number[]): number {
  return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
}

function numToIp(num: number): string {
  return [(num >>> 24) & 255, (num >>> 16) & 255, (num >>> 8) & 255, num & 255].join('.');
}

function getIpClass(firstOctet: number): string {
  if (firstOctet < 128) return 'A';
  if (firstOctet < 192) return 'B';
  if (firstOctet < 224) return 'C';
  if (firstOctet < 240) return 'D (Multicast)';
  return 'E (Reservado)';
}

describe('IP Calculator', () => {
  describe('ipToNum', () => {
    it('should convert 192.168.1.0 to number', () => {
      expect(ipToNum([192, 168, 1, 0])).toBe(3232235776);
    });

    it('should convert 10.0.0.1 to number', () => {
      expect(ipToNum([10, 0, 0, 1])).toBe(167772161);
    });

    it('should convert 0.0.0.0 to 0', () => {
      expect(ipToNum([0, 0, 0, 0])).toBe(0);
    });

    it('should convert 255.255.255.255 to max uint32', () => {
      expect(ipToNum([255, 255, 255, 255])).toBe(4294967295);
    });
  });

  describe('numToIp', () => {
    it('should convert number to 192.168.1.0', () => {
      expect(numToIp(3232235776)).toBe('192.168.1.0');
    });

    it('should convert 0 to 0.0.0.0', () => {
      expect(numToIp(0)).toBe('0.0.0.0');
    });
  });

  describe('getIpClass', () => {
    it('should return A for 10.x.x.x', () => {
      expect(getIpClass(10)).toBe('A');
    });

    it('should return B for 172.x.x.x', () => {
      expect(getIpClass(172)).toBe('B');
    });

    it('should return C for 192.x.x.x', () => {
      expect(getIpClass(192)).toBe('C');
    });

    it('should return D for 224.x.x.x', () => {
      expect(getIpClass(224)).toBe('D (Multicast)');
    });

    it('should return E for 240.x.x.x', () => {
      expect(getIpClass(240)).toBe('E (Reservado)');
    });
  });

  describe('subnet calculations', () => {
    it('should calculate /24 network', () => {
      const cidr = 24;
      const mask = (~0 << (32 - cidr)) >>> 0;
      const ip = ipToNum([192, 168, 1, 100]);
      const network = (ip & mask) >>> 0;
      const broadcast = (network | ~mask) >>> 0;

      expect(numToIp(network)).toBe('192.168.1.0');
      expect(numToIp(broadcast)).toBe('192.168.1.255');
      expect(Math.pow(2, 32 - cidr) - 2).toBe(254);
    });

    it('should calculate /16 network', () => {
      const cidr = 16;
      const mask = (~0 << (32 - cidr)) >>> 0;
      const ip = ipToNum([172, 16, 5, 200]);
      const network = (ip & mask) >>> 0;

      expect(numToIp(network)).toBe('172.16.0.0');
      expect(Math.pow(2, 32 - cidr) - 2).toBe(65534);
    });

    it('should calculate /8 network', () => {
      const cidr = 8;
      const mask = (~0 << (32 - cidr)) >>> 0;
      const ip = ipToNum([10, 200, 100, 50]);
      const network = (ip & mask) >>> 0;

      expect(numToIp(network)).toBe('10.0.0.0');
      expect(Math.pow(2, 32 - cidr) - 2).toBe(16777214);
    });
  });
});
