const worldBossEvents = [
  "2024-07-08T01:00:00",
  "2024-07-08T04:30:00",
  "2024-07-08T08:00:00",
  "2024-07-08T11:30:00",
  "2024-07-08T15:00:00"
];

const helltideEvents = [
  "2024-07-08T00:00:00",
  "2024-07-08T01:00:00",
  "2024-07-08T02:00:00",
  "2024-07-08T03:00:00",
  "2024-07-08T04:00:00",
  "2024-07-08T05:00:00",
  "2024-07-08T06:00:00",
  "2024-07-08T07:00:00",
  "2024-07-08T08:00:00",
  "2024-07-08T09:00:00",
  "2024-07-08T10:00:00",
  "2024-07-08T11:00:00",
  "2024-07-08T12:00:00",
  "2024-07-08T13:00:00",
  "2024-07-08T14:00:00",
  "2024-07-08T15:00:00",
  "2024-07-08T16:00:00",
  "2024-07-08T17:00:00",
  "2024-07-08T18:00:00"
];

const legionEvents = [
  "2024-07-08T00:25:00",
  "2024-07-08T00:50:00",
  "2024-07-08T01:15:00",
  "2024-07-08T01:40:00",
  "2024-07-08T02:05:00",
  "2024-07-08T02:30:00",
  "2024-07-08T02:55:00",
  "2024-07-08T03:20:00",
  "2024-07-08T03:45:00",
  "2024-07-08T04:10:00",
  "2024-07-08T04:35:00",
  "2024-07-08T05:00:00",
  "2024-07-08T05:25:00",
  "2024-07-08T05:50:00",
  "2024-07-08T06:15:00",
  "2024-07-08T06:40:00",
  "2024-07-08T07:05:00",
  "2024-07-08T07:30:00",
  "2024-07-08T07:55:00",
  "2024-07-08T08:20:00",
  "2024-07-08T08:45:00",
  "2024-07-08T09:10:00",
  "2024-07-08T09:35:00",
  "2024-07-08T10:00:00",
  "2024-07-08T10:25:00",
  "2024-07-08T10:50:00",
  "2024-07-08T11:15:00",
  "2024-07-08T11:40:00",
  "2024-07-08T12:05:00",
  "2024-07-08T12:30:00",
  "2024-07-08T12:55:00",
  "2024-07-08T13:20:00",
  "2024-07-08T13:45:00",
  "2024-07-08T14:10:00",
  "2024-07-08T14:35:00",
  "2024-07-08T15:00:00",
  "2024-07-08T15:25:00",
  "2024-07-08T15:50:00",
  "2024-07-08T16:15:00",
  "2024-07-08T16:40:00",
  "2024-07-08T17:05:00",
  "2024-07-08T17:30:00",
  "2024-07-08T17:55:00"
];

const EVENT_ACTIVE_DURATION = 55 * 60 * 1000; // 55 minutes
const COOLDOWN_DURATION = 5 * 60 * 1000; // 5 minutes

function updateTimers() {
  updateEvent(
    worldBossEvents,
    "worldBossTimer",
    "worldBossDetails",
    "World Boss",
    "worldBossAudio"
  );
  updateHelltide();
  updateEvent(
    legionEvents,
    "legionTimer",
    "legionDetails",
    "Legion",
    "legionAudio"
  );
}

function updateEvent(eventList, timerId, detailsId, eventType, audioId) {
  const now = new Date();
  const upcomingEvent = eventList.find((event) => new Date(event) > now);

  if (!upcomingEvent) return;

  const eventDate = new Date(upcomingEvent);
  const timeDiff = eventDate - now;

  displayTimeRemaining(timerId, timeDiff);
  displayEventDetails(detailsId, eventType, eventDate);

  if (timeDiff < 1000) {
    handleEventStart(audioId, eventType);
  }
}

function updateHelltide() {
  const now = new Date();
  const upcomingEvent = helltideEvents.find((event) => {
    const eventDate = new Date(event);
    const endEventDate = new Date(eventDate.getTime() + EVENT_ACTIVE_DURATION);
    const cooldownEndDate = new Date(
      endEventDate.getTime() + COOLDOWN_DURATION
    );
    return (eventDate <= now && now <= cooldownEndDate) || eventDate > now;
  });

  if (!upcomingEvent) return;

  const eventDate = new Date(upcomingEvent);
  const endEventDate = new Date(eventDate.getTime() + EVENT_ACTIVE_DURATION);
  const cooldownEndDate = new Date(endEventDate.getTime() + COOLDOWN_DURATION);
  const timeDiff =
    now < eventDate
      ? eventDate - now
      : now <= endEventDate
      ? endEventDate - now
      : cooldownEndDate - now;

  displayTimeRemaining("helltideTimer", timeDiff);

  if (now < eventDate) {
    displayEventDetails(
      "helltideDetails",
      "Gear Check before next Helltide",
      eventDate
    );
  } else if (now <= endEventDate) {
    displayEventDetails("helltideDetails", "Helltide ends at", endEventDate);
    if (timeDiff < 1000) {
      handleEventStart("helltideAudio", "Helltide");
    }
  } else {
    displayEventDetails(
      "helltideDetails",
      "Gear Check before next Helltide",
      eventDate
    );
  }
}

