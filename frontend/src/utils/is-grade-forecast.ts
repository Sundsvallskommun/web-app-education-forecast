export const IsGradedForecast = (forecast, type) => {
  let APPROVED: boolean, WARNINGS: boolean, UNNAPROVED: boolean, NOTFILLEDIN;

  if (type === Array) {
    APPROVED = forecast.find((x) => x.forecast === 1);
    WARNINGS = forecast.find((x) => x.forecast === 2);
    UNNAPROVED = forecast.find((x) => x.forecast === 3);
    NOTFILLEDIN = forecast.find((x) => x.forecast === null);
  } else if (type === Number) {
    APPROVED = forecast === 1;
    WARNINGS = forecast === 2;
    UNNAPROVED = forecast === 3;
    NOTFILLEDIN = forecast === null;
  }

  return { APPROVED, WARNINGS, UNNAPROVED, NOTFILLEDIN };
};
