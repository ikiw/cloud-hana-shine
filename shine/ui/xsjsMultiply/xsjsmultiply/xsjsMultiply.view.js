sap.ui.jsview("xsjsmultiply.xsjsMultiply", {

      getControllerName : function() {
         return "xsjsmultiply.xsjsMultiply";
      },

      createContent : function(oController) {
    	  var multiplyPanel = new sap.ui.commons.Panel().setText("XS Service Test - Multiplication");
    	  
	      var layoutNew = new sap.ui.commons.layout.MatrixLayout({width:"auto"});
	      multiplyPanel.addContent(layoutNew);
	      var oVal1 = new sap.ui.commons.TextField("val1",{tooltip: "Value #1", editable:true});
	      var oVal2 = new sap.ui.commons.TextField("val2",{tooltip: "Value #2", editable:true});
	      var oResult = new sap.ui.commons.TextView("result",{tooltip: "Results"});
	      var oEqual = new sap.ui.commons.TextView("equal",{tooltip: "Equals", text: " = "});	      
	      var oMult = new sap.ui.commons.TextView("mult",{tooltip: "Multiply by", text: " * "});	
	      
	      //Attach a controller event handler to Value 1 Input Field
		  oVal1.attachEvent("liveChange", function(oEvent){
	        	oController.onLiveChange(oEvent,oVal2); });  
	      //Attach a controller event handler to Value 2 Input Field
		  oVal2.attachEvent("liveChange", function(oEvent){
	        	oController.onLiveChange(oEvent,oVal1); });  	      
         
	      
	      layoutNew.createRow(oVal1, oMult, oVal2, oEqual, oResult );
	      
	      return multiplyPanel;
      }

});