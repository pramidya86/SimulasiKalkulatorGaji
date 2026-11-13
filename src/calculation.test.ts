import { describe, expect, it } from 'vitest';
import { calculate, groupForComparatio, parseRupiah } from './calculation';
import { GRADES, nextGrade } from './master';
describe('validasi master dan aturan', () => {
    it('grade gabungan dan grade tertinggi', () => { expect(nextGrade('2F')).toBe('3A'); expect(nextGrade('3D')).toBe('3E/4A'); expect(nextGrade('3E/4A')).toBe('4B'); expect(nextGrade('4D')).toBe('4E/5A'); expect(nextGrade('4E/5A')).toBe('5B'); expect(nextGrade('5B')).toBeNull(); expect(GRADES.length).toBe(16) });
    it('Kasus A: hasil normal', () => { const x = calculate('3A', 'PR2', 6000000); expect(x.comparatio).toBe(75); expect(x.bucketIndex).toBe(1); expect(x.persenMatriks).toBe(13.5); expect(x.kenaikanMatriks).toBe(810000); expect(x.gajiBaru).toBe(6810000); expect(x.totalSaatIni).toBe(11425000); expect(x.totalBaru).toBe(14510000); expect(x.selisihTotal).toBe(3085000); expect(x.persenTotal.toFixed(2)).toBe('27.00') });
    it('Kasus B: PR5 minimum', () => { const x = calculate('2A', 'PR5', 2100000); expect(x.persenMatriks).toBe(0); expect(x.gajiBaru).toBe(2200000); expect(x.alasan).toContain('minimum') });
    it('Kasus C: maksimum', () => { const x = calculate('2A', 'PR1', 5000000); expect(x.persenMatriks).toBe(7.5); expect(x.gajiSebelumPenyesuaian).toBe(5375000); expect(x.gajiBaru).toBe(5200000) });
    it('Kasus D: gaji awal di atas maksimum baru', () => { const x = calculate('2A', 'PR1', 5300000); expect(x.gajiBaru).toBe(5300000) });
    it('Kasus E: tertinggi', () => { expect(() => calculate('5B', 'PR1', 50000000)).toThrow('grade tertinggi') });
    it('kelompok comparatio tepat batas', () => { for (const [i, b] of [65, 75, 85, 95, 105, 115, 125, 135].entries()) { const m = 100000; const g = m * b / 100; expect(groupForComparatio(g, m)).toBe(i); expect(groupForComparatio(g + 1, m)).toBe(i + 1); expect(groupForComparatio(g - 1, m)).toBe(i === 0 ? 0 : i) } });
    it('parse input aman', () => { for (const x of ['', '0', '-500', '12.50', 'abc', '1e6', 'NaN', 'Infinity', '1.23.456', '9007199254740992', 'Rp 0']) expect(parseRupiah(x)).toBeNull(); expect(parseRupiah('Rp 6.000.000')).toBe(6000000); expect(parseRupiah('6,000,000')).toBe(6000000); expect(parseRupiah('6000000')).toBe(6000000) });
});
