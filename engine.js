const skeletonHead = `
    <!DOCTYPE html>
    
    <html>
    <head>
        <title>ClearView</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="./style/page.css">
        <link rel="shortcut icon" href="./assets/favicon.png">
    </head>

    <body>
    <div class="container">
`;

const simplifyPanel = `
    </main>

    <aside id="buttonsPanel">
        <button id="simplify" class="functionButton"></button>
        <button id="export"></button>
    </aside>

    <main>
`;

const summarisePanel = `
    <aside id="buttonsPanel">
        <button id="summarise" class="functionButton"></button>
        <button id="export"></button>
    </aside>

    <main>
`;

const skeletonBody = `

    </main>

    <footer>
        <p>Genearted by: Briefer Browser Extension</p>
    </footer>

    </div>

    <script src="renderButtons.js"></script>
    
    </body>
    </html>
`;

const insertTags = (section, mode) =>{

    // Takes in a dictionary and returns a string containing HTML Code.

    let result = "";

    for(let tag in section){

        if(tag == "img"){
            for(let i = 0; i < section[tag].length; i += 2){
                result += "<" + tag + " src=\"" + section[tag][i] + "\" alt=\"" + section[tag][i+1] + "\">\n";
            }
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
                    result += "<" + tag + ">" + section[tag][i] + ".</" + tag + ">";
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

const render = (headerContent, bodyContent, mode) =>{

    // Takes in a list of dictionaries and returns a string containing HTML Code.

    let header = `
    <header>
        <img id="logo" src=${headerContent["icon"]} alt="logo">
        <div>
            <h1 id="headerTitle">${headerContent["title"]}</h1>
            <a id="url" href=${headerContent["url"]} target="_blank" rel="noopener noreferrer">Original Link</a>
        </div>
    </header>
    `;

    let result = skeletonHead;

    result += header + "\n";

    if(mode == "simplify"){
        result += summarisePanel;
    }
    else{
        result += simplifyPanel;
    }
    
    for(let i = 0; i < bodyContent.length; i++){
        result += "<section>\n";
        result += insertTags(bodyContent[i], mode);
        result += "\n</section>\n";
    }

    result += skeletonBody;

    return result;
}

export { render };