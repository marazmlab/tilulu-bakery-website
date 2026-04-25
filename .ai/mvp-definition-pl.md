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

1. Zapis zamówienia do Supabase (tabela orders) z RLS policies
2. Server-side validation (Zod) i rate limiting (5 zapytań/IP/godzinę)
3. Wysłanie emaila do właściciela z detalami
4. Automatyczna odpowiedź dla klienta: "Dziękujemy za zamówienie, prosimy czekać na kontakt"
5. Upload security (walidacja typu MIME, maksymalny rozmiar pliku)

### Dostęp właściciela

1. Logowanie do Supabase Dashboard
2. Przeglądanie tabeli orders (zamówienia chronologicznie)
3. Opcjonalnie: Kolumna status (nowe/potwierdzone/zrealizowane) - zmiana ręcznie w dashboardzie

---

## CO NIE WCHODZI W MVP

### Funkcje zaawansowane

- Panel admin z custom UI (właściciel używa Supabase Dashboard)
- System płatności online (zamówienie + płatność przy odbiorze)
- Powiadomienia SMS (przeniesione do Fazy 2)
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
2. ✅ Formularz waliduje dane po stronie serwera (Zod) i klienta
3. ✅ Bezpieczeństwo: RLS policies, rate limiting, upload validation
4. ✅ Strona ładuje się <3s (Lighthouse score >80)
5. ✅ Zero błędów w konsoli przeglądarki

### Biznesowe (właściciel)

1. ✅ Otrzymuje email z każdym nowym zamówieniem w <2 min
2. ✅ Może przeglądać wszystkie zamówienia w Supabase Dashboard
3. ✅ Email zawiera wszystkie niezbędne dane do kontaktu z klientem
4. ✅ Bezpieczne przechowywanie danych klientów (RLS w Supabase)

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
MVP = ok 5 stron + 1 formularz + email + baza + bezpieczeństwo
Czas realizacji: ~20-30 godzin pracy
Złożoność: Niska (idealna na start)
```

### Stack technologiczny

- **Frontend:** Astro + React (tylko formularz i galeria) + Tailwind CSS + shadcn/ui
- **Backend:** Astro API endpoints
- **Baza danych:** Supabase (PostgreSQL) z RLS policies
- **Storage:** Supabase Storage (zdjęcia inspiracji)
- **Email:** Resend
- **SMS:** SMSAPI.pl (przeniesione do Fazy 2)
- **Security:** Server-side validation (Zod), rate limiting, upload validation
- **Hosting:** Vercel (lepszy dla API endpoints)
- **Domena:** tilulu.pl/.com/.eu (do zakupu)
- **Design:** Wireframe + Figma template LUB design-as-you-code

### Kluczowe decyzje

1. **Lead time:** Minimum 48 godzin (blokada dat: dzisiaj + jutro)
2. **Brak limitu zamówień:** Właściciel ma elastyczny czas pracy
3. **Storage zdjęć:** Supabase Storage (5 MB max)
4. **Powiadomienia:** Tylko email w MVP (SMS w Fazy 2)
5. **Branding:** Placeholdery z Unsplash API, potem prawdziwe zdjęcia
6. **Język:** Tylko polski (struktura i18n-ready na przyszłość)
7. **React usage:** Tylko dla interaktywnych komponentów (formularz, galeria)
8. **Security-first:** RLS, server-side validation, rate limiting od MVP

---

## Roadmap rozwoju (poza MVP)

### Faza 2: SMS + Koszyk + Kreator
- Powiadomienia SMS (SMSAPI.pl)
- Wieloproduktowy koszyk z localStorage
- 5-krokowy kreator tortów (interaktywny wizard)
- Upload wielu zdjęć (do 3)
- Mini-widget koszyka w nawigacji
- Zaawansowany error handling

### Faza 3: Custom Panel Admin
- Custom UI dla właściciela (zastępuje Supabase Dashboard)
- Zarządzanie statusami zamówień
- Automatyczne emaile do klientów po zmianach statusu
- Podstawowe statystyki

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

**Wersja:** 1.1  
**Data:** 2026-04-25  
**Ostatnia aktualizacja:** Usunięcie SMS z MVP (przeniesione do Fazy 2), dodanie bezpieczeństwa, shadcn/ui, Vercel hosting
**Bazuje na:** Sesji planistycznej PRD + analiza stacku technologicznego
