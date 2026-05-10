# X Post — Linee Guida e Preferenze

## Descrizione

Pipeline completa per creare post/thread su X (Twitter) per Giacomo Montepino. Chiamata internamente da `/smm` o standalone con `/x-post`.

## Script

Percorso: `.claude/skills/x-post/scripts/publisher.js`

```
# Test autenticazione
node .claude/skills/x-post/scripts/publisher.js --dry-run

# Post singolo
node .claude/skills/x-post/scripts/publisher.js --tweet "testo" --image path/img.jpg

# Thread (ogni argomento = un tweet)
node .claude/skills/x-post/scripts/publisher.js --thread "tweet1" "tweet2" "tweet3" --image path/img.jpg
```

## Variabili d'Ambiente Richieste

- `X_API_KEY`: API Key dell'app X
- `X_API_KEY_SECRET`: API Key Secret
- `X_ACCESS_TOKEN`: Access Token (permessi Read + Write)
- `X_ACCESS_TOKEN_SECRET`: Access Token Secret

## Linee Guida e Preferenze

Leggi profilo in `.claude/context/giacomo.md` e spec X in `.claude/context/platforms.md`.

---

### FASE 0 — INPUT (solo se chiamato standalone)

Se Giacomo chiama `/x-post` direttamente, chiedi:
1. Stage funnel: TOFU / MOFU / BOFU?
2. Topic specifico o lascio al Researcher?
3. Formato: Thread (4-8 tweet) / Post singolo / Scelgo io?

---

### FASE 1 — RESEARCHER

Spawna sub-agente con istruzioni in `.claude/agents/01-researcher.md`:
- PLATFORM: X
- TOPIC_HINT: [topic o "nessuno"]
- STAGE: [stage]

---

### FASE 2 — WRITER

Spawna sub-agente con istruzioni in `.claude/agents/02-writer.md`:
- PLATFORM: X
- STAGE: [stage]
- FORMAT: [formato]
- RESEARCH_BRIEF: [JSON Researcher]
- FEEDBACK_REVIEWER: "primo draft"

---

### FASE 3 — REVIEWER (loop max 3 iter)

Spawna sub-agente con istruzioni in `.claude/agents/03-reviewer.md`:
- PLATFORM: X
- STAGE: [stage]
- DRAFT: [draft Writer]

APPROVED → Fase 4 | REJECTED → ri-spawna Writer con feedback

---

### FASE 4 — VISUAL (Canva MCP — obbligatorio)

Spawna sub-agente con istruzioni in `.claude/agents/04-visual.md`:
- PLATFORM: X
- FORMAT: immagine singola 1600x900
- APPROVED_DRAFT: [draft approvato]

Dopo Canva: esporta design, scarica immagine localmente.

---

### FASE 5 — PUBBLICAZIONE (con conferma)

Mostra post completo a Giacomo.
Chiedi: "Pubblico ora su X?"

Se SÌ (thread):
```
node .claude/skills/x-post/scripts/publisher.js \
  --thread "[tweet1]" "[tweet2]" "[tweet3]" \
  --image [path immagine]
```

Se SÌ (singolo):
```
node .claude/skills/x-post/scripts/publisher.js \
  --tweet "[testo]" \
  --image [path immagine]
```

---

### OUTPUT FINALE

```
═══════════════════════════════════════════
POST X — [Stage] — [Data]
═══════════════════════════════════════════
[THREAD o POST — tweet separati con "---"]

VISUAL CANVA
[URL design o Visual Brief fallback tecnico]

NOTE STRATEGICHE
• Timing: [giorno/ora]
• Topic: [topic + angolo]
• Perché funzionerà: [2-3 righe]
• Review: [N/3]
[Se pubblicato: • URL: [link tweet]]
═══════════════════════════════════════════
```

---

## Self-Healing — Log Errori

*Aggiornato automaticamente in caso di errori script.*

<!-- ERRORS_START -->
<!-- ERRORS_END -->
