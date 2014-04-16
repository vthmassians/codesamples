<?php

require_once('../core/Ordp_Factory.php');

class Ordp_PluginFactory extends Ordp_Factory
{
    public function __construct($type, $uri)
    {
       parent::__construct($type, $uri);
    }   
    
}
