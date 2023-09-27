import { currentUser } from '$lib/pocketbase';
import { serializeNonPOJOs } from '$lib/utils';
import { redirect } from '@sveltejs/kit'
import type { Actions } from './$types'

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals: { user } }) {
  if (user?.id) {
    throw redirect(301, '/')
  } else {
    return {  }
  }
}

export const actions: Actions = {
  default: async ({ locals: { pb }, request, url }) => {
    const formData = await request.formData();
    const auth_table = formData.get('auth_table') as string

    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string
    };
    

    try {
      const authData = await pb.collection(auth_table).authWithPassword(
        data.email,
        data.password,
      )
      currentUser.set(authData.record)
    } catch (e: any) {
      return { incorrect: true, error: serializeNonPOJOs(e) };
    }

    throw redirect(301, url.pathname)
  },
}