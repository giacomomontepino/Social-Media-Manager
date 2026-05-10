# Guida Setup / Setup Guide

> **IT:** Questa guida ti porta da zero a un sistema funzionante in ~30 minuti.
> **EN:** This guide takes you from zero to a working system in ~30 minutes.

---

## IT: Prima di iniziare

Ti serve:
- [Claude Code](https://claude.ai/code) installato e configurato
- Un account [Canva](https://canva.com) (per i visual — il tier gratuito funziona)
- Account sviluppatore su LinkedIn, X e/o Threads (solo per le piattaforme che vuoi usare)
- Node.js 18+ installato

## EN: Before you start

You need:
- [Claude Code](https://claude.ai/code) installed and configured
- A [Canva](https://canva.com) account (for visuals — free tier works)
- Developer accounts on LinkedIn, X and/or Threads (only for platforms you want to use)
- Node.js 18+ installed

---

## Passo 1 — Clona il progetto / Step 1 — Clone the project

```bash
# IT: Clona usando il pulsante "Use this template" su GitHub, poi:
# EN: Clone using the "Use this template" button on GitHub, then:

cd social-media-manager
npm install
```

---

## Passo 2 — Crea il tuo profilo / Step 2 — Create your profile

**IT:**
1. Copia `.claude/context/profile.template.md`
2. Rinominalo (es. `.claude/context/mario.md`)
3. Compilalo seguendo le istruzioni dentro il file — è il documento più importante: definisce chi sei, il tuo tono, i tuoi argomenti
4. Apri `CLAUDE.md` e aggiorna la sezione `## Identità` con il tuo nome e la riga `Dettagli completi: .claude/context/TUO-FILE.md`

**EN:**
1. Copy `.claude/context/profile.template.md`
2. Rename it (e.g. `.claude/context/john.md`)
3. Fill it in following the instructions inside — this is the most important file: it defines who you are, your tone, your topics
4. Open `CLAUDE.md` and update the `## Identità` section with your name and the line `Full details: .claude/context/YOUR-FILE.md`

---

## Passo 3 — Credenziali API / Step 3 — API credentials

**IT:**
```bash
cp .env.example .env
```
Apri `.env` e compila le credenziali. Segui la guida dettagliata in `.claude/setup/api-credentials.md` per ottenere ogni chiave.

**EN:**
```bash
cp .env.example .env
```
Open `.env` and fill in your credentials. Follow the detailed guide in `.claude/setup/api-credentials.md` to get each key.

> **IT:** Vuoi usare solo una piattaforma? Lascia vuote le altre — il sistema funziona anche con credenziali parziali.
> **EN:** Want to use only one platform? Leave the others empty — the system works with partial credentials too.

---

## Passo 4 — Configura Canva MCP / Step 4 — Configure Canva MCP

**IT:**
Il file `.mcp.json` è già configurato per Canva. Per attivarlo:
1. Apri Claude Code
2. Vai in Settings → MCP Servers
3. Verifica che "canva" appaia nella lista e sia abilitato
4. Segui la guida in `.claude/canva-setup.md` per l'autenticazione

**EN:**
The `.mcp.json` file is already configured for Canva. To activate it:
1. Open Claude Code
2. Go to Settings → MCP Servers
3. Verify "canva" appears in the list and is enabled
4. Follow the guide in `.claude/canva-setup.md` for authentication

---

## Passo 5 — Testa le credenziali / Step 5 — Test credentials

```bash
node .claude/skills/linkedin-post/scripts/publisher.js --dry-run
node .claude/skills/x-post/scripts/publisher.js --dry-run
node .claude/skills/threads-post/scripts/publisher.js --dry-run
```

**IT:** Se un test fallisce, l'output mostra l'errore specifico. Consulta `.claude/setup/api-credentials.md` per la risoluzione.
**EN:** If a test fails, the output shows the specific error. See `.claude/setup/api-credentials.md` for troubleshooting.

---

## Passo 6 — Prima esecuzione / Step 6 — First run

**IT:** Apri Claude Code nella cartella del progetto e scrivi:

**EN:** Open Claude Code in the project folder and type:

```
/smm
```

**IT:** Claude creerà il piano editoriale del mese, sceglierà un argomento per oggi e guiderà la creazione del contenuto completo (testo + visual Canva).

**EN:** Claude will create the monthly editorial plan, pick a topic for today, and guide the creation of the complete content (text + Canva visual).

---

## Personalizzazione avanzata / Advanced customization

**IT:**
- **Piattaforme:** Modifica `.claude/context/platforms.md` per cambiare orari, dimensioni o stile per ogni piattaforma
- **Agenti:** Le istruzioni in `.claude/agents/*.md` sono generiche — puoi aggiustarle per il tuo settore
- **DM outreach:** Personalizza i template in `.claude/skills/dm/SKILL.md` e `.claude/skills/linkedin-dm/SKILL.md`
- **References:** Aggiungi screenshot di post che ti piacciono in `.claude/references/` ed esegui `/analyze-references` per far "imparare" il sistema dal tuo stile

**EN:**
- **Platforms:** Edit `.claude/context/platforms.md` to change timing, dimensions or style for each platform
- **Agents:** Instructions in `.claude/agents/*.md` are generic — you can adjust them for your industry
- **DM outreach:** Customize templates in `.claude/skills/dm/SKILL.md` and `.claude/skills/linkedin-dm/SKILL.md`
- **References:** Add screenshots of posts you like to `.claude/references/` and run `/analyze-references` to have the system learn from your style

---

## Comandi disponibili / Available commands

| Comando / Command | Descrizione IT | EN Description |
|---|---|---|
| `/smm` | Comando principale — ogni mattina | Main command — every morning |
| `/analyze-references` | Analizza screenshot in `references/` | Analyzes screenshots in `references/` |
| `/dm` | DM freddo multi-social | Cold DM multi-social |
| `/linkedin-dm` | DM freddo LinkedIn (2 varianti) | Cold DM LinkedIn (2 variants) |
| `/mockup-to-pdf` | Genera PDF proposta da mockup | Generate proposal PDF from mockup |

---

## Problemi comuni / Common issues

**IT:** Consulta la sezione `## Self-Healing — Log Errori` del file `SKILL.md` della skill che ha dato problemi.
**EN:** Check the `## Self-Healing — Error Log` section in the `SKILL.md` file of the skill that failed.

Per segnalare bug o proporre miglioramenti, apri una Issue su GitHub.
To report bugs or suggest improvements, open a GitHub Issue.
