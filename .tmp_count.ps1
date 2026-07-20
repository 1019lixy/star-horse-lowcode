$c = Get-Content 'e:\lixycode\shplugin\src\components\office\panels\SlideEditor.vue'
$inStyle = $false
$opens = 0
$closes = 0
$startLine = 0
for ($i = 0; $i -lt $c.Length; $i++) {
    $line = $c[$i]
    if ($line -match '<style') {
        $inStyle = $true
        $startLine = $i + 1
    }
    if ($inStyle) {
        $opens += ([regex]::Matches($line, '\{')).Count
        $closes += ([regex]::Matches($line, '\}')).Count
        if ($line -match '</style>') {
            Write-Host "Style block: lines $startLine to $($i+1). Opens: $opens, Closes: $closes"
            break
        }
    }
}
