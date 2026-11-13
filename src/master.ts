export type Grade = '2A' | '2B' | '2C' | '2D' | '2E' | '2F' | '3A' | '3B' | '3C' | '3D' | '3E/4A' | '4B' | '4C' | '4D' | '4E/5A' | '5B';
export type Rating = 'PR1' | 'PR2' | 'PR3' | 'PR4' | 'PR5';
export interface GradeData { grade: Grade; minimum: number; midpoint: number; maximum: number; tunjanganPosisi: number }
export const MASTER: readonly GradeData[] = [
    { grade: '2A', minimum: 2100000, midpoint: 3400000, maximum: 4600000, tunjanganPosisi: 3800000 },
    { grade: '2B', minimum: 2200000, midpoint: 3800000, maximum: 5200000, tunjanganPosisi: 3850000 },
    { grade: '2C', minimum: 2300000, midpoint: 4200000, maximum: 5700000, tunjanganPosisi: 3950000 },
    { grade: '2D', minimum: 2400000, midpoint: 4700000, maximum: 6400000, tunjanganPosisi: 4300000 },
    { grade: '2E', minimum: 2600000, midpoint: 5200000, maximum: 7100000, tunjanganPosisi: 4600000 },
    { grade: '2F', minimum: 3300000, midpoint: 5500000, maximum: 7400000, tunjanganPosisi: 4825000 },
    { grade: '3A', minimum: 4800000, midpoint: 8000000, maximum: 10800000, tunjanganPosisi: 5425000 },
    { grade: '3B', minimum: 5600000, midpoint: 11100000, maximum: 15000000, tunjanganPosisi: 7700000 },
    { grade: '3C', minimum: 7000000, midpoint: 13900000, maximum: 18800000, tunjanganPosisi: 10400000 },
    { grade: '3D', minimum: 10300000, midpoint: 20600000, maximum: 27900000, tunjanganPosisi: 13500000 },
    { grade: '3E/4A', minimum: 12200000, midpoint: 24300000, maximum: 32900000, tunjanganPosisi: 21100000 },
    { grade: '4B', minimum: 16100000, midpoint: 26700000, maximum: 36100000, tunjanganPosisi: 29200000 },
    { grade: '4C', minimum: 19200000, midpoint: 32000000, maximum: 43200000, tunjanganPosisi: 37750000 },
    { grade: '4D', minimum: 24100000, midpoint: 40100000, maximum: 54200000, tunjanganPosisi: 46600000 },
    { grade: '4E/5A', minimum: 30800000, midpoint: 51200000, maximum: 69200000, tunjanganPosisi: 62300000 },
    { grade: '5B', minimum: 39600000, midpoint: 66000000, maximum: 89100000, tunjanganPosisi: 76300000 }
] as const;
export const MATRIX: Record<Rating, readonly number[]> = {
    PR1: [15.5, 14.5, 13.5, 12.5, 11.5, 10.5, 9.5, 8.5, 7.5],
    PR2: [14.5, 13.5, 12.5, 11.5, 10.5, 9.5, 8.5, 7.5, 6.5],
    PR3: [13.5, 12.5, 11.5, 10.5, 9.5, 8.5, 7.5, 6.5, 5.5],
    PR4: [9.5, 8.5, 7.5, 6.5, 5.5, 4.5, 3.5, 2.5, 1.5],
    PR5: [0, 0, 0, 0, 0, 0, 0, 0, 0]
};
export const BOUNDS = [65, 75, 85, 95, 105, 115, 125, 135] as const;
export const BUCKET_LABELS = ['≤65%', '>65% sampai ≤75%', '>75% sampai ≤85%', '>85% sampai ≤95%', '>95% sampai ≤105%', '>105% sampai ≤115%', '>115% sampai ≤125%', '>125% sampai ≤135%', '>135%'] as const;
export const GRADES = MASTER.map(x => x.grade);
export function gradeInfo(grade: Grade): GradeData { return MASTER.find(row => row.grade === grade)!; }
export function nextGrade(grade: Grade): Grade | null { const i = GRADES.indexOf(grade); return i < 0 || i === GRADES.length - 1 ? null : GRADES[i + 1]; }
