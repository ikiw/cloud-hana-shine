sap.ui.jsview("odatabasic.odataBasic", {

      getControllerName : function() {
         return "odatabasic.odataBasic";
      },

      createContent : function(oController) {
    	  var oModel = new sap.ui.model.odata.ODataModel("/{{PACKAGE_NAME}}/services/businessPartners.xsodata/", false);
    	  
    	  var arrayHeaders = new Array(); 
    	  oTable = new sap.ui.table.Table("test",{tableId: "tableID", 
    	    visibleRowCount: 10}); 
    	  oTable.setTitle("Business Partners"); 
    	  
    	  //Table Column Definitions
    	  var oMeta = oModel.getServiceMetadata();
          var oControl;
          
	   	  for ( var i = 0; i < oMeta.dataServices.schema[0].entityType[0].property.length; i++) {
	   		  var property = oMeta.dataServices.schema[0].entityType[0].property[i];
	   		  
	          oControl = new sap.ui.commons.TextField().bindProperty("value",property.name);
	          oTable.addColumn(new sap.ui.table.Column({label:new sap.ui.commons.Label({text: property.name}), template: oControl, sortProperty: property.name, filterProperty: property.name, filterOperator: sap.ui.model.FilterOperator.EQ, flexible: true, width: "125px" }));
	      }		   	  
    	    	  
    	  oTable.setModel(oModel); 

    	  var sort1 = new sap.ui.model.Sorter("PARTNERID");
    	  oTable.bindRows("/BusinessPartners",sort1);

    	  var iNumberOfRows = oTable.getBinding("rows").iLength; 
    	  oTable.setTitle("Business Partners" + " (" + iNumberOfRows + ")" ); 
    	  
    	  
	      var layoutNew = new sap.ui.commons.layout.MatrixLayout({width:"auto"});
	      layoutNew.createRow(oTable);
    	  return layoutNew;
    	  

      }

});