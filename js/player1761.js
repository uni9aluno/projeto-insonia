var is_touch_device = 'ontouchstart' in document.documentElement;
var hearts_clicked = new Array();
var sounds = new Array();
var loading = new Array();
var soundcloud_client_id = "client_id=926cc5f8cbf24759af0cf0bfa825e3c9";
var su = new Array();
su['rain_dripping'] = {"id": "223079894", "token": "s-ZDqsN"};
su['rain_shack'] = {"id": "223083315", "token": "s-yeipa"};
su['rain_porch'] = {"id": "223083261", "token": "s-5I4Z3"};
su['rain_gutter'] = {"id": "223083061", "token": "s-Gzgks"};
su['rain_dense'] = {"id": "223082967", "token": "s-zUr6e"};
su['bird_blackbird'] = {"id": "223092566", "token": "s-rqyYh"};
su['bird_crow'] = {"id": "223099964", "token": "s-OSOdl"};
su['bird_nightingale'] = {"id": "223101114", "token": "s-I7gcG"};
su['fire_calm'] = {"id": "223101682", "token": "s-IQB5u"};
su['fire_crackling'] = {"id": "223102974", "token": "s-qAjMn"};
su['footsteps_gravel'] = {"id": "223103767", "token": "s-GKzGy"};
su['footsteps_pavement'] = {"id": "223104308", "token": "s-wFAqC"};
su['footsteps_snow'] = {"id": "223105076", "token": "s-o9AJt"};
su['forest_eerie'] = {"id": "223105809", "token": "s-2FSGR"};
su['forest_evening'] = {"id": "223106235", "token": "s-owE9E"};
su['leaves'] = {"id": "223106761", "token": "s-RynnQ"};
su['night_meadow'] = {"id": "223107170", "token": "s-SzmV4"};
su['night_suburban'] = {"id": "223108031", "token": "s-FvqXq"};
su['noise_brown'] = {"id": "223111841", "token": "s-L01i0"};
su['noise_pink'] = {"id": "223112572", "token": "s-EEaaD"};
su['noise_white'] = {"id": "223112842", "token": "s-8tRKA"};
su['river_calm'] = {"id": "223113353", "token": "s-wYeZk"};
su['river_strong'] = {"id": "223114166", "token": "s-HcaEp"};
su['thunder'] = {"id": "223114509", "token": "s-TufXS"};
su['waves_beach'] = {"id": "223115036", "token": "s-bWPUq"};
su['waves_slow'] = {"id": "223115385", "token": "s-eIQ9G"};
su['wind_howling'] = {"id": "223116111", "token": "s-QUbqS"};
su['wind_steady'] = {"id": "223116465", "token": "s-XI4Jo"};

su['frog_chorus'] = {"id": "241962664", "token": "s-NN9OW"};
su['frog_cricket'] = {"id": "241970829", "token": "s-jYpHz"};
su['frog_natterjack'] = {"id": "241970971", "token": "s-1TRF3"};
su['frog_wood'] = {"id": "241971062", "token": "s-OpVMw"};

su['restaurant_english'] = {"id": "241964233", "token": "s-fAxhO"};
su['restaurant_french'] = {"id": "241964247", "token": "s-8391m"};
su['restaurant_german'] = {"id": "241964225", "token": "s-S8Q9K"};
su['restaurant_pub'] = {"id": "241964299", "token": "s-EeUZI"};

su['train_fast'] = {"id": "241964549", "token": "s-S1kXS"};
su['train_slow'] = {"id": "241964541", "token": "s-9sBEw"};

