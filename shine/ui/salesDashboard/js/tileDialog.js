jQuery.sap.declare("sap.account.TileDialog");

sap.account.TileDialog = function(oFrameController) {
	this.controller = oFrameController;
};

sap.account.TileDialog.prototype.open = function(chartID) {
	
	// Chart 1: Sales by region, pie chart
	// Chart 2: Sales by Country, column chart
	// Chart 3: Sales Rank, bubble chart
	// Chart 4: Discount for region, pie chart
	// Chart 5: Compare Product Category Sales Year to Year, column chart
	// Chart 6: Sales by product, bubble chart
	
	var oContent = new sap.ui.commons.layout.VerticalLayout({
		height : "100%",
		width : "100%"
	});

	var oContentMatrix = new sap.ui.commons.layout.MatrixLayout({
		layoutFixed : false,
		columns : 1,
		width : '100%',
		height : '100%',
		widths : [ '100%' ]
	});

	// header
	oContentMatrix.addRow(createWelcomeHeaderRow(chartID));

	// vspace
	oContentMatrix.addRow(new sap.ui.commons.layout.MatrixLayoutRow({
		height : '30px'
	}));
	
	oContentMatrix.addRow(createDividerRow());
	
	// business scenario
	oRow = new sap.ui.commons.layout.MatrixLayoutRow();

	oCell = new sap.ui.commons.layout.MatrixLayoutCell({
		hAlign : sap.ui.commons.layout.HAlign.Left
	});
	oTextView = new sap.ui.commons.TextView({
		text : sap.app.i18n.getText("BUSINESS_SCENARIO"),
		design : sap.ui.commons.TextViewDesign.H3,
		width : '100%',
		textAlign : sap.ui.core.TextAlign.Left,
	});
	oTextView.addStyleClass('dialogTextColor');
	oCell.addContent(oTextView);
	oRow.addCell(oCell);
	oContentMatrix.addRow(oRow);
	
	oRow = new sap.ui.commons.layout.MatrixLayoutRow();

	oCell = new sap.ui.commons.layout.MatrixLayoutCell({
		hAlign : sap.ui.commons.layout.HAlign.Left,
		width : '100%'
	});
	oTextView = new sap.ui.commons.TextView({
		text : getBusinessScenario(chartID),
		design : sap.ui.commons.TextViewDesign.Standard,
	});
	oCell.addContent(oTextView);
	oRow.addCell(oCell);
	oContentMatrix.addRow(oRow);

	oContentMatrix.addRow(createDividerRow());
	
	// Major db tables/views
	oRow = new sap.ui.commons.layout.MatrixLayoutRow();

	oCell = new sap.ui.commons.layout.MatrixLayoutCell({
		hAlign : sap.ui.commons.layout.HAlign.Left
	});
	oTextView = new sap.ui.commons.TextView({
		text : sap.app.i18n.getText("MAJOR_TABLES"),
		design : sap.ui.commons.TextViewDesign.H3,
		width : '100%',
		textAlign : sap.ui.core.TextAlign.Left,
	});
	oTextView.addStyleClass('dialogTextColor');
	oCell.addContent(oTextView);
	oRow.addCell(oCell);
	oContentMatrix.addRow(oRow);
	
	oRow = new sap.ui.commons.layout.MatrixLayoutRow();

	oCell = new sap.ui.commons.layout.MatrixLayoutCell({
		hAlign : sap.ui.commons.layout.HAlign.Left,
		width : '100%'
	});
	oTextView = new sap.ui.commons.TextView({
		text : getModel(chartID),
		design : sap.ui.commons.TextViewDesign.Standard,
	});
	oCell.addContent(oTextView);
	oRow.addCell(oCell);
	oContentMatrix.addRow(oRow);

	oContentMatrix.addRow(createDividerRow());
	
	// UI views information
	oRow = new sap.ui.commons.layout.MatrixLayoutRow();

	oCell = new sap.ui.commons.layout.MatrixLayoutCell({
		hAlign : sap.ui.commons.layout.HAlign.Left
	});
	oTextView = new sap.ui.commons.TextView({
		text : sap.app.i18n.getText("UI_VIEWS"),
		design : sap.ui.commons.TextViewDesign.H3,
		width : '100%',
		textAlign : sap.ui.core.TextAlign.Left,
	});
	oTextView.addStyleClass('dialogTextColor');
	oCell.addContent(oTextView);
	oRow.addCell(oCell);
	oContentMatrix.addRow(oRow);
	
	oRow = new sap.ui.commons.layout.MatrixLayoutRow();

	oCell = new sap.ui.commons.layout.MatrixLayoutCell({
		hAlign : sap.ui.commons.layout.HAlign.Left,
		width : '100%'
	});
	oTextView = new sap.ui.commons.TextView({
		text : getUIViews(chartID),
		design : sap.ui.commons.TextViewDesign.Standard,
	});
	oCell.addContent(oTextView);
	oRow.addCell(oCell);
	oContentMatrix.addRow(oRow);

	oContentMatrix.addRow(createDividerRow());
	
	// Odata service used
	oRow = new sap.ui.commons.layout.MatrixLayoutRow();

	oCell = new sap.ui.commons.layout.MatrixLayoutCell({
		hAlign : sap.ui.commons.layout.HAlign.Left
	});
	oTextView = new sap.ui.commons.TextView({
		text : sap.app.i18n.getText("ODATA"),
		design : sap.ui.commons.TextViewDesign.H3,
		width : '100%',
		textAlign : sap.ui.core.TextAlign.Left,
	});
	oTextView.addStyleClass('dialogTextColor');
	oCell.addContent(oTextView);
	oRow.addCell(oCell);
	oContentMatrix.addRow(oRow);
	
	oRow = new sap.ui.commons.layout.MatrixLayoutRow();

	oCell = new sap.ui.commons.layout.MatrixLayoutCell({
		hAlign : sap.ui.commons.layout.HAlign.Left,
		width : '100%'
	});
	oTextView = new sap.ui.commons.TextView({
		text : getODataService(chartID),
		design : sap.ui.commons.TextViewDesign.Standard,
	});
	oCell.addContent(oTextView);
	oRow.addCell(oCell);
	oContentMatrix.addRow(oRow);

	oContentMatrix.addRow(createDividerRow());
	
	oContent.addContent(oContentMatrix);

	var destroyDialog = function(oEvent) {
		oEvent.getSource().destroy();
	};

	var oTileDialog = new sap.ui.commons.Dialog({
		modal : true,
		// a percentage width does result in an ugly vertical slider in Chrome
		width : '600px',
		content : oContent,
		closed : destroyDialog
	});

	var ok = function(oEvent) {
//		sap.app.localStorage.storePreference(sap.app.localStorage.PREF_DISPLAY_WELCOME_DIALOG, !oNotShowAgainChkBox
//				.getChecked());
		oTileDialog.close();
	};
	var okButton = new sap.ui.commons.Button({
		text : sap.app.i18n.getText("OK"),
		press : ok
	});
	oTileDialog.addStyleClass("welcomeDlg");
	oTileDialog.addButton(okButton).setDefaultButton(okButton).open();
	
	function getTitle(chartID) {
		switch (chartID) {
		case 1:
			return sap.app.i18n.getText("SALES_BY_REGION");
		case 2:
			return sap.app.i18n.getText("SALES_BY_COUNTRY");
		case 3:
			return sap.app.i18n.getText("SALES_RANK");
		case 4:
			return sap.app.i18n.getText("DISCOUNT_PER_REGION_TITLE");
		case 5:
			return sap.app.i18n.getText("COMPARE_PRODUCT_CATEGORY_YEAR");
		case 6:
			return sap.app.i18n.getText("PRODUCT_SALES");		
		}
	}
	
	function getBusinessScenario(chartID) {
		switch (chartID) {
		case 1:
			return sap.app.i18n.getText("CHART_BUSI_SCENARIO_1");
		case 2:
			return sap.app.i18n.getText("CHART_BUSI_SCENARIO_2");
		case 3:
			return sap.app.i18n.getText("CHART_BUSI_SCENARIO_3");
		case 4:
			return sap.app.i18n.getText("CHART_BUSI_SCENARIO_4");
		case 5:
			return sap.app.i18n.getText("CHART_BUSI_SCENARIO_5");
		case 6:
			return sap.app.i18n.getText("CHART_BUSI_SCENARIO_6");		
		}
	}
	
	function getModel(chartID) {
		switch (chartID) {
		case 1:
			return sap.app.i18n.getText("CHART_VIEW_1");
		case 2:
			return sap.app.i18n.getText("CHART_VIEW_2");
		case 3:
			return sap.app.i18n.getText("CHART_VIEW_3");
		case 4:
			return sap.app.i18n.getText("CHART_VIEW_4");
		case 5:
			return sap.app.i18n.getText("CHART_VIEW_5");
		case 6:
			return sap.app.i18n.getText("CHART_VIEW_6");		
		}
	}
	
	function getUIViews(chartID) {
		switch (chartID) {
		case 1:
			return sap.app.i18n.getText("CHART_UI_VIEW_1");
		case 2:
			return sap.app.i18n.getText("CHART_UI_VIEW_2");
		case 3:
			return sap.app.i18n.getText("CHART_UI_VIEW_3");
		case 4:
			return sap.app.i18n.getText("CHART_UI_VIEW_4");
		case 5:
			return sap.app.i18n.getText("CHART_UI_VIEW_5");
		case 6:
			return sap.app.i18n.getText("CHART_UI_VIEW_6");		
		}
	}
	
	function getODataService(chartID) {
		switch (chartID) {
		case 1:
			return sap.app.i18n.getText("CHART_ODATA_1");
		case 2:
			return sap.app.i18n.getText("CHART_ODATA_2");
		case 3:
			return sap.app.i18n.getText("CHART_ODATA_3");
		case 4:
			return sap.app.i18n.getText("CHART_ODATA_4");
		case 5:
			return sap.app.i18n.getText("CHART_ODATA_5");
		case 6:
			return sap.app.i18n.getText("CHART_ODATA_6");		
		}
	}
	
	function createWelcomeHeaderRow(chartID) {
		var oRow = new sap.ui.commons.layout.MatrixLayoutRow();// {height : '25px'});
		var oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			colSpan : 2,
			hAlign : sap.ui.commons.layout.HAlign.Center
		});
		var textView = new sap.ui.commons.TextView({
			text : getTitle(chartID),
			design : sap.ui.commons.TextViewDesign.H1
		});
		textView.addStyleClass("welcomeHeaderTextAlign");
		textView.addStyleClass('dialogTextColor');
		oCell.addContent(textView);
		oRow.addCell(oCell);
		return (oRow);
	}

	function createDividerRow() {
		// hDevider row
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		// horizontal divider
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			colSpan : 2,
			hAlign : sap.ui.commons.layout.HAlign.Left
		});
		var hDevider = new sap.ui.commons.HorizontalDivider();
		oCell.addContent(hDevider);
		oRow.addCell(oCell);
		return (oRow);
	}
};