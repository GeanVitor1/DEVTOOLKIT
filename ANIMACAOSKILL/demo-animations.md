# Demo Animations Skill

Padrões de animação para cards interativos em loop automático (tipo vídeo demo).

## Dependências

- **GSAP** — `import gsap from 'gsap';`
- **Angular signals** — `signal()`, `computed()`
- **IntersectionObserver** — só inicia animação quando o card fica visível

## Padrão 1: Loop Infinito com IntersectionObserver

```typescript
private started = false;

constructor() {
  afterNextRender(() => {
    const el = this.containerRef()?.nativeElement;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting && !this.started) {
        this.started = true;
        obs.disconnect();
        this.loop();
      }
    }, { threshold: 0.25 });
    obs.observe(el);
  });
}

private wait(ms: number) { return new Promise(r => setTimeout(r, ms)); }

private async loop() {
  while (true) {
    // 1. Reseta estado
    // 2. Anima entrada
    // 3. Ações automatizadas
    // 4. Pausa
    // 5. Repete
  }
}
```

## Padrão 2: Cursor Animado

Cursor que se move e clica em elementos automaticamente.

### Template

```html
<div class="container" #container>
  <div class="demo-cursor" [class.show]="cursorVisible()">
    <svg width="18" height="24" viewBox="0 0 18 24" fill="none">
      <defs>
        <filter id="cursorShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="1" stdDeviation="1.5" flood-opacity="0.35"/>
        </filter>
      </defs>
      <path d="M2 2L2 19L6.5 14.5L9.5 21L12 20L9 13.5L16 13.5L2 2Z"
            fill="#222" stroke="#fff" stroke-width="1.2" stroke-linejoin="round"
            filter="url(#cursorShadow)"/>
    </svg>
  </div>
  <!-- conteúdo do card -->
</div>
```

### CSS

```css
.container { position: relative; }

.demo-cursor {
  position: absolute;
  z-index: 20;
  pointer-events: none;
  opacity: 0;
  transform: translate(-50%, -10%);
  transition:
    left 0.45s cubic-bezier(0.34, 1.56, 0.64, 1),
    top 0.45s cubic-bezier(0.34, 1.56, 0.64, 1),
    opacity 0.15s;
}
.demo-cursor.show { opacity: 1; }
```

### TypeScript

```typescript
readonly cursorVisible = signal(false);

private moveCursor(container: HTMLElement, x: number, y: number) {
  const cursorEl = container.querySelector('.demo-cursor') as HTMLElement;
  if (!cursorEl) return;
  cursorEl.style.left = x + 'px';
  cursorEl.style.top = y + 'px';
  this.cursorVisible.set(true);
}

private async clickElement(container: HTMLElement, selector: string) {
  const el = container.querySelector(selector) as HTMLElement;
  if (!el) return;

  const containerRect = container.getBoundingClientRect();
  const elRect = el.getBoundingClientRect();
  const x = elRect.left - containerRect.left + elRect.width / 2;
  const y = elRect.top - containerRect.top + elRect.height / 2;

  this.moveCursor(container, x, y);
  await this.wait(450);

  // Efeito de clique
  el.style.transition = 'transform 0.12s ease';
  el.style.transform = 'scale(0.95)';
  await this.wait(120);
  el.style.transform = 'scale(1)';

  await this.wait(100);
  this.cursorVisible.set(false);
}
```

## Padrão 3: Entrada com Onda (Grid)

Células de grid aparecem em sequência como uma onda.

### CSS

```css
.cell {
  opacity: 0;
}
.cell.visible {
  opacity: 1;
}
```

### TypeScript

```typescript
private animateGrid() {
  const cells = document.querySelectorAll('.grid .cell');
  if (!cells.length) return;
  cells.forEach(c => c.classList.remove('visible'));

  gsap.fromTo(cells,
    { scale: 0.7, opacity: 0 },
    {
      scale: 1, opacity: 1, duration: 0.3,
      stagger: { each: 0.018, grid: [6, 7], from: 'start' },
      ease: 'back.out(1.4)',
      onComplete: () => cells.forEach(c => c.classList.add('visible'))
    }
  );
}
```

## Padrão 4: Modal por Cima do Card

Backdrop + modal com animação de scale.

### CSS

```css
.modal-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.35);
  border-radius: 14px;
  z-index: 15;
  animation: backdropIn 0.25s ease-out;
}
@keyframes backdropIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.day-modal {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  z-index: 16;
  width: 85%;
  max-height: 80%;
  overflow-y: auto;
  animation: modalIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
@keyframes modalIn {
  from { opacity: 0; transform: translate(-50%, -50%) scale(0.85); }
  to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
}
```

## Padrão 5: Barras de Gráfico Crescendo

Barras começam em 0 e crescem com stagger.

### CSS

```css
.bar {
  height: 0%;
  transition: height 1s cubic-bezier(0.34, 1.56, 0.64, 1);
  transition-delay: var(--d, 0s);
}
.bar.grown {
  height: calc(var(--h) * 1%);
}
```

### Template

```html
<div class="bar"
     [style.--h]="item.percent"
     [style.--d]="$index * 0.12 + 's'"
     [class.grown]="barsReady()">
</div>
```

### TypeScript

```typescript
readonly barsReady = signal(false);

// Dispara depois que o card fica visível
setTimeout(() => this.barsReady.set(true), 500);
```

## Padrão 6: Contagem de Números

Números sobem de 0 ao valor final com GSAP.

```typescript
gsap.to(element, {
  textContent: 84750,
  duration: 2.2,
  ease: 'power2.out',
  snap: { textContent: 1 },
  modifiers: {
    textContent: (v: string) => {
      const n = parseInt(v) || 0;
      return 'R$ ' + n.toLocaleString('pt-BR');
    },
  },
});
```

