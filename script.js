// DOM Element Selection and Initialization
const selectedMoodContainer = document.querySelector(".selected-mood");
let selectedMood = document.querySelector(".selected-img");

const excitedMood = document.querySelector(".excited-mood-img");
const angryMood = document.querySelector(".angry-mood-img");
const happyMood = document.querySelector(".happy-mood-img");
const neutralMood = document.querySelector(".neutral-mood-img");
const sadMood = document.querySelector(".sad-mood-img");
const worriedMood = document.querySelector(".worried-mood-img");
let nav = 0; //Navigation variable for calendar.
let clicked = null;

const calendar = document.getElementById("dates"); 
const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// Initialize mood counts
const moodCounts = {
  "excited-mood": 0,
  "happy-mood": 0,
  "sad-mood": 0,
  "worried-mood": 0,
  "angry-mood": 0,
  "neutral-mood": 0,
};

// Helper Functions for Local Storage

// Saves the selected mood for a specific date to local storage.
function saveMoodToLocalStorage(date, mood) {
  localStorage.setItem(date, JSON.stringify(mood));
}

// Retrieves the mood for a specific date from local storage.
function getMoodFromLocalStorage(date) {
  const mood = localStorage.getItem(date);
  return mood ? JSON.parse(mood) : null;
}

// Saves the mood counts to local storage.
function saveMoodCountsToLocalStorage() {
  for (const mood in moodCounts) {
    localStorage.setItem(`moodCount_${mood}`, JSON.stringify(moodCounts[mood]));
  }
}

// Retrieves the mood counts from local storage.
function getMoodCountsFromLocalStorage() {
  const loadedMoodCounts = {};
  for (const mood in moodCounts) {
    const savedCount = localStorage.getItem(`moodCount_${mood}`);
    loadedMoodCounts[mood] = savedCount ? parseInt(JSON.parse(savedCount)) : 0;
  }
  return loadedMoodCounts;
}

// Updates the index percentage of a particular mood and updates progress bar
function updateIndexPercentage(mood, amount) {
  moodCounts[mood] = Math.max(0, Math.min(30, moodCounts[mood] + amount));
  updateProgressBar(mood);
  saveMoodCountsToLocalStorage();
}

// Calendar Functions

// Loads and renders the calendar for the current month.
function load() {
  const dt = new Date();

  if (nav !== 0) {
    dt.setMonth(new Date().getMonth() + nav);
  }

  const day = dt.getDate();
  const month = dt.getMonth();
  const year = dt.getFullYear();

  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const dateString = firstDayOfMonth.toLocaleDateString("en-us", {
    weekday: "long",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });

  const paddingDays = weekdays.indexOf(dateString.split(", ")[0]);

  document.getElementById("monthDisplay").innerText = `${dt.toLocaleDateString(
    "en-us",
    { month: "long" }
  )} ${year}`;

  calendar.innerHTML = "";

  for (let i = 1; i <= paddingDays + daysInMonth; i++) {
    const daySquare = document.createElement("div");
    daySquare.classList.add("day");

    if (i > paddingDays) {
      const dayNumber = i - paddingDays;
      daySquare.innerText = dayNumber;
      const monthFormatted = String(month + 1).padStart(2, "0");
      const dayNumberFormatted = String(dayNumber).padStart(2, "0");
      const dayString = `${monthFormatted}/${dayNumberFormatted}/${year}`;

      if (dayNumber === day && nav === 0) {
        daySquare.id = "currentDay";
      }

      // Check Local Storage for Mood
      const savedMood = getMoodFromLocalStorage(dayString);

      if (savedMood) {
        const moodImg = document.createElement("img");
        moodImg.src = `./assets/${savedMood}.png`;
        moodImg.alt = savedMood;
        moodImg.style.width = "30px";
        moodImg.style.height = "30px";
        daySquare.appendChild(moodImg);
        daySquare.style.backgroundColor = moodColors[savedMood];
        daySquare.style.display = "flex";
        daySquare.style.alignItems = "center";
        daySquare.style.justifyContent = "center";
      }

      daySquare.addEventListener("click", () => openModal(dayString));
    } else {
      daySquare.classList.add("padding");
    }

    calendar.appendChild(daySquare);
  }
  updateTodayText();
  updateAllProgressBars();
}

// Initializes the calendar navigation buttons.
function initButtons() {
  document.getElementById("nextButton").addEventListener("click", () => {
    nav++;
    load();
  });

  document.getElementById("backButton").addEventListener("click", () => {
    nav--;
    load();
  });
}

// Mood Selection and Playlist Updates

const allMoodsArr = [
  excitedMood,
  angryMood,
  happyMood,
  neutralMood,
  sadMood,
  worriedMood,
];
const spotifyIframe = document.getElementById("spotify-iframe");

