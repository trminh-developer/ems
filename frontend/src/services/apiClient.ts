import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("hc_access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function onRefreshed(token: string) {
  refreshSubscribers.map((cb) => cb(token));
  refreshSubscribers = [];
}

function addRefreshSubscriber(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

const toCamelCase = (str: string) => {
  return str.replace(/([-_][a-z])/gi, ($1) => {
    return $1.toUpperCase().replace("-", "").replace("_", "");
  });
};

const camelizeKeys = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map((v) => camelizeKeys(v));
  } else if (obj !== null && obj.constructor === Object) {
    const result = Object.keys(obj).reduce((acc, key) => {
      acc[toCamelCase(key)] = camelizeKeys(obj[key]);
      return acc;
    }, {} as any);

    // Auto-reconstruct location object for User models from flattened DB columns
    // We check if the object has an id, which implies it's a User model (or similar),
    // and if so, we enforce the creation of the location object.
    if (
      "id" in result &&
      ("city" in result || "country" in result || "firstName" in result)
    ) {
      if (!result.location || typeof result.location !== "object") {
        result.location = {
          city: result.city || "",
          country: result.country || "",
          latitude: result.latitude || null,
          longitude: result.longitude || null,
        };
      } else {
        // If location exists but is missing city/country, fill them in
        result.location.city = result.location.city || result.city || "";
        result.location.country =
          result.location.country || result.country || "";
        result.location.latitude =
          result.location.latitude || result.latitude || null;
        result.location.longitude =
          result.location.longitude || result.longitude || null;
      }
    }

    // Parse photos if it comes back as a JSON string
    if (typeof result.photos === "string") {
      try {
        result.photos = JSON.parse(result.photos);
      } catch (e) {
        result.photos = [];
      }
    }

    return result;
  }
  return obj;
};

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Convert snake_case from backend to camelCase for frontend
    if (response.data) {
      response.data = camelizeKeys(response.data);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Bỏ qua lỗi 401 cho các route login và refresh để component tự xử lý hiển thị lỗi
    if (
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/refresh")
    ) {
      return Promise.reject(error);
    }

    // Nếu lỗi 401 và chưa thử lại
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve) => {
          addRefreshSubscriber((token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(apiClient(originalRequest));
          });
        });
      }

      isRefreshing = true;
      const refreshToken = localStorage.getItem("hc_refresh_token");

      if (refreshToken) {
        try {
          const res = await axios.post(
            "http://localhost:3000/api/auth/refresh",
            { token: refreshToken },
          );
          const newAccessToken = res.data.accessToken;
          localStorage.setItem("hc_access_token", newAccessToken);
          localStorage.setItem("hc_refresh_token", res.data.refreshToken);

          isRefreshing = false;
          onRefreshed(newAccessToken);

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;
          localStorage.removeItem("hc_access_token");
          localStorage.removeItem("hc_refresh_token");
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
