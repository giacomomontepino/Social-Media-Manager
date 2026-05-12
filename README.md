# Social Media Manager — Claude Code

> **Versione italiana** sotto / **English version** below

---

## IT: Cos'è questo progetto

Un sistema **multi-agente basato su Claude Code** per automatizzare la creazione e pubblicazione di contenuti social su **LinkedIn e Threads**.

Non è un tool SaaS. È una configurazione di Claude Code che trasforma il tuo assistente AI in un social media manager personale, completamente personalizzato sulla tua voce e strategia.

### Cosa fa

- Gestisce un **piano editoriale mensile** (distribuzione TOFU/MOFU/BOFU automatica)
- Ogni mattina: scrivi `/smm`, lui sceglie il topic del giorno, scrive il testo, genera il visual, pubblica via API
- **4 agenti specializzati** lavorano in sequenza: Ricercatore → Scrittore → Reviewer → Visual
- **Visual generati programmaticamente** con node-canvas — nessun tool esterno, nessun account Canva
- **DM outreach** freddo su LinkedIn e Threads
- **Analisi delle reference**: impara dal tuo stile analizzando screenshot di post che ti piacciono
- **Self-healing**: quando uno script fallisce, Claude lo corregge da solo e riprova

### Piattaforme supportate

| Piattaforma | Post | DM outreach | Visual |
|---|---|---|---|
| LinkedIn | ✅ | ✅ | ✅ node-canvas 1200x1200 |
| Threads | ✅ | ✅ | ✅ node-canvas 1080x1080 |

### Prerequisiti

