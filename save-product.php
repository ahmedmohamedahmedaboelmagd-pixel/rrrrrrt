<?php
// حفظ منتج جديد في ملف products.json
header('Content-Type: application/json; charset=utf-8');

// استقبال البيانات من POST
$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$category = isset($_POST['category']) ? trim($_POST['category']) : '';
$price = isset($_POST['price']) ? floatval($_POST['price']) : 0;
$image = isset($_POST['image']) ? trim($_POST['image']) : '';
$desc = isset($_POST['desc']) ? trim($_POST['desc']) : '';

if (!$name || !$category || !$image || !$desc || $price < 0) {
    echo json_encode(['success' => false, 'message' => 'يرجى ملء جميع الحقول بشكل صحيح']);
    exit;
}

$file = __DIR__ . '/products.json';
$products = [];
if (file_exists($file)) {
    $products = json_decode(file_get_contents($file), true);
    if (!is_array($products)) $products = [];
}
if (!isset($products[$category])) $products[$category] = [];

// توليد معرف فريد
$maxId = 0;
foreach ($products[$category] as $p) {
    if (isset($p['id']) && preg_match('/^p(\d+)$/', $p['id'], $m)) {
        $num = intval($m[1]);
        if ($num > $maxId) $maxId = $num;
    }
}
$newId = 'p' . ($maxId + 1);

$products[$category][] = [
    'id' => $newId,
    'name' => $name,
    'price' => $price,
    'image' => $image,
    'desc' => $desc
];

file_put_contents($file, json_encode($products, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
echo json_encode(['success' => true, 'message' => 'تم حفظ المنتج بنجاح', 'id' => $newId]);
