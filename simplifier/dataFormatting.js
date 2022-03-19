import { checkObjectInput } from "../exceptionHandling.js";

function dataFormatting (list) {

    // Input : Array of DOM Elements
    // Ouput : Array of String divided by tag and section

    checkObjectInput(list, "list", "dataFormatting.js", "dataFormatting()");

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

            var imgAttributes = list[i].attributes;

            let imgSrc = '';

            for ( let j = 0; j < imgAttributes.length; j++ ) {

                if ( new RegExp('src').test(imgAttributes[j].name) ) {

                    if ( new RegExp('^//').test(imgAttributes[j].value) ) {
                        imgAttributes[j].value = imgAttributes[j].value.replace(/^\/\//g, "https://");
                    }

                    let isValid = imgAttributes[j].value.match(new RegExp('((https://|http://).[^\\s]*)'));
                    
                    if ( isValid !== null && isValid.length !== 0 ) {
                        imgSrc = imgAttributes[j].value;
                    } 
                }
            }

            if ( imgSrc === '' ) {
                continue;
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

export { dataFormatting };