//----------------global variales --------------------//
var aucid, aucdesc, aucname, duedate, stime, etime, cdate, cuser,vendors,items;
var s_aucid, s_aucname, s_sdate, s_edate, deluid;
var newaucenabled=true;



//----------------btns------------------------------//

// main window -  new auction btn
$("#new-auc-add-btn").click(function(d){
    newaucenabled = true;
    clearDataAddForm();
    $("#aucid").prop('disabled',false);
    $("#add-auc-window-au-btn").text("Create");
    $("#new-auction-modal").modal();
});


// Main Window - Table - Edit Btn
$(document).on('click','.editBtn',function (d){
    var uid = this.parentNode.parentNode.childNodes[0].innerHTML;
    newaucenabled=false;
    //update form
    
    setDataAddForm();
    $("#aucid").prop('disabled',true);
    $("#add-auc-window-au-btn").text("Change");
    $("#new-auction-modal").modal();
    
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
    vendors = $("#ven-list").val().split(",");
    items = $("#item-list").val().split(",");
    
    
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
}



//set data on add acution 
function setDataAddForm(){
    $("#aucid").val(aucid);
    $('#auc-desc').val(aucdesc);
    $("#auc-name").val(aucname);
    $("#due-date").val(duedate);
    $("#start-time").val(stime);
    $("#end-time").val(etime);
    vendors.forEach(setDataOnEditVendor);
    items.forEach(setDataOnEditItems);


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
}



// get date from search
function getDatafromSearch(){

    s_sdate = $("#search-auc-sdate").val();
    s_edate = $("#search-auc-edate").val();
}


//------------------tags----------------------------//
//

var vendorn = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local : [{id:"02156", name:"lenovo"},{id:"265456",name:"havelet"},{id:"2564",name:"dellops"}]
});

var itemlist = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local : [{id:"02156", name:"fabric"},{id:"265456",name:"ribbon"},{id:"2564",name:"buttons"}]
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

//--------------------sup -------------------------//
function checkEmpty(a){
    return a.length===0;
}

function createJSON(){
    var json = {
        auction_id : aucid,
        name : aucname,
        description : aucdesc,
        due_date : duedate,
        start_time : stime,
        end_time : etime,
        vendor : vendors,
        item : items
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
            "<td>" + aucid + "</td>"+
            "<td>" + aucname +"</td>"+
            "<td>" + duedate+ "</td>"+
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


//-------------------table load -----------------------//

//for refresh page by search
function loadtable(data){
    //add code ajax
    $("#table-body").html("");
    datao.data.forEach(filterTable);
}

//---------------intial----------------------------//
window.onload = function(){
    $("#search-auc-sdate").datepicker();
    $("#search-auc-edate").datepicker();
    $("#auc-table").DataTable();
}