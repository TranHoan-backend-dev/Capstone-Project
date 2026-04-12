param(
    [string]$OutputPath = "E:\AI_Predict_Example.docx"
)

$workspaceRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$tempRoot = Join-Path $workspaceRoot ("tmp_docx_" + [guid]::NewGuid().ToString())

New-Item -ItemType Directory -Path $tempRoot -Force | Out-Null
New-Item -ItemType Directory -Path (Join-Path $tempRoot "_rels") -Force | Out-Null
New-Item -ItemType Directory -Path (Join-Path $tempRoot "word") -Force | Out-Null

$contentTypes = @'
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>
'@
Set-Content -LiteralPath (Join-Path $tempRoot "[Content_Types].xml") -Value $contentTypes -Encoding UTF8

$rels = @'
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>
'@
Set-Content -LiteralPath (Join-Path $tempRoot "_rels\.rels") -Value $rels -Encoding UTF8

function New-DocParagraph {
    param(
        [string]$Text,
        [bool]$Bold = $false
    )

    $escaped = [System.Security.SecurityElement]::Escape($Text)
    if ($null -eq $escaped) {
        $escaped = ""
    }

    if ($Bold) {
        return '<w:p><w:r><w:rPr><w:b/></w:rPr><w:t xml:space="preserve">' + $escaped + '</w:t></w:r></w:p>'
    }

    return '<w:p><w:r><w:t xml:space="preserve">' + $escaped + '</w:t></w:r></w:p>'
}

