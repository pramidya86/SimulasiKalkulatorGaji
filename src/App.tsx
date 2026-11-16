import { useState } from 'react';
import { ArrowRight, BadgeCheck, BriefcaseBusiness, Calculator, ChevronDown, CircleAlert, CircleCheck, Coins, Info, Layers3, RotateCcw, TrendingUp, UserRound, Wallet } from 'lucide-react';
import { calculate, formatPercent, formatRupiah, parseRupiah, Simulation } from './calculation';
import { Grade, gradeInfo, GRADES, nextGrade, Rating } from './master';
const PRS: Rating[] = ['PR1', 'PR2', 'PR3', 'PR4', 'PR5'];
const moneyOrDash = (n: number | undefined) => n === undefined ? '—' : formatRupiah(n);
function ReadonlyField({ id, label, value, icon: Icon, help }: { id: string, label: string, value: string, icon: typeof Layers3, help?: string }) { return <div className="form-row"><label htmlFor={id} className="field-label"><Icon size={24} /><span>{label}</span></label><div className="field-side"><output id={id} className="read-field" aria-label={label}>{value}</output><span className="field-hint">{help || 'Terisi otomatis'}</span></div></div> }
function DetailRow({ label, value }: { label: string, value: string }) { return <div className="detail-row"><span>{label}</span><strong>{value}</strong></div> }
export default function App() {
    const [grade, setGrade] = useState<Grade | ''>(''); const [rating, setRating] = useState<Rating | ''>(''); const [salary, setSalary] = useState('');
    const [result, setResult] = useState<Simulation | null>(null); const [dirty, setDirty] = useState(false); const [error, setError] = useState(''); const [detailExpanded, setDetailExpanded] = useState(false);
    const upcoming = grade ? nextGrade(grade) : null; const top = grade === '5B'; const parsed = parseRupiah(salary);
    function change() { if (result) { setDirty(true); setResult(null); } setError(''); }
    function handleGrade(v: string) { change(); setGrade(v as Grade | ''); } function handleRating(v: string) { change(); setRating(v as Rating | ''); }
    function handleSalary(v: string) { change(); setSalary(v); }
    function reset() { setGrade(''); setRating(''); setSalary(''); setResult(null); setDirty(false); setError(''); }
    function submit(e: React.FormEvent) {
        e.preventDefault(); if (top) return;
        if (!grade) { setError('Pilih grade saat ini.'); return; } if (!rating) { setError('Pilih Performance Rating.'); return; }
        if (parsed === null) { setError('Masukkan gaji pokok berupa bilangan bulat positif dengan format rupiah yang valid.'); return; }
        try { setResult(calculate(grade, rating, parsed)); setDirty(false); setError(''); } catch (err) { setError(err instanceof Error ? err.message : 'Perhitungan tidak dapat dilakukan.'); }
    }
    const outRange = grade && parsed !== null && (parsed < gradeInfo(grade).minimum || parsed > gradeInfo(grade).maximum);
    return <main className="page"><div className="page-container"><header className="hero"><div className="hero-brand"><span className="hero-brand-divider" aria-hidden="true" /></div><div className="hero-copy"><h1>Simulasi Kenaikan Gaji Karena Promosi</h1><p>Estimasi gaji pokok dan tunjangan posisi karena promosi grade.</p></div><img className="btn-logo" src={`${import.meta.env.BASE_URL}BTN-logo.png`} alt="Logo BTN" /></header>
        <div className="layout"><section className="panel"><div className="panel-title"><UserRound size={27} /><h2>Data Anda</h2></div><form onSubmit={submit} noValidate><div className="panel-content">
            <div className="form-row"><label htmlFor="grade" className="field-label"><Layers3 size={24} /><span>Grade saat ini</span></label><div className="field-side"><div className="select-wrap"><select id="grade" value={grade} onChange={e => handleGrade(e.target.value)}><option value="">Pilih grade</option>{GRADES.map(x => <option key={x} value={x}>{x}</option>)}</select><ChevronDown aria-hidden="true" size={19} /></div></div></div>
            <ReadonlyField id="new-grade" label="Grade baru" value={grade ? (upcoming || 'Tidak tersedia') : '—'} icon={TrendingUp} />
            <div className="form-row"><label htmlFor="rating" className="field-label"><BadgeCheck size={24} /><span>Performance Rating</span></label><div className="field-side"><div className="select-wrap"><select id="rating" value={rating} onChange={e => handleRating(e.target.value)}><option value="">Pilih nilai</option>{PRS.map(x => <option key={x} value={x}>{x}</option>)}</select><ChevronDown size={19} aria-hidden="true" /></div></div></div>
            <div className="form-separator" />
            <div className="form-row"><label htmlFor="salary" className="field-label"><Wallet size={24} /><span>Gaji Pokok saat ini</span></label><div className="field-side"><div className="money-input"><span>Rp</span><input id="salary" type="text" inputMode="numeric" autoComplete="off" placeholder="Contoh: 6.000.000" value={salary} onChange={e => handleSalary(e.target.value)} onBlur={() => { if (parsed !== null) setSalary(new Intl.NumberFormat('id-ID').format(parsed)); }} aria-invalid={!!error && parsed === null} /></div><span className="field-hint">Masukkan gaji pokok, tanpa tunjangan.</span></div></div>
            <ReadonlyField id="old-allowance" label="Tunjangan Posisi saat ini" value={grade ? formatRupiah(gradeInfo(grade).tunjanganPosisi) : '—'} icon={Coins} />
            <ReadonlyField id="new-basic" label="Gaji Pokok baru" value={moneyOrDash(result?.gajiBaru)} icon={Wallet} help={result ? 'Hasil simulasi' : 'Terisi setelah simulasi'} />
            <ReadonlyField id="new-allowance" label="Tunjangan Posisi baru" value={result && upcoming ? formatRupiah(gradeInfo(upcoming).tunjanganPosisi) : '—'} icon={BriefcaseBusiness} help={result ? 'Hasil simulasi' : 'Terisi setelah simulasi'} />
            {top && <div className="notice warning" role="status"><CircleAlert size={18} />Anda telah berada pada grade tertinggi dalam tabel. Simulasi kenaikan satu grade tidak tersedia.</div>}
            {outRange && !top && <div className="notice muted" role="status"><Info size={18} />Gaji pokok berada di luar rentang grade saat ini. Simulasi tetap dapat dilanjutkan.</div>}
            {error && <div className="notice warning" role="alert"><CircleAlert size={18} />{error}</div>}
            <div className="form-actions"><button className="primary" type="submit" disabled={top}><Calculator size={21} />Hitung Simulasi</button><button className="secondary" type="button" onClick={reset}><RotateCcw size={20} />Reset</button></div>
        </div></form></section>
            <section className="panel results"><div className="panel-title"><Calculator size={27} /><h2>Hasil Simulasi</h2></div><div className="panel-content">
                {result ? <><div className="hero-result"><div><div className="eyebrow">Total Gaji Pokok + Tunjangan Posisi</div><div className="hero-amount">{formatRupiah(result.totalBaru)}</div><div className="hero-sub">Setelah kenaikan gaji</div></div><div className="hero-pct">+{formatPercent(result.persenTotal)}</div></div>
                <div className="difference"><div><span>Total Gaji Pokok + Tunjangan Posisi saat ini</span><strong>{formatRupiah(result.totalSaatIni)}</strong></div><div className="divider-vertical" /><div><span>Kenaikan total</span><strong className="green">+{formatRupiah(result.selisihTotal)}</strong></div></div>
                    <div className="result-metrics"><div className="metric"><span className="metric-icon"><Wallet size={22} /></span><span>Gaji Pokok baru</span><strong>{formatRupiah(result.gajiBaru)}</strong></div><div className="metric"><span className="metric-icon"><BriefcaseBusiness size={22} /></span><span>Tunjangan Posisi baru</span><strong>{formatRupiah(result.tunjanganBaru)}</strong></div></div>
                    <div className="mini-summary"><div><Layers3 size={22} /><span>Perubahan grade</span><strong>{result.gradeSaatIni} <ArrowRight size={16} /> {result.gradeBaru}</strong></div><div><TrendingUp size={22} /><span>Comparatio</span><strong>{formatPercent(result.comparatio)}</strong></div><div><BadgeCheck size={22} /><span>Kenaikan matriks</span><strong>{formatPercent(result.persenMatriks)}</strong></div></div>
                    <h3 className="section-heading">Perbandingan Komponen</h3><div className="comparison"><table><thead><tr><th>Komponen</th><th>Saat ini</th><th>Setelah kenaikan</th><th>Selisih</th></tr></thead><tbody><tr><td>Gaji Pokok</td><td>{formatRupiah(result.gajiSaatIni)}</td><td>{formatRupiah(result.gajiBaru)}</td><td>+{formatRupiah((result.gajiBaru)-(result.gajiSaatIni))}</td></tr><tr><td>Tunjangan Posisi</td><td>{formatRupiah(result.tunjanganSaatIni)}</td><td>{formatRupiah(result.tunjanganBaru)}</td><td>+{formatRupiah((result.tunjanganBaru)-(result.tunjanganSaatIni))}</td></tr><tr className="total-row"><td>Total dua komponen</td><td>{formatRupiah(result.totalSaatIni)}</td><td>{formatRupiah(result.totalBaru)}</td><td>+{formatRupiah(result.selisihTotal)}</td></tr></tbody></table></div>
                    {result.rating === 'PR5' && <div className="notice muted"><Info size={18} />PR5 memiliki kenaikan matriks 0%, tetapi penyesuaian ke minimum grade baru tetap berlaku.</div>}
                    <details className="details" onToggle={e => setDetailExpanded(e.currentTarget.open)}>
                        <summary>
                            <span style={{display:'flex',flexDirection:'column',gap:3,flex:1,minWidth:0}}>
                                <strong>Lihat Detail Perhitungan Lengkap</strong>
                                <span style={{fontSize:12,fontWeight:400,opacity:0.75}}>Rincian comparatio, persentase matriks, dan penyesuaian rentang</span>
                            </span>
                            <span style={{fontSize:12,fontWeight:600,marginLeft:'auto'}}>{detailExpanded ? 'Sembunyikan' : 'Lihat Detail'}</span>
                            <ChevronDown size={18} style={{transform:detailExpanded?'rotate(180deg)':undefined,transition:'transform 150ms'}} />
                        </summary>
                        <div className="details-inner">
                            <div style={{display:'flex',alignItems:'center',gap:10,margin:'12px 0',fontWeight:700}}><span style={{background:'#005BAC',color:'#fff',borderRadius:8,padding:'5px 11px'}}>1</span><span>Perhitungan Comparatio &amp; Penentuan Kelompok</span></div>
                            <DetailRow label="Gaji Pokok Saat Ini" value={formatRupiah(result.gajiSaatIni)} />
                            <DetailRow label={`Midpoint Grade Saat Ini (${result.gradeSaatIni})`} value={formatRupiah(result.midpointSaatIni)} />
                            <DetailRow label="Rumus Comparatio" value="(Gaji Pokok ÷ Midpoint) × 100%" />
                            <div style={{padding:'8px 12px',background:'#F0F7FF',borderRadius:8}}><DetailRow label="Hasil Comparatio" value={formatPercent(result.comparatio)} /><DetailRow label="Kelompok Comparatio" value={result.bucketLabel} /></div>

                            <div style={{display:'flex',alignItems:'center',gap:10,margin:'20px 0 12px',fontWeight:700}}><span style={{background:'#005BAC',color:'#fff',borderRadius:8,padding:'5px 11px'}}>2</span><span>Kenaikan Berdasarkan Matriks ({result.rating})</span></div>
                            <DetailRow label="Performance Rating" value={result.rating} />
                            <DetailRow label="Persentase Kenaikan Matriks" value={formatPercent(result.persenMatriks)} />
                            <DetailRow label="Nominal Kenaikan Matriks" value={formatRupiah(result.kenaikanMatriks)} />
                            <div style={{padding:'8px 12px',background:'#F0F7FF',borderRadius:8}}><DetailRow label="Gaji Sebelum Penyesuaian Rentang" value={formatRupiah(result.gajiSebelumPenyesuaian)} /></div>

                            <div style={{display:'flex',alignItems:'center',gap:10,margin:'20px 0 12px',fontWeight:700}}><span style={{background:'#005BAC',color:'#fff',borderRadius:8,padding:'5px 11px'}}>3</span><span>Penyesuaian Rentang Grade Baru ({result.gradeBaru})</span></div>
                            <DetailRow label={`Minimum Grade ${result.gradeBaru}`} value={formatRupiah(gradeInfo(result.gradeBaru).minimum)} />
                            <DetailRow label={`Maksimum Grade ${result.gradeBaru}`} value={formatRupiah(gradeInfo(result.gradeBaru).maximum)} />
                            <div style={{marginTop:10,padding:'10px 12px',background:'#F8FAFC',borderRadius:8}}><div style={{fontWeight:700,marginBottom:4}}>Status Penyesuaian:</div><div className="notice success"><CircleCheck size={18} />{result.gajiSebelumPenyesuaian === result.gajiBaru ? 'Gaji pokok sesuai hasil perhitungan.' : result.alasan}</div></div>
                            <div style={{padding:'8px 12px',marginTop:8,background:'#F0F7FF',borderRadius:8}}><DetailRow label="Gaji Pokok Baru Final" value={formatRupiah(result.gajiBaru)} /></div>

                            <div style={{display:'flex',alignItems:'center',gap:10,margin:'20px 0 12px',fontWeight:700}}><span style={{background:'#005BAC',color:'#fff',borderRadius:8,padding:'5px 11px'}}>4</span><span>Ringkasan Selisih &amp; Kenaikan Efektif</span></div>
                            <DetailRow label="Selisih Gaji Pokok" value={`+${formatRupiah(result.selisihGaji)}`} />
                            <DetailRow label="Kenaikan Gaji Pokok Efektif" value={formatPercent(result.persenEfektif)} />
                            <DetailRow label="Selisih Tunjangan Posisi" value={`+${formatRupiah(result.selisihTunjangan)}`} />
                            <div style={{padding:'8px 12px',background:'#F0F7FF',borderRadius:8}}><DetailRow label="Total Selisih (Gaji + Tunjangan)" value={`+${formatRupiah(result.selisihTotal)} (${formatPercent(result.persenTotal)})`} /></div>
                        </div>
                        <div className="disclaimer"><Info size={19} /><p><strong>Catatan:</strong> Hasil simulasi bersifat estimasi dan bukan keputusan kenaikan gaji. Perhitungan berdasarkan Range Gaji Pokok, Tunjangan Posisi dan Comparatio sesuai PT 3-B1 Tentang Fasilitas dan Satuan Nilai.</p></div>
                    </details>
                </> : <div className="empty-state" aria-live="polite"><div className="empty-icon"><Calculator size={39} /></div><h3>{dirty ? 'Simulasi perlu diperbarui' : 'Belum ada hasil simulasi'}</h3><p>{dirty ? 'Data berubah. Klik Hitung Simulasi untuk memperbarui hasil.' : 'Lengkapi data Anda untuk melihat estimasi kenaikan gaji.'}</p><div className="placeholder-bars"><span /><span /><span /></div></div>}
                
            </div></section></div><footer>created by Febrianto & Amrullah</footer></div></main>
}
