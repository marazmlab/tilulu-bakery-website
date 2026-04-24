# Definicja MVP - Tilulu Bakery

## Główny problem użytkownika

### Klient cukierni

"Chcę zamówić tort/ciasto na wydarzenie, potrzebuję miejsca w którym sprawdzę, co cukiernia oferuje. Potrzebuję prostego sposobu na złożenie zamówienia online oraz zakomunikowanie właścicielowi o potrzebie dalszej komunikacji"

### Właściciel cukierni

"Chcę posiadać jedną stronę internetową, która była by moją wizytówką i posiadała formularz, który ułatwi ludziom dokonanie wyboru i zamówienia. Zamówień na teraz nie jest dużo, więc problemem nie jest zarządzanie zamówieniami, tylko posiadanie jednej spójnej drogi do tego dla ludzi. Ostatecznie strona ma być narzędziem do dokumentacji pracy do dalszego rozwoju firmy"

---

## CO WCHODZI W MVP

### Strony publiczne

1. **Strona główna** - hero section, krótki opis, zdjęcia wyrobów, CTA "Zobacz nasze realizacje"
2. **Oferta** - galeria produktów (torty, ciasta, ciastka, alfajores) z opisami i cenami orientacyjnymi - poglądowe info
3. **O nas** - historia cukierni, wartości, zdjęcie właścicieli/zespołu
4. **Zamówienia** - formularz zamówienia
5. **Kontakt** - dane kontaktowe, social media

### Formularz zamówienia

1. Wybór kategorii produktu (tort, ciasto, ciastka, alfajores)
2. Textarea na szczegóły zamówienia (500-1000 znaków) - smak, rozmiar, kolory, dekoracje itp.
3. Data odbioru (bez godziny - uzgadniana po kontakcie)
4. Dane klienta: imię, email, telefon
5. Opcjonalne: zdjęcie inspiracji (upload, max 5 MB)
6. Walidacja: wymagane pola, format email/telefon, data w przyszłości (min. +48h)

### Backend

1. Zapis zamówienia do Supabase (tabela orders)
2. Wysłanie emaila do właściciela z detalami i wysłanie powiadomienia SMS
3. Automatyczna odpowiedź dla klienta: "Dziękujemy za zamówienie, prosimy czekać na kontakt"

### Dostęp właściciela

1. Logowanie do Supabase Dashboard
2. Przeglądanie tabeli orders (zamówienia chronologicznie)
3. Opcjonalnie: Kolumna status (nowe/potwierdzone/zrealizowane) - zmiana ręcznie w dashboardzie

---

## CO NIE WCHODZI W MVP

### Funkcje zaawansowane

- Panel admin z custom UI (właściciel używa Supabase Dashboard)
- System płatności online (zamówienie + płatność przy odbiorze)
- Konta użytkowników / historia zamówień dla klientów
- Kalendarz dostępności / rezerwacja terminów
- Wersje językowe (angielski i inne)
- Blog / aktualności
- System recenzji / opinii klientów

### Funkcje techniczne

- PWA / offline mode
- Real-time updates
- Zaawansowana analityka (Google Analytics wystarczy)
- CDN dla obrazków (opcjonalnie później)

### Biznesowe

- Integracja z systemem księgowym
- Automatyczne faktury
- Program lojalnościowy
- Kupony / kody rabatowe

---

## KRYTERIA SUKCESU MVP

### Techniczne

1. ✅ Strona działa na urządzeniach mobilnych i desktopowych (responsive)
2. ✅ Formularz waliduje dane przed wysłaniem
3. ✅ Właściciel dostaje powiadomienie SMS o emailu
4. ✅ Strona ładuje się <3s (Lighthouse score >80)
5. ✅ Zero błędów w konsoli przeglądarki

### Biznesowe (właściciel)

1. ✅ Otrzymuje email z każdym nowym zamówieniem w <2 min
2. ✅ Otrzymuje SMS z powiadomieniem o mailu
3. ✅ Może przeglądać wszystkie zamówienia w Supabase Dashboard
4. ✅ Email zawiera wszystkie niezbędne dane do kontaktu z klientem

### Użytkowe (klient)

1. ✅ Może złożyć zamówienie w <3 minuty
2. ✅ Dostaje potwierdzenie że zamówienie dotarło
3. ✅ Widzi ofertę cukierni ze zdjęciami i cenami

### Deployment

1. ✅ Strona dostępna publicznie - własna domena
2. ✅ Działa 24/7 bez Twojej ingerencji

---

## UPROSZCZONY ZAKRES PROJEKTU

```
MVP = ok 5 stron + 1 formularz + email + SMS + baza
Czas realizacji: ~20-30 godzin pracy
Złożoność: Niska (idealna na start)
```

### Stack technologiczny

- **Frontend:** Astro + React + Tailwind CSS + shadcn/ui
- **Backend:** Astro API endpoints
- **Baza danych:** Supabase (PostgreSQL)
- **Storage:** Supabase Storage (zdjęcia inspiracji)
- **Email:** Resend lub SendGrid
- **SMS:** SMSAPI.pl lub Twilio
- **Hosting:** Cloudflare Pages lub Vercel
- **Domena:** tilulu.pl/.com/.eu (do zakupu)

### Kluczowe decyzje

1. **Lead time:** Minimum 48 godzin (blokada dat: dzisiaj + jutro)
2. **Brak limitu zamówień:** Właściciel ma elastyczny czas pracy
3. **Storage zdjęć:** Supabase Storage (5 MB max)
4. **Powiadomienia:** Email + SMS dla pewności dostarczenia
5. **Branding:** Placeholdery (logo, kolory) - do aktualizacji w przyszłości
6. **Język:** Tylko polski (struktura i18n-ready na przyszłość)

---

## Roadmap rozwoju (poza MVP)

### Faza 2: Panel Admin
- Custom UI dla właściciela
- Zarządzanie statusami zamówień
- Automatyczne emaile do klientów po zmianach statusu
- Podstawowe statystyki

### Faza 3: UX Improvements
- Produkty w bazie danych (zamiast hardcoded)
- Kalendarz z blokadą zajętych terminów
- Ulepszona galeria (lightbox)
- FAQ

### Faza 4: Konta klientów
- Rejestracja/logowanie
- Historia zamówień
- Tracking statusu
- Newsletter

### Backlog
- Płatności online
- Kody rabatowe
- Aplikacja mobilna

---

## Data utworzenia

**Wersja:** 1.0  
**Data:** 2025-03-30  
**Bazuje na:** Sesji planistycznej PRD
