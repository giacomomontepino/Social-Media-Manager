# References — Come Usare Questa Cartella

Carica qui screenshot di post (tuoi o di altri) da cui vuoi prendere spunto.
Dopo aver caricato nuovi file, invoca `/analyze-references` per analizzarli.

## Struttura

```
references/
├── posts/
│   ├── linkedin/   ← screenshot di post testuali LinkedIn
│   ├── x/          ← screenshot di post testuali X (thread o singolo)
│   └── threads/    ← screenshot di post testuali Threads
└── visuals/
    ├── linkedin/   ← screenshot di caroselli o immagini LinkedIn
    ├── x/          ← screenshot di visual X
    └── threads/    ← screenshot di visual Threads
```

## Convenzioni

- **Nomi file:** liberi — usa quello che vuoi (es. `hook-domanda.png`, `dark-style-x.png`)
- **Formato:** PNG o JPG
- **Fonte:** post tuoi, post di competitor, post di creator che ti ispirano — non importa
- **Piattaforma:** determinata dalla sottocartella, non dal nome del file

## Cosa succede quando invochi /analyze-references

1. Vengono rilevati i file nuovi (non ancora analizzati)
2. Ogni immagine viene letta e analizzata visivamente
3. Ricevi un report con domande di conferma
4. Dopo le tue risposte, le skill vengono aggiornate automaticamente
5. I file analizzati vengono marcati nel `manifest.md`
