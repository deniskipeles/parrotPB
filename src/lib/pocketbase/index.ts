import { serializeNonPOJOs } from '$lib/utils';
import type { RecordModel } from 'pocketbase';
import { createArticles, fetchArticles } from './logic/articles';
import { create_links, fetchLinks, create_sub_links } from './logic/links';
import { pb, currentUser } from './pb';

export {
  pb,
  currentUser,
  create_links,
  fetchLinks,
  createArticles,
  fetchArticles,
  create_sub_links
};

export async function loadCompany() {
  let record: RecordModel;
  try {
    record = await pb.collection('root').getFirstListItem('', {
      // expand: 'relField1,relField2.subRelField',
      filter: `name = "${'company'}" || name = "${'app'}" || name = "${'blog'}"`
    });
    record = serializeNonPOJOs(record);
    return record;
  } catch (error) {
    record = { collectionId: '', collectionName: '', created: '', id: '', updated: '', expand: {} };
  }
  return record;
}
