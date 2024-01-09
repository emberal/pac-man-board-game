/**
 * getData is an asynchronous function that makes an API request to retrieve data.
 * If the mode is test, it returns a promise that resolves to an empty array.
 *
 * @param path - The path of the API endpoint.
 * @param headers - The headers to be included in the request.
 * @returns - A promise that resolves to the response from the API.
 */
export const getData: Api = async (path, { headers } = {}) => {
  if (import.meta.env.MODE === "test") return Promise.resolve(new Response(JSON.stringify([])))
  return await fetch(import.meta.env.VITE_API_HTTP + path, {
    method: "GET",
    headers: headers,
  })
}

/**
 * Makes a POST request to the API endpoint.
 *
 * @param path - The path of the endpoint.
 * @param body - The payload of the request.
 * @param headers - Additional headers for the request.
 * @returns - A Promise that resolves to the Response object representing the server's response.
 */
export const postData: Api = async (path, { body, headers } = {}) => {
  return await fetch(import.meta.env.VITE_API_HTTP + path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(body),
  })
}
