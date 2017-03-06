/**
 * Created by PC on 2/28/2017.
 */

// var send_auctionID = this.parentNode.parentNode.firstChild.firstChild.childNodes[1].firstChild.firstChild.nodeValue;
var send_vendorID ="VEN0001";
var send_itemID =[];
var send_bidVALUE =[];

function send_data(data) {
    $("#modal").html("");

    $.ajax({
        url: "http://localhost:3000/bids/add/confirm",
        type: "POST",
        dataType: "json",
        data : data,
        success:function (data,textStatus,jqXHR) {
            var bid = jqXHR.responseJSON;
        }
    })

}



$(document).on('click','.confirm-btn',function (d) {
    var send_auctionID =auid;
    var count = this.parentNode.previousElementSibling.previousElementSibling.firstElementChild.childElementCount;
    for(i = 0;i<count;i++){
        send_itemID[i]= this.parentNode.previousElementSibling.previousElementSibling.firstElementChild.childNodes[i].firstElementChild.firstElementChild.firstChild.firstChild.childNodes[1].firstChild.firstChild.innerHTML;
        send_bidVALUE[i] =  this.parentNode.previousElementSibling.previousElementSibling.firstElementChild.childNodes[i].firstElementChild.childNodes[1].childNodes[3].value;
    }

    var data =
        {
            auction_id  : send_auctionID,
            item_id     : send_itemID,
            vendor_id   : send_vendorID,
            bid_amount  : send_bidVALUE

        };

    send_data(data);
});
