<?php

try {
	if (
		empty($_POST['ids'])
	) {
		throw new PDOException('Invalid request');	
	}
	
	$ids = $_POST['ids'];
	$idsArray = explode('|', $ids);

	$jsondata = file_get_contents("../js/items.json");
	$json = json_decode($jsondata, true);

	for ($i=0; $i < count($idsArray); $i++) {	

		for ($j=0; $j < count($json['items']); $j++) { 
			if($json['items'][$j]['id'] == $idsArray[$i]){
				array_splice($json['items'], $j);
			}
		}

	}

	$result = file_put_contents("../js/items.json", json_encode($json));

	echo json_encode (array (
		'error' => false,
		'$json' => $json
	), JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP);
		
} catch (PDOException $e) {
	
	echo json_encode (array (
		'error' => true,
		'message' => $e->getMessage()
	), JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP);
}
?>