- [Claude Code](https://claude.ai/code)
- API keys per LinkedIn e/o Threads
- Node.js 18+
- Account Google Drive (per hosting visual Threads — richiesto dall'API Meta Graph)

### Setup rapido

```bash
# 1. Clona il template
git clone <repo-url>
npm install

# 2. Crea il tuo profilo
cp .claude/context/profile.template.md .claude/context/mio-profilo.md
# Compila il file seguendo le istruzioni al suo interno

# 3. Configura le credenziali
cp .env.example .env
# Compila .env con le tue API key

# 4. Primo avvio
# Apri Claude Code in questa cartella e scrivi:
/smm
```

**Guida completa:** [`SETUP.md`](SETUP.md)

### Struttura

```
.claude/
├── context/
│   ├── profile.template.md  ← compila questo con il tuo profilo
│   └── platforms.md         ← spec piattaforme (puoi lasciare invariato)
├── agents/                  ← 4 agenti specializzati (ricerca, scrittura, review, visual)
├── skills/
│   ├── linkedin-post/
│   │   └── scripts/
│   │       ├── carousel_generator.cjs  ← caroselli LinkedIn 1200x1200
│   │       └── meme_generator.cjs      ← meme Drake per post conversazionali
│   └── threads-post/
│       └── scripts/
│           └── visual_generator.cjs    ← visual Threads 1080x1080
├── commands/                ← entry point dei comandi Claude Code
├── references/              ← aggiungi screenshot di post che ti piacciono
├── plans/                   ← piano editoriale (generato automaticamente, ignorato da git)
└── setup/                   ← guide API e script installazione
```

### Comandi

| Comando | Descrizione |
|---|---|
| `/smm` | **Ogni mattina** — gestisce piano, crea e pubblica il contenuto del giorno |
| `/analyze-references` | Analizza screenshot in `references/`, aggiorna lo stile |
| `/dm` | DM freddo multi-social |
| `/linkedin-dm` | DM freddo LinkedIn (2 varianti A/B) |
| `/mockup-to-pdf` | Genera PDF proposta commerciale da mockup |

### Come funziona il visual

I visual vengono generati con **node-canvas** direttamente in locale, senza Canva o altri tool esterni. Il sistema usa SF Pro Rounded come font (incluso in macOS).

**LinkedIn:** il `carousel_generator.cjs` genera le slide in `.claude/output/carousel/` e le carica direttamente tramite LinkedIn API.

**Threads:** l'API Meta Graph richiede un URL pubblico (non file locali). Il flusso è: genera PNG → carica su Google Drive via MCP Google Drive → URL diretto → publisher.

Il file `carousel_generator.cjs` ha una sezione `SLIDES` che modifichi per ogni post, lasciando il render engine intatto.

---

---

## EN: What is this project

A **multi-agent system built on Claude Code** to automate social media content creation and publishing on **LinkedIn and Threads**.

This is not a SaaS tool. It's a Claude Code configuration that turns your AI assistant into a personal social media manager, fully customized to your voice and strategy.

### What it does

- Manages a **monthly editorial plan** (automatic TOFU/MOFU/BOFU distribution)
- Every morning: type `/smm`, it picks the topic, writes the copy, generates the visual, publishes via API
- **4 specialized agents** work in sequence: Researcher → Writer → Reviewer → Visual
- **Visuals generated programmatically** with node-canvas — no external tools, no Canva account needed
- **Cold DM outreach** on LinkedIn and Threads
- **Reference analysis**: learns from your style by analyzing screenshots of posts you like
- **Self-healing**: when a script fails, Claude fixes it and retries automatically

### Supported platforms

| Platform | Posts | DM outreach | Visuals |
|---|---|---|---|
| LinkedIn | ✅ | ✅ | ✅ node-canvas 1200x1200 |
| Threads | ✅ | ✅ | ✅ node-canvas 1080x1080 |

### Prerequisites

- [Claude Code](https://claude.ai/code)
- API keys for LinkedIn and/or Threads
- Node.js 18+
- Google Drive account (for Threads visual hosting — required by Meta Graph API)

### Quick start

```bash
# 1. Clone the template
git clone <repo-url>
npm install

# 2. Create your profile
cp .claude/context/profile.template.md .claude/context/my-profile.md
# Fill in the file following the instructions inside

# 3. Set up credentials
cp .env.example .env
# Fill in .env with your API keys

# 4. First run
# Open Claude Code in this folder and type:
/smm
```

**Full guide:** [`SETUP.md`](SETUP.md)

### Structure

```
.claude/
├── context/
│   ├── profile.template.md  ← fill this with your profile
│   └── platforms.md         ← platform specs (can leave as-is)
├── agents/                  ← 4 specialized agents (research, writing, review, visual)
├── skills/
│   ├── linkedin-post/
│   │   └── scripts/
│   │       ├── carousel_generator.cjs  ← LinkedIn carousels 1200x1200
│   │       └── meme_generator.cjs      ← Drake meme for conversational posts
│   └── threads-post/
│       └── scripts/
│           └── visual_generator.cjs    ← Threads visuals 1080x1080
├── commands/                ← Claude Code command entry points
├── references/              ← add screenshots of posts you like
├── plans/                   ← editorial plan (auto-generated, git-ignored)
└── setup/                   ← API guides and install scripts
```

### Commands

| Command | Description |
|---|---|
| `/smm` | **Every morning** — manages plan, creates and publishes today's content |
| `/analyze-references` | Analyzes screenshots in `references/`, updates style |
| `/dm` | Cold DM multi-social |
| `/linkedin-dm` | Cold DM LinkedIn (2 A/B variants) |
| `/mockup-to-pdf` | Generate commercial proposal PDF from mockup |

### How visuals work

Visuals are generated with **node-canvas** locally, with no Canva or external tools required. The system uses SF Pro Rounded as the font (included in macOS).

**LinkedIn:** `carousel_generator.cjs` generates slides in `.claude/output/carousel/` and uploads them directly via the LinkedIn API.

**Threads:** The Meta Graph API requires a public URL (not local files). The flow is: generate PNG → upload to Google Drive via Google Drive MCP → get direct URL → publisher.

The `carousel_generator.cjs` has a `SLIDES` section you modify for each post, leaving the render engine intact.

### Customization

The system is fully customizable. The key files to personalize:

1. **`.claude/context/profile.template.md`** → your identity, tone, topics, funnel strategy
2. **`.env`** → your API credentials
3. **`.claude/context/platforms.md`** → posting schedule, visual dimensions (can leave default)
4. **`.claude/references/`** → screenshots of posts/visuals you want to learn from

Everything else (agents, skills, scripts) is generic and works out of the box.

### License

MIT — fork it, adapt it, make it yours.
