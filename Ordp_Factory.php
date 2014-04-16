<?php

abstract class Ordp_Factory
{
    public static $instance = array();
    private $type;
    private $uri;
    
    public function __construct($type, $uri)
    {
        $this->type = $type;
        $this->uri  = $uri;
    }
    
    /**
     * Get an instance of a base factory 
     * 
     */
    public static function getInstance($type, $uri)
    {
        if (isset(self::$instance[$type]))
        {
            return self::$instance[$type];
        }
        else
        {
            $class = 'Ordp_' . $type . 'Factory';
         
            include_once('../core/factory/' . $class .'.php');    
            
            self::$instance[$type] = new $class($type, $uri);
            
            return self::$instance[$type];
        }
    }
    
    /**
     * Load a factory class
     * 
     */
    public function load( $toLoad , $args=null)
    {
        
        $classFile   = $toLoad . $this->type . '.php';
        $class       = $toLoad . $this->type;
        $classFolder = $toLoad;
        $loaded    = false;

        foreach ($this->uri as $key=>$path)
        {
            if ( file_exists( '../' . $path . $classFile) )
            {   
                try
                {         
                    include_once('../core/Ordp_' . $this->type .'.php');
                    include_once( '../' . $path . $classFile);
                }
                catch (Exception $e)
                {
                    throw new Exception("Error Loading Plugin $classFile\n");   
                }
                
                
                $loaded = true;
                $instance = new $class($args);
                
                if (!$instance)
                {
                    throw new Exception("Error loading $class");                    
                }
                
                return $instance;
            
            }
        }
        
        if (!$loaded)
        {
            throw new Exception("Cannot Load $class");
        }
    }
}

?>