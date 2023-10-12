import { pb } from '$lib/pocketbase';

export const serializeNonPOJOs = (obj: any) => {
	return JSON.parse(JSON.stringify(obj));
};

export const getPbImageUrl = (doc: any, img: string | null, dim: string | undefined) => {
	const logo = (img ? pb.files.getUrl(doc, img, { thumb: dim ?? '100x100' }) : null) ?? null;
	return logo;
};

export function groupByKey(inputJSON:any,key:string) {
    const groupedJSON:any = {};
  
    // Iterate through the items in the input JSON
    inputJSON.forEach((item:any) => {
      const link = item[key];
  
      // Check if the link value already exists as a property in the groupedJSON
      if (!groupedJSON.hasOwnProperty(link)) {
        // If it doesn't exist, create an array with the current item
        groupedJSON[link] = [item];
      } else {
        // If it exists, push the current item to the existing array
        groupedJSON[link].push(item);
      }
    });
  
    return groupedJSON;
  }
  

  export function setSearchParams(url: URL | string, key: string, value: string) {
    const hostname = "http://localhost:3000";
    try {
        const search = new URL(url).search;
        const pathname = new URL(url).pathname;
        const params = new URLSearchParams(search);
        params.set(key, value);
        const new_params = params.toString();
        const newUrl = pathname + "?" + new_params;
        return newUrl;
    } catch (error) {
        url = hostname + url;
        const search = new URL(url).search;
        const pathname = new URL(url).pathname;
        const params = new URLSearchParams(search);
        params.set(key, value);
        const new_params = params.toString();
        const newUrl = pathname + "?" + new_params;
        return newUrl;
    }
}



export function blogDateFormatter(date: string): string {
	const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
	const d: Date = new Date(date);
	return d.toLocaleDateString('en-US', options);
}

