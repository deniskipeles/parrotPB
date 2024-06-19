import { pb } from '$lib/pocketbase';
import { marked } from 'marked';

export function getLabelById(items=[], id="") {
  for (const item of items) {
    if (item.id === id) {
      return item.label;
    }
    if (item.expand) {
      for (const key in item.expand) {
        const nestedItems = item.expand[key];
        const label = getLabelById(nestedItems, id);
        if (label) {
          return label;
        }
      }
    }
  }
  return null;
}

export function getYouTubeId(url='') {
    const regex = /https:\/\/(m\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[2] : null;
}
  
export const serializeNonPOJOs = (obj: any) => {
  return JSON.parse(JSON.stringify(obj));
};

export function getRelatedCollections(collection, collections) {
  const relatedCollections = [];

  for (const otherCollection of collections) {
    if (otherCollection.id === collection.id) {
      continue; // Skip the collection itself
    }

    const relationFields = otherCollection.schema.filter(field => field.type === 'relation');

    for (const field of relationFields) {
      if (field.options.collectionId === collection.id) {
        relatedCollections.push(`${otherCollection.name}_via_${field.name}`);
      }
    }
  }

  return relatedCollections;
}

export const getPbImageUrl = (doc: any, img: string | null, dim: string | undefined) => {
  const logo = (img ? pb.files.getUrl(doc, img, { thumb: dim ?? '100x100' }) : null) ?? null;
  return logo;
};

export function groupByKey(inputJSON: any[], key: string) {
  const groupedJSON: any = {};

  // Iterate through the items in the input JSON
  inputJSON.forEach((item: any) => {
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
  const hostname = 'http://localhost:3000';
  try {
    const search = new URL(url).search;
    const pathname = new URL(url).pathname;
    const params = new URLSearchParams(search);
    params.set(key, value);
    const new_params = params.toString();
    const newUrl = pathname + '?' + new_params;
    return newUrl;
  } catch (error) {
    url = hostname + url;
    const search = new URL(url).search;
    const pathname = new URL(url).pathname;
    const params = new URLSearchParams(search);
    params.set(key, value);
    const new_params = params.toString();
    const newUrl = pathname + '?' + new_params;
    return newUrl;
  }
}

export function blogDateFormatter(date: string): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  };
  const d: Date = new Date(date);
  return d.toLocaleTimeString('en-US', options);
}

export function mdToText(md: string) {
  // function htmlEscapeToText(markdown: string) {
  //   markdown.replace(/&#[0-9]*;|&amp;/g, (escapeCode) => {
  //     if (escapeCode.match(/amp/)) {
  //       return '&';
  //     }
  //     return String.fromCharCode(escapeCode.match(/[0-9]+/));
  //   });
  // }
  function render_plain() {
    const render = new marked.Renderer();
    render.link = function (href, title, text) {
      return text;
    };
    render.table = function (header, body) {
      return `[TABLE [HEADER: ${header} | BODY: ${body}]]`;
    };
    render.tablerow = function (content) {
      return content;
    };
    render.tablecell = function (content, flags) {
      return content;
    };
    render.html = function (text) {
      return text;
    };
    render.paragraph = (text) => {
      return `\r\n ${text} \r\n`;
    };
    render.heading = (text, level) => {
      return `\r\n ${text} \r\n`;
    };
    render.image = (href, title, text) => {
      return '';
    };
    render.list = (text, ordered, start) => {
      return `\r\n ${text} \r\n`;
    };
    render.listitem = (text, task, checked) => {
      return `\r\n ${text} \r\n`;
    };
    render.code = (code, language, isEscaped) => {
      return code;
    };
    render.strong = (text) => {
      return text;
    };
    return render;
  }
  return marked(md, { renderer: render_plain() });
}


export function getSubText(words=50,text=''){
  const arr = mdToText(text).split(' ')
  let index = 0
  const w = []
  while (index < words ) {
    w.push(arr[index] ?? '')
    index += 1
  }
  return w.join(' ')+`${arr.length > w.length ? '...' : ''}`
}

export function setObjectFormData(obj: Record<string, any>): FormData {
  const formData = new FormData();

  for (const [key, value] of Object.entries(obj)) {
    formData.append(key, value);
  }

  return formData;
}

