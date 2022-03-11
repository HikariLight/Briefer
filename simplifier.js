
const unwantedTags = ['table', 'noscript', 'head', 'script', 'style', 'symbol', 'path', 'footer', 'nav', 'iframe', 'link'];
const unwantedAttributes = ['josh', 'connatix', 'read-more', 'related', 'see_also', 'note', 'metadata', 'indicator', 'source', 'ref', 'nowrap', 'navigation', 'search', 'reference', 'click', 'toc', 'atm', 'banner', 'breadcrumbs', 'btn', 'button', 'card', 'comment', 'community', 'cookie', 'copyright', 'extension', 'extra', 'footer', 'footnote', 'hidden', 'langs', 'menu', 'nav', 'notification', 'popup', 'replies', 'rss', 'inline', 'sidebar', 'share', 'social', 'sponsor', 'supplemental', 'widget'];
// remove : head
// add : note, see_also, related, connatix
const wantedAttributes = ['article', 'body', 'content', 'main', 'shadow', 'image', 'img'];
const unwantedSocialMedias = ['facebook', 'instagram', 'telegram', 'vk', 'whatsapp', 'twitter', 'pinterest', 'linkedin', 'gmail', 'viadeo', 'mailto', 'social'];

//
//  PRE-PROCESSING
//

function restructuringContent ( node ) {
    let text = node.textContent;
    
    while (node.lastElementChild) {
        node.removeChild(node.lastElementChild);
    }
    node.textContent = text;
}


function restructuringImages ( node ) {

    let imgList = node.getElementsByTagName('img');
    let altList = node.getElementsByClassName('thumbcaption');
    
    if ( altList.length === 0 ) {
        altList = node.getElementsByClassName('gallerytext');
    }

    let result = [];
    let size;

    if ( imgList.length !== altList.length ) {
        size = Math.min(imgList.length, altList.length);
    } else {
        size = imgList.length;
    }

    if ( size == 0 ) {
        return; 
    }

    for ( let i = 0; i < size; i++ ) {
        imgList[i].attributes.alt.value = altList[i].innerText;
        result.push(imgList[i]);
    }

    while ( node.firstChild ) {
        node.firstChild.remove();
    }

    result.forEach( childnode => {
        node.appendChild(childnode);
    });
}

function preProcess(doc) {
    // Pre-Processing the DOM by removing useless contents
    if(Object.keys(doc).length === 0 && doc.constructor === Object){
        throw {
            name : 'RangeError', message : '"doc" is empty', fileName : 'simplifier.js', functionName : 'preProcess()', lineNumber : 22
        }
    }

    if ( typeof(doc) != 'object' ) {
        throw {
            name : 'TypeError', message : '"doc" is ' + typeof(doc) +' instead of object', fileName : 'simplifier.js', functionName : 'preProcess()', lineNumber : 22
        }
    }
    
    let node = doc.getElementsByTagName('*');
    for (let i = node.length - 1 ; i >= 0 ; i--) {

        // restructure images without alt
        if ( node[i].className === 'thumbinner' || node[i].className === 'gallerybox' ) {
            restructuringImages(node[i]);
        }

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

        // remove hidden node
        if (node[i].hidden === true) {
            node[i].parentNode.removeChild(node[i]);
            continue;
        }

        // remove unwanted class
        if (((new RegExp(unwantedAttributes.join('|'), 'i')).test(node[i].className) &&
            !(new RegExp(wantedAttributes.join('|'), 'i')).test(node[i].className)) ||
            ((new RegExp(unwantedSocialMedias.join('|'), 'i')).test(node[i].className))) {
            node[i].parentNode.removeChild(node[i]);
            continue;
        }

        // remove unwanted id
        if ( ((new RegExp(unwantedAttributes.join('|'), 'i')).test(node[i].id) &&
            !(new RegExp(wantedAttributes.join('|'), 'i')).test(node[i].id)) ||
            ((new RegExp(unwantedSocialMedias.join('|'), 'i')).test(node[i].id)) ) {
            node[i].parentNode.removeChild(node[i]);
            continue;
        }

        // paragraph and title restructuration
        if ( ( (node[i].localName === 'p' || new RegExp('h[0-9]').test(node[i].localName)) 
            && node[i].children.length >= 1) ) {
            restructuringContent(node[i]);
            
        }
    }
}

//
//  CLASSIFICATION
//

function scoreCommas(str) {
    // Allow 1 point for each comma in the string
    let pts = str.split(',').length - 1;
    return pts;
}

function scoreCharacters(str) {
    // Allow 1 point for every 50 characters
    let cp = str;
    cp = cp.replace(/\s|\n/g, '');
    let pts = Math.floor((cp.length / 50));
    return pts;
}

