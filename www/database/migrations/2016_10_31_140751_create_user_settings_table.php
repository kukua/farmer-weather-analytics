<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUserSettingsTable extends Migration
{
	public function up()
	{
		Schema::create('user_settings', function (Blueprint $table) {
			$table->increments('id');
			$table->integer('user_id')->unsigned();
			$table->string('key');
			$table->text('value')->nullable();
			$table->timestamps();

			$table->unique(['user_id', 'key']);
			$table->foreign('user_id')
				->references('id')->on('users')
				->onDelete('cascade');
		});
	}

	public function down()
	{
		Schema::drop('user_setting');
	}
}
