<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Imports\MultipleSheetsImport;
use Maatwebsite\Excel\Facades\Excel;

class AdminController extends Controller
{
    public function importMultipleSheet (Request $request)
    {
      $request ->validate([
          'importMultipleSheet' => ['required', 'file', 'mimes:xlsx,xls']
      ]);

      Excel::import(new MultipleSheetsImport, $request->file('importMultipleSheet'));

      return redirect()->back()->with('success', 'Multiple Sheets imported successfully');
    }
}
