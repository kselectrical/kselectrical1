$ftpHost = "ftpupload.net"
$ftpUser = "if0_42168126"
$ftpPass = "FpQLnmHHGj"
$localDir = "c:\Users\A\OneDrive\Desktop\ks-2.0\backend"

# Function to recursively upload files to FTP, skipping certain folders
function Upload-DirectoryToFTP($localPath, $remotePath) {
    $webClient = New-Object System.Net.WebClient
    $webClient.Credentials = New-Object System.Net.NetworkCredential($ftpUser, $ftpPass)

    $items = Get-ChildItem $localPath
    foreach ($item in $items) {
        # Skip git, backup folders, zip files, and the script itself
        if ($item.Name -eq ".git" -or $item.Name -eq "_old_backup" -or $item.Name -like "*.zip" -or $item.Name -eq "upload_php_billing.ps1") {
            continue
        }
        
        $localFile = $item.FullName
        $remoteFile = "ftp://$ftpHost/$remotePath/$($item.Name)"

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
            # It's a file, upload it
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

# Upload PHP files
Upload-DirectoryToFTP $localDir "billing.kselectrical.in/htdocs"
