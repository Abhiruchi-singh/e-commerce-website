$dir = Join-Path $PSScriptRoot "..\..\client\public\products"
New-Item -ItemType Directory -Force -Path $dir | Out-Null

$images = @{
  "premium-cotton-tshirt" = "https://images.pexels.com/photos/6311392/pexels-photo-6311392.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop"
  "classic-denim-jacket" = "https://images.pexels.com/photos/1124468/pexels-photo-1124468.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop"
  "running-sneakers-pro" = "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop"
  "leather-crossbody-bag" = "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop"
  "wireless-bluetooth-earbuds" = "https://images.pexels.com/photos/3825517/pexels-photo-3825517.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop"
  "smart-fitness-watch" = "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop"
  "slim-fit-chinos" = "https://images.pexels.com/photos/1478442/pexels-photo-1478442.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop"
  "polarized-sunglasses" = "https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop"
  "wool-blend-sweater" = "https://images.pexels.com/photos/6311477/pexels-photo-6311477.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop"
  "canvas-sneakers" = "https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop"
  "stainless-steel-water-bottle" = "https://images.pexels.com/photos/416528/pexels-photo-416528.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop"
  "portable-bluetooth-speaker" = "https://images.pexels.com/photos/3465067/pexels-photo-3465067.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop"
  "iphone-15-pro-max-case" = "https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop"
  "gaming-mechanical-keyboard" = "https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop"
  "4k-smart-tv-43" = "https://images.pexels.com/photos/8442374/pexels-photo-8442374.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop"
  "wireless-charging-pad" = "https://images.pexels.com/photos/7889463/pexels-photo-7889463.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop"
  "laptop-stand-aluminum" = "https://images.pexels.com/photos/3912949/pexels-photo-3912949.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop"
  "usb-c-hub-7in1" = "https://images.pexels.com/photos/7978053/pexels-photo-7978053.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop"
  "over-ear-headphones" = "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop"
  "tablet-10-android" = "https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop"
  "formal-white-shirt" = "https://images.pexels.com/photos/1431293/pexels-photo-1431293.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop"
  "floral-summer-dress" = "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop"
  "mens-leather-belt" = "https://images.pexels.com/photos/1693598/pexels-photo-1693598.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop"
  "hooded-sweatshirt" = "https://images.pexels.com/photos/6311387/pexels-photo-6311387.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop"
  "womens-palazzo-pants" = "https://images.pexels.com/photos/1485951/pexels-photo-1485951.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop"
  "checked-casual-shirt" = "https://images.pexels.com/photos/7691091/pexels-photo-7691091.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop"
  "sports-track-pants" = "https://images.pexels.com/photos/8619857/pexels-photo-8619857.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop"
  "silk-saree-premium" = "https://images.pexels.com/photos/1192609/pexels-photo-1192609.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop"
  "leather-formal-shoes" = "https://images.pexels.com/photos/292999/pexels-photo-292999.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop"
  "womens-heels-stiletto" = "https://images.pexels.com/photos/336372/pexels-photo-336372.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop"
  "smart-led-desk-lamp" = "https://images.pexels.com/photos/6775261/pexels-photo-6775261.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop"
  "power-bank-20000mah" = "https://images.pexels.com/photos/7869116/pexels-photo-7869116.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop"
  "cotton-kurta-set" = "https://images.pexels.com/photos/12469210/pexels-photo-12469210.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop"
}

$ok = 0
foreach ($slug in $images.Keys) {
  $out = Join-Path $dir "$slug.jpg"
  try {
    Invoke-WebRequest -Uri $images[$slug] -OutFile $out -UseBasicParsing
    $ok++
    Write-Host "OK $slug"
  } catch {
    Write-Host "FAIL $slug"
  }
}
Write-Host "Downloaded $ok / $($images.Count) images to $dir"
