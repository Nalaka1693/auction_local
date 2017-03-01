//----------------variables---------------
var vendor_count, p_auctions;


//---------------sup----------------------

function getVendors(){
	$.ajax({
		url: "http://127.0.0.1:3000/users/vendor/count",
		type: "GET",
		dataType :"json",
		success : function(data,textStatus,jqXHR){
			var res = jqXHR.responseJSON[0];
			$("#vcount").text(res.count);
		}
		
	});
}


function getAuctions(){
	$.ajax({
		url: "http://127.0.0.1:3000/auctions/count",
		type: "GET",
		dataType :"json",
		success : function(data,textStatus,jqXHR){
			var res = jqXHR.responseJSON[0];
			$("#acount").text(res.count);
		}
	});
}


setInterval(getVendors,(10*1000));