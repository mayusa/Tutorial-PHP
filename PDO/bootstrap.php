<?php

require 'database/Connection.php';
require 'database/QueryBuilder.php';
$config = require 'config.php';
// dd('haha');
return new QueryBuilder(
	Connection::make($config['database']);
);
