import { describe, expect, it } from 'vitest';
import { filasAProcesos, aNumero, aFechaISO } from '@/lib/sheets';
import { aSemaforo } from '@/lib/semaforo';
import { cop, plazo, fecha } from '@/lib/formato';

describe('Sheets Maestro → procesos', () => {
  it('mapea encabezados por alias, con tildes y mayúsculas', () => {
    const f = filasAProcesos([
      ['Código Proceso', 'Entidad', 'Objeto', 'Presupuesto', 'Fecha de cierre', 'SEMÁFORO', 'URL SECOP'],
      ['CO1.REQ.123', 'Alcaldía X', 'Auditoría', '$ 48.200.000', '12/11/2026 14:00', 'VIABLE', 'https://x'],
      ['', '', '', '', '', '', ''],
      ['CO1.REQ.124', 'ESE Y', 'Capacitación', 36500000, '', 'No ir', ''],
    ]);
    expect(f).toHaveLength(2);
    expect(f[0]).toMatchObject({ codigo: 'CO1.REQ.123', valor: 48200000, cierre: '2026-11-12T14:00:00-05:00', estado: 'viable', url: 'https://x' });
    expect(f[1]).toMatchObject({ valor: 36500000, cierre: null, estado: 'noir' });
  });
  it('convierte números y fechas en formato es-CO', () => {
    expect(aNumero('1.234.567,89')).toBe(1234568);
    expect(aNumero('')).toBeNull();
    expect(aFechaISO('5/1/2027')).toBe('2027-01-05T23:59:00-05:00');
  });
  it('normaliza el semáforo', () => {
    expect(aSemaforo('Verde')).toBe('viable');
    expect(aSemaforo('ámbar')).toBe('revisar');
    expect(aSemaforo('NO IR')).toBe('noir');
    expect(aSemaforo('???')).toBeNull();
  });
});

describe('formato es-CO', () => {
  it('moneda, fecha y plazo', () => {
    expect(cop(48200000)).toBe('$ 48.200.000');
    expect(cop(null)).toBe('SIN DATO');
    expect(fecha('2026-10-30T15:00:00-05:00')).toBe('30 oct. 2026');
    expect(plazo('2026-11-08T14:00:00-05:00', new Date('2026-11-05T09:00:00-05:00'))).toBe('D-3 · 14:00');
  });
});
