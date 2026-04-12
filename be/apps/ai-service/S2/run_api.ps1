param(
    [string]$BindHost = "127.0.0.1",
    [int]$Port = 8000,
    [switch]$SkipInstall
)

$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$primaryVenvPython = Join-Path $repoRoot ".venv\Scripts\python.exe"
$runtimeVenvDir = Join-Path $repoRoot ".venv_runtime"
$runtimeVenvPython = Join-Path $runtimeVenvDir "Scripts\python.exe"

function Test-PythonExe {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Path
    )

    if (-not (Test-Path -LiteralPath $Path)) {
        return $false
    }

    try {
        & $Path --version *> $null
        return $LASTEXITCODE -eq 0
    } catch {
        return $false
    }
}

function Get-SystemPython {
    $candidates = @(
        @{ Command = "py"; Args = @("-3.10", "-c", "import sys; print(sys.executable)") },
        @{ Command = "py"; Args = @("-3", "-c", "import sys; print(sys.executable)") },
        @{ Command = "py"; Args = @("-c", "import sys; print(sys.executable)") },
        @{ Command = "python"; Args = @("-c", "import sys; print(sys.executable)") }
    )

    foreach ($candidate in $candidates) {
        if (-not (Get-Command $candidate.Command -ErrorAction SilentlyContinue)) {
            continue
        }

        try {
            $output = & $candidate.Command @($candidate.Args) 2>$null
            if ($LASTEXITCODE -eq 0 -and $output) {
                return $output[-1].Trim()
            }
        } catch {
            continue
        }
    }

    return $null
}

function Test-Dependencies {
    param(
        [Parameter(Mandatory = $true)]
        [string]$PythonExe
    )

    try {
        & $PythonExe -c "import fastapi, uvicorn, cv2, torch, paddleocr" *> $null
        return $LASTEXITCODE -eq 0
    } catch {
        return $false
    }
}

function Ensure-RuntimeVenv {
    $systemPython = Get-SystemPython
    if (-not $systemPython) {
        throw "Khong tim thay Python 3 tren may. Hay cai Python 3.10 roi chay lai script."
    }

    if (-not (Test-Path -LiteralPath $runtimeVenvDir)) {
        Write-Host "Tao moi virtualenv tai $runtimeVenvDir"
        & $systemPython -m venv $runtimeVenvDir
        if ($LASTEXITCODE -ne 0) {
            throw "Khong tao duoc virtualenv moi."
        }
    }

    if (-not (Test-PythonExe -Path $runtimeVenvPython)) {
        throw "Virtualenv runtime da duoc tao nhung Python ben trong khong chay duoc."
    }

    return $runtimeVenvPython
}

function Install-Dependencies {
    param(
        [Parameter(Mandatory = $true)]
        [string]$PythonExe
    )

    Write-Host "Dang cai dependencies tu requirements.txt"
    & $PythonExe -m pip install --upgrade pip
    if ($LASTEXITCODE -ne 0) {
        throw "Cap nhat pip that bai."
    }

    & $PythonExe -m pip install -r (Join-Path $repoRoot "requirements.txt")
    if ($LASTEXITCODE -ne 0) {
        throw "Cai dependencies that bai."
    }
}

$pythonExe = $null
if (Test-PythonExe -Path $primaryVenvPython) {
    $pythonExe = $primaryVenvPython
} elseif (Test-PythonExe -Path $runtimeVenvPython) {
    $pythonExe = $runtimeVenvPython
} else {
    $pythonExe = Ensure-RuntimeVenv
}

if (-not $SkipInstall -and -not (Test-Dependencies -PythonExe $pythonExe)) {
    Install-Dependencies -PythonExe $pythonExe
}

Push-Location $repoRoot
try {
    Write-Host "AI service se chay tai http://$BindHost`:$Port"
    Write-Host "Swagger: http://$BindHost`:$Port/docs"
    & $pythonExe -m uvicorn app.api:app --host $BindHost --port $Port
} finally {
    Pop-Location
}
