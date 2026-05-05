const BASE_URL = "http://localhost:3001";

export async function Log(stack, level, pkg, message) {
  try {
    await fetch(`${BASE_URL}/log-proxy`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        stack,
        level,
        package: pkg,
        message,
      }),
    });
  } catch (e) {}
}