import { error } from "@sveltejs/kit";

/** @type {import('./$types').LayoutLoad} */
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
