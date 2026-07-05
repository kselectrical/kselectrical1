$ftpHost = "ftpupload.net"
$ftpUser = "if0_42168126"
$ftpPass = "FpQLnmHHGj"

$webClient = New-Object System.Net.WebClient
$webClient.Credentials = New-Object System.Net.NetworkCredential($ftpUser, $ftpPass)

# Create local files
Set-Content -Path "c:\Users\A\OneDrive\Desktop\ks-2.0\backend\test.html" -Value "HTML WORKED"
Set-Content -Path "c:\Users\A\OneDrive\Desktop\ks-2.0\backend\test.php" -Value "<?php echo 'PHP WORKED'; ?>"

# Upload test.html
try {
    $uriHtml = New-Object System.Uri("ftp://$ftpHost/kselectrical.in/htdocs/backend/test.html")
    $webClient.UploadFile($uriHtml, "STOR", "c:\Users\A\OneDrive\Desktop\ks-2.0\backend\test.html")
    Write-Host "Uploaded test.html successfully"
} catch {
    Write-Error "Failed to upload test.html: $_"
}

# Upload test.php
try {
    $uriPhp = New-Object System.Uri("ftp://$ftpHost/kselectrical.in/htdocs/backend/test.php")
    $webClient.UploadFile($uriPhp, "STOR", "c:\Users\A\OneDrive\Desktop\ks-2.0\backend\test.php")
    Write-Host "Uploaded test.php successfully"
} catch {
    Write-Error "Failed to upload test.php: $_"
}
