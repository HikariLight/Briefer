/*
 * Additionnal function
 */

function extractTags(str) {
    var tagToKeep = '(p(?![a-z])|h[0-9]+)';
    var regex = new RegExp('<\\s*'+tagToKeep+'[^>]*>((.|\n)*?)<\\s*\\/\\s*'+tagToKeep+'[^>]*>', 'g');
    var match = str.match(regex);
    return match;
}

function removeTags(str) {
    // remove tags inside an other tag
    var open = false;
    var regex = new RegExp('<\\s*[^>]*>');
    for (var i = 0; i < str.length; i++) {
        if ((str.charAt(i) === '<') && (open === false)) {
            open = true;
        } else if ((str.charAt(i) === '<') && (str.charAt(i+1) === '/') && (open === true)) {
            open = false;
        } else if ((str.charAt(i) === '<') && (open === true)) {
            var remove = str.slice(i);
            // remove 2 tags (open & close)
            remove = remove.replace(regex, '');
            remove = remove.replace(regex, '');
            str = str.slice(0, i) + remove;
        }
    }
    return str;
}

function removeAttributeTags(str) {
    var regex = new RegExp('\\s*(style|class|id)=("|\')[^("|\')]*\\n*("|\')', 'g');
    var replace = str.replace(regex, '');
    return replace;
}

function removeMetacharacter(str) {
    var regex = new RegExp('(\\n|\\t)*', 'g');
    var replace = str.replace(regex, '');
    return replace;
}

/*
 * Main function
 */

export function simplify(html) {
    var str = html;
    str = removeMetacharacter(str);
    // console.log('\nremove metacharacter : ', str);
    str = extractTags(str).join('');
    // console.log('\nextract tag : ', str);
    str = removeAttributeTags(str);
    // console.log('\nremove attribute : ', str);
    str = removeTags(str);
    // console.log('\nremove tags : ', str);
    var dict = generateDictionnary(str);
    return dict;
}

export function generateDictionnary(html) {
    var res = [];
    var tag;
    var content;
    var tmp = {}; 
    var list = extractTags(html);
    
    for (var i = 0; i < list.length; i++) {
        // split tag / content
        tag = list[i].match(/<\s*[^>]*>/i)[0].replace(/(<|>|\s*)/g, '');
        content = list[i].replace(/<\s*[^>]*>/g, '');

        if (tag[0] === 'h') {
            if (Object.keys(tmp).length !== 0) {
                res.push(tmp);
            }
            tmp = {};
        } 
        if (tmp.hasOwnProperty(tag)) { // if key exist, add to the list
            tmp[tag].push(content);
        } else { // if key doesn't exist, create key => value
            tmp[tag] = [content];
        }
    }

    res.push(tmp);  
    return res;
    
}

/*
<!doctype html>
<html lang="fr">
    <head>
        <meta charset="utf-8">
        <title>Titre de la page</title>
        <link rel="stylesheet" href="style.css">
        <script src="script.js"></script>
    </head>
    <body>
        < h1>Titre1</ h1 >
        <article>
            <h2>Titre2</h2>
                <p>Je suis une partie du paragraphe</p>
                <p>encore un autre paragraphe</p>
        </article>
        <article>
            <h2>Titre2</h2>
                <p>Encore un paragraphe</p>
                <h3>Titre3</h3>
                    <p>Surprise, encore un !</p>
        </article>
        <section>
            <h2>Titre2</h2>
                <p> Je suis un paragraphe sur plusieurs lignes</p>
        </section>
    </body>
</html>
*/

/* OUTPUT
list = [
    0 = {
        'h1' : ['Titre1']
    }, 

    1 = {
        'h2' : ['Titre2'],
        'p' : ['Je suis une partie du paragraphe','encore un autre paragraphe']
    }, 

    2 = {
        'h2' : ['Titre2'],
        'p' : ['Encore un paragraphe']
    },

    3 = {
        'h3' : ['Titre3'],
        'p' : ['Surprise, encore un !']
    }, 

    4 = {
        'h2' : ['Titre2'],
        'p' : ['Je suis un paragraphe sur plusieurs lignes']
    }
] 
*/