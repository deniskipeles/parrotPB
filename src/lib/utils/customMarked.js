import {
  marked
} from 'marked';
//import katex from 'https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/katex.mjs';

const tailwindObj = {
  'h1': {
    'text-red-500': true,
    'text-xl': true,
    // ...
  },
  'h2': {
    'text-blue-400': true,
    'text-lg': true,
    // ...
  },
  'p': {
    'text-gray-700': true,
    'leading-relaxed': true,
    // ...
  },

}

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
  renderer.list = function(body, ordered, start){
    if(ordered){
      return `
        <ol class="ordered">
          ${body}
        </ol>
      `;
    }else{
      return `
        <ul class="un-ordered">
        	${body}
        </ul>
      `;
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
      return '<pre class="mermaid">' + code + '</pre>';
    } else {
      return `
      <!-- prettier-ignore -->
      <div class="codeblock overflow-hidden shadow bg-neutral-900/90 text-sm text-white rounded-container-token shadow" data-testid="codeblock">
      <!-- Header -->
      <header class="codeblock-header text-xs text-white/50 uppercase flex justify-between items-center p-2 pl-4">
      <!-- Language -->
      <span class="codeblock-language">${language}</span>
      <!-- Copy Button -->
      <button type="button" class="codeblock-btn btn btn-sm variant-soft !text-white" on:click={onCopyClick} use:clipboard=${code}>
      Copy
      </button>
      </header>
      <!-- Pre/Code -->
      <pre class="codeblock-pre whitespace-pre-wrap break-all p-4 pt-1"><code class="codeblock-code language-${language} lineNumbers">${code}</code></pre>
      </div>
      `
    }
  };

  // Image
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
    const classesDiv = tailwindobj[selector] ?? {};
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
  const tokenizer = {
    codespan(src) {
      const match = src.match(/^\$+([^\$\n]+?)\$+/);
      if (match) {
        return {
          type: 'codespan',
          raw: match[0],
          //text: katex.renderToString(match[1].trim(), { throwOnError: false }),
          text: match[1].trim(),
        };
      }
      // return false to use original codespan tokenizer
      return false;
    }
  };

  return marked.use({
    //tokenizer, 
		renderer
  });

}

