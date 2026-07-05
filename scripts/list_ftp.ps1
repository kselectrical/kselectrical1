$ftpHost = "ftpupload.net"
$ftpUser = "if0_42168126"
$ftpPass = "FpQLnmHHGj"

$request = [System.Net.FtpWebRequest]::Create("ftp://$ftpHost/kselectrical.in/htdocs")
$request.Method = [System.Net.WebRequestMethods+Ftp]::ListDirectoryDetails
$request.Credentials = New-Object System.Net.NetworkCredential($ftpUser, $ftpPass)
$request.UsePassive = $true

try {
    $response = $request.GetResponse()
    $reader = New-Object System.IO.StreamReader($response.GetResponseStream())
    $output = $reader.ReadToEnd()
    Write-Host "FTP Directory Listing:"
    Write-Host $output
    $reader.Close()
    $response.Close()
} catch {
    Write-Error "FTP Error: $_"
}
