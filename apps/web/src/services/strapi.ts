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

export async function getHowItWorksPage() {
  const { data } = await strapi.get('/api/how-it-work', {
    params: {
      populate: {
        Hero: {
          populate: {
            image: true,
          },
        },
        statitems: '*',
        solve_progress: {
          populate: {
            solve_sub_steps:
            {
              populate:{
                solve_sub_progress_list: '*',
              }
            },
          },
        },
        challenges_matters: {
          populate: {
            solve_sub_steps:
            {
              populate:{
                solve_sub_progress_list: '*',
              }
            },
          },
        },
        start_building: {
          populate: {
            image: true,
          },
        },
        need_more_info: {
          populate: {
            image: true,
          },
        },
      },
    },
  })

  return data.data
}

export async function getFAQPage() {
  const { data } = await strapi.get('/api/faq', {
    params: {
      populate: {
        hero: {
          populate: {
            image: true,
          },
        },
        getting_started: {
          populate: {
            items: '*',
          },
        },
        submission_process: {
          populate: {
            items: '*',
          },
        },
        judge_and_prizes: {
          populate: {
            items: '*',
          },
        },
        techincal_support: {
          populate: {
            items: '*',
          },
        },
        rules_and_policies: {
          populate: {
            items: '*',
          },
        },
        faq_contact: {
          populate: {
            image: true,
          },
        },
      },
    },
  })

  return data.data
}

export async function getTeamAndGovernancePage() {
  const { data } = await strapi.get('/api/team-and-governance', {
    params: {
      populate: {
        hero: {
          populate: {
            image: true,
          },
        },
        founder: {
          populate: {
            social_media: '*',
          },
        },
        core_team : {
          populate: {
            social_media: '*',
          },
        },
        join_our_team: {
          populate: {
            image: true,
          },
        },
      },
    },
  })

  return data.data
}