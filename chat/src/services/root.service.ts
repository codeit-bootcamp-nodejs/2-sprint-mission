export async function getHealthCheck() {
  return { status: 'ok', service: 'chat' };
}
