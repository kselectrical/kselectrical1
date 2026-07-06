# PowerShell script to process, compress and link new AI-generated images
Add-Type -AssemblyName System.Drawing

$artifactsDir = "C:\Users\A\.gemini\antigravity\brain\bc5292e4-a761-40b6-9e34-deccb1da8b50"
$publicDir = "c:\Users\A\OneDrive\Desktop\ks-2.0\frontend\public"
$dataFile = "c:\Users\A\OneDrive\Desktop\ks-2.0\frontend\src\data.ts"

# Map prefixes to target SEO names
$imageMappings = @{
    "ac_gas_refill" = "ac-gas-refill-greater-noida.jpg"
    "ac_uninstallation" = "ac-uninstallation-greater-noida.jpg"
    "bldc_fan_install" = "bldc-fan-installation-gaur-city.jpg"
    "chandelier_install" = "chandelier-installation-noida-extension.jpg"
    "ro_purifier_install" = "ro-purifier-installation-greater-noida.jpg"
    "washing_machine_clean" = "washing-machine-tub-deep-clean-greater-noida.jpg"
    "geyser_install" = "geyser-installation-noida-extension.jpg"
    "refrigerator_gas" = "refrigerator-gas-charging-greater-noida.jpg"
    "microwave_clean" = "microwave-deep-clean-greater-noida.jpg"
    "chimney_install" = "kitchen-chimney-installation-gaur-city.jpg"
    "doorbell_repair" = "doorbell-repair-greater-noida.jpg"
    "inverter_service" = "inverter-battery-service-greater-noida.jpg"
}

# Service ID to image file path mappings in data.ts
$dataMappings = @{
    "ac-gas-refill" = "/ac-gas-refill-greater-noida.jpg"
    "ac-uninstallation" = "/ac-uninstallation-greater-noida.jpg"
    "fan-bldc-install" = "/bldc-fan-installation-gaur-city.jpg"
    "light-chandelier-install" = "/chandelier-installation-noida-extension.jpg"
    "app-ro-install" = "/ro-purifier-installation-greater-noida.jpg"
    "app-washing-service" = "/washing-machine-tub-deep-clean-greater-noida.jpg"
    "app-geyser-install" = "/geyser-installation-noida-extension.jpg"
    "app-fridge-gas-single" = "/refrigerator-gas-charging-greater-noida.jpg"
    "app-fridge-gas-double" = "/refrigerator-gas-charging-greater-noida.jpg"
    "app-microwave-service" = "/microwave-deep-clean-greater-noida.jpg"
    "app-chimney-install" = "/kitchen-chimney-installation-gaur-city.jpg"
    "elec-doorbell" = "/doorbell-repair-greater-noida.jpg"
    "elec-inverter" = "/inverter-battery-service-greater-noida.jpg"
}

# Helper function to save image as JPEG with specific quality
function Save-AsJpeg($image, $outputPath, $quality) {
    $encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.FormatID -eq [System.Drawing.Imaging.ImageFormat]::Jpeg.Guid }
    $encoderParameters = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $encoderParameters.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, $quality)
    $image.Save($outputPath, $encoder, $encoderParameters)
    $image.Dispose()
}

# Helper function to resize image safely
function Resize-Image($image, $maxSize) {
    $origWidth = $image.Width
    $origHeight = $image.Height
    
    if ($origWidth -le $maxSize -and $origHeight -le $maxSize) {
        return $image # No resizing needed
    }
    
    $ratio = $origWidth / $origHeight
    if ($ratio -gt 1) {
        $newWidth = [int]$maxSize
        $newHeight = [int][math]::Round($maxSize / $ratio)
    } else {
        $newHeight = [int]$maxSize
        $newWidth = [int][math]::Round($maxSize * $ratio)
    }
    
    if ($newWidth -lt 1) { $newWidth = 1 }
    if ($newHeight -lt 1) { $newHeight = 1 }
    
    $newBitmap = New-Object System.Drawing.Bitmap($newWidth, $newHeight)
    $graph = [System.Drawing.Graphics]::FromImage($newBitmap)
    $graph.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graph.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graph.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graph.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    
    $graph.DrawImage($image, 0, 0, $newWidth, $newHeight)
    $graph.Dispose()
    $image.Dispose()
    
    return $newBitmap
}

Write-Host "Searching for newly generated images in artifacts..."

$processedCount = 0

foreach ($prefix in $imageMappings.Keys) {
    $targetName = $imageMappings[$prefix]
    $targetPath = Join-Path $publicDir $targetName
    
    # Find the most recently modified file in artifacts matching prefix*_*.png
    $files = Get-ChildItem -Path $artifactsDir -Filter "${prefix}_*.png" | Sort-Object LastWriteTime -Descending
    
    if ($files.Count -eq 0) {
        Write-Host "No generated image found for prefix: $prefix" -ForegroundColor Yellow
        continue
    }
    
    $sourceFile = $files[0]
    Write-Host "Found source image: $($sourceFile.Name) (Size: $([math]::Round($sourceFile.Length/1kb, 2)) KB)"
    
    try {
        # Load, resize and compress
        $img = [System.Drawing.Image]::FromFile($sourceFile.FullName)
        $resizedImg = Resize-Image $img 600
        Save-AsJpeg $resizedImg $targetPath 75
        
        $newSize = (Get-Item $targetPath).Length
        $processedCount++
        
        Write-Host "  Compressed and saved to public/$targetName ($([math]::Round($newSize/1kb, 2)) KB)" -ForegroundColor Green
    } catch {
        Write-Host "  Error processing $($sourceFile.Name): $_" -ForegroundColor Red
    }
}

# Update src/data.ts to map the unique images to their respective services
if ($processedCount -gt 0) {
    Write-Host "`nUpdating service image mappings in $dataFile..."
    $dataContent = Get-Content $dataFile -Raw
    
    # We will replace the specific imageUrl for each service
    # Since data.ts has objects like:
    # id: 'ac-gas-refill',
    # ...
    # imageUrl: '/ac-repair-greater-noida.jpg',
    #
    # We can match the block of the service id and replace its imageUrl value
    foreach ($svcId in $dataMappings.Keys) {
        $newImgUrl = $dataMappings[$svcId]
        
        # Regex to find the service block and replace its imageUrl
        # We find the id field, and then match the imageUrl: '...' that follows it
        # before the next service or closing bracket
        $pattern = "(id:\s*'$svcId'[\s\S]*?imageUrl:\s*')[^']+'"
        $replacement = "${1}${newImgUrl}'"
        
        if ($dataContent -match $pattern) {
            $dataContent = [regex]::Replace($dataContent, $pattern, $replacement)
            Write-Host "  Mapped service '$svcId' -> '$newImgUrl'" -ForegroundColor Green
        } else {
            Write-Host "  Could not find service block for '$svcId' in data.ts" -ForegroundColor Yellow
        }
    }
    
    $dataContent | Out-File $dataFile -Encoding utf8 -Force
    Write-Host "References updated in data.ts."
} else {
    Write-Host "No images were processed."
}
