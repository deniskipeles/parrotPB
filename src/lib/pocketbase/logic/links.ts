import { groupByKey, serializeNonPOJOs } from '$lib/utils';
import { pb } from '../pb';

export const create_links = async (data: any) => {
  let table = data.get('table') as string;
  try {
    let record = await pb.collection(table).create(data);
    record = serializeNonPOJOs(record);
    return { record };
  } catch (error) {
    return { error: serializeNonPOJOs(error) };
  }
};

export const create_sub_links = async (data: any) => {
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
    // fetch all records at once via getFullList
    let records = await pb.collection('main_menu').getFullList({
      		sort: '-created',
		      expand: 'sub_menu_via_main_menu_id.sub_menu_list_via_sub_menu_id' //+relatedCollections?.join(','),
    });
    records = serializeNonPOJOs(records);
    return records;
  } catch (error) {
    return { error: serializeNonPOJOs(error) };
  }
};
