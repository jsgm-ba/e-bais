"""Genera content/experiencia.json, content/mmp.json y content/red_expertos.json desde los maestros de B&A.

Uso:
  python3 -I scripts/importar_experiencia.py <MAESTRO_EXPERIENCIA.xlsx> <MAESTRO_AUDITORES.xlsx> <Torre-Control-Maestro.xlsx>

Los xlsx NO se suben al repo: el de auditores trae cédulas, celulares y correos (Ley 1581).
De auditores solo se extraen conteos agregados por norma; nunca nombres.
"""
import collections
import json
import re
import sys
import unicodedata
from pathlib import Path

import openpyxl

RAIZ = Path(__file__).resolve().parent.parent
EXP, AUD, TORRE = (Path(p) for p in sys.argv[1:4])
F_RUP = "Maestro de Experiencia B&A + MMP, hoja BA_Experiencia_Depurada (21-ago-2026), basada en el RUP de B&A"
F_MMP = "Maestro de Experiencia B&A + MMP, hoja MMP_Experiencia (21-ago-2026), con certificaciones de las entidades"
F_AUD = "Maestro de Auditores y Expertos, hoja Resumen_EVA_Anonimizado (21-ago-2026); datos en verificación"
NORMAS = {"9001": "ISO 9001", "14001": "ISO 14001", "18001": "OHSAS 18001 / ISO 45001", "45001": "OHSAS 18001 / ISO 45001", "27001": "ISO/IEC 27001", "19011": "ISO 19011", "17025": "ISO/IEC 17025", "22000": "ISO 22000", "50001": "ISO 50001", "37001": "ISO 37001", "31000": "ISO 31000"}
F_TORRE = "Torre de Control Maestro de Licitaciones (27-oct-2026)"


def norm(s):
    return unicodedata.normalize("NFKD", str(s or "")).encode("ascii", "ignore").decode().lower().strip()


def tipo_entidad(e):
    n = norm(e)
    reglas = [
        ("Órganos de control", ["contraloria", "personeria", "veeduria", "procuraduria"]),
        ("Educación", ["universidad", "colegio mayor", "esap", "escuela"]),
        ("Corporaciones autónomas regionales", ["corporacion autonoma", "corpo", "cormagdalena", "corporinoquia", "corpocesar"]),
        ("Entidades territoriales", ["alcaldia", "municipio", "gobernacion", "departamento de policia", "distrito", "fondo de desarrollo local", "secretaria"]),
        ("Empresas de servicios públicos y transporte", ["aguas", "alcantarillado", "saneamiento", "transporte", "empresa publica"]),
        ("Cooperación internacional y ESAL", ["usaid", "migraciones", "fundacion", "asociacion", "organizacion internacional"]),
        ("Entidades del orden nacional", ["ministerio", "departamento administrativo", "superintendencia", "unidad administrativa", "agencia", "fondo", "comision", "consejo", "comando", "archivo general", "instituto", "junta central", "unidad nacional"]),
    ]
    for etiqueta, claves in reglas:
        if any(c in n for c in claves):
            return etiqueta
    return "Sector privado"


def servicio(s):
    n = norm(s)
    if "capacit" in n or "formacion" in n:
        return "Capacitación"
    if "audit" in n:
        return "Auditoría"
    if "consult" in n or "asesor" in n:
        return "Consultoría"
    return "Otros servicios"


def anio(v):
    return int(v) if isinstance(v, (int, float)) and v > 1900 else None


