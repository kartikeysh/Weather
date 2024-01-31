const userTab = document.querySelector("[your_weather]")
const searchTab = document.querySelector("[search_weather]")
const userContainer = document.querySelector(".weather-container");
const grantlocation = document.querySelector(".grant-location");
const grantPermission = document.querySelector(".grant");
const form = document.querySelector(".form-container");
let dataSearch = document.querySelector("[data-searchInput]");
let searchButton =  document.querySelector("[search-button]");
let loading= document.querySelector(".loading-container");
let userInfo = document.querySelector(".user-info");


let currentTab = userTab;

currentTab.classList.add("current-tab")
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
getfromSessionStorage();

function switcch(newtab)
{
    if(newtab !== currentTab)
    {
        currentTab.classList.remove('current-tab');
        currentTab = newtab;
        currentTab.classList.add('current-tab');
        

        if(!form.classList.contains("active"))
        { //*search form wala is invisble then make it visible
            
            userInfo.classList.remove('active');
            grantlocation.classList.remove('active');
            form.classList.add('active');
        }
        else
        {
            form.classList.remove('active');
            userInfo.classList.remove("active");
            // grantlocation.classList.add('active');
            ///*abb me your weather tab me hu to weather bhi display krna pdega local storage ko check krege for cordinates
            getfromSessionStorage();
        }
    }

}
searchTab.addEventListener('click',()=>{
    switcch(searchTab);
});
userTab.addEventListener('click',()=>{
    switcch(userTab);
});
function getfromSessionStorage()
{
    //*check if lat and long are availabe or not
    let coord = sessionStorage.getItem('my-coordinates');
    console.log(coord);
    if(!coord)
    {
    // {   alert("probelm1")
        grantlocation.classList.add('active');

    }
    else{
        let data = JSON.parse(coord);
        fetchuser(data); 
    }

}
async function  fetchuser(userdata)
{
    const {lat,long} = userdata;//*yha pr or neeche name exact same hoen chie
    console.log(lat);
    console.log(long);
    grantlocation.classList.remove('active');
    loading.classList.add('active');
    try
    { //*`` this are used so that we can use ${value directly here}
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${API_KEY}&units=metric`
          );
      const fdata = await response.json();
      console.log(fdata,"this is fdata");
      loading.classList.remove("active");
      userInfo.classList.add("active");
        render(fdata);
    
    }
    catch(e)
    {
        alert("under-maintaince"+e);
    }

}
function render(data)
{
    const cityName = document.querySelector("[data-city-name]");
    const countryIcon = document.querySelector(".data-country-icon");
    const desc = document.querySelector("[air-type]");
    const weatherIcon = document.querySelector("[data-weather-icon]");
    const temp = document.querySelector("[data-temprature]");
    const windspeed = document.querySelector("[data-wind-speed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-clouds]");
    console.log(data);
    cityName.innerText = data?.name;
    countryIcon.src  = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
    desc.innerText = data?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
    temp.innerText = `${data?.main?.temp} °C`;
    windspeed.innerText = `${data?.wind?.speed}m/s`;
    humidity.innerText = `${data?.main?.humidity}%`;
    cloudiness.innerText = `${data?.clouds?.all}%`;
}
//*geo location button
grantPermission.addEventListener('click',()=>{
    if ( navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else { 
        alert("Geolocation is not supported by this browser.");
      }
})
function showPosition(position) {

    const userCoordinates = {
        lat: position.coords.latitude,
        long: position.coords.longitude,//*ya pr or upper name exact hone chie 
    }
    console.log(userCoordinates);
    sessionStorage.setItem("my-coordinates", JSON.stringify(userCoordinates));
    fetchuser(userCoordinates);

}
//*search 
form.addEventListener('click',(e)=>
{
    e.preventDefault();
    let city = dataSearch.value 
    console.log("here");
    if(city === "")
    {
        return;
    }
    else
    {
        fetchcity(city);
        
    }

})
async function fetchcity(city) {
     loading.classList.add("active");
     userInfo.classList.remove("active");
     grantlocation.classList.remove("active");
     console.log("city is being fetch")
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          );
        const data = await response.json();
         loading.classList.remove("active");
         
         
         userInfo.classList.add("active");
        render(data);
    }
    catch(err) {
        console.log(err);
    }
}
function empty()
{
    dataSearch.value = "";
}
