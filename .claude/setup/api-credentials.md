# Guida Setup API Credentials

Copia `.env.example` in `.env` nella root del progetto e compila ogni variabile.

---

## LinkedIn

> I post vengono pubblicati sul **profilo personale** di Giacomo, non su una company page.
> La company page serve solo come requisito burocratico per registrare l'app developer.

### Step 1 — Crea una company page di comodo

Se non hai una company page:
1. linkedin.com → "Lavoro" → "Crea una pagina aziendale"
2. Scegli "Piccola impresa", inserisci un nome qualsiasi (es. "Giacomo Montepino Dev")
3. Non serve configurarla — è solo un requisito per il portale developer

### Step 2 — Crea l'app developer

1. Vai su [linkedin.com/developers](https://www.linkedin.com/developers/apps) → **Create app**
2. Associa la company page appena creata
3. Nella tab **Auth** → copia `Client ID` e `Client Secret` → inseriscili in `.env`
4. Nella tab **Products** → richiedi accesso a **Share on LinkedIn** e **Sign In with LinkedIn using OpenID Connect**
5. Attendi approvazione (di solito immediata)

### Step 3 — Genera l'access token

1. Vai su [linkedin.com/developers/tools/oauth](https://www.linkedin.com/developers/tools/oauth)
2. Seleziona la tua app, aggiungi scope: `w_member_social`, `openid`, `profile`
3. Clicca **Request access token** → autorizza con il TUO account LinkedIn personale
4. Copia il token → `LINKEDIN_ACCESS_TOKEN`

### Step 4 — Trova il tuo Person ID

```bash
curl -H "Authorization: Bearer TUO_ACCESS_TOKEN" https://api.linkedin.com/v2/userinfo
```
Il campo `sub` → `LINKEDIN_PERSON_ID`

**Variabili in `.env`:**
```
LINKEDIN_CLIENT_ID=           ← tab Auth dell'app
LINKEDIN_CLIENT_SECRET=       ← tab Auth dell'app
LINKEDIN_ACCESS_TOKEN=        ← Step 3
LINKEDIN_PERSON_ID=           ← campo "sub" Step 4
```

---

## X (Twitter)

### Step 1 — Crea l'app

1. Vai su [developer.twitter.com](https://developer.twitter.com/en/portal/dashboard)
2. Crea una nuova app nel tuo Project
3. Quando chiede "Describe all of your use cases of X's data and API", usa:
   > I use the X API to automatically publish posts and threads to my personal X account as part of a personal social media management workflow. No data is collected, stored, or shared. No user data is accessed beyond my own account. Posts are created programmatically from content I write and reviewed before publishing.

### Step 2 — Imposta i permessi

1. Vai in **User authentication settings**
2. Imposta i permessi su **Read and Write** (non solo Read)
3. Aggiungi come Callback URL: `https://localhost`
4. Aggiungi come Website URL: il tuo LinkedIn o qualsiasi URL pubblico
5. **Salva prima di generare i token** — se generi i token prima di impostare Write, devi rigenerarli

### Step 3 — Copia le chiavi

- **Consumer Key** → `X_API_KEY` e `X_API_KEY_SECRET`
- **Access Token** → clicca Generate → `X_ACCESS_TOKEN` e `X_ACCESS_TOKEN_SECRET`

**Variabili in `.env`:**
```
X_API_KEY=                ← Consumer Key
X_API_KEY_SECRET=         ← Consumer Key Secret
X_ACCESS_TOKEN=           ← Access Token
X_ACCESS_TOKEN_SECRET=    ← Access Token Secret
```

> Client ID e Client Secret che X mostra non servono — il publisher usa OAuth 1.0a (le 4 chiavi sopra).

---

## Threads

> Il token dura **60 giorni** ed è rinnovabile senza rifare tutto il flusso.

### Step 1 — Crea l'app su Meta

1. Vai su [developers.facebook.com](https://developers.facebook.com/apps)
2. Crea una nuova app → tipo **Business**
3. Aggiungi il prodotto **Threads API**
4. Vai in **Ruoli** → **Tester** → aggiungi il tuo account Facebook e accetta l'invito su facebook.com/settings?tab=applications

### Step 2 — Aggiungi redirect URI

Nelle impostazioni dell'app (cerca "URI di reindirizzamento OAuth" o nella sezione Threads API):
- Aggiungi `https://localhost`

### Step 3 — Autorizza l'app (ottieni il code)

Apri nel browser (sostituisci `CLIENT_ID` con l'**id app threads**):
```
https://threads.net/oauth/authorize?client_id=CLIENT_ID&redirect_uri=https://localhost&scope=threads_basic,threads_content_publish&response_type=code
```
Il browser reindirizza su `https://localhost/?code=XXXXXXXX` (pagina con errore — è normale).
Copia il valore di `code` dall'URL, escludi il `#_` finale.

### Step 4 — Ottieni il token short-lived

```bash
curl -X POST "https://graph.threads.net/oauth/access_token" \
  -d "client_id=ID_APP_THREADS" \
  -d "client_secret=CHIAVE_SEGRETA_THREADS" \
  -d "grant_type=authorization_code" \
  -d "redirect_uri=https://localhost" \
  -d "code=IL_CODE_COPIATO"
```
Ricevi `access_token` (short-lived) e `user_id` → annota entrambi.

### Step 5 — Scambia con token long-lived (60 giorni)

```bash
curl "https://graph.threads.net/access_token?grant_type=th_exchange_token&client_secret=CHIAVE_SEGRETA_THREADS&access_token=SHORT_LIVED_TOKEN"
```
Ricevi il token long-lived → `THREADS_ACCESS_TOKEN`

**Variabili in `.env`:**
```
THREADS_ACCESS_TOKEN=     ← token long-lived Step 5
THREADS_USER_ID=          ← user_id ricevuto al Step 4
```

### Rinnovo token (ogni ~60 giorni)

```bash
curl "https://graph.threads.net/refresh_access_token?grant_type=th_refresh_token&access_token=TUO_TOKEN_ATTUALE"
```
Aggiorna `THREADS_ACCESS_TOKEN` in `.env` con il nuovo token.

---

## Verifica Setup

Dopo aver compilato `.env`, testa con:
```bash
node .claude/skills/linkedin-post/scripts/publisher.js --dry-run
node .claude/skills/x-post/scripts/publisher.js --dry-run
node .claude/skills/threads-post/scripts/publisher.js --dry-run
```
Ogni script deve rispondere `✓ Auth OK — dry run completato.`
