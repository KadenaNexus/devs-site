import axios from 'axios'

export const strapi = axios.create({
  baseURL: import.meta.env.VITE_STRAPI_URL,
})

export async function getHomePage() {
  const { data } = await strapi.get('/api/homepage', {
    params: {
      populate: {
        Hero: {
          populate: {
            image: true,
          },
        },
        statitems: '*',
        solve_section: {
          populate: {
            items: '*',
          },
        },
        why_challenges_items: '*',
      },
    },
  })

  return data.data
}
