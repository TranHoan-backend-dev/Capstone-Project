param(
    [string]$InputDir = "D:\yolo_paddle_realtime\batch_results",
    [string]$OutputCsv = "D:\yolo_paddle_realtime\test_1244_images_results_stable.csv"
)

$ErrorActionPreference = "Stop"

$files = Get-ChildItem -LiteralPath $InputDir -Filter "test_1244_batch_*.csv" |
    Sort-Object Name

if (-not $files -or $files.Count -eq 0) {
    throw "Khong tim thay file batch CSV nao trong $InputDir"
}

$rows = foreach ($file in $files) {
    Import-Csv $file.FullName
}

$rows = $rows |
    Sort-Object image_name -Unique

$rows | Export-Csv -Path $OutputCsv -NoTypeInformation -Encoding UTF8

$correct = ($rows | Where-Object { $_.ket_qua_chi_so -eq "Dung" }).Count
$wrong = ($rows | Where-Object { $_.ket_qua_chi_so -eq "Sai" }).Count
$empty = ($rows | Where-Object { [string]::IsNullOrWhiteSpace($_.chi_so_AI) }).Count
$apiErr = ($rows | Where-Object { $_.status -eq "LOI_API" }).Count
$emptyResp = ($rows | Where-Object { $_.status -eq "EMPTY_RESPONSE" }).Count

Write-Host "Da gop xong vao: $OutputCsv"
Write-Host "Tong anh: $($rows.Count)"
Write-Host "Dung: $correct"
Write-Host "Sai: $wrong"
Write-Host "Empty reading: $empty"
Write-Host "LOI_API: $apiErr"
Write-Host "EMPTY_RESPONSE: $emptyResp"
