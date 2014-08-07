$.import("{{PACKAGE_NAME}}.services", "messages");
$.import("{{PACKAGE_NAME}}.services", "session");
$.import("{{PACKAGE_NAME}}.admin", "dghelper");

var SESSIONINFO = $.{{PACKAGE_NAME}}.services.session;
var MESSAGES = $.{{PACKAGE_NAME}}.services.messages;
var dg = $.{{PACKAGE_NAME}}.admin.dghelper;
var bpDict = dg.getBuinessPartners();
var prodDict = dg.getProducts();

var aStartDate = $.request.parameters.get('startdate');
var aEndDate = $.request.parameters.get('enddate');
//encodeURI() used to avoid SQL injection
var aNoRec = encodeURI($.request.parameters.get('noRec'));
var aCmd = encodeURI($.request.parameters.get('cmd'));

switch (aCmd) {
case "reseed":
	reloadSeed();
	break;
case "resetSequence":
	resetSequence();
	break;
case "replicatePO":
	replicatePurchaseOrders();
	break;
case "replicateTimeBasedPO":
	replicateTimeBasedPurchaseOrders(aStartDate,aEndDate,parseInt(aNoRec)*1000);
	break;
case "replicateTimeBasedSO":
	replicateTimeBasedSalesOrders(aStartDate,aEndDate,parseInt(aNoRec)*1000);
	break;
case "replicateSO":
	replicateSalesOrders();
	break;
case "getSize":
	getTableSize();
	break;
case "synonym":
	generateSynonym();
	break;
case "getSessionInfo":
	SESSIONINFO.fillSessionInfo();
	break;	
default:
	$.response.status = $.net.http.BAD_REQUEST;
	$.response.setBody(MESSAGES.getMessage('SEPM_ADMIN', '002', aCmd));
}

function reloadSeed() {
	try {
		var object = encodeURI($.request.parameters.get('object'));
		var body = '';
		var tblNames = [];
		var tiNames=[];
		var seqNames=[];
		var conn;
		var query;
		var pstmt;
		var objectId;
		var activeSession;
		var inactiveSession;
		var activeVersion;
		var writtenObjectMetadata;
		var activateResult;
		var devObj;
			
		switch (object) {
		case "master":
			tblNames = ['EPM.MasterData.Addresses','EPM.MasterData.BusinessPartner','EPM.MasterData.Employees','EPM.MasterData.Products',
			'EPM.Util.Constants','EPM.Util.Messages','EPM.Util.Texts'];
			tiNames=['MasterData','Util'];
			seqNames=['addressSeqId','employeeSeqId','partnerSeqId','textSeqId'];
			break;
		case "transactional":
			tblNames= ['EPM.Sales.Header','EPM.Sales.Item','EPM.Purchase.Header','EPM.Purchase.Item'];
			tiNames=['Sales','Purchase'];
			seqNames = ['purchaseOrderSeqId','salesOrderId'];
			break;
		default:
			$.response.status = $.net.http.BAD_REQUEST;
			$.response.setBody(MESSAGES.getMessage('SEPM_ADMIN', '003'));
			return;
		}
		
				
		// open db connection needed for repository sessions
		conn = $.db.getConnection(8);
		
		for(var i = 0;i<tblNames.length;i++){
		// Truncate the existing table
		query = 'TRUNCATE TABLE "_SYS_BIC"."{{PACKAGE_NAME}}.data::'
				+ tblNames[i] + '"';
		pstmt = conn.prepareStatement(query);
		pstmt.execute();
		pstmt.close();
		conn.commit();
		body = body
				+ 'Truncated: {{PACKAGE_NAME}}.data::'
				+ tblNames[i] + ' \n';
		}

		for ( var j = 0; j < tiNames.length; j++) {

			// create object id (object to write to)
			objectId = $.repo.createObjectId("","{{PACKAGE_NAME}}.data.loads", tiNames[j], "hdbti");

			//open db connection needed for repository sessions 
			conn = $.db.getConnection(8);

			// write to repository object
			  activeSession =  $.repo.createActiveSession(conn);
			  activeVersion = $.repo.createActiveVersion();
			  devObj = $.repo.readObject(activeSession, objectId, activeVersion);
			  
			  inactiveSession = $.repo.createInactiveSession(conn, tiNames[j]);
			  writtenObjectMetadata = $.repo.writeObject(inactiveSession, objectId, devObj.metadata, devObj.cdata);
			  activateResult = $.repo.activateObjects(inactiveSession,[objectId], $.repo.ACTIVATION_CASCADE_ONE_PHASE);

			  //commit the changes
			conn.commit();
			//close db connection
			conn.close();
		}
		
		for ( var k = 0; k < seqNames.length; k++) {
			dg.resetTableSequence(seqNames[k]);
		}
		
		for(var i = 0;i<tblNames.length;i++){
			body = body
			+ 'Reseeded: {{PACKAGE_NAME}}.data.loads::'
			+ tblNames[i] + '\n';
		}
		$.response.status = $.net.http.OK;
		$.response.setBody(body);

	} catch (e) {
		$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
		$.response.setBody(e.message);
	}
}
//Reset sequence after generating data.
function resetSequence() {
	try {
		
		var object = encodeURI($.request.parameters.get('object'));
		var body = '';
		var maxId = dg.resetTableSequence(object);
		body = body
		+ 'Sequence reset: {{PACKAGE_NAME}}.data::'
		+ object + ' to ' + maxId + ' \n';
		if (maxId=== -1){
			$.response.status = $.net.http.BAD_REQUEST;
			$.response.setBody(MESSAGES.getMessage('SEPM_ADMIN', '004'));
		}else{
			$.response.status = $.net.http.OK;
			$.response.setBody(body);
		}

	} catch (e) {
		$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
		$.response.setBody(e.message);
	}
}

