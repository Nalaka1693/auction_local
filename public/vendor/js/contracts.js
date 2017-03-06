/**
 * Created by PC on 2/27/2017.
 */
// variables
var contracts;

function loadContracts() {
    $.ajax({
        url: "http://localhost:3000/auctions/initial",
        type: "GET",
        data: "json",
        success:function (data,textStatus,jqXHR) {
            contracts = jqXHR.responseJSON;

            $("#content").html(" ");
            contracts.forEach(updateTabs);
        }
    })

}



function updateTabs(data) {

    $('#content').append(
        '<div class="col-lg-12 col-md-5">'+
            '<div class="panel-panel panel-success">'+
                '<div class="panel-heading">'+
                    '<div class="row">'+
                            '<div class="col-lg-10">'+
                                    '<div class="row">' +
                                        '<div class="col-lg-4" >'+
                                            '<h3 id="con04" style="color: #158991" >'+data.name + "</h3>" +
                                        '</div>'+
                                        '<div class="col-lg-4">'+
                                        '<h3 style="color: #158991">' + data.auction_id +'</h3>' +
                                        '</div>'+
                                    '</div>'+
                            '</div>'+

                            '<div class="col-xs-12 text-right">'+
                                '<button type="button" class="btn btn-info btn-lg add_bid-btn" data-toggle="modal" data-target="#myModal">'+
                                'Add Bid'+
                                '</button>'+
                            '</div>'+
                    '</div>'+
                    '<div class="panel-footer panel-success">'+
                        '<button type="button" class="btn btn-primary btn-xs view-btn" data-toggle="modal" data-target="#myView">'+
                        'View Details'+
                        '</button>'+
                        // '<span class="pull-right"><i class="fa fa-arrow-circle-right"></i></span>'+
                        '<div class="clearfix"></div>'+
                    '</div>'+
                '</div>'+
            '</div>'+
            '<br>'+
        '</div>'

    )
}


window.onload = function (d) {
    loadContracts();
};
