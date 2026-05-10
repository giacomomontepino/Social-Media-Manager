# Mockup to PDF — Linee Guida e Preferenze

## Descrizione

Trasforma i mockup di un'app in un PDF professionale da inviare come lead magnet ai potenziali clienti. È la proposta commerciale visiva di Giacomo — travestita da regalo gratuito.

## Script

Percorso: `.claude/skills/mockup-to-pdf/scripts/pdf_generator.js`

```
# Test dipendenze
node .claude/skills/mockup-to-pdf/scripts/pdf_generator.js --dry-run

# Genera PDF da file JSON
node .claude/skills/mockup-to-pdf/scripts/pdf_generator.js \
  --content content.json \
  --output "proposta_[cliente]_[data].pdf"
```

**Formato JSON content:**
```json
{
  "business_name": "Nome Business",
  "brand_color": "#0A66C2",
  "business_today": "Descrizione problema attuale...",
  "app_description": "Descrizione app orientata al beneficio...",
  "core_functions": [
    {"title": "Prenotazioni in autonomia", "description": "..."}
  ],
  "screens": [
    {"title": "Home", "description": "...", "value": "...", "image_path": "path/img.png"}
  ],
  "acquisition_strategies": [
    {"title": "Push notification", "description": "...", "result": "..."}
  ],
  "closing": "Testo chiusura e prossimi passi..."
}
```

## Variabili d'Ambiente Richieste

Nessuna.

## Linee Guida e Preferenze

---

### FASE 1 — RACCOLTA INFORMAZIONI

Chiedi in un unico blocco:

1. Come si chiama il business del cliente e di cosa si occupa?
2. Chi sono i clienti finali? (privati, aziende, famiglie...)
3. Problema principale da risolvere con l'app?
4. Hai mockup/schermate pronti? Caricali o descrivili.
5. Quante schermate? Elencale con breve descrizione ognuna.
6. Colori brand o stile visivo definito?

---

### FASE 2 — GENERAZIONE CONTENUTO PDF

7 sezioni obbligatorie:

#### SEZIONE 1 — Cover
- Nome business grande
- "Il tuo concept app — realizzato esclusivamente per [Nome]"
- "Giacomo Montepino — Mobile Developer & AI Expert"
- Data

#### SEZIONE 2 — Il Tuo Business Oggi (il problema)
- Descrizione business in linguaggio imprenditoriale (mai tecnico)
- Problema principale senza app
- Perdite concrete (clienti, tempo, fatturato)
- Frase di transizione alla soluzione
- Tono: empatico, concreto. Max mezza pagina.

#### SEZIONE 3 — La Tua App (la soluzione)
- 2-3 righe focalizzate sul beneficio (non feature tecniche)
- 3 funzioni core in linguaggio business
- Come si inserisce nel flusso quotidiano del business
- Formato per funzione: titolo breve + 2 righe beneficio

#### SEZIONE 4 — Le Schermate (mockup) — LA PIÙ IMPORTANTE
Per ogni schermata:
- Posizionamento nel layout
- Titolo schermata
- Descrizione funzionale (cosa vede/fa l'utente, 2-3 righe)
- Valore business (perché questa schermata ha valore concreto, 1-2 righe in grassetto)
- Max 2 schermate per pagina, spazio bianco generoso

#### SEZIONE 5 — Come Porta Clienti (strategia acquisizione)
3-4 strategie concrete con: Titolo + descrizione + risultato atteso
Esempio: "Push notification a clienti inattivi → +25% prenotazioni ricorrenti"

#### SEZIONE 6 — Roadmap
4 fasi: Brief (1 sett.) → Design (2 sett.) → Sviluppo (3-4 sett.) → Lancio (1 sett.) = 7-8 settimane totali

#### SEZIONE 7 — Chiusura e Prossimo Passo
- Ricollega problema → soluzione
- Proposta call gratuita 30 min
- Contatti: giacomomontepino75@gmail.com + LinkedIn
- Tono: umano, diretto, zero urgenza artificiale

---

### REGOLE GENERALI PDF

- Totale: 8-12 pagine
- Linguaggio: sempre prospettiva business del cliente (mai jargon tecnico)
- Deve funzionare da solo senza presentazione verbale
- Header/footer: nome business + Giacomo su ogni pagina
- Tono: professionale ma umano (non da agenzia corporate fredda)

---

### FLUSSO COMPLETO

1. Raccogli informazioni (Fase 1)
2. Genera contenuto testuale (Fase 2) — struttura JSON
3. Esegui script per generare PDF:
   ```
   node .claude/skills/mockup-to-pdf/scripts/pdf_generator.js \
     --content content.json \
     --output "proposta_[nome_cliente]_[data].pdf"
   ```
4. Fornisci path del PDF generato a Giacomo

---

## Self-Healing — Log Errori

<!-- ERRORS_START -->
<!-- ERRORS_END -->