$(document).ready(function() {
	$(".icon").click(function() {
		$(".fixed-bottom-outer-container").hide();

		var sound_element = $(this).parents(".sound");
		var sound_name = GetSoundName(sound_element);

		if (sound_element.hasClass("is-active")) {
			StopSound(sound_name, sounds);
			sound_element.removeClass("is-active");
		}
		else {
			sounds = PlaySound(sound_element, sound_name, sounds);
			sound_element.addClass("is-active");
		}
	});

	// jQuery's on input event doesn't work for MSIE, who would have guessed...
	if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0 || /Edge\/12./i.test(navigator.userAgent)) {
		var mousedown = false;
		$(".volume").on("mousedown", function() {
			mousedown = true;
		});

		$(".volume").on("mouseup", function() {
			mousedown = false;
		})

		$(".volume").on("mousemove", function() {
			if (document == false) return;

			var sound_element = $(this).parents(".sound");
			var sound_name = GetSoundName(sound_element);

			SetVolume(sound_element, sound_name, sounds);
		});
	}
	else {
		var tooltip_hide_timer;
		$(".volume").on("input", function() {
			if (document == false) return;
			var this_element = $(this);

			if ($("body").data('is_ios') == true) {
				this_element.tooltip('show');
				clearTimeout(tooltip_hide_timer);
				tooltip_hide_timer = setTimeout(function() {
					this_element.tooltip('hide');
				}, 1000);
			}

			var sound_element = $(this).parents(".sound");
			var sound_name = GetSoundName(sound_element);

			SetVolume(sound_element, sound_name, sounds);
		});
	}

	$(".variation").click(function(e) {
		$(".fixed-bottom-outer-container").hide();

		var sound_element = $(this).parents(".sound");
		var sound_name = GetSoundName(sound_element);
		var previous_sound_name = sound_element.find(".previous_variation").val();

		if (sound_name == previous_sound_name) {
			return false;
		}

		StopSound(previous_sound_name, sounds);

		sound_element.find(".previous_variation").val(sound_name);
		sounds = PlaySound(sound_element, sound_name, sounds);
	});

	$("body").on("click", ".play-favorite", function() {
		ResetAllSounds();

		var sound_json = $(this).data("sound_json");
		PlayJSON(sound_json);

		if ($(".fixed-bottom-outer-container").length) {
			var favorite_id = $(this).data("favorite_id");
			var favorite_name = $(this).find(".button-text").text();
			$(".now-playing-title").html(favorite_name);

			$(".bottom-play").data("sound_json", sound_json);
			$(".bottom-play").data("favorite_id", favorite_id);

			$(".fixed-bottom-outer-container").show();
		}

		return false;
	});

	$("body").on("click", ".bottom-play", function() {
		ResetAllSounds();

		var sound_json = $(this).data("sound_json");
		PlayJSON(sound_json);

		$(this).hide();
		$(".bottom-pause").show();

		return false;
	});

	$("body").on("click", ".bottom-pause", function() {
		ResetAllSounds();

		$(".bottom-play").show();
		$(this).hide();

		return false;
	});

	var hide_hearts_container_timer;
	var hearts_collect_timer;
	$("body").on('click', ".heart-favorite", function() {
		var favorite_id = $(".bottom-play").data("favorite_id");

		if (typeof hearts_clicked.favorite_id == "undefined") {
			hearts_clicked.favorite_id = 1;
		}
		else {
			hearts_clicked.favorite_id++;
		}

		$(".hearts").show();

		clearTimeout(hide_hearts_container_timer);
		clearTimeout(hearts_collect_timer);

		var pastel = 'hsl(' + Math.floor(Math.random() * 360) + ', 100%, 87.5%)';
		var b = Math.floor((Math.random() * 100) + 1);
		var d = ["flowOne", "flowTwo", "flowThree"];
		var c = (Math.random() * (2.6 - 1.2) + 1.2).toFixed(1);
		$('<div class="heart part-' + b + '" style="font-size:' + Math.floor(Math.random() * (70 - 20) + 20) + 'px; color: '+pastel+';"><i class="fa fa-heart"></i></div>').appendTo(".hearts").css({
		animation: "" + d[Math.floor((Math.random() * 3))] + " " + c + "s linear"
		});
		$(".part-" + b).show();
		setTimeout(function() {
		$(".part-" + b).remove()
		}, c * 900);

		hide_hearts_container_timer = setTimeout(function() {
			$(".hearts").hide();
		}, 1100);

		hearts_collect_timer = setTimeout(function() {
			SaveHearts(favorite_id);
		}, 4000);

		return false;
	});

	$("body").on("click", ".play-top-sound", function() {
		ResetAllSounds();

		var sound_json = $(this).data("sound_json");
		PlayJSON(sound_json);

		if ($(".fixed-bottom-outer-container").length) {
			var favorite_id = $(this).data("favorite_id");
			var favorite_name = $(this).data("sound_name");
			$(".now-playing-title").html(favorite_name);

			$(".bottom-play").data("sound_json", sound_json);
			$(".bottom-play").data("favorite_id", favorite_id);

			$(".fixed-bottom-outer-container").show();

			window.history.replaceState({ additionalInformation: 'Moodil.com - ' + favorite_name }, "", $(this).data("new-url"));
		}

		return false;
	});

	$(".icon-unmute").click(function() {
		$(this).hide();
		$(".icon-mute").show();

		MuteAllSounds(sounds);
	});

	$(".icon-mute").click(function() {
		$(this).hide();
		$(".icon-unmute").show();

		UnMuteAllSounds(sounds);
	});

	$(window).load(function(){
		if ($("body").data('shared_sound_json')) {
			$("#modal-play-shared-sound").modal("show");
		}
	});

	$(".mobile-play-shared-sound").click(function() {
		ResetAllSounds();

		var sound_json = $("body").data('shared_sound_json');
		var sound_id = $("body").data('shared_sound_id');
		var sound_name = $("body").data('shared_sound_name');
		PlayJSON(sound_json);

		$("#modal-play-shared-sound").modal("hide");

		$(".now-playing-title").html(sound_name);

		$(".bottom-play").data("sound_json", sound_json);
		$(".bottom-play").data("favorite_id", sound_id);

		$(".fixed-bottom-outer-container").show();

		return false;
	});
});