//Generate Purchase Orders by replicating from table 
function replicatePurchaseOrders() {
	var body = '';
	var maxPoId = '';
	try {
		var conn = $.db.getConnection();

		var query = 'SELECT MAX("PURCHASEORDERID") FROM "_SYS_BIC"."{{PACKAGE_NAME}}.data::EPM.Purchase.Header"';
		var pstmt = conn.prepareStatement(query);
		var rs = pstmt.executeQuery();
		while (rs.next()) {
			maxPoId = rs.getNString(1);
		}
		rs.close();
		pstmt.close();
		maxPoId = parseInt(maxPoId, 10) + 1;

		query = 'INSERT INTO "_SYS_BIC"."{{PACKAGE_NAME}}.data::EPM.Purchase.Header" '
			+ '("PURCHASEORDERID", "HISTORY.CREATEDBY", "HISTORY.CREATEDAT", "HISTORY.CHANGEDBY", "HISTORY.CHANGEDAT", "NOTEID", ' 
			+ ' "PARTNERID", "CURRENCY", "GROSSAMOUNT", "NETAMOUNT", "TAXAMOUNT", '
			+ ' "LIFECYCLESTATUS", "APPROVALSTATUS", "CONFIRMSTATUS", "ORDERINGSTATUS", "INVOICINGSTATUS" ) '
			+ 'select \'0\' || to_int("PURCHASEORDERID" + '
			+ maxPoId
			+ ' - 300000000 ), "HISTORY.CREATEDBY", "HISTORY.CREATEDAT", "HISTORY.CHANGEDBY", "HISTORY.CHANGEDAT", "NOTEID", '
			+ ' "PARTNERID", "CURRENCY", "GROSSAMOUNT", "NETAMOUNT", "TAXAMOUNT", '
			+ ' "LIFECYCLESTATUS", "APPROVALSTATUS", "CONFIRMSTATUS", "ORDERINGSTATUS", "INVOICINGSTATUS" '
			+ '  from "{{PACKAGE_NAME}}.data::EPM.Purchase.Header" WHERE "PURCHASEORDERID" <= '
			+ "  '0300000999' ";
		pstmt = conn.prepareStatement(query);
		var iNumPo = pstmt.executeUpdate();
		pstmt.close();
		body = body
			+ MESSAGES.getMessage('SEPM_ADMIN', '001', iNumPo,
					'EPM.Purchase.Header') + "\n";

		query = 'INSERT INTO "_SYS_BIC"."{{PACKAGE_NAME}}.data::EPM.Purchase.Item" '
			+ '("PURCHASEORDERID", "PURCHASEORDERITEM", "PRODUCTID", "NOTEID", "CURRENCY", "GROSSAMOUNT", "NETAMOUNT", "TAXAMOUNT", '
			+ ' "QUANTITY", "QUANTITYUNIT", "DELIVERYDATE") '
			+ 'select \'0\' || to_int("PURCHASEORDERID" + '
			+ maxPoId
			+ ' - 300000000 ), "PURCHASEORDERITEM", "PRODUCTID", "NOTEID", "CURRENCY", "GROSSAMOUNT", "NETAMOUNT", "TAXAMOUNT", '
			+ ' "QUANTITY", "QUANTITYUNIT", "DELIVERYDATE" '
			+ '  from "{{PACKAGE_NAME}}.data::EPM.Purchase.Item" WHERE "PURCHASEORDERID" <= '
			+ " '0300000999' ";
		pstmt = conn.prepareStatement(query);
		var iNumItem = pstmt.executeUpdate();
		pstmt.close();
		body = body
				+ MESSAGES.getMessage('SEPM_ADMIN', '001', iNumItem,
						'EPM.Purchase.Item') + "\n";

		conn.commit();
		conn.close();
		dg.resetTableSequence('purchaseOrderSeqId');
		$.response.status = $.net.http.OK;
		$.response.setBody(body);
	} catch (e) {
		$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
		$.response.setBody(e.message);
	}
}
//Create Purchase Orders distributed randomly across a time period
function replicateTimeBasedPurchaseOrders(aStartDate,aEndDate,aNoRec) {
    
	var body = '';
	var alpha = 0;
	var thetaArray = [];
	var i=0;
	var randNo = 0;
	var j;
	var noRecords = aNoRec;
	var calc;

	//Calculate the number of days
	var StartDate = new Date(aStartDate);
	var endDate = new Date(aEndDate);
	var timeDiff = Math.abs(endDate.getTime() - StartDate.getTime());
	var diffDays = (Math.ceil(timeDiff/ (1000 * 3600 * 24)))+1;
	
	if (aNoRec == 0){
		return;
	}

	//Get the random number of purchase orders to be generated for each day finally stored in thetaArray[]
	randNo = Math.random();
	alpha = Math.round(aNoRec / diffDays) ;
	thetaArray[0] = Math.round(alpha * randNo);
	aNoRec = +(aNoRec - thetaArray[i]) || 0;
	
	for (i=1;i < diffDays-1;i++){
		//Generate a random number
		randNo = Math.random();
		alpha = Math.round(aNoRec / (diffDays - i));
		calc = Math.round(alpha * randNo)*Math.round(6*randNo);
		thetaArray[i] = (calc<=aNoRec)?calc:0;
		aNoRec = +(aNoRec - thetaArray[i]) || 0;
	}
	
	thetaArray[diffDays - 1] = +(aNoRec) || 0;
	//Loop to distribute the random purchase orders to be generated across each day(date) and also calculate the BATCHSIZE
	for(j=0; j< diffDays ; j++){
		var tempthetaArray = thetaArray[j] ;		
		var startDay = StartDate.getDate();
		var startMonth = StartDate.getMonth() + 1;  // Jan is 0
		var startYear = StartDate.getFullYear();
		 if (thetaArray[j] === 0){
	        	continue;
	        }
		if (startDay < 10) {
			startDay ='0'+ startDay;
		}
		if (startMonth < 10) {
			startMonth ='0'+ startMonth;
		}
		var StartDateStr = startYear.toString() + startMonth.toString() + startDay;
		if ( tempthetaArray !== 0){
			var BATCHSIZE =  thetaArray[j];		    
			if (BATCHSIZE === 1){				
				createTimeBasedPOBSOne(StartDateStr);						
			}else{				
				createTimeBasedPO(StartDateStr,BATCHSIZE);
			}						
		}
		// Increment Date
		StartDate.setDate(StartDate.getDate() + 1);
	}
	//Update sequence
	dg.resetTableSequence('purchaseOrderSeqId');
	body = body
	+ MESSAGES.getMessage('SEPM_ADMIN', '001', noRecords,
			'EPM.Purchase.Header') + "\n";
	
	$.response.status = $.net.http.OK;
	$.response.setBody(body);
	
}
//Helper method to created time based purchase order when batch size is 1
function createTimeBasedPOBSOne(StartDateStr){
	var maxPoId = '';
	try {
		var conn = $.db.getConnection();
		
		//Randomly extract the product and the corresponding price of the selected product
		var randProductIndex = Math.floor(Math.random() * 105);
		var randProduct = prodDict[randProductIndex].prod;
		var randPrice = prodDict[randProductIndex].price;

		//Extract the max PO Id
		var query = "SELECT MAX(\"PURCHASEORDERID\") FROM \"_SYS_BIC\".\"{{PACKAGE_NAME}}.data::EPM.Purchase.Header\"";
		var pstmt = conn.prepareStatement(query);
		var rsMax = pstmt.executeQuery();
		while (rsMax.next()) {
			maxPoId = rsMax.getNString(1);
		}
		rsMax.close();
		pstmt.close();
		maxPoId = parseInt(maxPoId, 10) + 1;
		maxPoId = maxPoId.toString() ;
		var randQuantity = Math.floor((Math.random() * 9)+1) ;
		var randNetAmount = parseInt((randQuantity * randPrice).toFixed(2),10) ;
		var randTaxAmount = parseInt((randNetAmount * 0.19).toFixed(2),10);  // Taking 19% Tax	
		var randGrossAmount = randNetAmount + randTaxAmount ;

		//Insert the items for purchaseOrderItem table
		query = "INSERT INTO \"_SYS_BIC\".\"{{PACKAGE_NAME}}.data::EPM.Purchase.Item\" "
			+ "(\"PURCHASEORDERID\", \"PURCHASEORDERITEM\", \"PRODUCTID\", \"NOTEID\", \"CURRENCY\", \"GROSSAMOUNT\", \"NETAMOUNT\", \"TAXAMOUNT\", \"QUANTITY\", \"QUANTITYUNIT\", \"DELIVERYDATE\") "
			+ "VALUES (?,?,?,?,?,?,?,?,?,?,?)";
				
		pstmt = conn.prepareStatement(query);
		pstmt.setString(1, "0"+maxPoId);
		pstmt.setString(2,"0000000010");
		pstmt.setString(3,randProduct);
		pstmt.setString(4,"NoteId");
		pstmt.setString(5,"EUR");
		pstmt.setInt(6,randGrossAmount);					
		pstmt.setInt(7,randNetAmount);
		pstmt.setInt(8,randTaxAmount);
		pstmt.setInt(8,randTaxAmount);
		pstmt.setInt(9,randQuantity);
		pstmt.setString(10,"EA");
		pstmt.setDate(11,StartDateStr);	
		pstmt.executeUpdate();
		pstmt.close();

		//Randomly extract the business partner from businessPartnerArray
		var randBPIndex = Math.floor(Math.random() * 44);  // since BP is 45
		var randBP = bpDict[randBPIndex];

		//Insert the items for purchaseOrderHeader table
		query = "INSERT INTO \"_SYS_BIC\".\"{{PACKAGE_NAME}}.data::EPM.Purchase.Header\""
			+ "(\"PURCHASEORDERID\", \"HISTORY.CREATEDBY\", \"HISTORY.CREATEDAT\", \"HISTORY.CHANGEDBY\", \"HISTORY.CHANGEDAT\", \"NOTEID\", \"PARTNERID\", \"CURRENCY\", \"GROSSAMOUNT\", \"NETAMOUNT\", \"TAXAMOUNT\", \"LIFECYCLESTATUS\", \"APPROVALSTATUS\", \"CONFIRMSTATUS\", \"ORDERINGSTATUS\", \"INVOICINGSTATUS\" )" 
			+ "VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
		pstmt = conn.prepareStatement(query);	
		pstmt.setString(1,"0"+maxPoId);
		pstmt.setString(2,"0000000033");
		pstmt.setDate(3,StartDateStr);
		pstmt.setString(4,"0000000033");
		pstmt.setDate(5,StartDateStr);
		pstmt.setString(6,"NoteId");
		pstmt.setString(7,randBP);
		pstmt.setString(8,"EUR");
		pstmt.setInt(9,randGrossAmount);
		pstmt.setInt(10,randNetAmount);
		pstmt.setInt(11,randTaxAmount);
		pstmt.setString(12,"N");
		pstmt.setString(13,"I");
		pstmt.setString(14,"I");
		pstmt.setString(15,"I");
		pstmt.setString(16,"I");	
		pstmt.executeUpdate();
		pstmt.close();
		conn.commit();
		conn.close();
	} catch (e) {
		$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
		$.response.setBody(e.message);
	}
}

