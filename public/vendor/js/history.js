/**
 * Created by nadeesh on 3/1/17.
 */
var hist;

function loadHistory() {
    $.ajax({
        url: "http://localhost:3000/bids/history",
        type: "GET",
        data: "json",
        success:function (data,textStatus,jqXHR) {
            hist = jqXHR.responseJSON;

            $("#historyContent").html(" ");
            hist.forEach(updateHTabs);
        }
    });

}

$(document).on('click','.randStringId',function (d){
    var b =this.parentElement.parentElement.parentElement.children[1];
    if(b.classList.contains("collapse")){
        b.classList.remove("collapse");
    }
    else{
        b.classList.add("collapse");
    }
});


function updateHTabs(data) {

    $('#historyContent').append(

            '<div class="panel panel-info">' +
                '<div class="panel-heading">' +
                    '<h4 class="panel-title">' +
                        '<a data-toggle="collapse" class="randStringId" > ' + 'Bid ID  ' + data.bid_id +
                            '<span class="badge pull-right">' + timeUpdate(data) + '</span>'+
                        '</a>' +
                    '</h4>' +
                '</div>' +
                '<div class="panel-collapse collapse">' +
                    '<div class="panel-body">' +

                        '<table border="1px" cellpadding="12px" width="50%" bgcolor="#b0c4de">' +
                            '<tr align="center">'+'<td>'+'Action ID'+ '</td>'+'<td>'+ data.auction_id+'</td>'+'</tr>'+
                            '<tr align="center">'+'<td>'+'Vendor ID'+ '</td>'+'<td>'+ data.vendor_id +'</td>'+'</tr>'+
                            '<tr align="center">'+'<td>'+'Item ID'+'</td>'+'<td>'+ data.item_id +'</td>'+'</tr>'+
                            '<tr align="center">'+'<td>'+'Bid amount'+'</td>'+'<td>'+ data.bid_amount+'</td>'+'</tr>'+
                        '</table>'+

                    '</div>' +
                '</div>' +
            '</div>'
    )

}

window.onload = function (d) {
    loadHistory();
};

// to update the time
// make this

function timeUpdate(data){
    var t = new Date();
    var curHr = t.getHours();
    var curMin = t.getMinutes();
    //var curSec = t.getSeconds();


    var recordTime = data.time;
    var hh_mm_ss = recordTime.split(":");

    var startDate = new Date(0, 0, 0, curHr, curMin, 0);
    var endDate = new Date(0, 0, 0, hh_mm_ss[0], hh_mm_ss[1], 0);
    var diff = Math.abs( endDate.getTime() - startDate.getTime() );

    if(Math.floor(diff/1000)<30){
        return "just now";
    }
    else if(Math.floor(diff/1000<60)){
        return "few seconds ago";
    }
    else{
        var hours = Math.floor(diff / 1000 / 60 / 60);
        if(hours <1){
            diff -= hours * 1000 * 60 * 60;
            var minutes = Math.floor(diff / 1000 / 60);
            return minutes +" minutes ago";
        }
        else{
            return hours + " hours ago";
        }

    }
}