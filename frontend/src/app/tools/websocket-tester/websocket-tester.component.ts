import { Component, inject, signal, OnDestroy, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CopyButtonComponent } from '../../core/components/copy-button.component';
import { ClipboardService } from '../../core/services/clipboard.service';

interface WsMessage {
  id: number;
  type: 'sent' | 'received' | 'error' | 'info';
  content: string;
  timestamp: string;
}

@Component({
  selector: 'app-websocket-tester',
  imports: [FormsModule, CopyButtonComponent],
  templateUrl: './websocket-tester.component.html',
  styleUrl: './websocket-tester.component.scss'
})
export class WebsocketTesterComponent implements OnDestroy {
  readonly url = signal('ws://localhost:3000');
  readonly message = signal('');
  readonly customHeaders = signal('');
  readonly autoReconnect = signal(false);
  readonly messages = signal<WsMessage[]>([]);
  readonly connected = signal(false);
  readonly connecting = signal(false);
  private ws: WebSocket | null = null;
  private msgId = 0;
  private readonly clipboard = inject(ClipboardService);

  connect(): void {
    if (this.connected()) {
      this.disconnect();
      return;
    }

    this.connecting.set(true);
    this.addMessage('info', `Conectando a ${this.url()}...`);

    try {
      this.ws = new WebSocket(this.url());

      this.ws.onopen = () => {
        this.connected.set(true);
        this.connecting.set(false);
        this.addMessage('info', 'Conectado com sucesso');
      };

      this.ws.onmessage = (event) => {
        this.addMessage('received', typeof event.data === 'string' ? event.data : String(event.data));
      };

      this.ws.onerror = (event) => {
        this.addMessage('error', 'Erro na conexão WebSocket');
      };

      this.ws.onclose = (event) => {
        this.connected.set(false);
        this.connecting.set(false);
        this.addMessage('info', `Conexão fechada (código: ${event.code})`);

        if (this.autoReconnect() && !event.wasClean) {
          setTimeout(() => this.connect(), 3000);
        }
      };
    } catch (e: any) {
      this.connecting.set(false);
      this.addMessage('error', `Erro ao conectar: ${e.message}`);
    }
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.connected.set(false);
    this.connecting.set(false);
  }

  sendMessage(): void {
    if (!this.connected() || !this.ws) return;

    const msg = this.message();
    if (!msg.trim()) return;

    this.ws.send(msg);
    this.addMessage('sent', msg);
    this.message.set('');
  }

  private addMessage(type: WsMessage['type'], content: string): void {
    const now = new Date();
    const timestamp = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const newMsg: WsMessage = { id: ++this.msgId, type, content, timestamp };
    const updated = [...this.messages(), newMsg];
    if (updated.length > 200) {
      updated.splice(0, updated.length - 200);
    }
    this.messages.set(updated);
  }

  async copyMessages(): Promise<void> {
    const text = this.messages().map(m => {
      const prefix = m.type === 'sent' ? '→' : m.type === 'received' ? '←' : m.type === 'error' ? '✗' : '•';
      return `[${m.timestamp}] ${prefix} ${m.content}`;
    }).join('\n');
    await this.clipboard.copy(text);
  }

  clearMessages(): void {
    this.messages.set([]);
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(e: KeyboardEvent): void {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      this.connect();
    }
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
}
