$ftpHost = "ftpupload.net"
$ftpUser = "if0_42168126"
$ftpPass = "FpQLnmHHGj"
$localDir = "c:\Users\A\OneDrive\Desktop\ks-2.0\backend"

function Upload-DirectoryToFTP($localPath, $remotePath) {
    $webClient = New-Object System.Net.WebClient
    $webClient.Credentials = New-Object System.Net.NetworkCredential($ftpUser, $ftpPass)

    $items = Get-ChildItem $localPath -Force
    foreach ($item in $items) {
        if ($item.Name -eq ".git" -or $item.Name -eq "_old_backup" -or $item.Name -like "*.zip" -or $item.Name -eq "upload_php_billing.ps1") {
            continue
        }
        
        $localFile = $item.FullName
        $remoteFile = "ftp://$ftpHost/$remotePath/$($item.Name)"

        if ($item.PSIsContainer) {
            $createDirUrl = "ftp://$ftpHost/$remotePath/$($item.Name)"
            $request = [System.Net.FtpWebRequest]::Create($createDirUrl)
            $request.Method = [System.Net.WebRequestMethods+Ftp]::MakeDirectory
            $request.Credentials = New-Object System.Net.NetworkCredential($ftpUser, $ftpPass)
            try {
                $response = $request.GetResponse()
                Write-Host "Directory $remotePath/$($item.Name) created."
                $response.Close()
            } catch {
                # Already exists
            }
            Upload-DirectoryToFTP $localFile "$remotePath/$($item.Name)"
        } else {
            Write-Host "Uploading $localFile to $remoteFile..."
            try {
                $uri = New-Object System.Uri($remoteFile)
                $webClient.UploadFile($uri, "STOR", $localFile)
                Write-Host "Uploaded $($item.Name) successfully!"
            } catch {
                $err = $_
                Write-Error "Failed to upload $($item.Name) - $err"
            }
        }
    }
}

# Upload PHP files to kselectrical.in/htdocs/backend
# Create the backend directory first
$request = [System.Net.FtpWebRequest]::Create("ftp://$ftpHost/kselectrical.in/htdocs/backend")
$request.Method = [System.Net.WebRequestMethods+Ftp]::MakeDirectory
$request.Credentials = New-Object System.Net.NetworkCredential($ftpUser, $ftpPass)
try {
    $response = $request.GetResponse()
    $response.Close()
} catch {}

Upload-DirectoryToFTP $localDir "kselectrical.in/htdocs/backend"
