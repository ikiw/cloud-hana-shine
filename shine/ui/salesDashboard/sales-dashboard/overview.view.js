sap.ui.jsview("sales-dashboard.overview", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf shine-so.overview
	*/ 
	getControllerName : function() {
		return "sales-dashboard.overview";
	},

	createContent : function(oController) {
		var oLayout = new sap.ui.commons.layout.MatrixLayout({width:"100%"});
		oLayout.setLayoutFixed(false);
		
		//Sales by Region Panel
		var salesByRegionPanel = new sap.ui.commons.Panel().setText(sap.app.i18n.getText("SALES_BY_REGION"));
		salesByRegionPanel.setHeight("380px");
		salesByRegionPanel.setWidth("100%");
		
	    var layoutNew = new sap.ui.commons.layout.MatrixLayout({width:"100%"});
	    salesByRegionPanel.addContent(layoutNew);
	    
	    //Pie Chart Data model
  	    var oModel = new sap.ui.model.odata.ODataModel("../../services/salesByRegion.xsodata", true);
  	    var sort1 = new sap.ui.model.Sorter("TOTAL_SALES");
  	    
  	    var dataset = new sap.viz.ui5.data.FlattenedDataset({

				dimensions : [ {
					axis : 1,
					name : sap.app.i18n.getText("REGION"),
					value : "{REGION}"
				} ],

				measures : [ {
					name : sap.app.i18n.getText("TOTAL_SALES"),
					value : '{TOTAL_SALES}'
				} ]
			});
  	      dataset.setModel(oModel);
	      dataset.bindData("/SalesByRegion",sort1);  
	      
	      var oSalesRegionPie = new sap.viz.ui5.Pie("saleRegionPie",{
				width : "100%",
				height : "320px",
				plotArea : {
				},
				
				title : {
					visible : false				
				},
				dataset : dataset
			});
			layoutNew.createRow(oSalesRegionPie);
			
	    //Sales by Country Panel
			var salesByCountryPanel = new sap.ui.commons.Panel().setText(sap.app.i18n.getText("SALES_BY_COUNTRY"));
		    var layoutNew = new sap.ui.commons.layout.MatrixLayout({width:"100%"});
		    salesByCountryPanel.addContent(layoutNew);  
			salesByCountryPanel.setHeight("380px");
			salesByCountryPanel.setWidth("100%");
			
	  	    var oModel = new sap.ui.model.odata.ODataModel("../../services/salesByCountry.xsodata/", true);
	  	    var sort1 = new sap.ui.model.Sorter("TOTAL_SALES");
	  	    
	  	    var dataset = new sap.viz.ui5.data.FlattenedDataset({	  	    
            dimensions : [ { axis : 1, 
                             name : sap.app.i18n.getText("COUNTRY"), 
                             value : "{COUNTRY}" } ],
            measures : [ 
                    { name : sap.app.i18n.getText("TOTAL_SALES"), 
                      value : '{TOTAL_SALES}' } ]       });
	  	      dataset.setModel(oModel);
		      dataset.bindData("/SalesByCountry",sort1);  
    
	     var oSalesCountryBarChart = new sap.viz.ui5.Column({
         width : "100%",
         height : "320px",
         title : {
                 visible : false
         },
         dataset : dataset
	     });

	      var xAxis = oSalesCountryBarChart.getXAxis();
	      var yAxis = oSalesCountryBarChart.getYAxis();

	      xAxis.setTitle(new sap.viz.ui5.types.Axis_title({
	          visible: true,
	          text: sap.app.i18n.getText("COUNTRY_CODES")
	      }));

	      yAxis.setTitle(new sap.viz.ui5.types.Axis_title({
	          visible: true,
	          text: sap.app.i18n.getText("SALES_IN_EUR")
	      }));
	      
	      oSalesCountryBarChart.getLegend().setVisible(false);
	      
	     layoutNew.createRow(oSalesCountryBarChart);   
		    
	    
		    //Sales Rank Panel
			var salesRankPanel = new sap.ui.commons.Panel().setText(sap.app.i18n.getText("SALES_RANK"));
		    var layoutNew = new sap.ui.commons.layout.MatrixLayout({width:"100%"});
		    salesRankPanel.addContent(layoutNew);  
			salesRankPanel.setHeight("380px");
			salesRankPanel.setWidth("100%");
			
	  	    var oModel = new sap.ui.model.odata.ODataModel("../../services/salesSalesRank.xsodata/", true);
	  	    var sort1 = new sap.ui.model.Sorter("SALES");
	  	    
	     var dataset = new sap.viz.ui5.data.FlattenedDataset({

             dimensions : [ {
               axis : 1,
               name : sap.app.i18n.getText("COMPANY_NAME"),
               value : "{COMPANY_NAME}"
             } ],

             measures : [ {
               group : 1,
               name : sap.app.i18n.getText("TOTAL_SALES"),
               value : '{SALES}'
             }, {
               group : 2,
               name : sap.app.i18n.getText("SALES_RANK"),
               value : '{SALES_RANK}'
             }, {
               group : 3,
               name : sap.app.i18n.getText("NUMBER_OF_ORDERS"),
               value : '{ORDERS}'
             } ]
           });
 	      dataset.setModel(oModel);
	      dataset.bindData("/salesRank",sort1); 
	      
           var oSalesRankBubble = new sap.viz.ui5.Bubble({
             width : "100%",
             height : "320px",
             title : {
               visible : false
             },
             dataset : dataset
           });
           
 	      xAxis = oSalesRankBubble.getXAxis();
	      yAxis = oSalesRankBubble.getYAxis();

	      xAxis.setTitle(new sap.viz.ui5.types.Axis_title({
	          visible: true,
	          text: sap.app.i18n.getText("TOTAL_SALES_IN_EUR")
	      }));

	      yAxis.setTitle(new sap.viz.ui5.types.Axis_title({
	          visible: true,
	          text: sap.app.i18n.getText("SALES_RANK")
	      }));
           
  	     layoutNew.createRow(oSalesRankBubble); 
           
 		var oVerticalLayout = new sap.ui.commons.layout.VerticalLayout({
			width: '100%'
		});
		
		var textView = new sap.ui.commons.TextView({
			text: sap.app.i18n.getText("SELECT_REGION"),
			width: '100px',
			design: sap.ui.commons.TextViewDesign.Bold
		});
		
		var view = this;
		
		this.dropDown = new sap.ui.commons.DropdownBox({
			change: function(oControlEvent){
				oController.onFilterChange(oControlEvent.getParameters().newValue, view);
			}
		});
		
		var oHorLayout = new sap.ui.commons.layout.HorizontalLayout({
			width: '100%'
		});
		
		oHorLayout.addContent(textView);
		oHorLayout.addContent(this.dropDown);
		
		var oItemTemplate1 = new sap.ui.core.ListItem();
		oItemTemplate1.bindProperty("text", "region");
		oItemTemplate1.bindProperty("key", "key");
		this.dropDown.bindItems("/", oItemTemplate1);
		
		this.oDiscountChart = new sap.viz.ui5.Pie({
			width : "100%",
			height : "320px",
			plotArea : {
			//'colorPalette' : d3.scale.category20().range()
			},
			title : {
				visible : true,
				text : sap.app.i18n.getText("DISCOUNT_PER_REGION_TITLE")
			}
		});
		
		oVerticalLayout.addContent(oHorLayout);
		oVerticalLayout.addContent(this.oDiscountChart);
		
		// Sales Discount Panel
		var salesDiscountPanel = new sap.ui.commons.Panel().setText(sap.app.i18n.getText("DISCOUNT_PER_REGION_TITLE"));
		salesDiscountPanel.addContent(oVerticalLayout);  
		salesDiscountPanel.setHeight("420px");
		salesDiscountPanel.setWidth("100%");	     
	     
	     
	    var oCell1 = new sap.ui.commons.layout.MatrixLayoutCell;
	    oCell1.setVAlign(sap.ui.commons.layout.VAlign.Top);
	    oCell1.addContent(salesByRegionPanel);
	    var oCell2 = new sap.ui.commons.layout.MatrixLayoutCell;
	    oCell2.setVAlign(sap.ui.commons.layout.VAlign.Top);	    
	    oCell2.addContent(salesByCountryPanel);	
	    
		oLayout.createRow(oCell1,oCell2);
	    var oCell3 = new sap.ui.commons.layout.MatrixLayoutCell;
	    oCell3.addContent(salesRankPanel);
	    oCell3.setColSpan(2);
	    oLayout.createRow(oCell3);
		var oCell4 = new sap.ui.commons.layout.MatrixLayoutCell;
	    oCell3.addContent(salesDiscountPanel);
	    oCell4.setColSpan(2);
		oLayout.createRow(oCell4);
	    return oLayout;
	}

});
