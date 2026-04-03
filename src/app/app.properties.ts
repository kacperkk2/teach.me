export const CONFIG = {

    IMPORT: {
        importPath: "/import",
        dataParam: "data",
        appRoot: "/teach.me",
        codesParam: "codes",
        courseNameParam: "name",
        courseLanguageParam: "lang",
        codeSeparator: ","
    },

    COURSES: {
        nameMaxLength: 40
    },

    LANGUAGES: [
        { code: 'en-US', label: 'Angielski (USA)' },
        { code: 'en-GB', label: 'Angielski (UK)' },
        { code: 'de-DE', label: 'Niemiecki' },
        { code: 'fr-FR', label: 'Francuski' },
        { code: 'es-ES', label: 'Hiszpański' },
        { code: 'it-IT', label: 'Włoski' },
        { code: 'pl-PL', label: 'Polski' },
        { code: 'hr-HR', label: 'Chorwacki' },
        { code: 'el-GR', label: 'Grecki' },
        { code: 'lt-LT', label: 'Litewski' },
    ],

    LESSONS: {
        nameMaxLength: 40
    },

    CARDS: {
        phraseMaxLength: 70,

        ADD_CARD: {
            questionAnswerSeparators: ['-', '–'],
            questionAnswerOutputSeparator: '-'
        }
    },

    QUICK_LEARN: {
        minCards: 10
    },

LABELS: {
        appTitle: 'TeachMe',
        course: 'kurs',
        lesson: 'lekcja',
        cards: 'karty',

        addCourse: 'nowy kurs',
        addLesson: 'nowa lekcja',
        addCards: 'nowe karty',

        editCard: 'edycja karty',
        manageLesson: 'zarządzaj lekcją',
        manageCourse: 'zarządzaj kursem',

        editOrder: 'edytuj kolejność',
        save: 'zapisz',

        question: 'pytanie',
        answer: 'odpowiedź',
        lessonName: 'nazwa lekcji',
        courseName: 'nazwa kursu',
        courseLanguage: 'język kursu',
        courseLanguageNone: 'brak (nie czytaj)',
        languageCourse: 'Kurs językowy',

        removeCourse: 'usuń kurs',
        removeLesson: 'usuń lekcję',
        removeAppData: 'usuń dane aplikacji',

        teachTab: 'nauka',
        lessonsTab: 'lekcje',
        cardsTab: 'karty',

        deleteCardConfirmation: 'Czy na pewno chcesz usunąć kartę?',
        deleteLessonConfirmation: 'Czy na pewno chcesz usunąć lekcję?',
        deleteCourseConfirmation: 'Czy na pewno chcesz usunąć kurs?',
        deleteAppDataConfirmation: 'Czy na pewno chcesz usunąć dane aplikacji?',

        emptyCourses: 'Brak kursów',
        emptyCoursesSub: 'Kliknij żeby dodać kurs',
        emptyLessons: 'Brak lekcji',
        emptyLessonsSub: 'Kliknij przycisk na dole żeby dodać lekcję',
        emptyCards: 'Brak kart',
        emptyCardsSub: 'Kliknij przycisk na dole żeby dodać karty',

        exportLesson: 'eksportuj lekcję',
        exportCourse: 'eksportuj kurs',
        importLesson: 'import lekcji',
        importCourse: 'import kursu',
        importFailed: 'import nieudany',
        importFailedReason: 'Niestety nie udało się odczytać danych',
        importFailedDescription: 'Dane zapisane w adresie URL są błędne',
        importCodesFailedReason: 'Nie można wczytać danych lekcji',
        importCodesFailedDescription: 'Serwis is.gd jest niedostępny lub link wygasł. Poproś nadawcę o ponowne wygenerowanie linku.',
        exportCourseFailed: 'Kurs jest za duży do udostępnienia jako link. Podziel go na mniejsze lekcje.',
        importSummary: 'import',
        importPreview: 'podgląd',
        addToCourse: 'Dodaj do kursu',
        newCourseName: 'Nazwa nowego kursu',

        turnCards: 'Odwróć wszystkie karty',
        turnCardsSnackBar: 'Karty zostały odwrócone',
        turnCardsShort: 'Odwróć',

        reorderCards: 'Edytuj kolejność kart',
        reorderShort: 'Kolejność',

        removeAllCardsMarks: 'Usuń oznaczenia kart',
        removeMarksShort: 'Odznacz',

        markAllCards: 'Zaznacz wszystkie karty',
        markAllShort: 'Zaznacz',
        bulkActions: 'Akcje na wszystkich kartach',

        searchPlaceholder: 'Szukaj w kartach...',

        generatePdf: 'Generuj PDF',
        generatePdfConfirmation: 'Czy chcesz pobrać pdf z zawartością kursu?',
    }
}