import { checkObjectInput } from "../exceptionHandling.js";

const unwantedTags = ['table', 'noscript', 'head', 'script', 'style', 'symbol', 'path', 'footer', 'nav', 'iframe', 'link'];
const unwantedAttributes = ['paywall', 'edit', 'pane-custom', 'josh', 'connatix', 'read-more', 'related', 'see_also', 'note', 'metadata', 'indicator', 'source', 'ref', 'nowrap', 'navigation', 'search', 'reference', 'click', 'toc', 'atm', 'banner', 'breadcrumbs', 'btn', 'button', 'card', 'comment', 'community', 'cookie', 'copyright', 'extension', 'extra', 'footer', 'footnote', 'hidden', 'langs', 'menu', 'nav', 'notification', 'popup', 'replies', 'rss', 'inline', 'sidebar', 'share', 'social', 'sponsor', 'supplemental', 'widget'];
const wantedAttributes = ['article', 'body', 'content', 'main', 'shadow', 'image', 'img', 'root'];
const unwantedSocialMedias = ['facebook', 'instagram', 'telegram', 'vk', 'whatsapp', 'twitter', 'pinterest', 'linkedin', 'gmail', 'viadeo', 'mailto', 'social'];


function restructuringContent ( node ) {

    // Input : DOM Element (paragraph or title)
    // Output : Same DOM Element without any tag as childrenElement

    checkObjectInput(node, "node", "preProcessing.js", "restructuringContent()");

    let text = node.textContent;
    if ( new RegExp('<img.+?>', 'g').test(node.innerHTML) ) {
        return;
    }
    
    while (node.lastElementChild) {
        node.removeChild(node.lastElementChild);
    }
    node.textContent = text;
}


function restructuringImages ( node ) {

    // Input : DOM Element (images without alt attribute)
    // Output : Same DOM Element with alt by catching it

    checkObjectInput(node, "node", "preProcessing.js", "restructuringImages()");

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

    // Input : DOM Tree
    // Output : Dom Tree without unexpected contents

    checkObjectInput(doc, "doc", "preProcessing.js", "preProcess()");
    
    let node = doc.getElementsByTagName('*');
    for (let i = node.length - 1 ; i >= 0 ; i--) {

        // restructure images (caption alt attribute)
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

export { preProcess };