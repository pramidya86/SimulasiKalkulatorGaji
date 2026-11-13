import { BOUNDS, BUCKET_LABELS, Grade, gradeInfo, MATRIX, nextGrade, Rating } from './master';
export interface Simulation {
    gradeSaatIni: Grade; gradeBaru: Grade; rating: Rating; gajiSaatIni: number; gajiBaru: number;
    tunjanganSaatIni: number; tunjanganBaru: number; midpointSaatIni: number; bucketIndex: number; bucketLabel: string;
    comparatio: number; persenMatriks: number; kenaikanMatriks: number; gajiSebelumPenyesuaian: number;
    selisihGaji: number; persenEfektif: number; selisihTunjangan: number;
    totalSaatIni: number; totalBaru: number; selisihTotal: number; persenTotal: number; alasan: string;
}

export function parseRupiah(input: string): number | null {
    const v = input.trim().replace(/^Rp\s*/i, '').trim();
    if (!/^(?:[1-9]\d*|[1-9]\d{0,2}(?:\.\d{3})+|[1-9]\d{0,2}(?:,\d{3})+)$/.test(v)) return null;
    const n = Number(v.replace(/[.,]/g, ''));
    return Number.isSafeInteger(n) && n > 0 ? n : null;
}
export function formatRupiah(n: number): string { return 'Rp' + new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(n); }
export function formatPercent(n: number): string { return new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n) + '%'; }
export function groupForComparatio(gaji: number, midpoint: number): number {
    const found = BOUNDS.findIndex(b => gaji * 100 <= midpoint * b);
    return found === -1 ? 8 : found;
}

export function calculate(grade: Grade, rating: Rating, gaji: number): Simulation {
    if (!Number.isSafeInteger(gaji) || gaji <= 0) throw new Error('Gaji pokok harus berupa bilangan bulat positif yang valid.');
    const baru = nextGrade(grade); if (!baru) throw new Error('Anda telah berada pada grade tertinggi dalam tabel. Simulasi kenaikan satu grade tidak tersedia.');
    const now = gradeInfo(grade), upcoming = gradeInfo(baru);
    const bucketIndex = groupForComparatio(gaji, now.midpoint);
    const comparatio = gaji / now.midpoint * 100;
    const persenMatriks = MATRIX[rating][bucketIndex];
    const kenaikanMatriks = gaji * persenMatriks / 100;
    const gajiSebelumPenyesuaian = gaji + kenaikanMatriks;
    let gajiBaru: number, alasan: string;
    
    if (gaji > upcoming.maximum) { gajiBaru = gaji; alasan = 'Gaji pokok saat ini dipertahankan karena sudah melebihi maksimum grade baru.'; }
    else if (gajiSebelumPenyesuaian < upcoming.minimum) { gajiBaru = upcoming.minimum; alasan = 'Gaji pokok disesuaikan ke minimum grade baru.'; }
    else if (gajiSebelumPenyesuaian > upcoming.maximum) { gajiBaru = upcoming.maximum; alasan = 'Gaji pokok dibatasi pada maksimum grade baru.'; }
    else { gajiBaru = Math.round(gajiSebelumPenyesuaian); alasan = 'Gaji pokok sesuai hasil perhitungan.'; }
    
    if (!Number.isSafeInteger(gajiBaru)) throw new Error('Hasil perhitungan melampaui batas angka aman.');
    const tunjanganSaatIni = now.tunjanganPosisi, tunjanganBaru = upcoming.tunjanganPosisi;
    const totalSaatIni = gaji + tunjanganSaatIni, totalBaru = gajiBaru + tunjanganBaru;
    const selisihTotal = totalBaru - totalSaatIni;
    return {
        gradeSaatIni: grade, gradeBaru: baru, rating, gajiSaatIni: gaji, gajiBaru, tunjanganSaatIni, tunjanganBaru,
        midpointSaatIni: now.midpoint, bucketIndex, bucketLabel: BUCKET_LABELS[bucketIndex], comparatio, persenMatriks, kenaikanMatriks, gajiSebelumPenyesuaian,
        selisihGaji: gajiBaru - gaji, persenEfektif: (gajiBaru - gaji) / gaji * 100, selisihTunjangan: tunjanganBaru - tunjanganSaatIni,
        totalSaatIni, totalBaru, selisihTotal, persenTotal: selisihTotal / totalSaatIni * 100, alasan
    };
}
