$(document).ready(function(){
    init();
});

function init()
{
    getServers();
    setInterval(getServers,60000);
}

function getServers()
{
    $.ajax({
        url: '/api/v1/servers',
        type: 'GET',
        success: function(data) {
            console.log("Data received..");
            constructElements(data);
        },
        error: function(data) {
            console.log(data);
        }
    });
}

function constructElements(data)
{
    alarmPercentage = 80;

    mainContainer = $('#server-wrapper');
    mainContainer.html("");
    for(d in data) {
        mainContainer.append(
            "<div class = 'card' id = '"+data[d]['server_name']+"'>"
            +"<h3><i class='fa fa-server' aria-hidden='true'></i> &nbsp;&nbsp; "+data[d]['server_name']+"</h3><br/><br/>"
            +"<div class = 'disks-section'></div>"
            +"</div> &nbsp;&nbsp;&nbsp;"
        );

        diskInsertPoint = $('#'+data[d]['server_name']+" .disks-section");

        for(index in data[d]['disks']) {

            disk = data[d]['disks'][index];

            used = Math.round( ( parseFloat(disk['disk_used_space']) / parseFloat(disk['disk_total_space']) ) * 100 );

            if(used >= alarmPercentage) {
                color = 'danger'
            } else {
                color = 'success';
            }

            diskInsertPoint.append(
                "<h4>"+disk['disk_path']+"</h4>( "+disk['disk_used_space_disp']+" / " + disk['disk_total_space_disp'] +  " )" +
                "<div class='progress'>" +
                "<div class='progress-bar progress-bar-"+color+"' role='progressbar' aria-valuenow='"+used+"' aria-valuemin='0' aria-valuemax='100' style='width: "+used+"%'></div>"+
                "</div>"
            );
        }
    }
}