/**
@param {connection} Connection - The SQL connection used in the OData request
@param {beforeTableName} String - The name of a temporary table with the single entry before the operation (UPDATE and DELETE events only)
@param {afterTableName} String -The name of a temporary table with the single entry after the operation (CREATE and UPDATE events only)
 */

function my_create_after_exit(param) {

	let
	after = param.afterTableName;

	//Get Input New Record Values
	//var	pStmt = param.connection.prepareStatement('select * from "' + after + '"');	 
	var pStmt;
	try {

		pStmt = param.connection
				.prepareStatement('select "{{PACKAGE_NAME}}.data::employeeSeqId".NEXTVAL from dummy');
		var rs = pStmt.executeQuery();
		var PersNo = '';
		while (rs.next()) {
			PersNo = rs.getString(1);
		}
		pStmt.close();
		pStmt = param.connection.prepareStatement("update\"" + after
				+ "\"set PERS_NO = ?");
		//  pstmt = param.connection.prepareStatement("update'"+ after + "' set PERS_NO = ?");

		//pstmt = param.connection.prepareStatement('update "' + after + '" set PERS_NO = ?');
		pStmt.setString(1, PersNo);
		pStmt.execute();
		pStmt.close();

		pStmt = param.connection.prepareStatement('select * from "' + after
				+ '"');
		rs = pStmt.executeQuery();
		while (rs.next()) {
			var persNo = rs.getString(1);
			var perFName = rs.getString(2);
			var perLName = rs.getString(3);
			var perEmail = rs.getString(4);
		}

		pStmt = param.connection
				.prepareStatement('insert into _SYS_BIC."{{PACKAGE_NAME}}.data::EPM.User.Details" values(?,?,?,?)');
		pStmt.setString(1, persNo);
		pStmt.setString(2, perFName);
		pStmt.setString(3, perLName);
		pStmt.setString(4, perEmail);
		pStmt.executeUpdate();
		pStmt.close();

	} catch (e) {
		pStmt.close();
	}

}
