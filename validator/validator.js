function baseValidator()
{

    this.hasErrors        = false;
    this.errorMessages    = new Array(); 
    this.rules            = new Array();
    this.formObject       = false;
    this.errAsString      = '';

    /**
     * Configuration
     *
     * this.defaultColor    : The default background color of the form elements, before validation
     * this.errorColor      : The background color of the form elements with errors
     * this.errorContainer  : id of the container (div) that will display the errors
     *
     * this.diplayAs        : How are errors displayed? (alert || div || return)
     * this.highlightFields : Highlight the fields along with displaying errors
     *
     */

    this.errorContainer   = 'errorDisplay';
    this.displayAs        = 'alert' // alert||div

    this.highlightFields  = false;
    this.defaultColor     = '';
    this.errorColor       = '';
    this.errorFieldName     = '_field';


    /**
     * Set Object Rules
     */
    this._setRules = function(rules)
    {
        this.rules = rules; 
    }


    /**
     * Set the form object that we'll validate against
     */
    this._setFormObject = function(formObject)
    {
        this.formObject = formObject;
    }

    /**
     * Add to the errors array
     */
    this._setError = function(key, errorMessage)
    {
        this.errorMessages[key] = errorMessage;
    }

    /**
     * Build the error string
     */
    this._buildErrString = function()
    {
        tempArray = new Array();

        for( i in this.errorMessages)
        {
            tempArray.push(this.errorMessages[i]);
        }

        this.errAsString = tempArray.join('|');
        tempArray = undefined;
    }

    /**
     * Match the content of two fields
     *
     *
     * args: field1 name, field2 name
     *
     * returns: true on success
     *         false on failure
     */
    this._isMatch = function(field1, field2)
    {
       if (this.formObject[field1].value == this.formObject[field2].value)
       {
           return true; 
       } 
       else
       {
           return false;
       }
    }


    /**
     * type  = elementType
     * key   = name of the field
     * field = field object
     * rule  = rule we're checking against
     * err   = error message on failure
     */
    this._checkMax = function(type, key, field , rule, err)
    {
        if (type == 'text' ||
            type == 'password' ||
            type == 'file' ||
            type == 'textarea')
        {   
            if (field.value.length > rule)
            {       
                this._setError(key,err);                
                this.hasErrors = true;
            }
        }
        else if (type == 'checkbox' ||
                 type == 'radio')
        {
            var checkedCount = 0;

            for(i=0;i<field.length;i++)
            {
                if (field[i].checked == true)
                {
                    checkedCount++;
                }
            }

            if (checkedCount > rule)
            {
                this._setError(key,err);
                this.hasErrors = true;
            }
        } 
    }

    /**
     *
     *
     *
     */
    this._checkMin = function(type, key, field, rule, err)
    {
        if (type == 'text' ||
            type == 'password' ||
            type == 'file' ||
            type == 'textarea')
        {   
            if (field.value.length < rule)
            {       
                this._setError(key,err);                
                this.hasErrors = true;
            }
        }
        else if (type == 'checkbox' ||
                 type == 'radio')
        {
            var checkedCount = 0;

            for(i=0;i<field.length;i++)
            {
                if (field[i].checked == true)
                {
                    checkedCount++;
                }
            }

            if (checkedCount < rule)
            {
                this._setError(key,err);
                this.hasErrors = true;
            }
        } 
    }

    /**
     *
     *
     */
    this._checkEmp = function(type, key, field, rule, err)
    {
        if (type == 'text' ||
            type == 'password' ||
            type == 'file' )
        {
            if (field.value.length <= 0)
            {       
                this._setError(key,err);                
                this.hasErrors = true;
            }
        }
        else if (type == 'textarea')
        {
            if (field.value.length == 0) 
            {
                this._setError(key,err);                
                this.hasErrors = true;
            }
        }
        else if (type == 'select-one')
        {
            selectedItem = field.selectedIndex;

            if (field[selectedItem].value == undefined ||
                field[selectedItem].value == '')
            {
                this._setError(key,err);
                this.hasErrors = true;
            }
        }
    }

    /**
     *
     */
    this._checkReg = function(type, key, field, rule, err)
    {
        var regexRule = rule;

        if (type == 'text')
        {
            var regResult = regexRule.test(field.value);

            if ( regResult != true )
            {
              this._setError(key,err);
              this.hasErrors = true;
            }
        }
    }

}// end class



