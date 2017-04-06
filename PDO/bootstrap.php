<?php

require 'database/Connection.php';
require 'database/QueryBuilder.php';
$config = require 'config.php';
// var_dump($config['database']);
return new QueryBuilder(
	Connection::make($config['database'])
);
