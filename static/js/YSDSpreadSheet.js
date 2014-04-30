define('YSDSpreadSheet', ['jquery'], function($) {
	
  SpreadSheet = function (tableId, columnsTitles, rowsTitles, numberOfRows, zerozeroTitle, inputPrefix, inputSize, inputClass) {

    this.model = new SpreadSheetModel(columnsTitles, rowsTitles, numberOfRows);
    this.controller = new SpreadSheetController(this.model);
    this.view = new SpreadSheetView(tableId, this.model, this.controller, zerozeroTitle, inputPrefix, inputSize, inputClass);

    this.model.setView(this.view);
    this.controller.setView(this.view);

  }

  SpreadSheetModel = function(columnTitles, rowTitles, numberOfRows) {

    this.columnTitles = columnTitles;
    this.rowTitles = rowTitles;
    this.view = null;
    this.numberOfRows = numberOfRows;
    this.columns = rowTitles.length;
    this.fixedColumn = columnTitles.length > 0; 

    this.setView = function(theView) {
      this.view = theView;
    }

  }

  SpreadSheetController = function(model) {

    this.model = model;
    this.view = null;

    this.setView = function(theView) {
      this.view = theView;
    }

  }

  SpreadSheetView = function(tableId, model, controller, zeroZeroTitle, inputPrefix, inputSize, inputClass) {

    this.table = document.querySelector('#'+tableId);
    this.model = model;
    this.controller = controller;
    this.inputPrefix = inputPrefix;
    this.inputSize = inputSize;
    this.inputClass = inputClass;
    this.zeroZeroTitle = zeroZeroTitle; 

    this.init = function() { /** Builds the Spreadsheet **/

      var row = null; 
      var i=0, j=0;

      // Create the header row
      row = this.table.insertRow(-1);
      
      if (this.model.fixedColumn) {
      	row.insertCell(-1).innerHTML = '<span class="rowTitle">' + this.zeroZeroTitle + '</span>';
      }
      for (i=0;i<this.model.rowTitles.length;i++) {
        row.insertCell(-1).innerHTML = '<span class="rowTitle">'+ this.model.rowTitles[i]+'</span>';
      } 

      // Create the other rows
      for (i=0;i<this.model.numberOfRows;i++) {
        row = this.table.insertRow(-1);
     
        if (this.model.fixedColumn) {
      	  row.insertCell(-1).innerHTML = '<span class="columnTitle">' + this.model.columnTitles[i] + '</span>'
        }
        for (j=0;j<this.model.rowTitles.length;j++) {
          var cellId = '[' + this.inputPrefix + ']';
          cellId += this.model.fixedColumn ? '[' + this.model.columnTitles[i] + ']' : '[' + i +']';
          cellId += '[' + this.model.rowTitles[j] + ']'; 
          row.insertCell(-1).innerHTML = '<input type="text" id="' + cellId +
            '" name="' + cellId + '" ' + 'class="spread_input ' + this.inputClass + '" ' + 
            '" size="' + this.inputSize + '"/>';	
        }

      }

    }

    this.init();

  }


  return SpreadSheet;

});