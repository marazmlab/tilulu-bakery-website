# Dokument wymagań produktu (PRD) - Tilulu Bakery

## 1. Przegląd produktu

Tilulu Bakery to strona internetowa dla domowej piekarni zlokalizowanej w Szczecinie. Produkt pełni podwójną rolę: wizytówki online prezentującej ofertę cukierni oraz centralnego punktu przyjmowania zapytań ofertowych od klientów.

Strona zastępuje rozproszone kanały komunikacji (Instagram DM, WhatsApp, telefon) jednym spójnym interfejsem, przez który klienci mogą przeglądać ofertę ze zdjęciami i cenami, a następnie wysyłać zapytania ofertowe przez prosty formularz. Właścicielka otrzymuje powiadomienia email o każdym nowym zapytaniu (SMS w kolejnych fazach rozwoju), a wszystkie dane są przechowywane w bazie Supabase.

W przyszłych fazach rozwoju planowane jest dodanie interaktywnego koszyka wieloproduktowego oraz 5-krokowego kreatora tortów, które umożliwią bardziej zaawansowaną kompozycję zamówień.

Produkt jest przeznaczony dla dwóch grup użytkowników: klientów cukierni (głównie kobiety 30-60 lat, Szczecin i okolice, z możliwością wysyłki na terenie Polski) oraz właścicielki piekarni, która zarządza zamówieniami przez Supabase Dashboard.

### Kluczowe założenia MVP (Faza 1)
- Prosty formularz zamówienia z textarea do opisu produktu - bez kreatora i koszyka
- Formularz jest zapytaniem ofertowym, nie zakupem - każde zamówienie wymaga potwierdzenia przez właścicielkę
- Brak systemu płatności online - rozliczenia gotówką przy odbiorze lub przelewem prywatnym
- Brak panelu administracyjnego - właścicielka korzysta z Supabase Dashboard
- Brak kont użytkowników - klienci składają zamówienia bez rejestracji
- Język: wyłącznie polski (struktura i18n-ready na przyszłość)
- Zdjęcia i treści hardcoded w kodzie z placeholderami na start

### Roadmap rozwoju
- **Faza 1 (MVP)**: 5 stron publicznych + prosty formularz + email + Supabase Dashboard
- **Faza 2**: SMS + wieloproduktowy koszyk + 5-krokowy kreator tortów + zaawansowany error handling
- **Faza 3**: Custom panel admin + zarządzanie statusami + automatyczne emaile
- **Faza 4**: Konta klientów + historia zamówień + tracking statusu

### Stack technologiczny
- Frontend: Astro + React (tylko formularz i galeria) + Tailwind CSS + shadcn/ui
- Backend: Astro API endpoints
- Baza danych: Supabase (PostgreSQL)
- Storage: Supabase Storage (zdjęcia inspiracji)
- Email: Resend (React Email)
- SMS: SMSAPI.pl (przeniesione do Fazy 2)
- Hosting: Vercel (lepszy dla API endpoints)
- Security: RLS policies, server-side validation (Zod), rate limiting
- State management (Faza 2+): Zustand lub Context API + localStorage
- Analityka: Google Analytics 4 + Microsoft Clarity

### Design strategy
- UI Components: shadcn/ui (oszczędność czasu development + accessibility)
- Design approach: Wireframe + Figma template customization LUB design-as-you-code
- Placeholders: Unsplash API do MVP, potem prawdziwe zdjęcia w Supabase Storage

### Architecture decisions
- **React usage:** Tylko dla interaktywnych komponentów (formularz zamówienia, galeria z filtrami)
- **Astro pages:** Statyczne strony (Home, O nas, Kontakt) bez Reacta dla lepszej performance
- **API strategy:** Astro API endpoints zamiast direct Supabase calls (lepsze bezpieczeństwo)
- **Hosting:** Vercel preferowany nad Cloudflare Pages (lepsze API endpoints support)

## 2. Problem użytkownika

### Klient cukierni

Klient szuka tortu lub ciasta na okazję (urodziny, wesele, spotkanie). Potrzebuje jednego miejsca, w którym może sprawdzić ofertę piekarni ze zdjęciami i cenami, a następnie złożyć zamówienie online w prosty sposób. Obecnie musi szukać informacji na Instagramie, pisać DM lub dzwonić, co jest nieefektywne i nie daje pewności, że zapytanie dotarło do właścicielki. Klient nie wie, jakie opcje są dostępne, ile kosztują i jak wygląda proces zamówienia.

Dodatkowe problemy klienta:
- Brak centralnego katalogu produktów z cenami orientacyjnymi
- Brak ustrukturyzowanego sposobu opisu zamówienia (szczególnie tortów na zamówienie z wieloma parametrami)
- Brak potwierdzenia, że zapytanie zostało odebrane
- Konieczność osobnego kontaktu dla każdego produktu przy zamówieniu wieloproduktowym (np. tort + ciastka na to samo wydarzenie)

### Właścicielka piekarni

Właścicielka prowadzi domową piekarnię i potrzebuje profesjonalnej wizytówki online z formularzem, który ustandaryzuje proces przyjmowania zamówień. Obecnie zapytania przychodzą chaotycznie przez różne kanały, co utrudnia ich śledzenie. Nie ma problemu z liczbą zamówień (3-4 tygodniowo), ale z brakiem jednego spójnego procesu. Strona ma docelowo służyć również jako narzędzie do dokumentowania pracy i rozwoju biznesu.

Dodatkowe problemy właścicielki:
- Brak historii zamówień w jednym miejscu
- Ryzyko przeoczenia zapytania przychodzącego przez DM lub telefon
- Brak profesjonalnej prezentacji oferty, która przyciągałaby nowych klientów
- Powtarzające się pytania o te same informacje (ceny, dostępne smaki, terminy)

## 3. Wymagania funkcjonalne

---

## FAZA 1: MVP (Wersja bazowa)

### 3.1 Strony publiczne

#### 3.1.1 Strona główna
- Hero section z głównym zdjęciem i krótkim opisem piekarni
- Galeria wybranych realizacji (zdjęcia tortów i wypieków)
- Krótki opis oferty i wartości piekarni
- CTA kierujący do strony zamówień ("Zobacz ofertę" / "Złóż zamówienie")
- Responsywny layout (mobile-first)

#### 3.1.2 Oferta
- Trzy kategorie produktów wyświetlane na jednej stronie:
  - Torty okolicznościowe/na zamówienie: ceny orientacyjne ("od X zł"), galeria, opis
  - Stałe wypieki (ciastka, alfajores, ciasta): ceny konkretne (za sztukę, kilogram lub porcję)
  - Inne ciasta na zamówienie (w tym bezglutenowe/wegańskie): ceny orientacyjne
- Karty produktów z miniaturą, nazwą, krótkim opisem i ceną
- Badge "Możliwość wysyłki" przy produktach dostępnych do wysyłki paczką (ciastka, alfajores)
- Badge "Odbiór osobisty" przy produktach wymagających odbioru (torty)
- Informacja o możliwości realizacji zamówień specjalnych (dietetyczne, bezglutenowe, wegańskie)
- CTA kierujący do formularza zamówienia

#### 3.1.3 O nas
- Historia piekarni i jej wartości
- Zdjęcie właścicielki/zespołu
- Linki do profili social media (Instagram, Facebook)
- Opcjonalnie: grid z postami z Instagrama (zależny od Instagram Business API, decyzja odłożona)

#### 3.1.4 Kontakt
- Dane kontaktowe (email, telefon)
- Linki do social media (Instagram, Facebook)
- Informacja o lokalizacji (Szczecin)

