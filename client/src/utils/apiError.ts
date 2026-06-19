export const getApiError = (err: unknown, fallback = 'Something went wrong'): string => {
  if (typeof err === 'object' && err !== null) {
    const axiosErr = err as {
      response?: { data?: { message?: string }; status?: number };
      code?: string;
      message?: string;
    };

    if (!axiosErr.response) {
      if (axiosErr.code === 'ERR_NETWORK' || axiosErr.message?.includes('Network')) {
        return 'Backend server is not running! Open terminal and run: npm run dev';
      }
      return 'Cannot connect to server. Run npm run dev in project folder.';
    }

    if (axiosErr.response.status === 503) {
      return axiosErr.response.data?.message || 'Database is starting — please wait 1–2 minutes and refresh.';
    }

    if (axiosErr.response.status === 401) {
      return axiosErr.response.data?.message || 'Invalid email or password';
    }

    return axiosErr.response.data?.message || fallback;
  }
  return fallback;
};
