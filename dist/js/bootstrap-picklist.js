/*
//! version : 0.1.1
==============================================================================
bootstrap-picklist.js
https://github.com/ruchitchhabra/bootstrap-picklist
==============================================================================
The MIT License (MIT)

Copyright (c) 2014 ruchitchhabra

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

( function ( $ ) {

	function BootstrapPickList ( element, options ) {
		
		this.$selectButton 				= null;
		this.$displayListValueElement 	= null;
		this.$displayListContentElement = null;
		
		//	Default options
		var _defaults = {
		
			buttonLabel				: "Select",
			buttonTitle				: "Select",
			buttonTitleMaxLength	: 100,
			columns					: 2,
			displayListConnectId	: "",
			displayValueConnectId	: "",
			displaySelected			: true,
			itemList				: [],
			sortItemList			: true,
			sortItemListBy			: "label"
		};
		
		//	Default column structure
		var _columnStructure = {
		
			"1" : "col-xs-12",
			"2" : "col-xs-6",
			"3" : "col-xs-4",
			"4" : "col-xs-3",
			"6" : "col-xs-2",
			"12": "col-xs-1"
		};
		
		this.$selectedItemsArray = new Array();
		
		//	Initialize options
		this._mergeOptions = function ( options ) {
			return $.extend( true, {}, _defaults, options );
		};
		
		//	Create column structure for list items
		this._createList = function () {
		
			var _rows = "";
			var _columns = this.options.columns;
			var _displayListConnectId = this.options.displayListConnectId;
			
			$.each( this.options.itemList, function ( _i, _itemList ) {
				
				if ( _i > 0 ) {
				
					_rows += "<article class=\"col-xs-12\"><hr/></article>";
				}
				
				_maxOptionCount = Math.round( _itemList.length / _columns );
				
				for ( var _j = 0; _j < _maxOptionCount; _j++ ) {
				
					var _columnClass = _columnStructure[ _columns ];
					
					var _columnContent = "";
					
					for ( var _k = 0; _k < _columns; _k++ ) {
					
						var _articleId = "" + _displayListConnectId + "_pickListOption_" + ( _j + ( _k * _maxOptionCount ) ) + "";
						
						if ( _itemList[ _j + ( _k * _maxOptionCount ) ] ) {

							_columnContent +=  
								"<article class=\"" + _columnClass + " pick-list-item\" id=\"" + _articleId + "\">" +
									"<input type=\"checkbox\" />" +
									"<span value=\"" + _itemList[ _j + ( _k * _maxOptionCount ) ].value + "\">" + 
										_itemList[ _j + ( _k * _maxOptionCount ) ].label + 
									"</span>" +
								"</article>";
						}
					}
					
					_rows += "<article class=\"col-xs-12\">" +	_columnContent + "</article>";
				}
			});
			
			this.$displayListContentElement.html( _rows );
			
			if ( ! $.isEmptyObject( $.trim( this.options.buttonTitle ) ) ) {

				this.$selectButton.attr( "title", $.trim( this.options.buttonTitle ) );	
			}
		};
		
		//	Connect events for pick list elements
		this._connectEvents = function () {
			
			$( "body" ).on( "click", ".pick-list-item", function () {
				
				if ( $( this ).find( "input" ).prop( "checked" ) ) {
				
					$( this ).find( "input" ).prop( "checked", false );
					$( this ).removeClass( "pick-list-item-active" );
				} else {
					
					$( this ).find( "input" ).prop( "checked", true );
					$( this ).addClass( "pick-list-item-active" );
				}
				
			}).on( "click", ".pick-list-item input", function () {
				
				if ( $( this ).prop( "checked" ) ) {
				
					$( this ).prop( "checked", false );
					$( this ).parent().removeClass( "pick-list-item-active" );
				} else {
					
					$( this ).prop( "checked", true );
					$( this ).parent().addClass( "pick-list-item-active" );
				}
				
			}).on( "mouseover", ".pick-list-item", function () {
				
				if ( ( ! $( this ).find( "input" ).prop( "checked" ) )
					|| $( this ).hasClass( "pick-list-item-hover" ) ) {
					
					$( this ).addClass( "pick-list-item-hover" );
				}
				
			}).on( "mouseout", ".pick-list-item", function () {
				
				if ( $( this ).hasClass( "pick-list-item-hover" ) ) {
					
					$( this ).removeClass( "pick-list-item-hover" );
				}
			});
		};
		
		//	Validate the options
		this._validateOptions = function () {
			
			var _isError = false;
			var _errorMessage = '';
			
			//	Validate connect button
			if ( $( element ).length == 0 ) {
				
				throw new Error( "No such element found." );
			}
			
			//	Validate if pick list exists for the button
			if ( $( element ).hasClass( "picklist" ) ) {
			
				throw new Error( "Pick list already exists for the button: '" + $( element ).attr( "id" ) + "'." );
			}
			
			//	Validate pick list button label
			if ( ( $.type( this.options.buttonLabel ) !== "string" )
					|| ( $.trim( this.options.buttonLabel ).length == 0 ) ) {
			
				_isError = true; 
				_errorMessage += "Invalid label for pick list button. ";
			}
			
			//	Validate pick list columns
			if ( $.type( this.options.columns ) === "string" ) {
			
				if ( isNaN( this.options.columns ) 
					|| ( ( parseInt( this.options.columns ) != 1 ) 
					&& ( parseInt( this.options.columns ) != 2 ) 
					&& ( parseInt( this.options.columns ) != 3 ) 
					&& ( parseInt( this.options.columns ) != 4 ) 
					&& ( parseInt( this.options.columns ) != 6 ) 
					&& ( parseInt( this.options.columns ) != 12 ) ) ) {
					
					_isError = true; 
					_errorMessage += "Invalid number columns for pick list. Valid column numbers are 1,2,3,4,6,12. ";
				}
				
			} else if ( ( $.type( this.options.columns ) !== 'number' )
						|| ( ( this.options.columns != 1 )
						&& ( this.options.columns != 2 )
						&& ( this.options.columns != 3 )
						&& ( this.options.columns != 4 )
						&& ( this.options.columns != 6 )
						&& ( this.options.columns != 12 ) ) ) {
				
				_isError = true; 
				_errorMessage += "Invalid number columns for pick list. Valid column numbers are 1,2,3,4,6,12. ";
			}
			
			//	Validate pick list content element id
			if ( ( $.type( this.options.displayListConnectId ) !== 'string' )
					|| ( $.trim( this.options.displayListConnectId ).length == 0 ) 
					|| ( $( '#' + this.options.displayListConnectId ).length == 0 ) ) {
			
				_isError = true; 
				_errorMessage += "Invalid pick list content element id. ";
			}
			
			//	Validate pick list display selected variable
			if ( $.type( this.options.displaySelected ) !== 'boolean' ) {
			
				_isError = true; 
				_errorMessage += "Invalid pick list value for display selected. ";
			}
			
			//	Validate pick list value element id
			if ( ( ( $.type( this.options.displaySelected ) === "boolean" ) && ( this.options.displaySelected ) )
					&& ( ( $.type( this.options.displayValueConnectId ) !== "string" )
							|| ( $.trim( this.options.displayValueConnectId ).length == 0 ) 
							|| ( $( '#' + this.options.displayValueConnectId ).length == 0 ) ) ) {
			
				_isError = true; 
				_errorMessage += "Invalid pick list value element id. ";
			}
			
			//	Validate pick list item array
			if ( ! $.isArray( this.options.itemList ) ) {
			
				_isError = true; 
				_errorMessage += "Invalid pick list array. ";
			}
			
			//	Validate pick list item array elements
			if ( $.isArray( this.options.itemList) ) {
				
				if ( $.isEmptyObject( this.options.itemList ) ) {
					
					this.options.itemList.push( new Array () );
					
				} else {
					
					//	If item list is array of objects, convert it into array of array of items
					if ( $.type( this.options.itemList[ 0 ] ) == 'object' ) {
						
						var _tempItemList = $.extend( true, [], this.options.itemList ); 
						this.options.itemList = new Array();
						this.options.itemList.push( _tempItemList );
						
					} else {
						
						$.each( this.options.itemList, function( _index, _item ) {
							
							if ( ! $.isArray( _item ) ) {
								
								_isError = true; 
								_errorMessage += "Invalid pick list array. ";
								
								return false;
							} else {
								
								return true;
							}
						});
					}
				}
			}
			
			//	If error, print errors on console
			if ( _isError ) {
			
				throw new Error( _errorMessage );
			}
		};
		
		//	Comparator to sort item list by item label
		this._compareItemsByLabel = function (a, b) {
		
			if ( a.label < b.label ) {
				return -1;
			} else if ( a.label > b.label ) {
				return 1;
			} else {
				return 0;
			}
		};
		
		//	Comparator to sort item list by item value
		this._compareItemsByValue = function (a, b) {
		
			if ( a.value < b.value ) {
				return -1;
			} else if ( a.value > b.value ) {
				return 1;
			} else {
				return 0;
			}
		};
		
		//	Function to initialize pick list
		this._init = function () {
			
			//	Merge options
			this.options = this._mergeOptions( options );
			
			//	Validate the options
			this._validateOptions();
			
			//	Sort item list
			if ( this.options.sortItemList ) {
			
				if ( this.options.sortItemListBy.toUpperCase() == "LABEL" ) {
						
					//	Sort the item list based on label
					this.options.itemList.sort( this._compareItemsByLabel );
				} else {
					
					//	Sort the item list based on value
					this.options.itemList.sort( this._compareItemsByValue );
				}
			}
			
			this.$selectButton 				= $( element );
			this.$displayListValueElement 	= $( "#" + this.options.displayValueConnectId );
			this.$displayListContentElement = $( "#" + this.options.displayListConnectId );
			
			//	Connect events for list items
			if ( $( ".pick-list-item" ).length == 0 ) {
			
				this._connectEvents();
			}
			
			//	Generate HTML content for the pick list
			this._createList();
			
			//	Add class to button
			this.$selectButton.addClass( "picklist" );
		};
		
		//	Initialize
		this._init();
	}

	//	Function to clear list selection
	BootstrapPickList.prototype.clear = function () {
	
		this.$displayListContentElement.find( ".pick-list-item-active" ).each( function () {

			$( this ).find( "input" ).prop( "checked", false );
			$( this ).removeClass( "pick-list-item-active" );
		});
	};
	
	//	Function to reset list selection to last saved selection
	BootstrapPickList.prototype.reset = function () {
	
		this.clear();
		
		$.each( this.$selectedItemsArray, function( _i, _selectedItem ){
		
			$( _selectedItem ).find( "input" ).prop( "checked", true);
			$( _selectedItem ).addClass( "pick-list-item-active" );
		});
	};
	
	//	Function to save list selection
	BootstrapPickList.prototype.save = function () {
	
		var _selectedItemsText 	= "";
		var _buttonLabel 		= this.options.buttonLabel;
		var _buttonTitle 		= this.options.buttonTitle;
		var _displaySelected 	= this.options.displaySelected;
		var _selectedItemCount 	= this.$displayListContentElement.find( ".pick-list-item-active" ).length;
		
		if ( _selectedItemCount > 0 ) {
			_buttonLabel = _selectedItemCount + " Selected";
		}
		
		var _selectedItemsLabelArray = new Array();
		var _selectedItemsArray = new Array();
		
		this.$displayListContentElement.find( ".pick-list-item-active" ).each( function () {
		
			_selectedItemsLabelArray.push( $( this ).find( "span" ).text() );
			_selectedItemsArray.push( "#" + $( this ).attr( "id" ) );
		});
		
		this.$selectedItemsArray = _selectedItemsArray;
		
		_selectedItemsLabelArray.sort();
		
		$.each( _selectedItemsLabelArray, function( _i, _selectedItemLabel ) {
			
			if ( _i > 0 ) {
			
				_selectedItemsText += "; ";
			}
			
			_selectedItemsText += _selectedItemLabel;			
		});
		
		this.$selectButton.text( _buttonLabel );
		
		if ( _displaySelected ) {
			
			this.$displayListValueElement.html( _selectedItemsText );
		} else {
			
			_buttonTitle = _selectedItemsText.length > 100 ? 
					( _selectedItemsText.substr(0, this.options.buttonTitleMaxLength) + "..." ) : 
						$.isEmptyObject( _selectedItemsLabelArray ) ? _buttonTitle : _selectedItemsText;
		}
		
		this.$selectButton.attr( "title", _buttonTitle );
	};
	
	$.fn.bootstrapPickList = function ( options ) {
		
		return new BootstrapPickList( this, options );
	};
	
})( window.jQuery );
