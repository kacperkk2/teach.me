# TeachMe — TODO

## 1. Spaced Repetition

**Priorytet:** Wysoki

**Kontekst:** Infrastruktura jest już gotowa — model danych ma pola `lastLearningDate`, `nextSuggestedLearningDate`, `noMistakeInARow` zarówno na `Course` jak i `Lesson`. Są zapisywane przy tworzeniu encji, ale **nigdzie nie są używane w UI ani logice nauki**.

**Co zrobić:**
- Po zakończeniu sesji nauki obliczać i zapisywać `nextSuggestedLearningDate` (algorytm: im więcej razy z rzędu bez błędu, tym dłuższy interwał — uproszczony SM-2)
- Inkrementować `noMistakeInARow` gdy sesja zakończyła się bezbłędnie, resetować gdy były błędy
- Zapisywać `lastLearningDate` po każdej sesji (nie tylko przy tworzeniu)
- Na kafelkach kursu/lekcji wyświetlać badge/wskaźnik "do powtórki" gdy `nextSuggestedLearningDate <= today`
- Dodać tryb nauki "Zaplanowane powtórki" (obok istniejących trybów All/Marked/Quick/Previously failed) — widoczny tylko gdy są karty "do powtórki"

**Pliki do zmiany:**
- `src/app/data/model/` — modele już mają pola, bez zmian
- `src/feature/learn/` — `LearnComponent`, `RoundComponent`, `SummaryComponent` — logika po zakończeniu sesji
- `src/app/data/store/` — effects (kurs/lekcja) do zapisu dat po sesji
- `src/feature/courses/` i `src/feature/lessons/` — kafelki z badge'em "do powtórki"
- `src/app/app.properties.ts` — nowe etykiety UI

---

## 2. Statystyki i historia sesji

**Priorytet:** Wysoki

**Kontekst:** Aplikacja nie przechowuje żadnej historii nauki. Po sesji użytkownik nie widzi czy robi postępy. `wrongPreviouslyCardIds` to jedyna forma "pamięci" — zapamiętuje błędne karty z ostatniej sesji, ale bez daty ani kontekstu.

**Co zrobić:**
- Dodać do modelu (lub osobny slice NgRx) kolekcję `SessionRecord`: `{ date, courseId?, lessonId?, totalCards, correctCards, rounds }`
- Zapisywać `SessionRecord` po każdym zakończeniu sesji (w istniejącym effect po `endLearning`)
- Ekran statystyk (nowa zakładka lub widok) pokazujący:
  - Liczbę sesji w ostatnich 7/30 dniach (wykres słupkowy lub heat-map kalendarza)
  - % poprawnych odpowiedzi w czasie per lekcja/kurs
  - Łączna liczba przećwiczonych kart

**Pliki do zmiany:**
- `src/app/data/model/` — nowy interfejs `SessionRecord`
- `src/app/data/store/` — nowy slice lub rozszerzenie istniejącego
- `src/feature/learn/summary/` — dispatch zapisu sesji przy "Zakończ"
- Nowy komponent `src/feature/stats/` lub dodatkowa zakładka w widoku kursu

---

## 3. Streaki i cel dzienny

**Priorytet:** Średni

**Kontekst:** Brak jakiegokolwiek mechanizmu motywacyjnego. Użytkownicy odkładają naukę — klasyczny problem retencji. Zależy od implementacji punktu 2 (historia sesji), bo streak liczy się na podstawie dni z co najmniej jedną sesją.

**Co zrobić:**
- Obliczać aktualny streak (liczba kolejnych dni z co najmniej 1 sesją) na podstawie `SessionRecord`
- Wyświetlać streak w nagłówku aplikacji (np. "🔥 7 dni")
- Opcjonalny dzienny cel kart (konfigurowalny w ustawieniach, domyślnie np. 10)
- Pasek postępu dziennego celu na ekranie głównym (kursy)
- Powiadomienia push przez PWA Service Worker ("Nie zapomnij o dzisiejszej powtórce") — Service Worker jest już skonfigurowany

