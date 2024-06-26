import {
  marked
} from 'marked';
/*
import katex from 'https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/katex.mjs';
import hljs from "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"
*/
import katex from "katex";
import hljs from "highlight.js"


export const tailwindObj =  {
    h1: "h1 text-3xl mb-4",
    h2: "h2 text-2xl mb-4",
    h3: "h3 text-xl mb-4",
    h4: "h4 text-lg mb-4",
    h5: "h5 text-base mb-4",
    h6: "h6 text-sm mb-4",
    p: "p mb-4",
    a: "a anchor text-blue-500 underline hover:no-underline",
    //ul: "list list-disc",
    //ol: "list list-decimal",
    //li: "text-xs",
    blockquote: "blockquote italic border-l-4 border-gray-300 pl-4 mb-4",
    pre: "pre",
    codespan: "code",
    img: "img w-auto mb-4",
    divTable: "table-container",
    table: "table table-hover",
    th: "th font-bold bg-gray-100 px-4 py-2",
    td: "td px-4 py-2",
    strong: "strong font-bold",
    em: "em italic",
    hr: "hr border-gray-300 mb-4",
    //button: "button bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700",
    input: "input border border-gray-300 rounded py-2 px-4 w-full",
    textarea: "textarea border border-gray-300 rounded py-2 px-4 w-full",
    select: "select border border-gray-300 rounded py-2 px-4 w-full",
    label: "label font-bold mb-2",
    form: "form",
    fieldset: "fieldset border border-gray-300 rounded px-4 py-2 mb-4",
    legend: "legend font-bold mb-2",
    iframe: "iframe w-full h-auto mb-4",
    figure: "figure mb-4",
    figcaption: "figcaption italic mb-4",
    cite: "cite italic",
    q: "q italic",
    sup: "sup text-xs font-normal",
    sub: "sub text-xs font-normal",
    small: "small text-xs font-normal",
    mark: "mark bg-yellow-200 px-1 rounded",
    del: "del line-through text-gray-500",
    ins: "ins underline ",
    time: "time ",
    abbr: "abbr border-b border-dotted ",
    acronym: "acronym border-b border-dotted ",
    address: "address ",
    caption: "caption font-bold mb-2",
    //code: "code bg-gray-100 px-1 rounded",
    dd: "dd mb-2",
    dt: "dt font-bold mb-2",
    kbd: "kbd bg-gray-100 px-1 rounded",
    samp: "samp bg-gray-100 px-1 rounded",
    var: "var italic",
    // Add more elements and their corresponding Tailwind classes here
  };

function generateTailwindObj(tailwindClasses) {
  const tailwindobj = {};

  for (const [key, value] of Object.entries(tailwindClasses)) {
    let classes = {};
    if (typeof value === 'string') {
      classes = value.split(' ').filter(className => className.trim() !== '').reduce((acc, className) => {
        acc[className] = true;
        return acc;
      }, {});
    } else if (typeof value === 'object') {
      for (const className in value) {
        if (value[className]) {
          classes[className] = true;
        }
      }
    }
    tailwindobj[key] = classes;
  }
  return tailwindobj;
}

/*
Block-level renderer methods
code(string code, string infostring, boolean escaped)
blockquote(string quote)
html(string html, boolean block)
heading(string text, number level, string raw)
hr()
list(string body, boolean ordered, number start)
listitem(string text, boolean task, boolean checked)
checkbox(boolean checked)
paragraph(string text)
table(string header, string body)
tablerow(string content)
tablecell(string content, object flags)

///Inline-level renderer methods
strong(string text)
em(string text)
codespan(string code)
br()
del(string text)
link(string href, string title, string text)
image(string href, string title, string text)
text(string text)
*/


