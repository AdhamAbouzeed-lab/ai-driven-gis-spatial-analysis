export function createJob(type, execute) {
  const job = {
    id: crypto.randomUUID(),
    type,
    status: "queued",
    progress: 0,
    createdAt: new Date().toISOString()
  };
  const listeners = new Set();
  const api = {
    ...job,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    emit(next) {
      Object.assign(job, next);
      listeners.forEach(listener => listener({ ...job }));
    },
    async run() {
      try {
        api.emit({ status: "running", progress: 10 });
        const result = await execute(progress => api.emit({ progress }));
        api.emit({ status: "completed", progress: 100, result });
        return result;
      } catch (error) {
        api.emit({
          status: "failed",
          progress: 100,
          error: error instanceof Error ? error.message : String(error)
        });
        throw error;
      }
    }
  };
  return api;
}