function displayTimeRemaining(timerId, timeDiff) {
  const hours = Math.floor(timeDiff / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

  document.getElementById(
    timerId
  ).textContent = `${hours} hours, ${minutes} minutes, ${seconds} seconds`;
}

function displayEventDetails(detailsId, eventType, eventDate) {
  document.getElementById(
    detailsId
  ).textContent = `${eventType} at ${eventDate.toLocaleTimeString()}`;
}

function handleEventStart(audioId, eventType) {
  const audio = document.getElementById(audioId);
  if (!audio.muted) {
    audio.play();
  }
  const notifId = `notif${eventType.replace(" ", "")}`;
  if (localStorage.getItem(notifId) === "true") {
    showNotification(`${eventType} is starting now!`);
  }
}

function showNotification(message) {
  if (Notification.permission === "granted") {
    new Notification(message);
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        new Notification(message);
      }
    });
  }
}

// Volume and Mute controls
function setVolumeControl(audioId, volumeId) {
  const audio = document.getElementById(audioId);
  const volumeControl = document.getElementById(volumeId);
  const savedVolume = localStorage.getItem(volumeId);
  if (savedVolume !== null) {
    volumeControl.value = savedVolume;
    audio.volume = savedVolume;
  }
  volumeControl.addEventListener("input", function () {
    audio.volume = this.value;
    localStorage.setItem(volumeId, this.value);
    audio.play();
  });
}

function setMuteControl(audioId, muteButtonId, volumeId) {
  const audio = document.getElementById(audioId);
  const muteButton = document.getElementById(muteButtonId);
  const savedMuteState = localStorage.getItem(muteButtonId);
  if (savedMuteState !== null) {
    audio.muted = savedMuteState === "true";
    muteButton.innerHTML = audio.muted
      ? '<i class="fas fa-volume-off"></i>'
      : '<i class="fas fa-volume-up"></i>';
  }
  muteButton.addEventListener("click", function () {
    audio.muted = !audio.muted;
    muteButton.innerHTML = audio.muted
      ? '<i class="fas fa-volume-off"></i>'
      : '<i class="fas fa-volume-up"></i>';
    localStorage.setItem(muteButtonId, audio.muted);
  });
}

// Show/hide volume slider
function setSoundButtonControl(soundButtonId, volumeControlId) {
  const soundButton = document.getElementById(soundButtonId);
  const volumeControl = document.getElementById(volumeControlId);
  soundButton.addEventListener("click", function () {
    volumeControl.classList.toggle("show");
  });
}

// Notification controls
function setNotificationControl(notifButtonId) {
  const notifButton = document.getElementById(notifButtonId);
  const savedNotifState = localStorage.getItem(notifButtonId);
  if (savedNotifState !== null) {
    notifButton.classList.toggle("btn-primary", savedNotifState === "true");
    notifButton.innerHTML =
      savedNotifState === "true"
        ? '<i class="fa-regular fa-bell"></i>'
        : '<i class="fa-regular fa-bell-slash"></i>';
  }
  notifButton.addEventListener("click", function () {
    const currentState = notifButton.classList.toggle("btn-primary");
    notifButton.innerHTML = currentState
      ? '<i class="fa-regular fa-bell"></i>'
      : '<i class="fa-regular fa-bell-slash"></i>';
    localStorage.setItem(notifButtonId, currentState);
  });
}

setVolumeControl("worldBossAudio", "worldBossVolume");
setVolumeControl("helltideAudio", "helltideVolume");
setVolumeControl("legionAudio", "legionVolume");

setMuteControl("worldBossAudio", "soundWorldBoss", "worldBossVolume");
setMuteControl("helltideAudio", "soundHelltide", "helltideVolume");
setMuteControl("legionAudio", "soundLegion", "legionVolume");

setSoundButtonControl("soundWorldBoss", "worldBossVolume");
setSoundButtonControl("soundHelltide", "helltideVolume");
setSoundButtonControl("soundLegion", "legionVolume");

setNotificationControl("notifWorldBoss");
setNotificationControl("notifHelltide");
setNotificationControl("notifLegion");

updateTimers();
setInterval(updateTimers, 1000);

document.getElementById("closeUpdates").addEventListener("click", () => {
  window.close();
});
