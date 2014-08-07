sap.ui.controller("uis.js.Table", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
*/
//   onInit: function() {
//
//   },

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
*/
//   onBeforeRendering: function() {
//
//   },

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
*/
//   onAfterRendering: function() {
//
//   },

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
*/
//   onExit: function() {
//
//   }
	
	 onTBPress: function(oEvent,oController){
		 
		 //Excel Download
		 if (oEvent.getSource().getId()=="btnExcel"){
			$.download('/{{PACKAGE_NAME}}/services/poWorklistQuery.xsjs','cmd=Excel','GET' );
			 return;
		 }
		 
		 //Check for selected item for all other events
		 var oTable = sap.ui.getCore().byId("poTable");
		 var data = oTable.getModel();
		 var poId = data.getProperty("PURCHASEORDERID",oTable.getContextByIndex(oTable.getSelectedIndex()));
		 if ( poId == undefined ){
			 sap.ui.commons.MessageBox.show(oBundle.getText("error_select"), 
					 "ERROR",
					 oBundle.getText("error_action") );
		 }
		 else{
			 //Supported Buttons - Delete and Edit
			 switch (oEvent.getSource().getId()){
			 case "btnDelete":
				 sap.ui.commons.MessageBox.confirm(oBundle.getText("confirm_delete", [poId]),
						 function(bResult){oController.deleteConfirm(bResult,oController,poId); },
						 oBundle.getText("title_delete"));
				 break;
			 case "btnEdit":
				 break;
		 
		 }}
		 
	 },
	 //Toolbar Menu Select Event Handler - Reject & Accept
	 onMenuSelected: function(oEvent,oController){
		 
		 //Check for selected item for all other events		 
		 var oTable = sap.ui.getCore().byId("poTable");
		 var data = oTable.getModel();
		 var poId = data.getProperty("PURCHASEORDERID",oTable.getContextByIndex(oTable.getSelectedIndex()));
		 if ( poId == undefined ){
			 sap.ui.commons.MessageBox.show(oBundle.getText("error_select"), 
					 "ERROR",
					 oBundle.getText("error_action") );
		 }
		 else{
			 var action;
			 switch (oEvent.getParameter("itemId")){
			 case "itemReject":
				 action = "Reject";				
				 break;
			 case "itemAccept":
				 action = "Accept";	
				 break;
			 }
			 sap.ui.commons.MessageBox.confirm(oBundle.getText("confirm_po", [action,poId]),
					 function(bResult){oController.approvalConfirm(bResult,oController,poId,action); },
					 oBundle.getText("confirm_title", [action]) );
		 }
	 },
	//Table Row Select Event Handler
	 onRowSelect: function(oEvent){

	 },
	 
	 //Delete Confirmation Dialog Results
	 deleteConfirm: function(bResult,oController,poId){
		 if(bResult){ 
			 var aUrl = '/{{PACKAGE_NAME}}/services/poWorklistUpdate.xsjs?cmd=delete'+'&PurchaseOrderId='+escape(poId);
			 jQuery.ajax({
			       url: aUrl,
			       method: 'GET',
			       dataType: 'text',
			       success: function(myTxt){
			          	  oController.onDeleteSuccess(myTxt,oController); },
			       error: oController.onErrorCall });
		 }
	 },
     
	 //Approve Confirmation Dialog Results
	 approvalConfirm: function(bResult,oController,poId,action){
		 if(bResult){ 
			 var aUrl = '/{{PACKAGE_NAME}}/services/poWorklistUpdate.xsjs?cmd=approval'+'&PurchaseOrderId='+escape(poId)+'&Action='+escape(action);
			 jQuery.ajax({
			       url: aUrl,
			       method: 'GET',
			       dataType: 'text',
			       success: function(myTxt){
			          	  oController.onApprovalSuccess(myTxt,oController,action); },
			       error: oController.onErrorCall });
		 }
	 },
	 
	 //Delete Successful Event Handler
	 onDeleteSuccess: function(myTxt,oController){
		    	
		 oController.refreshTable();
		 sap.ui.commons.MessageBox.show(oBundle.getText("delete_success"), 
				 "SUCCESS",
				 oBundle.getText("title_delete_success") );

	 },
	
	 //Approval Successful Event Handler
	 onApprovalSuccess: function(myTxt,oController,action){
	    	
		 oController.refreshTable();
		 sap.ui.commons.MessageBox.show(oBundle.getText("title_approve_success",[action]), 
				 "SUCCESS",
				 oBundle.getText("title_approve_success")  );

	 },
	 
	 //Error Event Handler
	 onErrorCall: function(jqXHR, textStatus, errorThrown){
		 if(jqXHR.status == '500'){
		 sap.ui.commons.MessageBox.show(jqXHR.responseText, 
				 "ERROR",
				 oBundle.getText("error_action") );	
		         return;
		 }
		 else{
		 sap.ui.commons.MessageBox.show(jqXHR.statusText,
		         "ERROR",
		          oBundle.getText("error_action") );
		          return;
		 }
	 },
	 
	 //Utility function to refresh the table & reset # of recs in title
	 refreshTable: function(){
		 oTable = sap.ui.getCore().byId("poTable");
		 var sort1 = new sap.ui.model.Sorter("PURCHASEORDERID");
         oTable.bindRows("/PO_WORKLIST",sort1); 
         var iNumberOfRows = oTable.getBinding("rows").iLength;
	     oTable.setTitle(oBundle.getText("pos", [numericSimpleFormatter(iNumberOfRows)]));  		 
	 },
	 setFilter: function(terms)
	    {
		 
		    //filterTerms = terms;
		    var mySplitResults = terms.split(' | ' + oBundle.getText("attribute") + ' ');
		    gFilterTerms = mySplitResults[0];
		    gFilterAttribute = mySplitResults[1];

		    if(gFilterTerms=="*") this.emptyFilter();
		    
		    oTable = sap.ui.getCore().byId("poTable");

		    //Change from the Display Attribute Names to the property names in the ODATA service
		    switch(gFilterAttribute)
		    {
		    case 'Company Name': case 'Firmenname':
		    	gFilterAttribute='COMPANYNAME';
		    	break;
		    case 'Product ID': case 'Produkt':
		    	gFilterAttribute='PRODUCTID';
		    	break;	    	
		    case 'Product Name': case 'Produkt Benennung':
		    	gFilterAttribute='PRODUCTNAME';
		    	break;
		    case 'Product Description': case 'Produktbeschreibung':
		    	gFilterAttribute='PRODUCTDESC';
		    	break;
		    case 'City': case 'Stadt':
		        gFilterAttribute='CITY';
		        break;
		    case 'Category': case 'Kategorie':
		    	gFilterAttribute='CATEGORY';
		    	break;
		    case 'Purchase Order ID': case 'Auftragsbestätigung':
		    	gFilterAttribute='PURCHASEORDERID';
		    	break;
		    }
		    

		    //Build OData Service Sorter by PO ID, and Item
		    var sort1 = new sap.ui.model.Sorter("PURCHASEORDERID,PURCHASEORDERITEM");
		    //Build the OData Service Filter Options
		    if(gFilterTerms=="")
		    {   oTable.bindRows("/PO_WORKLIST",sort1,[]); }
		    else
		   	{ 	var aflt1 = new sap.ui.model.Filter(escape(gFilterAttribute),sap.ui.model.FilterOperator.EQ,escape(gFilterTerms));	 
		        oTable.bindRows("/PO_WORKLIST",sort1,[aflt1]); }
	    	
		    //Set the Number of Rows in table header and clear the table lead selection
	    	var iNumberOfRows = oTable.getBinding("rows").iLength;
	    	oTable.setTitle(oBundle.getText("pos",[numericSimpleFormatter(iNumberOfRows)]));    
	    	oTable.clearSelection();  
	    	
	    	
	    	//When a new search is executed, the detail item area must be cleared
	    	var oView = sap.ui.getCore().byId("po_detail_view"); 
			var Context = "/PO_WORKLIST(PURCHASEORDERID='JUNK')";
			oView.bindContext(Context);

			var oTableItem = sap.ui.getCore().byId("poItemTable");
			var ContextItem = "/PurchaseOrderHeader(PurchaseOrderId='JUNK')/PurchaseOrderItem";
			var sort1 = new sap.ui.model.Sorter("PurchaseOrderId,PurchaseOrderItem");
			oTableItem.bindRows(ContextItem,sort1);
	    },
	    
		
	emptyFilter: function()
	{
	    gFilterTerms ="";
	    gFilterAttribute ="";
	    
	    oTable = sap.ui.getCore().byId("poTable");
		var sort1 = new sap.ui.model.Sorter("PURCHASEORDERID,PURCHASEORDERITEM");
	    oTable.bindRows("/PO_WORKLIST",sort1); 
	 },

	 //Table Row Select Event Handler
	 
	 onRowSelect: function(oEvent){
		 var oTable = oEvent.getSource();
		 var povalue = oEvent.getSource().getModel().getProperty(
		     "PURCHASEORDERID",
		     oTable.getContextByIndex(oTable.getSelectedIndex()));
		 if(povalue){
		 gadgets.sapcontext.publish("rowSelect", povalue);
		 	}

	 },
});


