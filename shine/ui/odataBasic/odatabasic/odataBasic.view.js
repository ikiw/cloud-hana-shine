sap.ui.jsview("odatabasic.odataBasic", {

      getControllerName : function() {
         return "odatabasic.odataBasic";
      },

      createContent : function(oController) {
    	  var oLayout = new sap.ui.commons.layout.MatrixLayout();
    	  
    	  var oModel = new sap.ui.model.odata.ODataModel("/{{PACKAGE_NAME}}/services/businessPartners.xsodata/", true);
    	  
    	  var arrayHeaders = new Array(); 
    	  var oControl; 
    	  oTable = new sap.ui.table.Table("test",{tableId: "tableID", 
    	    visibleRowCount: 10}); 
    	  oTable.setTitle("Business Partners"); 
    	  
    	  //Table Column Definitions 
    	  oControl = new sap.ui.commons.TextField().bindProperty("value","PARTNERID"); 
    		 oTable.addColumn(new sap.ui.table.Column({label:new sap.ui.commons.Label({text:"Partner ID"}), template: oControl, sortProperty: "PARTNERID", filterProperty: "PARTNERID", width: "125px" })); 

    	  oControl = new sap.ui.commons.TextField().bindProperty("value","EMAILADDRESS"); 
    	  oTable.addColumn(new sap.ui.table.Column({label:new sap.ui.commons.Label({text:"Email Address"}), template: oControl, sortProperty: "EMAILADDRESS", filterProperty: "EMAILADDRESS", width: "125px" }));  

    	  oControl = new sap.ui.commons.TextField().bindProperty("value","PHONENUMBER"); 
    	  oTable.addColumn(new sap.ui.table.Column({label:new sap.ui.commons.Label({text:"Phone Number"}), template: oControl, width: "125px" })); 

    	  oControl = new sap.ui.commons.TextField().bindProperty("value","FAXNUMBER"); 
    	  oTable.addColumn(new sap.ui.table.Column({label:new sap.ui.commons.Label({text:"Fax Number"}), template: oControl, width: "125px" })); 

    	  oControl = new sap.ui.commons.TextField().bindProperty("value","LEGALFORM"); 
    	  oTable.addColumn(new sap.ui.table.Column({label:new sap.ui.commons.Label({text:"Legal Form"}), template: oControl, sortProperty: "LEGALFORM", filterProperty: "LEGALFORM", width: "125px" }));  

    	  oControl = new sap.ui.commons.TextField().bindProperty("value","CURRENCY"); 
    	  oTable.addColumn(new sap.ui.table.Column({label:new sap.ui.commons.Label({text:"Currency"}), template: oControl, width: "125px" }));  

    	  oControl = new sap.ui.commons.Link ().bindProperty("text","WEBADDRESS"); 
    	  oControl.bindProperty("href","WEBADDRESS"); 
    	  oControl.setTarget("_blank"); 
    	  oTable.addColumn(new sap.ui.table.Column({label:new sap.ui.commons.Label({text:"Web Address" }), template: oControl, width: "125px" }));  

    	  oTable.setModel(oModel); 

    	  var sort1 = new sap.ui.model.Sorter("PARTNERID");
    	  oTable.bindRows("/BusinessPartners",sort1);

    	  var iNumberOfRows = oTable.getBinding("rows").iLength; 
    	  oTable.setTitle("Business Partners" + " (" + iNumberOfRows + ")" ); 
    	  
    	  
    	  var displayPanel = new sap.ui.commons.Panel("dispPanel").setText('Business Partner Details');

    	  displayPanel.addContent(oTable);
    	  oLayout.createRow(displayPanel);
    	  return oLayout;
    	  

      }

});