// Fade-In

function staggerFade() {
	setTimeout(function() {
		$('.fadein-stagger > *').each(function() {
			$(this).addClass('js-animated');
		})
	}, 30);
}

// Skycons

function skycons() {
	var i,
			icons = new Skycons({
				"color" : "#FFFFFF",
			}),
			list  = [ // список всех возможных значков
				"clear-day",
				"clear-night",
				"partly-cloudy-day",
				"partly-cloudy-night",
				"cloudy",
				"rain",
				"sleet",
				"snow",
				"wind",
				"fog"
			];

	// цикл для элементов списка
	for(i = list.length; i--;) {
		var weatherType = list[i], //выберите каждый значок из массива списка
				// значки будут иметь имя в массиве выше, прикрепленном к элементу 
				//canvas как класс и подключаемся к ним .
				elements    = document.getElementsByClassName( weatherType );

		// 	цикл через элементы и настраиваем их
		for (e = elements.length; e--;) {
			icons.set(elements[e], weatherType);
		}
	}

	// анимирование значков
	icons.play();
}

// Преобразователь температуры

// конвертировать градусы по Цельсию
function fToC(fahrenheit) {
	var fTemp  = fahrenheit,
		fToCel = (fTemp - 32) * 5 / 9;
	return fToCel;
}

// Погода Репортер

function weatherReport(latitude, longitude) {
	//переменные config для координат, url и api key широта и долгота
	// принимаются аргументы и передаются после отправки пользователем формы.
	var apiKey = '50ddeb9ce6dca567912b416dcbb724a5',
		url = 'https://api.darksky.net/forecast/',
		lati = latitude,
		longi = longitude,
		api_call = url + apiKey + "/" + lati + "," + longi + "?extend=hourly&callback=?";

	// Дни недели
	var days = [
		'Sunday',
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday'
	];

	// Удерживаем почасовые значения за каждый день недели.
	// Это позволяет сохранить результаты 24-часового прогноза.
	var sunday    = [],
		monday    = [],
		tuesday   = [],
		wednesday = [],
		thursday  = [],
		friday    = [],
		saturday  = [];

	// Проверка кнопики Цельсия, включён ли
	var isCelsiusChecked = $('#celsius:checked').length > 0;

	// Метод часового отчета для ссылки в нашем ежедневном цикле
	function hourlyReport(day, selector) {
		for(var i = 0, l = day.length; i < l; i++) {
			$("." + selector + " " + "ul").append('<li>' + Math.round(day[i]) + '</li>');
		}
	}

	// Вызываем API DarkSky для извлечения JSON
	$.getJSON(api_call, function(forecast) {

		// Промежуточные прогнозы
		for(var j = 0, k = forecast.hourly.data.length; j < k; j++) {
			var hourly_date    = new Date(forecast.hourly.data[j].time * 1000),
				hourly_day     = days[hourly_date.getDay()],
				hourly_temp    = forecast.hourly.data[j].temperature;

			// Если по Цельсию проверенно, то конвертируем градусы по Цельсию
			// для общего отчета о прогнозе.
			if(isCelsiusChecked) {
				hourly_temp = fToC(hourly_temp);
				hourly_temp = Math.round((hourly_temp));
			}

			// 24-часовое значение прогноза в наш пустой массив дней.
			switch(hourly_day) {
				case 'Sunday':
					sunday.push(hourly_temp);
					break;
				case 'Monday':
					monday.push(hourly_temp);
					break;
				case 'Tuesday':
					tuesday.push(hourly_temp);
					break;
				case 'Wednesday':
					wednesday.push(hourly_temp);
					break;
				case 'Thursday':
					thursday.push(hourly_temp);
					break;
				case 'Friday':
					friday.push(hourly_temp);
					break;
				case 'Saturday':
					saturday.push(hourly_temp);
					break;
				default: console.log(hourly_date.toLocaleTimeString());
					break;
			}
		}

		// Для ежедневного прогноза
		for(var i = 0, l = forecast.daily.data.length; i < l - 1; i++) {

			var date = new Date(forecast.daily.data[i].time * 1000),
				day = days[date.getDay()],
				skicons = forecast.daily.data[i].icon,
				time = forecast.daily.data[i].time,
				humidity = forecast.daily.data[i].humidity,
				summary = forecast.daily.data[i].summary,
				temp = Math.round(forecast.hourly.data[i].temperature),
				tempMax = Math.round(forecast.daily.data[i].temperatureMax);

			//Если Celsius проверяется, то конвертируем градусы Цельсия
			// в течение 24-часовых прогнозов  

			if(isCelsiusChecked) {
				temp    = fToC(temp);
				tempMax = fToC(tempMax);
				temp = Math.round(temp);
				tempMax = Math.round(tempMax);
			}

			// Добавим разметку для каждого 7 дневного прогноза
			$("#forecast").append(
				'<li class="shade-'+ skicons +'"><div class="card-container"><div><div class="front card"><div>' +
					"<div class='graphic'><canvas class=" + skicons + "></canvas></div>" +
					"<div><b>День</b>: " + date.toLocaleDateString() + "</div>" +
					"<div><b>Температура</b>: " + temp + "</div>" +
					"<div><b>Максимальная температура</b>: " + tempMax + "</div>" +
					"<div><b>Влажность</b>: " + humidity + "</div>" +
					'<p class="summary">' + summary + '</p>' +
					'</div></div><div class="back card">' +
					'<div class="hourly' + ' ' + day + '"><b>24 часой прогноз</b><ul class="list-reset"></ul></div></div></div></div></li>'
			);

			// Ежедневный прогнозный отчет за каждый день недели
			switch(day) {
				case 'Sunday':
					hourlyReport(sunday, days[0]);
					break;
				case 'Monday':
					hourlyReport(monday, days[1]);
					break;
				case 'Tuesday':
					hourlyReport(tuesday, days[2]);
					break;
				case 'Wednesday':
					hourlyReport(wednesday, days[3]);
					break;
				case 'Thursday':
					hourlyReport(thursday, days[4]);
					break;
				case 'Friday':
					hourlyReport(friday, days[5]);
					break;
				case 'Saturday':
					hourlyReport(saturday, days[6]);
					break;
			}
		}

		skycons(); // вводим skycons для каждого прогноза
		staggerFade(); // выставляет прогнозные карты по-разному

	});
}


