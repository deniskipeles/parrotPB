import { error } from "@sveltejs/kit";

/** @type {import('./$types').LayoutServerLoad} */
export const load = async ({ locals }) => {
  try {
    const { pb, ...rest } = locals;

    return {
      ...rest
    };
  } catch (err) {
    error(404, { message: `${err}` });
  }
};
