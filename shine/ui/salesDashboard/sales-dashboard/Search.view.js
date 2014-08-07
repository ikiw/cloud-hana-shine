sap.ui.jsview("sales-dashboard.Search", {

	getControllerName : function() {
		return "sales-dashboard.Search";
	},

	createContent : function(oController) {
		
		  //Filter By Panel
	      var searchPanel = new sap.ui.commons.Panel().setText(sap.app.i18n.getText("FILTER"));
	      var layoutNew = new sap.ui.commons.layout.MatrixLayout({width:"auto"});
	      searchPanel.addContent(layoutNew);


	      //Filter By Search Field
	      var oSearch = new sap.ui.commons.SearchField("filterBy", {
	        //enableListSuggest: true,
			enableListSuggest: false,
			enableClear: true,
			startSuggestion: 0,
	        width: "250px",
	        search: oController.loadFilter,
	        suggest: oController.loadFilter });

 
	      //Layout Placement for Filter By Panel Content
	      layoutNew.createRow(new sap.ui.commons.Label({text: sap.app.i18n.getText("FUZZY_SEARCH")}), oSearch );
	      
		return searchPanel;
	}
}); 