#### 3.1.5 Regulamin zamówień
- Informacja, że formularz stanowi zapytanie ofertowe, nie ofertę handlową
- Zasady modyfikacji zamówienia (do 48h przed planowanym odbiorem)
- Polityka anulacji
- Informacja o potwierdzeniu telefonicznym/mailowym każdego zamówienia
- Informacja o czasie odpowiedzi (do 24h)
- Link do regulaminu widoczny przy formularzu zamówienia

#### 3.1.6 Polityka prywatności
- Wygenerowana polityka prywatności (generator)
- Informacja o przetwarzaniu danych osobowych (RODO)
- Informacja o cookies (GA4, Microsoft Clarity)

#### 3.1.7 Elementy wspólne (layout)
- Nawigacja główna: Strona główna, Oferta, O nas, Zamówienia, Kontakt
- Footer na każdej stronie: linki social media (Instagram, Facebook), dane kontaktowe, link do regulaminu, link do polityki prywatności
- Cookie banner (zgoda na GA4 i Microsoft Clarity)

### 3.2 Formularz zamówienia (MVP - prosty)

Prosty, strukturalny formularz dostępny z osobnej strony "Zamówienia":

- Wybór kategorii produktu:
  - Radio buttons: Tort okolicznościowy / Ciasto / Ciastka / Alfajores / Inne
  - Wymagane pole

- Szczegóły zamówienia:
  - Textarea (500-1000 znaków)
  - Placeholder: "Opisz czego potrzebujesz: smak, rozmiar, kolory, dekoracje, liczba porcji, specjalne wymagania..."
  - Licznik znaków
  - Wymagane pole

- Dane kontaktowe:
  - Imię (pole tekstowe, wymagane)
  - Email (pole tekstowe, wymagane, walidacja formatu)
  - Telefon (pole tekstowe, wymagane, walidacja formatu polskiego numeru, auto-formatowanie)

- Data odbioru:
  - Calendar picker
  - Blokada dat przeszłych
  - Blokada dat bliższych niż 48h od dzisiaj (today + 2 dni minimum)
  - Maksymalny horyzont: do ustalenia z właścicielką
  - Bez wyboru godziny (uzgadniana po kontakcie)
  - Wymagane pole

- Upload zdjęcia inspiracji:
  - 1 zdjęcie (opcjonalne)
  - Limit 5 MB
  - Akceptowane formaty: JPG, PNG, WEBP
  - Podgląd miniatury po wybraniu pliku
  - Opcjonalne pole

- Uwagi dodatkowe:
  - Textarea (maksymalnie 500 znaków)
  - Licznik znaków
  - Opcjonalne pole
  - Informacja o możliwości wysyłki dla wybranych produktów

- Zgoda RODO:
  - Checkbox (wymagany)
  - Tekst z linkiem do polityki prywatności

- Link do regulaminu zamówień

- Przycisk "Wyślij zapytanie"

Walidacja formularza:
- Frontend: walidacja wszystkich pól przed wysłaniem (wymagane pola, formaty email/telefon, data w przyszłości min. +48h, długość textarea)
- Backend: duplikacja walidacji po stronie serwera
- Komunikaty błędów w języku polskim, wyświetlane przy odpowiednich polach

### 3.3 Backend i przetwarzanie zamówień

#### 3.3.1 Zapis zamówienia
- Astro API endpoint przyjmujący dane z formularza
- Walidacja danych po stronie serwera (duplikacja walidacji frontend)
- Sanityzacja inputów (ochrona przed XSS i SQL injection)
- Zapis zamówienia do tabeli orders w Supabase (PostgreSQL)
- Upload zdjęcia inspiracji do Supabase Storage (jeśli dodane)
- Kolumna statusu zamówienia: nowe/potwierdzone/zrealizowane (zmiana ręczna w Supabase Dashboard)
- RLS (Row Level Security) policies w Supabase

#### 3.3.2 Email do klienta
- HTML template (Resend + React Email)
- Branding: logo (placeholder), kolory brandowe (placeholder), footer z danymi kontaktowymi
- Treść:
  - Podziękowanie za wybór oferty
  - Informacja o czasie odpowiedzi (do 24h)
  - Podsumowanie zamówienia: kategoria produktu, szczegóły zamówienia, termin odbioru, uwagi dodatkowe
  - Podpis: nazwa cukierni
- Wysyłka w ciągu 2 minut od złożenia zapytania

#### 3.3.3 Email do właścicielki
- Pełne szczegóły zamówienia: kategoria produktu, szczegóły zamówienia (treść textarea), dane kontaktowe klienta, data odbioru, uwagi, link do zdjęcia inspiracji
- Wszystkie dane potrzebne do kontaktu z klientem

#### 3.3.4 Rate limiting i bezpieczeństwo

**Must-have w MVP:**
- **Server-side validation:** Zod schema validation dla wszystkich pól formularza
- **Rate limiting:** Maksymalnie 5 zapytań z jednego IP/godzinę (in-memory dla MVP)
- **Upload security:** Walidacja typu MIME i rozmiaru plików (max 5MB, tylko JPG/PNG/WEBP)
- **Supabase RLS:** Row Level Security policies (anon może tylko INSERT, nie SELECT/UPDATE/DELETE)
- **Environment variables:** Wszystkie API keys (Supabase, Resend) w .env (nie w kodzie)
- **HTTPS enforcement:** Automatyczne przez Vercel

**Nice-to-have (post-MVP):**
- **CAPTCHA:** Cloudflare Turnstile jeśli pojawi się spam
- **Content Security Policy:** Headers przeciw XSS
- **Input sanitization:** DOMPurify dla rich HTML emaili
- **Antivirus scanning:** Cloudflare Images lub ClamAV dla uploadów

### 3.4 Obsługa błędów (MVP - podstawowa)

- Walidacja formularza: komunikaty błędów w języku polskim, wyświetlane inline przy polach
- Duplicate submission prevention: dezaktywacja przycisku po kliknięciu + stan ładowania (spinner/tekst)
- Backend error handling: retry 3x z exponential backoff przy timeout Supabase
- User-friendly error messages: czytelne komunikaty zamiast kodów błędów
- Loading states: wizualne wskaźniki ładowania podczas przetwarzania formularza i uploadu zdjęcia
- Graceful degradation: informacja dla użytkownika w przypadku niedostępności usług zewnętrznych

### 3.5 SEO

- Meta tagi (title, description) na każdej stronie
- Open Graph tags (og:title, og:description, og:image) dla udostępniania w social media
- Schema.org: LocalBusiness (dane cukierni), Product (produkty w ofercie)
- sitemap.xml generowany automatycznie
- robots.txt
- Semantyczny HTML (nagłówki, alt w obrazkach)
- 5-10 fraz kluczowych do ustalenia z właścicielką (metoda warsztatowa)
- Google Business Profile jako osobne zadanie poza scope MVP

### 3.6 Analityka

- Google Analytics 4: pageviews, conversion rate, źródła ruchu
- Microsoft Clarity: heatmapy, session recordings
- Custom events:
  - formularz_rozpoczety: klient otworzył stronę zamówień
  - formularz_wyslany: klient wysłał zapytanie
  - klik_CTA: klient kliknął główne call-to-action
- Cookie banner z możliwością wyrażenia/odmówienia zgody

### 3.7 Wydajność

- Czas ładowania strony poniżej 3 sekund
- Lighthouse score powyżej 80 (Performance, Accessibility, Best Practices, SEO)
- Optymalizacja obrazów (lazy loading, odpowiednie formaty i rozmiary)
- Minimalizacja JavaScript (Astro islands architecture)
- Zero błędów w konsoli przeglądarki

