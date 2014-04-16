codesamples
===========

Code Samples
--------------

**PHP Singleton/Factory class loader**

- Ordp_Factory.php
- factory
-  Ordp_DAOFactory.php - Database class loader
-  Ordp_ModelFactory.php - Model class Loader
-  Ordp_PluginFactory.php - Plugin class loader

*Usage*

Initial call to Ordp_Factory::getInstance per type

i.e. $this->pluginFactory = Ordp_Factory::getInstance('Plugin', array(path1, path2...));

Calling a class

$this->pluginFactory->load('someClass');

**Javascript form validator**
Javascript input validator with example index.html . This was written to be used for a wordpress plugin 
