/// 날짜구하기 ///

exports.getDate = function() {
  let today = new Date();
  let options = {
    weekday: "long",
    // year: "numeric",
    month: "long",
    day: "numeric",
  };
  return(today.toLocaleDateString("de-DE", options));
}

exports.getDay = function() {
  let today = new Date();
  let options = {
    weekday: "long",
  };
  return(today.toLocaleDateString("de-DE", options));
}