### 3.8 Internacjonalizacja

- MVP wyłącznie w języku polskim
- Struktura przygotowana pod i18n: wszystkie teksty UI w plikach JSON z tłumaczeniami
- Bez implementacji przełączania języków w MVP

---

## FAZA 2: Rozszerzenie funkcjonalności (Koszyk + Kreator)

### 3.9 System koszyka (FAZA 2)

- Globalny state zarządzany przez Zustand lub Context API
- Persystencja koszyka w localStorage (przetrwanie odświeżenia strony)
- Dodawanie produktów z poziomu strony Oferty:
  - Torty: kliknięcie "Wykreuj" otwiera modal z kreatorem (5 kroków)
  - Stałe wypieki: kliknięcie "Dodaj" otwiera modal z selektorem ilości
  - Inne ciasta: kliknięcie "Dodaj" otwiera modal z polem opisu i ilością
- Mini-widget koszyka w nawigacji (ikona + liczba produktów)
- Pełny widok koszyka (osobna strona lub rozwinięty panel):
  - Lista dodanych produktów z podsumowaniem konfiguracji
  - Możliwość zmiany ilości (stałe wypieki)
  - Możliwość usunięcia produktu
  - Możliwość edycji konfiguracji tortu (powrót do kreatora)
  - Orientacyjna suma zamówienia
  - CTA "Przejdź do formularza"
- Możliwość dodania wielu tortów (np. 2 różne torty na tę samą okazję)
- Możliwość kompozycji boxów (np. mix ciastek i alfajores)

### 3.10 Kreator tortów 5-krokowy (FAZA 2)

Pięciokrokowy kreator wyświetlany w modalu, uruchamiany ze strony Oferty:

- Krok 1 - Rozmiar tortu:
  - Typ: klasyczny (2 przełożenia) lub wysoki (4 przełożenia)
  - 4 rozmiary dla każdego typu (łącznie 8 opcji)
  - Cena orientacyjna wyświetlana przy każdym rozmiarze ("od X zł")
  - Radio buttons lub karty z wizualizacją rozmiaru

- Krok 2 - Biszkopt:
  - 3 opcje: waniliowy, kakaowy, cytrynowy
  - Radio buttons z opisem

- Krok 3 - Kremy i musy:
  - 4 kategorie kremów/musów
  - ~17 opcji do wyboru
  - Szczegóły logiki wyboru (jeden krem na cały tort vs osobny per warstwa) do ustalenia z właścicielką

- Krok 4 - Opcjonalne dodatki:
  - ~17 opcji (żelki, owoce, posypki itp.)
  - Checkboxy (wielokrotny wybór)
  - Opcjonalny krok - można pominąć

- Krok 5 - Tynk:
  - 3 opcje wykończenia zewnętrznego
  - Radio buttons z opisem/zdjęciem

Elementy UI kreatora:
- Progress bar (Krok X/5)
- Nawigacja Wstecz/Dalej
- Live preview podsumowania po prawej stronie (desktop) lub na dole (mobile)
- Przycisk "Dodaj do koszyka" na ostatnim kroku
- Placeholdery na ikony składników (docelowo ikony z kolorami i fakturą)

### 3.11 Formularz finalizacji z koszyka (FAZA 2)

Rozszerzony formularz wyświetlany po kliknięciu "Przejdź do formularza" z koszyka:

- Podsumowanie koszyka (read-only, z linkiem do edycji)
- Dane kontaktowe (jak w MVP)
- Data odbioru (jak w MVP)
- Opcja wysyłki:
  - Checkbox "Chcę otrzymać zamówienie paczką" (widoczny tylko gdy koszyk zawiera produkty z opcją wysyłki)
  - Informacja: "Koszty i szczegóły wysyłki uzgadniamy po kontakcie. Wysyłka tylko na terenie Polski."
  - Disclaimer o braku odpowiedzialności za ewentualne uszkodzenia w transporcie
- Upload zdjęć inspiracji:
  - Maksymalnie 3 zdjęcia
  - Limit 5 MB na zdjęcie
  - Akceptowane formaty: JPG, PNG, WEBP
  - Kompresja po stronie frontendu (browser-image-compression) przed uploadem
  - Podgląd miniatur przed wysłaniem
- Uwagi dodatkowe (rozszerzone do 1000 znaków)
- Zgoda RODO
- Link do regulaminu
- Przycisk "Wyślij zapytanie"

### 3.12 Zaawansowany error handling (FAZA 2)

- Upload fail: komunikat "Nie udało się dodać zdjęcia, spróbuj ponownie" + przycisk Retry
- Porzucony formularz: automatyczny zapis draftu w localStorage (wygaśnięcie po 30 dniach), komunikat przy powrocie "Masz niewypełnione zamówienie, chcesz kontynuować?"
- Persystencja koszyka między sesjami

### 3.13 Modale produktów z lightbox (FAZA 2)

- Kliknięcie karty produktu na stronie Oferty otwiera modal ze szczegółami
- Modal zawiera powiększone zdjęcia, pełny opis i opcje
- Lightbox do powiększania zdjęć z nawigacją (poprzednie/następne)
- Modal zawiera przycisk CTA odpowiedni dla kategorii ("Wykreuj" dla tortów, "Dodaj" dla stałych wypieków)
- Zamknięcie modala przywraca widok strony Oferty bez utraty pozycji przewijania
- Responsywny design (pełny ekran na mobile)

## 4. Granice produktu

### Wchodzi w zakres MVP (Faza 1)

- 5 stron publicznych (Strona główna, Oferta, O nas, Zamówienia, Kontakt, Regulamin) + Polityka prywatności
- Prosty formularz zamówienia z wyborem kategorii i textarea do opisu szczegółów
- Upload 1 zdjęcia inspiracji (opcjonalne, max 5 MB)
- Zapis zamówień do Supabase z RLS policies
- Email HTML do klienta (potwierdzenie + podsumowanie)
- Email ze szczegółami do właścicielki
- Przeglądanie zamówień przez Supabase Dashboard
- Ręczna zmiana statusu zamówienia w Supabase Dashboard
- Podstawowe SEO (meta tagi, Open Graph, schema.org, sitemap, robots.txt)
- Google Analytics 4 + Microsoft Clarity
- Cookie banner (RODO)
- Responsywny design (mobile + desktop) z shadcn/ui components
- Security: server-side validation, rate limiting (5 zapytań/IP/godzinę), upload validation
- Podstawowy error handling (walidacja, retry, duplicate prevention, loading states)
- Hardcoded zdjęcia i treści z placeholderami (Unsplash API)
- Struktura i18n-ready (pliki JSON) bez implementacji przełączania języków

### Planowane w Fazie 2

- **SMS notifications:**
  - SMSAPI.pl integration (~0.10 zł/SMS)
  - Krótki format: "Nowe zamówienie: [Imię], [Kategoria], [Data odbioru]. Sprawdź email."
  - Wysyłka równocześnie z emailem do właścicielki

- **Wieloproduktowy koszyk:**
  - Persystencja w localStorage
  - Mini-widget w nawigacji
  - Dodawanie wielu produktów
  - Edycja ilości i usuwanie produktów
  - Orientacyjna suma zamówienia

- **5-krokowy kreator tortów:**
  - Interaktywny wizard z progress barem
  - Wybór rozmiaru, biszkopty, kremów, dodatków i tynku
  - Live preview konfiguracji
  - Nawigacja wstecz/dalej z zachowaniem stanu
  - ~40 opcji do wyboru

