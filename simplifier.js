/*
 * Define Regular Expression
 */

var tagToKeep = new RegExp('(<\\s*(p(?![a-z])|h[0-9]+)[^>]*>((.|\n)*?)<\\s*\\/\\s*(p(?![a-z])|h[0-9]+)[^>]*>)|<\\s*img[^>]*>', 'g');
var tagToRemove = new RegExp('<\\s*(head|header|footer)[^>]*>((.|\n)*?)<\\s*\\/\\s*(head|header|footer)[^>]*>', 'g');
var tagSelector = new RegExp('<\\s*[^>]*\\s*>', 'g'); 
var attributes = new RegExp('([a-z]+)\\s*=\\s*("|\')[^("|\')]*\\n*("|\')', 'g');
var metacharacter = new RegExp('(\\n|\\t)*', 'g');

/*
 * Additionnal function
 */

function callbackImgAttributes(match, p1) {
    if (p1 === 'src' || p1 === 'alt') {
        return match;
    }
    return '';
}

function removeTagInsideTag(str) {
    var open = false;
    for (var i = 0; i < str.length; i++) {
        if ((str.charAt(i) === '<') && (open === false)) {
            if (str.slice(i+1).match(/\s*img/i) === null) { // if tag is not img
                open = true;
            }
        } else if ((str.charAt(i) === '<') && (str.charAt(i+1) === '/') && (open === true)) {
            open = false;
        } else if ((str.charAt(i) === '<') && (open === true)) {
            var remove = str.slice(i);
            remove = remove.replace(/<\s*[^>]*\s*>((.|\n)*?)<\s*\/\s*[^>]*>/i, '$1'); // remove the next 2 tags (open & close)
            str = str.slice(0, i) + remove;
        }
    }
    return str;
}

function matchRegexp(str, regex) {
    return str.match(regex);
}

function replaceRegexp(str, regex, remplacement='') {
    return str.replace(regex, remplacement);
}

function replaceRegexpCallback(str, regex, callbackFunction) {
    return str.replace(regex, callbackFunction);
}

/*
 * Main function
 */

export function simplify(html) {
    html = replaceRegexp(html, metacharacter); // remove metacharacter (\n, \t)
    html = replaceRegexp(html, tagToRemove); // remove head, header, footer
    html = matchRegexp(html, tagToKeep).join(''); // extract paragraph, title, images
    html = replaceRegexpCallback(html, attributes, callbackImgAttributes); // remove attributes except 'src' and 'alt' for images
    html = removeTagInsideTag(html); // remove tag inside another tag (<p> <strong> </strong> </p>)

    return generateDictionnary(html);
}

function generateDictionnary(html) {
    var tmp = {};
    var res = [];
    html = matchRegexp(html, tagToKeep); // split each tag into list

    for (var i = 0; i < html.length; i++) {
        var tag = matchRegexp(html[i], /<\s*[^>]*>/i).join(''); // extract first tag encountered
        tag = replaceRegexp(tag, /\s*<\s*|\s*>\s*|\s*=\s*/g); // remove '<', '>', '=', whitespace stuck to them

        if (tag[0] === 'h') { // if title tag
            if (Object.keys(tmp).length !== 0) {
                res.push(tmp);  // update array input
            }
            tmp = {};
        } 
        
        if (tag[0] === 'i') { // if img tag
            var imgTag = matchRegexp(tag, /[a-z]*[^\s]/i).join(''); // extract img tag
            var imgSrc = tag.replace(/.*src('|")((.|\n)*?)('|").*/i, '$2'); // extract src
            tmp[imgTag] = [imgSrc];
            if (matchRegexp(tag, /alt/g) !== null) { // if alt exist
                var imgAlt = tag.replace(/.*alt('|")((.|\n)*?)('|").*/i, '$2'); // extract alt
                tmp[imgTag].push(imgAlt);
            }
            
        } else {
            var content = replaceRegexp(html[i], tagSelector);
            if ( tmp.hasOwnProperty(tag)) { // if key already exist
                tmp[tag].push(content); // add to the list
            } else { // if it's doesn't
                tmp[tag] = [content]; // create list
            }   
        }

    }

    res.push(tmp);

    return res;
}

/* OUTPUT

<!doctype html>
<html lang='fr'>
    <head>
        <meta charset='utf-8'>
        <title>Titre de la page</title>
        <link rel='stylesheet' href='style.css'>
        <script src='script.js'></script>
    </head>
    <header>
        <nav>
            <h1> news </h1>
            <h1> contact </h1>
        </nav>
    </header>
    <body>
        < h1 id='titre1'>Titre1</ h1 >
        <article>
            <h2 class='titre2'>Titre2</h2>
                <p id='paragraph'>Je suis une <strong>partie </strong> du paragraphe</p>
                <p>encore un autre paragraphe</p>
        </article>
        <article>
            <h2>Titre2</h2>
                <p>Encore un paragraphe</p>
                <img src = 'path/to/img' id='img1' alt= 'comment'>
            <h3>Titre3</h3>
                <p>Surprise, encore un !</p>
        </article>
        <section>
            <h2>Titre2</h2>
                <p> Je suis un paragraphe sur plusieurs lignes</p>
        </section>
    </body>
    <footer>
        <p>Je suis le footer</p>
        <img src="logo" alt="company">
    </footer>
</html>
*/

/* INPUT

list = [
    dict1 = {
        'h1' : ['Titre1']
    }, 
    dict2 = {
        'h2' : ['Titre2'],
        'p' : ['Je suis un partie du paragraphe', 'encore un autre paragraph']
    },
    dict3 = {
        'h2' : ['Titre2'],
        'p' : ['Encore un paragraphe'],
        'img' : ['path/to/img', 'comment']
    }, 
    dict4 = {
        'h3' : ['Titre3'],
        'p' : ['Suprise, encore un !']
    }, 
    dict5 = {
        'h2' : ['Titre2'],
        'p' : ['Je suis un paragraphe sur plusieurs lignes']
    }
]
*/