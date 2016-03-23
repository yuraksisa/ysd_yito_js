define('YSDSpreadSheet', ['jquery'], function($) {
	
  SpreadSheet = function (tableId, columnsIds, rowsIds, numberOfRows, zerozeroTitle, inputPrefix, inputSize, inputClass, readonly, columnTitles, rowTitles, repeatRowTitles) {

    this.model = new SpreadSheetModel(columnsIds, rowsIds, numberOfRows, columnTitles, rowTitles);
    this.controller = new SpreadSheetController(this.model);
    this.view = new SpreadSheetView(tableId, this.model, this.controller, zerozeroTitle, inputPrefix, inputSize, inputClass, readonly, repeatRowTitles);

    this.model.setView(this.view);
    this.controller.setView(this.view);

  }

  SpreadSheetModel = function(columnIds, rowIds, numberOfRows, columnTitles, rowTitles) {

    this.columnIds = columnIds;
    this.rowIds = rowIds;
    this.columnTitles = columnTitles || columnIds;
    this.rowTitles = rowTitles || rowIds;
    this.view = null;
    this.numberOfRows = numberOfRows;
    this.columns = rowIds.length;
    this.fixedColumn = columnIds.length > 0; 

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

  SpreadSheetView = function(tableId, model, controller, zeroZeroTitle, inputPrefix, inputSize, inputClass, readonly, repeatRowTitles) {

    this.table = document.querySelector('#'+tableId);
    this.model = model;
    this.controller = controller;
    this.inputPrefix = inputPrefix;
    this.inputSize = inputSize;
    this.inputClass = inputClass;
    this.zeroZeroTitle = zeroZeroTitle; 
    this.readonly = readonly;
    this.repeatRowTitles = repeatRowTitles || 0;

    this.init = function() { /** Builds the Spreadsheet **/

      var row = null; 
      var i=0, j=0;

      // Create the header row
      row = this.table.insertRow(-1);
      
      if (this.model.fixedColumn) {
      	row.insertCell(-1).innerHTML = '<span class="rowTitle">' + this.zeroZeroTitle + '</span>';
      }
      for (i=0;i<this.model.rowIds.length;i++) {
        row.insertCell(-1).innerHTML = '<span class="rowTitle">'+ this.model.rowTitles[i]+'</span>';
      } 

      // Create the other rows
      for (i=0;i<this.model.numberOfRows;i++) {
        row = this.table.insertRow(-1);
     
        if (this.model.fixedColumn) {
      	  row.insertCell(-1).innerHTML = '<span class="columnTitle">' + this.model.columnTitles[i] + '</span>'
        }
        for (j=0;j<this.model.rowIds.length;j++) {
          var cellId = '[' + this.inputPrefix + ']';
          cellId += this.model.fixedColumn ? '[' + this.model.columnIds[i] + ']' : '[' + i +']';
          cellId += '[' + this.model.rowIds[j] + ']'; 
          var cell = row.insertCell(-1);
          cell.innerHTML = '<input type="text" id="' + cellId +
            '" name="' + cellId + '" ' + 'class="spread_input ' + this.inputClass + '" ' + 
            '" size="' + this.inputSize + '"' + (this.readonly ? ' readonly' : '') + '/>';
          //$(cell).attr('data-tip','Hola');
        }

        // Repeat header every N rows
        if (this.repeatRowTitles > 0) {
          if ((i % this.repeatRowTitles == 0) && i > 0) {
            row = this.table.insertRow(-1);
            if (this.model.fixedColumn) {
              row.insertCell(-1).innerHTML = '<span class="rowTitle">' + this.zeroZeroTitle + '</span>';
            }
            for (x=0;x<this.model.rowIds.length;x++) {
             row.insertCell(-1).innerHTML = '<span class="rowTitle top-margin">'+ this.model.rowTitles[x]+'</span>';
            }         
          }
        }

      }

    }

    this.init();

  }


  return SpreadSheet;

});