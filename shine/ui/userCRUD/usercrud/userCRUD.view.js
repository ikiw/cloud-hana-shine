sap.ui.jsview("usercrud.userCRUD", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf usercrud.userCRUD
	*/ 
	getControllerName : function() {
		return "usercrud.userCRUD";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf usercrud.userCRUD
	*/ 
	createContent : function(oController) {
		var view = this;
  	  
  		var oLayout = new sap.ui.commons.layout.MatrixLayout();
  		this.oModel = new sap.ui.model.odata.ODataModel("../../services/user.xsodata/", true);
  		  	  
  		var updatePanel = new sap.ui.commons.Panel("updPanel").setText('New User Record Details');
  		var layoutNew = new sap.ui.commons.layout.MatrixLayout({width:"auto"}); 
      
	      var oVal1 = new sap.ui.commons.TextField("fName",{tooltip: "First Name", width: "200px", editable:true});
	      var oVal2 = new sap.ui.commons.TextField("lName",{tooltip: "Last Name", width: "200px", editable:true});
	      var oVal3 = new sap.ui.commons.TextField("email",{tooltip: "Email", width: "200px", editable:true});   		      
	      var oExcButton = new sap.ui.commons.Button({
	          text : "Create Record",
	          press : oController.callUserService });
	      layoutNew.createRow(new sap.ui.commons.Label({text: "First Name: "}), oVal1 ); //oExcButton );  
		      layoutNew.createRow(new sap.ui.commons.Label({text: "Last Name: "}), oVal2 ); //oExcButton ); 
		      layoutNew.createRow(new sap.ui.commons.Label({text: "Email: "}), oVal3, oExcButton );    		      
	      updatePanel.addContent(layoutNew);
	      oLayout.createRow(updatePanel);
	      
	      var launchBatchDialog = new sap.ui.commons.Button({
				text : "Create users with batch request",
				press : function() {
					view.createNewBatchDialog(oController);
					//oController.onSubmit(min, max);
				}
			  });
		   	  
		  
	   // for batch request
	      oLayout.createRow(launchBatchDialog);
	      
    	  oTable = new sap.ui.table.Table("userTbl",{tableId: "tableID", 
    	    visibleRowCount: 10, navigationMode: sap.ui.table.NavigationMode.Paginator,columnHeaderHeight: 28,enableColumnReordering:false,setShowSortMenuEntry:false}); 
    	  oTable.setTitle("Users"); 
    	  
    	  //Table Column Definitions
    	  var oMeta = this.oModel.getServiceMetadata();
          var oControl;
          
	   	  for ( var i = 0; i < oMeta.dataServices.schema[0].entityType[0].property.length; i++) {
	   		  var property = oMeta.dataServices.schema[0].entityType[0].property[i];
	   		  
	          oControl = new sap.ui.commons.TextField({change: oController.updateService } ).bindProperty("value",property.name);
	          if(property.name === 'PERS_NO'){
	        	  oControl.setEditable(false);
	          }
	          oTable.addColumn(new sap.ui.table.Column({label:new sap.ui.commons.Label({text: property.name}), template: oControl,  filterProperty: property.name, filterOperator: sap.ui.model.FilterOperator.EQ, flexible: true }));
	      }		   	  
    	    	  
    	  oTable.setModel(this.oModel); 

    	  oTable.bindRows("/Users", null, new sap.ui.model.Sorter("PERS_NO", true));
    	  oTable.setTitle("Users" ); 
    	  oTable.setEditable(true);
    	  
    	  		  
	      oLayout.createRow(oTable);
    	  return oLayout;
    	  

      },

      
      createNewBatchDialog: function(oController) {
  		  var view = this;
  		  
  		  view.oDialog = new sap.ui.commons.Dialog({modal: true});
			
		  // create a simple matrix layout
		  view.batchLayout = new sap.ui.commons.layout.MatrixLayout({
				layoutFixed : false,
				width: '100%'
	      });
		  
		  // add the first row
		  view.createNewLineItemContent(oController, view.batchLayout, false);
		
		  var submitButton = new sap.ui.commons.Button({
			text : "Submit",
			style: sap.ui.commons.ButtonStyle.Accept,
			press : function() {
				
				oController.onSubmitBatch(oController);
			}
		  });
		  
		  var addLineItemButton = new sap.ui.commons.Button({
				text : "Add a new record",
				icon : "images/AddLineItem.gif",
				press : function() {
					view.createNewLineItemContent(oController, view.batchLayout, true);
				}
			});
			
		  var containerLayout = new sap.ui.commons.layout.MatrixLayout({
			  layoutFixed : false,
			  width: '100%'
		  });
	
		  containerLayout.createRow(view.batchLayout);
		  
		  containerLayout.createRow(new sap.ui.commons.layout.MatrixLayoutCell({
			  content: [addLineItemButton],
			  hAlign: sap.ui.commons.layout.HAlign.Center
		  }));
		  
	      view.oDialog.setTitle("Create users with batch request");
		  view.oDialog.addContent(containerLayout);
		  view.oDialog.addButton(submitButton);
		  view.oDialog.open();
	},
		
	createNewLineItemContent: function(oController, layout, withDelete) {
		
      var view = oController.getView();
		
      var oVal1 = new sap.ui.commons.TextField({placeholder: "First Name", width: "200px", editable:true});
      var oVal2 = new sap.ui.commons.TextField({placeholder: "Last Name", width: "200px", editable:true});
      var oVal3 = new sap.ui.commons.TextField({placeholder: "Email", width: "200px", editable:true});   	
	  
	  var deleteBtn = new sap.ui.commons.Button({
		  icon: "images/DeleteLineItem.gif",
		  iconHovered: "images/DeleteLineItemHover.gif",
		  iconSelected: "images/DeleteLineItemHover.gif",
		  tooltip: "Remove this Row",
		  width: "30px",
	      press : function(oControlEvent) {
	    	  var parent = this.getParent().getParent();
	    	  view.batchLayout.removeRow(parent);
	      }
	  
	  });
	
	  if (withDelete) {
		  layout.createRow( oVal1, oVal2, oVal3, deleteBtn);
	  } else {
		  layout.createRow( oVal1, oVal2, oVal3);
	  }
	}
});
