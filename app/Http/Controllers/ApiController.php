<?php namespace App\Http\Controllers;

use DB;

class ApiController extends Controller
{
    public function getServers()
    {
        $dataArray = [];

        $servers = DB::table('servers')->get();

        //get Disks
        foreach($servers as $key => $server)
        {
            $dataArray[$key]['server_id'] = $server->server_id;
            $dataArray[$key]['server_ip'] = $server->server_host_ip;
            $dataArray[$key]['server_name'] = $server->server_name;
            $dataArray[$key]['disks'] = DB::table('disks')->where('server_id',$server->server_id)->get();
            $dataArray[$key]['memory'] = DB::table('server_memories')->where('server_id',$server->server_id)->get();
        }

        return response()
            ->json($dataArray);
    }

    public function pingServers()
    {
        $servers = DB::table('servers')->get();
        $serverPingResults = [];

        foreach($servers as $key=>$server) {

            $serverPingResults[$key]['server_name'] = $server->server_name;

            try {
                $fp = fSockOpen($server->server_host_ip,22,$errno, $errstr);

                if($fp) {
                    $serverPingResults[$key]['server_ping_status'] = 1;
                } else {
                    $serverPingResults[$key]['server_ping_status'] = 0;
                }

            } catch(\ErrorException $ex){
                $serverPingResults[$key]['server_ping_status'] = 0;
            }

        }

        return response()
            ->json($serverPingResults);
    }
}