// Maps each mood to its corresponding Spotify playlist URL.
const playlistUrls = {
  "excited-mood":
    "https://open.spotify.com/embed/playlist/1bvq6qm3FL2HxvE8UjKOqr?utm_source=generator",
  "happy-mood":
    "https://open.spotify.com/embed/playlist/1Eb3hIq4uBOicvBE8s3cQx?utm_source=generator",
  "sad-mood":
    "https://open.spotify.com/embed/playlist/4icXG0elrBxzTn5jSfJy1w?utm_source=generator",
  "worried-mood":
    "https://open.spotify.com/embed/playlist/2v8dbUhRp5m3ssj4PeBzCq?utm_source=generator&theme=0",
  "angry-mood":
    "https://open.spotify.com/embed/playlist/2h8z6Qo0xI05n4pNjREQsE?utm_source=generator",
  "neutral-mood":
    "https://open.spotify.com/embed/playlist/4YtjDhpJ2vUeYwu4J8WV34?utm_source=generator",
};

// Attaches click event listeners to each mood option.
allMoodsArr.forEach((mood) => {
  if (mood) {
    mood.addEventListener("click", () => {
      console.log("Clicked mood:", mood);

      const moodClass = mood.classList[1].replace("-img", "");
      const playlistUrl = playlistUrls[moodClass];

      if (playlistUrl) {
        spotifyIframe.src = playlistUrl;
        console.log("Playlist updated to:", playlistUrl);
      }

      const newSelectedMood = document.createElement("img");
      newSelectedMood.src = mood.src;
      newSelectedMood.alt = mood.alt;
      newSelectedMood.classList.add("selected-img");
      newSelectedMood.style.opacity = 0;
      selectedMoodContainer.replaceChild(newSelectedMood, selectedMood);
      selectedMood = newSelectedMood;

      void selectedMood.offsetWidth;
      selectedMood.style.opacity = 1;

      //update the today's date mood
      const currentDaySquare = document.getElementById("currentDay");
      const dt = new Date(); // Get the current date
      const day = dt.getDate();
      const month = dt.getMonth();
      const year = dt.getFullYear();
      const monthFormatted = String(month + 1).padStart(2, "0");
      const dayNumberFormatted = String(day).padStart(2, "0");
      const dayString = `${monthFormatted}/${dayNumberFormatted}/${year}`;

      const existingMood = getMoodFromLocalStorage(dayString);

      if (currentDaySquare) {
        // Get current date in dayString format
        currentDaySquare.style.justifyContent = "space-around";

        const existingImage = currentDaySquare.querySelector("img");
        if (existingImage) {
          currentDaySquare.removeChild(existingImage);
        }
        const CurrentMood = document.createElement("img");
        CurrentMood.src = mood.src;
        CurrentMood.alt = mood.alt;
        CurrentMood.style.width = "30px";
        CurrentMood.style.height = "30px";
        currentDaySquare.appendChild(CurrentMood);

        // Change background color
        currentDaySquare.style.backgroundColor = moodColors[moodClass];

        // Save Mood to Local Storage
        saveMoodToLocalStorage(dayString, moodClass);

        if (existingMood) {
          updateIndexPercentage(existingMood, -1);
        }

        updateIndexPercentage(moodClass, 1);
      }
    });
  }
});

// Mood Index and Progress Bar Updates
// Maps each mood to its corresponding background color.
const moodColors = {
  "happy-mood": "#63b8b3b3",
  "angry-mood": "#ff6e7db3",
  "sad-mood": "#ff6e7db3",
  "neutral-mood": "#ff874ab3",
  "excited-mood": "#65bad9b3",
  "worried-mood": "#ff874ab3",
};

// Updates a single progress bar based on the mood count.
function updateProgressBar(moodClass) {
  const progressBar = document.querySelector(
    `.${moodClass.replace("-mood", "")}-container .progress`
  );
  const percentage = (moodCounts[moodClass] / 30) * 100;

  if (progressBar) {
    progressBar.style.height = `${percentage}%`;
    progressBar.style.backgroundColor = moodColors[moodClass]; // Set background color

    // update percentages of mood index
    const indexPercentage = document.querySelector(
      `.${moodClass.replace("-mood", "")}-container .index-percentage`
    );
    indexPercentage.textContent = `${percentage.toFixed(0)}%`;
  }
}

// Updates all mood progress bars based on the current mood counts.
function updateAllProgressBars() {
  for (const mood in moodCounts) {
    updateProgressBar(mood);
  }
}

// Date and Initial Load Functions
// Updates the "Today's Date" text display.
function updateTodayText() {
  const dt = new Date(); // Get the current date
  const day = dt.getDate();
  const month = dt.getMonth();
  const year = dt.getFullYear();
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const todayText = `${String(day).padStart(2, "0")} ${
    monthNames[month]
  } ${year}`;
  document.querySelector(".today-text").textContent = todayText; // Update the text in the HTML
}

// Function to run on page load: initializes mood counts, updates progress bars
window.onload = function () {
  // Load previous mood counts from local storage, or initialize if not present.

  for (const mood in moodCounts) {
    const savedCount = localStorage.getItem(`moodCount_${mood}`);
    moodCounts[mood] = savedCount ? parseInt(savedCount) : 0;
  }

  // Loop to update the counts from what is previously saved in the user's settings.
  allMoodsArr.forEach((mood) => {
    if (mood) {
      const moodClass = mood.classList[1].replace("-img", "");
      updateProgressBar(moodClass);
    }
  });
};

// Initializing function calls
initButtons();
load();