- **Modale produktów:**
  - Szczegóły produktu w modalu
  - Lightbox dla galerii zdjęć
  - CTA "Wykreuj" / "Dodaj"

- **Zaawansowany error handling:**
  - Porzucony formularz (localStorage draft recovery)
  - Upload retry dla wielu zdjęć
  - Rozszerzone komunikaty błędów

- **Upload wielu zdjęć:**
  - Do 3 zdjęć inspiracji
  - Kompresja frontend
  - Podgląd miniatur

- **Rozszerzony formularz:**
  - Opcja wysyłki paczką z warunkowaniem
  - Rozszerzone uwagi (1000 znaków)
  - Integracja z koszykiem

- **Rozszerzona analityka:**
  - Custom events: kreator_rozpoczety, kreator_ukonczony, produkt_dodany_do_koszyka
  - Śledzenie lejka konwersji koszyka

### Planowane w Fazie 3: Panel Admin

- Custom UI dla właścicielki (zamiast Supabase Dashboard)
- Zarządzanie statusami zamówień z interfejsu
- Automatyczne emaile do klientów po zmianach statusu
- Podstawowe statystyki (liczba zamówień, popularne produkty)
- Produkty w bazie danych (zamiast hardcoded)
- Kalendarz z blokadą zajętych terminów

### Planowane w Fazie 4: Konta klientów

- Rejestracja/logowanie
- Historia zamówień
- Tracking statusu zamówienia
- Newsletter
- Ulepszona galeria z filtrami

### Nie wchodzi w zakres całego produktu (poza roadmap)

- System płatności online
- Integracja z systemem księgowym
- Automatyczne faktury
- Program lojalnościowy
- Kupony / kody rabatowe (decyzja odłożona)
- Blog / aktualności
- System ocen i recenzji klientów (decyzja odłożona)
- PWA / tryb offline
- Aktualizacje w czasie rzeczywistym (real-time)
- CDN dla obrazów (może być dodane opcjonalnie)
- Instagram grid z API (decyzja odłożona)
- Google Business Profile (osobne zadanie marketingowe)
- Storybook / ADR / instrukcja użytkownika
- Kalendarz dostępności / rezerwacja terminów online
- Wersje językowe (angielski i inne)

## 5. Historyjki użytkowników

### Przeglądanie oferty (MVP)

**[MVP] US-001**
Tytuł: Przeglądanie strony głównej
Opis: Jako klient chcę zobaczyć stronę główną piekarni z hero section, galerią realizacji i opisem, żeby szybko zorientować się czym zajmuje się piekarnia i czy jej oferta mnie interesuje.
Kryteria akceptacji:
- Strona główna wyświetla hero section ze zdjęciem i krótkim opisem piekarni
- Galeria realizacji prezentuje minimum 3 zdjęcia wypieków
- Widoczny jest przycisk CTA kierujący do strony Zamówień lub Oferty
- Strona jest responsywna i poprawnie wyświetla się na urządzeniach mobilnych (szerokość 320px+) i desktopowych
- Czas ładowania strony nie przekracza 3 sekund

**[MVP] US-002**
Tytuł: Przeglądanie oferty produktów
Opis: Jako klient chcę przeglądać pełną ofertę piekarni podzieloną na kategorie ze zdjęciami i cenami, żeby wiedzieć czego mogę oczekiwać i ile orientacyjnie kosztują produkty.
Kryteria akceptacji:
- Strona Oferty wyświetla produkty w trzech kategoriach: Torty okolicznościowe/na zamówienie, Stałe wypieki, Inne ciasta na zamówienie
- Każdy produkt jest prezentowany jako karta z miniaturą zdjęcia, nazwą, krótkim opisem i ceną
- Torty i inne ciasta na zamówienie mają ceny orientacyjne ("od X zł")
- Stałe wypieki mają ceny konkretne (za sztukę, kilogram lub porcję)
- Produkty z opcją wysyłki paczką mają widoczny badge "Możliwość wysyłki"
- Produkty wymagające odbioru osobistego mają badge "Odbiór osobisty"
- Strona jest dostępna z poziomu nawigacji głównej
- Widoczny jest CTA kierujący do formularza zamówienia

**[MVP] US-004**
Tytuł: Przeglądanie strony O nas
Opis: Jako klient chcę przeczytać o historii piekarni i jej wartościach, żeby poznać ludzi stojących za marką i zbudować zaufanie przed złożeniem zamówienia.
Kryteria akceptacji:
- Strona O nas zawiera tekst o historii piekarni i jej wartościach
- Wyświetlone jest zdjęcie właścicielki/zespołu
- Widoczne są linki do profili social media (Instagram, Facebook)
- Strona jest dostępna z poziomu nawigacji głównej

**[MVP] US-005**
Tytuł: Przeglądanie danych kontaktowych
Opis: Jako klient chcę znaleźć dane kontaktowe piekarni, żeby móc skontaktować się bezpośrednio jeśli mam pytania wykraczające poza formularz.
Kryteria akceptacji:
- Strona Kontakt wyświetla adres email piekarni
- Strona Kontakt wyświetla numer telefonu piekarni
- Widoczne są linki do profili social media (Instagram, Facebook)
- Wyświetlona jest informacja o lokalizacji (Szczecin)
- Strona jest dostępna z poziomu nawigacji głównej

**[MVP] US-006**
Tytuł: Przeglądanie regulaminu zamówień
Opis: Jako klient chcę przeczytać regulamin zamówień przed złożeniem zapytania, żeby znać zasady modyfikacji, anulacji i potwierdzenia zamówienia.
Kryteria akceptacji:
- Strona regulaminu zawiera informację, że formularz stanowi zapytanie ofertowe
- Opisane są zasady modyfikacji zamówienia (do 48h przed odbiorem)
- Opisana jest polityka anulacji
- Zawarta jest informacja o potwierdzeniu telefonicznym/mailowym
- Zawarta jest informacja o czasie odpowiedzi (do 24h)
- Regulamin jest dostępny z poziomu linku przy formularzu zamówienia oraz z footera

### Składanie zamówienia (MVP)

**[MVP] US-012**
Tytuł: Wypełnianie formularza zamówienia
Opis: Jako klient chcę wypełnić prosty formularz z wyborem kategorii i opisem zamówienia, żeby szybko wysłać zapytanie do piekarni bez zbędnej komplikacji.
Kryteria akceptacji:
- Formularz zawiera wybór kategorii produktu (radio buttons: Tort/Ciasto/Ciastka/Alfajores/Inne)
- Formularz zawiera textarea "Szczegóły zamówienia" (500-1000 znaków) z licznikiem
- Formularz zawiera pola danych kontaktowych: imię, email, telefon (wszystkie wymagane)
- Pole email waliduje poprawność formatu adresu email
- Pole telefon waliduje format polskiego numeru telefonu i auto-formatuje wprowadzony numer
- Wszystkie pola wymagane są oznaczone
- Komunikaty błędów walidacji wyświetlane są w języku polskim przy odpowiednich polach
- Formularz nie pozwala na wysłanie przy niespełnionej walidacji

**[MVP] US-013**
Tytuł: Wybór daty odbioru
Opis: Jako klient chcę wybrać datę odbioru zamówienia z kalendarza, żeby określić kiedy potrzebuję produkty.
Kryteria akceptacji:
- Formularz zawiera calendar picker do wyboru daty
- Daty przeszłe są zablokowane (niedostępne do wyboru)
- Daty bliższe niż 48h od dnia składania zapytania są zablokowane
- Klient nie wybiera godziny (uzgadniana po kontakcie z właścicielką)
- Wybranie zablokowanej daty jest technicznie niemożliwe (daty są wyszarzone/niedostępne)
- Pole daty jest wymagane

