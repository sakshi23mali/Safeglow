export const BASE_URL = "http://10.105.254.200:4000";

// ----------- generic request helper (no token here) -------------
async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;

  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  const fetchOptions = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
  };

  try {
    const res = await fetch(url, fetchOptions);
    const text = await res.text();
    let data = null;

    if (text) {
      data = JSON.parse(text);
    }

    if (!res.ok) {
      const msg = (data && (data.error || data.message)) || "request failed";
      throw new Error(msg);
    }

    return data;
  } catch (err) {
    console.log("request error:", err.message);
    throw err;
  }
}

// ---------- auth APIs ----------------
export const authApi = {
  register: (payload) =>
    request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  login: (payload) =>
    request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};

// ---------- product APIs -------------
export const productApi = {
  recommend: (skinType) =>
    request(
      `/api/products/recommend?skinType=${encodeURIComponent(skinType)}`
    ),
};