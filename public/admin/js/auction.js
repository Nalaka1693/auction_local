//----------------global variales --------------------//
var aucid, aucdesc, aucname, duedate, stime, etime, cdate,user, vendors,items;
var s_aucid, s_aucname, s_sdate, s_edate, deluid,table;
var newaucenabled=true;
var n_vendors,n_items;
var p_data,table;




//----------------btns------------------------------//

// main window -  new auction btn
$("#new-auc-add-btn").click(function(d){
	vendors=[];
	items =[];
    newaucenabled = true;
    clearDataAddForm();
    $("#aucid").prop('disabled',false);
    $("#add-auc-window-au-btn").text("Create");
    $("#new-auction-modal").modal();
});


// Main Window - Table - Edit Btn
$(document).on('click','.editBtn',function (d){
	n_vendors=[];
	n_items=[];
    var aid = this.parentNode.parentNode.childNodes[0].innerHTML;
    newaucenabled=false;
	var obj = {"auction_id":aid};
    //update form
	$.ajax({
		url : "http://127.0.0.1:3000/auctions/edit",
		type : "POST",
		dataType : "json",
		data : obj,
		success: function(data, textStatus,jqXHR){
			var response = jqXHR.responseJSON;
			aucid = response[2].auction_id;
			aucname = response[2].name;
			aucdesc = response[2].description;
			duedate = response[2].due_date;
			stime = response[2].start_time;
			etime = response[2].end_time;
			vendors = response[0].vendors;
			items = response[1].items;
			vendors.forEach(function(data){
				
			});
			items.forEach(function(data){
				
			});
			setDataAddForm();
			$("#aucid").prop('disabled',true);
			$("#add-auc-window-au-btn").text("Change");
			$("#new-auction-modal").modal();
			
		}
		
	})
	
    

    
});


// Main Window - Table - Del Btn
$(document).on('click','.delBtn',function (d){
    var uid = this.parentNode.parentNode.childNodes[0].innerHTML;
    deluid = uid;
    var name =  this.parentNode.parentNode.childNodes[1].innerHTML;
    $("#del-auc-name-label").text("Are you sure, You want to Delete Auction "+name+" ?");
    $("#del-auction-confirm-modal").modal();
    //add code to give confirmation to delete
});

// Main WIndow ongoing panel
$(document).on('click','.ongoing-btn',function(d){
	var uid = this.lastElementChild.innerHTML;
	var obj = {"auction_id":uid};
	$.ajax({
		url: "http://127.0.0.1:3000/auctions/ongoing",
		data: obj,
		dataType: 'json',
		type: 'post',
		success:function(data,textStatus,jqXHR){
			var res = jqXHR.responseJSON;
			//open modal
		}
	})
});


// Main window - search btn
$("#search-btn").click(function(d) {
    getDatafromSearch();
    
    if(!checkEmpty(s_sdate) && !checkEmpty(s_edate)){
        //serch
        var obj = {"start_date":s_sdate, "end_date":s_edate };
    } 
});

//add auc window - confirm
$("#win-add-auc-btn").click(function (d){
    getDataAddForm();
    setDataOnConf();
    $("#add-auc-conf-modal").modal();
    
});

//add confirm window - confirm
$("#win-conf-auc-btn").click(function (d){
	if(newaucenabled){
		var obj= createJSON();
		var path = "http://127.0.0.1:3000/auctions/new";
		sendDatabyPost(path,obj,"New Auction Added");
	}
	else{
		var obj = createJSON();
		var path = "http://127.0.0.1:3000/auctions/edit/confirm";
		sendDatabyPost(path,obj,"Auction Status Changed");
	}
});

//add confirm window- close
$("#conf-close-btn").click(function (d){
	setDataAddForm();
	$("#new-auction-modal").modal();
});

// del confirm window - yes btn
$("#del-auc-cbtn").click(function(d) {
    //ajax to del
});

//del confirm window- no btn
$("#del-auc-close-btn").click(function(d) {
    deluid="";
});



//---------------forms------------------------------//

