<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TeamScheduleController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->group(function () {
    Route::post('/cronograma/{id}/add-follower', [TeamScheduleController::class, 'addFollower'])->name('api.teamSchedule.addFollower');
    Route::post('/cronograma/{id}/remove-follower', [TeamScheduleController::class, 'removeFollower'])->name('api.teamSchedule.removeFollower');
    Route::post('/uploadAttachment', [TeamScheduleController::class, 'uploadAttachment'])->name('api.teamSchedule.uploadAttachment');
});