def main():
    wb = openpyxl.load_workbook(EXP, data_only=True)

    # ---------- Experiencia B&A ----------
    filas_x = list(wb["BA_Experiencia_Depurada"].iter_rows(values_only=True))
    enc = {str(h).strip(): i for i, h in enumerate(filas_x[0]) if h}
    g = lambda r, k: r[enc[k]] if k in enc else None
    contratos = []
    for r in filas_x[1:]:
        if g(r, "ID (No. RUP)") is None or not g(r, "Entidad"):
            continue
        verificado = str(g(r, "Semaforo_Documentos") or "").upper().startswith(("AMARILLO", "VERDE"))
        id_rup = int(g(r, "ID (No. RUP)"))
        contratos.append({
            "id_rup": id_rup,
            "entidad": re.sub(r"\s+", " ", str(g(r, "Entidad"))).strip().title(),
            "tipo_entidad": tipo_entidad(g(r, "Entidad")),
            "objeto": re.sub(r"\s+", " ", str(g(r, "Objeto") or "")).strip()[:280] or "SIN DATO",
            "anio": anio(g(r, "Año")),
            "valor_cop": int(g(r, "VALOR EN COP")) if isinstance(g(r, "VALOR EN COP"), (int, float)) else None,
            "servicio": servicio(r[14] if len(r) > 14 else ""),
            "normas": re.sub(r"\s+", " ", str(g(r, "Detalle (temáticas, normas número y versión, especifidades)*") or "")).strip()[:160] or None,
            "soporte": f"RUP de B&A, ID {id_rup}" + (" · certificación de la entidad verificada" if verificado else " · soporte en verificación"),
            "secop_url": None,
            "permiso_ref": f"Contrato estatal inscrito en el registro público RUP de B&A (ID {id_rup})",
            "publicable": verificado,
            "fuentes": [F_RUP],
        })
    anios = [c["anio"] for c in contratos if c["anio"]]
    resumen = {
        "contratos": len(contratos),
        "verificados": sum(c["publicable"] for c in contratos),
        "entidades": len({norm(c["entidad"])[:30] for c in contratos}),
        "desde": min(anios), "hasta": max(anios),
        "por_servicio": dict(collections.Counter(c["servicio"] for c in contratos).most_common()),
        "por_tipo_entidad": dict(collections.Counter(c["tipo_entidad"] for c in contratos).most_common()),
        "fuentes": [F_RUP],
        "nota": f"[[PENDIENTE: el RUP reporta 65 contratos y este maestro {len(contratos)}; {sum(c['publicable'] for c in contratos)} tienen soporte verificado (fase 2). El valor total no se publica hasta depurar duplicados]]",
    }

    # ---------- Trayectoria MMP ----------
    filas_m = list(wb["MMP_Experiencia"].iter_rows(values_only=True))
    em = {str(h).strip(): i for i, h in enumerate(filas_m[0]) if h}
    tem_k = next(k for k in em if k.startswith("Temática"))
    hitos = []
    for r in filas_m[1:]:
        if not any(r) or not r[em["Contratante"]]:
            continue
        fi, ff = r[em["Fecha de inicio dd/mm/aaaa"]], r[em["Fecha terminación dd/mm/aaaa"]]
        hitos.append({
            "entidad": re.sub(r"\s*\(.*?\)", "", str(r[em["Contratante"]])).strip(),
            "vinculo": "Planta" if norm(r[em["TIPO DE VINCULACIÓN (LABORAL O PRESTACIÓN DE SERVICIOS)"]]) == "planta" else "Prestación de servicios",
            "desde": fi.year if hasattr(fi, "year") else None,
            "hasta": ff.year if hasattr(ff, "year") else None,
            "tematica": re.sub(r"\s+", " ", str(r[em[tem_k]] or "")).strip()[:140] or None,
        })
    # Agrupa por entidad y conserva el rango de años
    por_ent = collections.OrderedDict()
    for h in hitos:
        k = norm(h["entidad"])[:28]
        if k not in por_ent:
            por_ent[k] = dict(h)
        else:
            p = por_ent[k]
            p["desde"] = min(x for x in [p["desde"], h["desde"]] if x) if (p["desde"] or h["desde"]) else None
            p["hasta"] = max(x for x in [p["hasta"], h["hasta"]] if x) if (p["hasta"] or h["hasta"]) else None
    linea = sorted((h for h in por_ent.values() if h["desde"]), key=lambda h: h["desde"])
    for h in linea:
        h["entidad"] = h["entidad"].replace("Bdo Audit sa", "BDO Audit S.A.").replace("  ", " ")
    inicio = min(h["desde"] for h in linea if h["desde"])
    mmp = {
        "_estado": {"publicacion": "borrador", "aprobado_por": None, "fuentes": [F_MMP]},
        "nombre": "Marisol Muñoz Peralta",
        "rol": "Directora técnica de B&A",
        "inicio_carrera": inicio,
        "resumen_carrera": {
            "texto": f"En el control público desde {inicio}: primero en la Contraloría General de la República y la Contraloría de Bogotá, después como consultora y auditora de entidades del orden nacional, territorial y de cooperación internacional.",
            "fuentes": [F_MMP],
        },
        "hitos": linea,
        "fuentes": [F_MMP],
        "nota": "[[PENDIENTE: MMP confirma cargos y fechas; faltan fechas de Tauramena, ANDJE, Agua Fresquita, Coingesarco y Envigado]]",
    }

    # ---------- Red de expertos (solo conteos) ----------
    wa = openpyxl.load_workbook(AUD, read_only=True, data_only=True)
    ra = [r for r in wa["Resumen_EVA_Anonimizado"].iter_rows(values_only=True)]
    i_enc = next(i for i, r in enumerate(ra) if r and r[0] == "ID")
    cols = {str(h): i for i, h in enumerate(ra[i_enc]) if h}
    k_normas = next(k for k in cols if k.startswith("Normas ISO"))
    k_niv = next(k for k in cols if k.startswith("Nivel"))
    personas = [r for r in ra[i_enc + 1:] if r and r[cols["ID"]] is not None]
    normas = collections.Counter()
    for r in personas:
        for n in re.split(r"[;,|]", str(r[cols[k_normas]] or "")):
            n = n.strip()
            m = re.search(r"\b(\d{4,5})\b", n)
            if m and m.group(1) in NORMAS:
                normas[NORMAS[m.group(1)]] += 1
    niveles = collections.Counter(str(r[cols[k_niv]] or "SIN DATO") for r in personas)
    lideres = [r for r in wa["Auditores_Lideres_IAF"].iter_rows(values_only=True)]
    n_lideres = sum(1 for r in lideres if r and isinstance(r[0], (int, float)))
    red = {
        "_estado": {"publicacion": "borrador", "aprobado_por": None, "fuentes": [F_AUD]},
        "profesionales": len(personas),
        "auditores_lideres_iaf": n_lideres,
        "por_norma": dict(normas.most_common(12)),
        "fuentes": [F_AUD],
        "nota": "[[PENDIENTE: los perfiles están en semáforo AMARILLO (sin verificar); ningún nombre se publica sin permiso escrito]]",
    }

    # ---------- Demanda (Torre de Control) ----------
    wt = openpyxl.load_workbook(TORRE, data_only=True)
    sem = [r for r in wt["SEMÁFORO 2026-2"].iter_rows(values_only=True)]
    hist = [r for r in wt["HISTÓRICO"].iter_rows(values_only=True)][1:]
    demanda = {
        "procesos_historico": sum(1 for r in hist if any(r)),
        "procesos_semaforo": sum(1 for r in sem[1:] if any(r)),
        "fuentes": [F_TORRE],
    }

    exp = {"_estado": {"publicacion": "borrador", "aprobado_por": None, "fuentes": [F_RUP]}, "resumen": resumen, "demanda": demanda, "filas": contratos}
    salida = RAIZ / "content"
    for nombre, datos in [("experiencia.json", exp), ("mmp.json", mmp), ("red_expertos.json", red)]:
        (salida / nombre).write_text(json.dumps(datos, ensure_ascii=False, indent=1) + "\n", "utf-8")
    print(f"{len(contratos)} contratos ({resumen['verificados']} verificados) · {len(linea)} hitos de MMP desde {inicio} · {len(personas)} expertos · {demanda}")


if __name__ == "__main__":
    main()
