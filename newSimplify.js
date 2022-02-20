
const unwantedTags = ['head', 'script', 'style', 'symbol', 'path', 'footer', 'nav', 'iframe', 'link'];
const unwantedAttributes = ['atm', 'banner', 'breadcrumbs', 'btn', 'button', 'card', 'comment', 'community', 'cookie', 'copyright', 'extension', 'extra', 'footer', 'footnote', 'head', 'hidden', 'langs', 'menu', 'nav', 'notification', 'popup', 'replies', 'rss', 'sidebar', 'sponsor', 'supplemental'];
const wantedAttributes = ['article', 'body', 'column', 'content', 'main', 'shadow', 'image', 'img', 'wrappe'];
const unwantedSocialMedias = ['facebook', 'instagram', 'telegram', 'vk', 'whatsapp', 'twitter', 'pinterest', 'linkedin', 'gmail', 'viadeo', 'mailto', 'social'];
const tagToReplace = ['strong', 'em', 'i', 'a', 'span'];

/*
 * Pre-Processing
 */

function preProcess(doc) {
    // remove comments
    var html = doc.getElementsByTagName('html')[0].innerHTML;
    html = html.replace(/<!--(.|\n)*-->/g, '');
    doc.getElementsByTagName('html')[0].innerHTML = html;
    
    var node = doc.getElementsByTagName('*');
    for (var i = node.length - 1 ; i >= 0 ; i--) {
        // remove empty node
        if (node[i].childNodes.length === 0 && node[i].localName !== 'img') {
            node[i].parentNode.removeChild(node[i]);
            continue;
        } 

        // remove unwanted tags
        if(unwantedTags.includes(node[i].localName)) {
            node[i].parentNode.removeChild(node[i]);
            continue;
        }
        
        // remove empty content
        if (node[i].textContent === '' || node[i].textContent === '\s' && node[i].localName !== 'img') {
            node[i].parentNode.removeChild(node[i]);
            continue;
        }

        // remove hidden node
        if (node[i].hidden === true) {
            node[i].parentNode.removeChild(node[i]);
            continue;
        }

        // remove unwanted class
        // This part seems to have problems for the selection of classes
        if (((new RegExp(unwantedAttributes.join('|'))).test(node[i].className) &&
            !(new RegExp(wantedAttributes.join('|'))).test(node[i].className)) ||
            ((new RegExp(unwantedSocialMedias.join('|'))).test(node[i].className))) {
            node[i].parentNode.removeChild(node[i]);
            continue;
        }

        // remove unwanted id
        /* if (((new RegExp(unwantedAttributes.join('|'))).test(node[i].id) &&
            !(new RegExp(wantedAttributes.join('|'))).test(node[i].id)) ||
            ((new RegExp(unwantedSocialMedias.join('|'))).test(node[i].id))) {
            node[i].parentNode.removeChild(node[i]);
            continue;
        } */

        // replace tag inside a paragraph
        if ((new RegExp(tagToReplace.join('|'))).test(node[i].localName) &&
            node[i].childElementCount === 0 ) {
                if (node[i].parentNode.localName === 'p') {
                    node[i].replaceWith(node[i].textContent);
                } else {
                    var p = document.createElement('p');
                    p.innerHTML = node[i].textContent;
                    node[i].parentNode.replaceChild(p, node[i]);
                }
                
        }
    }
}

/*
 * Classification
 */

function scoreCommas(str) {
    var pts = str.split(',').length - 1;
    return pts;
}

function scoreCharacters(str) {
    var pts = Math.floor((str.length / 50));
    return pts;
}


/*
 * Main Part
 */

function grabArticle(html) {
    // convert string into DOM Element
    const parser = new DOMParser();
    var doc = parser.parseFromString(html, 'text/html');
    console.log('html dom : ', doc);

    // Pre-processing
    preProcess(doc);

    /***
     * TESTING PART, IF IT'S WORK SHOULD INCLUDE IT INSIDE FUNCTION SEPARATLY
     */

    // Classification
    var list = [];
    var collection = doc.getElementsByTagName('*');
    console.log(collection);
    for (var j = 0; j < collection.length; j++) {

        // select every node that have text node
        if (collection[j].childElementCount === 0) {
            list.push(collection[j]);
        }
    }
    
    // score child
    console.log('list : ', list);
    for (var k = 0; k < list.length ; k++) {
        // calculate score
        var score = 0;
        if (list[k].localName[0] === 'h') { // if title tag, start score at 5
            score = 5;
        } else { // else score at 1
            score = 1;
        }
        score += scoreCommas(list[k].textContent);
        score += scoreCharacters(list[k].textContent);

        // modify list
        list[k] = [list[k], score];
    }

    return html;
}

export function simplify(html) {
    // call grabArticle here
    // implement generate dictionnary here
    // return dictionnary
    return grabArticle(html);
}