function inputValidation()
{
    //extend input Validator
    this.inheritFrom = baseValidator;
    this.inheritFrom();

    //set rules public
    this.setRules = function(rules)
    {
        this._setRules(rules);
    }

    //set form object public
    this.setFormObject = function(fo)
    {
        this._setFormObject(fo);
    }    

    /**
     * run through basic validation
     *
     */
    this.validateBasic = function()
    {
        for ( currentField in this.rules )
        {
            var currentRule  = this.rules[currentField]; 
            var elementType  = this.formObject[currentField].type;
            var elementValue = this.formObject[currentField].value;

            //delete the current field from errors
            delete( this.errorMessages[currentField] );

            //reset the color
            if (this.defaultColor)
            {
                te = document.getElementById(currentField + this.errorFieldName);
                te.style.backgroundColor = this.defaultColor;
            }


        /*
         * check for helper if type comes back us undefined
         */
            if (elementType == undefined)
            {
                elementType = this.formObject[currentField][0].type;
            }

        /*
         * Check Maximum
         */ 
            
            if (currentRule.max != false && currentRule.max != undefined)
            {
                this._checkMax(elementType, 
                               currentField, 
                               this.formObject[currentField],
                               currentRule.max,
                               this.rules[currentField].err.max);
            } 
        /*
         * Check Minimum
         */
            if (currentRule.min != false && currentRule.min != undefined)
            {
                this._checkMin(elementType, 
                               currentField, 
                               this.formObject[currentField],
                               currentRule.min,
                               this.rules[currentField].err.min);
            } // end min 

        /*
         * Empty Check
         */
            if (currentRule.emp != false && currentRule.emp != undefined)
            {
                this._checkEmp(elementType,
                               currentField,
                               this.formObject[currentField],
                               currentRule.emp,
                               this.rules[currentField].err.emp);
            }

        /*
         * Regex Check
         */
            if (currentRule.reg != false && currentRule.reg != undefined)
            {
                this._checkReg(elementType,
                               currentField,
                               this.formObject[currentField],
                               currentRule.reg,
                               this.rules[currentField].err.reg);
            }

        } // end for-in
    }

    /**
     * Match two fields
     *
     */
    this.isMatch = function(field1, field2, key, err)
    {
        var result = this._isMatch(field1, field2);

        if (!result)
        {
            this._setError(key, err);    
        }
    }

    this.isInteger = function(field, err)
    {
// stub
    }

    this.isValidEmail = function(fieldName, toHighlight, err)
    {
        var check1 = /(@.*@)|(\.\.)|(@\.)|(\.@)|(^\.)/;
        var check2 = /^.+\@(\[?)[a-zA-Z0-9\-\.]+\.([a-zA-Z]{2,3}|[0-9]{1,3})(\]?)$/;

        var email = this.formObject[fieldName].value;

        if (check1.test(email) && ! check2.test(email))
        {
            this._setError(toHighlight, err); 
        }
    }

    /**
     * Display errors
     *
     */
    this.displayErrors = function()
    {

        if (!this.hasErrors)
        {
            return true;
        }

        this._buildErrString();

        var lineBreak = (this.displayAs == 'alert') ? "\n" : '<br />';

        if (this.displayAs == 'alert')
        {
            alert( this.errAsString.replace(/\|/gi, lineBreak) );
        } 
        else if (this.displayAs == 'div')
        {
            var outContainer = document.getElementById(this.errorContainer); 

            outContainer.innerHTML     = this.errAsString.replace(/\|/gi, lineBreak);
            outContainer.style.display = "";
        }
        
        if (this.highlightFields == true)
        {
            this.highlightForm();
        } 
    }

   this.highlightForm = function()
   {
       for (i in this.errorMessages)
       {
           var te = document.getElementById(i + this.errorFieldName);
           if (te)
           {
               te.style.backgroundColor = this.errorColor;
           }
       }
   }

} // end class
