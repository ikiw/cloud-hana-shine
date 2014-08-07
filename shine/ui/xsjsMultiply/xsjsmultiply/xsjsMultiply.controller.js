sap.ui.controller("xsjsmultiply.xsjsMultiply", {



	onLiveChange: function(oEvent,oVal){
		var aUrl = '/{{PACKAGE_NAME}}/services/multiply.xsjs?cmd=multiply'+'&num1='
		           +escape(oEvent.getParameters().liveValue)+'&num2='+escape(oVal.getValue());
		jQuery.ajax({
			url: aUrl,
			method: 'GET',
			dataType: 'json',
			success: this.onCompleteMultiply,
			error: this.onErrorCall });
	},
	
	onCompleteMultiply: function(myTxt){
		var oResult = sap.ui.getCore().byId("result");
		 if(myTxt==undefined){ oResult.setText(0); }
		 else{
		   jQuery.sap.require("sap.ui.core.format.NumberFormat");
		   var oNumberFormat = sap.ui.core.format.NumberFormat.getIntegerInstance({
		      maxFractionDigits: 12,
		      minFractionDigits: 0,
		      groupingEnabled: true });
		   oResult.setText(oNumberFormat.format(myTxt)); }
	},
	
	onErrorCall: function(jqXHR, textStatus, errorThrown){
		 sap.ui.commons.MessageBox.show(jqXHR.responseText, 
				 "ERROR",
				 "Service Call Error" );	
		return;		
	}
});