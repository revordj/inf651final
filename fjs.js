//Global Variable Declaration Section. 4 api urls, 2 for Farenheit and 2 for Celcius.
//One url is for just the city if it is passed, the other is for the city and state if it is passed.

//testIcon variable is used to hold the url for the icon image source, with the last bit of it added in the 
//functions below.

//Far variable keeps track of whether to return results in Far or Cel

var apistringCity = 'http://api.openweathermap.org/data/2.5/find?units=imperial&appid=53bea8d77219d7eedf01a36318fb8259&q=';
var apistringCS ='http://api.openweathermap.org/data/2.5/find?units=imperial&appid=53bea8d77219d7eedf01a36318fb8259&q=';
var CelapistringCity = 'http://api.openweathermap.org/data/2.5/find?units=metric&appid=53bea8d77219d7eedf01a36318fb8259&q=';
var CelapistringCS ='http://api.openweathermap.org/data/2.5/find?units=metric&appid=53bea8d77219d7eedf01a36318fb8259&q=';
var testIcon = 'http://openweathermap.org/img/wn/';
var Far = true;

//Function that queries the api for the JSON data
async function fetchWeatherData(city, state="")        //takes a city and state as paramenters, if no state is
{                                                      //passed, it defaults to an empty string
    if(Far)                                            //Check to see if the results should be returned in Far
    {
     if(state === "")                                 //If state wasn't passed, use the apiurl for just the city
     {
     results = await fetch(apistringCity + city);
     data = await results.json();
     }
     else                                              //If the state was passed, use the other apiurl for city and state
     {
     results = await fetch(apistringCity + city + '&state=' + state);
     data = await results.json();
     }
    }
    else                                             //This section triggers if the results are returned in Celsius instead
    {
        if(state === "")                            //same logic as above for Farenheit, but with a different URL
        {
        results = await fetch(CelapistringCity + city);
        data = await results.json();
        }
        else
        {
        results = await fetch(CelapistringCity + city + '&state=' + state);
        data = await results.json();
        }
    }

    //Store the relevent values from the JSON data
    tempF = JSON.stringify(data.list[0].main.temp);              
    highTemp = JSON.stringify(data.list[0].main.temp_max);
    lowTemp = JSON.stringify(data.list[0].main.temp_min);
    tempFeels = JSON.stringify(data.list[0].main.feels_like);
    desc = JSON.stringify(data.list[0].weather[0].description);
    icon = JSON.stringify(data.list[0].weather[0].icon);
    
    //Big work is my main computational function. Keeping this section clean by minimzing what it actual does
    bigWork(icon, tempF, highTemp, lowTemp, tempFeels, desc, city, state);

    //Clear fields is called to erase any text entries and prep the form for the next input. 
    //The checkbox is not unchecked by this b/c we assume the user will want the information in
    //the same format.
    clearFields();

    //Return focus to the first input field
    document.getElementById('cityName').focus();
    
}

function bigWork(iconID, tempF, highTemp, lowTemp, tempFeels, desc, city, state = "")
{
    setLocation(city, state);
    setTemps(tempF, highTemp, lowTemp, tempFeels);
    setIcon(iconID);
    setDesctiption(desc)
    
    return;
}

//Function to clear the text input form fields
function clearFields()
{
    document.getElementById('cityName').value = "";
    document.getElementById('stateName').value = "";
}

//Function to used the passed location information and overwrite the appropriate Div in HTML for display
function setLocation(city, state)
{
    document.getElementById('locData').innerHTML = city;   //Write the city out 
    if(!(state === ""))                                    //If the state was specified (not an empty string)
    {
       document.getElementById('locData').append( ', ' + state);  //append the date to the city, preceded by a comma
    }
    return;

//Function to pull the appropriate icon and returns the correct src string
}
function setIcon(iconID)
{
    correctedID = iconID.substring(1,4);   //The JSON data surrounds the icon's ID with quotes, this removes them
    document.getElementById('iconImg').src = testIcon + correctedID + '@2x.png';   //Builds and displays the correct string, the @2x enlarges the image. png is the file type
    return;
}

//Writes the temperature to the app divison
function setTemps(normTemp, hTemp, lTemp, feelsTemp)
{
    var degreesym = String.fromCharCode(176)   //ASCII code for the degree symbol °
    document.getElementById('hiLoResult').innerHTML = hTemp + degreesym + ' / ' + lTemp + degreesym;  //writes out the high temp and low temp split by a '/'
    if(Far)                   //If the results are in Farenheit, end the string with an F
    {
        document.getElementById('tempResult').innerHTML = normTemp + degreesym + ' F';
        document.getElementById('feelsTemp').innerHTML = "It currently feels like: " + feelsTemp + degreesym + ' F';
    }  
    else                      //If the results are in Celcius, end the string with a C
    {
        document.getElementById('tempResult').innerHTML = normTemp + degreesym + ' C';
        document.getElementById('feelsTemp').innerHTML = "It currently feels like: " + feelsTemp + degreesym + ' C';
    }    
    return;
}

//writes out the weather description to the app
function setDesctiption(desc)
{   //formatText function is called to remove quotes
    document.getElementById('descResult').innerHTML = formatText(desc);
    return;
}

//Removes quotes from passed text
function formatText(preformat)
{
    
    postformat = preformat.substring(1, preformat.length - 1);
    return postformat;

}

//function to handle if the submit button is clicked
function submitClicked()
{
    //check to see if the celcius checkbox is clicked
    if(document.getElementById('chkCel').checked)
    {
        if(Far)         //If so, and Far is true, call switchMeasure
        {
            switchMeasure();
        }
    }
    else         //If it's not clicked
    {
        if(!Far)       //check to see if Far is false. If so, call switchMeasure (user wants results in F)
        {
            switchMeasure();
        }
    }

    //Call our data Fetch function, passing the values written in by the user
    fetchWeatherData(document.getElementById('cityName').value.trim(), document.getElementById('stateName').value.trim());
}

//Function to switch the value of the Farenheit / Celcius tracker
function switchMeasure()
{
    if(Far)       //If Far is true, switch it to false
    {
        Far = false;
    }
    else          //If Far is false, switch it to true
    {
        Far = true;
    }
}

//Adding an event listener to the submit button
document.getElementById('btnsubmit').addEventListener("click", submitClicked);

//Initial app load will call the info for my town of Liberal, Kansas
fetchWeatherData("Liberal", "Kansas");