<?php
return [
'database' => [
	'dbname' => 'tasks',
	'username' => 'homestead',
	'password' => 'secret',
	'connection' => 'mysql:host=127.0.0.1:33060',
	'options' => [
		PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
	]
]
];