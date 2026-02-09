import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { HttpClient } from '@angular/common/http';
import * as Papa from 'papaparse';

export interface Task {
    name: string;
    start: Date;
    end: Date;
    progress: number;
}

interface GanttMonth {
    name: string;
    days: number[];
}

@Component({
    selector: 'app-gantt',
    imports: [TableModule],
    templateUrl: './gantt.component.html',
    styleUrl: './gantt.component.scss'
})
export class GanttComponent implements OnInit {
    tasks: any[] = [];
    months: GanttMonth[] = [];
    totalDays = 0;
    dayWidth = 30; // ancho de una columna/día en px

    ngOnInit(): void {}

    calculateTotalDays() {
        this.totalDays = this.months.reduce((sum, month) => sum + month.days.length, 0);
    }

    startDate = new Date('2026-02-11');
    endDate = new Date('2026-10-31');

    generateTimeline(start: Date, end: Date) {
        const current = new Date(start.getFullYear(), start.getMonth(), 1);

        while (current <= end) {
            const year = current.getFullYear();
            const month = current.getMonth();

            const monthStart = new Date(year, month, 1);
            const monthEnd = new Date(year, month + 1, 0);

            const days: number[] = [];

            const fromDay = year === start.getFullYear() && month === start.getMonth() ? start.getDate() : 1;

            const toDay = year === end.getFullYear() && month === end.getMonth() ? end.getDate() : monthEnd.getDate();

            for (let d = fromDay; d <= toDay; d++) {
                days.push(d);
            }

            this.months.push({
                name: this.getMonthName(month) + ' ' + year,
                days
            });

            current.setMonth(current.getMonth() + 1);
        }
    }

    getMonthName(month: number): string {
        return ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'][month];
    }

    timelineStart = new Date(2026, 1, 11); // Febrero = 1

    getLeft(task: any): number {
        const start = this.parseDate(task.start);
        return this.diffInDays(start, this.timelineStart) * this.dayWidth;
    }

    getWidth(task: any): number {
        const start = this.parseDate(task.start);
        const end = this.parseDate(task.end);
        const days = this.diffInDays(end, start) + 1;
        return days * this.dayWidth;
    }

    diffInDays(a: Date, b: Date): number {
        const MS = 1000 * 60 * 60 * 24;
        return Math.round((a.getTime() - b.getTime()) / MS);
    }

    parseDate(dateStr: string): Date {
        const [month, day, year] = dateStr.split('/').map(Number);
        return new Date(year, month - 1, day + 1);
    }

    constructor(private http: HttpClient) {
        this.loadCSV();
    }

    loadCSV() {
        this.http.get('tasks.csv', { responseType: 'text' }).subscribe((text) => {
            Papa.parse(text, {
                header: true,
                skipEmptyLines: true,
                complete: (res) => {
                    this.tasks = (res.data as any[]).map((row, i) => ({
                        id: row.id || 'task' + (i + 1),
                        name: row.name,
                        start: row.start,
                        end: row.end,
                        progress: Number(row.progress || 0)
                    }));

                    console.log(this.tasks);
                    this.generateTimeline(this.startDate, this.endDate);
                    this.calculateTotalDays();
                }
            });
        });
    }

    readCSV(file: File) {
        const reader = new FileReader();

        reader.onload = () => {
            const text = reader.result as string;
            const lines = text.split('\n');
            const headers = lines[0].split(',');

            this.tasks = lines.slice(1).map((line, i) => {
                const values = line.split(',');
                const row: any = {};
                headers.forEach((h, idx) => (row[h.trim()] = values[idx]?.trim()));

                return {
                    id: 'task' + i,
                    name: row.name,
                    start: row.start,
                    end: row.end,
                    progress: Number(row.progress || 0)
                };
            });
        };

        reader.readAsText(file);
    }
}
