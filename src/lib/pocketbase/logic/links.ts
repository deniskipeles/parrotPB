import { groupByKey, serializeNonPOJOs } from '$lib/utils';
import { pb } from '../pb';

export const create_links = async (data: any) => {
  // example create data
  //   const data = {
  //     href: 'test',
  //     label: 'test',
  //     keywords: 'test',
  //     parent_link: 'RELATION_RECORD_ID'
  //   };
  try {
    let record = await pb.collection('frontend_links_lists').create(data);
    record = serializeNonPOJOs(record);
    return { record };
  } catch (error) {
    return { error: serializeNonPOJOs(error) };
  }
};

export const fetchLinks = async () => {
  try {
    // you can also fetch all records at once via getFullList
    let records = await pb.collection('view_links').getFullList({
      sort: '-created'
    });
    records = serializeNonPOJOs(records);
    return groupByKey(records, 'link');
  } catch (error) {
    return {error: serializeNonPOJOs(error)};
  }
};
