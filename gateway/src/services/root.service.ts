export const getHealthCheck = async () => {
  return { status: 'ok', service: 'gateway' };
};