function SaveHearts(favorite_id) {
    hashids = new Hashids("dilmoosalts212", 12);

	if (hearts_clicked.favorite_id > 0) {
		var params = {
			'action': "save_hearts",
			"favorite_id": favorite_id,
			'hearts_clicked': hashids.encode(hearts_clicked.favorite_id)
		};

		$.post("ajax.php", params);

		hearts_clicked.favorite_id = 0;
	}
}

function PlayJSON(sound_json) {
	ResetAllSounds();

	$.each(sound_json, function(sound) {
		var sound_element = $('.sound[data-sound="'+sound+'"]');
		var variation = Object.getOwnPropertyNames(sound_json[sound])[0];
		var volume = sound_json[sound][variation];

		if (variation != null && variation != "null" && typeof variation != "undefined") {
			var sound_name = variation;
			$("#"+variation).prop('checked', true);
		}
		else {
			var sound_name = sound;
		}

		//console.log(sound_name + ' -- ' + volume);

		sound_element.find(".volume").val(volume);
		sound_element.removeClass("is-active").addClass("is-active");

		PlaySound(sound_element, sound_name, sounds);
	});
}

function PlaySound(sound_element, sound_name, sounds) {
	loading[sound_name] = new Date().getTime();

	sound_element.find(".icon").hide();
	sound_element.find(".loader-big").css("display", "block");
	sound_element.find(".variation, .volume").prop("disabled", true);
	sound_element.find(".variation_container, .volume_container").fadeTo("fast", 0.4);

	if (typeof sounds[sound_name] == "undefined") {
		var params = {
			'action': "play",
			"sound_name": sound_name
		};

		$.post("ajax.php", params);

		if ($("body").data('is_app') == true) {
			AddNotification();
		}

		var volume = GetVolume(sound_element);


		if ($("body").data('is_app') == true && device.platform == "Android") {
			var sound_url = "content://sounds/"+sound_name+".ogg";
			//var sound_url = "/android_asset/www/sounds/"+sound_name+".ogg";
		}
		else if ($("body").data('is_app') == true && device.platform == "ios") {
			var sound_url = "/sounds/"+sound_name+".mp3";
		}
		else {
			var sound_url = "https://www.moodil.com/sounds/long/" + sound_name + ".ogg";
			//var sound_url = "https://api.soundcloud.com/tracks/"+su[sound_name].id+"/stream?secret_token="+su[sound_name].token+"&client_id=926cc5f8cbf24759af0cf0bfa825e3c9&prevent_cache=" + Date.now();
		}

		sounds[sound_name] = soundManager.createSound({
			id: sound_name,
			url: sound_url,
			stream: true,
			autoLoad: true,
			autoPlay: true,
			volume: volume,
			loops: 99999,
			whileplaying: function() {
				if (loading[sound_name] != false) {
					var time_now = new Date().getTime();
					var loader_delay = (time_now - loading[sound_name]);

					if (loader_delay > 400) {
						loader_delay = 0;
					}
					else {
						loader_delay = (400 - loader_delay);
					}

					loading[sound_name] = false;

					setTimeout(function() {
						sound_element.find(".loader-big").hide();
						sound_element.find(".icon").show();

						sound_element.find(".variation, .volume").prop("disabled", false);
						sound_element.find(".variation_container, .volume_container").fadeTo("fast", 1);
					}, loader_delay);

					sound_element.find(".variation:not(:checked)").each(function() {
						var other_variation = $(this).val();
						StopSound(other_variation, sounds);
					});
				}
			},
			onerror: function(code, description) {
				console.log('PlaySound error', code, description);

				StopSound(sound_name, sounds);

				sound_element.removeClass("is-active");
			  }
		});

		sounds[sound_name].bytesLoadedChecker = setTimeout(function() {
			if (typeof(sounds[sound_name].bytesLoaded) != "number") {
				sounds[sound_name].destruct();
				delete sounds[sound_name];

				sound_element.removeClass('is-active');
				sound_element.find(".loader-big").hide();
				sound_element.find(".icon").show();
			}
		}, 10000, sounds, sound_name, sound_element);
	}
	else {
		StopSound(sound_name, sounds);
		SetVolume(sound_element, sound_name, sounds);
		sounds[sound_name].setPosition(0);
		sounds[sound_name].play();
	}

	return sounds;
}

