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
            $dataArray[$key]['server_ip'] = $server->server_host_ip;
            $dataArray[$key]['server_name'] = $server->server_name;
            $dataArray[$key]['disks'] = DB::table('disks')->where('server_id',$server->server_id)->get();
        }

        return response()
            ->json($dataArray);
    }
}