$paragraphs = @(
    (New-DocParagraph -Text "AI Service Predict Example" -Bold $true),
    (New-DocParagraph -Text ""),
    (New-DocParagraph -Text "1. Muc dich" -Bold $true),
    (New-DocParagraph -Text "Tai lieu nay dung de giup backend dev chay local AI service, goi thu endpoint /predict va hieu response tra ve."),
    (New-DocParagraph -Text ""),
    (New-DocParagraph -Text "2. Chay local AI service" -Bold $true),
    (New-DocParagraph -Text "Di chuyen vao thu muc ai-service va chay:"),
    (New-DocParagraph -Text ".\.venv\Scripts\python.exe -m uvicorn app.api:app --host 127.0.0.1 --port 8000"),
    (New-DocParagraph -Text ""),
    (New-DocParagraph -Text "Sau khi service len, mo cac duong dan sau:"),
    (New-DocParagraph -Text "http://127.0.0.1:8000/"),
    (New-DocParagraph -Text "http://127.0.0.1:8000/docs"),
    (New-DocParagraph -Text "http://127.0.0.1:8000/health"),
    (New-DocParagraph -Text ""),
    (New-DocParagraph -Text "3. Thu nghiem endpoint /predict" -Bold $true),
    (New-DocParagraph -Text "Co the thu bang Swagger tai /docs hoac dung curl:"),
    (New-DocParagraph -Text 'curl.exe -X POST "http://127.0.0.1:8000/predict" ^'),
    (New-DocParagraph -Text '  -H "accept: application/json" ^'),
    (New-DocParagraph -Text '  -F "file=@test.jpg;type=image/jpeg"'),
    (New-DocParagraph -Text ""),
    (New-DocParagraph -Text "4. Response mau" -Bold $true),
    (New-DocParagraph -Text "{"),
    (New-DocParagraph -Text '  "filename": "test.jpg",'),
    (New-DocParagraph -Text '  "results": ['),
    (New-DocParagraph -Text '    {'),
    (New-DocParagraph -Text '      "box": [179, 328, 808, 948],'),
    (New-DocParagraph -Text '      "label": "meter",'),
    (New-DocParagraph -Text '      "text": "",'),
    (New-DocParagraph -Text '      "conf": 0.9744331240653992,'),
    (New-DocParagraph -Text '      "raw_texts": []'),
    (New-DocParagraph -Text '    },'),
    (New-DocParagraph -Text '    {'),
    (New-DocParagraph -Text '      "box": [306, 379, 672, 481],'),
    (New-DocParagraph -Text '      "label": "Serial_number_region",'),
    (New-DocParagraph -Text '      "text": "217858315",'),
    (New-DocParagraph -Text '      "yolo_conf": 0.8412966132164001,'),
    (New-DocParagraph -Text '      "ocr_conf": 0.996,'),
    (New-DocParagraph -Text '      "heuristic": 0.75,'),
    (New-DocParagraph -Text '      "final_conf": 0.902,'),
    (New-DocParagraph -Text '      "raw_texts": [["217858315", 0.9964125156402588]]'),
    (New-DocParagraph -Text '    },'),
    (New-DocParagraph -Text '    {'),
    (New-DocParagraph -Text '      "box": [272, 492, 684, 565],'),
    (New-DocParagraph -Text '      "label": "Current_pointer_reading_region",'),
    (New-DocParagraph -Text '      "text": "0008879",'),
    (New-DocParagraph -Text '      "yolo_conf": 0.6725512146949768,'),
    (New-DocParagraph -Text '      "ocr_conf": 0.96,'),
    (New-DocParagraph -Text '      "heuristic": 0.75,'),
    (New-DocParagraph -Text '      "final_conf": 0.81,'),
    (New-DocParagraph -Text '      "raw_texts": [["0008879", 0.9597879648208618]]'),
    (New-DocParagraph -Text '    }'),
    (New-DocParagraph -Text '  ]'),
    (New-DocParagraph -Text '}'),
    (New-DocParagraph -Text ""),
    (New-DocParagraph -Text "5. Cach backend nen doc response" -Bold $true),
    (New-DocParagraph -Text "Khong nen doc theo vi tri trong mang results. Can tim theo field label:"),
    (New-DocParagraph -Text '- Neu label = "Serial_number_region" thi text la so serial.'),
    (New-DocParagraph -Text '- Neu label = "Current_pointer_reading_region" thi text la chi so dong ho.'),
    (New-DocParagraph -Text "- final_conf la do tin cay cuoi cung cho ket qua OCR."),
    (New-DocParagraph -Text ""),
    (New-DocParagraph -Text "6. Loi co the gap" -Bold $true),
    (New-DocParagraph -Text "- 400 Bad Request: file rong hoac khong decode duoc thanh anh."),
    (New-DocParagraph -Text "- 422 Unprocessable Entity: request sai multipart/form-data hoac thieu field file."),
    (New-DocParagraph -Text "- 500 Internal Server Error: loi model, dependency hoac runtime."),
    (New-DocParagraph -Text ""),
    (New-DocParagraph -Text "7. Ghi chu tich hop Spring Boot" -Bold $true),
    (New-DocParagraph -Text "Base URL vi du: ai.service.base-url=http://127.0.0.1:8000"),
    (New-DocParagraph -Text "Spring Boot nhan MultipartFile, forward sang POST /predict, nhan JSON va lay text theo label.")
)

$documentXml = @'
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas"
            xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
            xmlns:o="urn:schemas-microsoft-com:office:office"
            xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
            xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math"
            xmlns:v="urn:schemas-microsoft-com:vml"
            xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing"
            xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"
            xmlns:w10="urn:schemas-microsoft-com:office:word"
            xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
            xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml"
            xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup"
            xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk"
            xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml"
            xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape"
            mc:Ignorable="w14 wp14">
  <w:body>
__BODY__
    <w:sectPr>
      <w:pgSz w:w="12240" w:h="15840"/>
      <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="708" w:footer="708" w:gutter="0"/>
    </w:sectPr>
  </w:body>
</w:document>
'@

$documentXml = $documentXml.Replace("__BODY__", ($paragraphs -join ""))
Set-Content -LiteralPath (Join-Path $tempRoot "word\document.xml") -Value $documentXml -Encoding UTF8

Add-Type -AssemblyName System.IO.Compression.FileSystem
$zipPath = [System.IO.Path]::ChangeExtension($OutputPath, ".zip")

if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
}

if (Test-Path $OutputPath) {
    Remove-Item $OutputPath -Force
}

[System.IO.Compression.ZipFile]::CreateFromDirectory($tempRoot, $zipPath)
Move-Item $zipPath $OutputPath -Force
Remove-Item $tempRoot -Recurse -Force

Get-Item $OutputPath | Select-Object FullName, Length, LastWriteTime
