let test_case = [
    {
        "h1": ["First Title"],
        "p": ["First Paragraph", "Second Paragraph", "Third Paragraph"],
        "img": ["https://static01.nyt.com/images/2021/09/14/science/07CAT-STRIPES/07CAT-STRIPES-mediumSquareAt3X-v2.jpg"],
        "a": ["www.google.com", "stuff"]
    },
    {
        "h1": ["Second Title"],
        "p": ["First Paragraph", "Second Paragraph", "Third Paragraph"],
        "img": ["https://static01.nyt.com/images/2021/09/14/science/07CAT-STRIPES/07CAT-STRIPES-mediumSquareAt3X-v2.jpg"],
        "a": ["www.google.com", "stuff"]
    },
    {
        "h1": ["Third Title"],
        "p": ["First Paragraph", "Second Paragraph", "Third Paragraph"],
        "img": ["https://static01.nyt.com/images/2021/09/14/science/07CAT-STRIPES/07CAT-STRIPES-mediumSquareAt3X-v2.jpg"],
        "a": ["www.google.com", "stuff"]
    }
];

const skeletonHead = `
    <html>

    <head>
    <title>ClearView</title>
    <link rel="stylesheet" href="./style/page.css">
    </head>

    <body>

    <header>
        <h1 id="headerTitle">ClearView</h1>
    <header>

    <h1 id="articleTitle">Some Title</h1>
`;

const skeletonBody = `
    <footer>
        <p>ClearView Inc. All Rights Reserved</p>
    </footer>
    </body>
    </html>
`;

const insertTags = (section) =>{

    // Takes in a dictionary and returns a string containing HTML Code.

    let result = "";

    for(let tag in section){

        if(tag == "img"){
            result += "<" + tag + " src=\"" + section[tag] + "\">\n";
            continue;
        }

        // Maybe we don't need this. We won't include a's in the output
        if(tag == "a"){
            result += "<" + tag + " href=\"" + section[tag][0] + "\">"+ section[tag][1] +"</" + tag + ">\n";
            continue;
        }

        result += "<" + tag + ">\n";
        result += section[tag];
        result += "\n</" + tag + ">\n";
    }

    return result;
}

const render = (sections) =>{

    // Takes in a list of dictionaries and returns a string containing HTML Code.

    let result = "";

    result += skeletonHead;
    
    for(let i = 0; i < sections.length; i++){
        result += insertTags(sections[i]);
    }

    result += skeletonBody;

    return result;
}

// Tests
// insertTags test
let sectionHTML = insertTags(test_case[0])
// console.log(sectionHTML);

// Render test
let pageHTML = render(test_case);
// console.log(pageHTML);
