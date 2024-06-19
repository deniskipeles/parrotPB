/** @type {import('./$types').LayoutLoad} */

export async function load({
  parent
}) {
  const dt = await parent(); 
  return {
    ...dt
  };
}