sap.ui.jsview("launchpad.main", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf shine-so.main
	*/ 
	getControllerName : function() {
		return "launchpad.main";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf launchpad.main
	*/ 
	createContent : function(oController) {
		var app = new sap.m.App({initialPage:"home"});
		
		var adminTile = new sap.m.StandardTile({
			icon : "sap-icon://database",
			// number : "89",
			//title : 'Data Generator',
			//type : "Monitor",
			removable : false,
			press : function(oEvent) {
				
				var tileDialog = new sap.account.TileDialog(this);
				tileDialog.open(1);
				
			},
		    info : sap.app.i18n.getText("DG"),
		    infoState : "None"
		});
		adminTile.addStyleClass('templateTileClass');
		adminTile.addStyleClass('dgClass');

		var poTile = new sap.m.StandardTile({
			icon : "sap-icon://my-sales-order",
			// type : "Monitor",
			//number : "2",
			//numberUnit : "Dec",
			//title : 'Purchase Order Worklist',
			info : sap.app.i18n.getText("POWLIST"),
			infoState : "None",
			removable : false,
			press : function(oEvent) {
				var tileDialog = new sap.account.TileDialog(this);
				tileDialog.open(2);
			}
		});
		poTile.addStyleClass('templateTileClass');
		poTile.addStyleClass('poClass');

		var soTile = new sap.m.StandardTile({
			// type : "Create",
			icon : "sap-icon://sales-order",
			//title : 'Sales Dashboard',
			//number : "8.45",
			//numberUnit : "CGPA",
			info : sap.app.i18n.getText("SALES_DASH"),
			infoState : "None",
			removable : false,
			press : function(oEvent) {
				var tileDialog = new sap.account.TileDialog(this);
				tileDialog.open(3);				
			}
		});
		soTile.addStyleClass('templateTileClass');
		soTile.addStyleClass('soClass');

		var sowTile = new sap.m.StandardTile({
			// type : "Create",
			icon : "sap-icon://sales-order",
			//title : 'Sales Dashboard',
			//number : "8.45",
			//numberUnit : "CGPA",
			info : sap.app.i18n.getText("SOWLIST"),
			infoState : "None",
			removable : false,
			press : function(oEvent) {
				var tileDialog = new sap.account.TileDialog(this);
				tileDialog.open(4);					
			}
		});
		sowTile.addStyleClass('templateTileClass');
		sowTile.addStyleClass('sowClass');
		
		var userTile = new sap.m.StandardTile({
			icon : "sap-icon://account",
			//number : "1",
			//numberUnit : "NEW",
			//title : 'User CRUD',
			info : sap.app.i18n.getText("USER"),
			infoState : "None",
			removable : false,
			press : function(oEvent) {
				var tileDialog = new sap.account.TileDialog(this);
				tileDialog.open(5);				
			}
		});
		userTile.addStyleClass('templateTileClass');
		userTile.addStyleClass('ucClass');

		var items = [ adminTile, poTile, soTile, sowTile,
			          userTile, ];
		
		// create tile container
		var tileContainer = new sap.m.TileContainer({
			tileDelete : function(evt) {
				var tile = evt.getParameter("tile");
				evt.getSource().removeTile(tile);
			},
			tiles : items,
		});
		
		var titleLabel = new sap.m.Label({
			design : sap.m.LabelDesign.Bold,
			text : 'SHINE (SAP HANA Interactive Education)',
		});
		
		var page = new sap.m.Page("home", {
			// title: "Home",
			icon : 'images/sap_uex_sign_big.png',
			customHeader : new sap.m.Bar({
				// enableFlexBox: true,
				contentMiddle : [ new sap.m.Image({
					height : '26px',
					src : 'images/sap_uex_sign_big.png',
				}),
				// label
				titleLabel ]
			}),
			content : [ tileContainer ],
			enableScrolling : false
		});
		
		app.addPage(page);
		return app;
	}

});