**Pliki do zmiany:**
- `src/feature/courses/` — nagłówek/header ze streakiemm i celem dziennym
- `src/app/app.properties.ts` — domyślna wartość celu dziennego
- `ngsw-config.json` / Service Worker — push notifications
- Zależy od: **punktu 2** (historia sesji)

---

## 4. Tryb wpisywania odpowiedzi (active recall)

**Priorytet:** Średni

**Kontekst:** Obecny flow: pytanie → klik → odpowiedź → samoocena (Dobrze/Źle). Użytkownik ocenia się sam, co prowadzi do nieświadomego "oszukiwania". Wpisywanie odpowiedzi przed odkryciem to jedna z najskuteczniejszych technik nauki.

**Co zrobić:**
- Nowa opcja w ustawieniach sesji (przed startem rundy): "Tryb wpisywania"
- W `RoundComponent` zamiast przycisku "Pokaż odpowiedź" — pole `<input>` + przycisk "Sprawdź"
- Po zatwierdzeniu: porównanie wpisanego tekstu z odpowiedzią (case-insensitive, trim, opcjonalnie ignore diakrytyki)
- Pokazanie poprawnej odpowiedzi z podświetleniem różnic
- Automatyczne oznaczenie jako Dobrze/Źle na podstawie wyniku (bez samooceny)
- Przycisk "Pokaż mimo to" — możliwość pominięcia wpisywania dla konkretnej karty

**Pliki do zmiany:**
- `src/feature/learn/round/round.component.ts` i `.html` — główna logika
- `src/feature/learn/learn.component.ts` — opcja wyboru trybu przed startem
- `src/app/services/learning-preferences.service.ts` — persystencja preferencji trybu

---

## 5. Tryb quiz (multiple choice)

**Priorytet:** Niski

**Kontekst:** Alternatywny tryb nauki — pokaż pytanie + 4 odpowiedzi do wyboru (1 poprawna + 3 losowe z tej samej lekcji/kursu). Niższy próg wejścia niż active recall, popularny format szczególnie na mobile.

**Co zrobić:**
- Nowy tryb do wyboru przed startem sesji: "Quiz (wybór odpowiedzi)"
- W `RoundComponent` nowy wariant widoku: pytanie + 4 kafelki z odpowiedziami
- Losowanie 3 "dystraktorów" z pozostałych kart w tej samej lekcji/kursie
- Po wyborze: natychmiastowe oznaczenie poprawnej/błędnej odpowiedzi z animacją
- Automatyczna ocena (bez samooceny)
- Wymaga minimum ~4 kart w zestawie nauki (fallback na zwykły tryb jeśli za mało)

**Pliki do zmiany:**
- `src/feature/learn/round/` — nowy wariant komponentu lub nowy komponent `QuizRoundComponent`
- `src/feature/learn/learn.component.ts` — opcja wyboru trybu
- `src/app/data/store/selectors` — selektor do losowania kart z kontekstu lekcji/kursu

---

## 6. UX: potwierdzenia po imporcie/eksporcie

**Priorytet:** Niski

**Kontekst:** Drobne usprawnienia UX przy istniejących funkcjach.

**Co zrobić:**
- **Po imporcie:** wyraźny ekran sukcesu "Zaimportowano X kart do kursu Y" z przyciskiem przejścia do lekcji
- **Eksport URL:** przycisk "Kopiuj link" z auto-zamknięciem dialogu i toastem "Skopiowano!"
- **Eksport PDF:** po wygenerowaniu toast "PDF zapisany" (teraz nic się nie dzieje wizualnie po pobraniu)

**Pliki do zmiany:**
- `src/feature/import/import.component.ts` — ekran sukcesu
- `src/feature/cards/` i `src/feature/lessons/` — dialogi eksportu URL (kopiowanie)
- `src/feature/lessons/` — po wygenerowaniu PDF toast notification
