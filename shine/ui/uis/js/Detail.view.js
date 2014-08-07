sap.ui.jsview("uis.js.Detail", {

	getControllerName : function() {
		return "uis.js.Detail";
	},

	createContent : function(oController) {
		
	  var oModel = new sap.ui.model.odata.ODataModel("/{{PACKAGE_NAME}}/services/poWorklistJoin.xsodata/", false);
	  this.setModel(oModel);
	
	  var oTabStrip = new sap.ui.commons.TabStrip("tabStripDetail");
	  oTabStrip.setWidth("100%");
	  
	  
	  //General Data Tab
	  buildGeneralTab(oController, oTabStrip);
	    
	  //Item Tab
	  buildItemsTab(oController, oTabStrip);

	  //Notes Tab
	  buildNotesTab(oController, oTabStrip);
	  
	  
	  gadgets.HubSettings.onConnect = registerContext;
	  function registerContext(){
		  function rowSelectContextChanged(topic, context){
			  /*Get property rowSelect from context and call Detail.Controller contextRowSelect(purchase_order_id)*/
			  var poId = context.getPropertyByKey("rowSelect")[0];
			  oController.contextRowSelect(poId);
		  }
		  /*UIS - Register context changes for property rowSelect*/
		  gadgets.sapcontext.subscribe(rowSelectContextChanged); 
	  }

	  
	  return oTabStrip;
	}
});

function buildGeneralTab(oController,oTabStrip){

	  //Purchase Order Id
	  oLayout = new sap.ui.commons.layout.MatrixLayout("mLayout1",{columns: 4} );
	  var oText = new sap.ui.commons.TextField("txtPurchaseOrderId",{tooltip: oBundle.getText("poid"), editable:false});
	  oText.bindProperty("value", "PurchaseOrderId");
	  var oLabel = new sap.ui.commons.Label("lblPurchaseOrderId", {text: oBundle.getText("spoid"), labelFor:oText});
	  
	  //Partner ID
	  var oText2 = new sap.ui.commons.TextField("txtPartnerId",{tooltip: oBundle.getText("bpart"), editable:false});
	  oText2.bindProperty("value", "PartnerId");
	  var oLabel2 = new sap.ui.commons.Label("lblPartnerId", {text:oBundle.getText("bpart"), labelFor:oText2});
	  oLayout.createRow(oLabel,oText,oLabel2,oText2);
	  
	  //Employee Responsible
	  var oText = new sap.ui.commons.TextField("LoginName_1",{tooltip: oBundle.getText("changeby"), editable:false});
	  oText.bindProperty("value", "CreatedByLoginName")
	  var oLabel = new sap.ui.commons.Label("lblPLoginName_1", {text: oBundle.getText("employee"), labelFor:oText});
	  
	  //Company Name
	  var oText2 = new sap.ui.commons.TextField("txtCompanyName",{tooltip: oBundle.getText("company"), editable:false});
	  oText2.bindProperty("value", "CompanyName")
	  var oLabel2 = new sap.ui.commons.Label("lblCompanyName", {text: oBundle.getText("company"), labelFor:oText2});
	  oLayout.createRow(oLabel,oText,oLabel2,oText2);
	  
	  //Net Amount
	  oTextView1 = new sap.ui.commons.TextView().bindText("NetAmount",numericFormatter);
	  oTextView1.setTextAlign(sap.ui.core.TextAlign.End);
	  oTextView1.setWidth("100px");
	  var oLabel = new sap.ui.commons.Label("lblNetAmount", {text: oBundle.getText("net"), labelFor:oTextView1});
	  oTextView2 = new sap.ui.commons.TextView().bindText("Currency");
	  oTextView2.setTextAlign(sap.ui.core.TextAlign.End);
	  oTextView2.setWidth("30px");	  
	  oCell = new sap.ui.commons.layout.MatrixLayoutCell();
	  oCell.addContent(oTextView1); oCell.addContent(oTextView2);
	  oLayout.createRow(oLabel,oCell);
    
	  //Tax Amount
	  oTextView1 = new sap.ui.commons.TextView().bindText("TaxAmount",numericFormatter);
	  oTextView1.setTextAlign(sap.ui.core.TextAlign.End);
	  oTextView1.setWidth("100px");	  
	  var oLabel = new sap.ui.commons.Label("lblTaxAmount", {text: oBundle.getText("tax"), labelFor:oTextView1});
	  oTextView2 = new sap.ui.commons.TextView().bindText("Currency");
	  oTextView2.setTextAlign(sap.ui.core.TextAlign.End);
	  oTextView2.setWidth("30px");	  
	  oCell = new sap.ui.commons.layout.MatrixLayoutCell();
	  oCell.addContent(oTextView1); oCell.addContent(oTextView2);
	  oLayout.createRow(oLabel,oCell);
    
	  //Gross Amount
	  oTextView1 = new sap.ui.commons.TextView().bindText("GrossAmount",numericFormatter);
	  oTextView1.setTextAlign(sap.ui.core.TextAlign.End);
	  oTextView1.setWidth("100px");	  
	  var oLabel = new sap.ui.commons.Label("lblGrossAmount", {text: oBundle.getText("gross"), labelFor:oTextView1});
	  oTextView2 = new sap.ui.commons.TextView().bindText("Currency");
	  oTextView2.setTextAlign(sap.ui.core.TextAlign.End);
	  oTextView2.setWidth("30px");	  
	  oCell = new sap.ui.commons.layout.MatrixLayoutCell();
	  oCell.addContent(oTextView1); oCell.addContent(oTextView2);
	  oLayout.createRow(oLabel,oCell);
    
	  oTabStrip.createTab(oBundle.getText("general"),oLayout);	
}

