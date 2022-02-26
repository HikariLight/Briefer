
const unwantedTags = ['head', 'script', 'style', 'symbol', 'path', 'footer', 'nav', 'iframe', 'link'];
const unwantedAttributes = ['click', 'atm', 'banner', 'breadcrumbs', 'btn', 'button', 'card', 'comment', 'community', 'cookie', 'copyright', 'extension', 'extra', 'footer', 'footnote', 'head', 'hidden', 'langs', 'menu', 'nav', 'notification', 'popup', 'replies', 'rss', 'inline', 'sidebar', 'share', 'social', 'sponsor', 'supplemental', 'widget'];
const wantedAttributes = ['article', 'body', 'column', 'content', 'main', 'shadow', 'image', 'img', 'wrappe'];
const unwantedSocialMedias = ['facebook', 'instagram', 'telegram', 'vk', 'whatsapp', 'twitter', 'pinterest', 'linkedin', 'gmail', 'viadeo', 'mailto', 'social'];
const tagToReplace = ['strong', 'em', 'i', 'a', 'span'];

//
//  PRE-PROCESSING
//

function preProcess(doc) {
    // Pre-Processing the DOM by removing useless contents
    if(Object.keys(doc).length === 0 && doc.constructor === Object){
        throw 'Simplifier Error :\npreProcess() error. Empty input.';
    }

    if(typeof(doc) != 'object'){
        throw 'Simplifier Error :\npreProcess() error. Wrong input type.\nInput type given : ' + typeof(doc);
    }
    
    let node = doc.getElementsByTagName('*');
    for (let i = node.length - 1 ; i >= 0 ; i--) {
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
        if (((new RegExp(unwantedAttributes.join('|'))).test(node[i].className) &&
            !(new RegExp(wantedAttributes.join('|'))).test(node[i].className)) ||
            ((new RegExp(unwantedSocialMedias.join('|'))).test(node[i].className))) {
            node[i].parentNode.removeChild(node[i]);
            continue;
        }

        // replace tag inside a tag paragraph (em, strong, i, a)
        if ((new RegExp(tagToReplace.join('|'))).test(node[i].localName) &&
            node[i].childElementCount === 0 ) {
                if (node[i].localName !== 'img') {
                    if (node[i].parentNode.localName === 'p') {
                        node[i].replaceWith(node[i].textContent);
                    } else {
                        let p = document.createElement('p');
                        p.innerHTML = node[i].textContent;
                        node[i].parentNode.replaceChild(p, node[i]);
                    }
                } 
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

function grabArticle(doc) {
    // Extract each node that has a score above the threshold
    let list = [];
    
    list = getTextNode(doc, list);
    console.log('TEXT NODE : ', list);

    list = scoreNodes(list);
    console.log('SCORE NODE : ', list);
    
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
    console.log('RESULTAT : ', res);
    return res;
}

//
//  DATA FORMATTING
//

function generateDictionnary (list) {
    if(typeof(list) != 'object'){
        throw 'Simplifier Error :\ngenerateDictionnary() error. Wrong input type.\nInput type given : ' + typeof(list);
    }

    if (list === null || list.length === 0) {
        throw 'Simplifier Error :\ngenerateDictionnary() error. Empty input.';
    }
    

    let dict = {};
    let res = [];

    for(let i = 0; i < list.length; i++) {
        let tag = list[i].localName;
        let content = list[i].textContent;

        // if title 
        if (tag[0] === 'h') {
            if (Object.keys(dict).length !== 0) {
                res.push(dict);
            }
            dict = {};
        }

        // To integrate the position of the images between two paragraphs
        if (dict.hasOwnProperty(tag) && Object.keys(dict)[Object.keys(dict).length-2] === tag) {
            res.push(dict);
            dict = {};
        }

        // if images
        if (tag === 'img') {
            let imgAttributes = list[i].attributes;

            // src attributes
            let imgSrc = '';
            if ('src' in imgAttributes && imgSrc === '') {
                imgSrc = imgAttributes.src.value;
            } else if ('srcset' in imgAttributes && imgSrc === '') {
                imgSrc = imgAttributes.srcset.value;
            } else {
                alert('Images not supported');
            }
                    
            // alt attributes
            let imgAlt = '';
            if ('alt' in imgAttributes) { 
                imgAlt = imgAttributes.alt.value;
            }

            // support two consecutive images
            if (dict.hasOwnProperty(tag)) {
                dict[tag].push(imgSrc);
                dict[tag].push(imgAlt);
            } else {
                dict[tag] = [imgSrc];
                dict[tag].push(imgAlt);
            }
            
        } else {
            // other elements
            if (dict.hasOwnProperty(tag)) {
                dict[tag].push(content);
            } else {
                dict[tag] = [content];
            }
        }
    }

    res.push(dict);

    return res;
}

//
//  MAIN FUNCTION
// 

export function simplify(html) {
    let dict = {};

    try {
        if(html == null || html.length == 0 ){
            throw 'Simplifier Error :\nsimplify() error. Empty Input.';
        }
    
        if(typeof(html) != 'string'){
            throw 'Simplifier Error :\nsimplify() error. Wrong input type.\nInput type given : ' + typeof(html);
        } 

        // convert string into DOM Element
        const parser = new DOMParser();
        let doc = parser.parseFromString(html, 'text/html');

        // Pre-processing
        preProcess(doc);
        console.log('[DOC] : ',doc);

        // Classification
        let list = grabArticle(doc);

        // Data formatting
        dict = generateDictionnary(list);
        console.log('[DICT] : ', dict);
    } catch (err) {
        console.log(err);
    }

    return dict;
}