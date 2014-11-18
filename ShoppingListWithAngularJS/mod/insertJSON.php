<?php

try {
	if (
		empty($_POST['item']) ||
		empty($_POST['qty']) ||
		empty($_POST['type'])
	) {
		throw new PDOException('Invalid request');	
	}
	
	$jsondata = file_get_contents("../js/items.json");

	$json = json_decode($jsondata, true);
	$len = count($json['items']);
	if($len == 0) {
		$id = "0";
	} else {
		$id = $json['items'][$len-1]['id']+1;
	}
	$item = $_POST['item'];
	$qty = $_POST['qty'];
	$type = $_POST['type'];
	$date = date('Y-m-d h:i:s');
	$done = 0;
	if($type ==1 ){
		$type_name ="Qty";
	} else if($type == 2){
		$type_name ="Lb";
	} else {
		$type_name ="Kg";
	}

	$json['items'][$len]['id'] = "$id";
	$json['items'][$len]['item'] = $item;
	$json['items'][$len]['qty'] = $qty;
	$json['items'][$len]['type'] = $type;
	$json['items'][$len]['done'] = "$done";
	$json['items'][$len]['date'] = $date;
	$json['items'][$len]['type_name'] = $type_name;

	$item = $json['items'][$len];

	$result = file_put_contents("../js/items.json", json_encode($json));

	echo json_encode (array (
		'error' => false,
		'item' => $item
	), JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP);
		
} catch (PDOException $e) {
	
	echo json_encode (array (
		'error' => true,
		'message' => $e->getMessage()
	), JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP);
}
?>