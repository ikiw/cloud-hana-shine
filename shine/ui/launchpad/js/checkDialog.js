jQuery.sap.declare("sap.account.CheckDialog");

sap.account.CheckDialog = function(oFrameController) {
	this.controller = oFrameController;
};

sap.account.CheckDialog.prototype.open = function() {

	var oContent = new sap.ui.commons.layout.VerticalLayout({
		height : "100%",
		width : "100%"
	});

	var oContentMatrix = new sap.ui.commons.layout.MatrixLayout({
		layoutFixed : false,
		columns : 2,
		width : '100%',
		height : '100%',
		widths : [ '50%', '50%' ]
	});

	// title
	oContentMatrix.addRow(createHeaderRow());

	// vspace
	oContentMatrix.addRow(new sap.ui.commons.layout.MatrixLayoutRow({
		height : '20px'
	}));

	// prompt to help document
	oRow = new sap.ui.commons.layout.MatrixLayoutRow();

	oCell = new sap.ui.commons.layout.MatrixLayoutCell({
		hAlign : sap.ui.commons.layout.HAlign.Left,
		width : '100%',
		colSpan: 2
	});
	oTextView = new sap.ui.commons.TextView({
        text: sap.app.i18n.getText("PRE_PROMPT"),
		design : sap.ui.commons.TextViewDesign.H3,
		width : '100%',
		textAlign : sap.ui.core.TextAlign.Center,
	});
	oCell.addContent(oTextView);
	oRow.addCell(oCell);
	oContentMatrix.addRow(oRow);
	
	// vspace
	oContentMatrix.addRow(new sap.ui.commons.layout.MatrixLayoutRow({
		height : '10px'
	}));
	
	// add the button to launch help guide pdf
	oRow = new sap.ui.commons.layout.MatrixLayoutRow();

	oCell = new sap.ui.commons.layout.MatrixLayoutCell({
		hAlign : sap.ui.commons.layout.HAlign.Center,
		width : '100%',
		colSpan: 2
	});
	
	var oLinkButton = new sap.ui.commons.Button({
		text : sap.app.i18n.getText("LINK_PROMPT"),
		style: sap.ui.commons.ButtonStyle.Accept,
		press : function() {
			window.open(sap.app.i18n.getText("PDF_LINK"));
		}
	});
	
	oCell.addContent(oLinkButton);
	oRow.addCell(oCell);
	oContentMatrix.addRow(oRow);	
	
	// vspace
	oContentMatrix.addRow(new sap.ui.commons.layout.MatrixLayoutRow({
		height : '10px'
	}));
	
	oContentMatrix.addRow(createDividerRow());
	
	var destroyDialog = function(oEvent) {
		oEvent.getSource().destroy();
	};
	
	// initialize dialog 
	var oCheckDialog = new sap.ui.commons.Dialog({
		modal : true,
		// a percentage width does result in an ugly vertical slider in Chrome
		width : '600px',
		content : oContent,
		closed : destroyDialog
	});
	
	// add rows
	// user role
	oRow = new sap.ui.commons.layout.MatrixLayoutRow();

	// user role prerequisite title
	oCell = new sap.ui.commons.layout.MatrixLayoutCell({
		hAlign : sap.ui.commons.layout.HAlign.Left,
	});
	oTextView = new sap.ui.commons.TextView({
		text : sap.app.i18n.getText("USER_ROLE_PRESENT"),
		design : sap.ui.commons.TextViewDesign.H3,
		textAlign : sap.ui.core.TextAlign.Left,
	});
	oTextView.addStyleClass('dialogTextColor');
	oCell.addContent(oTextView);
	
	// user role prerequisite status	
	var oCellStatus = new sap.ui.commons.layout.MatrixLayoutCell({
		hAlign : sap.ui.commons.layout.HAlign.Right,
	});
	oCheckDialog.userStatusLayout = new sap.ui.layout.HorizontalLayout({
		content: [ new sap.m.BusyIndicator({ size: "1.4em" }) ]
	});
	oCellStatus.addContent(oCheckDialog.userStatusLayout);
	oRow.addCell(oCell);
	oRow.addCell(oCellStatus);
	
	oContentMatrix.addRow(oRow);
	
	oContentMatrix.addRow(createDividerRow());
	
	// admin role
	oRow = new sap.ui.commons.layout.MatrixLayoutRow();

	// admin role prerequisite title
	oCell = new sap.ui.commons.layout.MatrixLayoutCell({
		hAlign : sap.ui.commons.layout.HAlign.Left,
	});
	oTextView = new sap.ui.commons.TextView({
		text : sap.app.i18n.getText("ADMIN_ROLE_PRESENT"),
		design : sap.ui.commons.TextViewDesign.H3,
		textAlign : sap.ui.core.TextAlign.Left,
	});
	oTextView.addStyleClass('dialogTextColor');
	oCell.addContent(oTextView);
	
	// admin role prerequisite status	
	oCellStatus = new sap.ui.commons.layout.MatrixLayoutCell({
		hAlign : sap.ui.commons.layout.HAlign.Right,
	});
	oCheckDialog.adminStatusLayout = new sap.ui.layout.HorizontalLayout({
		content: [ new sap.m.BusyIndicator({ size: "1.4em" }) ]
	});
	oCellStatus.addContent(oCheckDialog.adminStatusLayout);
	oRow.addCell(oCell);
	oRow.addCell(oCellStatus);
	
	oContentMatrix.addRow(oRow);
	
	oContentMatrix.addRow(createDividerRow());
	
	// analytic privilege
	oRow = new sap.ui.commons.layout.MatrixLayoutRow();

	// analytic privilege prerequisite title
	oCell = new sap.ui.commons.layout.MatrixLayoutCell({
		hAlign : sap.ui.commons.layout.HAlign.Left,
	});
	oTextView = new sap.ui.commons.TextView({
		text : sap.app.i18n.getText("ANALYTIC_PRIVILEGE"),
		design : sap.ui.commons.TextViewDesign.H3,
		textAlign : sap.ui.core.TextAlign.Left,
	});
	oTextView.addStyleClass('dialogTextColor');
	oCell.addContent(oTextView);
	
	// analytic privilege prerequisite status	
	oCellStatus = new sap.ui.commons.layout.MatrixLayoutCell({
		hAlign : sap.ui.commons.layout.HAlign.Right,
	});
	oCheckDialog.apStatusLayout = new sap.ui.layout.HorizontalLayout({
		content: [ new sap.m.BusyIndicator({ size: "1.4em" }) ]
	});
	oCellStatus.addContent(oCheckDialog.apStatusLayout);
	oRow.addCell(oCell);
	oRow.addCell(oCellStatus);
	
	oContentMatrix.addRow(oRow);
	
	oContentMatrix.addRow(createDividerRow());
	
	// time data role
	oRow = new sap.ui.commons.layout.MatrixLayoutRow();

	// time data role prerequisite title
	oCell = new sap.ui.commons.layout.MatrixLayoutCell({
		hAlign : sap.ui.commons.layout.HAlign.Left,
	});
	oTextView = new sap.ui.commons.TextView({
		text : sap.app.i18n.getText("TIME_DATA_GENERATED"),
		design : sap.ui.commons.TextViewDesign.H3,
		textAlign : sap.ui.core.TextAlign.Left,
	});
	oTextView.addStyleClass('dialogTextColor');
	oCell.addContent(oTextView);
	
	// time data role prerequisite status	
	oCellStatus = new sap.ui.commons.layout.MatrixLayoutCell({
		hAlign : sap.ui.commons.layout.HAlign.Right,
	});
	oCheckDialog.tdStatusLayout = new sap.ui.layout.HorizontalLayout({
		content: [ new sap.m.BusyIndicator({ size: "1.4em" }) ]
	});
	oCellStatus.addContent(oCheckDialog.tdStatusLayout);
	oRow.addCell(oCell);
	oRow.addCell(oCellStatus);
	
	oContentMatrix.addRow(oRow);
	
	oContentMatrix.addRow(createDividerRow());
	
	// add matrix layout to content
	oContent.addContent(oContentMatrix);

	var ok = function(oEvent) {
		oCheckDialog.close();
	};
	var okButton = new sap.ui.commons.Button({
		text : sap.app.i18n.getText("OK_BUTTON"),
		press : ok
	});
	oCheckDialog.addStyleClass("welcomeDlg");
	oCheckDialog.addButton(okButton).setDefaultButton(okButton).open();
	
	// check the prerequesites
	jQuery.ajax({
	       url: '/{{PACKAGE_NAME}}/ui/launchpad/services/checkPrerequisites.xsjs',
	       type: 'GET',
	       dataType: 'text',
	       success: function(data){
	    	   var response = JSON.parse(data);
	    	   // user check
	    	   oCheckDialog.userStatusLayout.removeAllContent();
	    	   if (response.hasUserRole) {
	    		   oCheckDialog.userStatusLayout.addContent(new sap.ui.commons.Image({
	    			   src: './launchpad/images/green_tick.png',
	    		   }));
	    	   } else {
	    		   oCheckDialog.userStatusLayout.addContent(new sap.ui.commons.Image({
	    			   src: './launchpad/images/red_cross.png',
	    		   }));
	    	   }
	    	   // admin check
	    	   oCheckDialog.adminStatusLayout.removeAllContent();
	    	   if (response.hasAdminRole) {
	    		   oCheckDialog.adminStatusLayout.addContent(new sap.ui.commons.Image({
	    			   src: './launchpad/images/green_tick.png',
	    		   }));
	    	   } else {
	    		   oCheckDialog.adminStatusLayout.addContent(new sap.ui.commons.Image({
	    			   src: './launchpad/images/red_cross.png',
	    		   }));
	    	   }
	    	   // analytic privilege check
	    	   oCheckDialog.apStatusLayout.removeAllContent();
	    	   if (response.hasAnalyticPrivilege) {
	    		   oCheckDialog.apStatusLayout.addContent(new sap.ui.commons.Image({
	    			   src: './launchpad/images/green_tick.png',
	    		   }));
	    	   } else {
	    		   oCheckDialog.apStatusLayout.addContent(new sap.ui.commons.Image({
	    			   src: './launchpad/images/red_cross.png',
	    		   }));
	    	   }
	    	   // time data check
	    	   oCheckDialog.tdStatusLayout.removeAllContent();
	    	   if (response.hasTimeData) {
	    		   oCheckDialog.tdStatusLayout.addContent(new sap.ui.commons.Image({
	    			   src: './launchpad/images/green_tick.png',
	    		   }));
	    	   } else {
	    		   oCheckDialog.tdStatusLayout.addContent(new sap.ui.commons.Image({
	    			   src: './launchpad/images/red_cross.png',
	    		   }));
	    	   }
	       },
	       error: function() {
	    	   alert(sap.app.i18n.getText("CANT_CHECK"));
	       } });
	
	function createHeaderRow() {
		var oRow = new sap.ui.commons.layout.MatrixLayoutRow();// {height : '25px'});
		var oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			colSpan : 2,
			hAlign : sap.ui.commons.layout.HAlign.Center
		});
		var textView = new sap.ui.commons.TextView({
			text : sap.app.i18n.getText("CHECKING_PRE"),
			design : sap.ui.commons.TextViewDesign.H1
		});
		textView.addStyleClass("welcomeHeaderTextAlign");
		textView.addStyleClass('dialogTextColor');
		var oHorizontalLayout = new sap.ui.commons.layout.HorizontalLayout({
			content : [ textView ]
		});
		oCell.addContent(oHorizontalLayout);
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