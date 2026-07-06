# PowerShell script to compress and optimize images for KS Electrical website
Add-Type -AssemblyName System.Drawing

$publicDir = "c:\Users\A\OneDrive\Desktop\ks-2.0\frontend\public"
$dataFile = "c:\Users\A\OneDrive\Desktop\ks-2.0\frontend\src\data.ts"

Write-Host "Scanning for large PNG images in $publicDir..."
$pngFiles = Get-ChildItem -Path $publicDir -Filter "*.png"

$totalOriginalSize = 0
$totalNewSize = 0
$optimizedCount = 0

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
    
    # Ensure dimensions are at least 1px
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

# Create a mapping of old png name to new jpg name
$replacementMap = @{}

foreach ($file in $pngFiles) {
    # Skip small images like favicon or logo
    if ($file.Length -lt 20kb -or $file.Name -eq "favicon.png" -or $file.Name -eq "log.png") {
        Write-Host "Skipping small or special file: $($file.Name)"
        continue
    }
    
    $originalSize = $file.Length
    $totalOriginalSize += $originalSize
    
    $oldName = $file.Name
    $newName = $file.BaseName + ".jpg"
    $newPath = Join-Path $publicDir $newName
    
    Write-Host "Optimizing $oldName..."
    
    try {
        # Load image
        $img = [System.Drawing.Image]::FromFile($file.FullName)
        
        # Resize to max 600px
        $resizedImg = Resize-Image $img 600
        
        # Save as JPEG with 75% quality
        Save-AsJpeg $resizedImg $newPath 75
        
        # Verify new file size
        $newSize = (Get-Item $newPath).Length
        $totalNewSize += $newSize
        $optimizedCount++
        
        # Add to replacement map
        $replacementMap[$oldName] = $newName
        
        # Delete original PNG
        Remove-Item $file.FullName -Force
        
        $savedKb = [math]::Round(($originalSize - $newSize) / 1kb, 2)
        $savedPct = [math]::Round((($originalSize - $newSize) / $originalSize) * 100, 2)
        Write-Host "  Compressed successfully! Saved ${savedKb}KB (${savedPct}%)"
    } catch {
        Write-Host "  Error optimizing $($file.Name): $_" -ForegroundColor Red
    }
}

if ($optimizedCount -gt 0) {
    Write-Host "`nUpdating references in $dataFile..."
    $dataContent = Get-Content $dataFile -Raw
    
    foreach ($oldName in $replacementMap.Keys) {
        $newName = $replacementMap[$oldName]
        # Replace occurrences like '/ac-repair-greater-noida.png' with '/ac-repair-greater-noida.jpg'
        $dataContent = $dataContent.Replace("/$oldName", "/$newName")
    }
    
    $dataContent | Out-File $dataFile -Encoding utf8 -Force
    Write-Host "References updated in data.ts."
    
    $totalSavedKb = [math]::Round(($totalOriginalSize - $totalNewSize) / 1kb, 2)
    $totalSavedMb = [math]::Round(($totalOriginalSize - $totalNewSize) / 1mb, 2)
    $overallPct = [math]::Round((($totalOriginalSize - $totalNewSize) / $totalOriginalSize) * 100, 2)
    
    Write-Host "`n=========================================="
    Write-Host "IMAGE OPTIMIZATION COMPLETE!"
    Write-Host "Optimized Files: $optimizedCount"
    Write-Host "Original Size: $([math]::Round($totalOriginalSize / 1mb, 2)) MB"
    Write-Host "New Size: $([math]::Round($totalNewSize / 1mb, 2)) MB"
    Write-Host "Total Space Saved: ${totalSavedMb} MB (${overallPct}%)"
    Write-Host "=========================================="
} else {
    Write-Host "No images were optimized."
}
