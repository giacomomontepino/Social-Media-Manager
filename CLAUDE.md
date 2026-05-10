> **SE STAI USANDO QUESTO COME TEMPLATE:** Leggi prima [`SETUP.md`](SETUP.md) e personalizza `.claude/context/profile.template.md` con il tuo profilo.
> **IF YOU'RE USING THIS AS A TEMPLATE:** Read [`SETUP.md`](SETUP.md) first and customize `.claude/context/profile.template.md` with your profile.

---

# Social Media Manager — Giacomo Montepino

## Identità

**Giacomo Montepino** è uno sviluppatore mobile specializzato in React Native ed Expo.

**Regola identità (CRITICA):** In tutti i contenuti generati, Giacomo non deve mai alludere al fatto di essere dipendente né al fatto di lavorare in proprio. Deve apparire come un esperto che condivide valore con la community. Nessun posizionamento lavorativo in nessuna direzione.

Dettagli completi: `.claude/context/giacomo.md`

**Target post:** developer e tech community (React Native, Expo, mobile dev).
**Target DM outreach:** imprenditori con bisogno di un'app mobile.
**Lingua:** italiano.
**Funnel:** TOFU / MOFU / BOFU — 50% / 30% / 20%.

---

## Comandi Disponibili

| Comando | Descrizione |
|---|---|
| `/smm` | **Comando principale — ogni mattina.** Gestisce piano, metriche mensili, crea e pubblica contenuti del giorno |
| `/analyze-references` | Analizza nuovi screenshot in `references/`, estrae pattern e aggiorna le skill |
| `/dm` | DM freddo outreach clienti (LinkedIn / X / Threads) |
| `/linkedin-dm` | DM freddo LinkedIn con 2 varianti |
| `/mockup-to-pdf` | Genera PDF proposta da mockup |

I comandi `/linkedin-post`, `/x-post`, `/threads-post` sono sub-pipeline chiamate da `/smm`.

---

## Struttura Progetto

```
.claude/
├── context/
│   ├── giacomo.md        ← profilo, regola CRITICA, TOFU/MOFU/BOFU
│   └── platforms.md      ← spec piattaforme: dimensioni, timing, algoritmi
├── agents/
│   ├── 01-researcher.md  ← sub-agente ricerca trend
│   ├── 02-writer.md      ← sub-agente scrittura
│   ├── 03-reviewer.md    ← sub-agente review
│   └── 04-visual.md      ← sub-agente Canva MCP (obbligatorio)
├── skills/               ← logica completa di ogni skill
│   ├── smm/
│   │   ├── SKILL.md      ← istruzioni orchestratore + error log
│   │   └── scripts/plan_manager.js
│   ├── linkedin-post/
│   │   ├── SKILL.md      ← istruzioni + error log
│   │   └── scripts/publisher.js       ← LinkedIn API
│   ├── x-post/
│   │   ├── SKILL.md
│   │   └── scripts/publisher.js       ← X API
│   ├── threads-post/
│   │   ├── SKILL.md
│   │   └── scripts/publisher.js       ← Threads API
│   ├── dm/
│   │   ├── SKILL.md
│   │   └── scripts/dm_formatter.js
│   ├── linkedin-dm/
│   │   ├── SKILL.md
│   │   └── scripts/dm_formatter.js
│   └── mockup-to-pdf/
│       ├── SKILL.md
│       └── scripts/pdf_generator.js   ← genera PDF con pdfkit
├── commands/             ← thin entry points (rimandano a skills/)
│   ├── smm.md, linkedin-post.md, x-post.md, threads-post.md
│   ├── dm.md, linkedin-dm.md, mockup-to-pdf.md
│   └── analyze-references.md
├── references/           ← screenshot di post e visual da cui prendere spunto
│   ├── README.md         ← istruzioni su come usare la cartella
│   ├── manifest.md       ← traccia file analizzati + cosa si è imparato
│   ├── posts/            ← screenshot post testuali (linkedin/ x/ threads/)
│   └── visuals/          ← screenshot visual/caroselli (linkedin/ x/ threads/)
├── plans/
│   └── editorial-plan.md ← piano 30 giorni, persiste tra sessioni
└── setup/
    ├── api-credentials.md ← guida setup LinkedIn/X/Threads API
    └── install.sh         ← pip install dipendenze Python
```

---

## Setup Iniziale

```bash
# 1. Installa dipendenze Python
bash .claude/setup/install.sh

# 2. Configura credenziali API
cp .env.example .env
# Compila .env seguendo la guida in .claude/setup/api-credentials.md

# 3. Testa le credenziali
node .claude/skills/linkedin-post/scripts/publisher.js --dry-run
node .claude/skills/x-post/scripts/publisher.js --dry-run
node .claude/skills/threads-post/scripts/publisher.js --dry-run
```

---

## Self-Healing

Quando uno script Python fallisce, Claude:
1. Legge l'errore
2. Aggiorna la sezione `## Self-Healing — Log Errori` del `SKILL.md` relativo
3. Corregge lo script
4. Riprova (max 3 volte)

---

## Pipeline Multi-Agente (post creation)

```
1. agents/01-researcher.md  → trend + topic raccomandato
2. agents/02-writer.md      → draft per piattaforma
3. agents/03-reviewer.md    → review isolata, loop max 3 iter
4. agents/04-visual.md      → Canva MCP (obbligatorio)
5. skills/*/publisher.js    → pubblica via API (con conferma Giacomo)
```

---

## Canva MCP

Configurato in `.mcp.json`. Obbligatorio per i visual — il Visual Brief è fallback solo per errori tecnici MCP.

---

## Formati Visual

| Piattaforma | Dimensioni |
|---|---|
| LinkedIn | 1200x1200 px (carosello) |
| X | 1600x900 px |
| Threads | 1080x1080 px |
