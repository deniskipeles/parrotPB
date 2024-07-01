import { serializeNonPOJOs } from '$lib/utils';
import { pb } from '../pb';


export const createArticles = async (data: any) => {
  try {
    let record = await pb.collection('articles').create(data);
    record = serializeNonPOJOs(record);
    return { record };
  } catch (error) {
    console.log(error)
    return { error: serializeNonPOJOs(error) };
  }
};

export const fetchArticles = async () => {
  try {
    // you can also fetch all records at once via getFullList
    let records = await pb.collection('articles').getList(1, 50, {
      sort: '-created'
    });
    records = serializeNonPOJOs(records);
    return records;
  } catch (error) {
    return {error: serializeNonPOJOs(error)};
  }
};
