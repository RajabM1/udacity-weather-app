/* Global Variables */

// Personal API Key for OpenWeatherMap API
const baseUrl = "https://api.openweathermap.org/data/2.5/weather";
const apiKey = "b897a0abc2c9bb937ad4c511f9300ec7&units=imperial";

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + "." + d.getDate() + "." + d.getFullYear();

// Event listener to add function to existing HTML DOM element
const generateButton = document.getElementById("generate");

/* Function called by event listener */
generateButton.addEventListener("click", async (e) => {
    e.preventDefault();

    const zipCode = document.getElementById("zip").value;
    const content = document.getElementById("feelings").value;

    if (zipCode) {
        const data = getWeatherData(baseUrl, zipCode, apiKey)
            .then((data) => {
                postData("/add", {
                    temp: data.main.temp,
                    date: newDate,
                    content: content,
                });
            })
            .then(() => {
                retrieveData();
            });
        console.log(data);
    } else {
        console.log("Please enter a zip code.");
    }
});

/* Function to GET Web API Data*/
const getWeatherData = async (baseUrl, zipCode, apiKey) => {
    try {
        const res = await fetch(`${baseUrl}?zip=${zipCode}&appid=${apiKey}`);
        const data = await res.json();
        return data;
    } catch (error) {
        console.log("error", error);
    }
};

/* Function to POST data */
const postData = async (url, data) => {
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });
        const newData = await response.json();
        return newData;
    } catch (error) {
        console.log(error);
    }
};

/* Function to GET Project Data */
const retrieveData = async () => {
    const request = await fetch("/all");
    try {
        // Transform into JSON
        const allData = await request.json();
        console.log(allData);
        // Write updated data to DOM elements
        document.getElementById("temp").innerHTML =
            "Temp: " + Math.round(allData.temp) + " degrees";
        document.getElementById("content").innerHTML =
            "Feeling: " + allData.content;
        document.getElementById("date").innerHTML = "Date: " + allData.date;
    } catch (error) {
        console.log("error", error);
    }
};