// Helper method to create time based purchase orders when the batch size is more than 1
function createTimeBasedPO(StartDateStr,BATCHSIZE) {	
	var maxPoId = '';
	try {
		var conn = $.db.getConnection();
		var i;

		//Insert statement for purchaseOrderItem table
		var query = "INSERT INTO \"_SYS_BIC\".\"{{PACKAGE_NAME}}.data::EPM.Purchase.Item\" "
			+ "(\"PURCHASEORDERID\", \"PURCHASEORDERITEM\", \"PRODUCTID\", \"NOTEID\", \"CURRENCY\", \"GROSSAMOUNT\", \"NETAMOUNT\", \"TAXAMOUNT\", \"QUANTITY\", \"QUANTITYUNIT\", \"DELIVERYDATE\") "
			+ "VALUES (?,?,?,?,?,?,?,?,?,?,?)";	
		var pstmtPOItem = conn.prepareStatement(query);	

		//Insert statement for purchaseOrderHeader table
		var queryPO = "INSERT INTO \"_SYS_BIC\".\"{{PACKAGE_NAME}}.data::EPM.Purchase.Header\""
			+ "(\"PURCHASEORDERID\", \"HISTORY.CREATEDBY\", \"HISTORY.CREATEDAT\", \"HISTORY.CHANGEDBY\", \"HISTORY.CHANGEDAT\", \"NOTEID\", \"PARTNERID\", \"CURRENCY\", \"GROSSAMOUNT\", \"NETAMOUNT\", \"TAXAMOUNT\", \"LIFECYCLESTATUS\", \"APPROVALSTATUS\", \"CONFIRMSTATUS\", \"ORDERINGSTATUS\", \"INVOICINGSTATUS\" )" 
			+ "VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
		var pstmtPOHeader = conn.prepareStatement(queryPO);
		
		//set the BATCHSIZE for the items to be inserted into the purchaseOrderItem and purchaseOrderHeader tables
		pstmtPOHeader.setBatchSize(BATCHSIZE);	
		pstmtPOItem.setBatchSize(BATCHSIZE);
		
		//Extract the max PO Id
		var queryMaxPO = "SELECT MAX(\"PURCHASEORDERID\") FROM \"_SYS_BIC\".\"{{PACKAGE_NAME}}.data::EPM.Purchase.Header\"";
		var pstmtMaxPO = conn.prepareStatement(queryMaxPO);
		var rsMax = pstmtMaxPO.executeQuery();
		while (rsMax.next()) {
			maxPoId = rsMax.getNString(1);							
		}
		rsMax.close();
		pstmtMaxPO.close();

		
		//batch inserts
		for (i=0; i<BATCHSIZE; i++){

			//Randomly extract the product and the corresponding price of the selected product
			var randProductIndex = Math.floor(Math.random() * 105);
			var randProduct = prodDict[randProductIndex].prod;
			var randPrice = prodDict[randProductIndex].price;

			//Creating values to be inserted purchaseOrderItem table			
			maxPoId = parseInt(maxPoId, 10) + 1;
			maxPoId = maxPoId.toString() ;
			var randQuantity = Math.floor((Math.random() * 9)+1) ;
			var randNetAmount = parseInt((randQuantity * randPrice).toFixed(2),10) ;
			var randTaxAmount = parseInt((randNetAmount * 0.19).toFixed(2),10);  // Taking 19% Tax
			var randGrossAmount = randNetAmount + randTaxAmount ;			
			pstmtPOItem.setString(1,"0"+maxPoId);
			pstmtPOItem.setString(2,"0000000010");
			pstmtPOItem.setString(3,randProduct);
			pstmtPOItem.setString(4,"NoteId");
			pstmtPOItem.setString(5,"EUR");
			pstmtPOItem.setInt(6,randGrossAmount);					
			pstmtPOItem.setInt(7,randNetAmount);
			pstmtPOItem.setInt(8,randTaxAmount);
			pstmtPOItem.setInt(9,randQuantity);
			pstmtPOItem.setString(10,"EA");
			pstmtPOItem.setDate(11,StartDateStr);
			pstmtPOItem.addBatch();	

			//Randomly extract the business partner from businessPartnerArray
			var randBPIndex = Math.floor(Math.random() * 44);  // since BP is 45
			var randBP = bpDict[randBPIndex];

			//Creating values to be inserted for the purchaseOrderHeader table
			pstmtPOHeader.setString(1,"0"+maxPoId);
			pstmtPOHeader.setString(2,"0000000033");
			pstmtPOHeader.setDate(3,StartDateStr);
			pstmtPOHeader.setString(4,"0000000033");
			pstmtPOHeader.setDate(5,StartDateStr);
			pstmtPOHeader.setString(6,"NoteId");
			pstmtPOHeader.setString(7,randBP);
			pstmtPOHeader.setString(8,"EUR");
			pstmtPOHeader.setInt(9,randGrossAmount);
			pstmtPOHeader.setInt(10,randNetAmount);
			pstmtPOHeader.setInt(11,randTaxAmount);
			pstmtPOHeader.setString(12,"N");
			pstmtPOHeader.setString(13,"I");
			pstmtPOHeader.setString(14,"I");
			pstmtPOHeader.setString(15,"I");
			pstmtPOHeader.setString(16,"I");		
			pstmtPOHeader.addBatch();			
		}
		pstmtPOItem.executeBatch();		
		pstmtPOItem.close();
		pstmtPOHeader.executeBatch();	
		pstmtPOHeader.close();
		conn.commit();
		conn.close();
	} catch (e) {
		$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
		$.response.setBody(e.message);
	}
}
//Generate Sales Orders by replicating from table
function replicateSalesOrders() {
	var body = '';
	var maxSoId = '';

	try {
		var conn = $.db.getConnection();

		var query = 'SELECT MAX("SALESORDERID") FROM "_SYS_BIC"."{{PACKAGE_NAME}}.data::EPM.Sales.Header"';
		var pstmt = conn.prepareStatement(query);
		var rs = pstmt.executeQuery();
		while (rs.next()) {
			maxSoId = rs.getNString(1);
		}  
		rs.close();
		pstmt.close();

		maxSoId = parseInt(maxSoId, 10) + 1;

		query = 'INSERT INTO "_SYS_BIC"."{{PACKAGE_NAME}}.data::EPM.Sales.Header" '
			+ '("SALESORDERID", "HISTORY.CREATEDBY", "HISTORY.CREATEDAT", "HISTORY.CHANGEDBY", "HISTORY.CHANGEDAT", "NOTEID", '
			+ ' "PARTNERID", "CURRENCY", "GROSSAMOUNT", "NETAMOUNT", "TAXAMOUNT", '
			+ ' "LIFECYCLESTATUS", "BILLINGSTATUS", "DELIVERYSTATUS" ) '
			+ 'select \'0\' || to_int("SALESORDERID" + '
			+ maxSoId
			+ ' - 500000000 ), "HISTORY.CREATEDBY", ' 
			+ ' add_days(now(), ROUND(TO_DECIMAL(-365 + (0+365)*RAND()),0)), '
			+ ' "HISTORY.CHANGEDBY", "HISTORY.CHANGEDAT", "NOTEID", '
			+ ' "PARTNERID", "CURRENCY", "GROSSAMOUNT", "NETAMOUNT", "TAXAMOUNT", '
			+ ' "LIFECYCLESTATUS", "BILLINGSTATUS", "DELIVERYSTATUS" '
			+ '  from "{{PACKAGE_NAME}}.data::EPM.Sales.Header" WHERE "SALESORDERID" <= '
			+ " '0500000999' ";
	pstmt = conn.prepareStatement(query);
	var iNumSo = pstmt.executeUpdate();
	pstmt.close();
	body = body
			+ MESSAGES.getMessage('SEPM_ADMIN', '001', iNumSo, 'EPM.Sales.Header')
			+ "\n";

	query = 'INSERT INTO "_SYS_BIC"."{{PACKAGE_NAME}}.data::EPM.Sales.Item" '
			+ '("SALESORDERID", "SALESORDERITEM", "PRODUCTID", "NOTEID", "CURRENCY", '
			+ ' "GROSSAMOUNT", "NETAMOUNT", "TAXAMOUNT", "ITEMATPSTATUS", "OPITEMPOS", "QUANTITY", "QUANTITYUNIT", "DELIVERYDATE") '
			+ 'select \'0\' || to_int("SALESORDERID" + '
			+ maxSoId
			+ ' - 500000000 ), "SALESORDERITEM", '
			+ '"PRODUCTID"' 
			+ ', "NOTEID", "CURRENCY", '
			+ ' "GROSSAMOUNT", "NETAMOUNT", "TAXAMOUNT", "ITEMATPSTATUS", "OPITEMPOS", "QUANTITY", "QUANTITYUNIT", "DELIVERYDATE" '
			+ '  from "{{PACKAGE_NAME}}.data::EPM.Sales.Item" WHERE "SALESORDERID" <= '
			+ " '0500000999' ";
	pstmt = conn.prepareStatement(query);
	var iNumItem = pstmt.executeUpdate();
	pstmt.close();
	conn.commit();
	conn.close();
	dg.resetTableSequence('salesOrderId');
	body = body
			+ MESSAGES.getMessage('SEPM_ADMIN', '001', iNumItem,
					'EPM.Sales.Item') + "\n";

		
		$.response.status = $.net.http.OK;
		$.response.setBody(body);
	} catch (e) {
		$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
		$.response.setBody(e.message);
	}
}
//Create Sales Orders distributed randomly across a time period
function replicateTimeBasedSalesOrders(aStartDate,aEndDate,aNoRec) {

	var alpha = 0;
	var thetaArray = [];
	var i=0;
	var randNo = 0;
	var body ='';
	var j;
	var noRecords = aNoRec;
	var calc;

	//Calculate the number of days
	var StartDate = new Date(aStartDate);
	var endDate = new Date(aEndDate);
	var timeDiff = Math.abs(endDate.getTime() - StartDate.getTime());
	var diffDays = (Math.ceil(timeDiff/ (1000 * 3600 * 24)))+1;
	
	if (aNoRec == 0){
		return;
	}

	//Get the random number of purchase orders to be generated for each day finally stored in thetaArray[]
	randNo = Math.random();
	alpha = Math.round(aNoRec / diffDays) ;
	thetaArray[0] = Math.round(alpha * randNo);
	aNoRec = +(aNoRec - thetaArray[i]) || 0;
	
	for (i=1;i < diffDays-1;i++){
		//Generate a random number
		randNo = Math.random();
		alpha = Math.round(aNoRec / (diffDays - i));
		calc = Math.round(alpha * randNo)*Math.round(6*randNo);
		thetaArray[i] = (calc<=aNoRec)?calc:0;
		aNoRec = +(aNoRec - thetaArray[i]) || 0;
	}
	
	thetaArray[diffDays - 1] = +(aNoRec) || 0;

	//Loop to distribute the random purchase orders to be generated accross each day(date) and also calculate the BATCHSIZE
	for(j=0; j< diffDays ; j++){
		var tempthetaArray = thetaArray[j] ;		
		var startDay = StartDate.getDate();
		var startMonth = StartDate.getMonth() + 1;  // Jan is 0
		var startYear = StartDate.getFullYear();
		 if (thetaArray[j] === 0){
	        	continue;
	        }
		if (startDay < 10) {
			startDay ='0'+ startDay;
		}
		if (startMonth < 10) {
			startMonth ='0'+ startMonth;
		}
		var StartDateStr = startYear.toString() + startMonth.toString() + startDay;
		if ( tempthetaArray !== 0){
			var BATCHSIZE =  thetaArray[j];		    
			if (BATCHSIZE === 1){				
				createTimeBasedSOBSOne(StartDateStr);						
			}else{				
				createTimeBasedSO(StartDateStr,BATCHSIZE);
			}						
		}
		// Increment Date
		StartDate.setDate(StartDate.getDate() + 1);
	}
	//Update sequence
	dg.resetTableSequence('salesOrderId');
	body = body
	+ MESSAGES.getMessage('SEPM_ADMIN', '001', noRecords ,
			'EPM.Sales.Header') + "\n";
	
	$.response.status = $.net.http.OK;
	$.response.setBody(body);
}
//Helper method to created time based sales order when batch size is 1
function createTimeBasedSOBSOne(StartDateStr){
	var maxSoId = '';
	try {
		var conn = $.db.getConnection();
		
		//Randomly extract the product and the corresponding price of the selected product
		var randProductIndex = Math.floor(Math.random() * 105);
		var randProduct = prodDict[randProductIndex].prod;
		var randPrice = prodDict[randProductIndex].price;

		//Extract the max SO Id
		var query = "SELECT MAX(\"SALESORDERID\") FROM \"_SYS_BIC\".\"{{PACKAGE_NAME}}.data::EPM.Sales.Header\"";
		var pstmt = conn.prepareStatement(query);
		var rsMax = pstmt.executeQuery();
		while (rsMax.next()) {
			maxSoId = rsMax.getNString(1);
		}
		rsMax.close();
		pstmt.close();
		maxSoId = parseInt(maxSoId, 10) + 1;
		maxSoId = maxSoId.toString() ;
		var randQuantity = Math.floor((Math.random() * 9)+1) ;
		var randNetAmount = parseInt((randQuantity * randPrice).toFixed(2),10) ;
		var randTaxAmount = parseInt((randNetAmount * 0.19).toFixed(2),10);  // Taking 19% Tax	
		var randGrossAmount = randNetAmount + randTaxAmount ;
		query = "INSERT INTO \"_SYS_BIC\".\"{{PACKAGE_NAME}}.data::EPM.Sales.Item\" "
			+ "(\"SALESORDERID\", \"SALESORDERITEM\", \"PRODUCTID\", \"NOTEID\", \"CURRENCY\", \"GROSSAMOUNT\", \"NETAMOUNT\", \"TAXAMOUNT\", \"ITEMATPSTATUS\",\"OPITEMPOS\",\"QUANTITY\", \"QUANTITYUNIT\", \"DELIVERYDATE\") "
			+ "VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)";
			
		pstmt = conn.prepareStatement(query);
		pstmt.setString(1,"0"+maxSoId);
		pstmt.setString(2,"0000000010");
		pstmt.setString(3,randProduct);
		pstmt.setString(4,"NoteId");
		pstmt.setString(5,"EUR");
		pstmt.setInt(6,randGrossAmount);					
		pstmt.setInt(7,randNetAmount);
		pstmt.setInt(8,randTaxAmount);
		pstmt.setString(9,"I");
		pstmt.setString(10,"?");
		pstmt.setInt(11,randQuantity);
		pstmt.setString(12,"EA");
		pstmt.setDate(13,StartDateStr);
		pstmt.executeUpdate();
		pstmt.close();

		//Randomly extract the business partner from businessPartnerArray
		var randBPIndex = Math.floor(Math.random() * 44);  // since BP is 45
		var randBP = bpDict[randBPIndex];

		//Insert the items for salesOrderHeader table
		query = "INSERT INTO \"_SYS_BIC\".\"{{PACKAGE_NAME}}.data::EPM.Sales.Header\""
			+ "(\"SALESORDERID\", \"HISTORY.CREATEDBY\", \"HISTORY.CREATEDAT\", \"HISTORY.CHANGEDBY\", \"HISTORY.CHANGEDAT\", \"NOTEID\", \"PARTNERID\", \"CURRENCY\", \"GROSSAMOUNT\", \"NETAMOUNT\", \"TAXAMOUNT\", \"LIFECYCLESTATUS\",\"BILLINGSTATUS\", \"DELIVERYSTATUS\")" 
			+ "VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
		pstmt = conn.prepareStatement(query);
		pstmt.setString(1,"0"+maxSoId);
		pstmt.setString(2,"0000000033");
		pstmt.setDate(3,StartDateStr);
		pstmt.setString(4,"0000000033");
		pstmt.setDate(5,StartDateStr);
		pstmt.setString(6,"NoteId");
		pstmt.setString(7,randBP);
		pstmt.setString(8,"EUR");
		pstmt.setInt(9,randGrossAmount);
		pstmt.setInt(10,randNetAmount);
		pstmt.setInt(11,randTaxAmount);
		pstmt.setString(12,"N");
		pstmt.setString(13,"I");
		pstmt.setString(14,"I");	
		pstmt.executeUpdate();
		pstmt.close();
		conn.commit();
		conn.close();
	} catch (e) {
		$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
		$.response.setBody(e.message);
	}
}
//Helper method to create time based sales orders when the batch size is more than 1
function createTimeBasedSO(StartDateStr,BATCHSIZE) {	
	var maxSoId = '';
	try {
		var conn = $.db.getConnection();
		var i;
         
		//Insert statement for purchaseOrderItem table
		var query = "INSERT INTO \"_SYS_BIC\".\"{{PACKAGE_NAME}}.data::EPM.Sales.Item\" "
			+ "(\"SALESORDERID\", \"SALESORDERITEM\", \"PRODUCTID\", \"NOTEID\", \"CURRENCY\", \"GROSSAMOUNT\", \"NETAMOUNT\", \"TAXAMOUNT\",\"ITEMATPSTATUS\",\"OPITEMPOS\",\"QUANTITY\", \"QUANTITYUNIT\", \"DELIVERYDATE\") "
			+ "VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)";	
		var pstmtSOItem = conn.prepareStatement(query);	

		//Insert statement for purchaseOrderHeader table
		var querySO = "INSERT INTO \"_SYS_BIC\".\"{{PACKAGE_NAME}}.data::EPM.Sales.Header\""
			+ "(\"SALESORDERID\", \"HISTORY.CREATEDBY\", \"HISTORY.CREATEDAT\", \"HISTORY.CHANGEDBY\", \"HISTORY.CHANGEDAT\", \"NOTEID\", \"PARTNERID\", \"CURRENCY\", \"GROSSAMOUNT\", \"NETAMOUNT\", \"TAXAMOUNT\", \"LIFECYCLESTATUS\", \"BILLINGSTATUS\", \"DELIVERYSTATUS\")" 
			+ "VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
		var pstmtSOHeader = conn.prepareStatement(querySO);
		
		//set the BATCHSIZE for the items to be inserted into the purchaseOrderItem and purchaseOrderHeader tables
		pstmtSOHeader.setBatchSize(BATCHSIZE);	
		pstmtSOItem.setBatchSize(BATCHSIZE);
		
		//Extract the max PO Id
		var queryMaxSO = "SELECT MAX(\"SALESORDERID\") FROM \"_SYS_BIC\".\"{{PACKAGE_NAME}}.data::EPM.Sales.Header\"";
		var pstmtMaxSO = conn.prepareStatement(queryMaxSO);
		var rsMax = pstmtMaxSO.executeQuery();
		while (rsMax.next()) {
			maxSoId = rsMax.getNString(1);							
		}
		rsMax.close();
		pstmtMaxSO.close();

		//batch inserts
		for (i=0; i<BATCHSIZE; i++){

			//Randomly extract the product and the corresponding price of the selected product
			var randProductIndex = Math.floor(Math.random() * 105);
			var randProduct = prodDict[randProductIndex].prod;
			var randPrice = prodDict[randProductIndex].price;

			//Creating values to be inserted purchaseOrderItem table			
			maxSoId = parseInt(maxSoId, 10) + 1;
			maxSoId = maxSoId.toString() ;
			var randQuantity = Math.floor((Math.random() * 9)+1) ;
			var randNetAmount = parseInt((randQuantity * randPrice).toFixed(2),10) ;
			var randTaxAmount = parseInt((randNetAmount * 0.19).toFixed(2),10);  // Taking 19% Tax
			var randGrossAmount = randNetAmount + randTaxAmount ;			
			pstmtSOItem.setString(1,"0"+maxSoId);
			pstmtSOItem.setString(2,"0000000010");
			pstmtSOItem.setString(3,randProduct);
			pstmtSOItem.setString(4,"NoteId");
			pstmtSOItem.setString(5,"EUR");
			pstmtSOItem.setInt(6,randGrossAmount);					
			pstmtSOItem.setInt(7,randNetAmount);
			pstmtSOItem.setInt(8,randTaxAmount);
			pstmtSOItem.setString(9,"I");
			pstmtSOItem.setString(10,"?");
			pstmtSOItem.setInt(11,randQuantity);
			pstmtSOItem.setString(12,"EA");
			pstmtSOItem.setDate(13,StartDateStr);
			pstmtSOItem.addBatch();	

			//Randomly extract the business partner from businessPartnerArray
			var randBPIndex = Math.floor(Math.random() * 44);  // since BP is 45
			var randBusinessPartner = bpDict[randBPIndex];

			//Creating values to be inserted for the purchaseOrderHeader table
			pstmtSOHeader.setString(1,"0"+maxSoId);
			pstmtSOHeader.setString(2,"0000000033");
			pstmtSOHeader.setDate(3,StartDateStr);
			pstmtSOHeader.setString(4,"0000000033");
			pstmtSOHeader.setDate(5,StartDateStr);
			pstmtSOHeader.setString(6,"NoteId");
			pstmtSOHeader.setString(7,randBusinessPartner);
			pstmtSOHeader.setString(8,"EUR");
			pstmtSOHeader.setInt(9,randGrossAmount);
			pstmtSOHeader.setInt(10,randNetAmount);
			pstmtSOHeader.setInt(11,randTaxAmount);
			pstmtSOHeader.setString(12,"N");
			pstmtSOHeader.setString(13,"I");
			pstmtSOHeader.setString(14,"I");		
			pstmtSOHeader.addBatch();			
		}
		pstmtSOItem.executeBatch();		
		pstmtSOItem.close();
		pstmtSOHeader.executeBatch();	
		pstmtSOHeader.close();
		conn.commit();
		conn.close();
	} catch (e) {
		$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
		$.response.setBody(e.message);
	}
}

