import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CopyButtonComponent } from '../../core/components/copy-button.component';

interface StatusCode {
  code: number;
  name: string;
  description: string;
  category: string;
}

const STATUS_CODES: StatusCode[] = [
  { code: 100, name: 'Continue', description: 'O servidor recebeu os headers e o cliente pode continuar enviando o body.', category: '1xx Informational' },
  { code: 101, name: 'Switching Protocols', description: 'O servidor aceita trocar de protocolo (ex: upgrade para WebSocket).', category: '1xx Informational' },
  { code: 200, name: 'OK', description: 'Requisição bem-sucedida. Resposta padrão para GET/POST bem-sucedidos.', category: '2xx Success' },
  { code: 201, name: 'Created', description: 'Recurso criado com sucesso. Comum em POST que cria entidades.', category: '2xx Success' },
  { code: 202, name: 'Accepted', description: 'Requisição aceita para processamento assíncrono.', category: '2xx Success' },
  { code: 204, name: 'No Content', description: 'Sucesso sem corpo de resposta. Comum em DELETE e PUT.', category: '2xx Success' },
  { code: 206, name: 'Partial Content', description: 'Resposta parcial de um recurso (Range requests).', category: '2xx Success' },
  { code: 301, name: 'Moved Permanently', description: 'Recurso movido de forma permanente. SEO e caches devem atualizar a URL.', category: '3xx Redirection' },
  { code: 302, name: 'Found', description: 'Redirecionamento temporário. O método pode mudar para GET.', category: '3xx Redirection' },
  { code: 304, name: 'Not Modified', description: 'Recurso não mudou desde o If-None-Match / If-Modified-Since.', category: '3xx Redirection' },
  { code: 307, name: 'Temporary Redirect', description: 'Redirecionamento temporário preservando o método HTTP.', category: '3xx Redirection' },
  { code: 308, name: 'Permanent Redirect', description: 'Redirecionamento permanente preservando o método HTTP.', category: '3xx Redirection' },
  { code: 400, name: 'Bad Request', description: 'Sintaxe inválida, JSON malformado ou validação falhou.', category: '4xx Client Error' },
  { code: 401, name: 'Unauthorized', description: 'Autenticação ausente ou inválida. Envie credentials.', category: '4xx Client Error' },
  { code: 403, name: 'Forbidden', description: 'Autenticado, mas sem permissão para o recurso.', category: '4xx Client Error' },
  { code: 404, name: 'Not Found', description: 'Recurso não existe ou rota não encontrada.', category: '4xx Client Error' },
  { code: 405, name: 'Method Not Allowed', description: 'Método HTTP não suportado para este endpoint.', category: '4xx Client Error' },
  { code: 408, name: 'Request Timeout', description: 'O servidor expirou esperando a requisição completa.', category: '4xx Client Error' },
  { code: 409, name: 'Conflict', description: 'Conflito de estado (ex: recurso já existe, versão desatualizada).', category: '4xx Client Error' },
  { code: 410, name: 'Gone', description: 'Recurso existia, mas foi removido permanentemente.', category: '4xx Client Error' },
  { code: 413, name: 'Payload Too Large', description: 'Body da requisição excede o limite do servidor.', category: '4xx Client Error' },
  { code: 415, name: 'Unsupported Media Type', description: 'Content-Type não suportado (ex: enviou XML, esperava JSON).', category: '4xx Client Error' },
  { code: 422, name: 'Unprocessable Entity', description: 'Sintaxe OK, mas semântica inválida (validação de domínio).', category: '4xx Client Error' },
  { code: 429, name: 'Too Many Requests', description: 'Rate limit atingido. Respeite Retry-After.', category: '4xx Client Error' },
  { code: 500, name: 'Internal Server Error', description: 'Erro genérico no servidor. Verifique logs e stack traces.', category: '5xx Server Error' },
  { code: 501, name: 'Not Implemented', description: 'Método ou funcionalidade não implementada no servidor.', category: '5xx Server Error' },
  { code: 502, name: 'Bad Gateway', description: 'Gateway/proxy recebeu resposta inválida do upstream.', category: '5xx Server Error' },
  { code: 503, name: 'Service Unavailable', description: 'Serviço temporariamente indisponível (manutenção, overload).', category: '5xx Server Error' },
  { code: 504, name: 'Gateway Timeout', description: 'Gateway/proxy não recebeu resposta a tempo do upstream.', category: '5xx Server Error' },
];

@Component({
  selector: 'app-http-status',
  imports: [FormsModule, CopyButtonComponent],
  templateUrl: './http-status.component.html',
  styleUrl: './http-status.component.scss'
})
export class HttpStatusComponent {
  readonly query = signal('');
  readonly category = signal('all');

  readonly categories = [
    'all',
    '1xx Informational',
    '2xx Success',
    '3xx Redirection',
    '4xx Client Error',
    '5xx Server Error',
  ];

  readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    const cat = this.category();
    return STATUS_CODES.filter(s => {
      if (cat !== 'all' && s.category !== cat) return false;
      if (!q) return true;
      return (
        String(s.code).includes(q) ||
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
      );
    });
  });

  categoryColor(cat: string): string {
    if (cat.startsWith('1')) return 'var(--dtk-info)';
    if (cat.startsWith('2')) return 'var(--dtk-success)';
    if (cat.startsWith('3')) return 'var(--dtk-warning)';
    if (cat.startsWith('4')) return 'var(--dtk-color)';
    if (cat.startsWith('5')) return 'var(--dtk-error)';
    return 'var(--dtk-text-muted)';
  }
}