//get date from add auction
function getDataAddForm(){
    aucid = $("#aucid").val();
    aucdesc = $('#auc-desc').val();
    aucname = $("#auc-name").val();
    duedate = $("#due-date").val();
    stime = $("#start-time").val();
    etime = $("#end-time").val();
    n_vendors = $("#ven-list").val().split(",");
    n_items = $("#item-list").val().split(",");
    
	n_vendors.forEach(function(data){
		vendors.push(data.split("-")[1]);
	});
	
	n_items.forEach(function(data){
		items.push(data.split("-")[1]);
	});
    
}

//function clear add form
function clearDataAddForm(){
    $("#aucid").val("");
    $('#auc-desc').val("");
    $("#auc-name").val("");
    $("#due-date").val("");
    $("#start-time").val("");
    $("#end-time").val("");
    $("#ven-list").val("");
    $("#item-list").val("");
	$('#ven-list').tagsinput('removeAll');
	$('#item-list').tagsinput('removeAll');
}



//set data on add acution 
function setDataAddForm(){
    $("#aucid").val(aucid);
    $('#auc-desc').val(aucdesc);
    $("#auc-name").val(aucname);
    $("#due-date").val(duedate);
    $("#start-time").val(stime);
    $("#end-time").val(etime);
    n_vendors.forEach(setDataOnEditVendor);
    n_items.forEach(setDataOnEditItems);


}

function setDataOnEditVendor(obj){
    $("#ven-list").tagsinput('add',obj);
}

function setDataOnEditItems(obj){
     $("#item-list").tagsinput('add',obj);
}

//set data on conf modal
function setDataOnConf(){
    $("#aucid-label").text(aucid);
    $("#aucname-label").text(aucname);
    $("#aucdesc-label").text(aucdesc);
    $("#duedate-label").text(duedate);
    $("#stime-label").text(stime);
    $("#etime-label").text(etime);
	$("#venlist-label").text(n_vendors.toString());
	$("#itemlist-label").text(n_items.toString());
}



// get date from search
function getDatafromSearch(){

    s_sdate = $("#search-auc-sdate").val();
    s_edate = $("#search-auc-edate").val();
}

//--------------------sup -------------------------//
function checkEmpty(a){
    return a.length===0;
}

//get time diff
function diff(start, end) {
    start = start.split(":");
    end = end.split(":");
    var startDate = new Date(0, 0, 0, start[0], start[1], 0);
    var endDate = new Date(0, 0, 0, end[0], end[1], 0);
    var diff = endDate.getTime() - startDate.getTime();
    var hours = Math.floor(diff / 1000 / 60 / 60);
    diff -= hours * 1000 * 60 * 60;
    var minutes = Math.floor(diff / 1000 / 60);

    // If using time pickers with 24 hours format, add the below line get exact hours
    if (hours < 0)
       hours = hours + 24;

    return (hours <= 9 ? "0" : "") + hours + ":" + (minutes <= 9 ? "0" : "") + minutes;
}



function createJSON(){
    var json = {
        auction_id : aucid,
        name : aucname,
        description : aucdesc,
        due_date : duedate,
        start_time : stime,
        end_time : etime,
        vendors : vendors,
        items : items,
		created_by: user
    }
    return json;
}


// table populate
function filterTable(obj){
    var tid = obj.auction_id;
    var tiname = obj.name;
    var due_date = obj.due_date.substring(0,10);
	var btn = '<a class="delBtn btn btn-default btn-sm pull-right" href="#">'+
                '<i class="fa fa-trash fa-fw"></i> </a>'+
                '<a class="editBtn btn btn-default btn-sm pull-right" href="#">'+
                '<i class="fa fa-pencil fa-fw"></i></a>';
    var newobj = {
		"auction_id":tid,
		"name": tiname,
		"due_date": due_date,
		"btn": btn
	}
	p_data.data.push(newobj);
}

//update ongoing auctions
function filterOngoingPanel(obj){
	var tid = obj.auction_id;
	var tiname = obj.name;
	var tstime = obj.start_time;
	var date = new Date();
	var current_hour = date.getHours()+":"+date.getMinutes();
	var batch = diff(tstime,current_hour);
	
	$("#current-auctions").append(
		'<a href="#" class="list-group-item ongoing-btn">'+
        '<span class="badge">'+batch+' ago</span>'+
        '<i class="fa fa-fw fa-calendar"></i><h5>'+obj.name+'</h5><h6>'+ obj.auction_id+'</h6>'+                    
        '</a>'
	);
}


