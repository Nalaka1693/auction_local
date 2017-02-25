//---------------gloabal variables-----------------//

var userID, fname, lname, role, email, password, compassword, company, telephone,datec;
var deluid, hiderow;
var adduserenabled = true;
var newobj = {
 'data':
    [
        {
            'user_id' : '1234568',
            'fname' : 'deshan',
            'lname' : 'kalupahana',
            'role' : 'admin',
            'company' : 'abc'
        },
        {
            'user_id' : '5886552',
            'fname' : 'john',
            'lname' : 'doe',
            'role' : 'admin',
            'company' : 'opsl'
        }
    ]
}

//-----------------form data-----------------------//

//get data from add user form
function getForm(){
    userID = $("#userid").val();
    fname = $("#fname").val();
    lname = $("#lname").val();
    role = $("#role:checked").val();
    email = $("#email").val();
    password = $("#userpw").val();
    compassword = $("#userpwcon").val();
    company = $("#company").val();
    telephone = $("#telephone").val();
   
}




//clear data in add user form
function clearForm(){
    $("#userid").val("");
    $("#fname").val("");
    $("#lname").val("");
    $("#email").val("");
    $("#userpw").val("");
    $("#userpwcon").val("");
    $("#company").val("");
    $("#telephone").val("");
   
}

//set form data
function setAddForm(){
    $("#userid").text(userID);
    $("#fname").text(fname);
    $("#lname").text(lname);
    $("#email").text(email);
    $("#userpw").text(password);
    $("#userpwcon").text(password);
    $("#company").text(company);
    $("#telephone").text(telephone);
   
}



//add data to confirmation form
function setForm(){
    $("#userId-label").text(userID);
    $("#full-name").text(fname+" "+lname);
    $("#role-label").text(role);
    $("#email-label").text(email);
    $("#telephone-label").text(telephone);
}



//-----------------------all btns------------------//


// Main window - Add user button
$("#new-user-btn").click(function (d){
    adduserenabled=true;
    clearForm();
    $("#userid").prop('disabled',false);
    $("#add-btn-label").text("Create");
    $("#add-user-modal").modal();
});



//Create or Edit window - Create/Edit Button
$("#add_user_btn").click(function (d) {
    $("#add-user-modal").hide();
    getForm();
    setForm();
    $("#add-user-confirm-modal").modal();
});



//Confirmation window - close button
$("#confirm-user-close-btn").click(function (d){
   $("#add-user-modal").modal(); 
});




//Confirmation window - confirm button
$("#confirm-user-btn").click(function (d){
    
    $("#add-user-confirm-modal").hide();
    $("#add-user-modal").hide(); 

    
    if(adduserenabled){
        //add user ajax db req
        var obj = createJSON();
        var path = "http://127.0.0.1:3000/users/add"; //give path
        sendDatabyPost(path,obj,"New User is added");
    }
    else{
        //update user db req
        var obj = createJSON();
        var path = "http://127.0.0.1:3000/users/edit"; //give path
        sendDatabyPost(path,obj,"User statys updated");
    }
    clearForm();
});



// Main Window - Table - Edit Btn
$(document).on('click','.editBtn',function (d){
    var uid = this.parentNode.parentNode.childNodes[0].innerHTML;
    var obj = {"user_id":uid};
    adduserenabled=false;
    //update form
    $.ajax({
        url : "http://127.0.0.1:3000/loadEdit",
        type : "POST",
        data : obj,
        success : function(data,textStatus,jqXHR){
            userID = data.user_id;
            fname = data.fname;
            lname = data.lname;
            role = data.role;
            email = data.email;
            company = data.company;
            password = data.password;
            compassword = data.password;
            telephone = data.mobile;
        }
    });
    
    setAddForm()
    $("#userid").prop('disabled',true);
    $("#add-btn-label").text("Change");
    $("#add-user-modal").modal();
    
});


// Main Window - Table - Del Btn
$(document).on('click','.delBtn',function (d){
    var uid = this.parentNode.parentNode.childNodes[0].innerHTML;
    deluid = uid;
    var name =  this.parentNode.parentNode.childNodes[1].innerHTML;
    $("#del-usr-name-label").text("Are you sure, You want to delete User "+name+" ?");
    $("#del-user-confirm-modal").modal();
    //add code to give confirmation to delete
});


// Del confirm window - yes
$("#del-user-btn").click(function(d) {
    var json = { "user_id" : deluid };
    var path = "http://127.0.0.1:3000"; //give path
    sendDatabyPost(path,json,"User Removed from the System");
});

//del confirm window - no
$("#del-user-close-btn").click(function(d){
    deluid="";
});



//--------------------Support Functions--------------------//

// check word is empty
function checkEmpty(a){
    return a.length===0;
}


// create json object
function createJSON(){
    var jsonobject =  {
        user_id : userID,
        fname : fname,
        lname : lname,
        role : role,
        email : email,
        mobile : telephone,
        company: company,
        password : compassword
    };
    
    
    return jsonobject;
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


// make show notification
function showNotific(message){
    $("#notific").addClass("alert-success");
    $("#notific-message").text(message);
    $("#notific").show();
}


// table populate
function filterTable(obj){
    var uid = obj.user_id;
    var tfname = obj.fname;
    var tlname = obj.lname;
    var trole = obj.role;
    var tcompany = obj.company;
    var tdatecreated = obj.date_created;
    
    $("#table-body").append(
        "<tr>"+
            "<td>" + uid + "</td>"+
            "<td>" + tfname + " " + tlname +"</td>"+
            "<td>" + trole + "</td>"+
            "<td>" + tcompany + "</td>"+
            "<td>" + tdatecreated + "</td>" +
            "<td>"+    
                '<a class="delBtn btn btn-default btn-sm pull-right" href="#">'+
                '<i class="fa fa-trash fa-fw"></i> Delete</a>'+
                '<a class="editBtn btn btn-default btn-sm pull-right" href="#">'+
                '<i class="fa fa-pencil fa-fw"></i> Edit</a>'+
            "</td>"+
        "</tr>"
    );
}

function init(){
    //sendDatatoUpdate("",);
}
//-------------------Table loading -------------------------//


//for refresh page by search
function loadtable(data){
    $("#table-body").html("");
    datao.data.forEach(filterTable);
}


//-----------------Ajax reqs -------------------------//



//-----------------------onload---------------------------//
window.onload = function(){
    
    $("#search-date-input").datepicker();
    
    
    //table format
   $(document).ready(function() {
        // DataTable
        var table = $('#users-table').DataTable();
   });

};
