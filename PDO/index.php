<?php
$database = require 'bootstrap.php';

$tasks = $database->selectAll('todos');
var_dump($tasks);
require 'index.view.php';