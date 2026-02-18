export const getTransition = (
  showWelcome: boolean,
  postDelay: number,
  noDelay: number,
  postDuration = 0.5,
  noDuration = 0.3,
) => ({
  delay: showWelcome ? postDelay : noDelay,
  duration: showWelcome ? postDuration : noDuration,
});
