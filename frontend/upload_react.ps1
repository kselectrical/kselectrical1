$ftpHost = "ftpupload.net"
$ftpUser = "if0_42168126"
$ftpPass = "FpQLnmHHGj"
$localDir = "c:\Users\A\OneDrive\Desktop\ks-2.0\frontend\dist"
$cacheFile = "c:\Users\A\OneDrive\Desktop\ks-2.0\frontend\.last_uploaded.json"

# Load cache
$cache = @{}
if (Test-Path $cacheFile) {
    try {
        $jsonObj = Get-Content $cacheFile -Raw | ConvertFrom-Json
        foreach ($prop in $jsonObj.PSObject.Properties) {
            $cache[$prop.Name] = $prop.Value
        }
        Write-Host "Loaded upload cache with $($cache.Count) files."
    } catch {
        Write-Host "Could not load cache, starting fresh."
    }
}

$webClient = New-Object System.Net.WebClient
$webClient.Credentials = New-Object System.Net.NetworkCredential($ftpUser, $ftpPass)

function Upload-DirectoryToFTP($localPath, $remotePath) {
    $items = Get-ChildItem $localPath -Force
    foreach ($item in $items) {
        $localFile = $item.FullName
        $remoteFile = "ftp://$ftpHost/$remotePath/$($item.Name)"

        # Calculate relative path
        $relativePath = $localFile.Substring($localDir.Length + 1).Replace("\", "/")

        if ($item.PSIsContainer) {
            # It's a directory, create it first
            $createDirUrl = "ftp://$ftpHost/$remotePath/$($item.Name)"
            $request = [System.Net.FtpWebRequest]::Create($createDirUrl)
            $request.Method = [System.Net.WebRequestMethods+Ftp]::MakeDirectory
            $request.Credentials = New-Object System.Net.NetworkCredential($ftpUser, $ftpPass)
            try {
                $response = $request.GetResponse()
                Write-Host "Directory $remotePath/$($item.Name) created."
                $response.Close()
            } catch {
                # Already exists or error
            }
            # Recursively upload contents
            Upload-DirectoryToFTP $localFile "$remotePath/$($item.Name)"
        } else {
            # It's a file, compute MD5 hash as signature
            $fileSignature = (Get-FileHash -Algorithm MD5 $localFile).Hash

            if ($cache.ContainsKey($relativePath) -and $cache[$relativePath] -eq $fileSignature) {
                Write-Host "Skipping $relativePath (unchanged)"
                continue
            }

            Write-Host "Uploading $localFile to $remoteFile..."
            
            # Retry mechanism (up to 3 times) for robust upload
            $success = $false
            $retryCount = 0
            while (-not $success -and $retryCount -lt 3) {
                try {
                    $uri = New-Object System.Uri($remoteFile)
                    $webClient.UploadFile($uri, "STOR", $localFile)
                    Write-Host "Uploaded $($item.Name) successfully!"
                    $success = $true
                    
                    # Update cache and save immediately
                    $cache[$relativePath] = $fileSignature
                    $cache | ConvertTo-Json -Depth 100 | Out-File $cacheFile -Encoding utf8
                } catch {
                    $retryCount++
                    $err = $_.Exception.Message
                    Write-Host "Attempt $retryCount failed for $($item.Name) - $err"
                    if ($retryCount -lt 3) {
                        Start-Sleep -Seconds 2
                    } else {
                        Write-Error "Failed to upload $($item.Name) after 3 attempts."
                    }
                }
            }
        }
    }
}

Upload-DirectoryToFTP $localDir "kselectrical.in/htdocs"
