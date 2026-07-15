import { Component, inject, signal, computed, HostListener } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CopyButtonComponent } from '../../core/components/copy-button.component';
import { ClipboardService } from '../../core/services/clipboard.service';

interface IpResult {
  networkAddress: string;
  broadcastAddress: string;
  subnetMask: string;
  wildcardMask: string;
  firstHost: string;
  lastHost: string;
  totalHosts: number;
  ipClass: string;
  cidr: number;
  binaryIp: string;
  binaryMask: string;
}

@Component({
  selector: 'app-ip-calculator',
  imports: [FormsModule, CopyButtonComponent, DecimalPipe],
  templateUrl: './ip-calculator.component.html',
  styleUrl: './ip-calculator.component.scss'
})
export class IpCalculatorComponent {
  readonly input = signal('192.168.1.0/24');
  readonly result = signal<IpResult | null>(null);
  readonly error = signal('');
  private readonly clipboard = inject(ClipboardService);

  readonly presets = signal([
    { label: 'Classe A', value: '10.0.0.0/8' },
    { label: 'Classe B', value: '172.16.0.0/16' },
    { label: 'Classe C', value: '192.168.1.0/24' },
    { label: '/16', value: '10.0.0.0/16' },
    { label: '/20', value: '192.168.0.0/20' },
    { label: '/28', value: '192.168.1.0/28' },
  ]);

  calculate(): void {
    this.error.set('');
    this.result.set(null);

    const input = this.input().trim();
    const match = input.match(/^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\/(\d{1,2})$/);
    if (!match) {
      this.error.set('Formato inválido. Use: IP/CIDR (ex: 192.168.1.0/24)');
      return;
    }

    const ipParts = match[1].split('.').map(Number);
    const cidr = parseInt(match[2]);

    if (ipParts.some(p => p < 0 || p > 255) || cidr < 0 || cidr > 32) {
      this.error.set('IP ou CIDR fora do range válido');
      return;
    }

    const ipNum = this.ipToNum(ipParts);
    const mask = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
    const network = (ipNum & mask) >>> 0;
    const broadcast = (network | ~mask) >>> 0;

    const ipClass = this.getIpClass(ipParts[0]);

    this.result.set({
      networkAddress: this.numToIp(network),
      broadcastAddress: this.numToIp(broadcast),
      subnetMask: this.numToIp(mask),
      wildcardMask: this.numToIp((~mask) >>> 0),
      firstHost: cidr >= 31 ? this.numToIp(network) : this.numToIp((network + 1) >>> 0),
      lastHost: cidr >= 31 ? this.numToIp(broadcast) : this.numToIp((broadcast - 1) >>> 0),
      totalHosts: cidr >= 31 ? (cidr === 32 ? 1 : 2) : Math.pow(2, 32 - cidr) - 2,
      ipClass,
      cidr,
      binaryIp: this.toBinary(ipParts),
      binaryMask: this.numToBinary(mask),
    });
  }

  private ipToNum(parts: number[]): number {
    return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
  }

  private numToIp(num: number): string {
    return [
      (num >>> 24) & 255,
      (num >>> 16) & 255,
      (num >>> 8) & 255,
      num & 255
    ].join('.');
  }

  private numToBinary(num: number): string {
    const parts: string[] = [];
    for (let i = 3; i >= 0; i--) {
      parts.push(((num >>> (i * 8)) & 255).toString(2).padStart(8, '0'));
    }
    return parts.join('.');
  }

  private toBinary(parts: number[]): string {
    return parts.map(p => p.toString(2).padStart(8, '0')).join('.');
  }

  private getIpClass(firstOctet: number): string {
    if (firstOctet < 128) return 'A';
    if (firstOctet < 192) return 'B';
    if (firstOctet < 224) return 'C';
    if (firstOctet < 240) return 'D (Multicast)';
    return 'E (Reservado)';
  }

  async copyResult(): Promise<void> {
    const r = this.result();
    if (!r) return;
    const text = [
      `Rede: ${r.networkAddress}/${r.cidr}`,
      `Broadcast: ${r.broadcastAddress}`,
      `Máscara: ${r.subnetMask}`,
      `Wildcard: ${r.wildcardMask}`,
      `Primeiro Host: ${r.firstHost}`,
      `Último Host: ${r.lastHost}`,
      `Total de Hosts: ${r.totalHosts}`,
      `Classe: ${r.ipClass}`,
    ].join('\n');
    await this.clipboard.copy(text);
  }

  clear(): void {
    this.input.set('');
    this.result.set(null);
    this.error.set('');
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(e: KeyboardEvent): void {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      this.calculate();
    }
  }
}