//Get size of all tables and their names in a two diamensional array
function getTableSize() {
	var i = 0;
	var body = '';
	var list = [];
	var conn='';
	function createTotalEntry(rs, table, rs2) {
		
		var record_count =  rs.getInteger(1); 
		var table_size = Math.round(rs2.getInteger(1) / 1024);
		
	
		return {
			"name" : table,
			"table_size" : table_size,
			"record_count" : record_count			
		};

	}
	var tableDict = [{"tableName":"EPM.MasterData.Addresses","tableSynonym":"Address"},{"tableName":"EPM.MasterData.BusinessPartner","tableSynonym":"Business Partner"},
	                 {"tableName":"EPM.Util.Constants","tableSynonym":"Constants"},{"tableName":"EPM.MasterData.Employees","tableSynonym":"Employees"},
	                 {"tableName":"EPM.Util.Messages","tableSynonym":"Messages"},{"tableName":"EPM.MasterData.Products","tableSynonym":"Products"},
	                 {"tableName":"EPM.Purchase.Header","tableSynonym":"Purchase Order Headers"},{"tableName":"EPM.Purchase.Item","tableSynonym":"Purchase Order Items"},
	                 {"tableName":"EPM.Sales.Header","tableSynonym":"Sales Order Headers"},{"tableName":"EPM.Sales.Item","tableSynonym":"Sales Order Items"},
	                 {"tableName":"EPM.Util.Texts","tableSynonym":"Texts"}];
	conn = $.db.getConnection();
	for (i = 0; i < tableDict.length; i++) {
		var query = 'SELECT COUNT(*) FROM "_SYS_BIC"."{{PACKAGE_NAME}}.data::'
				+ tableDict[i].tableName + '"';
		
		var pstmt = conn.prepareStatement(query);
		var rs = pstmt.executeQuery();
		var query2 = 'SELECT "TABLE_SIZE" FROM "SYS"."M_TABLES" WHERE "SCHEMA_NAME" = \'_SYS_BIC\' AND "TABLE_NAME" = \'{{PACKAGE_NAME}}.data::'
				+ tableDict[i].tableName + '\'';
		var pstmt2 = conn.prepareStatement(query2);
		var rs2 = pstmt2.executeQuery();

		while (rs.next()) {
			rs2.next();
			list.push(createTotalEntry(rs, tableDict[i].tableSynonym, rs2));
		}

		rs.close();
		rs2.close();
		pstmt.close();
		pstmt2.close();
	}
	conn.close(); 
	body = JSON.stringify({
		"entries" : list
	});

	$.response.contentType = 'application/json; charset=UTF-8';
	$.response.setBody(body);
	$.response.status = $.net.http.OK;
}

