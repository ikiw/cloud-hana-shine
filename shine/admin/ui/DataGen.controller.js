sap.ui
		.controller(
				"ui.DataGen",
				{
					/**
					 * Called when a controller is instantiated and its View
					 * controls (if available) are already created. Can be used
					 * to modify the View before it is displayed, to bind event
					 * handlers and do other one-time initialization.
					 */
					// onInit: function() {
					//
					// },
					/**
					 * Similar to onAfterRendering, but this hook is invoked
					 * before the controller's View is re-rendered (NOT before
					 * the first rendering! onInit() is used for that one!).
					 */
					// onBeforeRendering: function() {
					//
					// },
					/**
					 * Called when the View has been rendered (so its HTML is
					 * part of the document). Post-rendering manipulations of
					 * the HTML could be done here. This hook is the same one
					 * that SAPUI5 controls get after being rendered.
					 */
					// onAfterRendering: function() {
					//
					// },
					/**
					 * Called when the Controller is destroyed. Use this one to
					 * free resources and finalize activities.
					 */
					// onExit: function() {
					//
					// }
					getTableSizes : function(oController) {
						var aUrl = 'DataGen.xsjs?cmd=getSize';

						jQuery.ajax({
							url : aUrl,
							method : 'GET',
							dataType : 'json',
							success : onLoadSizes,
							error : onErrorCall
						});
					},
					
					execute : function(oEvent, oController) {
						var intRegex = /^\d+$/;
						if (intRegex.test(sap.ui.getCore().byId('POVal')
								.getValue())
								&& parseInt(sap.ui.getCore().byId('POVal')
										.getValue()) !== 0) {
							if (intRegex.test(sap.ui.getCore().byId('SOVal')
									.getValue())
									&& parseInt(sap.ui.getCore().byId('SOVal')
											.getValue()) !== 0) {
								
								if (sap.ui.getCore().byId('cb5').getChecked() == true )
									
									{
									
									if ( new Date(sap.ui.getCore().byId('startDate').getValue()) <= new Date(sap.ui.getCore().byId('endDate').getValue())  )
									
										{
										
										sap.ui.getCore().byId('txtLog').setValue("");
										phase1 = 0;
										phase2 = 0;
										phase3 = 0;
										phase4 = 0;
										poLoops = 0;
										soLoops = 0;
										sap.ui.getCore().byId('Phase').setText("");
										sap.ui.getCore().byId('ProgInd1')
												.setPercentValue(0);
										sap.ui.getCore().byId('ProgInd1')
												.setDisplayValue("");
										sap.ui.commons.MessageBox.confirm(oBundle
												.getText("confirm_delete"), function(
												bResult) {
											oController.executeConfirm(bResult,
													oController);
										}, oBundle.getText("title_delete"));
										
										}
									else {
							        	sap.ui.commons.MessageBox.show(oBundle.getText("ValidDate"), 
							                    "ERROR",
							                    oBundle.getText("ErrorMessage") );
										return;
										}
									
									}
								
								else
									
									{
									
									sap.ui.getCore().byId('txtLog').setValue("");
									phase1 = 0;
									phase2 = 0;
									phase3 = 0;
									phase4 = 0;
									poLoops = 0;
									soLoops = 0;
									sap.ui.getCore().byId('Phase').setText("");
									sap.ui.getCore().byId('ProgInd1')
											.setPercentValue(0);
									sap.ui.getCore().byId('ProgInd1')
											.setDisplayValue("");
									sap.ui.commons.MessageBox.confirm(oBundle
											.getText("confirm_delete"), function(
											bResult) {
										oController.executeConfirm(bResult,
												oController);
									}, oBundle.getText("title_delete"));
																											
									}		
								}	
								else {
					        	sap.ui.commons.MessageBox.show(oBundle.getText("confirm_validSO"), 
					                    "ERROR",
					                    oBundle.getText("ValidNumber") );
								return;
							}
						} else {
				        	sap.ui.commons.MessageBox.show(oBundle.getText("confirm_validPO"), 
				                    "ERROR",
				                    oBundle.getText("ValidNumber") );
							return;
						}
					},

					executeConfirm : function(bResult, oController) {
						if (bResult) {
							if (sap.ui.getCore().byId("cb1").getChecked()) {
								sap.ui.core.BusyIndicator.show();
								sap.ui.getCore().byId('Phase').setText(
										oBundle.getText("cb1"));
								sap.ui.getCore().byId('ProgInd1')
										.setPercentValue(0);
								sap.ui.getCore().byId('ProgInd1')
										.setDisplayValue("");
								var aUrl = 'DataGen.xsjs?cmd=reseed&object=master';
									jQuery.ajax({
												url : aUrl,
												method : 'GET',
												dataType : 'text',
												success : function(myTxt) {
													oController
															.onReseedComplete(
																	myTxt,
																	oController);
												},
												error : onErrorCall,
												async : true
											});
							} else if (sap.ui.getCore().byId("cb2")
									.getChecked()) {
								sap.ui.core.BusyIndicator.show();
								sap.ui.getCore().byId('Phase').setText(
										oBundle.getText("cb2"));
								sap.ui.getCore().byId('ProgInd1')
										.setPercentValue(0);
								sap.ui.getCore().byId('ProgInd1')
										.setDisplayValue("");
								var aUrl = 'DataGen.xsjs?cmd=reseed&object=transactional';
									jQuery.ajax({
										url : aUrl,
										method : 'GET',
										dataType : 'text',
										success : function(myTxt) {
											oController.onReseedComplete2(
													myTxt, oController);
										},
										error : onErrorCall,
										async : true
									});
							} else if (sap.ui.getCore().byId("cb2a")
									.getChecked()) {
								sap.ui.core.BusyIndicator.show();
								sap.ui.getCore().byId('Phase').setText(
										oBundle.getText("cb2a"));
								sap.ui.getCore().byId('ProgInd1')
										.setPercentValue(0);
								sap.ui.getCore().byId('ProgInd1')
										.setDisplayValue("");
								var aUrl = 'DataGen.xsjs?cmd=synonym';
								jQuery.ajax({
									url : aUrl,
									method : 'GET',
									dataType : 'text',
									success : function(myTxt) {
										oController.onSynonymComplete(myTxt,
												oController);
									},
									error : onErrorCall,
									async : true
								});
							} else if (sap.ui.getCore().byId("cb3")
									.getChecked()) {
								sap.ui.core.BusyIndicator.show();
								sap.ui.getCore().byId('Phase').setText(
										oBundle.getText("cb3"));
								sap.ui.getCore().byId('ProgInd1')
										.setPercentValue(0);
								sap.ui.getCore().byId('ProgInd1')
										.setDisplayValue("");
								var aUrl = 'DataGen.xsjs?cmd=resetSequence&object=';
								var tableArray = [ "addressSeqId",
										"employeeSeqId", "partnerSeqId",
										"purchaseOrderSeqId", "salesOrderId",
										"textSeqId" ];
								for ( var i = 0; i < tableArray.length; i++) {
									jQuery.ajax({
										url : aUrl + tableArray[i],
										method : 'GET',
										dataType : 'text',
										success : function(myTxt) {
											oController.onResequenceComplete(
													myTxt, oController,
													tableArray[i]);
										},
										error : onErrorCall,
										async : true
									});
								}
							} else if (sap.ui.getCore().byId("cb4")
									.getChecked()) {
								sap.ui.core.BusyIndicator.show();
								sap.ui.getCore().byId('Phase').setText(
										oBundle.getText("cb4"));
								sap.ui.getCore().byId('ProgInd1')
										.setPercentValue(0);
								sap.ui.getCore().byId('ProgInd1')
										.setDisplayValue("");
								oController.triggerReplicatePO(oController);
								oController.triggerReplicateSO(oController);

							}
							// checkbox for time based data generator
							else if (sap.ui.getCore().byId("cb5").getChecked()) {
								sap.ui.core.BusyIndicator.show();
								sap.ui.getCore().byId('Phase').setText(
										oBundle.getText("cb5"));
								sap.ui.getCore().byId('ProgInd1')
										.setPercentValue(0);
								sap.ui.getCore().byId('ProgInd1')
										.setDisplayValue("");
								oController
										.triggerReplicateTimeBasedPO(oController);
								oController
										.triggerReplicateTimeBasedSO(oController);
							}
						}
					},

					updateReplicateProgress : function() {
						var totalPO = parseInt(sap.ui.getCore().byId('POVal')
								.getValue(), 10);
						var totalSO = parseInt(sap.ui.getCore().byId('SOVal')
								.getValue(), 10);
						sap.ui.getCore().byId('ProgInd1').setPercentValue(
								Math.round((poLoops + soLoops)
										/ (totalPO + totalSO) * 100));
						sap.ui
								.getCore()
								.byId('ProgInd1')
								.setDisplayValue(
										oBundle
												.getText(
														"generatedPG",
														[
																numericSimpleFormatter((poLoops + soLoops) * 1000),
																numericSimpleFormatter((totalPO + totalSO) * 1000) ]));
					},
					updateReplicateTimeBasedProgress : function() {
						var totalPO = parseInt(sap.ui.getCore().byId('POVal')
								.getValue(), 10);
						var totalSO = parseInt(sap.ui.getCore().byId('SOVal')
								.getValue(), 10);
						sap.ui.getCore().byId('ProgInd1').setPercentValue(
								Math.round((poLoops + soLoops)
										/ (totalPO + totalSO) * 100));
						sap.ui
								.getCore()
								.byId('ProgInd1')
								.setDisplayValue(
										oBundle
												.getText(
														"generatedPG",
														[
																numericSimpleFormatter((poLoops + soLoops) * 1000),
																numericSimpleFormatter((totalPO + totalSO) * 1000) ]));
					},
					triggerReplicatePO : function(oController) {
						poLoops++;
						oController.updateReplicateProgress();
						var aUrl = 'DataGen.xsjs?cmd=replicatePO&dummy='
								+ oController.getUniqueTime().toString();
						jQuery.ajax({
							url : aUrl,
							method : 'GET',
							dataType : 'text',
							success : function(myTxt) {
								oController.onPOComplete(myTxt, oController);
							},
							error : onErrorCall,
							async : true
						});
					},
					triggerReplicateSO : function(oController) {
						soLoops++;
						oController.updateReplicateProgress();
						var aUrl = 'DataGen.xsjs?cmd=replicateSO&dummy='
								+ oController.getUniqueTime().toString();
						jQuery.ajax({
							url : aUrl,
							method : 'GET',
							dataType : 'text',
							success : function(myTxt) {
								oController.onSOComplete(myTxt, oController);
							},
							error : onErrorCall,
							async : true
						});
					},
					// For time based data generation
					triggerReplicateTimeBasedPO : function(oController) {
						poLoops = parseInt(sap.ui.getCore().byId('POVal').getValue(),10);
						var aUrl = 'DataGen.xsjs?cmd=replicateTimeBasedPO&startdate='
								+ sap.ui.getCore().byId('startDate').getValue()
								+ '&enddate='
								+ sap.ui.getCore().byId("endDate").getValue()
								+ '&noRec='
								+ sap.ui.getCore().byId('POVal').getValue()
								+ '&dummy='
								+ oController.getUniqueTime().toString();
						jQuery.ajax({
							url : aUrl,
							method : 'GET',
							dataType : 'text',
							success : function(myTxt) {
								oController.onTimeBasedPOComplete(myTxt,
										oController);
							},
							error : onErrorCall,
							async : true
						});
					},
					triggerReplicateTimeBasedSO : function(oController) {
						soLoops = parseInt(sap.ui.getCore().byId('SOVal').getValue(),10);
						var aUrl = 'DataGen.xsjs?cmd=replicateTimeBasedSO&startdate='
								+ sap.ui.getCore().byId('startDate').getValue()
								+ '&enddate='
								+ sap.ui.getCore().byId("endDate").getValue()
								+ '&noRec='
								+ sap.ui.getCore().byId('SOVal').getValue()
								+ '&dummy='
								+ oController.getUniqueTime().toString();
						jQuery.ajax({
							url : aUrl,
							method : 'GET',
							dataType : 'text',
							success : function(myTxt) {
								oController.onTimeBasedSOComplete(myTxt,
										oController);
							},
							error : onErrorCall,
							async : true
						});
					},
								toggleGenerate : function(oEvent, oController) {
						if (oEvent.oSource.getChecked()) {
							sap.ui.getCore().byId("lblPOVal").setVisible(true);
							sap.ui.getCore().byId("POVal").setVisible(true);
							sap.ui.getCore().byId("times1").setVisible(true);
							sap.ui.getCore().byId("lblSOVal").setVisible(true);
							sap.ui.getCore().byId("SOVal").setVisible(true);
							sap.ui.getCore().byId("times2").setVisible(true);
						} else {
							sap.ui.getCore().byId("lblPOVal").setVisible(false);
							sap.ui.getCore().byId("POVal").setVisible(false);
							sap.ui.getCore().byId("times1").setVisible(false);
							sap.ui.getCore().byId("lblSOVal").setVisible(false);
							sap.ui.getCore().byId("SOVal").setVisible(false);
							sap.ui.getCore().byId("times2").setVisible(false);
							// to make the po and so val to default when unchecked
							sap.ui.getCore().byId("POVal").setValue(1);
							sap.ui.getCore().byId("SOVal").setValue(1);
						}
						;
					},
					// For time based data generation
					toggleDateGenerate : function(oEvent, oController) {
						if (oEvent.oSource.getChecked()) {
							sap.ui.getCore().byId("lblPOVal").setVisible(true);
							sap.ui.getCore().byId("POVal").setVisible(true);
							sap.ui.getCore().byId("times1").setVisible(true);
							sap.ui.getCore().byId("lblSOVal").setVisible(true);
							sap.ui.getCore().byId("SOVal").setVisible(true);
							sap.ui.getCore().byId("times2").setVisible(true);
							sap.ui.getCore().byId("lblStartDate").setVisible(
									true);
							sap.ui.getCore().byId("startDate").setVisible(true);
							sap.ui.getCore().byId("lblEndDate")
									.setVisible(true);
							sap.ui.getCore().byId("endDate").setVisible(true);
						} else {
							sap.ui.getCore().byId("lblPOVal").setVisible(false);
							sap.ui.getCore().byId("POVal").setVisible(false);
							sap.ui.getCore().byId("times1").setVisible(false);
							sap.ui.getCore().byId("lblSOVal").setVisible(false);
							sap.ui.getCore().byId("SOVal").setVisible(false);
							sap.ui.getCore().byId("times2").setVisible(false);
							sap.ui.getCore().byId("lblStartDate").setVisible(
									false);
							sap.ui.getCore().byId("startDate")
									.setVisible(false);
							sap.ui.getCore().byId("lblEndDate").setVisible(
									false);
							sap.ui.getCore().byId("endDate").setVisible(false);
							// to make the po and so val to default when unchecked							
							sap.ui.getCore().byId("POVal").setValue(1);
							sap.ui.getCore().byId("SOVal").setValue(1);
							var TodayDate = new Date();	
							var currentDay = TodayDate.getDate();
							var currentMonth = TodayDate.getMonth() + 1;  // Jan is 0
							var currentYear = TodayDate.getFullYear();
							var startMonth = currentMonth -1 ;
							var startYear = TodayDate.getFullYear();
							if (currentDay < 10) {
							 currentDay ='0'+ currentDay;
							}
							if (currentMonth < 10) {
								currentMonth ='0'+ currentMonth;
							}
							if (startMonth == 0 ) {
									startMonth = 12;
									startYear = TodayDate.getFullYear() - 1;
								}
							if (startMonth < 10) {
								startMonth ='0'+ startMonth;
							}		
							var startDateNum = Number(startYear + "" + startMonth + "" + currentDay);	
							var TodayDateNum = Number(currentYear + "" + currentMonth + "" + currentDay);	
							sap.ui.getCore().byId("startDate").setYyyymmdd(startDateNum);
							sap.ui.getCore().byId("endDate").setYyyymmdd(TodayDateNum);
						}
						;
					},
					
					onReseedComplete : function(myTxt, oController) {
						sap.ui.getCore().byId('txtLog').setValue(
								myTxt
										+ sap.ui.getCore().byId('txtLog')
												.getValue());
						phase1=7;
						sap.ui.getCore().byId('ProgInd1').setPercentValue(
								Math.round(phase1 / 7 * 100));
						sap.ui.getCore().byId('ProgInd1').setDisplayValue(
								oBundle.getText("reloadedPG", [
										phase1.toString(), 7 ]));

						if (phase1 === 7) {
							sap.ui.getCore().byId("cb1").setChecked(false);
							sap.ui.core.BusyIndicator.hide();
							oController.getTableSizes();
							oController.executeConfirm(true, oController);
						}
					},

					onReseedComplete2 : function(myTxt, oController) {
						sap.ui.getCore().byId('txtLog').setValue(
								myTxt
										+ sap.ui.getCore().byId('txtLog')
												.getValue());
						phase2=4;
						sap.ui.getCore().byId('ProgInd1').setPercentValue(
								Math.round(phase2 / 4 * 100));
						sap.ui.getCore().byId('ProgInd1').setDisplayValue(
								oBundle.getText("reloadedPG", [
										phase2.toString(), 4 ]));
						oController.getTableSizes();

						if (phase2 === 4) {
							sap.ui.getCore().byId("cb2").setChecked(false);
							sap.ui.core.BusyIndicator.hide();

							oController.executeConfirm(true, oController);
						}
					},

					onSynonymComplete : function(myTxt, oController) {
						sap.ui.getCore().byId('txtLog').setValue(
								myTxt
										+ sap.ui.getCore().byId('txtLog')
												.getValue());
						sap.ui.getCore().byId('ProgInd1').setPercentValue(100);
						sap.ui.getCore().byId('ProgInd1').setDisplayValue(
								'100%');
						sap.ui.getCore().byId("cb2a").setChecked(false);
						sap.ui.core.BusyIndicator.hide();
						oController.executeConfirm(true, oController);

					},
					onResequenceComplete : function(myTxt, oController, oObject) {
						sap.ui.getCore().byId('txtLog').setValue(
								myTxt
										+ sap.ui.getCore().byId('txtLog')
												.getValue());
						phase3++;
						sap.ui.getCore().byId('ProgInd1').setPercentValue(
								Math.round(phase3 / 6 * 100));
						sap.ui.getCore().byId('ProgInd1').setDisplayValue(
								oBundle.getText("resequencePG", [
										phase3.toString(), 6 ]));
						if (phase3 === 6) {
							sap.ui.getCore().byId("cb3").setChecked(false);
							sap.ui.core.BusyIndicator.hide();
							oController.executeConfirm(true, oController);
							oController.getTableSizes();
						}
					},

					onPOComplete : function(myTxt, oController, i) {
						sap.ui.getCore().byId('txtLog').setValue(
								myTxt
										+ sap.ui.getCore().byId('txtLog')
												.getValue());
						if (poLoops >= parseInt(sap.ui.getCore().byId('POVal')
								.getValue(), 10)) {
							if (soLoops >= parseInt(sap.ui.getCore().byId(
									'SOVal').getValue(), 10)) {
								sap.ui.getCore().byId("cb4").setChecked(false);
								sap.ui.getCore().byId("lblPOVal").setVisible(
										false);
								sap.ui.getCore().byId("POVal")
										.setVisible(false);
								sap.ui.getCore().byId("times1").setVisible(
										false);
								sap.ui.getCore().byId("lblSOVal").setVisible(
										false);
								sap.ui.getCore().byId("SOVal")
										.setVisible(false);
								sap.ui.getCore().byId("times2").setVisible(
										false);

								sap.ui.core.BusyIndicator.hide();
								oController.getTableSizes();
							}
						} else {
							oController.triggerReplicatePO(oController);
						}
					},
					onTimeBasedPOComplete : function(myTxt, oController, i) { // For
																				// New
																				// DG

						sap.ui.getCore().byId('txtLog').setValue(myTxt + sap.ui.getCore().byId('txtLog')
								.getValue());
						oController.updateReplicateTimeBasedProgress();
						if (poLoops >= 1) {
							if (soLoops >= 1) {

								sap.ui.getCore().byId("cb5").setChecked(false);
								sap.ui.getCore().byId("lblPOVal").setVisible(
										false);
								sap.ui.getCore().byId("POVal")
										.setVisible(false);
								sap.ui.getCore().byId("times1").setVisible(false);
								sap.ui.getCore().byId("lblSOVal").setVisible(
										false);
								sap.ui.getCore().byId("SOVal")
										.setVisible(false);
								sap.ui.getCore().byId("times2").setVisible(false);
								sap.ui.getCore().byId("startDate").setVisible(
										false);
								sap.ui.getCore().byId("lblStartDate")
										.setVisible(false);
								sap.ui.getCore().byId("lblEndDate").setVisible(
										false);
								sap.ui.getCore().byId("endDate").setVisible(
										false);

								sap.ui.core.BusyIndicator.hide();
								oController.getTableSizes();
							}
						} else {
							oController
									.triggerReplicateTimeBasedPO(oController);
						}
					},
					onTimeBasedSOComplete : function(myTxt, oController, i) { // For New DG

						sap.ui.getCore().byId('txtLog').setValue(myTxt + sap.ui.getCore().byId('txtLog')
								.getValue());
						oController.updateReplicateTimeBasedProgress();

						if (soLoops >= 1) {
							if (poLoops >= 1) {
								sap.ui.getCore().byId("cb5").setChecked(false);
								sap.ui.getCore().byId("lblPOVal").setVisible(
										false);
								sap.ui.getCore().byId("POVal")
										.setVisible(false);
								sap.ui.getCore().byId("times1").setVisible(false);
								sap.ui.getCore().byId("lblSOVal").setVisible(
										false);
								sap.ui.getCore().byId("SOVal")
										.setVisible(false);
								sap.ui.getCore().byId("times2").setVisible(false);
								sap.ui.getCore().byId("startDate").setVisible(
										false);
								sap.ui.getCore().byId("lblStartDate")
										.setVisible(false);
								sap.ui.getCore().byId("lblEndDate").setVisible(
										false);
								sap.ui.getCore().byId("endDate").setVisible(
										false);

								sap.ui.core.BusyIndicator.hide();
								oController.getTableSizes();
							}
						} else {
							oController
									.triggerReplicateTimeBasedSO(oController);
						}
					},
					onSOComplete : function(myTxt, oController, i) {
						sap.ui.getCore().byId('txtLog').setValue(
								myTxt
										+ sap.ui.getCore().byId('txtLog')
												.getValue());
						oController.getTableSizes();
						if (soLoops >= parseInt(sap.ui.getCore().byId('SOVal')
								.getValue(), 10)) {
							if (poLoops >= parseInt(sap.ui.getCore().byId(
									'POVal').getValue(), 10)) {
								sap.ui.getCore().byId("cb4").setChecked(false);
								sap.ui.getCore().byId("lblPOVal").setVisible(
										false);
								sap.ui.getCore().byId("POVal")
										.setVisible(false);
								sap.ui.getCore().byId("times1").setVisible(
										false);
								sap.ui.getCore().byId("lblSOVal").setVisible(
										false);
								sap.ui.getCore().byId("SOVal")
										.setVisible(false);
								sap.ui.getCore().byId("times2").setVisible(
										false);
								sap.ui.core.BusyIndicator.hide();
							}
						} else {
							oController.triggerReplicateSO(oController);
						}
					},
					getUniqueTime : function() {
						var time = new Date().getTime();
						while (time == new Date().getTime())
							;
						return new Date().getTime();
					}
				});

function onLoadSizes(myJSON) {

	var data = [];
	for ( var i = 0; i < myJSON.entries.length; i++) {
		data[i] = {
			label : myJSON.entries[i].name,
			table_size : myJSON.entries[i].table_size,
			record_count : myJSON.entries[i].record_count
		};
	}
	oBarModel.setData({
		modelData : data
	});
}

function onErrorCall(jqXHR, textStatus, errorThrown) {
	sap.ui.core.BusyIndicator.hide();
	sap.ui.commons.MessageBox.show(jqXHR.responseText, "ERROR", oBundle
			.getText("error_action"));
	return;
	
}