function tablerefresh(){
	table = $("#auc-table").DataTable({
		"bPaginate":true,
		"aaData":p_data.data,
		"aoColumns":[
			{"data":"auction_id"},
			{"data":"name"},
			{"data":"due_date"},
			{"data":"btn"}
		]
	});
}

// ajax post msg
function sendDatatoUpdate(jsonO,path,sucfunc,message){
    
    $.ajax({
        url : path,
        type : 'GET',
        dataType : 'json',
        data : jsonO,
        success:function(data,textStatus,jqXHR){
            var table_data = jqXHR.responseJSON;
			p_data.data = [];
			table_data.forEach(filterTable);
			table.destroy();
			tablerefresh();
        },
        fail:function(jqXHR,textStatus,errorThrown){
           
        }
    });
}


// send data to update database
function sendDatabyPost(path,json,successmsg){
    $.ajax({
        url : path,
        type : 'POST',
        dataType : 'json',
        data : json,
        success:function(data,textStatus,jqXHR){
			sendDatatoUpdate({},"http://127.0.0.1:3000/auctions/initial");
        },
        fail:function(jqXHR,textStatus,errorThrown){
           
        }
    });
}

// send data to update onogoing panel
function sendDataOngoing(){
	$.ajax({
		url : "http://127.0.0.1:3000/auctions/current",
		type : "GET",
		dataType : 'json',
		success : function(data, textStatus, jqXHR){
			$("#current-auctions").html("");
			var res = jqXHR.responseJSON;
			res.forEach(filterOngoingPanel);
		}
	});
}
setInterval(sendDataOngoing,(10*1000));

//-------------------table load -----------------------//

//for refresh page by search
function loadtable(data){
    //add code ajax
    $("#table-body").html("");
    datao.data.forEach(filterTable);
}

//---------------intial----------------------------//
window.onload = function(){
	item_list=[];
	vendor_list =[];
	p_data={"data":[]};
    $("#search-auc-sdate").datepicker();
    $("#search-auc-edate").datepicker();
	$("#due-date").datepicker();
//	$("#start-time").timepicker();
//	$("#end-time").timepicker();
	tablerefresh();
	sendDatatoUpdate({},"http://127.0.0.1:3000/auctions/initial");
     
    
}

$(document).ready(function (d){

	user = 'mas_admin';
	

	//------------------tags----------------------------//
	//


	var vendorn = new Bloodhound({
		datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
		queryTokenizer: Bloodhound.tokenizers.whitespace,
		prefetch : {
			url : "http://127.0.0.1:3000/users/vendorlist",
			filter : function(data){
				return $.map(data,function(vennames){
					return { 'name' : vennames.fname+" "+vennames.lname+"-"+vennames.user_id }
				});
			}
		}

	});


	var itemlist = new Bloodhound({
		datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
		queryTokenizer: Bloodhound.tokenizers.whitespace,
		prefetch : {
			url : "http://127.0.0.1:3000/items/itemlist",
			filter : function(data){
				return $.map(data,function(items){
					return {'name': items.item_name+"-"+items.item_id}
				});
			}
		}
	});

	vendorn.initialize();
	itemlist.initialize();

	$('#ven-list').tagsinput({
		typeaheadjs:{
			name:'vendorn',
			displayKey:'name',
			valueKey:'id',
			source:vendorn.ttAdapter()
		},
		freeInput:true,
		allowDuplicates:false,
		onTagExists: function(item, $tag) {
			$tag.hide().fadeIn();
		}
	});

	$('#item-list').tagsinput({
		typeaheadjs:{
			name:'itemlist',
			displayKey:'name',
			valueKey:'id',
			source:itemlist.ttAdapter()
		},
		freeInput:true,
		allowDuplicates:false,
		onTagExists: function(item, $tag) {
			$tag.hide().fadeIn();
		}
	});

	
})
