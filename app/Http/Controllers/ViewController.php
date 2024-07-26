<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ViewController extends Controller
{
    public function userProfile()
    {
        return view('user.profile')
    }

    public function products()
    {
        return view('admin.product');
    }

    public function showDashboard()
    {
        return view('admin.dashboard');
    }
}