## Padrão 7: Transição de Slide (Esquerda/Direita)

Itens saem por um lado e entram pelo outro.

```typescript
// Sai pra esquerda
gsap.to(element, {
  opacity: 0, x: -30, duration: 0.2, ease: 'power2.in',
  onComplete: () => {
    // Muda conteúdo
    // Entra pela direita
    gsap.fromTo(element,
      { opacity: 0, x: 30 },
      { opacity: 1, x: 0, duration: 0.3, ease: 'power2.out' }
    );
  }
});
```

## Padrão 8: Timeline Expand/Collapse

Itens de timeline que expandem e colapsam automaticamente.

```typescript
private async expandItem(id: number) {
  this.items.update(all =>
    all.map(i => i.id === id ? { ...i, expanded: true } : i)
  );
  await this.wait(2500);
  this.items.update(all =>
    all.map(i => i.id === id ? { ...i, expanded: false } : i)
  );
}
```

```css
.tl-body {
  animation: bodyIn 0.3s ease-out;
}
@keyframes bodyIn {
  from { opacity: 0; transform: translateY(-6px); }
  to { opacity: 1; transform: translateY(0); }
}
```

## Tempos Sugeridos

| Ação | Duração |
|------|---------|
| Cursor se move | 450ms |
| Cursor clica | 120ms |
| Entrada de card | 300-400ms |
| Stagger grid (6x7) | 18ms por célula |
| Leitura de conteúdo | 2000-2500ms |
| Pausa entre ações | 400-600ms |
| Transição de mês/slide | 200ms saída + 300ms entrada |
| Crescimento de barra | 1000ms |

## Easing Recomendado

- **Bounce suave**: `cubic-bezier(0.34, 1.56, 0.64, 1)`
- **Entrada**: `power2.out`
- **Saída**: `power2.in`
- **GSAP**: `back.out(1.4)` para grids, `power2.out` para movimento

## IMPORTANTE: Prevenir Scroll Indesejado

As animações NÃO podem fazer a página rolar sozinha. Para evitar isso, siga estas regras:

### Regra 1: Overflow hidden nos containers pai

Toda cadeia de containers deve ter `overflow: hidden`:

```css
/* Container raiz da página */
.feature-media {
  overflow: hidden;
}

/* Container do card */
.feature-card {
  overflow: hidden;
}

/* Container do conteúdo interno */
.fc-content {
  overflow: hidden;
}

/* Container do demo */
.demo-container, .demo-whats, .demo-prontuario {
  overflow: hidden;
}
```

### Regra 2: Usar transform, NUNCA margin/padding para animar

```css
/* ✅ CORRETO — transform não causa reflow */
elemento { transition: transform 0.3s; }
elemento { animation: slideIn 0.3s; }

/* ❌ ERRADO — margin empurra o layout e causa scroll */
elemento { transition: margin-top 0.3s; }
```

### Regra 3: Altura fixa ou max-height nos demos

```css
/* ✅ CORRETO */
.demo-container {
  height: 480px; /* altura fixa */
  overflow: hidden;
}

/* ✅ CORRETO — se precisar de transição de altura */
.demo-container {
  max-height: 520px;
  transition: max-height 0.4s ease;
  overflow: hidden;
}

/* ❌ ERRADO — height auto causa scroll jump */
.demo-container {
  height: auto;
}
```

### Regra 4: Posicionamento dos elementos animados

```css
/* Elementos que aparecem/desaparecem devem usar opacity + transform */
.animado {
  opacity: 0;
  transform: translateY(10px); /* deslocamento visual, não de layout */
}
.animado.visible {
  opacity: 1;
  transform: translateY(0);
}

/* ❌ NÃO usar margin-top ou top para animação de entrada */
```

### Regra 5: Conter modais e overlays dentro do card

```css
/* Modal deve ser absoluto DENTRO do container, não fixed na página */
.modal-backdrop {
  position: absolute; /* NÃO fixed */
  inset: 0;
  border-radius: 14px; /* herda do pai */
  z-index: 15;
}
.modal-content {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  z-index: 16;
}
```

### Checklist antes de liberar

- [ ] Todos os containers pai têm `overflow: hidden`
- [ ] Animações usam apenas `transform` e `opacity`
- [ ] Alturas são fixas ou com `max-height`
- [ ] Modais usam `position: absolute` (não `fixed`)
- [ ] Nenhum `margin` ou `padding` é animado
- [ ] Teste: rolar a página manualmente durante as animações — não pode pular

### Regra 6: Prevenir scroll jump com Lenis/Smooth Scroll

Se o projeto usa **Lenis**, **locomotive-scroll** ou qualquer lib de smooth scroll, adicione em TODOS os containers animados:

```css
.features, .feature-card, .feature-media, .fc-content {
  overflow-anchor: none;   /* impede o browser de ajustar scroll */
  contain: layout;         /* isola o layout deste elemento */
  overscroll-behavior: contain; /* previne scroll chain */
}
```

Sem essas propriedades, quando um card anima (muda de tamanho, aparece conteúdo), o Lenis recalcula a posição de scroll e a página pula pra cima/baixo.

### Regra 7: Never animar height de containers raiz

```css
/* ❌ ERRADO — muda o layout e causa scroll jump */
.demo-container { transition: height 0.4s; }

/* ✅ CORRETO — usar scale se precisar de efeito visual */
.demo-container { transition: transform 0.4s; }

/* ✅ CORRETO — se DEVER mudar height, usar containment */
.demo-container {
  contain: layout;
  overflow-anchor: none;
  transition: height 0.4s;
}
```
