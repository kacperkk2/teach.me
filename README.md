<div align="center">

# TeachMe

**Darmowa aplikacja do nauki fiszek — nie wymaga serwera, szybka i zawsze pod ręką**

[![Angular](https://img.shields.io/badge/Angular-17-DD0031?logo=angular&logoColor=white)](https://angular.io/)
[![NgRx](https://img.shields.io/badge/NgRx-17-BA2BD2?logo=redux&logoColor=white)](https://ngrx.io/)
[![PWA](https://img.shields.io/badge/PWA-gotowe-5A0FC8?logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![Licencja](https://img.shields.io/badge/Licencja-MIT-blue.svg)](LICENSE)

[**Uruchom aplikację →**](https://kacperkk2.github.io/teach.me/)

</div>

---

## Czym jest TeachMe?

TeachMe to aplikacja do nauki przez fiszki, która pomaga zapamiętać słówka, definicje, fakty — cokolwiek, czego chcesz się nauczyć. Nauka odbywa się w rundach: przerabiasz karty, odkładasz te, których jeszcze nie znasz, i powtarzasz aż do skutku.

Twoje dane zostają wyłącznie w Twojej przeglądarce. Żadnego konta, żadnego serwera, żadnego śledzenia.

---

## Funkcje

### Nauka
- **Nauka w rundach** — Przerabiaj karty, oznaczaj te, które sprawiły Ci trudność, i powtarzaj je aż je opanujesz
- **Podsumowanie sesji** — Po każdej sesji widzisz, ile rund Cię kosztowała dana partia materiału
- **Odwracanie kart** — Zamień pytania z odpowiedziami jednym kliknięciem, żeby ćwiczyć w obu kierunkach

### Organizacja
- **Kursy → Lekcje → Karty** — Przejrzysta hierarchia pozwala utrzymać porządek w materiałach
- **Zmiana kolejności** — Przeciągaj karty i lekcje w dowolną kolejność
- **Masowe dodawanie kart** — Wklej pary `pytanie - odpowiedź` i dodaj dziesiątki kart naraz
- **Wyszukiwanie** — Znajdź dowolną kartę w kursie lub lekcji w ułamku sekundy

### Udostępnianie i eksport
- **Udostępnianie przez link** — Wyeksportuj lekcję lub kurs jako skompresowany URL i wyślij go komukolwiek
- **Import z linku** — Otwórz udostępniony link i dodaj jego zawartość do swojej kolekcji
- **Eksport do PDF** — Wygeneruj gotowy do druku plik PDF z dowolnego kursu

### Nauka języków
- **Czytanie na głos** — Przypisz język do kursu, a aplikacja będzie odczytywać karty podczas nauki

### Prywatność i dostępność
- **Działa offline (PWA)** — Po pierwszym uruchomieniu aplikacja działa bez połączenia z internetem
- **Bez rejestracji** — Wszystkie dane przechowywane są lokalnie w przeglądarce

---

## Jak zacząć?

### Wypróbuj od razu

Otwórz [aplikację na żywo](https://kacperkk2.github.io/teach.me/) — żadna instalacja nie jest potrzebna.

### Uruchom lokalnie

**Wymagania:** Node.js 18+, Angular CLI 17

```bash
git clone https://github.com/kacperkk2/teach.me.git
cd teach.me
npm install
npm start
```

Otwórz [http://localhost:4200](http://localhost:4200) w przeglądarce.

### Budowanie produkcyjne

```bash
npm run build
```

---

## Stos technologiczny

| Warstwa | Technologia |
|---|---|
| Framework | Angular 17 |
| Zarządzanie stanem | NgRx (Store + Effects) |
| Komponenty UI | Angular Material |
| Kompresja danych | lz-string |
| Generowanie PDF | jsPDF |
| Tryb offline | Angular Service Worker (PWA) |
| Przechowywanie danych | localStorage |

---

## Struktura projektu

```
src/
  app/              # Moduł główny i routing
  commons/          # Współdzielone komponenty UI
  data/
    model/          # Interfejsy: Course, Lesson, Card
    store/          # NgRx: akcje, reducery, efekty, selektory
  feature/          # Komponenty funkcjonalne pogrupowane domenowo
    courses/
    lessons/
    cards/
    learn/          # Przepływ nauki w rundach
    import/
  services/         # Serwisy aplikacji
```

---

## Licencja

[MIT](LICENSE)
