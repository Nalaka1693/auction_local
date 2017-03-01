//------------------global variables -------------------//
var additemenabled = true;
var itemid, itemname, itemdesc;
var deluid,p_data,table;


//-------------------all btns---------------------------//

// Main window - add item btn
$("#add-item-btn").click(function (d){
    additemenabled=true;
    clearFormData();
    $("#itemid").prop('disabled',false);
    $("#confirm-win-btn").text("Create");
    $("#add-item-modal").modal();
});

// Main Window - Table - Edit
$(document).on('click','.editBtn',function(d){
    var iid = this.parentNode.parentNode.childNodes[0].innerHTML;
    additemenabled=false;
    var obj = {"item_id":iid};
    //ajax
    $.ajax({
        url : "http://127.0.0.1:3000/items/edit",
        type : "POST",
        dataType :"json",
        data : obj,
        success:function(data,textStatus,jqXHR){
            var response = jqXHR.responseJSON[0];
            itemid = response.item_id;
            itemname = response.item_name;
            itemdesc = response.description;
            setFormData();
            
            $("#itemid").prop('disabled',true);
            $("#confirm-win-btn").text("Change");
            $("#add-item-modal").modal();
            
        }
    })
    

});

//main Window - table -del
$(document).on('click','.delBtn',function(d){
    var iid = this.parentNode.parentNode.childNodes[0].innerHTML;
    deluid = iid;
    var name =  this.parentNode.parentNode.childNodes[1].innerHTML;
    $("#del-item-name-label").text(name);
    $("#del-item-confirm-modal").modal();
})


//add item window - confirm
$("#win-add-item-btn").click(function (d){
    getFormData();
    setConWinData();
    $("#add-item-conf-modal").modal();
    
});

//confirm window - confirm btn
$("#win-conf-item-btn").click(function (d){
    //MAKE JSON
    //SEND BY AJAX
    
    if(additemenabled){
        //post req
        var obj = createJSON();
        var path = "http://127.0.0.1:3000/items/add";
        sendDatabyPost(path,obj,"New Item Added");
        
    }
    else{
        //post req
        var obj = createJSON();
        var path = "http://127.0.0.1:3000/items/edit/confirm";
        sendDatabyPost(path,obj,"Item status updated");
    }
});

//confirm window - close btn
$("#conf-close-btn").click(function (d){
    setFormData();
    $("#add-item-modal").modal();
});


// del confirm window - yes btn
$("#del-item-cbtn").click(function(d) {
    //ajax to del
    var json = {"item_id": deluid};
    var path = "http://127.0.0.1:3000/items/del";
    
    $.ajax({
        url : path,
        dataType: 'json',
        data : json,
        type : "DELETE",
        success:function(data,textStatus,jqXHR){
             sendDatatoUpdate({},"http://127.0.0.1:3000/items/initial");
        }
    })
})

//del confirm window- no btn
$("#del-item-close-btn").click(function(d) {
    deluid="";
});



//-----------------get form data------------------------//

// get data from input form
function getFormData(){
    itemid = $("#itemid").val();
    itemname = $("#itemname").val();
    itemdesc = $("#item-desc").val();
}

//clear input data form
function clearFormData(){
    $("#itemid").val("");
    $("#itemname").val("");
    $("#item-desc").val("");
}

//set data in form
function setFormData(){
    $("#itemid").val(itemid);
    $("#itemname").val(itemname);
    $("#item-desc").val(itemdesc);
}

//set data for confirm win
function setConWinData(){
    $("#itemid-label").text(itemid);
    $("#itemname-label").text(itemname);
    $("#itemdesc-label").text(itemdesc);
}


//set data for view win
function setViewData(){
    $("#itemid-view").text(itemid);
    $("#itemname-view").text(itemname);
    $("#itemdesc-view").text(itemdesc);
}

    
    
//-------------------support functions ----------------------//
    
// check word is empty
function checkEmpty(a){
    return a.length===0;
}

function createJSON(){
    var json = {
        item_id : itemid,
        item_name : itemname,
        description : itemdesc
    }
    return json;
}


// table populate
function filterTable(obj){
    var tid = obj.item_id;
    var tiname = obj.item_name;
    var tidesc = obj.description;
    var btn =   '<a class="delBtn btn btn-default btn-sm pull-right" href="#">'+
                '<i class="fa fa-trash fa-fw"></i> Delete</a>'+
                '<a class="editBtn btn btn-default btn-sm pull-right" href="#">'+
                '<i class="fa fa-pencil fa-fw"></i> Edit</a>';
    
    var newObj = {
        "item_id" : tid,
        "item_name" : tiname,
        "description" : tidesc,
        "btn" : btn
    }
    p_data.data.push(newObj);
}

function tablerefresh(){
    table = $("#item-table").DataTable({
        "bPaginate":true,
        "aaData":p_data.data,
        "aoColumns":[
            {"data":"item_id"},
            {"data":"item_name"},
            {"data":"description"},
            {"data":"btn"}
        ]
    });
	
	$("#item-table tr td:first-child").css('cursor', 'pointer');
		$('#item-table').on('click', 'tr td:first-child', function () {
        	var data = table.row( this ).data();
			var obj = {"item_id":data.item_id};
			//send ajax
			$.ajax({
				url : "http://127.0.0.1:3000/items/edit",
				type : 'POST',
				dataType: "json",
				data : obj,
				success : function(data,textStatus,jqXHR){
					var response = jqXHR.responseJSON[0];
					itemid = response.item_id;
					itemname = response.item_name;
					itemdesc = response.description;
					setViewData();
					$("#view-item-modal").modal();

				}
			});
    	} );
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
            sendDatatoUpdate({},'http://127.0.0.1:3000/items/initial');
        },
        fail:function(jqXHR,textStatus,errorThrown){
           
        }
    });
}



//-------------------table load functions -------------------//

//for refresh page by search
function loadtable(data){
    //add code ajax
    $("#table-body").html("");
    datao.data.forEach(filterTable);
}

//--------------------onload------------------------------//
window.onload = function(){
    p_data={"data":[]};
    tablerefresh();
    sendDatatoUpdate({},'http://127.0.0.1:3000/items/initial');
}
