# RecFinder

Platforma za iskanje in organizacijo rekreacijskih športnih dogodkov v Sloveniji.

## Opis

RecFinder je spletna aplikacija, ki omogoča uporabnikom:
- **Iskanje športnih dogodkov** v njihovi okolici
- **Ustvarjanje lastnih dogodkov** za različne športne aktivnosti
- **Pridružitev obstoječim dogodkom** drugih organizatorjev
- **Ocenjevanje organizatorjev in udeležencev** po dogodkih

## Tehnologije

### Frontend
- React 19
- React Router
- Parcel bundler
- Moderni CSS

### Backend  
- Node.js
- Express.js
- PostgreSQL (Neon)
- JWT avtentikacija
- bcrypt za varnost gesel

## Funkcionalnosti

- ✅ Registracija in prijava uporabnikov
- ✅ Ustvarjanje in urejanje športnih dogodkov
- ✅ Filtriranje dogodkov po lokaciji, športu, težavnosti
- ✅ Sistem pridružitve dogodkom
- ✅ Ocenjevanje udeležencev in organizatorjev
- ✅ Uporabniški profili z zgodovino dogodkov

## Zagon aplikacije

### Lokalni razvoj

1. **Kloniraj repozitorij:**
```bash
git clone https://github.com/MihaVal/RecFinder.git
cd RecFinder
```

2. **Namesti odvisnosti:**
```bash
npm run install:all
```

3. **Nastavi okoljske spremenljivke:**
```bash
cp .env.example backend/.env
# Uredi backend/.env z dejanskimi vrednostmi
```

4. **Zaženi oba strežnika:**
```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend  
npm run dev:frontend
```

### Produkcijski deployment

Aplikacija je pripravljena za deployment na Vercel:

1. Uvozi projekt v Vercel
2. Nastavi okoljske spremenljivke
3. Deploy bo avtomatičen

## Licenca

ISC © 2025 MihaVal