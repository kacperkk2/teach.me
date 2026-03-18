import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Course } from '../../data/model/course';
import { Lesson } from '../../data/model/lesson';
import { Card } from '../../data/model/card';

const FONT_NAME = 'LiberationSans';
const FONT_URL = 'assets/fonts/LiberationSans-Regular.ttf';
const ICON_URL = 'teach_me_icon.png';
const APP_TITLE = 'TeachMe';

@Injectable({ providedIn: 'root' })
export class PdfGeneratorService {

    async generateCoursePdf(course: Course, lessons: Lesson[], cardsMap: { [id: number]: Card }): Promise<void> {
        const doc = new jsPDF();

        const [fontBytes, iconDataUrl] = await Promise.all([
            fetch(FONT_URL).then(r => r.arrayBuffer()),
            this.loadImageAsDataUrl(ICON_URL),
        ]);

        const bytes = new Uint8Array(fontBytes);
        let binary = '';
        for (let i = 0; i < bytes.length; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        const fontBase64 = btoa(binary);
        doc.addFileToVFS(`${FONT_NAME}.ttf`, fontBase64);
        doc.addFont(`${FONT_NAME}.ttf`, FONT_NAME, 'normal');
        doc.setFont(FONT_NAME);

        // App header: icon + "TeachMe" (left) | date (right)
        doc.addImage(iconDataUrl, 'PNG', 14, 8, 10, 10);
        doc.setFontSize(16);
        doc.setTextColor(206, 147, 216);
        doc.text(APP_TITLE, 26, 16);

        const generatedDate = new Date().toLocaleDateString('pl-PL');
        doc.setFontSize(10);
        doc.setTextColor(120);
        doc.text(`Data wygenerowania: ${generatedDate}`, 196, 16, { align: 'right' });
        doc.setTextColor(0);

        // Separator line
        doc.setDrawColor(206, 147, 216);
        doc.setLineWidth(0.5);
        doc.line(14, 22, 196, 22);

        // Course name
        doc.setFontSize(18);
        doc.text(course.name, 14, 32);

        // Summary: lessons count · cards count
        const totalCards = lessons.reduce((sum, l) => sum + l.cardIds.length, 0);
        doc.setFontSize(10);
        doc.setTextColor(120);
        doc.text(`${lessons.length} ${lessons.length === 1 ? 'lekcja' : lessons.length < 5 ? 'lekcje' : 'lekcji'}  ·  ${totalCards} ${totalCards === 1 ? 'karta' : totalCards < 5 ? 'karty' : 'kart'}`, 14, 40);
        doc.setTextColor(0);

        let y = 49;

        lessons.forEach(lesson => {
            const cards = lesson.cardIds
                .map(id => cardsMap[id])
                .filter(card => !!card);

            autoTable(doc, {
                startY: y,
                head: [[{ content: lesson.name, colSpan: 2, styles: { fillColor: [206, 147, 216], textColor: [30, 30, 30], fontSize: 13, cellPadding: 4 } }]],
                body: cards.map(card => [card.question, card.answer]),
                styles: { fontSize: 10, cellPadding: 3, font: FONT_NAME, overflow: 'linebreak' },
                columnStyles: { 0: { cellWidth: 91 }, 1: { cellWidth: 91 } },
                headStyles: { font: FONT_NAME },
                margin: { left: 14, right: 14 },
            });

            y = (doc as any).lastAutoTable.finalY + 10;
        });

        doc.save('teach-me-' + course.name + '.pdf');
    }

    private loadImageAsDataUrl(url: string): Promise<string> {
        return fetch(url)
            .then(r => r.blob())
            .then(blob => new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            }));
    }
}