//Generate synonyms for currency conversion tables
function generateSynonym() {

	// open db connection
	var conn = $.db.getConnection();
	var i = 0;
	var body = '';
	var query = '';
	var pstmt;

	var tableArray = [ "T006", "T006A", "TCURC", "TCURF", "TCURN", "TCURR",
			"TCURT", "TCURV", "TCURW", "TCURX" ];
	for (i = 0; i < tableArray.length; i++) {
		try {
			query = 'DROP SYNONYM "{{SCHEMA_NAME}}"."' + tableArray[i]	+ '" ';
			pstmt = conn.prepareStatement(query);
			pstmt.execute();
			pstmt.close();
		} catch (e) {
		}
	}

	for (i = 0; i < tableArray.length; i++) {
		query = 'CREATE SYNONYM "{{SCHEMA_NAME}}"."'
				+ tableArray[i]
				+ '" FOR "_SYS_BIC"."{{PACKAGE_NAME}}.data::EPM.Conversions.'
				+ tableArray[i] + '"';
		pstmt = conn.prepareStatement(query);
		pstmt.execute();
		pstmt.close();
		body = body
				+ 'Created Synonym: "{{SCHEMA_NAME}}"."'
				+ tableArray[i]
				+ ' FOR "_SYS_BIC"."{{PACKAGE_NAME}}.data::'
				+ tableArray[i] + '" \n';
	}

	conn.commit();

	$.response.status = $.net.http.OK;
	$.response.setBody(body);

	// close db connection
	conn.close();
}