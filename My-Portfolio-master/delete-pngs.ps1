$pngs = Get-ChildItem -Path . -Filter '*.png' -File
Write-Output "Found $($pngs.Count) PNG files"
if ($pngs.Count -gt 0) {
  foreach ($p in $pngs) {
    Write-Output "Deleting: $($p.FullName)"
    Remove-Item -LiteralPath $p.FullName -Force
  }
} else {
  Write-Output "No PNG files found"
}
$webpCount = (Get-ChildItem -Path . -Filter '*.webp' -File).Count
Write-Output "WebP files count: $webpCount"
