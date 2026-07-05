$ftpHost = "ftpupload.net"
$ftpUser = "if0_42168126"
$ftpPass = "FpQLnmHHGj"

$request = [System.Net.FtpWebRequest]::Create("ftp://$ftpHost/kselectrical.in/htdocs/backend")
$request.Method = [System.Net.WebRequestMethods+Ftp]::ListDirectoryDetails
$request.Credentials = New-Object System.Net.NetworkCredential($ftpUser, $ftpPass)
$request.UsePassive = $true

try {
    $response = $request.GetResponse()
    $reader = New-Object System.IO.StreamReader($response.GetResponseStream())
    $output = $reader.ReadToEnd()
    $reader.Close()
    $response.Close()
    Write-Host "Remote Backend Directory Listing:"
    Write-Host $output
} catch {
    Write-Error "FTP Error: $_"
}
