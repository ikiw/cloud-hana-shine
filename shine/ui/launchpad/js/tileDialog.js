jQuery.sap.declare("sap.account.TileDialog");

sap.account.TileDialog = function(oFrameController) {
	this.controller = oFrameController;
};

sap.account.TileDialog.prototype.open = function(tileID) {

//	var showWelcomeDialog = sap.app.localStorage.getPreference(sap.app.localStorage.PREF_DISPLAY_WELCOME_DIALOG);

	var oNotShowAgainChkBox = new sap.ui.commons.CheckBox({
		text : sap.app.i18n.getText("DO_NOT_SHOW"),
		checked : true
	});

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
	oContentMatrix.addRow(createWelcomeHeaderRow(tileID));

	// vspace
	oContentMatrix.addRow(new sap.ui.commons.layout.MatrixLayoutRow({
		height : '30px'
	}));

	// description
	oRow = new sap.ui.commons.layout.MatrixLayoutRow();

	oCell = new sap.ui.commons.layout.MatrixLayoutCell({
		hAlign : sap.ui.commons.layout.HAlign.Left,
		width : '100%'
	});
	oTextView = new sap.ui.core.HTML({
        content: getContent(tileID),
		width: '100%'
	});
	oCell.addContent(oTextView);
	oRow.addCell(oCell);
	oContentMatrix.addRow(oRow);
	
	// vspace
	oContentMatrix.addRow(new sap.ui.commons.layout.MatrixLayoutRow({
		height : '10px'
	}));
	
	oContentMatrix.addRow(createDividerRow());
	
	// business scenario
	if (showBusinessScenario(tileID)) {
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
			text : getBusinessScenario(tileID),
			design : sap.ui.commons.TextViewDesign.Standard,
		});
		oCell.addContent(oTextView);
		oRow.addCell(oCell);
		oContentMatrix.addRow(oRow);
	
		oContentMatrix.addRow(createDividerRow());
	}
	
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
	oTextView = new sap.ui.core.HTML({
        content: getDBTablesViews(tileID),
		width: '100%'
	});
	oCell.addContent(oTextView);
	oRow.addCell(oCell);
	oContentMatrix.addRow(oRow);

	oContentMatrix.addRow(createDividerRow());
	
	// UI folder information
	oRow = new sap.ui.commons.layout.MatrixLayoutRow();

	oCell = new sap.ui.commons.layout.MatrixLayoutCell({
		hAlign : sap.ui.commons.layout.HAlign.Left
	});
	oTextView = new sap.ui.commons.TextView({
		text : sap.app.i18n.getText("UI_FOLDER"),
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
		text : getUIFolders(tileID),
		design : sap.ui.commons.TextViewDesign.Standard,
	});
	oCell.addContent(oTextView);
	oRow.addCell(oCell);
	oContentMatrix.addRow(oRow);

	oContentMatrix.addRow(createDividerRow());
	
	// Permission/roles/priviliges required
	oRow = new sap.ui.commons.layout.MatrixLayoutRow();

	oCell = new sap.ui.commons.layout.MatrixLayoutCell({
		hAlign : sap.ui.commons.layout.HAlign.Left
	});
	oTextView = new sap.ui.commons.TextView({
		text : sap.app.i18n.getText("PERMISSIONS"),
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
		text : getPermissions(tileID),
		design : sap.ui.commons.TextViewDesign.Standard,
	});
	oCell.addContent(oTextView);
	oRow.addCell(oCell);
	oContentMatrix.addRow(oRow);

	oContentMatrix.addRow(createDividerRow());
	
	// do not show again checkbox
	oContentMatrix.addRow(createNotShowAgainChkBoxRow(oNotShowAgainChkBox));

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
		setTimeout(function(){window.location = getHrefLocation(tileID);},1000);
	};
	var okButton = new sap.ui.commons.Button({
		text : sap.app.i18n.getText("CONTINUE"),
		press : ok
	});
	oTileDialog.addStyleClass("welcomeDlg");
	oTileDialog.addButton(okButton).setDefaultButton(okButton).open();
	
	function getIcon(tileID) {
		switch (tileID) {
		case 1:
			return "sap-icon://database";
		case 2:
			return "sap-icon://my-sales-order";
		case 3:
			return "sap-icon://sales-order";
		case 4:
			return "sap-icon://sales-order";
		case 5:
			return "sap-icon://account";
		case 6:
			return "sap-icon://widgets";
		case 7:
			return "sap-icon://widgets";
		}
	}
	
	function getHrefLocation(tileID) {
		switch (tileID) {
		case 1:
			return 'admin/admin.html';
		case 2:
			return 'ui/poworklist/poWorklist.html';
		case 3:
			return 'ui/salesDashboard/index.html';
		case 4:
			return 'ui/salesDashboard/soWorklist.html';
		case 5:
			return 'ui/userCRUD/index.html';
		case 6:
			return '/i053959sapdev/uis/clients/ushell-app/shells/hana/shell.html#appsite-display~ctx?siteID=sap%7Chana%7Cdemocontent%7Cepm%7Cui%7Cuis%7Csite%7CUISExample';
		case 7:
			return '/i053959sapdev/uis/clients/desktop/applications/uis/runtime.html?siteID=sap%7Chana%7Cdemocontent%7Cepm%7Cui%7Cuis%7Csite%7CUISExample#context/eyJjdHhSb3V0ZUlkIjoiMTM4MzA1MTUzODI3MiIsImNvbnRleHRNYXAiOnt9fQ==';
		}
	}
	
	function getTitle(tileID) {
		switch (tileID) {
		case 1:
			return sap.app.i18n.getText("DG");
		case 2:
			return sap.app.i18n.getText("POWLIST");
		case 3:
			return sap.app.i18n.getText("SALES_DASH");
		case 4:
			return sap.app.i18n.getText("SOWLIST");
		case 5:
			return sap.app.i18n.getText("USER");
		case 6:
			return sap.app.i18n.getText("HANA_UIS_BLUE");
		case 7:
			return sap.app.i18n.getText("HANA_UIS_GOLD");
		}
	}
	
	function getContent(tileID) {
		switch (tileID) {
		case 1:
			return sap.app.i18n.getText("TILE_DESC_DG");
		case 2:
			return sap.app.i18n.getText("TILE_DESC_PO");
		case 3:
			return sap.app.i18n.getText("TILE_DESC_SD");
		case 4:
			return sap.app.i18n.getText("TILE_DESC_SO");
		case 5:
			return sap.app.i18n.getText("TILE_DESC_US");
		case 6:
			return sap.app.i18n.getText("TILE_DESC_UIS_BLUE");
		case 7:
			return sap.app.i18n.getText("TILE_DESC_UIS_GOLD");
		}
	}
	
	function showBusinessScenario(tileID) {
		switch (tileID) {
		case 1:
			return false;
		case 2:
			return false;
		case 3:
			return true;
		case 4:
			return false;
		case 5:
			return false;
		case 6:
			return false;
		case 7:
			return false;
		}
	}
	
	function getBusinessScenario(tileID) {
		switch (tileID) {
		case 3:
			return sap.app.i18n.getText("TILE_BUSI_SCEN_SD");
		}
	}
	
	function getDBTablesViews(tileID) {
		switch (tileID) {
		case 1:
			return sap.app.i18n.getText("TILE_DB_VIEWS_DG");
		case 2:
			return sap.app.i18n.getText("TILE_DB_VIEWS_PO");
		case 3:
			return sap.app.i18n.getText("TILE_DB_VIEWS_SD");
		case 4:
			return sap.app.i18n.getText("TILE_DB_VIEWS_SO");
		case 5:
			return sap.app.i18n.getText("TILE_DB_VIEWS_US");
		case 6:
			return sap.app.i18n.getText("TILE_DB_VIEWS_UIS_BLUE");
		case 7:
			return sap.app.i18n.getText("TILE_DB_VIEWS_UIS_GOLD");
		}
	}
	
	function getUIFolders(tileID) {
		switch (tileID) {
		case 1:
			return sap.app.i18n.getText("TILE_UI_FOLDER_DG");
		case 2:
			return sap.app.i18n.getText("TILE_UI_FOLDER_PO");
		case 3:
			return sap.app.i18n.getText("TILE_UI_FOLDER_SD");
		case 4:
			return sap.app.i18n.getText("TILE_UI_FOLDER_SO");
		case 5:
			return sap.app.i18n.getText("TILE_UI_FOLDER_US");
		case 6:
			return sap.app.i18n.getText("TILE_UI_FOLDER_UIS_BLUE");
		case 7:
			return sap.app.i18n.getText("TILE_UI_FOLDER_UIS_GOLD");
		}
	}

	function getPermissions(tileID) {
		switch (tileID) {
		case 1:
			return sap.app.i18n.getText("TILE_PERMS_DG");
		case 2:
			return sap.app.i18n.getText("TILE_PERMS_PO");
		case 3:
			return sap.app.i18n.getText("TILE_PERMS_SD");
		case 4:
			return sap.app.i18n.getText("TILE_PERMS_SO");
		case 5:
			return sap.app.i18n.getText("TILE_PERMS_US");
		case 6:
			return sap.app.i18n.getText("TILE_PERMS_UIS_BLUE");
		case 7:
			return sap.app.i18n.getText("TILE_PERMS_UIS_GOLD");
		}
	}
	
	function createWelcomeHeaderRow(tileID) {
		var oRow = new sap.ui.commons.layout.MatrixLayoutRow();// {height : '25px'});
		var oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			colSpan : 2,
			hAlign : sap.ui.commons.layout.HAlign.Center
		});
		var textView = new sap.ui.commons.TextView({
			text : getTitle(tileID),
			design : sap.ui.commons.TextViewDesign.H1
		});
		textView.addStyleClass("welcomeHeaderTextAlign");
		textView.addStyleClass('dialogTextColor');
		var oHorizontalLayout = new sap.ui.commons.layout.HorizontalLayout({
			content : [ new sap.ui.core.Icon({
			      src : getIcon(tileID),
			      size: '26px',
			      color: '#007CC0'
			}), textView ]
		});
		oCell.addContent(oHorizontalLayout);
		oRow.addCell(oCell);
		return (oRow);
	}

	function createNotShowAgainChkBoxRow(oNotShowAgainChkBox) {
		var oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		var oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			colSpan : 2,
			hAlign : sap.ui.commons.layout.HAlign.Right
		});
		oCell.addContent(oNotShowAgainChkBox);
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