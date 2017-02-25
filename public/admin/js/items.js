//------------------global variables -------------------//
var additemenabled = true;
var itemid, itemname, itemdesc;
var deluid;


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
    $("#itemid").prop('disabled',true);
    $("#confirm-win-btn").text("Change");
    $("#add-item-modal").modal();
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
    var obj = createJSON();
    if(additemenabled){
        //post req
    }
    else{
        //post req
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
    $("#itemid").text(itemid);
    $("#itemname").text(itemname);
    $("#item-desc").text(itemdesc);
}

//set data for confirm win
function setConWinData(){
    $("#itemid-label").text(itemid);
    $("#itemname-label").text(itemname);
    $("#itemdesc-label").text(itemdesc);
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
    
    $("#table-body").append(
        "<tr>"+
            "<td>" + tid + "</td>"+
            "<td>" + tiname +"</td>"+
            "<td>" + tidesc+ "</td>"+
            "<td>"+   
                '<a class="delBtn btn btn-default btn-sm pull-right" href="#">'+
                '<i class="fa fa-trash fa-fw"></i> Delete</a>'+
                '<a class="editBtn btn btn-default btn-sm pull-right" href="#">'+
                '<i class="fa fa-pencil fa-fw"></i> Edit</a>'+
            "</td>"+
        "</tr>"
    );
}

// ajax post msg
function sendDatatoUpdate(jsonO,path,sucfunc,message){
    
    $.ajax({
        url : path,
        type : 'POST',
        dataType : 'json',
        data : jsonO,
        success:function(data,textStatus,jqXHR){
            loadtable(data);
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
    $('#item-table').DataTable();
}
