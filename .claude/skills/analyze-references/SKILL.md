# Skill: analyze-references

Analizza screenshot di post e visual caricati in `.claude/references/`, estrae pattern riutilizzabili, chiede conferma a Giacomo e aggiorna le skill di scrittura e visual.

---

## Fase 1 — Scan: rileva file nuovi

1. Leggi `.claude/references/manifest.md` → estrai tutti i path già analizzati
2. Scansiona con `find` (o lista diretta) le seguenti cartelle:
   - `.claude/references/posts/linkedin/`
   - `.claude/references/posts/x/`
   - `.claude/references/posts/threads/`
   - `.claude/references/visuals/linkedin/`
   - `.claude/references/visuals/x/`
   - `.claude/references/visuals/threads/`
3. Ignora `.gitkeep`
4. Confronta: file presenti ma NON in manifest = **nuovi da analizzare**
5. Se nessun file nuovo → risponde: "Nessun file nuovo in `.claude/references/`. Carica screenshot e riprova." e termina.

---

## Fase 2 — Analisi immagini

Per ogni file nuovo, usa il tool `Read` (supporta immagini PNG/JPG) per visualizzarlo.

### Se il file è in `posts/` (post testuale)

Estrai e documenta:
- **Hook:** prime 1-2 righe — tipo (domanda / affermazione forte / dato / lista numerata / anafora)
- **Struttura corpo:** come è organizzato il contenuto (liste, paragrafi brevi, spazi bianchi, numeri)
- **Tono:** professionale / diretto / narrativo / provocatorio / conversazionale
- **CTA:** ultima riga — tipo e tono
- **Lunghezza approssimativa:** corto (<150 parole) / medio (150-300) / lungo (>300)
- **Uso emoji:** sì/no, frequenza, posizione
- **Hashtag:** numero e posizione (inline o fine post)
- **Pattern notevoli:** qualsiasi elemento insolito o efficace

### Se il file è in `visuals/` (immagine/carosello)

Estrai e documenta:
- **Palette colori:** colori dominanti, accenti, sfondi (con hex approssimativo se riconoscibile)
- **Layout:** posizione degli elementi (testo centrato / a sinistra / in basso), presenza di cornici/frame, uso dello spazio bianco
- **Tipografia:** peso del font (bold/regular), dimensione relativa titolo vs body, font families riconoscibili
- **Elementi grafici ricorrenti:** badge, frecce, icone, linee divisorie, gradienti, mockup device
- **Stile generale:** minimalista / bold / data-driven / editorial / dark / light / colorato
- **Struttura slide** (se carosello): pattern slide 1 (hook) → slide intermedie → slide finale (CTA)
- **Firma/watermark:** presente, posizione, stile

---

## Fase 3 — Debrief con domande

Presenta il report in questo formato per ogni file:

```
### [nome file] — [piattaforma] — [tipo: post / visual]

**Cosa ho visto:**
[sintesi dei punti estratti nella Fase 2]

**Domande:**
1. [domanda specifica su un pattern trovato — chiedi se vuole adottarlo]
2. [domanda su un secondo elemento notevole]
3. [eventuale domanda su ambiguità o uso specifico]
```

Regole per le domande:
- Max 3 domande per file
- Domande specifiche e binarie (sì/no) oppure con opzioni chiare ("solo per X" / "per tutte le piattaforme" / "solo in certi formati")
- Non fare domande retoriche — ogni domanda deve portare a una modifica concreta se la risposta è affermativa
- Dopo il report di tutti i file, chiedi: **"Vuoi procedere con l'aggiornamento delle skill basandomi sulle tue risposte?"**

Attendi la risposta di Giacomo prima di procedere.

---

## Fase 4 — Aggiornamento skill (solo dopo conferma)

In base alle risposte di Giacomo, aggiorna i file elencati sotto. Fai modifiche chirurgiche — aggiungi o modifica sezioni specifiche, non riscrivere l'intero file.

### Pattern testuali (hook, struttura, CTA, tono)

| Scope | File da aggiornare |
|---|---|
| Tutte le piattaforme | `.claude/agents/02-writer.md` — sezione "Pattern Hook" o "Linee Guida Struttura" |
| Solo LinkedIn | `.claude/skills/linkedin-post/SKILL.md` — sezione writer o linee guida post |
| Solo X | `.claude/skills/x-post/SKILL.md` — stessa logica |
| Solo Threads | `.claude/skills/threads-post/SKILL.md` — stessa logica |

### Pattern visual (palette, layout, tipografia, stile)

| Scope | File da aggiornare |
|---|---|
| Tutte le piattaforme | `.claude/agents/04-visual.md` — sezione stile/palette della piattaforma corrispondente |
| Solo LinkedIn | `.claude/agents/04-visual.md` sezione LinkedIn + `.claude/skills/linkedin-post/SKILL.md` sezione visual |
| Solo X | `.claude/agents/04-visual.md` sezione X + `.claude/skills/x-post/SKILL.md` sezione visual |
| Solo Threads | `.claude/agents/04-visual.md` sezione Threads + `.claude/skills/threads-post/SKILL.md` sezione visual |

### Come scrivere le modifiche nei file

- Aggiungi una sezione `## Pattern da References` (o appendila se esiste già) nel file target
- Usa bullet point chiari: `- Hook con domanda diretta funziona bene su Threads (confermato da reference 2026-05-08)`
- Non eliminare le linee guida esistenti — integra, non sostituisci

---

## Fase 5 — Aggiorna manifest

Dopo ogni file processato con successo, aggiungi una riga in `.claude/references/manifest.md`:

```markdown
## YYYY-MM-DD
- posts/linkedin/nome-file.png → [sintesi 1 riga di cosa si è imparato] → aggiornato: [lista file modificati]
```

---

## Self-Healing — Log Errori

<!-- Errori riscontrati durante l'esecuzione della skill vengono loggati qui -->
