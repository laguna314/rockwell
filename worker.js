export default {
  async fetch(request, env, ctx) {
    // If you later add routes/APIs, handle them here, otherwise let assets take over.
    return env.ASSETS.fetch(request);
  }
}
