import { testCase, headerTestCase } from "./testCases.js"

const skeletonHead = `
    <html>

    <head>
        <title>ClearView</title>
        <link rel="stylesheet" href="./style/page.css">
        <link rel="icon" href="favicon.png">
    </head>

    <body>
    <div class="container">
`;

const simplifyPanel = `
    </main>

    <aside id="buttonsPanel">
        <button id="function">Simplify</button>
        <button id="export">Export</button>
    </aside>

`;

const summarisePanel = `
    </main>
    </div>

    <aside id="buttonsPanel">
        <button id="function">Summarise</button>
        <button id="export">Export</button>
    </aside>

`;

const skeletonBody = `

    <footer>
        <p>All Rights Reserved</p>
    </footer>
    
    </body>
    </html>
`;

const insertTags = (section, mode) =>{

    // Takes in a dictionary and returns a string containing HTML Code.

    let result = "";

    for(let tag in section){

        if(tag == "img"){
            result += "<" + tag + " src=\"" + section[tag] + "\">\n";
            continue;
        }

        if(tag == "p"){
            if(mode == "simplify"){
                for(let i = 0; i < section[tag].length; i++){
                    result += "<" + tag + ">" + section[tag][i] + "</" + tag + ">";
                }
            }
            else if(mode == "summarise"){
                result += "<ul>";
                for(let i = 0; i < section[tag].length; i++){
                    result += "<li>"
                    result += "<" + tag + ">" + section[tag][i] + "</" + tag + ">";
                    result += "</li>";
                }
                result += "</ul>";
            }

            continue;
        }

        result += "<" + tag + ">\n";
        result += section[tag];
        result += "\n</" + tag + ">\n";
    }

    return result;
}

const render = (bodyContent, mode, headerContent) =>{

    // Takes in a list of dictionaries and returns a string containing HTML Code.

    let header = `
    <header>
        <img id="logo" src=${headerContent["logo"]} alt="logo">
        <h1 id="headerTitle">${headerContent["title"]}</h1>
        <a id="url" href=${headerContent["url"]} target="_blank" rel="noopener noreferrer">Original Link</a>
    </header>

    <main>
    `;

    let result = skeletonHead;

    result += header + "\n";
    
    for(let i = 0; i < bodyContent.length; i++){
        result += "<section>\n";
        result += insertTags(bodyContent[i], mode);
        result += "\n</section>\n";
    }

    if(mode == "simplify"){
        result += summarisePanel;
    }
    else{
        result += simplifyPanel;
    }

    result += skeletonBody;

    return result;
}

export { render, headerTestCase };

// // Tests
// // insertTags test
// let sectionHTML = insertTags(testCase[0])
// // console.log(sectionHTML);

// Render test
// let simplifiedPage = render(testCase, "simplify", headerTestCase);
// let summarisedPage = render(testCase, "summarise", headerTestCase);
// console.log(summarisedPage);