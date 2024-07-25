<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Str;
use DataTables;
use Storage;

class UserController extends Controller
{
    public function index()
    {
        $users = User::orderBy('id', 'DESC')->get();
        return response()->json($users);
    }

    public function activate(User $user)
    {
        $user->status = 'active';
        $user->save();

        return response()->json(['message' => 'User activated successfully.']);
    }

    public function deactivate(User $user)
    {
        $user->status = 'deactivated';
        $user->save();
        return response()->json(['message' => 'User deactivated successfully.']);
    }

    public function updateRole(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $user->role = $request->role;
        $user->save();

        return response()->json(['message' => 'User role updated successfully.']);
    }
}
