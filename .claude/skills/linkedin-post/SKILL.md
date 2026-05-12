# LinkedIn Post — Linee Guida e Preferenze

## Descrizione

Pipeline completa per creare post LinkedIn ad alto engagement per Giacomo Montepino. Chiamata internamente da `/smm` o standalone con `/linkedin-post`.

## Script

Percorso: `.claude/skills/linkedin-post/scripts/publisher.js`

```
# Test autenticazione
node .claude/skills/linkedin-post/scripts/publisher.js --dry-run

# Post singolo con immagine
node .claude/skills/linkedin-post/scripts/publisher.js --text "testo" --image path/img.jpg

# Carosello
node .claude/skills/linkedin-post/scripts/publisher.js --text "testo" --carousel slide1.jpg slide2.jpg slide3.jpg
```

## Variabili d'Ambiente Richieste

- `LINKEDIN_ACCESS_TOKEN`: token OAuth 2.0 con scope w_member_social
- `LINKEDIN_PERSON_ID`: ID profilo LinkedIn (ottieni con /v2/userinfo)

## Linee Guida e Preferenze

Leggi profilo in `.claude/context/giacomo.md` e spec LinkedIn in `.claude/context/platforms.md`.

---

### FASE 0 — INPUT (solo se chiamato standalone)

Se Giacomo chiama `/linkedin-post` direttamente, chiedi:
1. Stage funnel: TOFU / MOFU / BOFU?
2. Topic specifico o lascio al Researcher?
3. Formato: Carosello (8-10 slide) / Post testuale / Scelgo io?

---

### FASE 1 — RESEARCHER

Spawna sub-agente con istruzioni in `.claude/agents/01-researcher.md`:
- PLATFORM: LinkedIn
- TOPIC_HINT: [topic o "nessuno"]
- STAGE: [stage]

---

### FASE 2 — WRITER

Prima di delegare al Writer, leggi `.claude/references/manifest.md` e identifica le references già analizzate per LinkedIn (posts/linkedin/). Passa al Writer le 2-3 più rilevanti per il topic del giorno come contesto.

Spawna sub-agente con istruzioni in `.claude/agents/02-writer.md`:
- PLATFORM: LinkedIn
- STAGE: [stage]
- FORMAT: [formato]
- RESEARCH_BRIEF: [JSON Researcher]
- FEEDBACK_REVIEWER: "primo draft"
- REFERENCES: [lista path + sintesi delle references rilevanti da manifest, o "nessuna" se non ce ne sono]

---

### FASE 3 — REVIEWER (loop max 3 iter)

Spawna sub-agente con istruzioni in `.claude/agents/03-reviewer.md`:
- PLATFORM: LinkedIn
- STAGE: [stage]
- DRAFT: [draft Writer]

APPROVED → Fase 4 | REJECTED → ri-spawna Writer con feedback

---

### FASE 4 — VISUAL

**Carosello:** modifica la sezione SLIDES in `carousel_generator.cjs`, poi esegui:
```
node .claude/skills/linkedin-post/scripts/carousel_generator.cjs
```
Output: `.claude/output/carousel/slide-01.png … slide-N.png`

**Meme:** modifica TOP_TEXT e BOTTOM_TEXT in `meme_generator.cjs`, poi esegui:
```
node .claude/skills/linkedin-post/scripts/meme_generator.cjs
```

Prima di generare: leggi `.claude/references/manifest.md` e identifica le references visual per LinkedIn. Combina i pattern disponibili invece di replicarne uno solo (vedi `04-visual.md` sezione Evoluzione Stile).

---

### FASE 5 — PUBBLICAZIONE (con conferma)

Mostra post completo a Giacomo.
Chiedi: "Pubblico ora su LinkedIn?"

Se SÌ — per post con immagine standard usa il publisher:
```
node .claude/skills/linkedin-post/scripts/publisher.js \
  --text "[testo approvato]" \
  --image [path immagine] oppure --carousel [paths slides]
```

Se la visual è un meme generato con `meme_generator.cjs`, usa direttamente `publish_now.cjs` (aggiornando testo e path immagine nel file prima di eseguirlo).

Ottieni URL e aggiorna piano.

---

### OUTPUT FINALE

```
═══════════════════════════════════════════
POST LINKEDIN — [Stage] — [Data]
═══════════════════════════════════════════
[POST COMPLETO]

VISUAL
[path slide generate o path meme]

NOTE STRATEGICHE
• Timing: [giorno/ora]
• Topic: [topic + angolo]
• Perché funzionerà: [2-3 righe]
• Review: [N/3]
[Se pubblicato: • URL: [link post]]
═══════════════════════════════════════════
```

---

## Self-Healing — Log Errori

*Aggiornato automaticamente in caso di errori script.*

<!-- ERRORS_START -->

## 2026-05-12 — Lezioni apparse dalla prima sessione

**Caption AI-sounding (rifiutata):** il primo draft della caption LinkedIn aveva una struttura troppo schematica ("Cosa trovi in questo carosello: →→→" + lista puntata). Giacomo ha rifiutato con "si capisce lontano un miglio che è generato da AI". Fix: riscrivere come narrazione in prima persona, esperienza reale, nessuna lista, tono colloquiale.

**Regola anti-AI per caption LinkedIn:** evita strutture con lista frecce, sottotitoli in grassetto, "Cosa impari:", "Ecco cosa trovi:". Usa sempre un aneddoto o un momento reale come hook. Nessuna frase che suoni come "sintesi di un articolo".

**Canva MCP rimosso:** ha fallito 2 volte nel replicare lo stile di riferimento. Sostituito con `carousel_generator.cjs` basato su node-canvas — più veloce, più coerente, nessuna dipendenza esterna.

<!-- ERRORS_END -->
