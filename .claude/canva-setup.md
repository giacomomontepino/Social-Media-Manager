# Setup Canva Connect API

Guida per configurare l'integrazione con Canva e abilitare il VISUAL AGENT nei comandi di post.

---

## Step 1 — Crea l'app su Canva Developer Portal

1. Vai su [developer.canva.com](https://developer.canva.com)
2. Accedi con il tuo account Canva
3. Clicca **"Create an app"**
4. Compila:
   - **App name:** Social Media Manager
   - **App description:** Tool per generare visual per post social
   - **Scopes richiesti:** `design:content:write`, `design:meta:read`, `asset:read`, `asset:write`
5. Salva e copia **Client ID** e **Client Secret**

---

## Step 2 — Ottieni l'Access Token (OAuth 2.0)

Canva usa OAuth 2.0 con il flusso Authorization Code. Esegui questi comandi nel terminale:

### 2a. Costruisci l'URL di autorizzazione

```bash
CLIENT_ID="IL_TUO_CLIENT_ID"
REDIRECT_URI="https://localhost:3000/callback"

echo "Apri questo URL nel browser:"
echo "https://www.canva.com/api/oauth/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=design%3Acontent%3Awrite%20design%3Ameta%3Aread%20asset%3Aread%20asset%3Awrite"
```

### 2b. Dopo aver autorizzato, copia il `code` dall'URL di redirect

L'URL sarà tipo: `https://localhost:3000/callback?code=XXXX`

### 2c. Scambia il code per l'access token

```bash
CLIENT_ID="IL_TUO_CLIENT_ID"
CLIENT_SECRET="IL_TUO_CLIENT_SECRET"
CODE="IL_CODE_DALL_URL"
REDIRECT_URI="https://localhost:3000/callback"

curl -X POST https://api.canva.com/rest/v1/oauth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=authorization_code&code=${CODE}&redirect_uri=${REDIRECT_URI}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}"
```

La risposta conterrà `access_token` e `refresh_token`.

---

## Step 3 — Salva il token come variabile d'ambiente

### Opzione A — Solo per la sessione corrente (temporanea)
```bash
export CANVA_ACCESS_TOKEN="il_tuo_access_token"
export CANVA_REFRESH_TOKEN="il_tuo_refresh_token"
export CANVA_CLIENT_ID="il_tuo_client_id"
export CANVA_CLIENT_SECRET="il_tuo_client_secret"
```

### Opzione B — Permanente (aggiungi al tuo ~/.zshrc)
```bash
echo 'export CANVA_ACCESS_TOKEN="il_tuo_access_token"' >> ~/.zshrc
echo 'export CANVA_REFRESH_TOKEN="il_tuo_refresh_token"' >> ~/.zshrc
echo 'export CANVA_CLIENT_ID="il_tuo_client_id"' >> ~/.zshrc
echo 'export CANVA_CLIENT_SECRET="il_tuo_client_secret"' >> ~/.zshrc
source ~/.zshrc
```

---

## Step 4 — Verifica che funzioni

```bash
curl -X GET https://api.canva.com/rest/v1/users/me \
  -H "Authorization: Bearer $CANVA_ACCESS_TOKEN"
```

Se ricevi un JSON con i tuoi dati utente, l'integrazione funziona.

---

## Refresh del Token (quando scade)

L'access token scade. Per rinnovarlo:

```bash
curl -X POST https://api.canva.com/rest/v1/oauth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=refresh_token&refresh_token=${CANVA_REFRESH_TOKEN}&client_id=${CANVA_CLIENT_ID}&client_secret=${CANVA_CLIENT_SECRET}"
```

---

## Verifica Setup Completo

```bash
# Controlla che tutte le variabili siano impostate
echo "CLIENT_ID: $CANVA_CLIENT_ID"
echo "ACCESS_TOKEN: ${CANVA_ACCESS_TOKEN:0:10}..."
echo "REFRESH_TOKEN: ${CANVA_REFRESH_TOKEN:0:10}..."
```