**[MVP] US-014-SIMPLIFIED**
Tytuł: Upload zdjęcia inspiracji
Opis: Jako klient chcę załączyć zdjęcie inspiracji do zamówienia, żeby pokazać piekarni jaki efekt wizualny chciałbym uzyskać.
Kryteria akceptacji:
- Formularz umożliwia upload 1 zdjęcia
- Akceptowane formaty: JPG, PNG, WEBP
- Maksymalny rozmiar: 5 MB
- Po wybraniu pliku wyświetlany jest podgląd miniatury
- Klient może usunąć dodane zdjęcie przed wysłaniem formularza
- Upload zdjęcia jest opcjonalny
- Próba uploadu pliku w nieobsługiwanym formacie wyświetla komunikat o akceptowanych formatach
- Próba uploadu pliku przekraczającego 5 MB wyświetla komunikat o limicie rozmiaru

**[MVP] US-015-SIMPLIFIED**
Tytuł: Dodawanie uwag do zamówienia
Opis: Jako klient chcę dodać uwagi tekstowe do zamówienia, żeby przekazać dodatkowe informacje (np. preferencje dietetyczne, szczególne życzenia, informacje o wysyłce).
Kryteria akceptacji:
- Formularz zawiera pole textarea "Uwagi dodatkowe"
- Pole wyświetla licznik znaków (X/500)
- Maksymalna długość tekstu: 500 znaków
- Pole jest opcjonalne
- Tekst po przekroczeniu limitu nie jest akceptowany
- Placeholder sugeruje możliwość opisania potrzeby wysyłki paczką

**[MVP] US-016**
Tytuł: Wyrażenie zgody RODO
Opis: Jako klient chcę wyrazić zgodę na przetwarzanie moich danych osobowych, żeby moje zapytanie mogło zostać przetworzone zgodnie z przepisami o ochronie danych.
Kryteria akceptacji:
- Formularz zawiera checkbox ze zgodą RODO
- Tekst zgody zawiera link do polityki prywatności
- Checkbox jest wymagany - formularz nie może być wysłany bez zaznaczenia
- Brak zaznaczenia checkboxa wyświetla komunikat o konieczności wyrażenia zgody

**[MVP] US-017**
Tytuł: Wysłanie zapytania ofertowego
Opis: Jako klient chcę wysłać kompletne zapytanie ofertowe, żeby piekarnia otrzymała moje zamówienie i skontaktowała się ze mną.
Kryteria akceptacji:
- Przycisk "Wyślij zapytanie" jest aktywny tylko gdy wszystkie wymagane pola są poprawnie wypełnione
- Po kliknięciu przycisk zostaje dezaktywowany i wyświetla stan ładowania (spinner lub tekst "Wysyłanie...")
- Dane formularza są walidowane po stronie serwera przed zapisem
- Zamówienie jest zapisywane w bazie Supabase
- Zdjęcie inspiracji jest uploadowane do Supabase Storage (jeśli dodane)
- Email potwierdzający jest wysyłany do klienta
- Email ze szczegółami jest wysyłany do właścicielki
- Po pomyślnym wysłaniu klient widzi komunikat potwierdzający przyjęcie zapytania
- W przypadku błędu serwera wyświetlany jest komunikat z prośbą o ponowienie próby
- Ponowne kliknięcie przycisku w trakcie przetwarzania nie powoduje duplikatu

**[MVP] US-018**
Tytuł: Otrzymanie potwierdzenia email
Opis: Jako klient chcę otrzymać email potwierdzający złożenie zapytania, żeby mieć pewność, że moja wiadomość dotarła do piekarni i znać kolejne kroki.
Kryteria akceptacji:
- Email jest wysyłany na adres podany w formularzu w ciągu 2 minut od złożenia zapytania
- Email zawiera podziękowanie za wybór oferty
- Email zawiera informację o czasie odpowiedzi (do 24h)
- Email zawiera podsumowanie zamówienia (kategoria, szczegóły, termin odbioru, uwagi)
- Email jest w formacie HTML z brandingiem piekarni (logo, kolory, footer z danymi kontaktowymi)
- Email zawiera podpis z nazwą cukierni

### Powiadomienia właścicielki (MVP)

**[MVP] US-020**
Tytuł: Otrzymanie emaila o nowym zamówieniu
Opis: Jako właścicielka chcę otrzymać email z pełnymi szczegółami nowego zamówienia, żeby mieć wszystkie dane potrzebne do kontaktu z klientem i realizacji zamówienia.
Kryteria akceptacji:
- Email jest wysyłany na adres właścicielki w ciągu 2 minut od złożenia zapytania
- Email zawiera kategorię produktu i pełne szczegóły z textarea
- Email zawiera dane kontaktowe klienta (imię, email, telefon)
- Email zawiera wybraną datę odbioru
- Email zawiera uwagi dodatkowe (jeśli podane)
- Email zawiera link do zdjęcia inspiracji (jeśli dodane)


**[MVP] US-022**
Tytuł: Przeglądanie zamówień w Supabase Dashboard
Opis: Jako właścicielka chcę przeglądać wszystkie zamówienia w Supabase Dashboard, żeby mieć historię i przegląd zamówień.
Kryteria akceptacji:
- Zamówienia są widoczne w tabeli orders w Supabase Dashboard
- Zamówienia są posortowane chronologicznie (najnowsze na górze)
- Każde zamówienie zawiera: dane klienta, kategorię, szczegóły, datę odbioru, status, datę złożenia
- Kolumna statusu umożliwia ręczną zmianę wartości (nowe/potwierdzone/zrealizowane)

### SEO i dostępność (MVP)

**[MVP] US-024**
Tytuł: Udostępnianie strony w social media
Opis: Jako klient chcę udostępnić stronę piekarni w social media ze zdjęciem i opisem, żeby polecić piekarnię znajomym.
Kryteria akceptacji:
- Każda strona ma ustawione tagi Open Graph (og:title, og:description, og:image)
- Udostępnienie linku w Facebook/Instagram wyświetla odpowiedni podgląd z tytułem, opisem i zdjęciem
- Strona główna ma dedykowany og:image promujący piekarnię

**[MVP] US-025**
Tytuł: Znajdowanie piekarni w wynikach wyszukiwania
Opis: Jako klient chcę znaleźć Tilulu Bakery w wynikach wyszukiwania Google po wpisaniu fraz związanych z cukiernią w Szczecinie, żeby dowiedzieć się o ofercie.
Kryteria akceptacji:
- Każda strona ma ustawione meta tagi (title, description) z odpowiednimi frazami kluczowymi
- Zaimplementowany jest schema.org LocalBusiness z danymi piekarni
- Zaimplementowany jest schema.org Product dla produktów w ofercie
- Wygenerowany jest plik sitemap.xml z listą wszystkich stron
- Wygenerowany jest plik robots.txt z odpowiednimi dyrektywami
- Obrazy mają atrybuty alt z opisami

### Zgody i prywatność (MVP)

**[MVP] US-026**
Tytuł: Zarządzanie zgodą na cookies
Opis: Jako klient chcę zdecydować czy wyrażam zgodę na pliki cookie analityczne, żeby mieć kontrolę nad swoimi danymi.
Kryteria akceptacji:
- Przy pierwszej wizycie wyświetlany jest cookie banner z informacją o stosowanych cookies
- Klient może zaakceptować lub odrzucić cookies analityczne
- GA4 i Microsoft Clarity uruchamiają się dopiero po wyrażeniu zgody
- Wybór klienta jest zapamiętywany i banner nie pojawia się ponownie
- Klient może zmienić decyzję (link w polityce prywatności lub footerze)

