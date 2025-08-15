# RecFinder Backend API

Node.js/Express API za RecFinder platformo rekreacijskih športnih dogodkov.

## Funkcionalnosti

- **Upravljanje uporabnikov**: Registracija, avtentikacija, upravljanje profila
- **Upravljanje dogodkov**: Ustvarjanje, urejanje, brisanje in iskanje športnih dogodkov
- **Udeležba na dogodkih**: Pridružitev/zapustitev dogodkov, pregled seznamov udeležencev
- **Sistem ocenjevanja**: Ocenjevanje organizatorjev in udeležencev dogodkov
- **Varnost**: JWT avtentikacija, omejevanje zahtev, validacija vhodnih podatkov

## API Končne točke

### Avtentikacija
- `POST /api/auth/register` - Registracija uporabnika
- `POST /api/auth/login` - Prijava uporabnika
- `GET /api/auth/me` - Pridobi podatke o trenutnem uporabniku

### Uporabniki
- `GET /api/users/profile` - Pridobi uporabniški profil
- `PUT /api/users/profile` - Posodobi uporabniški profil
- `GET /api/users/:id` - Pridobi uporabnika po ID-ju
- `GET /api/users/:id/ratings` - Pridobi ocene uporabnika
- `DELETE /api/users/account` - Izbriši uporabniški račun

### Dogodki
- `GET /api/events` - Pridobi vse dogodke (z filtri)
- `POST /api/events` - Ustvari nov dogodek
- `GET /api/events/:id` - Pridobi podrobnosti dogodka
- `PUT /api/events/:id` - Posodobi dogodek
- `DELETE /api/events/:id` - Izbriši dogodek
- `GET /api/events/my/created` - Pridobi uporabnikove ustvarjene dogodke
- `GET /api/events/my/attending` - Pridobi dogodke, katerih se uporabnik udeležuje

### Udeležba na dogodkih
- `POST /api/events/:eventId/join` - Pridruži se dogodku
- `DELETE /api/events/:eventId/leave` - Zapusti dogodek
- `GET /api/events/:eventId/attendees` - Pridobi udeležence dogodka
- `GET /api/events/:eventId/status` - Pridobi status udeležbe

### Ocene
- `POST /api/ratings` - Ustvari oceno
- `PUT /api/ratings/:id` - Posodobi oceno
- `GET /api/ratings/events/:eventId` - Pridobi ocene dogodka
- `GET /api/ratings/users/:userId` - Pridobi ocene uporabnika
- `GET /api/ratings/check/:eventId/:rateeId` - Preveri, ali je uporabnik ocenil
- `DELETE /api/ratings/:id` - Izbriši oceno

## Namestitev

1. Namesti odvisnosti:
```bash
npm install
```

2. Ustvari `.env` datoteko:
```bash
cp .env.example .env
```

3. Konfiguriraj okoljske spremenljivke v `.env`:
```
DATABASE_URL=tvoja_neon_postgres_povezava
JWT_SECRET=tvoj_jwt_ključ
NODE_ENV=development
PORT=3000
```

4. Zaženi razvojni strežnik:
```bash
npm run dev
```

## Shema podatkovne baze

API uporablja PostgreSQL z naslednjimi tabelami:
- `users` - Uporabniški računi
- `events` - Športni dogodki
- `event_attendees` - Sledenje udeležbi na dogodkih
- `ratings` - Sistem ocenjevanja uporabnikov

## Varnostne funkcionalnosti

- JWT avtentikacija
- Hashiranje gesel z bcrypt
- Omejevanje zahtev
- Validacija vhodnih podatkov
- Zaščita pred SQL injection napadi
- XSS zaščita z Helmet