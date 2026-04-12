param(
    [Parameter(Mandatory = $true)]
    [string]$ImageDir,
    [string]$ApiUrl = "http://127.0.0.1:8002/predict",
    [string]$OutputDir = "D:\yolo_paddle_realtime\batch_results",
    [int]$BatchSize = 200,
    [Parameter(Mandatory = $true)]
    [int]$BatchIndex
)

$ErrorActionPreference = "Stop"

function Get-ExpectedReading {
    param([string]$BaseName)

    if ($BaseName -match "value_(\d+)_") {
        return $matches[1]
    }

    return ""
}

function Invoke-Predict {
    param(
        [string]$ImagePath,
        [string]$Endpoint
    )

    $reading = ""
    $serial = ""
    $status = "OK"

    for ($attempt = 1; $attempt -le 3; $attempt++) {
        try {
            $responseText = curl.exe -s --max-time 120 -X POST $Endpoint -F "file=@$ImagePath"

            if ([string]::IsNullOrWhiteSpace($responseText)) {
                $status = "EMPTY_RESPONSE"
                Start-Sleep -Milliseconds 1200
                continue
            }

            $json = $responseText | ConvertFrom-Json

            $readingItem = $json.results |
                Where-Object { $_.label -eq "Current_pointer_reading_region" } |
                Select-Object -First 1

            $serialItem = $json.results |
                Where-Object { $_.label -eq "Serial_number_region" } |
                Select-Object -First 1

            if ($readingItem) { $reading = [string]$readingItem.text }
            if ($serialItem) { $serial = [string]$serialItem.text }

            return [pscustomobject]@{
                reading = $reading
                serial = $serial
                status = "OK"
            }
        }
        catch {
            $status = "LOI_API"
            Start-Sleep -Milliseconds 1200
        }
    }

    return [pscustomobject]@{
        reading = $reading
        serial = $serial
        status = $status
    }
}

if (-not (Test-Path -LiteralPath $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
}

$allImages = Get-ChildItem -LiteralPath $ImageDir -File |
    Where-Object { $_.Extension -match '^\.(jpg|jpeg|png|bmp|webp)$' } |
    Sort-Object Name

$start = ($BatchIndex - 1) * $BatchSize
$batch = $allImages | Select-Object -Skip $start -First $BatchSize

if ($batch.Count -eq 0) {
    Write-Host "Khong co anh nao trong lo $BatchIndex."
    exit 0
}

$outCsv = Join-Path $OutputDir ("test_1244_batch_{0:D2}.csv" -f $BatchIndex)
if (Test-Path -LiteralPath $outCsv) {
    Remove-Item -LiteralPath $outCsv -Force
}

Write-Host "Tong anh:" $allImages.Count
Write-Host "Dang chay lo:" $BatchIndex
Write-Host "So anh trong lo:" $batch.Count
Write-Host "Tu anh thu:" ($start + 1)
Write-Host "File ket qua:" $outCsv
Write-Host ""

$rows = for ($i = 0; $i -lt $batch.Count; $i++) {
    $img = $batch[$i]
    $result = Invoke-Predict -ImagePath $img.FullName -Endpoint $ApiUrl
    $expectedReading = Get-ExpectedReading -BaseName $img.BaseName

    $readingNorm = $result.reading -replace '^0+(?=\d)', ''
    $readingMatch = ""
    if ($expectedReading) {
        if ($readingNorm -eq $expectedReading) {
            $readingMatch = "Dung"
        }
        else {
            $readingMatch = "Sai"
        }
    }

    Write-Host ("[{0}/{1}] {2} -> {3}" -f ($i + 1), $batch.Count, $img.Name, $result.status)

    Start-Sleep -Milliseconds 500

    [pscustomobject]@{
        image_name     = $img.Name
        chi_so_dung    = $expectedReading
        chi_so_AI      = $result.reading
        ket_qua_chi_so = $readingMatch
        serial_AI      = $result.serial
        status         = $result.status
    }
}

$rows | Export-Csv -Path $outCsv -NoTypeInformation -Encoding UTF8

Write-Host ""
Write-Host "Xong lo $BatchIndex"
Write-Host "File ket qua: $outCsv"
