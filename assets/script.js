var savedLocations = [];
var currentLoc;

$("#searchBtn").on("click", function(){
    // no refresh
    event.preventDefault();

    // get value of the input field
    var loc = $("#searchInput").val().trim();

    // if loc was not empty
    if (loc !==""){
        // clear previous forecast 
        clear();
        currentLoc = loc;
        saveLoc(loc);
        // clear search field 
        $("#searchInput").val("");
        // get new forecast
        getCurrent(loc);
    }
});

$(document).on("click", "#loc-btn", function () {
    clear();
    currentLoc = $(this).text();
    showPrevious();
    getCurrent(currentLoc);
});


// Current city weather function
function getCurrent(city){
    var queryURL = "api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=e6dee304a0d16335ecee688e3c6dc7e4";
    $.ajax({
        url: queryURL, 
        method: "GET",
        error: function (){
            savedLocations.splice(savedLocations.indexOf(city), 1);
            localStorage.setItem("weathercities", JSON.stringify(savedLocations));
            previousLocation();
        }
    }).then(function(response){
        // create card
        var currCard = $("<div>").attr("class", "card bg-light");
        $("#earthforecast").append(currCard);

        // Location card header
        var currCardHead = $("<div>").attr("class", "card-header").text("Current weather for " + response.name);
        currCard.append(currCardHead);

        var cardRow = $("<div>").attr("class", "row no-gutters");
        currCard.append(cardRow);

        // icon for weather conditions
        var iconURL = "https://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png";

        var imgDiv = $("<div>").attr("class", "col-md-4").append($("<img>").attr("src", iconURL).attr("class", "card-img"));
        cardRow.append(imgDiv);

        var textDiv = $("<div>").attr("class", "col-md-8");
        var cardBody = $("<div>").attr("class", "card-body");
        textDiv.append(cardBody);

        // display city name
        cardBody.append($("<h3>").attr("class", "card.title").text(response.name));

        // display last update
        var currDate = moment(response.dt, "X").format("dddd, MMM Do YYYY, h:mm a");
        cardBody.append($("<p>").attr("class", "card-text").append($("<small>").attr("class", "text-muted").text("Last Updated: " + currDate)));

        // temperature
        cardBody.append($("<p>").attr("class", "card-text").html("Temperature: " + response.main.temp + " &#8457;"));

        // humidity
        cardBody.append($("<p>").attr("class", "card-text").text("Humidity: " + response.main.humidity + "%"));
        
        // wind speed
        cardBody.append($("<p>").attr("class", "card-text").text("Winf Speed: " + response.wind.speed + " MPH"));

    })
}

getCurrent();


function getForecast(city){
    // get 5 day forecast
    var queryURL = "http://api.openweathermap.org/data/2.5/forecast?id=" + city + "&APPID=e6dee304a0d16335ecee688e3c6dc7e4";
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response){
        // add container div for forcast cards
        var newrow = $("<div>").attr("class", "forecast");
        $("#earthforecast").append(newrow);
        
        // loop array response to find forecast
        for (var i = 0; i < response.list.length; i++){
            if (response.list[i].dt_txt.indexOf("15:00:00") !== -1){

                var newCol = $('<div>').attr('class', 'one-fifth')
                newRow.append(newCol);

                var newCard = $('<div>').attr('class', 'card text-white bg-primary');
                newCol.append(newCard);

                var cardHead = $('<div>').attr('class', 'card-header').text(moment(response.list[i].dt, "X").format("MMM Do"));
                newCard.append(cardHead);

                var cardImg = $("<img>").attr("class", "card-img-top").attr("src", "https://openweathermap.org/img/wn/" + response.list[i].weather[0].icon + "@2x.png");
                newCard.append(cardImg);

                var bodyDiv = $('<div>').attr("class", "card-body");
                newCard.append(bodyDiv);

                bodyDiv.append($('<p>').attr('class', 'card-text').html("Temp: " + response.list[i].main.temp + ' &#8457;'));
                bodyDiv.append($('<p>').attr('class', 'card-text').text("Humidity: " + response.list[i].main.humidity + "%"));

            }
        }
    });
}





// function previousLocation(){
//     // get prevous location from local storage
//     savedLocations = JSON.parse(localStorage.getItem("weathercities"));
//     var lastSearch;
//     // display buttons for previous searches
//     if (savedLocations){
//         currentLoc = savedLocations[savedLocations.length - 1];
//         showPrevious();
//         getCurrent(currentLoc);
//     }
//     else{
//         if (!navigator.geolocation){
//             getCurrent("Raleigh");
//         }
//         else{
//             navigator.geolocation.getCurrentPosition(success, error);
//         }
//     }
// }

