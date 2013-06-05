<?php
$uri = $_REQUEST['uri'];
//var_dump(html_entity_decode($uri));die();
echo file_get_contents(html_entity_decode($uri));
