sap.ui.controller("sales-dashboard.details", {
	
	onRowSelect: function(oEvent) {
		var path = oEvent.getParameter("rowContext");
		view.oSITable.bindRows(path + "/SalesOrderItem");
	},
	
	onRefresh: function(oEvent) {
		var view = this.getView();
		if (view.oSITable.isBound("rows")) {
			view.oSITable.unbindRows();
		}
	    var sort1 = new sap.ui.model.Sorter("SALESORDERID", true);
	    view.oSHTable.bindRows({
	 	    path: "/SalesOrderHeader",
		    parameters: {expand: "Buyer"},
		    sorter: sort1
		});
	    
		 var iNumberOfRows = view.oSHTable.getBinding("rows").iLength;
	     view.oSHTable.setTitle("Sales Orders"  + " (" + this.numericSimpleFormatter(iNumberOfRows) + ")" );
	    
	},
	
	
	onNewPress: function(oEvent) {
		var view = this.getView();
		this.newDialog = new sap.ui.commons.Dialog({modal: true});
		this.newDialog.setTitle(sap.app.i18n.getText("CREATE_LONG"));
		this.newDialog.addContent(view.createNewDialogContent(this));
		
		
		this.newDialog.open();
		
	},
	
	onDeletePress: function(oEvent) {
		 var oController = this;
		 var oTable = sap.ui.getCore().byId("soTable");
		 var data = oTable.getModel();
		 var soId = data.getProperty("SALESORDERID",oTable.getContextByIndex(oTable.getSelectedIndex()));
		 
		 if (soId == undefined){
		    
		     sap.ui.commons.MessageBox.show(sap.app.i18n.getText("ERROR_SELECT"),"ERROR", sap.app.i18n.getText("ERROR_SO_HEADER"));
				 	
		 }else{
		 
		 sap.ui.commons.MessageBox.confirm(sap.app.i18n.getText("CONFIRM_DELETE", [soId]),
				 	function(bResult){oController.deleteConfirm(bResult,oController,soId); },
				 	sap.app.i18n.getText("TITLE_DELETE"));
				 	
		 };
	},	
	 
	 //Delete Confirmation Dialog Results
	 deleteConfirm: function(bResult,oController,soId){
		 if(bResult){ 
			 var aUrl = "../../services/soDelete.xsodata/so_details('" + soId + "')";
			 jQuery.ajax({
			       url: aUrl,
			       type: 'DELETE',
			       dataType: 'text',
			       success: function(myTxt){
			          	  oController.onDeleteSuccess(myTxt,oController); },
			       error: oController.onErrorCall });
		 }
	 },
	 
	 //Delete Successful Event Handler
	 onDeleteSuccess: function(myTxt,oController){
		 oController.onRefresh();
		 sap.ui.commons.MessageBox.show(sap.app.i18n.getText("DELETE_SUCCESS"), 
				 "SUCCESS",
				 sap.app.i18n.getText("TITLE_DELETE_SUCCESS") );
	 },
	
	onSubmit: function(min, max) {
		var view = this.getView();
		var oController = this;
		var items = new Array();
        var payload =  {};
        
        //validation for User Input
        if(view.oComboBoxBp._getExistingListBox().getSelectedItem() == null){
        	sap.ui.commons.MessageBox.show(sap.app.i18n.getText("FILL_ALL_LINE_ITEMS"), 
                    "ERROR",
                   sap.app.i18n.getText("TITLE_MISSING_DATA") );
        	return;

        	
        }


        
        var endindex = max;
        for (var beginindex = min + 1; beginindex < endindex; beginindex++){
        	if(jQuery.sap.domById('productsel' + beginindex + '-input') != null){
    		    if(sap.ui.getCore().byId('productsel' + beginindex)._getExistingListBox().getSelectedItem() == null){
    	        	sap.ui.commons.MessageBox.show(sap.app.i18n.getText("FILL_ALL_LINE_ITEMS"), 
    	                    "ERROR",
    	                   sap.app.i18n.getText("TITLE_MISSING_DATA") );
    	        	return;
    		    }
        	}
        }
        
        for (var beginindex = min + 1; beginindex < endindex; beginindex++){
        	if(jQuery.sap.domById('productsel' + beginindex + '-input') != null){
        		var Quantity = jQuery.sap.domById('quantitysel' + beginindex).value;
    		    if(Number(Quantity) <= 0 || isNaN(Number(Quantity)) || Number(Quantity) % 1 != 0  ) {
    	        	sap.ui.commons.MessageBox.show(sap.app.i18n.getText("TITLE_VALID_INTEGER"), 
    	                    "ERROR",
    	                   sap.app.i18n.getText("CHECK_VALID_INTEGER") );
    	        	return;
    		    }
        	}
        }

		//get the Business Partner ID
		payload.PARTNERID= view.oComboBoxBp._getExistingListBox().getSelectedItem().getCustomData()[0].getValue();
		
	 
        for (var beginindex1 = min + 1; beginindex1 < endindex; beginindex1++){
        	if(jQuery.sap.domById('productsel' + beginindex1 + '-input') != null){
        		items.push({Product_Id: sap.ui.getCore().byId('productsel' + beginindex1)._getExistingListBox().getSelectedItem().getCustomData()[0].getValue(),Quantity: jQuery.sap.domById('quantitysel' + beginindex1).value});
        	}
        }
		
	    
        payload.SalesOrderItems = items;
                      
                          $.ajax({
                                 type: "POST",
                                 url: "../../services/soCreateMultiple.xsjs",
                                 contentType: "application/json",
                                 data: JSON.stringify(payload),
                                 dataType: "json",
                                 success: function(data){
                                 
                                 },
                                 dataFilter: function(data){
                                     	 oController.onRefresh();
                                		 sap.ui.commons.MessageBox.show('Sales Order ' + data.split('\n')[1].split(' ')[2] + ' Created Successfully', 
                                				 "SUCCESS",
                                				 sap.app.i18n.getText("SALES_ORDER_CREATED") );
                                 }
                          });

	    this.newDialog.close();	    
	},

	/*** Numeric Formatter for Currencies ***/
	numericFormatter: function(val){
		   if(val==undefined){ return '0'}
		   else{
		   jQuery.sap.require("sap.ui.core.format.NumberFormat");
		   var oNumberFormat = sap.ui.core.format.NumberFormat.getIntegerInstance({
		      maxFractionDigits: 2,
		      minFractionDigits: 2,
		      groupingEnabled: true });
		   return oNumberFormat.format(val); }
		   
	},

	/*** Numeric Formatter for Quantities ***/
	numericSimpleFormatter: function(val){
		   if(val==undefined){ return '0';}
		   else{
		   jQuery.sap.require("sap.ui.core.format.NumberFormat");
		   var oNumberFormat = sap.ui.core.format.NumberFormat.getIntegerInstance({
		      maxFractionDigits: 0,
		      minFractionDigits: 0,
		      groupingEnabled: true });
		   return oNumberFormat.format(val); }
		   
	},
/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf sales-dashboard.details
*/
	onInit: function() {
		view = this.getView();
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf sales-dashboard.details
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf sales-dashboard.details
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf sales-dashboard.details
*/
//	onExit: function() {
//
//	}

});