function StopSound(sound_name, sounds) {
	if (typeof sounds[sound_name] != "undefined") {
		clearInterval(sounds[sound_name].bytesLoadedChecker);
		
		if (typeof sounds[sound_name].looping != "undefined") {
			sounds[sound_name].looping = false;
		}

		sounds[sound_name].stop();

		// Removed because it made browser stuck in "pending" status when loading a lot of sounds.
		//if ($("body").data("reload_sounds") == true) {
			sounds[sound_name].destruct();
			delete sounds[sound_name];
		//}
	}

	if (typeof sounds == "undefined" || ObjectLength(sounds) == 0) {
		if ($("body").data('is_app') == true) {
			RemoveNotification();
		}
	}
}

function StopAllSounds() {
	$(".fixed-bottom-outer-container").hide();
	$(".is-active").removeClass("is-active");
	if (typeof sounds != "undefined") {
		for (var sound_name in sounds) {
			StopSound(sound_name, sounds);
		}
	}
}

function ResetAllSounds() {
	if (typeof sounds != "undefined") {
		for (var sound_name in sounds) {
			sounds[sound_name].setVolume(50);
			StopSound(sound_name, sounds);
		}
	}

	$(".is-active").removeClass("is-active");

	$(".volume").val(50);

	$(".variation_container").each(function() {
		$(this).find(".variation:first").prop("checked", true);
	});
}

function MuteAllSounds(sounds) {
	if (typeof sounds != "undefined") {
		for (var sound_name in sounds) {
			var sound_element_name = sound_name.substr(0, sound_name.indexOf('_'));
			var sound_element = $('.sound[data-sound="'+sound_element_name+'"]');
			SetVolume(sound_element, sound_name, sounds);
		}
	}
}

function UnMuteAllSounds(sounds) {
	if (typeof sounds != "undefined") {
		for (var sound_name in sounds) {
			var sound_element_name = sound_name.substr(0, sound_name.indexOf('_'));
			var sound_element = $('.sound[data-sound="'+sound_element_name+'"]');
			SetVolume(sound_element, sound_name, sounds);
		}
	}
}

function GetSoundName(sound_element) {
	if (sound_element.find(".variation:checked").length) {
		var sound_name = sound_element.find(".variation:checked").val();
	}
	else {
		var sound_name = sound_element.data("sound");
	}

	return sound_name;
}

function SetVolume(sound_element, sound_name, sounds) {
	var volume = GetVolume(sound_element);

	if (typeof sounds[sound_name] != "undefined") {
		sounds[sound_name].setVolume(volume);
	}
}

function GetVolume(sound_element) {
	if ($(".icon-mute").is(":visible")) {
		var volume = 0;
	}
	else {
		if (sound_element.length) {
			var volume_element = sound_element.find(".volume");
			var volume = (volume_element.val().length) ? volume_element.val() : 0;
		}
		else {
			volume = 0;
		}
	}

	return volume;
}

function ObjectLength(obj) {
  var result = 0;
  for(var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
    // or Object.prototype.hasOwnProperty.call(obj, prop)
      result++;
    }
  }
  return result;
}