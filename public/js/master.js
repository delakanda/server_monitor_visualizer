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
            alarm = constructElements(data);
            var audio = new Audio('/audio/beep.mp3');
            if(alarm) {
                setInterval(function(){
                    audio.play();
                },1000);
            } else {
                audio.pause();
            }
        },
        error: function(data) {
            console.log(data);
        }
    });
}

function constructElements(data)
{
    diskWarningPercentage = 70;
    diskAlarmPercentage = 90;
    diskSoundAlarm = false;

    memoryWarningPercentage = 80;
    memoryAlarmPercentage = 97;
    memorySoundAlarm = false;

    mainContainer = $('#server-wrapper');
    mainContainer.html("");

    for(d in data) {

        var serverName = data[d]['server_name'].split(' ').join('_');

        mainContainer.append(
            "<div class = 'card' id = '"+serverName+"'>"
            +"<h3><i class='fa fa-server' aria-hidden='true'></i> &nbsp;&nbsp; "+serverName+"</h3><br/>"
            +"<div class = 'disks-section'></div>"
            +"<div class = 'memory-section'></div>"
            +"</div> &nbsp;&nbsp;&nbsp;"
        );

        diskInsertPoint = $('#'+serverName+" .disks-section");
        memoryInsertPoint = $('#'+serverName+" .memory-section");

        for(index in data[d]['disks']) {

            disk = data[d]['disks'][index];

            used = Math.round( ( parseFloat(disk['disk_used_space']) / parseFloat(disk['disk_total_space']) ) * 100 );

            if(used >= diskAlarmPercentage) {
                color = 'danger';
                diskSoundAlarm = true;
            } else if(used >= diskWarningPercentage && used < diskAlarmPercentage) {
                color = 'warning';
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

        for(index in data[d]['memory']) {

            memory = data[d]['memory'][index];

            used = Math.round( ( parseFloat(memory['used_memory']) / parseFloat(memory['total_memory']) ) * 100 );
console.log(used);
            if(used >= memoryAlarmPercentage) {
                color = 'danger';
                memorySoundAlarm = true;
            } else if(used >= memoryWarningPercentage && used < memoryAlarmPercentage) {
                color = 'warning';
            } else {
                color = 'success';
            }

            memoryInsertPoint.append(
                "<h4><br/><i class='fa fa-th-large' aria-hidden='true'></i> Memory</h4>( "+memory['used_memory_disp']+" / " + memory['total_memory_disp'] +  " )" +
                "<div class='progress'>" +
                "<div class='progress-bar progress-bar-"+color+"' role='progressbar' aria-valuenow='"+used+"' aria-valuemin='0' aria-valuemax='100' style='width: "+used+"%'></div>"+
                "</div>"
            );
        }
    }

    if(memorySoundAlarm || diskSoundAlarm) {
        return true;
    } else {
        return false;
    }
}