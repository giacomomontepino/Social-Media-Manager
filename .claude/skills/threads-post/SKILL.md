# Threads Post — Linee Guida e Preferenze

## Descrizione

Pipeline completa per creare post su Threads per Giacomo Montepino. Chiamata internamente da `/smm` o standalone con `/threads-post`.

## Script

Percorso: `.claude/skills/threads-post/scripts/publisher.js`

```
# Test autenticazione
node .claude/skills/threads-post/scripts/publisher.js --dry-run

# Post con immagine (usa URL pubblico dell'immagine Canva esportata)
node .claude/skills/threads-post/scripts/publisher.js --text "testo" --image-url "https://..."

# Post solo testo
node .claude/skills/threads-post/scripts/publisher.js --text "testo"
```

**Nota:** L'API Threads richiede un URL pubblico per le immagini (non un file locale). Usa l'URL di export Canva direttamente.

## Variabili d'Ambiente Richieste

- `THREADS_ACCESS_TOKEN`: token Meta Graph API (durata 60 giorni, rinnovabile)
- `THREADS_USER_ID`: ID utente Threads

## Linee Guida e Preferenze

Leggi profilo in `.claude/context/giacomo.md` e spec Threads in `.claude/context/platforms.md`.

**Opportunità Threads 2026:** engagement medio 6.25% — il più alto tra i social. Algoritmo premia conversazione e autenticità.

---

### FASE 0 — INPUT (solo se chiamato standalone)

Se Giacomo chiama `/threads-post` direttamente, chiedi:
1. Stage funnel: TOFU / MOFU / BOFU?
2. Topic specifico o lascio al Researcher?
3. Formato: Post con immagine (+60%) / Solo testo / Thread 3-5 post / Scelgo io?

---

### FASE 1 — RESEARCHER

Spawna sub-agente con istruzioni in `.claude/agents/01-researcher.md`:
- PLATFORM: Threads
- TOPIC_HINT: [topic o "nessuno"]
- STAGE: [stage]

---

### FASE 2 — WRITER

Spawna sub-agente con istruzioni in `.claude/agents/02-writer.md`:
- PLATFORM: Threads
- STAGE: [stage]
- FORMAT: [formato]
- RESEARCH_BRIEF: [JSON Researcher]
- FEEDBACK_REVIEWER: "primo draft"

---

### FASE 3 — REVIEWER (loop max 3 iter)

Spawna sub-agente con istruzioni in `.claude/agents/03-reviewer.md`:
- PLATFORM: Threads
- STAGE: [stage]
- DRAFT: [draft Writer]

APPROVED → Fase 4 | REJECTED → ri-spawna Writer con feedback

---

### FASE 4 — VISUAL

1. Genera il PNG con `node .claude/skills/threads-post/scripts/visual_generator.cjs`
   Output: `.claude/output/threads/visual.png`

2. Carica il file su Google Drive di Giacomo tramite MCP Google Drive (`mcp__claude_ai_Google_Drive__*`)
   - Autenticati se necessario
   - Carica `.claude/output/threads/visual.png`
   - Imposta visibilità pubblica ("Chiunque con il link")
   - Ottieni il file ID e costruisci l'URL diretto: `https://drive.google.com/uc?export=view&id=FILE_ID`

3. Passa l'URL diretto al publisher.

---

### FASE 5 — PUBBLICAZIONE (con conferma)

Mostra post completo a Giacomo.
Chiedi: "Pubblico ora su Threads?"

Se SÌ:
```
node .claude/skills/threads-post/scripts/publisher.js \
  --text "[testo approvato]" \
  --image-url "[URL pubblico Canva]"
```

---

### OUTPUT FINALE

```
═══════════════════════════════════════════
POST THREADS — [Stage] — [Data]
═══════════════════════════════════════════
[POST COMPLETO]

VISUAL CANVA
[URL design o Visual Brief fallback tecnico]

NOTE STRATEGICHE
• Timing: [giorno/ora]
• Topic: [topic + angolo]
• Perché genererà conversazione: [2-3 righe]
• Review: [N/3]
• Suggerimento: rispondi ai commenti entro 30 min
[Se pubblicato: • URL: [link post]]
═══════════════════════════════════════════
```

---

## Self-Healing — Log Errori

*Aggiornato automaticamente in caso di errori script.*

<!-- ERRORS_START -->

## 2026-05-12 — Lezioni dalla prima sessione

**Limite 500 caratteri:** l'API Threads restituisce errore 100 se il testo supera 500 caratteri. Il Writer deve tenerlo a mente — max ~480 caratteri per sicurezza (contando anche gli spazi e le newline).

**Google Drive per visual:** l'API Threads richiede URL pubblico per le immagini (non file locali). Flusso confermato: genera PNG con `visual_generator.cjs` → carica su Google Drive via MCP → URL diretto `https://drive.google.com/uc?export=view&id=FILE_ID`.

<!-- ERRORS_END -->
