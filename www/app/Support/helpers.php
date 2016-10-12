<?php

if ( ! function_exists('resource')) {
	function resource ($uri, $controller) {
		global $app;

		$app->get($uri,             "$controller@index");
		$app->post($uri,            "$controller@store");
		$app->get("$uri/{id}",      "$controller@show");
		$app->put("$uri/{id}",      "$controller@update");
		$app->patch("$uri/{id}",    "$controller@update");
		$app->delete("$uri/{id}",   "$controller@destroy");
	}
}

if ( ! function_exists('uses_trait')) {
	function uses_trait ($class, $trait, $includeParents = true) {
		if (in_array(trim($trait, ' \\'), class_uses($class), true)) {
			return true;
		}

		if ($includeParents) {
			foreach (class_parents($class) as $parent) {
				if (uses_trait($parent, $trait, false)) {
					return true;
				}
			}
		}

		return false;
	}
}

if( ! function_exists('public_path')) {
	function public_path ($path = null) {
		return rtrim(app()->basePath('public/' . $path), '/');
	}
}
