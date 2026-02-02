import axios from 'axios'

export const strapi = axios.create({
  baseURL: import.meta.env.VITE_STRAPI_URL,
})

export async function getHomePage() {
  const { data } = await strapi.get('/homepage?populate=*')

  return data.data
}
