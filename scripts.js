"use strict";

const INFOBOX = document.querySelector("#infobox");
const SEARCH = document.querySelector("#text")

function DIV(){
  return document.createElement("div");
};

async function retrieveWeather(loc){
  let result = await fetch("https://api.weatherapi.com/v1/current.json?key=1781a8906e6e4a4cbbb125603230611&q=" + loc, {mode : "cors"});
  let finalResult = await result.json();

  console.log(finalResult);

  let relevantData = {};
  relevantData.location = finalResult.location.name;
  relevantData.temp = finalResult.current.temp_c;
  relevantData.windKMH = finalResult.current.wind_kph;
  relevantData.cloud = finalResult.current.cloud;
  relevantData.precip = finalResult.current.precip_mm;

  createInfoBox(relevantData);
};

async function getPic(data){
  let keyword;
  if(+data.cloud > 50){
    keyword = "cloudy";
  } else if(+data.cloud > 30){
    keyword = "changeable";
  } else {
    keyword = "sunny";
  }
  if (+data.precip > 1){
    keyword = "rain";
  };

  console.log(keyword);
  let img = document.createElement("img");
  let returnedPromise = await fetch("https://api.giphy.com/v1/gifs/translate?api_key=baHdoVS3jfZfq7PuhdBtDWaCd3SyR7md&s=" + keyword, {mode : "cors"});
  let relevantObject = await returnedPromise.json();
  img.src = relevantObject.data.images.original.url;
  img.width = 200;

  return img;
};

async function createInfoBox(data){
  INFOBOX.innerText = "";

  let name = DIV();
  name.innerText = "Name: "+ data.location;

  let temp = DIV();
  temp.innerText = "Temperatur: " + data.temp + "°C";

  let wind = DIV();
  wind.innerText = "Wind: " + data.windKMH + "km/h";

  let cloud = DIV();
  if(data.cloud > 50){
    cloud.innerText = "Cloudy"
  } else {
    cloud.innerText = "Clear"
  };

  let rain = DIV();
  rain.innerText = "Precipitation: " + data.precip + "mm";

  let pic = await getPic(data);

  INFOBOX.append(name);
  INFOBOX.append(temp);
  INFOBOX.append(wind);
  INFOBOX.append(cloud);
  INFOBOX.append(rain);
  INFOBOX.append(pic);
};

function clickFn(e){
  let val = SEARCH.value;
  if(val == ""
  || val == "Your Location") return;

  retrieveWeather(val);
};

document.querySelector("#gt").addEventListener("click", clickFn);
