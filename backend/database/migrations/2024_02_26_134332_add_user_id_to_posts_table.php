<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   
     public function up()
     {
         if (!Schema::hasColumn('posts', 'user_id')) {
             Schema::table('posts', function (Blueprint $table) {
                 $table->unsignedBigInteger('user_id');
                 $table->foreign('user_id')->references('id')->on('users');
             });
         }
     }
 
     public function down()
     {
         Schema::table('posts', function (Blueprint $table) {
             if (Schema::hasColumn('posts', 'user_id')) {
                 $table->dropForeign(['user_id']);
                 $table->dropColumn('user_id');
             }
         });
     }
};
