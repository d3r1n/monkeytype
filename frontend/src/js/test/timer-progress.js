import Config, * as UpdateConfig from "../config";
import * as CustomText from "./custom-text";
import * as Misc from "../misc";
import * as TestWords from "./test-words";
import * as TestInput from "./test-input";
import * as Time from "./../states/time";
import * as SlowTimer from "../states/slow-timer";
import * as TestActive from "./../states/test-active";

export function show() {
  let op = Config.showTimerProgress ? Config.timerOpacity : 0;
  if (Config.mode != "zen" && Config.timerStyle === "bar") {
    $("#timerWrapper").stop(true, true).removeClass("hidden").animate(
      {
        opacity: op,
      },
      125
    );
  } else if (Config.timerStyle === "text") {
    $("#timerNumber")
      .stop(true, true)
      .removeClass("hidden")
      .css("opacity", 0)
      .animate(
        {
          opacity: op,
        },
        125
      );
  } else if (Config.mode == "zen" || Config.timerStyle === "mini") {
    if (op > 0) {
      $("#miniTimerAndLiveWpm .time")
        .stop(true, true)
        .removeClass("hidden")
        .animate(
          {
            opacity: op,
          },
          125
        );
    }
  }
}

export function hide() {
  $("#timerWrapper").stop(true, true).animate(
    {
      opacity: 0,
    },
    125
  );
  $("#miniTimerAndLiveWpm .time")
    .stop(true, true)
    .animate(
      {
        opacity: 0,
      },
      125,
      () => {
        $("#miniTimerAndLiveWpm .time").addClass("hidden");
      }
    );
  $("#timerNumber").stop(true, true).animate(
    {
      opacity: 0,
    },
    125
  );
}

export function restart() {
  if (Config.timerStyle === "bar") {
    if (Config.mode === "time") {
      $("#timer").stop(true, true).animate(
        {
          width: "100vw",
        },
        0
      );
    } else if (Config.mode === "words" || Config.mode === "custom") {
      $("#timer").stop(true, true).animate(
        {
          width: "0vw",
        },
        0
      );
    }
  }
}

let timerNumberElement = document.querySelector("#timerNumber");
let miniTimerNumberElement = document.querySelector(
  "#miniTimerAndLiveWpm .time"
);

export function update() {
  let time = Time.get();
  if (
    Config.mode === "time" ||
    (Config.mode === "custom" && CustomText.isTimeRandom)
  ) {
    let maxtime = Config.time;
    if (Config.mode === "custom" && CustomText.isTimeRandom) {
      maxtime = CustomText.time;
    }
    if (Config.timerStyle === "bar") {
      let percent = 100 - ((time + 1) / maxtime) * 100;
      $("#timer")
        .stop(true, true)
        .animate(
          {
            width: percent + "vw",
          },
          SlowTimer.get() ? 0 : 1000,
          "linear"
        );
    } else if (Config.timerStyle === "text") {
      let displayTime = Misc.secondsToString(maxtime - time);
      if (maxtime === 0) {
        displayTime = Misc.secondsToString(time);
      }
      timerNumberElement.innerHTML = "<div>" + displayTime + "</div>";
    } else if (Config.timerStyle === "mini") {
      let displayTime = Misc.secondsToString(maxtime - time);
      if (maxtime === 0) {
        displayTime = Misc.secondsToString(time);
      }
      miniTimerNumberElement.innerHTML = displayTime;
    }
  } else if (
    Config.mode === "words" ||
    Config.mode === "custom" ||
    Config.mode === "quote"
  ) {
    let outof = TestWords.words.length;
    if (Config.mode === "words") {
      outof = Config.words;
    }
    if (Config.mode === "custom") {
      if (CustomText.isWordRandom) {
        outof = CustomText.word;
      } else {
        outof = CustomText.text.length;
      }
    }
    if (Config.mode === "quote") {
      outof = TestWords.randomQuote?.textSplit?.length ?? 1;
    }
    if (Config.timerStyle === "bar") {
      let percent = Math.floor(
        ((TestWords.words.currentIndex + 1) / outof) * 100
      );
      $("#timer")
        .stop(true, true)
        .animate(
          {
            width: percent + "vw",
          },
          SlowTimer.get() ? 0 : 250
        );
    } else if (Config.timerStyle === "text") {
      if (outof === 0) {
        timerNumberElement.innerHTML =
          "<div>" + `${TestInput.input.history.length}` + "</div>";
      } else {
        timerNumberElement.innerHTML =
          "<div>" + `${TestInput.input.history.length}/${outof}` + "</div>";
      }
    } else if (Config.timerStyle === "mini") {
      if (Config.words === 0) {
        miniTimerNumberElement.innerHTML = `${TestInput.input.history.length}`;
      } else {
        miniTimerNumberElement.innerHTML = `${TestInput.input.history.length}/${outof}`;
      }
    }
  } else if (Config.mode == "zen") {
    if (Config.timerStyle === "text") {
      timerNumberElement.innerHTML =
        "<div>" + `${TestInput.input.history.length}` + "</div>";
    } else {
      miniTimerNumberElement.innerHTML = `${TestInput.input.history.length}`;
    }
  }
}

export function updateStyle() {
  if (!TestActive.get()) return;
  hide();
  update();
  setTimeout(() => {
    show();
  }, 125);
}

$(document).ready(() => {
  UpdateConfig.subscribeToEvent((eventKey, eventValue) => {
    if (eventKey === "showTimerProgress") {
      if (eventValue === true && TestActive.get()) {
        show();
      } else {
        hide();
      }
    }
    if (eventKey === "timerStyle") updateStyle();
  });
});
