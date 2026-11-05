"""Convierte el Catálogo Maestro 1B (xlsx) en content/catalogo.json y content/paquetes.json.

Uso:  python3 -I scripts/importar_catalogo.py [ruta.xlsx]
Lo determinista va en código: este script es la única vía para actualizar esos JSON.
"""
import json
import re
import sys
import unicodedata
from pathlib import Path

import openpyxl

RAIZ = Path(__file__).resolve().parent.parent
XLSX = Path(sys.argv[1]) if len(sys.argv) > 1 else RAIZ / "data" / "Catalogo_Maestro_1B_BA_EVA_051126.xlsx"
VERSION = "Catálogo Maestro 1B, versión 05-nov-2026"

COLUMNAS = {
    "ID": "id", "Cliente macro": "cliente", "Familia": "familia",
    "Problema (en palabras del cliente)": "problema", "Disparador o señal de demanda": "disparador",
    "Fuente": "fuente", "Nombre comercial": "nombre", "Resultado prometido": "resultado",
    "Lo que se lleva": "entregable", "Activo de MMP que productiza": "activo_mmp",
    "Capa IA (JSGM)": "capa_ia", "Norma o política": "norma", "Eje PIC": "eje_pic",
    "Público": "publico", "Formato": "formato", "Intensidad (h)": "intensidad_h",
    "Docente": "docente", "Régimen D1": "regimen", "Clave de precio": "clave_precio",
    "Precio individual «desde» [SUPUESTO]": "precio_desde",
    "Institucional bajo (h × tarifa)": "institucional_bajo",
    "Institucional alto (h × tarifa)": "institucional_alto",
    "Costo por participante (alto, 40 personas)": "costo_participante_40",
    "Escalón": "escalon", "Upsell": "upsell", "Gancho para redes": "gancho",
    "Palabra clave SEO": "seo", "Estado": "estado",
}
DOCENTES = {"Expertos asociados": "Experto aliado", "—": None, "": None}


def slug(texto: str) -> str:
    t = unicodedata.normalize("NFKD", texto).encode("ascii", "ignore").decode().lower()
    t = re.sub(r"[^a-z0-9]+", "-", t).strip("-")
    return t[:70].rstrip("-")


def numero(valor):
    return int(round(valor)) if isinstance(valor, (int, float)) else None


def texto(valor):
    if valor is None:
        return None
    s = str(valor).strip()
    return s or None


def main() -> None:
    wb = openpyxl.load_workbook(XLSX, data_only=True)
    filas = list(wb["Catalogo"].iter_rows(values_only=True))
    enc = [COLUMNAS.get(str(h).strip()) for h in filas[0]]
    productos, vistos = [], set()
    for fila in filas[1:]:
        if not fila or fila[0] is None:
            continue
        r = {k: v for k, v in zip(enc, fila) if k}
        precio = r.get("precio_desde")
        if isinstance(precio, (int, float)):
            modo = "gratis" if precio == 0 else "desde"
        elif precio and "Paquete" in str(precio):
            modo = "paquete"
        else:
            modo = "cotiza"
        s = slug(r["nombre"])
        if s in vistos:
            s = f"{s}-{r['id'].lower()}"
        vistos.add(s)
        fuentes = [f.strip() for f in str(r.get("fuente") or "").split(";") if f.strip()]
        productos.append({
            "id": r["id"], "slug": s, "cliente": r["cliente"], "familia": texto(r.get("familia")),
            "problema": texto(r["problema"]), "disparador": texto(r.get("disparador")),
            "nombre": texto(r["nombre"]), "resultado": texto(r.get("resultado")),
            "entregable": texto(r.get("entregable")), "activo_mmp": texto(r.get("activo_mmp")),
            "capa_ia": texto(r.get("capa_ia")), "norma": texto(r.get("norma")),
            "eje_pic": texto(r.get("eje_pic")), "publico": texto(r.get("publico")),
            "formato": r["formato"], "intensidad_h": numero(r.get("intensidad_h")),
            "docente": DOCENTES.get(texto(r.get("docente")) or "", texto(r.get("docente"))),
            "regimen": r["regimen"], "aval_fb_ref": None,
            "precio": {
                "modo": modo, "clave": texto(r.get("clave_precio")),
                "desde_cop": numero(precio), "institucional_bajo_cop": numero(r.get("institucional_bajo")),
                "institucional_alto_cop": numero(r.get("institucional_alto")),
                "supuesto": True, "aprobado_mmp": False,
            },
            "escalon": r["escalon"], "upsell": texto(r.get("upsell")),
            "gancho": texto(r.get("gancho")), "seo": texto(r.get("seo")),
            "estado": r["estado"],
            "publicacion": "borrador", "aprobado_por": None,
            "fuentes": fuentes + [VERSION],
        })

    paquetes = []
    filas = list(wb["Paquetes"].iter_rows(values_only=True))
    for fila in filas[1:]:
        if not fila or fila[0] is None:
            continue
        pid, nombre, cliente, comp, resuelve, desde, alto = fila[:7]
        paquetes.append({
            "id": pid, "slug": slug(nombre), "nombre": nombre, "cliente": cliente,
            "componentes": [c.strip() for c in str(comp).split("+")],
            "resuelve": resuelve,
            "precio": {"desde_cop": numero(desde), "institucional_alto_cop": numero(alto),
                       "supuesto": True, "aprobado_mmp": False},
            "publicacion": "borrador", "aprobado_por": None, "fuentes": [VERSION],
        })

    salida = RAIZ / "content"
    (salida / "catalogo.json").write_text(json.dumps(productos, ensure_ascii=False, indent=1) + "\n", "utf-8")
    (salida / "paquetes.json").write_text(json.dumps(paquetes, ensure_ascii=False, indent=1) + "\n", "utf-8")
    print(f"{len(productos)} productos y {len(paquetes)} paquetes escritos en content/")


if __name__ == "__main__":
    main()
