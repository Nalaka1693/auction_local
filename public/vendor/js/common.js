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
function loadContracts() {

    $.ajax({
        url: "http://localhost:3000/auctions/initial",
        type: "GET",
        data: "json",
        success:function (data,textStatus,jqXHR) {
            contracts = jqXHR.responseJSON;

            $("#content").html("");
            addbid.forEach(updateTabs);
        }
    })

}



function updateTabs(data) {

    $('#content').append(


    )
}


window.onload = function (d) {
    loadContracts();
};
