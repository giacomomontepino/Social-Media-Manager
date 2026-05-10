# Social Media Manager — Claude Code

> **Versione italiana** sotto / **English version** below

---

## IT: Cos'è questo progetto

Un sistema **multi-agente basato su Claude Code** per automatizzare la creazione e pubblicazione di contenuti social su **LinkedIn, X (Twitter) e Threads**.

Non è un tool SaaS. È una configurazione di Claude Code che trasforma il tuo assistente AI in un social media manager personale, completamente personalizzato sulla tua voce e strategia.

### Cosa fa

- Gestisce un **piano editoriale mensile** (30 post, distribuzione TOFU/MOFU/BOFU)
- Ogni mattina: scegli l'argomento del giorno, scrive il testo, crea il visual su Canva, pubblica via API
- **4 agenti specializzati** lavorano in sequenza: Ricercatore → Scrittore → Reviewer → Visual
- **DM outreach** freddo su LinkedIn, X e Threads
- **Analisi delle reference**: impara dal tuo stile analizzando screenshot di post che ti piacciono
- **Self-healing**: quando uno script fallisce, Claude lo corregge da solo e riprova

### Piattaforme supportate

| Piattaforma | Post | DM outreach | Visual |
|---|---|---|---|
| LinkedIn | ✅ | ✅ | ✅ Canva 1200x1200 |
| X (Twitter) | ✅ | ✅ | ✅ Canva 1600x900 |
| Threads | ✅ | ✅ | ✅ Canva 1080x1080 |

### Prerequisiti

- [Claude Code](https://claude.ai/code)
- Account [Canva](https://canva.com) (tier gratuito sufficiente)
- API keys per LinkedIn, X e/o Threads
- Node.js 18+

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
├── skills/                  ← logica completa di ogni comando
├── commands/                ← entry point dei comandi Claude Code
├── references/              ← aggiungi screenshot di post che ti piacciono
├── plans/                   ← piano editoriale (generato automaticamente)
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

---

---

## EN: What is this project

A **multi-agent system built on Claude Code** to automate social media content creation and publishing on **LinkedIn, X (Twitter) and Threads**.

This is not a SaaS tool. It's a Claude Code configuration that turns your AI assistant into a personal social media manager, fully customized to your voice and strategy.

### What it does

- Manages a **monthly editorial plan** (30 posts, TOFU/MOFU/BOFU distribution)
- Every morning: pick the topic, write the copy, create the Canva visual, publish via API
- **4 specialized agents** work in sequence: Researcher → Writer → Reviewer → Visual
- **Cold DM outreach** on LinkedIn, X, and Threads
- **Reference analysis**: learns from your style by analyzing screenshots of posts you like
- **Self-healing**: when a script fails, Claude fixes it and retries automatically

### Supported platforms

| Platform | Posts | DM outreach | Visuals |
|---|---|---|---|
| LinkedIn | ✅ | ✅ | ✅ Canva 1200x1200 |
| X (Twitter) | ✅ | ✅ | ✅ Canva 1600x900 |
| Threads | ✅ | ✅ | ✅ Canva 1080x1080 |

### Prerequisites

- [Claude Code](https://claude.ai/code)
- [Canva](https://canva.com) account (free tier works)
- API keys for LinkedIn, X and/or Threads
- Node.js 18+

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
├── skills/                  ← full logic for each command
├── commands/                ← Claude Code command entry points
├── references/              ← add screenshots of posts you like
├── plans/                   ← editorial plan (auto-generated)
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

### Customization

The system is designed to be fully customized per user. The key files to personalize:

1. **`.claude/context/profile.template.md`** → your identity, tone, topics, funnel strategy
2. **`.env`** → your API credentials
3. **`.claude/context/platforms.md`** → posting schedule, visual dimensions (can leave default)
4. **`.claude/references/`** → screenshots of posts/visuals you want to learn from

Everything else (agents, skills, scripts) is generic and works out of the box.

### License

MIT — fork it, adapt it, make it yours.
