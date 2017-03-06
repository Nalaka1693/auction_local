/**
 * Created by PC on 2/27/2017.
 */

function loadModalData(data) {
    $("#modal").html("");

    $.ajax({
        url:"http://localhost:3000/bids/add",
        type: "POST",
        dataType: "json",
        data : data,
        success:function (data,textStatus,jqXHR) {
            var bid = jqXHR.responseJSON;
            bid.forEach(updateModal);
            $("#myModal").modal();
        }
    })
}



function updateModal(data) {

    $('#modal').append(

    //    edit here
    '<div class="col-md-4">'+
        '<div class="panel panel-primary"  style="color:#0d8aad">'+
            '<div class="panel-heading">'+
                    '<div class="row">'+
                            // '<div class="col-lg-1"></div>'+
                            '<div class="col-sm-12 text-center">'+
                                '<div class="medium" id="vcount"><center><strong>'+data.item_name+'</strong></center></div>'+
                                '<div class="medium"><center><strong>'+data.item_id+'</strong></center></div>'+
                            '</div>'+
                    '</div>'+
            '</div>'+
                '<div class="panel-footer">'+
                    '<span class="pull-center"><center>Current Lowest Bid</center></span>'+
                    '<span class="pull-center"><center>'+data.min+'$</center></span>'+
                    '<span class="pull-center"><center>Update Your Bid</center></span>'+
                    '<input class="form-control margin-b0 margin-l0 input-mini earnedSum" name="Bid01" size="3" color="red" type="text" placeholder="$XXXXXXXXXXX">'+
                    '<div class="clearfix"></div>'+
                '</div>'+
        '</div>'+
    '</div>'
    )
}

var auid;

$(document).on('click','.add_bid-btn',function (d) {
     auid = this.parentNode.parentNode.firstChild.firstChild.childNodes[1].firstChild.firstChild.nodeValue;
    var object = {"auction_id":auid};

    loadModalData(object);
});