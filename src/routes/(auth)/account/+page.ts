
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export const load = async ({ parent }) => {
  try {
    const { ...rest } = await parent();

    return {
      ...rest
    };
  } catch (err) {
    error(404, { message: `${err}` });
  }
};
