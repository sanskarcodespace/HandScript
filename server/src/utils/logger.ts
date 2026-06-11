/**
 * Utility: Winston logger configuration
 */
export const logger = {
  info: (msg: string) => console.log(msg),
  error: (msg: string) => console.error(msg),
  // TODO: Integrate winston fully
};
