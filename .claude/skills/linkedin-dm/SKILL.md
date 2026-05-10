# LinkedIn DM Freddo — Linee Guida e Preferenze

## Descrizione

Genera DM freddi LinkedIn per acquisire la mail del lead tramite mockup gratuito. Versione specializzata LinkedIn con 2 varianti (Diretta + Narrativa). Target: imprenditori che potrebbero aver bisogno di un'app mobile.

## Script

Percorso: `.claude/skills/linkedin-dm/scripts/dm_formatter.js`

```
# Valida, salva e copia variante A
node .claude/skills/linkedin-dm/scripts/dm_formatter.js \
  --variant-a "testo diretto" \
  --variant-b "testo narrativo" \
  --lead "Mario Rossi" \
  --copy a
```

## Variabili d'Ambiente Richieste

Nessuna.

## Linee Guida e Preferenze

---

### FASE 1 — RACCOLTA INFO SUL LEAD

Chiedi in un unico blocco:

1. Nome e ruolo/business del lead?
2. Dettagli specifici dal profilo LinkedIn? (post recente, traguardo, settore, milestone)
3. Lead freddo totale o avete già interagito? (like, commento, connessione)
4. Problema principale nel suo business legato al mobile?

---

### FASE 2 — GENERAZIONE DM

Struttura obbligatoria in 5 parti — scorre come testo naturale, non 5 sezioni separate.

#### PARTE 1 — Apertura (Barnum + Rainbow Ruse)
Crea sensazione immediata di "mi conosce davvero".

**Effetto Barnum:** osservazioni universali che sembrano specifiche.
Esempi: "Dal tuo profilo si percepisce che sei uno che preferisce fare le cose per bene.", "Si vede che hai costruito il tuo business nel tempo, senza scorciatoie."

**Rainbow Ruse:** tratto + esatto opposto.
Esempi: "Probabilmente sei molto concreto e orientato ai numeri, ma ogni tanto ti fermi su un'idea ambiziosa che va oltre i fogli Excel.", "Immagino che tu sia focalizzato sul core business, ma nel retro della testa hai già tre idee su come espanderti."

#### PARTE 2 — Chi sono
Max 2 righe. Benefit immediato per il lettore. MAI "freelance / lavoro per / dipendente".
Esempio: "Sviluppo app mobile per imprenditori come te — il mio lavoro è capire se e come un'app può davvero portare clienti."

#### PARTE 3 — Lead Magnet (Mockup)
Esclusivo e curato, non template di massa.
Esempio: "Ho immaginato come potrebbe essere la tua app — schermate, flusso, come porti nuovi clienti. L'ho messa insieme in un PDF visivo."

#### PARTE 4 — Micro Commitment (mail)
Logistica, non commerciale.
Esempio: "Se ti va di vederlo, lasciami la tua mail e te lo mando direttamente."

#### PARTE 5 — Chiusura basso attrito
Una riga. Zero pressione.
Esempio: "Se non è il momento giusto, nessun problema."

---

### REGOLE LINKEDIN SPECIFICHE

- Tono: professionale ma umano, mai da commerciale
- Lunghezza: 150-180 parole (validata dallo script)
- Può fare riferimento a post/articolo/milestone recente del lead
- Niente emoji, niente punti esclamativi
- MAI menzione status lavorativo di Giacomo

---

### OUTPUT — 2 VARIANTI OBBLIGATORIE

```
=== VARIANTE A — Diretta ===
(per lead con profilo business/numeri/KPI)
[Testo 150-180 parole]

=== VARIANTE B — Narrativa ===
(per lead con profilo personale/valori/storia)
[Testo 150-180 parole]
```

Dopo generazione:
```
node .claude/skills/linkedin-dm/scripts/dm_formatter.js \
  --variant-a "[testo A]" \
  --variant-b "[testo B]" \
  --lead "[nome lead]" \
  --copy a
```

---

## Self-Healing — Log Errori

<!-- ERRORS_START -->
<!-- ERRORS_END -->