### Nawigacja i layout (MVP)

**[MVP] US-027**
Tytuł: Nawigacja po stronie
Opis: Jako klient chcę łatwo nawigować między stronami piekarni, żeby szybko znaleźć potrzebne informacje.
Kryteria akceptacji:
- Nawigacja główna zawiera linki: Strona główna, Oferta, O nas, Zamówienia, Kontakt
- Nawigacja jest widoczna na każdej stronie
- Na urządzeniach mobilnych nawigacja jest dostępna jako menu hamburgerowe
- Aktualnie otwarta strona jest wizualnie wyróżniona w nawigacji

**[MVP] US-028**
Tytuł: Przeglądanie footera
Opis: Jako klient chcę mieć dostęp do ważnych linków i danych kontaktowych w footerze, żeby szybko znaleźć je z dowolnej strony.
Kryteria akceptacji:
- Footer jest wyświetlany na każdej stronie
- Footer zawiera linki do social media (Instagram, Facebook)
- Footer zawiera dane kontaktowe piekarni
- Footer zawiera link do regulaminu zamówień
- Footer zawiera link do polityki prywatności

### Edge cases i obsługa błędów (MVP)

**[MVP] US-029**
Tytuł: Obsługa błędu wysyłki formularza
Opis: Jako klient chcę zobaczyć czytelny komunikat gdy coś pójdzie nie tak podczas wysyłania zamówienia, żeby wiedzieć co robić dalej.
Kryteria akceptacji:
- W przypadku błędu serwera wyświetlany jest komunikat w języku polskim z informacją o problemie
- Komunikat zawiera sugestię ponowienia próby
- Dane formularza nie są tracone po błędzie (pozostają wypełnione)
- Klient może ponowić wysyłkę bez ponownego wypełniania formularza
- W przypadku powtarzającego się błędu wyświetlana jest informacja o alternatywnym kontakcie (telefon, email)

**[MVP] US-030**
Tytuł: Obsługa limitu zapytań
Opis: Jako klient chcę zobaczyć informację gdy przekroczę limit zapytań dziennych, żeby zrozumieć dlaczego nie mogę wysłać kolejnego formularza.
Kryteria akceptacji:
- Po osiągnięciu limitu 5 zapytań z jednego IP dziennie, kolejna próba wysłania wyświetla komunikat informacyjny
- Komunikat wyjaśnia, że dzienny limit został osiągnięty
- Komunikat sugeruje kontakt telefoniczny lub mailowy
- Formularz nie jest wysyłany po przekroczeniu limitu

**[MVP] US-032**
Tytuł: Walidacja formularza przed wysłaniem
Opis: Jako klient chcę widzieć komunikaty o błędach walidacji przy odpowiednich polach, żeby szybko poprawić dane i wysłać zamówienie.
Kryteria akceptacji:
- Komunikaty błędów wyświetlają się przy konkretnych polach, nie jako ogólna lista
- Walidacja uruchamia się przy próbie wysłania formularza
- Walidacja inline uruchamia się po opuszczeniu pola (on blur) dla pól wymaganych
- Komunikat przy polu imię: "Imię jest wymagane"
- Komunikat przy polu email: "Podaj poprawny adres email"
- Komunikat przy polu telefon: "Podaj poprawny numer telefonu"
- Komunikat przy polu data: "Wybierz datę odbioru (minimum 48h od teraz)"
- Komunikat przy checkboxie RODO: "Zgoda na przetwarzanie danych jest wymagana"
- Po poprawieniu błędu komunikat znika

**[MVP] US-034**
Tytuł: Responsywność na urządzeniach mobilnych
Opis: Jako klient korzystający ze smartfona chcę wygodnie przeglądać ofertę i składać zamówienie, żeby korzystać ze strony w każdych warunkach.
Kryteria akceptacji:
- Wszystkie strony poprawnie wyświetlają się na ekranach od 320px szerokości
- Nawigacja zamienia się w menu hamburgerowe na ekranach mobilnych
- Calendar picker jest użyteczny na ekranach dotykowych
- Formularze mają odpowiednie typy inputów (type="email", type="tel") dla mobilnych klawiatur

**[MVP] US-036**
Tytuł: Informacja o specjalnych zamówieniach dietetycznych
Opis: Jako klient z ograniczeniami dietetycznymi chcę wiedzieć, że piekarnia realizuje zamówienia bezglutenowe i wegańskie, żeby złożyć odpowiednie zapytanie.
Kryteria akceptacji:
- Na stronie Oferty w kategorii "Inne ciasta na zamówienie" widoczna jest informacja o możliwości realizacji ciast bezglutenowych i wegańskich
- Klient może opisać swoje wymagania dietetyczne w polach textarea formularza (Szczegóły zamówienia lub Uwagi dodatkowe)
- Informacja o specjalnych zamówieniach jest widoczna bez konieczności przechodzenia do formularza

**[MVP] US-037**
Tytuł: Obsługa cookies bez zgody
Opis: Jako klient, który nie wyraził zgody na cookies analityczne, chcę normalnie korzystać ze strony, żeby przeglądanie oferty i składanie zamówień nie było ograniczone.
Kryteria akceptacji:
- Odmowa cookies analitycznych nie wpływa na żadną funkcjonalność strony
- GA4 i Microsoft Clarity nie ładują się przy braku zgody
- Formularz zamówienia działa bez cookies analitycznych

**[MVP] US-038**
Tytuł: Bezpieczeństwo danych formularza
Opis: Jako klient chcę mieć pewność, że moje dane osobowe są bezpiecznie przetwarzane, żeby czuć się komfortowo podając email i telefon.
Kryteria akceptacji:
- Dane formularza są przesyłane przez HTTPS
- Inputy są sanityzowane po stronie serwera (ochrona przed XSS i SQL injection)
- Baza danych Supabase ma skonfigurowane RLS policies ograniczające dostęp do danych
- Zdjęcia w Supabase Storage nie są publicznie dostępne bez autoryzacji
- Dane osobowe nie są logowane w plain text w logach aplikacji

**[MVP] US-039**
Tytuł: Dostęp właścicielki do Supabase Dashboard
Opis: Jako właścicielka chcę zalogować się do Supabase Dashboard, żeby przeglądać zamówienia i zarządzać ich statusem.
Kryteria akceptacji:
- Właścicielka ma konto w Supabase z dostępem do projektu
- Po zalogowaniu widzi tabelę orders z zamówieniami
- Może filtrować i sortować zamówienia
- Może ręcznie zmieniać status zamówienia (nowe / potwierdzone / zrealizowane)
- Dostęp wymaga logowania (dane nie są publicznie dostępne)

**[MVP] US-040**
Tytuł: Wyświetlanie stanu ładowania formularza
Opis: Jako klient chcę widzieć wizualne wskaźniki ładowania podczas wysyłania formularza i uploadu zdjęcia, żeby wiedzieć że proces trwa i nie klikać ponownie.
Kryteria akceptacji:
- Po kliknięciu "Wyślij zapytanie" przycisk wyświetla spinner lub tekst "Wysyłanie..."
- Przycisk jest dezaktywowany podczas przetwarzania
- Podczas uploadu zdjęcia wyświetlany jest pasek postępu lub spinner przy miniaturze
- Po zakończeniu ładowania wyświetlany jest komunikat sukcesu lub błędu

