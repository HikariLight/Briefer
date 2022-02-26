
const unwantedTags = ['head', 'script', 'style', 'symbol', 'path', 'footer', 'nav', 'iframe', 'link'];
const unwantedAttributes = ['click', 'atm', 'banner', 'breadcrumbs', 'btn', 'button', 'card', 'comment', 'community', 'cookie', 'copyright', 'extension', 'extra', 'footer', 'footnote', 'head', 'hidden', 'langs', 'menu', 'nav', 'notification', 'popup', 'replies', 'rss', 'inline', 'sidebar', 'share', 'social', 'sponsor', 'supplemental', 'widget'];
const wantedAttributes = ['article', 'body', 'column', 'content', 'main', 'shadow', 'image', 'img', 'wrappe'];
const unwantedSocialMedias = ['facebook', 'instagram', 'telegram', 'vk', 'whatsapp', 'twitter', 'pinterest', 'linkedin', 'gmail', 'viadeo', 'mailto', 'social'];
const tagToReplace = ['strong', 'em', 'i', 'a', 'span'];

/*
 * Pre-Processing
 */

function preProcess(doc) {
    // remove comments
    // seems to not working !!
    /* var html = doc.getElementsByTagName('html')[0].innerHTML;
    html = html.replace(/<!--(.|\n)*-->/g, '');
    doc.getElementsByTagName('html')[0].innerHTML = html; */
    
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
        /* if ((node[i].textContent === '' || node[i].textContent === '\s') && node[i].localName !== 'img') {
            node[i].parentNode.removeChild(node[i]);
            continue;
        } */

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
                if (node[i].localName !== 'img') {
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
}

/*
 * Classification
 */

function scoreCommas(str) {
    var pts = str.split(',').length - 1;
    return pts;
}

function scoreCharacters(str) {
    var cp = str;
    cp = cp.replace(/\s|\n/g, '');
    var pts = Math.floor((cp.length / 50));
    return pts;
}

function scoreImages(list, index, score) {
    var firstCondition = false;
    var secondCondition = false;
    for (var i = 0; i < list.length; i++) {
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
    var collection = doc.getElementsByTagName('*');

    for (var j = 0; j < collection.length; j++) {

        if (collection[j].childElementCount === 0) {
            list.push(collection[j]);
        }
    }

    return list;
}

function scoreNodes(list) {
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
    return list;
}

function grabArticle(doc) {
    var list = [];
    
    list = getTextNode(doc, list);
    console.log('TEXT NODE : ', list);

    list = scoreNodes(list);
    console.log('SCORE NODE : ', list);
    
    // extract content that is importante (more than 2 pts)
    var res = [];
    var threshold = 3;
    for (var l = 0; l < list.length; l++) {

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

/*
 * Data formatting
 */

function generateDictionnary (list) {
    var dict = {};
    var res = [];

    for(var i = 0; i < list.length; i++) {
        var tag = list[i].localName;
        var content = list[i].textContent;

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
            var imgAttributes = list[i].attributes;

            // src attributes
            imgSrc = '';
            if ('src' in imgAttributes && imgSrc === '') {
                var imgSrc = imgAttributes.src.value;
            } else if ('srcset' in imgAttributes && imgSrc === '') {
                var imgSrc = imgAttributes.srcset.value;
            } else {
                alert('Images not supported');
            }
                    
            // alt attributes
            if ('alt' in imgAttributes) { 
                var imgAlt = imgAttributes.alt.value;
            } else {
                var imgAlt = '';
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

/*
 * Main Part
 */

export function simplify(html) {
    // convert string into DOM Element
    const parser = new DOMParser();
    var doc = parser.parseFromString(html, 'text/html');

    // Pre-processing
    preProcess(doc);
    console.log('[DOC] : ',doc);

    // Classification
    var list = grabArticle(doc);

    // Data formatting
    var dict = generateDictionnary(list);
    console.log('[DICT] : ', dict);
    return dict;
}