export function formatDateToPl(date: Date | string | null): string {
    if(!date) {
        return '-';
    }

    const parsedDate = new Date(date);

    if(Number.isNaN(parsedDate.getTime())) {
        return '-';
    }

    return new Intl.DateTimeFormat('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(parsedDate);
}