// Получение события кнопки Погода
$('button').on('click', function(e) {
	var lat = $('#latitude').val(),
		long = $('#longitude').val(),
		city_name = $('#city-search').val()

	// Если ячейка ввода широты и долготы не пустые то продолжаем код
	//если пустые то сообщение об ошибке
	if(lat && long !== '') {
		e.preventDefault();

		// Выдает логотип при отправке формы
		$('#logo').fadeOut(100);

		// Изменим форму, отправим запрос погоды, введу кнопку «новый прогноз»,
		// название города и карты прогноза.
		$('.form').fadeOut(100, function() {
			weatherReport(lat, long);
			$('.screen').append('<button id="back">Новый прогноз</button><h3 class="city">' + city_name + '</h3><ul class="list-reset fadein-stagger" id="forecast"></ul>');
		});
	}
});


// кнопка «новый прогноз». Разрешить пользователю вернуться к форме прогноза.
$('body').on('click', '#back', function() {
	window.location.reload(true);
})


// отчет по городу и автозаполнение

function insertGoogleScript() {
	var google_api = document.createElement('script'),
		api_key = 'AIzaSyD7m369XhRYv-EbctnjLM2Nns5s16-oduY';

	// Внесим сценарий API Google и ссылаемся на функцию initGoogleAPI как обратный вызов.
	google_api.src = 'https://maps.googleapis.com/maps/api/js?key='+ api_key +'&callback=initGoogleAPI&libraries=places,geometry';
	document.body.appendChild(google_api);
}


// SearchBox метод
function initGoogleAPI() {
	var autocomplete = new google.maps.places.SearchBox(document.querySelector("#city-search"));

	autocomplete.addListener('places_changed', function() {
		var place = autocomplete.getPlaces()[0];
		document.querySelector("#latitude").value = place.geometry.location.lat();
		document.querySelector("#longitude").value = place.geometry.location.lng();
	});
}

insertGoogleScript();


var findMeButton = $('.find-me');

//Проверьте, поддерживает ли браузер API геолокации
if (!navigator.geolocation) {

  findMeButton.addClass("disabled");
  $('.no-browser-support').addClass("visible");

} else {

  findMeButton.on('click', function(e) {

    e.preventDefault();

    navigator.geolocation.getCurrentPosition(function(position) {

      // Получить координаты текущего места.
      var lat = position.coords.latitude;
      var lng = position.coords.longitude;

          //выведем кординаты в инпут
      $('#latitude').val(lat);
      $('#longitude').val(lng);
      $('.coordinates').addClass('visible');

    });

  });

}

sessionStorage.setItem('key', 'value');

// Получение данных из sessionStorage
var data = sessionStorage.getItem('key');

// Автозаполнение полей  
 
window.onload = function() { 
 navigator.geolocation.getCurrentPosition(function(position) { 
  // Получить координаты текущего места. 
  var lat = position.coords.latitude; 
  var lng = position.coords.longitude; 
  // var city = geocodeLatLng(geocoder, lat, lng) 
  //выведем кординаты в инпут 
  $('#latitude').val(lat); 
  $('#longitude').val(lng); 
  // $('#city-search').val(city); 
  $('.coordinates').addClass('visible'); 
 }); 
} 
 
//Хотел добавить город в автоматический поиск по координатам,
//но не получилось.
// function geocodeLatLng(geocoder, lat, lng) { 
//   var latlng = {lat: lat, lng: lng}; 
//   geocoder.geocode({'location': latlng}, function(results, status) { 
//     if (status === 'OK') { 
//       if (results[1]) { 
//         city = results[1]; 
//       } else { 
//         window.alert('Geolocation check error'); 
//       } 
//     } else { 
//       window.alert('Geocoder failed due to: ' + status); 
//   }   
//  }); 
//  return city; 
// }