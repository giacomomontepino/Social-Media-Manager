# SMM — Social Media Manager Orchestrator

## Descrizione

Orchestratore giornaliero principale. Gestisce il piano editoriale, la revisione metriche mensile, e crea autonomamente tutti i contenuti del giorno delegando alle skill di piattaforma. Giacomo chiama solo questa skill ogni mattina.

## Script

Percorso: `.claude/skills/smm/scripts/plan_manager.js`

```
# Controlla stato piano
node .claude/skills/smm/scripts/plan_manager.js --check

# Post di oggi
node .claude/skills/smm/scripts/plan_manager.js --today

# Aggiorna status
node .claude/skills/smm/scripts/plan_manager.js --status 2026-05-08 LinkedIn created

# Giorni da ultima revisione metriche
node .claude/skills/smm/scripts/plan_manager.js --metrics-check
```

## Variabili d'Ambiente Richieste

Nessuna — questo script usa solo il filesystem locale.

## Linee Guida e Preferenze

Leggi il profilo in `.claude/context/giacomo.md` e le specifiche piattaforma in `.claude/context/platforms.md` all'avvio.

---

### STEP 0 — VERIFICA PIANO

Prima di qualsiasi cosa:
1. Esegui `node .claude/skills/smm/scripts/plan_manager.js --check`
2. Se il file NON esiste → vai a **MODALITÀ PRIMO AVVIO**
3. Se esiste → vai a **MODALITÀ GIORNALIERA**

---

# MODALITÀ PRIMO AVVIO

## A1 — INTERVISTA STRATEGICA

Accogli Giacomo e conduci l'intervista in 3 blocchi sequenziali:

**Blocco 1 — Obiettivo del mese:**
1. Obiettivo principale? (follower, lead, expertise)
2. Qualcosa da raccontare questo mese? (progetto, lezione, novità tech)
3. Idee di post già pronte?

**Blocco 2 — Piattaforme e distribuzione:**
1. Tutte e tre le piattaforme? (LinkedIn + X + Threads)
2. Contenuto adattato per piattaforma o stesso tema base?
3. Argomenti da evitare?

**Blocco 3 — CTA e priorità:**
1. CTA principale del mese? (follower, DM, call)
2. Post BOFU per preparare outreach DM?
3. Argomento tecnico specifico da coprire?

## A2 — CREAZIONE PIANO 30 GIORNI

Distribuzione:
- LinkedIn: 4x/week (Tue/Wed/Thu + extra)
- X: 5x/week (Mon-Fri)
- Threads: 5x/week (Mon-Fri)
- 50% TOFU / 30% MOFU / 20% BOFU
- 40% educativo / 35% storytelling / 25% autorevole
- MAI stesso topic stesso giorno cross-piattaforma
- BOFU LinkedIn preferibilmente giovedì

## A3 — SALVA PIANO

Crea `.claude/plans/editorial-plan.md`:

```markdown
---
created: YYYY-MM-DD
last_metrics_review: YYYY-MM-DD
period: YYYY-MM-DD to YYYY-MM-DD
monthly_goal: [obiettivo]
monthly_cta: [CTA]
---

## Week 1 — [date range]
| Date | Platform | Stage | Topic | Format | Hook Draft | CTA | Status |
|------|----------|-------|-------|--------|------------|-----|--------|
| YYYY-MM-DD | LinkedIn | TOFU | ... | Carosello | ... | Salva | ⬜ |

## Metrics History
*Nessuna revisione ancora.*
```

## A4 — AVVIO PRIMO GIORNO

Mostra piano, chiedi conferma, poi vai a **SEZIONE C**.

---

# MODALITÀ GIORNALIERA

## B0 — CHECK REFERENCES (SEMPRE, PRIMA DI TUTTO)

Prima di leggere il piano o creare contenuti, scansiona le references:

1. Leggi `.claude/references/manifest.md` → estrai tutti i path già analizzati
2. Scansiona tutte le sottocartelle di `.claude/references/` (posts/ e visuals/, per ogni piattaforma)
3. Ignora `.gitkeep`
4. Identifica file presenti ma NON nel manifest = **nuovi da analizzare**

**Se ci sono file nuovi:**
- Leggili con il tool `Read` (supporta immagini)
- Per ogni file:
  - Se in `posts/`: estrai hook, struttura, tono, CTA, uso emoji, lunghezza
  - Se in `visuals/`: estrai palette, layout, tipografia, stile, elementi ricorrenti