function scoreImages(list, index, score) {
    // Select the image if it is between 2 important contents
    let firstCondition = false;
    let secondCondition = false;
    for (let i = 0; i < list.length; i++) {
        if (i < index && list[i][1] >= score) {
            firstCondition = true;
        }
        if (i > index && list[i][1] >= score) {
            secondCondition = true;
        }
    }

    if (firstCondition && secondCondition) {
        return true;
    }
    return false;
}

function getTextNode(doc, list) {
    // Extract all nodes that have no child element
    // [TODO] Improve by extracting every node that containt text element
    // Need to handle <div> <span>...</span> Text content </div>
    let collection = doc.getElementsByTagName('*');

    for (let j = 0; j < collection.length; j++) {

        if (collection[j].childElementCount === 0) {
            list.push(collection[j]);
        }
    }

    return list;
}

function scoreNodes(list) {
    // Allow a score for each extracted node
    // By default, each node starts with a score of 1
    // Except for titles which start directly at 5
    for (let k = 0; k < list.length ; k++) {
        let score = 0;
        if (list[k].localName[0] === 'h') {
            score = 5;
        } else {
            score = 1;
        }
        score += scoreCommas(list[k].textContent);
        score += scoreCharacters(list[k].textContent);

        list[k] = [list[k], score];
    }
    return list;
}

// post processing
function verification(list) {
    // remove useless title (at the end of document and any paragraph after)
    for (let i = list.length - 1; i >= 0; i--) {
        if (new RegExp('h[0-9]').test(list[i].localName)) {
            list.pop();
        } else {
            break;
        }
    }
    return list;
}

function grabArticle(doc) {
    // Extract each node that has a score above the threshold
    let list = [];
    
    list = getTextNode(doc, list);

    list = scoreNodes(list);
    
    let res = [];
    let threshold = 3;
    for (let l = 0; l < list.length; l++) {

        if (list[l][1] >= threshold) {
            res.push(list[l][0]);
        }

        if (list[l][0].localName === 'img') {
            if (scoreImages(list, l, threshold)) {
                res.push(list[l][0]);
            }
        }
    }

    // post-processing
    res = verification(res);

    return res;
}

//
//  DATA FORMATTING
//

function dataFormatting (list) {

    if ( typeof(list) != 'object' ) {

        throw 'Simplifier Error :\ndataFormatting() error. Wrong input type.\nInput type given : ' + typeof(list);
    
    } else if ( list === null || list.length === 0 ) {

        throw 'Simplifier Error :\ndataFormatting() error. Empty input.';
    }

    let result = [];
    let section = [];
    let tmp = [];

    for ( let i = 0; i < list.length; i++ ) {

        let tag = list[i].localName;
        let content = list[i].textContent;

        if ( i!= 0 && tag[0] === 'h' ) {
            result.push(section);
            section = [];
        }
        
        if ( tag === 'img' ) {

            let imgAttributes = list[i].attributes;

            let imgSrc = '';

            if ( 'src' in imgAttributes ) {

                imgSrc = imgAttributes.src.value;

            }

            let imgAlt = '';

            if ( 'alt' in imgAttributes ) {

                imgAlt = imgAttributes.alt.value;

            }

            if ( tmp.includes(tag) ) {

                tmp[1].push(imgSrc, imgAlt);

            } else {

                tmp.push(tag, [imgSrc, imgAlt]);

            }
            

        } else {

            if ( tmp.includes(tag) ) {

                tmp[1].push(content);

            } else {

                tmp.push(tag, [content]);

            }

        }

        if ( !(i+1 !== list.length && tag === list[i+1].localName) ) {

            section.push(tmp);
            tmp = [];

        }

    }

    result.push(section);

    return result;

}

//
//  MAIN FUNCTION
// 

export function simplify(html) {

    let output = [];

    try {

        if ( html == null || html.length == 0 ) {
            
            throw 'Simplifier Error :\nsimplify() error. Empty Input.';
        
        } else if ( typeof(html) != 'string' ) {
            
            throw 'Simplifier Error :\nsimplify() error. Wrong input type.\nInput type given : ' + typeof(html);
        
        } 

        // convert string into DOM Element
        const parser = new DOMParser();
        let doc = parser.parseFromString(html, 'text/html');

        // Pre-processing
        preProcess(doc);
        console.log('[pre-processing] : ',doc);

        // Classification
        let list = grabArticle(doc);
        console.log('[important content list] : ', list);

        // Data formatting
        output = dataFormatting(list);
        console.log('[output] : ', output);

    } catch (err) {

        console.log(err);

    }

    return output;
}