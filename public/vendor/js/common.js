/**
 * Created by PC on 2/27/2017.
 */
// variables
var addbid;
/*var obj = [
 {
 "name" : "auc 1",
 "auction_id": "12345"
 },
 {
 "name": "auc 2",
 "auction_id": "23456"
 }
 ]
 */
function loadModalData(data) {
    $("#modal").html("");

    $.ajax({
        url: "http://localhost:3000/bids/add",
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

            '<div class="col-sm-4"><font color="#703577" size="5" style="font-family:Tw Cen MT"><strong>'+data.item_name+'</strong></font><br>'+
                '<strong><h4 style="color:red">Current Lowest Bid</h4></strong>'+
                '<h3 style="color:green; size:13">'+data.bid+'</h3>'+
                    '<div><strong>Update Your Bid</strong></div><br>'+
                        '<div class="input-prepend input-append margin-2">'+
                            '<div style="padding-left:0px">'+
                                '<input class="margin-b0 margin-l0 input-mini earnedSum" name="Bid01" size="4" color="red" type="text" placeholder="XXXX$"><h15>$</h15>'+
                            '</div>'+
                        '</div>'+
            '</div>'

    )
}



$(document).on('click','.add_bid-btn',function (d) {
    var auid = this.parentNode.parentNode.firstChild.firstChild.childNodes[1].firstChild.firstChild.nodeValue;
    var object = {"auction_id":auid};

    loadModalData(object);
});