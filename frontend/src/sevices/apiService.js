const BASE_URL = "http://localhost:4000";

// REGISTER USER
export const registerUser = async (data) => {
  try {
    const res = await fetch(`${BASE_URL}/user/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data),
      credentials: "include"
    });

    const json = await res.json();
    return { success: res.ok, ...json };
  } catch (err) {
    return { success: false, message: "Network error: " + err.message };
  }
};


// LOGIN USER
export const loginUser = async (data) => {
  try {
    const res = await fetch(`${BASE_URL}/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data),
      credentials: "include"
    });

    const json = await res.json();
    return { success: res.ok, ...json };
  } catch (err) {
    return { success: false, message: "Network error: " + err.message };
  }
};

// LOGOUT USER
export const logout = async () => {
  try {
    const res = await fetch(`${BASE_URL}/user/logout`, {
      method: "POST",
      credentials: "include"
    });
    const json = await res.json();
    return { success: res.ok, ...json };
  } catch (err) {
    return { success: false, message: "Network error: " + err.message };
  }
};

// CREATE ORDER (Checkout)
export const createOrder = async (orderData) => {
  try {
    const res = await fetch(`${BASE_URL}/order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(orderData),
      credentials: "include"
    });
    const json = await res.json();
    return { success: res.ok, ...json };
  } catch (err) {
    return { success: false, message: "Network error: " + err.message };
  }
};
