export const IsGradedForecast = (forecast?: number | null) => {
  const APPROVED: boolean = forecast === 1;
  const WARNINGS: boolean = forecast === 2;
  const UNNAPROVED: boolean = forecast === 3;
  const NOTFILLEDIN: boolean = forecast === null;

  return { APPROVED, WARNINGS, UNNAPROVED, NOTFILLEDIN };
};
