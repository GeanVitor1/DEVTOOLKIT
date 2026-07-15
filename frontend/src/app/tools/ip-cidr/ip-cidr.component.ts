import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ip-cidr',
  imports: [FormsModule],
  templateUrl: './ip-cidr.component.html',
  styleUrl: './ip-cidr.component.scss'
})
export class IpCidrComponent {
  readonly input = signal('');
  readonly network = signal('');
  readonly netmask = signal('');
  readonly wildcard = signal('');
  readonly binary = signal('');
  readonly firstHost = signal('');
  readonly lastHost = signal('');
  readonly broadcast = signal('');
  readonly totalHosts = signal('');
  readonly hostsUsable = signal('');
  readonly cidrClass = signal('');
  readonly error = signal('');

  calculate(): void {
    const text = this.input().trim();
    if (!text) {
      this.clear();
      return;
    }

    try {
      const parsed = this.parseCIDR(text);
      if (!parsed) throw new Error('Notação CIDR inválida');

      const { ip, prefix } = parsed;
      const ipNum = this.ipToNum(ip);
      const maskNum = ~(2 ** (32 - prefix) - 1);
      const networkNum = ipNum & maskNum;
      const broadcastNum = networkNum | ~maskNum;

      this.network.set(this.numToIp(networkNum));
      this.netmask.set(this.numToIp(maskNum >>> 0));
      this.wildcard.set(this.numToIp((~maskNum) >>> 0));
      this.binary.set(this.ipToBinary(this.network()) + ' / ' + prefix);
      this.firstHost.set(this.numToIp(networkNum + 1));
      this.lastHost.set(this.numToIp(broadcastNum - 1));
      this.broadcast.set(this.numToIp(broadcastNum));
      this.totalHosts.set((2 ** (32 - prefix)).toLocaleString());
      this.hostsUsable.set(Math.max(0, 2 ** (32 - prefix) - 2).toLocaleString());

      const firstOctet = parseInt(ip[0]);
      if (firstOctet < 128) this.cidrClass.set('A');
      else if (firstOctet < 192) this.cidrClass.set('B');
      else if (firstOctet < 224) this.cidrClass.set('C');
      else if (firstOctet < 240) this.cidrClass.set('D');
      else this.cidrClass.set('E');

      this.error.set('');
    } catch {
      this.error.set('Notação CIDR inválida. Ex: 192.168.1.0/24');
      this.clear();
    }
  }

  private parseCIDR(text: string): { ip: string[]; prefix: number } | null {
    const parts = text.split('/');
    if (parts.length !== 2) return null;

    const ip = parts[0].split('.');
    if (ip.length !== 4) return null;
    for (const oct of ip) {
      const n = parseInt(oct);
      if (isNaN(n) || n < 0 || n > 255) return null;
    }

    const prefix = parseInt(parts[1]);
    if (isNaN(prefix) || prefix < 0 || prefix > 32) return null;

    return { ip, prefix };
  }

  private ipToNum(parts: string[]): number {
    return (parseInt(parts[0]) << 24) | (parseInt(parts[1]) << 16) | (parseInt(parts[2]) << 8) | parseInt(parts[3]);
  }

  private numToIp(num: number): string {
    return [
      (num >>> 24) & 0xFF,
      (num >>> 16) & 0xFF,
      (num >>> 8) & 0xFF,
      num & 0xFF
    ].join('.');
  }

  private ipToBinary(ip: string): string {
    return ip.split('.').map(o => parseInt(o).toString(2).padStart(8, '0')).join('.');
  }

  private clear(): void {
    this.network.set('');
    this.netmask.set('');
    this.wildcard.set('');
    this.binary.set('');
    this.firstHost.set('');
    this.lastHost.set('');
    this.broadcast.set('');
    this.totalHosts.set('');
    this.hostsUsable.set('');
    this.cidrClass.set('');
  }
}
