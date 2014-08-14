sap.ui.controller("sales-dashboard.overview", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf shine-so.overview
*/
	onInit: function() {
		var view = this.getView();
		
		var oRegionModel = new sap.ui.model.json.JSONModel();
		oRegionModel.setData(
		        [
		         		{region:"AMER", key:"AMER"},
		                {region:"AFR", key:"AFR"},
		                {region:"APJ", key:"APJ"},
		                {region:"EMEA", key:"EMEA"},
		         ]);
		view.dropDown.setModel(oRegionModel);
		
		var oDiscountModel = new sap.ui.model.odata.ODataModel("../../services/salesDiscount.xsodata/");
		
		var filterParam = '';
		if (view.dropDown.getSelectedKey() == '') {
			filterParam = 'AMER';
		} else {
			filterParam = view.dropDown.getSelectedKey();
		}
		
		this.onFilterChange(filterParam, view);
		
		view.oDiscountChart.setModel(oDiscountModel);
		
	},
	
	onFilterChange: function(aFilter, view) {
		var oDataset = new sap.viz.ui5.data.FlattenedDataset({
			dimensions : [ 
				{
					axis : 1, // must be one for the x-axis, 2 for y-axis
					name : 'Company', 
					value : "{COMPANY_NAME}"
				} 
			],
			measures : [ 
			    // measure 1
				{
					name : 'Discount %', // 'name' is used as label in the Legend 
					value : '{DISCOUNT}' // 'value' defines the binding for the displayed value   
				} 
			],
			

		});
		
		oDataset.bindData({
		    path: "/InputParams(IP_EMEA='EMEA',IP_AMER='AMER',IP_APJ='APJ',IP_AFR='AFR')/Results",
		    filters: [new sap.ui.model.odata.Filter("REGION", [{operator:sap.ui.model.FilterOperator.EQ, value1:aFilter}]),
		              new sap.ui.model.odata.Filter("DISCOUNT", [{operator:sap.ui.model.FilterOperator.GT, value1:0}])]
		});
		
		view.oDiscountChart.setDataset(oDataset);
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf shine-so.overview
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf shine-so.overview
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf shine-so.overview
*/
//	onExit: function() {
//
//	}

});