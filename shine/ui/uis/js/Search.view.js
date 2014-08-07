sap.ui.jsview("uis.js.Search", {

	getControllerName : function() {
		return "uis.js.Search"; 
	},

	createContent : function(oController) {

		  //Filter By Panel
	      var searchPanel = new sap.ui.commons.Panel({
	    	  height: '200px'
	      }).setText(oBundle.getText("filter"));
	      var layoutNew = new sap.ui.commons.layout.MatrixLayout({width:"100%"});
	      searchPanel.addContent(layoutNew);


	      //Filter By Search Field
	      var oSearch = new sap.ui.commons.SearchField("filterBy", {
	        //enableListSuggest: true,
	        maxHistoryItems: 0,
	        enableFilterMode: true,
	        startSuggestion: 1,
	        maxSuggestionItems: 5,
	        enableClear: true,
	        width: "100%",
	        search: function(oEvent){
	        	oController.setFilter(oEvent.getParameter("query")); },
	        suggest: oController.loadFilter });

	      //Layout Placement for Filter By Panel Content
	      layoutNew.createRow(new sap.ui.commons.Label({text: oBundle.getText("s_search")}));
	      layoutNew.createRow( oSearch );

	      
		return searchPanel;
	}
});