export const markedFxn = (tailwindClasses = tailwindObj)=> {
  // Example usage:
  const tailwindobj = generateTailwindObj(tailwindClasses);

  const renderer = new marked.Renderer();

  // Override renderer methods for HTML elements with Tailwind CSS classes
  function addClassAndSpanUl(listString) {
      //let modifiedString = listString.replace(/<li>/g, '<p class="new-class ul"><span>• </span>').replace(/<\/li>/g, '</p>');
      let orderedListRegex = /<li>([\s\S]*?)<\/li>/g;
      let index = 1;
      let modifiedString = listString.replace(orderedListRegex, function(match) {
          let listItem = match.substring(4, match.length - 5).trim();
          let newListItem = `<p class="new-class li"><span>• </span>${listItem}</p>`;
          index++;
          return newListItem;
      });
      return modifiedString;
  }
  
  function addClassAndSpanOl(listString) {
      let orderedListRegex = /<li>([\s\S]*?)<\/li>/g;
      let index = 1;
      let modifiedString = listString.replace(orderedListRegex, function(match) {
          let listItem = match.substring(4, match.length - 5).trim();
          let newListItem = `<p class="new-class li"><span>${index}. </span>${listItem}</p>`;
          index++;
          return newListItem;
      });
      return modifiedString;
  }
  	
	renderer.list = function(body, ordered, start){
    if(ordered){
			body = addClassAndSpanOl(body)
      return `
			  <div style="padding-left: 20px;">
          ${body}
				</div>
      `;
    }else{
      body = addClassAndSpanUl(body)
      return `
			  <div style="padding-left: 20px;">
        	${body}
				</div>
      `;
    }
  }

	renderer.listitem = function(text, task, checked){
		if (task) {
			text = text.replace(`type="checkbox"`,"hidden")
			
			if (checked) {
				return `<li>✔️ ${text}</li>`
			} else {
				return `<li>❌ ${text}</li>`
			}
		} else {
			return `<li>${text}</li>`
		}
	}

  // Headings
  renderer.heading = (text, level) => {
    const selector = `h${level}`;
    const classes = tailwindobj[selector] ?? {};
    const classList = Object.keys(classes)
    .filter((className) => classes[className])
    .join(' ');
    return `<h${level} class="${classList}">${text}</h${level}>`;
  };

  // Paragraph
  renderer.paragraph = (text) => {
    const selector = 'p';
    const classes = tailwindobj[selector] ?? {};
    const classList = Object.keys(classes)
    .filter((className) => classes[className])
    .join(' ');
    return `<p class="${classList}">${text}</p>`;
  };

  // Link
  renderer.link = (href, title, text) => {
    const selector = 'a';
    const classes = tailwindobj[selector] ?? {};
    const classList = Object.keys(classes)
    .filter((className) => classes[className])
    .join(' ');
    return `<a href="${href}" title="${title}" class="${classList}">${text}</a>`;
  };

  // Blockquote
  renderer.blockquote = (quote) => {
    const selector = 'blockquote';
    const classes = tailwindobj[selector] ?? {};
    const classList = Object.keys(classes)
    .filter((className) => classes[className])
    .join(' ');
    return `<blockquote class="${classList}">${quote}</blockquote>`;
  };

  // Preformatted text
  renderer.codespan = (code) => {
    const selector = 'codespan';
    const classes = tailwindobj[selector] ?? {};
    const classList = Object.keys(classes)
    .filter((className) => classes[className])
    .join(' ');
    return `<code class="${classList}">${code}</code>`;
  };

  renderer.code = function (code, language) {
    if (code.match(/^sequenceDiagram/) || code.match(/^graph/) || language == 'mermaid') {
      return '<div class="codeblock overflow-x-auto shadow"><pre class="mermaid">' + code + '</pre></div><hr/>';
    } else {
			try {
				code=hljs.highlight(code,{ language: language }).value
			} catch (error) {
				code=hljs.highlight(code,{ language: "Javascript" }).value
			}
			//console.log(code)
			return `
      <!-- prettier-ignore -->
      <div class="codeblock overflow-hidden shadow bg-neutral-900/90 text-sm text-white rounded-container-token" data-testid="codeblock">
      <!-- Header -->
      <header class="codeblock-header text-xs text-white/50 uppercase flex justify-between items-center p-2 pl-4">
      <!-- Language -->
      <span class="codeblock-language">${language}</span>
      <!-- Copy Button -->
      <button type="button" class="codeblock-btn btn btn-sm variant-soft !text-white">
      Copy
      </button>
      </header>
      <!-- Pre/Code -->
      <pre class="codeblock-pre whitespace-pre-wrap break-all p-4 pt-1"><code class="codeblock-code language-${language} lineNumbers">${code}</code></pre>
      </div>
      `
    }
  };

  // Imageb
  renderer.image = (href, title, text) => {
    const selector = 'img';
    const classes = tailwindobj[selector] ?? {};
    const classList = Object.keys(classes)
    .filter((className) => classes[className])
    .join(' ');
    return `<img src="${href}" alt="${text}" title="${title}" class="${classList}" />`;
  };

  // Table
  renderer.table = (header, body) => {
    const selector = 'table';
    const classes = tailwindobj[selector] ?? {};
    const classList = Object.keys(classes)
    .filter((className) => classes[className])
    .join(' ');
    const selectorDiv = 'divTable';
    const classesDiv = tailwindobj[selectorDiv] ?? {};
    const classListDiv = Object.keys(classesDiv)
    .filter((className) => classesDiv[className])
    .join(' ');
    return `<div class="${classListDiv}"><table class="${classList}"><thead>${header}</thead><tbody>${body}</tbody></table></div>`;
  };

  // Table header cell
  /*renderer.th = (content, flags) => {
    const selector = 'th';
    const classes = tailwindobj[selector] ?? {};
    const classList = Object.keys(classes)
    .filter((className) => classes[className])
    .join(' ');
    return `<th class="${classList}">${content}</th>`;
  };

  // Table data cell
  renderer.td = (content, flags) => {
    const selector = 'td';
    const classes = tailwindobj[selector] ?? {};
    const classList = Object.keys(classes)
    .filter((className) => classes[className])
    .join(' ');
    return `<td class="${classList}">${content}</td>`;
  };*/

  // Strong text
  renderer.strong = (text) => {
    const selector = 'strong';
    const classes = tailwindobj[selector] ?? {};
    const classList = Object.keys(classes)
    .filter((className) => classes[className])
    .join(' ');
    return `<strong class="${classList}">${text}</strong>`;
  };

  // Emphasized text
  renderer.em = (text) => {
    const selector = 'em';
    const classes = tailwindobj[selector] ?? {};
    const classList = Object.keys(classes)
    .filter((className) => classes[className])
    .join(' ');
    return `<em class="${classList}">${text}</em>`;
  };

  // Horizontal rule
  renderer.hr = () => {
    const selector = 'hr';
    const classes = tailwindobj[selector] ?? {};
    const classList = Object.keys(classes)
    .filter((className) => classes[className])
    .join(' ');
    return `<hr class="${classList}" />`;
  };
  
  // Deleted text
  renderer.del = (text) => {
    const selector = 'del';
    const classes = tailwindobj[selector] ?? {};
    const classList = Object.keys(classes)
    .filter((className) => classes[className])
    .join(' ');
    return `<del class="${classList}">${text}</del>`;
  };
        
  // Override function
  const options = {
    throwOnError: false
  };

  /*const escapeMSC = (text) => {
    return text.replace(/[*_{}[\]()#+\-.!|]/g, '\\$&');
  };*/

  const latexMath = {
    name: 'latexMath',
    level: 'inline',
    start(src) {
      if (src.match(/\\\[/)) {
        return src.match(/\\\[/).index;
      } else if (src.match(/\\\(/)) {
        return src.match(/\\\(/).index;
      }
      return;
    },
    tokenizer(src, tokens) {
      const rule = /^(\\\(|\\\[)(.*?)(\\\)|\\\])/;
      const match = rule.exec(src);
      if (match) {
        return {
          type: 'latexMath',
          raw: match[0],
          text: match[2]
        };
      }
    },
    renderer(token) {
      let displayMode = false;
      if (token.raw.startsWith('\\[')) {
        displayMode = true;
      }
      return `<span class="latex-math">${katex.renderToString(token.text, { ...options, displayMode })}</span>`;
    }
  };


  const latexText = {
    name: 'latexText',
    level: 'inline',
    tokenizer(src, tokens) {
      const rule = /^(?:(?!\$|\\\(|\\\[|`|[*_~]|\[|\!\[).)+/;
      const match = rule.exec(src);
      if (match) {
        return {
          type: 'latexText',
          raw: match[0],
          text: match[0]
        };
      }
    },
    renderer(token) {
      return token.text;
    }
  };

  const latexBlockMath = {
  name: 'latexBlockMath',
  level: 'block',
  start(src) {
    if (src.match(/(?:\\\[|\\\(|\\$\\$)/)) {
      return src.match(/(?:\\\[|\\\(|\\$\\$)/).index;
    }
    return;
  },
  tokenizer(src, tokens) {
    const rule = /^(?:\\\[|\$\$)(.*?)(?:\\\]|\$\$)/s; // Use 's' flag for multi-line matching
    const match = rule.exec(src);
    if (match) {
      return {
        type: 'latexBlockMath',
        raw: match[0],
        text: match[1]
      };
    }
  },
  renderer(token) {
    return `<div class="latex-block-math">${katex.renderToString(token.text, { ...options, displayMode: true })}</div>`;
  }
};


  //marked.use({  });

  return marked.use({
		renderer,
		extensions: [latexText, latexMath, latexBlockMath]
  });
}

export function replaceMarkdownHeaders(str) {
    return str.replace(/#/g, '');
}
