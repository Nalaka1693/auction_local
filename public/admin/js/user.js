//---------------gloabal variables-----------------//

var userID, fname, lname, role, email, password, compassword, company, telephone,datec;
var deluid, hiderowl;
var table_data,p_data,table;
var adduserenabled = true;
var newobj = {
 'data':
    [
        {
            'user_id' : '1234568',
            'name' : 'deshan kalupahana',
            'role' : 'admin',
            'company' : 'abc',
            'date_created': '2017.01.02',
            'btn' :""
        },
        {
            'user_id' : '1234568',
            'name' : 'deshan kalupahana',
            'role' : 'admin',
            'company' : 'abc',
            'date_created': '2017.01.02',
            'btn' :""
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
    $("#userid").val(userID);
    $("#fname").val(fname);
    $("#lname").val(lname);
    $("#email").val(email);
    $("#userpw").val(password);
    $("#userpwcon").val(password);
    $("#company").val(company);
    $("#telephone").val(telephone);
   
}



//add data to confirmation form
function setForm(){
    $("#userId-label").text(userID);
    $("#full-name").text(fname+" "+lname);
    $("#role-label").text(role);
    $("#email-label").text(email);
    $("#telephone-label").text(telephone);
}


//add data view form
function setViewForm(){
    $("#userId-view").text(userID);
    $("#full-name-view").text(fname+" "+lname);
    $("#role-view").text(role);
    $("#email-view").text(email);
    $("#telephone-view").text(telephone);
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
        var path = "http://localhost:3000/users/add"; //give path
        sendDatabyPost(path,obj,"New User is added");
    }
    else{
        //update user db req
        var obj = createJSON();
        var path = "http://localhost:3000/users/edit/confirm"; //give path
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
        url : "http://localhost:3000/users/edit",
        type : 'POST',
        dataType: "json",
        data : obj,
        success : function(data,textStatus,jqXHR){
            var response = jqXHR.responseJSON[0];
            userID = response.user_id;
            fname = response.fname;
            lname = response.lname;
            role = response.role;
            email = response.email;
            company = response.company;
            password = response.password;
            compassword = response.password;
            telephone = response.mobile;
            setAddForm();
            $("#userid").prop('disabled',true);
            $("#add-btn-label").text("Change");
            $("#add-user-modal").modal();
    
        }
    });
    
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
    var path = "http://localhost:3000/users/del"; //give path
    $.ajax({
        url : path,
        dataType: "json",
        data : json,
        type : "DELETE",
        success:function(data,textStatus,jqXHR){
            sendDatatoUpdate({},"http://localhost:3000/users/initial");
        }
    })
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
        type : 'GET',
        dataType : 'json',
        data : jsonO,
        success:function(data,textStatus,jqXHR){
            table_data = jqXHR.responseJSON;
            processJSON(table_data);
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
            sendDatatoUpdate({},'http://localhost:3000/users/initial');
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
    var btn =   '<a class="delBtn btn btn-default btn-sm pull-right" href="#">'+
                '<i class="fa fa-trash fa-fw"></i> Delete</a>'+
                '<a class="editBtn btn btn-default btn-sm pull-right" href="#">'+
                '<i class="fa fa-pencil fa-fw"></i> Edit</a>';
    var newObj = {
        "user_id" : uid,
        "name" : tfname + " " +tlname,
        "role" : trole,
        "company" : tcompany,
        "date_created" : tdatecreated.substring(0,10),
        "btn" : btn
    }
    p_data.data.push(newObj);
 
}

function tablerefresh(){
 
        table = $('#users-table').DataTable({
            "bPaginate": true,
            "aaData": p_data.data,
            "aoColumns": [
                {"data":"user_id"},
                {"data":"name"},
                {"data":"role"},
                {"data":"company"},
                {"data":"date_created"},
                {"data":"btn"}
            ] 
        });
    	$("#users-table tr td:first-child").css('cursor', 'pointer');
		$('#users-table').on('click', 'tr td:first-child', function () {
        	var data = table.row( this ).data();
			var obj = {"user_id":data.user_id};
			//send ajax
			$.ajax({
				url : "http://localhost:3000/users/edit",
				type : 'POST',
				dataType: "json",
				data : obj,
				success : function(data,textStatus,jqXHR){
					var response = jqXHR.responseJSON[0];
					userID = response.user_id;
					fname = response.fname;
					lname = response.lname;
					role = response.role;
					email = response.email;
					company = response.company;
					telephone = response.mobile;
					setViewForm();
					$("#view-user-modal").modal();

				}
			});
    	} );
}
//-------------------Table loading -------------------------//


//for refresh page by search
function processJSON(datao){
    $("#table-body").html("");
    p_data = {"data":[]};
    datao.forEach(filterTable);
}


//-----------------Ajax reqs -------------------------//




//-----------------------onload---------------------------//
window.onload = function(){
    
    $("#search-date-input").datepicker();
    p_data = {"data":[]};
    tablerefresh();


}

//table format
$(document).ready(function() {
    // DataTable
    sendDatatoUpdate({},'http://localhost:3000/users/initial');
});


