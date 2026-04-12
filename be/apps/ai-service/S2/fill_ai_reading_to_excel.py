from pathlib import Path
import json
import shutil
import subprocess
import tempfile
import xml.etree.ElementTree as ET
import zipfile

EXCEL_PATH = Path(r"D:\yolo_paddle_realtime\Danh_gia_AI_filled_v2.xlsx")
BACKUP_PATH = EXCEL_PATH.with_name(EXCEL_PATH.stem + "_backup.xlsx")
IMAGE_DIR = Path(r"D:\giáo trình đại học fpt\Dataset SEP490\WaterMeters\images")
API_URL = "http://127.0.0.1:8002/predict"

NS = {"x": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
ET.register_namespace("", NS["x"])

def get_cell_text(cell):
    inline = cell.find("x:is", NS)
    if inline is not None:
        text_node = inline.find("x:t", NS)
        return text_node.text if text_node is not None and text_node.text is not None else ""
    value_node = cell.find("x:v", NS)
    return value_node.text if value_node is not None and value_node.text is not None else ""

def ensure_cell(row, cell_ref):
    for cell in row.findall("x:c", NS):
        if cell.attrib.get("r") == cell_ref:
            return cell
    return ET.SubElement(row, f"{{{NS['x']}}}c", {"r": cell_ref})

def set_inline_text(cell, cell_ref, text):
    style = cell.attrib.get("s")
    cell.attrib.clear()
    cell.attrib["r"] = cell_ref
    cell.attrib["t"] = "inlineStr"
    if style is not None:
        cell.attrib["s"] = style
    for child in list(cell):
        cell.remove(child)
    is_node = ET.SubElement(cell, f"{{{NS['x']}}}is")
    t_node = ET.SubElement(is_node, f"{{{NS['x']}}}t")
    t_node.text = text

def fetch_reading(image_path):
    try:
        result = subprocess.run(
            [
                "curl.exe",
                "-s",
                "-X",
                "POST",
                API_URL,
                "-F",
                f"file=@{str(image_path)}",
            ],
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            timeout=120,
            check=False,
        )
    except Exception:
        return "LOI_API"

    if result.returncode != 0 or not result.stdout.strip():
        return "LOI_API"

    try:
        payload = json.loads(result.stdout)
    except Exception:
        return "LOI_API"

    for item in payload.get("results", []):
        if item.get("label") == "Current_pointer_reading_region":
            return str(item.get("text", "") or "")

    return ""

if not EXCEL_PATH.exists():
    raise FileNotFoundError(f"Khong tim thay file Excel: {EXCEL_PATH}")

if not BACKUP_PATH.exists():
    shutil.copy2(EXCEL_PATH, BACKUP_PATH)

with tempfile.TemporaryDirectory(dir=str(EXCEL_PATH.parent)) as tmpdir:
    tmpdir = Path(tmpdir)

    with zipfile.ZipFile(EXCEL_PATH, "r") as zin:
        zin.extractall(tmpdir)

    sheet_path = tmpdir / "xl" / "worksheets" / "sheet1.xml"
    tree = ET.parse(sheet_path)
    root = tree.getroot()
    sheet_data = root.find("x:sheetData", NS)

    processed = 0

    for row in sheet_data.findall("x:row", NS):
        row_index = int(row.attrib.get("r", "0"))
        if row_index < 2:
            continue

        a_ref = f"A{row_index}"
        d_ref = f"D{row_index}"

        a_cell = None
        for cell in row.findall("x:c", NS):
            if cell.attrib.get("r") == a_ref:
                a_cell = cell
                break

        if a_cell is None:
            continue

        image_name = get_cell_text(a_cell).strip()
        if not image_name:
            continue

        image_path = IMAGE_DIR / image_name
        if not image_path.exists():
            reading_text = "KHONG_TIM_THAY_ANH"
        else:
            reading_text = fetch_reading(image_path)

        d_cell = ensure_cell(row, d_ref)
        set_inline_text(d_cell, d_ref, reading_text)

        processed += 1
        if processed % 20 == 0:
            print(f"Da xu ly {processed} dong")

    workbook_path = tmpdir / "xl" / "workbook.xml"
    if workbook_path.exists():
        wb_tree = ET.parse(workbook_path)
        wb_root = wb_tree.getroot()
        calc_pr = wb_root.find("x:calcPr", NS)
        if calc_pr is None:
            calc_pr = ET.SubElement(wb_root, f"{{{NS['x']}}}calcPr")
        calc_pr.set("calcMode", "auto")
        calc_pr.set("fullCalcOnLoad", "1")
        calc_pr.set("forceFullCalc", "1")
        wb_tree.write(workbook_path, encoding="utf-8", xml_declaration=True)

    tree.write(sheet_path, encoding="utf-8", xml_declaration=True)

    temp_xlsx = EXCEL_PATH.with_name(EXCEL_PATH.stem + "_updated.xlsx")
    if temp_xlsx.exists():
        temp_xlsx.unlink()

    with zipfile.ZipFile(temp_xlsx, "w", zipfile.ZIP_DEFLATED) as zout:
        for path in tmpdir.rglob("*"):
            if path.is_file():
                zout.write(path, path.relative_to(tmpdir).as_posix())

    shutil.move(str(temp_xlsx), str(EXCEL_PATH))

print(f"Hoan tat. Da cap nhat cot D trong: {EXCEL_PATH}")
print(f"Backup: {BACKUP_PATH}")
