export const timeFormat = (currentTime) => {
  let hours = String(Math.trunc(currentTime / 3600));
  currentTime -= hours * 3600;
  let minutes = String(Math.trunc(currentTime / 60));
  currentTime -= minutes * 60;
  let seconds = String(currentTime);
  let strTime = "";
  if (hours == "0") {
    strTime = `${minutes.length == 1 ? "0" + minutes : minutes}:${
      seconds.length == 1 ? "0" + seconds : seconds
    }`;
  } else {
    strTime = `${hours.length == 1 ? "0" + hours : hours}:${
      minutes.length == 1 ? "0" + minutes : minutes
    }:${seconds.length == 1 ? "0" + seconds : seconds}`;
  }

  return strTime;
};
