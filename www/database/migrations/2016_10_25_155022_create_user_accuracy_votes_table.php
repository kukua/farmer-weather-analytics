<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUserAccuracyVotesTable extends Migration
{
	public function up()
	{
		Schema::create('user_accuracy_votes', function (Blueprint $table) {
			$table->increments('id');
			$table->integer('user_id')->unsigned();
			$table->integer('location_id')->unsigned();
			$table->enum('type', ['daily', 'hourly'])->default('daily');
			$table->dateTime('forecast_date');
			$table->dateTime('forecast_created_at');
			$table->boolean('accurate')->default(true);
			$table->timestamps();

			$table->foreign('user_id')
				->references('id')->on('users')
				->onDelete('cascade');
		});
	}

	public function down()
	{
		Schema::drop('user_accuracy_votes');
	}
}
