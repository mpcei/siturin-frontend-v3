export function datePickerFormat(): string {
    return 'yy-mm-dd';
}

export function dateOnlyToLocalDate(dateStr?: string | null): Date | null {
    if (!dateStr) return null;

    const [y, m, d] = dateStr.split('-').map(Number);

    return new Date(y, m - 1, d, 12, 0, 0); // mediodía local evita desfase
}
