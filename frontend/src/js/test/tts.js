import Config, * as UpdateConfig from "../config";
import * as Misc from "../misc";

let voice;

export async function setLanguage(lang = Config.language) {
  if (!voice) return;
  let language = await Misc.getLanguage(lang);
  let bcp = language.bcp47 ? language.bcp47 : "en-US";
  voice.lang = bcp;
}

export async function init() {
  voice = new SpeechSynthesisUtterance();
  setLanguage();
}

export function clear() {
  voice = undefined;
}

export function speak(text) {
  if (!voice) init();
  voice.text = text;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(voice);
}

$(document).ready(() => {
  UpdateConfig.subscribeToEvent((eventKey, eventValue) => {
    if (eventKey === "funbox") {
      if (eventValue === "none") {
        clear();
      } else if (eventValue === "tts") {
        init();
      }
    }
    if (eventKey === "language" && Config.funbox === "tts") setLanguage();
  });
});
