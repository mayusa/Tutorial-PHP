<?php

try {
	if (
		empty($_POST['id'])
	) {
		throw new PDOException('Invalid request');	
	}

	$id = $_POST['id'];
	//json值最好都是string(加引号)，否则ng-bind会失效
	// all he value of json's properties should be string
	$done = empty($_POST['done']) ? "0" : "1";


	$jsondata = file_get_contents("../js/items.json");

	$json = json_decode($jsondata, true);
	$len = count($json['items']);

	for ($i=0; $i < $len ; $i++) { 
		if($json['items'][$i]['id'] == $id){
			$json['items'][$i]['done'] = $done;
		}
	}

	$result = file_put_contents("../js/items.json", json_encode($json));

	//$items = $olditemsObj->items;


	echo json_encode (array (
		'error' => false,
		'result' => $result
	), JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP);


} catch (PDOException $e) {
	
	echo json_encode (array (
		'error' => true,
		'message' => $e->getMessage()
	), JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP);
}
?>