import { currentUser } from '$lib/pocketbase'
import { redirect } from '@sveltejs/kit'
import type { Actions } from './$types'

export const actions: Actions = {
  default: async ({ locals,cookies }) => {
    cookies.delete('pb_auth1',{path:'/'})
    locals.pb.authStore.clear()
    locals.user = null
    currentUser.set(null)
    throw redirect(303, '/')
  },
}