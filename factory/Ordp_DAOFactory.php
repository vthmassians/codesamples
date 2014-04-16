<?php

require_once('../core/Ordp_Factory.php');

class Ordp_DAOFactory extends Ordp_Factory
{
    
    /**
     * Setup type and file system uri
     * 
     */
    public function __construct($type, $uri)
    {
       parent::__construct($type, $uri);
    }   
    
    /**
     * Load a DAO Class
     * 
     */
    public function load($table, $schema, $type=null)
    {
        $file   = false;
        $folder = false;
        
        if ($type == 'internal')
        {
            $folder = $type . '/';
            $file   = $type . '_' . $table . 'DAO.php'; 
            $class  = $type . '_' . $table . 'DAO';   
        }
        else
        {
            $folder = $schema . '/';
            $file   = $schema . '_' . $table . 'DAO.php';
            $class  = $schema . '_' . $table . 'DAO'; 
        }
        
        foreach($this->uri as $key=>$value)
        {          
            if ( file_exists( '../' . $value . $folder . $file ) )
            {                
               include_once( '../' . $value . $folder . $file );
               
               $obj = new $class($schema);
               $obj->setSchema($schema);
               
               return $obj;
            }
         
        }        
    }

}