function buildItemsTab(oController,oTabStrip){
	var oModelItem = new sap.ui.model.odata.ODataModel("/{{PACKAGE_NAME}}/services/poWorklistJoin.xsodata/", false);
 	var arrayHeaders = new Array();
    var oControl;
    oTable = new sap.ui.table.Table("poItemTable",{tableId: "poItems",
             visibleRowCount: 6,
             navigationMode: sap.ui.table.NavigationMode.Paginator,
             selectionMode: sap.ui.table.SelectionMode.None });
    oTable.setTitle(oBundle.getText("po_item"));
    
    //Table Column Definitions
    //Purchase Order Id
    oControl = new sap.ui.commons.TextView().bindProperty("text","PURCHASEORDERITEM");
    oTable.addColumn(new sap.ui.table.Column({label:new sap.ui.commons.Label({text: oBundle.getText("item")}), template: oControl, sortProperty: "PURCHASEORDERITEM", filterProperty: "PURCHASEORDERITEM", width: "100px" }));
    
    //Product Id
    oControl = new sap.ui.commons.TextView().bindProperty("text","PRODUCTID");
    oTable.addColumn(new sap.ui.table.Column({label:new sap.ui.commons.Label({text: oBundle.getText("product")}), template: oControl, sortProperty: "PRODUCTID", filterProperty: "PRODUCTID", width: "100px" }));
    oTable.setModel(oModelItem);
    
    //Product Description
    oControl = new sap.ui.commons.TextView().bindProperty("text","PRODUCTDESC");
    oTable.addColumn(new sap.ui.table.Column({label:new sap.ui.commons.Label({text: oBundle.getText("product_desc")}), template: oControl, sortProperty: "PRODUCTDESC", filterProperty: "PRODUCTDESC", width: "250px" }));
    oTable.setModel(oModelItem);
    
    //Quantity
    oControl = new sap.ui.commons.TextView().bindText("QUANTITY",numericFormatter);
    oControl.setTextAlign("End");
    oTable.addColumn(new sap.ui.table.Column({label:new sap.ui.commons.Label({text: oBundle.getText("quantity")}), template: oControl, sortProperty: "QUANTITY", hAlign: sap.ui.commons.layout.HAlign.End, width: "100px"}));

    //Quantity Unit	
    oControl = new sap.ui.commons.TextView().bindProperty("text","QUANTITYUNIT");
    oTable.addColumn(new sap.ui.table.Column({label:new sap.ui.commons.Label({text: oBundle.getText("quantity_unit")}), 
    	template: oControl, sortProperty: "QUANTITYUNIT", filterProperty: "QUANTITYUNIT", width: "80px" }));
    oTable.setModel(oModelItem);
    
    //Gross Amount
    oControl = new sap.ui.commons.TextView().bindText("GROSSAMOUNT",numericFormatter);
    oControl.setTextAlign("End");
    oTable.addColumn(new sap.ui.table.Column({label:new sap.ui.commons.Label({text: oBundle.getText("gross")}), template: oControl, sortProperty: "GROSSAMOUNT",  hAlign: sap.ui.commons.layout.HAlign.End, width: "100px"}));

    //Currency
    oControl = new sap.ui.commons.TextView().bindProperty("text","CURRENCY");
    oTable.addColumn(new sap.ui.table.Column({label:new sap.ui.commons.Label({text: oBundle.getText("currency")}), template: oControl, sortProperty: "CURRENCY", filterProperty: "CURRENCY", width: "100px" }));
    oTable.setModel(oModelItem);
          
	oTabStrip.createTab(oBundle.getText("items"),oTable);	
}

function buildNotesTab(oController,oTabStrip){
	  oLayout = new sap.ui.commons.layout.MatrixLayout("mLayout2",{columns: 1} );

	  // Supplier Notes	Label
	  var oLabel = new sap.ui.commons.Label("lblNotes");
  oLabel.setText(oBundle.getText("supplier_note"));
  oLabel.setDesign(sap.ui.commons.LabelDesign.Bold);
  oLayout.createRow(oLabel);
  
  var oCell = new sap.ui.commons.layout.MatrixLayoutCell({colSpan: 1});
  oCell.addContent(new sap.ui.commons.HorizontalDivider());
  oLayout.createRow(oCell);
  
  //Supplier Notes Text
  var oTextView = new sap.ui.commons.TextView();
  oTextView.bindProperty("text", "SupplierCompanyName");
  oLayout.createRow(oTextView);
  	  
	  oTabStrip.createTab(oBundle.getText("notes"),oLayout);	
}

