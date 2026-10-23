$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$products = Get-Content -LiteralPath (Join-Path $projectRoot 'src/data/extra-products.json') -Raw | ConvertFrom-Json
$headers = @{ 'User-Agent' = 'FishitDemo/1.0 (https://github.com/Nadzirin26/Fishit)' }
$titles = ($products.wikiTitle -join '|')
$uri = 'https://en.wikipedia.org/w/api.php?action=query&format=json&redirects=1&prop=pageimages&piprop=original%7Cthumbnail&pithumbsize=640&titles=' + [uri]::EscapeDataString($titles)
$response = Invoke-RestMethod -Uri $uri -Headers $headers -TimeoutSec 40
$pages = $response.query.pages.PSObject.Properties.Value
$credits = [ordered]@{}
$creditLines = [System.Collections.Generic.List[string]]::new()
$creditLines.Add('# Kredit foto katalog tambahan')
$creditLines.Add('')
$creditLines.Add('Foto berasal dari Wikimedia Commons dan disimpan lokal dalam ukuran thumbnail. Kredit dan lisensi juga ditampilkan pada detail masing-masing produk. Harga, ukuran penjualan, stok, dan identitas toko merupakan data demo.')
$creditLines.Add('')
function ConvertTo-PlainText([string]$value) {
  return [System.Net.WebUtility]::HtmlDecode(($value -replace '<[^>]+>', '')).Trim()
}
foreach ($product in $products) {
  $title = $product.wikiTitle
  $redirect = $response.query.redirects | Where-Object { $_.from -eq $title }
  if ($redirect) { $title = $redirect.to }
  $page = $pages | Where-Object { $_.title -eq $title } | Select-Object -First 1
  if (-not $page.original.source) { throw ('No image found for ' + $product.wikiTitle) }
  $original = [uri]$page.original.source
  $filename = [uri]::UnescapeDataString(($original.AbsolutePath -split '/')[-1])
  $fileTitle = 'File:' + $filename
  $commonsUri = 'https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=extmetadata%7Curl&titles=' + [uri]::EscapeDataString($fileTitle)
  $commons = Invoke-RestMethod -Uri $commonsUri -Headers $headers -TimeoutSec 40
  $info = ($commons.query.pages.PSObject.Properties.Value | Select-Object -First 1).imageinfo[0]
  $meta = $info.extmetadata
  if (-not $meta.LicenseShortName.value) { throw ('Missing license for ' + $fileTitle) }
  $source = $info.descriptionurl
  $author = ConvertTo-PlainText $meta.Artist.value
  $license = ConvertTo-PlainText $meta.LicenseShortName.value
  $licenseUrl = $meta.LicenseUrl.value
  if (-not $licenseUrl) { $licenseUrl = $source }
  $thumbnail = ($page.thumbnail.source -split '\?')[0]
  $extension = [IO.Path]::GetExtension($filename).ToLowerInvariant()
  if ($extension -notin @('.jpg', '.jpeg', '.png', '.webp')) { throw ('Unsupported image format: ' + $extension) }
  $localPath = '/images/fish-' + $product.id + $extension
  Invoke-WebRequest -Uri $thumbnail -Headers $headers -OutFile (Join-Path $projectRoot ('public' + $localPath)) -TimeoutSec 40
  $credits[$product.id] = [ordered]@{ image = $localPath; author = $author; license = $license; licenseUrl = $licenseUrl; source = $source }
  $creditLines.Add('- **' + $product.name + '** — ' + $author + '. [' + $license + '](' + $licenseUrl + '). [Berkas sumber](' + $source + ').')
  Write-Output ($product.id + ': ' + $product.name + ' [' + $license + ']')
}
$credits | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath (Join-Path $projectRoot 'src/data/image-credits.json') -Encoding utf8
$creditLines | Set-Content -LiteralPath (Join-Path $projectRoot 'docs/IMAGE_CREDITS.md') -Encoding utf8