**[MVP] US-041**
Tytuł: Retry przy błędzie backendu
Opis: Jako system chcę automatycznie ponawiać próbę zapisu zamówienia przy tymczasowej niedostępności Supabase, żeby nie tracić zamówień z powodu chwilowych problemów infrastrukturalnych.
Kryteria akceptacji:
- Przy timeout lub błędzie połączenia z Supabase system automatycznie ponawia próbę
- Retry odbywa się maksymalnie 3 razy z exponential backoff
- Jeśli wszystkie 3 próby zawiodą, klient widzi komunikat z informacją o tymczasowym problemie
- Komunikat zawiera dane kontaktowe piekarni jako alternatywny kanał
- Dane formularza nie są tracone (klient może spróbować ponownie)

---

## FAZA 2: User Stories dla koszyka i kreatora

### SMS Notifications (FAZA 2)

**[FAZA 2] US-021**
Tytuł: Otrzymanie SMS o nowym zamówieniu
Opis: Jako właścicielka chcę otrzymać SMS o nowym zamówieniu, żeby szybko zareagować nawet gdy nie sprawdzam emaila.
Kryteria akceptacji:
- SMS jest wysyłany na numer właścicielki równocześnie z emailem
- SMS ma format: "Nowe zamówienie: [Imię], [Kategoria], [Data odbioru]. Sprawdź email."
- SMS jest wysyłany przez SMSAPI.pl
- Koszt ~0.10 zł/SMS

### Koszyk (FAZA 2)

**[FAZA 2] US-003**
Tytuł: Wyświetlanie szczegółów produktu w modalu
Opis: Jako klient chcę kliknąć kartę produktu i zobaczyć szczegóły w modalu, żeby poznać pełny opis i zdjęcia bez opuszczania strony Oferty.
Kryteria akceptacji:
- Kliknięcie karty produktu otwiera modal z powiększonymi zdjęciami i pełnym opisem
- Modal zawiera lightbox do powiększania zdjęć z nawigacją (poprzednie/następne)
- Modal zawiera przycisk CTA odpowiedni dla kategorii ("Wykreuj" dla tortów, "Dodaj" dla stałych wypieków)
- Zamknięcie modala przywraca widok strony Oferty bez utraty pozycji przewijania
- Modal jest responsywny i prawidłowo wyświetla się na ekranach mobilnych

**[FAZA 2] US-007**
Tytuł: Dodawanie stałych wypieków do koszyka
Opis: Jako klient chcę dodać ciastka, alfajores lub ciasta do koszyka z określeniem ilości, żeby skomponować zamówienie na wiele produktów w ramach jednego zapytania.
Kryteria akceptacji:
- Kliknięcie "Dodaj" przy stałym wypieku otwiera modal z selektorem ilości
- Klient może ustawić ilość za pomocą przycisków +/- lub pola numerycznego
- Wyświetlana jest orientacyjna suma dla wybranej ilości
- Po kliknięciu "Dodaj do koszyka" modal się zamyka, produkt jest w koszyku
- Mini-widget koszyka w nawigacji aktualizuje liczbę produktów i sumę
- Klient pozostaje na stronie Oferty po dodaniu produktu

**[FAZA 2] US-008**
Tytuł: Dodawanie tortu na zamówienie do koszyka (kreator 5-krokowy)
Opis: Jako klient chcę skomponować tort krok po kroku w kreatorze, żeby precyzyjnie opisać czego potrzebuję i zobaczyć cenę orientacyjną.
Kryteria akceptacji:
- Kliknięcie "Wykreuj" przy torcie otwiera modal z 5-krokowym kreatorem
- Krok 1: klient wybiera typ tortu (klasyczny/wysoki) i rozmiar (4 opcje na typ) z ceną orientacyjną
- Krok 2: klient wybiera biszkopt (waniliowy/kakaowy/cytrynowy)
- Krok 3: klient wybiera kremy i musy z 4 kategorii (~17 opcji)
- Krok 4: klient opcjonalnie wybiera dodatki (żelki, owoce, posypki)
- Krok 5: klient wybiera tynk (3 opcje)
- Widoczny jest progress bar (Krok X/5) przez cały proces
- Dostępna jest nawigacja Wstecz/Dalej
- Live preview podsumowania wyborów jest widoczny po prawej (desktop) lub na dole (mobile)
- Po ostatnim kroku klient klika "Dodaj do koszyka" i modal się zamyka
- Kreator nie traci stanu przy nawigacji wstecz (zachowanie wybranych opcji)

**[FAZA 2] US-009**
Tytuł: Przeglądanie zawartości koszyka
Opis: Jako klient chcę przejrzeć zawartość koszyka z podsumowaniem wszystkich wybranych produktów i orientacyjną sumą, żeby upewnić się, że zamówienie jest kompletne przed wysłaniem zapytania.
Kryteria akceptacji:
- Kliknięcie mini-widgetu koszyka otwiera pełny widok koszyka
- Lista produktów zawiera nazwy, konfiguracje (np. rozmiar tortu, smak biszkopty), ilości i ceny orientacyjne
- Wyświetlana jest orientacyjna suma całego zamówienia
- Widoczny jest przycisk "Przejdź do formularza"
- Pusty koszyk wyświetla odpowiedni komunikat i zachętę do przeglądania oferty

**[FAZA 2] US-010**
Tytuł: Edycja i usuwanie produktów z koszyka
Opis: Jako klient chcę edytować ilość lub konfigurację produktu w koszyku oraz usuwać produkty, żeby dostosować zamówienie do swoich potrzeb bez rozpoczynania od nowa.
Kryteria akceptacji:
- Klient może zmienić ilość stałych wypieków w widoku koszyka
- Klient może usunąć dowolny produkt z koszyka
- Klient może edytować konfigurację tortu (powrót do kreatora z zachowanym stanem)
- Po edycji/usunięciu orientacyjna suma zamówienia jest automatycznie przeliczana
- Mini-widget koszyka aktualizuje się po każdej zmianie

**[FAZA 2] US-011**
Tytuł: Persystencja koszyka między sesjami
Opis: Jako klient chcę, żeby mój koszyk zachował się po zamknięciu przeglądarki lub odświeżeniu strony, żeby nie tracić postępu kompletowania zamówienia.
Kryteria akceptacji:
- Zawartość koszyka jest zapisywana w localStorage po każdej zmianie
- Po odświeżeniu strony koszyk zawiera te same produkty co przed odświeżeniem
- Po zamknięciu i ponownym otwarciu przeglądarki koszyk jest przywracany
- Dane koszyka w localStorage nie wygasają (do momentu wysłania zamówienia lub ręcznego czyszczenia)

**[FAZA 2] US-019**
Tytuł: Zaznaczenie preferencji wysyłki paczką
Opis: Jako klient chcę zaznaczyć, że chcę otrzymać zamówienie paczką zamiast odbierać osobiście, żeby nie musieć jechać do Szczecina.
Kryteria akceptacji:
- Checkbox "Chcę otrzymać zamówienie paczką" jest widoczny w formularzu gdy koszyk zawiera produkty z opcją wysyłki (ciastka, alfajores)
- Checkbox nie jest widoczny gdy koszyk zawiera wyłącznie produkty bez opcji wysyłki (torty)
- Przy checkboxie wyświetlona jest informacja: "Koszty i szczegóły wysyłki uzgadniamy po kontakcie. Wysyłka tylko na terenie Polski."
- Wyświetlony jest disclaimer o braku odpowiedzialności za uszkodzenia w transporcie
- Zaznaczenie checkboxa jest odnotowywane w zamówieniu i widoczne w emailu do właścicielki
- Wybór wysyłki jest opcjonalny

