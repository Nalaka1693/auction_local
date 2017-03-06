

function loadlinechart(aucid,count){
	//get detail from current menu
	var items = [];
	var vendors = []
	var obj = {"auction_id" : aucid};
	
	//load data item ids
	$.ajax({
		async : false,
		url : "http://localhost:3000/auctions/edit",
		type : "POST",
		dataType : "json",
		data : obj,
		success : function(data,textStatus,jqXHR){
			items = jqXHR.responseJSON[2];
			vendors = jqXHR.responseJSON[1];
			
		}
	});
	$.ajax({
		async : false,
		url : "http://localhost:3000/bids/bidbyauction",
		type : "POST",
		dataType : "json",
		data : obj,
		success : function(data,textStatus,jqXHR){
			var res = data;
			var dataarray = processDataForLineChart(items,data);
			var dataarrray_C = processDataForColumnChart(items,data);
			var dataarray_P = processDataForPieChart(vendors,data);
			//load google charts
			
			google.charts.setOnLoadCallback(drawCurveTypes(items,dataarray));
			google.charts.setOnLoadCallback(drawColumns(items,dataarrray_C));
			google.charts.setOnLoadCallback(drawPie(dataarray_P));
			
		}
	});
	
}


// drwa line chart
function drawCurveTypes(items,pdata){
		var data = new google.visualization.DataTable();
		
		
		data.addColumn('timeofday', 'X');
		items.forEach(function(d){
			data.addColumn('number',d.item_name);
		})
      	
		data.addRows(pdata);
		
		var options = {
			title: 'Variation of bids with time',
        	hAxis: {
  				title: 'Time '
        	},
        	vAxis: {
          		title: 'Variation Bid Values'
        	},
//			colors: ['#a52714', '#097138'],
			height : 400,
			width : 600,
			backgroundColor: '#f1f8e9'
      	};
	
	 	var chart = new google.visualization.LineChart(document.getElementById('lineChart'));
      	chart.draw(data, options);
    
}



//draw column chart
function drawColumns(items,pdata){
	var data = new google.visualization.DataTable();
	
	data.addColumn('number', 'X');
		items.forEach(function(d){
		data.addColumn('number',d.item_name);
	});
	
	data.addRows(pdata);
	var options = {
			title: 'Variation of bids with time',
			focusTarget: 'category',
        	hAxis: {
  				title: 'Time '
        	},
        	vAxis: {
          		title: 'Variation of Bid Values'
        	},
//			colors: ['#a52714', '#097138'],
			height : 400,
			width : 600,
			backgroundColor: '#f1f8e9'
      	};
	var chart = new google.visualization.ColumnChart(document.getElementById('columnChart'));
      chart.draw(data, options);
}


//draw a pie chart
function drawPie(datao){
	var data = new google.visualization.DataTable();
	
	data.addColumn('string',"Vendor ID");
	data.addColumn('number',"Bids");
	
	data.addRows(datao);
	
	var options = {
          	title: 'Bid Percentage',
			height : 400,
			width : 600,
			pieHole: 0.4,
			backgroundColor: '#f1f8e9'
	};
	
	var chart = new google.visualization.PieChart(document.getElementById('piechart'));
    chart.draw(data, options);
}

// process data for line chart
function processDataForLineChart(items,data){
	var array = [];
	var itemids = [];
	
	items.forEach(function(data){
		itemids.push(data.item_id);
	}) ;
	
	var groupedData = _.groupBy(data, function(d){return d.time});
	$.each(groupedData,function(k,v){
		var groupbyitem = _.groupBy(v,function(d){return d.item_id});
		var obj = [];
		obj[0] = tConvert(k);
		$.each(groupbyitem,function(keuy,val){
			for(i=0;i<itemids.length;i++){
				if(itemids[i]==keuy){
					obj[i+1]=parseInt(val[0].bid_amount);
				}
			}
		});
		array.push(obj);
	});
	
	return array;
	
}


function processDataForColumnChart(items,data){
	var array = [];
	var itemids = [];
	
	items.forEach(function(data){
		itemids.push(data.item_id);
	}) ;
	// take bids done at one time
	var groupedData = _.groupBy(data, function(d){return d.time});
	j = 0;
	$.each(groupedData,function(k,v){
		j++;
		var groupbyitem = _.groupBy(v,function(d){return d.item_id});
		var obj = [];
		obj[0] = { 'v' : j,'f':v[0].vendor_id};
		$.each(groupbyitem,function(keuy,val){
			for(i=0;i<itemids.length;i++){
				if(itemids[i]==keuy){
					obj[i+1]=parseInt(val[0].bid_amount);
				}
			}
		});
		array.push(obj);
		
	});
	return array;
}


function processDataForPieChart(vendors,data){
	var array = [];
	var vdnid = [];
	var count = [];
	
	vendors.forEach(function(data){
		vdnid.push(data.user_id);
	}) ;
	
	for(i=0;i<vdnid.length;i++){
		count[i]=0;
	}
	
	var groupedData = _.groupBy(data, function(d){return d.time});
	$.each(groupedData,function(k,v){
		for(i=0;i<vdnid.length;i++){
			if(v[0].vendor_id==vdnid[i]){
				count[i]+=1;
			}
			
		}
	});
	
	
	for(i=0;i<vdnid.length;i++){
		var obj = [];
		obj.push(vdnid[i]);
		obj.push(count[i]);
		array.push(obj);
	}
	
	
	return array;
	
}

//time convert
function tConvert (time) {
  var obj = time.split(":");
  var da = {
	  'v' : [parseInt(obj[0]),parseInt(obj[1]),parseInt(obj[2])],
	  'f' : time
  };
  return da;
	
}