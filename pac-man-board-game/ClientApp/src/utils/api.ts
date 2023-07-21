export const getData: Api = async (path, {headers} = {}) => {
  if (import.meta.env.MODE === "test") return Promise.resolve(new Response(JSON.stringify([])));
  return await fetch(import.meta.env.VITE_API_HTTP + path, {
    method: "GET",
    headers: headers
  });
}

export const postData: Api = async (path, {body, headers} = {}) => {
  return await fetch(import.meta.env.VITE_API_HTTP + path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(body),
  })
}
