window.app_modal_timer;

$(document).ready(function() {
	$("body").removeClass("preload");

	var is_touch_device = 'ontouchstart' in document.documentElement;

	if (is_touch_device) {
		$(document.head).append("<style>.delete-favorite { opacity: .4; }</style>");
		//$(".inspiredby_container").remove();
	}

	if (window.location.href.indexOf("resetpw") > -1 && window.location.href.indexOf("verify") > -1) {
		$("#modal-resetpw").modal("show");
	}

	if ($("#modal-message").length) {
		$("#modal-message").modal("show");
	}

	if (window.location.hash.substring(1) == "app") {
		AppModal(true);
	}
	else {
		if (!$("body").data('is_logged')) {
			window.app_modal_timer = setTimeout(function() { AppModal(false); }, 180000);
		}
	}

	$('#modal-app').on('hidden.bs.modal', function () {
		if (!$("body").data('is_logged')) {
			window.app_modal_timer = setTimeout(function() { AppModal(false); }, 900000);
		}
	});



	$("body").on('click', ".patreon", function() {
		ga('send', 'event', 'A', 'Click', 'Patreon');
	});

	

	$("body").on('click', ".top-list-share-link", function() {
		$("#modal-top-list").modal("hide");

		if ($("#modal-signup-favorites").length) {
			$("#modal-signup-favorites").modal("show");
		}
		else {
			$("#modal-favorites").modal("show");
		}
	});

	$("body").on('click', ".top_list_tab_link", function() {
		var timeframe = $(this).data("top_list_timeframe");
		$(".top_list_tab.active").removeClass("active");
		$(this).parent().addClass("active");

		$(".top-list.active").removeClass("active").addClass("hidden");
		$(".top-list."+timeframe).removeClass("hidden").addClass("active");

		return false;
	});

	$("body").on('keyup', "#modal-login .modal-input", function(e) {
		if (e.keyCode == 13) {
			$(".login-button").trigger("click");
		}
	});

	$("body").on('keyup', "#modal-signup .modal-input", function(e) {
		if (e.keyCode == 13) {
			$(".signup-button").trigger("click");
		}
	});

	$("body").on('click', ".login_notify_link", function() {
		$("#modal-app").modal("hide");
		
		$(".link-login").trigger("click");

		return false;
	});

	$("body").on('click', ".signup_notify_link", function() {
		$("#modal-app").modal("hide");
		
		$(".link-signup").trigger("click");

		return false;
	});

	$("header").on('click', ".link-app", function() {
		clearTimeout(window.app_modal_timer);

		$(".login_notify_container").addClass("hidden");
		$("#modal-app").modal("show");

		return false;
	});

	$("header").on('click', ".link-login", function() {
		$("#modal-login").find(".modal-success-message").html("");
		$("#modal-login").find(".modal-error-message").html("");
		$("#modal-login").modal("show");

		return false;
	});

	$("header").on('click', ".link-signup", function() {
		$("#modal-signup").find(".modal-success-message").html("");
		$("#modal-signup").find(".modal-error-message").html("");
		$("#modal-signup").modal("show");

		return false;
	});

	$("header").on('click', ".link-top-list", function() {
		$("#modal-top-list").find(".modal-success-message").html("");
		$("#modal-top-list").find(".modal-error-message").html("");
		$("#modal-top-list").modal("show");

		return false;
	});

	$("header").on('click', ".link-contact", function() {
		$("#modal-contact").find(".modal-success-message").html("");
		$("#modal-contact").find(".modal-error-message").html("");
		$("#modal-contact").modal("show");

		return false;
	});

	$("header").on('click', ".link-favorites", function() {
		if ($(".favorite-button").length > 19) {
			$("#modal-favorites").find(".modal-divider.optional").show();
			$("#modal-favorites").find(".add_new_favorite_container").hide();
			$("#modal-favorites").find(".modal-max-message").css('display', 'block');
		}
		else if (!$(".favorite-button").length) {
			$("#modal-favorites").find(".modal-divider.optional").hide();
		}
		else {
			$("#modal-favorites").find(".modal-divider.optional").show();
			$("#modal-favorites").find(".add_new_favorite_container").show();
			$("#modal-favorites").find(".modal-max-message").hide();
		}

		$("#modal-favorites").find(".modal-success-message").html("");
		$("#modal-favorites").find(".modal-error-message").html("");
		$("#modal-favorites").modal("show");

		return false;
	});

	$("body").on('click', ".link-actions", function() {
		$("#modal-actions").modal("show");

		return false;
	});

	$("body").on('click', ".mute-sounds-button", function() {
		if ($(".icon-unmute").is(":visible")) {
			$(".icon-unmute").trigger("click");

			$(".mute-sounds-button").hide();
			$(".unmute-sounds-button").show();
		}

		return false;
	});

	$("body").on('click', ".unmute-sounds-button", function() {
		if ($(".icon-mute").is(":visible")) {
			$(".icon-mute").trigger("click");

			$(".unmute-sounds-button").hide();
			$(".mute-sounds-button").show();
		}

		return false;
	});

	$("body").on('click', ".stop-sounds-button", function() {
		StopAllSounds();

		return false;
	});

	$("body").on('click', ".link-signup-favorites", function() {
		$("#modal-signup-favorites").modal("show");

		return false;
	});

	$("body").on('click', ".link-account", function() {
		$("#modal-account").find(".modal-success-message").html("");
		$("#modal-account").find(".modal-error-message").html("");

		$("#modal-account").modal("show");

		return false;
	});

	$("body").on('click', ".link-forgotpw", function() {
		$("#modal-login").modal("hide");
		$("#modal-forgotpw").find(".modal-success-message").html("");
		$("#modal-forgotpw").find(".modal-error-message").html("");
		$("#modal-forgotpw").modal("show");

		return false;
	});

	$("body").on("click", ".login-button", function() {
		var modal_element = $(this).parents(".modal");
		var triggered_element = $(this);

		modal_element.find(".modal-success-message").html("");
		modal_element.find(".modal-error-message").html("");

		var params = {
			'action': "login",
			'email': modal_element.find("input[name=email]").val(),
			'password': modal_element.find("input[name=password]").val()
		};
		
		triggered_element.find(".button-text").hide();
		triggered_element.find(".loader-small").show();

		$.post("ajax.php", params, function(data) {
			triggered_element.find(".loader-small").hide();
			triggered_element.find(".button-text").show();

			if (data.success) {
				$(".letter").remove();
				$(".patreon-container").remove();
				$("body").data('is_logged', true);
				clearTimeout(window.app_modal_timer);
				//$(".inspiredby_container").remove();
				$(".menu").replaceWith(data.new_menu_html);
				$("#modal-favorites").remove();
				$("#modal-actions").remove();
				$("#modal-login").after(data.account_modal_html);
				$("#modal-login").after(data.favorites_modal_html);
				$("#modal-login").after(data.actions_modal_html);
				$("#modal-login").after(data.sharing_modal_html);
				$("#modal-login").modal("hide");

				if ($(".patreon-container").length > 1) {
					$(".patreon-container").not(':last').remove()
				}

				if (typeof data.background_color != "undefined" && data.background_color.length) {
					$("body").css("background-color", "#"+data.background_color);
				}

				modal_element.find("input[name=email]").val("");
				modal_element.find("input[name=password]").val("");
			}
			else {
				if (typeof data.message != "undefined" && data.message.length) {
					modal_element.find(".modal-error-message").html(data.message);
				}
			}
		}, "json");

		return false;
	});

	$("body").on("click", ".signup-button", function() {
		var modal_element = $(this).parents(".modal");
		var triggered_element = $(this);
		
		modal_element.find(".modal-success-message").html("");
		modal_element.find(".modal-error-message").html("");

		var params = {
			'action': "signup",
			'email': modal_element.find("input[name=email]").val(),
			'password': modal_element.find("input[name=password]").val(),
			'password2': modal_element.find("input[name=password2]").val()
		};

		triggered_element.find(".button-text").hide();
		triggered_element.find(".loader-small").show();

		$.post("ajax.php", params, function(data) {
			triggered_element.find(".loader-small").hide();
			triggered_element.find(".button-text").show();

			if (data.success) {
				$(".letter").remove();
				$(".patreon-container").remove();

				$("body").data('is_logged', true);
				clearTimeout(window.app_modal_timer);

				$(".menu").replaceWith(data.new_menu_html);
				$("#modal-favorites").remove();
				$("#modal-login").after(data.favorites_modal_html)

				//$(".inspiredby_container").remove();
				$(".menu").replaceWith(data.new_menu_html);
				$("#modal-favorites").remove();
				$("#modal-actions").remove();
				$("#modal-login").after(data.account_modal_html);
				$("#modal-login").after(data.favorites_modal_html);
				$("#modal-login").after(data.actions_modal_html);

				if ($(".patreon-container").length > 1) {
					$(".patreon-container").not(':last').remove()
				}
								
				modal_element.find("input[name=email]").val("");
				modal_element.find("input[name=password]").val("");
				modal_element.find("input[name=password2]").val("");
				
				if (typeof data.message != "undefined" && data.message.length) {
					modal_element.find(".modal-success-message").html(data.message);

					// Hide all other elements since registration was succesful
					modal_element.find(".input-block").hide();
					modal_element.find(".signup-button").hide();
					modal_element.find(".privacy_policy_link_container").parents(".modal-message").hide();
				}
			}
			else {
				if (typeof data.message != "undefined" && data.message.length) {
					modal_element.find(".modal-error-message").html(data.message);
				}
			}
		}, "json");

		return false;
	});

	$("body").on("click", ".forgotpw-button", function() {
		var modal_element = $(this).parents(".modal");
		var triggered_element = $(this);

		modal_element.find(".modal-success-message").html("");
		modal_element.find(".modal-error-message").html("");

		var params = {
			'action': "forgotpw",
			'email': modal_element.find("input[name=email]").val()
		};

		triggered_element.find(".button-text").hide();
		triggered_element.find(".loader-small").show();

		$.post("ajax.php", params, function(data) {
			triggered_element.find(".loader-small").hide();
			triggered_element.find(".button-text").show();

			if (data.success) {
				modal_element.find("input[name=email]").val("");

				if (typeof data.message != "undefined" && data.message.length) {
					modal_element.find(".modal-success-message").html(data.message);
				}
			}
			else {
				if (typeof data.message != "undefined" && data.message.length) {
					modal_element.find(".modal-error-message").html(data.message);
				}
			}
		}, "json");

		return false;
	});

	$("body").on("click", ".resetpw-button", function() {
		var modal_element = $(this).parents(".modal");
		var triggered_element = $(this);

		modal_element.find(".modal-success-message").html("");
		modal_element.find(".modal-error-message").html("");

		var params = {
			'action': "resetpw",
			'new_password': modal_element.find("input[name=new_password]").val(),
			'new_password2': modal_element.find("input[name=new_password2]").val(),
			'email': modal_element.find("input[name=email]").val(),
			'password_reset_hash': modal_element.find("input[name=password_reset_hash]").val()
		};

		triggered_element.find(".button-text").hide();
		triggered_element.find(".loader-small").show();

		$.post("ajax.php", params, function(data) {
			triggered_element.find(".loader-small").hide();
			triggered_element.find(".button-text").show();

			modal_element.find("input[name=new_password]").val("");
			modal_element.find("input[name=new_password2]").val("");

			if (data.success) {
				window.location = window.location.pathname;
			}
			else {
				if (typeof data.message != "undefined" && data.message.length) {
					modal_element.find(".modal-error-message").html(data.message);
				}
			}
		}, "json");

		return false;
	});

	$("body").on("click", ".changepw-button", function() {
		var modal_element = $(this).parents(".modal");
		var triggered_element = $(this);

		modal_element.find(".change-password-container .modal-success-message").html("");
		modal_element.find(".change-password-container .modal-error-message").html("");

		var params = {
			'action': "changepw",
			'new_password': modal_element.find("input[name=new_password]").val(),
			'new_password2': modal_element.find("input[name=new_password2]").val()
		};

		triggered_element.find(".button-text").hide();
		triggered_element.find(".loader-small").show();

		$.post("ajax.php", params, function(data) {
			triggered_element.find(".loader-small").hide();
			triggered_element.find(".button-text").show();

			modal_element.find("input[name=new_password]").val("");
			modal_element.find("input[name=new_password2]").val("");

			if (data.success) {
				if (typeof data.message != "undefined" && data.message.length) {
					modal_element.find(".change-password-container .modal-success-message").html(data.message);
				}
			}
			else {
				if (typeof data.message != "undefined" && data.message.length) {
					modal_element.find(".change-password-container .modal-error-message").html(data.message);
				}
			}
		}, "json");

		return false;
	});

	$(".favorite-input").keyup(function (e) {
		if (e.keyCode == 13) {
			$(".save-favorite").trigger("click");
		}
	});

	$("body").on("click", ".save-favorite", function() {
		var modal_element = $(this).parents(".modal");

		modal_element.find(".modal-success-message").html("");
		modal_element.find(".modal-error-message").html("");

		var selected_sounds = {};

		$(".is-active").each(function( index ) {
			var sound_name = $(this).data("sound");
			var selected_variation = $(this).find(".variation:checked").attr("id");
			if (typeof selected_variation == "undefined") { selected_variation = null; }
			var volume = $(this).find(".volume").val();
			selected_sounds[sound_name] = {};
			selected_sounds[sound_name][selected_variation] = volume;
		});
		
		if (Object.getOwnPropertyNames(selected_sounds).length) {
			var selected_sounds_json = JSON.stringify(selected_sounds);
			var favorite_name = ($(".favorite-input").val().length) ? $(".favorite-input").val() : "Unnamed";
			
			var params = {
				'action': "save_favorite",
				'name': favorite_name,
				'sound_json': selected_sounds_json
			};

			var triggered_element = $(this);
			triggered_element.find(".button-text").hide();
			triggered_element.find(".loader-small").show();
			$(".favorite-input").prop("disabled", true).fadeTo("fast", 0.4);

			$.post("ajax.php", params, function(data) {
				triggered_element.find(".loader-small").hide();
				triggered_element.find(".button-text").show();
				$(".favorite-input").prop("disabled", false).fadeTo("fast", 1).val("");

				if (data.success) {
					if (typeof data.message != "undefined" && data.message.length) {
						modal_element.find(".modal-success-message").html(data.message);
						modal_element.find(".favorites-list").replaceWith(data.new_favorites_list_html);

						if (modal_element.find(".favorite-button").length > 19) {
							$("#modal-favorites").find(".modal-divider.optional").show();
							modal_element.find(".add_new_favorite_container").hide();
							modal_element.find(".modal-max-message").css('display', 'block');
						}
						else if (!$(".favorite-button").length) {
							$("#modal-favorites").find(".modal-divider.optional").hide();
						}
						else {
							$("#modal-favorites").find(".modal-divider.optional").show();
							modal_element.find(".add_new_favorite_container").show();
							modal_element.find(".modal-max-message").hide();
						}
					}
				}
				else {
					if (typeof data.message != "undefined" && data.message.length) {
						modal_element.find(".modal-error-message").html(data.message);
					}
				}
			}, "json");
		}
		else {
			modal_element.find(".modal-error-message").html("Select sounds first.");
		}

		return false;
	});

	$("body").on("click", ".share-favorite", function() {
		var share_id = $(this).data('share_id');
		var share_url = "http://www.moodil.com/?s="+share_id;

		$("#modal-sharing").find(".share-url").val(share_url);
		$("#modal-favorites").modal("hide");
		$("#modal-sharing").modal("show");

		return false;
	});

	$("body").on("click", ".share-url", function() {
		if (is_touch_device) {
			this.setSelectionRange(0, 9999);
		}
		else {
			$(this).select();
		}

		
	});

	$("body").on("click", ".delete-favorite", function() {
		var modal_element = $(this).parents(".modal");
		var favorite_button_element = $(this).parents(".favorite-button");
		var delete_button_element = $(this);
		var play_button_element = favorite_button_element.find(".play-favorite");
		
		var params = {
			'action': "delete_favorite",
			'id': $(this).data("favorite_id")
		};

		delete_button_element.hide();
		play_button_element.find(".button-text").hide();
		play_button_element.find(".loader-small").show();

		$.post("ajax.php", params, function(data) {
			if (data.success) {
				favorite_button_element.remove();

				if (modal_element.find(".favorite-button").length > 9) {
					$("#modal-favorites").find(".modal-divider.optional").show();
					modal_element.find(".add_new_favorite_container").hide();
					modal_element.find(".modal-max-message").css('display', 'block');
				}
				else if (!$(".favorite-button").length) {
					$("#modal-favorites").find(".modal-divider.optional").hide();
				}
				else {
					$("#modal-favorites").find(".modal-divider.optional").show();
					modal_element.find(".add_new_favorite_container").show();
					modal_element.find(".modal-max-message").hide();
				}
				
				modal_element.find(".modal-success-message").html("");
				modal_element.find(".modal-error-message").html("");
			}
			else {
				delete_button_element.show();

				play_button_element.find(".loader-small").hide();
				play_button_element.find(".button-text").show();

				if (typeof data.message != "undefined" && data.message.length) {
					modal_element.find(".modal-error-message").html(data.message);
				}
			}
		}, "json");

		return false;
	});

	$("body").on("click", ".change-background-color-button", function() {
		var modal_element = $(this).parents(".modal");
		var triggered_element = $(this);
		var selected_color = $("#color_picker_value").val().replace("#", "");

		modal_element.find(".background-color-container .modal-success-message").html("");
		modal_element.find(".background-color-container .modal-error-message").html("");

		var params = {
			'action': "change_background_color",
			'new_color': selected_color
		};

		triggered_element.find(".button-text").hide();
		triggered_element.find(".loader-small").show();

		$.post("ajax.php", params, function(data) {
			triggered_element.find(".button-text").show();
			triggered_element.find(".loader-small").hide();

			if (data.success) {
				if (typeof data.message != "undefined" && data.message.length) {
					modal_element.find(".background-color-container .modal-success-message").html(data.message);
				}
			}
			else {
				if (typeof data.message != "undefined" && data.message.length) {
					modal_element.find(".background-color-container .modal-error-message").html(data.message);
				}
			}
		}, "json");

		return false;
	});

	$("body").on("change", ".reload_sounds", function() {
		var modal_element = $(this).parents(".modal");
		var params = {
			'action': "change_reload_sounds",
			'reload_sounds': ($(this).val() == 1 ? 1 : 0)
		};

		modal_element.find(".change-reload-sound-container .modal-success-message").html("");
		modal_element.find(".change-reload-sound-container .modal-error-message").html("");

		$.post("ajax.php", params, function(data) {
			if (data.success) {
				if (typeof data.message != "undefined" && data.message.length) {
					modal_element.find(".change-reload-sound-container .modal-success-message").html(data.message);
				}
			}
			else {
				if (typeof data.message != "undefined" && data.message.length) {
					modal_element.find(".change-reload-sound-container .modal-error-message").html(data.message);

					if (params.reload_sounds == 1) {
						$(".reload_sounds").eq(1).prop("checked", true);
					}
					else {
						$(".reload_sounds").eq(0).prop("checked", true);
					}
				}
			}
		}, "json");
	});

	var color_picker;
	$("body").on("click", ".color_picker", function() {
		if (typeof color_picker == "undefined") {
			color_picker = new jscolor.color($(".color_picker").get(0));
			color_picker.maxV = "0.85";
		}

		color_picker.showPicker();

		$(".modal-backdrop").fadeTo("fast", "0");
	
		return false;
	});

	$("body").on("change", "#color_picker_value", function() {
		var color = $("#color_picker_value").val();
		$("body").css("background-color", "#"+color);
	});
});

function AppModal(hide_notify) {
	clearTimeout(window.app_modal_timer);

	/*if ($("#modal-app").length) {
		if ($(".modal").is(":visible") == false) {
			if (hide_notify == true) {
				$(".login_notify_container").addClass("hidden");
			}
			else {
				$(".login_notify_container").removeClass("hidden");
			}

			$("#modal-app").modal("show");
		}
		else {
			if (!$("body").data('is_logged')) {
				setTimeout(function() { AppModal(hide_notify); }, 60000);
			}
		}
	}*/

	// App no longer available.
	return false;
}