**[FAZA 2] US-023**
Tytuł: Odzyskiwanie porzuconego formularza
Opis: Jako klient chcę wrócić do niedokończonego formularza po przypadkowym zamknięciu przeglądarki, żeby nie tracić postępu i nie wypełniać wszystkiego od nowa.
Kryteria akceptacji:
- Dane formularza (dane kontaktowe, data, uwagi) są automatycznie zapisywane w localStorage po każdej zmianie pola
- Dane draftu wygasają po 30 dniach
- Przy powrocie na stronę z zapisanym draftem wyświetlany jest komunikat "Masz niewypełnione zamówienie, chcesz kontynuować?"
- Klient może wybrać "Tak" (przywrócenie danych) lub "Nie" (czyszczenie draftu)
- Draft jest usuwany po pomyślnym wysłaniu zapytania

**[FAZA 2] US-031**
Tytuł: Obsługa pustego koszyka przy próbie finalizacji
Opis: Jako klient chcę zobaczyć odpowiedni komunikat gdy próbuję przejść do formularza z pustym koszykiem, żeby wiedzieć, że muszę najpierw dodać produkty.
Kryteria akceptacji:
- Próba przejścia do formularza finalizacji z pustym koszykiem wyświetla komunikat informacyjny
- Komunikat zachęca do przeglądania oferty i dodania produktów
- Wyświetlany jest link/przycisk kierujący do strony Oferty

**[FAZA 2] US-033**
Tytuł: Dodawanie wielu tortów do koszyka
Opis: Jako klient chcę dodać kilka różnych tortów do jednego zamówienia, żeby zamówić np. dwa torty na tę samą okazję.
Kryteria akceptacji:
- Klient może wielokrotnie użyć kreatora tortów i dodać różne konfiguracje do koszyka
- Każdy tort jest wyświetlany osobno w koszyku z własnym podsumowaniem
- Każdy tort może być edytowany lub usunięty niezależnie
- Orientacyjna suma uwzględnia wszystkie torty w koszyku

**[FAZA 2] US-035**
Tytuł: Kompozycja boxów ze stałych wypieków
Opis: Jako klient chcę skomponować box mieszany z różnych ciastek i alfajores, żeby zamówić zestaw na prezent lub spotkanie.
Kryteria akceptacji:
- Klient może dodać wiele różnych stałych wypieków do koszyka (np. 5 alfajores + 3 ciastka czekoladowe + 2 ciastka orzechowe)
- Każdy produkt wyświetlany jest osobno w koszyku z ilością i ceną
- Orientacyjna suma uwzględnia wszystkie produkty

**[FAZA 2] US-014-EXTENDED**
Tytuł: Upload wielu zdjęć inspiracji
Opis: Jako klient chcę załączyć do 3 zdjęć inspiracji do zamówienia, żeby pokazać piekarni różne aspekty efektu wizualnego który chciałbym uzyskać.
Kryteria akceptacji:
- Formularz umożliwia upload maksymalnie 3 zdjęć
- Akceptowane formaty: JPG, PNG, WEBP
- Maksymalny rozmiar jednego zdjęcia: 5 MB
- Zdjęcia są kompresowane po stronie frontendu przed uploadem (browser-image-compression)
- Po wybraniu pliku wyświetlany jest podgląd miniatury
- Klient może usunąć dodane zdjęcie przed wysłaniem formularza
- Upload zdjęć jest opcjonalny
- Przy błędzie uploadu wyświetlany jest komunikat "Nie udało się dodać zdjęcia, spróbuj ponownie" z przyciskiem Retry
- Próba uploadu pliku w nieobsługiwanym formacie wyświetla komunikat o akceptowanych formatach
- Próba uploadu pliku przekraczającego 5 MB wyświetla komunikat o limicie rozmiaru

## 6. Metryki sukcesu

### MVP (Faza 1)

#### Metryki techniczne

- Lighthouse Performance score powyżej 80
- Lighthouse Accessibility score powyżej 80
- Lighthouse Best Practices score powyżej 80
- Lighthouse SEO score powyżej 80
- Czas ładowania strony (First Contentful Paint) poniżej 3 sekund
- Zero błędów w konsoli przeglądarki na wszystkich stronach
- 100% walidacji formularza działa poprawnie (frontend + backend)
- Email do klienta wysyłany w ciągu 2 minut od złożenia zapytania
- Email do właścicielki wysyłany w ciągu 2 minut od złożenia zapytania
- Uptime strony 99.9% (hosting Vercel)

#### Metryki biznesowe

- 100% nowych zapytań przechodzi przez formularz na stronie (vs. DM / telefon)
- Email do właścicielki zawiera wszystkie dane potrzebne do kontaktu i realizacji
- Czas odpowiedzi właścicielki na zapytanie poniżej 24h (SLA komunikowane klientowi)
- Wszystkie zamówienia zarejestrowane w bazie Supabase z pełną historią

#### Metryki doświadczenia użytkownika (UX)

- Klient składa kompletne zapytanie w mniej niż 3 minuty (od otwarcia formularza do wysłania)
- Wskaźnik porzuceń formularza zamówienia poniżej 30%
- Klient otrzymuje potwierdzenie email po każdym wysłanym zapytaniu
- Zero zgłoszeń o niezrozumiałych komunikatach błędów

#### Narzędzia pomiarowe (MVP)

- Google Analytics 4: pageviews, session duration, bounce rate, conversion rate (zapytanie wysłane / wizyta na stronie), źródła ruchu
- Microsoft Clarity: heatmapy kliknięć, session recordings, rage clicks, scroll depth
- Custom events GA4:
  - formularz_rozpoczety: liczba wizyt na stronie Zamówienia
  - formularz_wyslany: liczba pomyślnie wysłanych zapytań
  - klik_CTA: liczba kliknięć głównych call-to-action
- Supabase logs: liczba zamówień dziennie/tygodniowo, błędy API, rozkład kategorii produktów
- Wskaźnik konwersji: wizyta na stronie → wypełnienie formularza → wysłanie zapytania

### Faza 2 (Koszyk + Kreator)

#### Dodatkowe metryki techniczne

- Persystencja koszyka działa w 100% przypadków (localStorage)
- Kreator tortów działa płynnie na urządzeniach mobilnych (brak lagów)
- Upload wielu zdjęć (do 3) działa bez błędów

#### Dodatkowe metryki UX

- Wskaźnik completion rate kreatora tortów >70% (użytkownicy którzy rozpoczną, ukończą)
- Wskaźnik porzuceń kreatora tortów bliski 0% w testach użyteczności
- Średnia liczba produktów w koszyku przed wysłaniem zapytania: 1.5-2.5
- Użytkownicy dodają produkty do koszyka w >50% wizyt na stronie Oferty

#### Dodatkowe custom events (Faza 2)

- kreator_rozpoczety: liczba otwarć kreatora tortów
- kreator_ukonczony: liczba tortów dodanych z kreatora do koszyka
- produkt_dodany_do_koszyka: liczba dowolnych produktów dodanych do koszyka
- koszyk_porzucony: użytkownik opuścił stronę z niepustym koszykiem

#### Wskaźnik konwersji lejka (Faza 2)

wizyta na Ofercie → dodanie do koszyka → otwarcie pełnego widoku koszyka → przejście do formularza → wysłanie zapytania

Cel: min. 10% konwersja z wizyty na Ofercie do wysłania zapytania

### Faza 3 i dalej

- Metryki custom panelu admin: średni czas odpowiedzi, liczba zamówień per status
- Automatyzacja: procent zamówień z automatycznym emailem do klienta po zmianie statusu
- Retention: procent klientów z więcej niż 1 zamówieniem w ciągu 6 miesięcy (wymaga kont użytkowników z Fazy 4)
