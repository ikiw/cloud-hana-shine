sap.ui.controller("uis.js.Search", {

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

	setFilter: function(terms,attribute)
	{
		gadgets.sapcontext.publish("searchTerms", terms);
			
	},
	
	emptyFilter: function()
	{
	    gFilterTerms ="";
	    gFilterAttribute ="";
	    
	    
	    oTable = sap.ui.getCore().byId("poTable");
		var sort1 = new sap.ui.model.Sorter("PURCHASEORDERID,PURCHASEORDERITEM");
        oTable.bindRows("/PO_WORKLIST",sort1); 
	},

	loadFilter: function(oEvent)
	{
	    gSearchParam = oEvent.getParameter("value");
	    var aUrl = '/{{PACKAGE_NAME}}/services/poWorklistQuery.xsjs?cmd=filter'+'&query='+escape(oEvent.getParameter("value"))+'&page=1&start=0&limit=25';
	    jQuery.ajax({
	       url: aUrl,
	       method: 'GET',
	       dataType: 'json',
	       success: onLoadFilter,
	       error: onErrorCall });
	}      
});

function onLoadFilter(myJSON){
	  var oSearchControl = sap.ui.getCore().byId("filterBy");
	  var aSuggestions = [];
	  for( var i = 0; i<myJSON.length; i++)
	     {
	       aSuggestions[i] = myJSON[i].terms + ' | ' + oBundle.getText("attribute") + ' ' + myJSON[i].attribute;
	     }

	  oSearchControl.suggest(gSearchParam, aSuggestions); //Set the found suggestions on the search control

	}


function onErrorCall(jqXHR, textStatus, errorThrown){
 	  if(jqXHR.status == '500'){
 		 sap.ui.commons.MessageBox.show(jqXHR.responseText, 
 				 "ERROR",
 				oBundle.getText("error_action")  );	
 		return;	
  }
  else{
	         sap.ui.commons.MessageBox.show(jqXHR.statusText, 
 				 "ERROR",
 				oBundle.getText("error_action")  );	
 		return;	
  }
}