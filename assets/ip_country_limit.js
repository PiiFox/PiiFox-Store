let limit_countries = ["CN"];
function getIpCountryToLimit() {
  const host = window.location.hostname;
  if (host !== "www.piifox.com" && host !== "piifox.com") {
    return;
  }
  $.ajax({
    url: "https://api.ipify.org/?format=json&time=" + +new Date(),
    type: "GET",
    data: {},
    dataType: "json",
    success: function (result) {
      $.ajax({
        url: "http://serverless.piifox.com/ipwho_func",
        type: "POST",
        headers: {
          appKey: "piifox_2025",
        },
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ ip: result.ip }),
        dataType: "json",
        success: function (result2) {
          let res1 =
            typeof result2 === "string" ? JSON.parse(result2) : result2;
          let res = res1.data;
          let country = res.country,
            country_code = res.country_code;
          // If LimitCountry Include Current IP
          if (
            limit_countries.some((blockedCountry) =>
              res.country_code.includes(blockedCountry),
            )
          ) {
            window.location.href = "https://www.piifox.cn";
          }
        },
        error: function () {},
      });
    },
    error: function () {},
  });
}
if ("requestIdleCallback" in window) {
  requestIdleCallback(() => getIpCountryToLimit(), { timeout: 3000 });
} else {
  document.addEventListener("DOMContentLoaded", () => getIpCountryToLimit());
}