- Presenta a Giacomo un report compatto con max 2 domande per file: "Ho trovato X nuove references. [sintesi]. Vuoi che adotti questi pattern?"
- Se Giacomo conferma → aggiorna subito `agents/02-writer.md` o `agents/04-visual.md` (sezione PATTERN DA REFERENCES) e il manifest
- Se Giacomo salta → prosegui senza aggiornare

**In ogni caso (nuove o meno):**
- Tieni a mente le references già analizzate nel manifest come contesto per il Writer e il Visual Agent
- Quando deleghi a Writer: specifica quali references sono rilevanti per la piattaforma del giorno (max 2-3 le più pertinenti per topic/stile)
- Quando deleghi a Visual Agent: specifica se ci sono template visual già disponibili in references/

---

## B1 — LEGGI PIANO

`node .claude/skills/smm/scripts/plan_manager.js --check`

## B2 — CONTROLLO METRICHE

`node .claude/skills/smm/scripts/plan_manager.js --metrics-check`

Se output > 30: interrompi e chiedi metriche prima di procedere (reach, engagement, follower per platform → poi aggiorna piano e vai avanti).

## B3 — DASHBOARD

Mostra:
- Post di oggi (da piano)
- Progressi settimana (✅/🟡/⬜)
- Data prossima revisione metriche

## B4 — Vai a SEZIONE C

---

# SEZIONE C — ESECUZIONE PIPELINE

Per ogni piattaforma schedulata oggi, esegui sequenzialmente:

1. Leggi istruzioni da `.claude/skills/[piattaforma]/SKILL.md`
2. Esegui pipeline completa: Researcher → Writer → Reviewer loop → Visual Canva
3. Dopo visual pronto: mostra post a Giacomo, chiedi "Pubblico ora su [piattaforma]?"
4. Se SÌ: esegui script publisher, ottieni URL post
5. Aggiorna piano: `node .claude/skills/smm/scripts/plan_manager.js --status [DATA] [PLATFORM] [created|published]`
6. Passa alla piattaforma successiva

Ordine: LinkedIn → X → Threads.

## Summary Finale

Mostra tutto il prodotto del giorno + preview di domani + reminder engagement.

---

# SEZIONE D — LEARNING UPDATE (dopo ogni sessione di pubblicazione)

Esegui sempre al termine della giornata, dopo che tutti i post sono stati pubblicati.

## D1 — Aggiorna manifest

Per ogni file in `.claude/references/` analizzato oggi (trovato al B0 e confermato da Giacomo):
- Aggiungi entry in `.claude/references/manifest.md` nel formato:
  ```
  ## YYYY-MM-DD
  - [path relativo] → [sintesi 1 riga di cosa si è imparato] → aggiornato: [lista file modificati]
  ```

## D2 — Aggiorna SKILL.md delle piattaforme pubblicate oggi

Per ogni piattaforma su cui hai pubblicato oggi:
- Apri il relativo `SKILL.md` (es. `.claude/skills/linkedin-post/SKILL.md`)
- Se durante la pipeline hai notato qualcosa che non ha funzionato bene (hook debole, formato sbagliato, visual rifiutato) → aggiungi nota nella sezione `## Self-Healing — Log Errori`
- Se hai trovato un approccio che ha funzionato bene (Giacomo ha approvato al primo giro) → aggiungi nota nella sezione writer/visual del SKILL.md

## D3 — Aggiorna script references (se necessario)

Se `meme_generator.cjs` o altri script visual sono stati usati oggi con testi diversi, verifica che il file sia tornato ai valori placeholder (non lasciare testi specifici di post passati hardcoded).

## D4 — Summary apprendimento

Mostra a Giacomo un riepilogo compatto:
```
📚 Learning update completato:
• References analizzate: [N]
• Pattern adottati: [lista]
• File aggiornati: [lista]
• Nota per domani: [eventuale osservazione]
```

---

## Self-Healing — Log Errori

*Questa sezione viene aggiornata automaticamente quando si verificano errori negli script.*

Quando uno script Node.js di qualsiasi skill fallisce:
1. Leggi l'errore completo
2. Apri `SKILL.md` della skill interessata
3. Aggiungi tra `<!-- ERRORS_START -->` e `<!-- ERRORS_END -->` il log dell'errore
4. Correggi lo script
5. Riprova (max 3 volte)
6. Se persiste dopo 3 tentativi → informa Giacomo

<!-- ERRORS_START -->
<!-- ERRORS_END -->
