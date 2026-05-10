# DM Freddo Multi-Social — Linee Guida e Preferenze

## Descrizione

Genera DM freddi adattati alla piattaforma per acquisire la mail del lead tramite offerta di mockup gratuito. Target: imprenditori con business che potrebbe beneficiare di un'app mobile.

## Script

Percorso: `.claude/skills/dm/scripts/dm_formatter.js`

```
# Formatta, valida lunghezza e salva DM
node .claude/skills/dm/scripts/dm_formatter.js \
  --text "testo dm" \
  --platform linkedin \
  --lead "Mario Rossi" \
  --copy
```

## Variabili d'Ambiente Richieste

Nessuna per la generazione. Per invio diretto via API (futuro): credenziali piattaforma.

## Linee Guida e Preferenze

---

### FASE 0 — RACCOLTA INFO

Chiedi in un unico blocco:

**Per quale piattaforma?**
A — LinkedIn | B — X | C — Threads | D — Tutte e tre

**Sul lead:**
1. Nome e ruolo/business?
2. Dettagli specifici dal profilo? (post recente, traguardo, settore)
3. Lead freddo o avete già interagito?
4. Problema principale nel suo business legato al mobile?

---

### STRUTTURA DM — 5 PARTI

#### PARTE 1 — Apertura (Barnum + Rainbow Ruse)
- **Barnum:** affermazione universale che sembra specifica (2-3 righe, sembra un'osservazione acuta)
- **Rainbow Ruse:** tratto di personalità + esatto opposto (tutti si riconoscono in entrambi)
- Combinati naturalmente, mai come trucco evidente

#### PARTE 2 — Chi sono e perché leggermi
Max 2 righe. Solo benefit per il lettore. MAI "sono freelance / lavoro per / sono dipendente".

#### PARTE 3 — Lead Magnet (Mockup gratuito)
Offerta del mockup come regalo esclusivo e curato, non template di massa.

#### PARTE 4 — Micro Commitment (richiesta mail)
Richiesta logistica, non commerciale. Solo la mail, nessun'altra azione.

#### PARTE 5 — Chiusura a basso attrito
Una riga. Rimuove ogni pressione.

---

### ADATTAMENTI PER PIATTAFORMA

| Piattaforma | Tono | Parole |
|---|---|---|
| LinkedIn | Professionale ma umano | 150-180 |
| X | Casual, diretto | 100-140 |
| Threads | Conversazionale | 100-130 |

---

### REGOLE ASSOLUTE

- Sembra scritto a mano per quella persona
- Niente emoji, niente punti esclamativi
- MAI "ti contatto perché..." o "ho visto il tuo profilo e..."
- MAI menzione status lavorativo di Giacomo
- Il messaggio scorre come testo unico naturale
- CTA singola: solo la mail

---

### OUTPUT

Per ogni piattaforma:
```
─────────────────────────────────────────
DM [PIATTAFORMA] — [Nome Lead]
─────────────────────────────────────────
[Testo messaggio]

NOTE TECNICHE
• Barnum usato: [quale affermazione]
• Rainbow Ruse: [i due poli]
• Personalizzazione: [cosa usato dal profilo]
─────────────────────────────────────────
VARIANTE A — Più diretta (profilo numeri/business)
VARIANTE B — Più narrativa (profilo personale/valori)
```

Dopo generazione, esegui:
```
node .claude/skills/dm/scripts/dm_formatter.js \
  --text "[testo dm]" --platform [linkedin|x|threads] --lead "[nome]" --copy
```

---

## Self-Healing — Log Errori

<!-- ERRORS_START -->
<!-- ERRORS_END -->
