
"use strict";

// CAPSULE ROOM - DASHBOARD
// Version 1: Local UI Demo

const state = {
  connected: false,
  lightOn: true,
  brightness: 70,
  color: "#60a5fa",
  fanMode: "auto",
  fanOn: false,
  co2Threshold: 1000,
  co2: null,
  temperature: null,
  humidity: null,
  lastUpdate: null
};

// HTML elements
const $ = (id) => document.getElementById(id);

const lightToggle = $("lightToggle");
const brightness = $("brightness");
const brightnessValue = $("brightnessValue");
const lightColor = $("lightColor");
const colorValue = $("colorValue");
const previewGlow = $("previewGlow");
const lightState = $("lightState");

const autoMode = $("autoMode");
const manualMode = $("manualMode");
const autoSettings = $("autoSettings");
const manualSettings = $("manualSettings");
const fanToggle = $("fanToggle");
const fanIndicator = $("fanIndicator");
const co2Threshold = $("co2Threshold");
const thresholdValue = $("thresholdValue");

// Update lighting UI
function updateLighting() {
  lightToggle.textContent = state.lightOn ? "ON" : "OFF";
  lightToggle.classList.toggle("active", state.lightOn);

  brightnessValue.textContent = state.brightness + "%";
  brightness.value = state.brightness;

  lightColor.value = state.color;
  colorValue.textContent = state.color.toUpperCase();

  const intensity = state.lightOn
    ? state.brightness / 100
    : 0;

  previewGlow.style.background = state.color;
  previewGlow.style.opacity = intensity * 0.8;

  lightState.textContent = state.lightOn
    ? `Light ON · ${state.brightness}%`
    : "Light OFF";
}

// Lighting ON/OFF
lightToggle.addEventListener("click", () => {
  state.lightOn = !state.lightOn;
  updateLighting();
});

// Brightness control
brightness.addEventListener("input", (event) => {
  state.brightness = Number(event.target.value);
  updateLighting();
});

// RGB color control
lightColor.addEventListener("input", (event) => {
  state.color = event.target.value;
  updateLighting();
});

// Fan mode
function setFanMode(mode) {
  state.fanMode = mode;

  autoMode.classList.toggle("active", mode === "auto");
  manualMode.classList.toggle("active", mode === "manual");

  autoSettings.classList.toggle("hidden", mode !== "auto");
  manualSettings.classList.toggle("hidden", mode !== "manual");

  if (mode === "auto") {
    // No real sensor data yet.
    // Actual automatic control will run on ESP32.
    state.fanOn = false;
  } else {
    state.fanOn = false;
  }

  updateFan();
}

autoMode.addEventListener("click", () => {
  setFanMode("auto");
});

manualMode.addEventListener("click", () => {
  setFanMode("manual");
});

// Manual fan ON/OFF
fanToggle.addEventListener("click", () => {
  if (state.fanMode !== "manual") return;

  state.fanOn = !state.fanOn;
  updateFan();
});

// CO2 threshold
co2Threshold.addEventListener("input", (event) => {
  state.co2Threshold = Number(event.target.value);

  thresholdValue.textContent =
    state.co2Threshold + " ppm";
});

// Update fan interface
function updateFan() {
  const running = state.fanOn;

  fanIndicator.textContent =
    state.fanMode === "auto"
      ? "AUTO / NO DATA"
      : running ? "ON" : "OFF";

  fanIndicator.classList.toggle("running", running);

  fanToggle.textContent = running
    ? "TURN FAN OFF"
    : "TURN FAN ON";

  fanToggle.classList.toggle("active", running);
}

// Sensor values
function updateSensors() {
  $("co2Value").textContent =
    state.co2 === null ? "--" : state.co2;

  $("temperatureValue").textContent =
    state.temperature === null
      ? "--"
      : state.temperature.toFixed(1);

  $("humidityValue").textContent =
    state.humidity === null
      ? "--"
      : state.humidity.toFixed(1);

  $("lastUpdate").textContent =
    state.lastUpdate === null
      ? "No data"
      : new Date(state.lastUpdate).toLocaleTimeString();
}

// Connection indicator
function updateConnection() {
  const status = $("connectionStatus");

  status.classList.toggle("online", state.connected);
  status.classList.toggle("offline", !state.connected);

  status.textContent = state.connected
    ? "● ESP32 Online"
    : "● ESP32 Offline";

  $("espStatus").textContent =
    state.connected ? "Connected" : "Disconnected";
}

// Initialize dashboard
function initialize() {
  updateLighting();
  updateFan();
  updateSensors();
  updateConnection();

  $("systemMessage").textContent =
    "Demo mode — ESP32 is not connected.";

  console.log("Capsule Room Dashboard initialized");
}

initialize();
