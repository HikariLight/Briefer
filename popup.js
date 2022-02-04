import { getHtml, getActiveTab } from './reader.js';
import { summarise } from "./summariser.js";
import { render } from "./engine.js";

let test_case = [
    {
        "h1": ["First Title"],
        "p": [
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras facilisis porta vehicula. Aenean eleifend elit vel justo accumsan feugiat. Ut eget risus ac est suscipit tempor quis sed mi. Aliquam erat volutpat. Curabitur fringilla nibh libero, vel porta libero consequat nec. Donec eu pretium ipsum. Proin cursus ipsum vel sem suscipit mattis. Nam sit amet mi id sem aliquam rutrum ut nec dui. Donec congue sollicitudin metus, eget egestas mi aliquet ac. Nullam eget porttitor est. Integer sed odio nulla. Sed imperdiet vel sapien a feugiat. Curabitur pellentesque turpis eu ipsum ornare, in ornare eros dignissim. Nunc et nunc tempus, tempor enim at, semper purus. Praesent accumsan pulvinar libero, eleifend laoreet ipsum tincidunt sit amet. ",
            "Nunc pellentesque mi magna, non porttitor arcu varius sed. Mauris nulla nunc, placerat pulvinar nibh vel, consequat iaculis nisi. In non efficitur turpis, a convallis odio. Vivamus efficitur dignissim ornare. In facilisis eu massa in semper. Donec nec erat sed leo vestibulum porttitor. Donec aliquam odio at felis porta, ut mattis eros suscipit. Nunc fermentum eros quis magna congue, eget condimentum dui condimentum. Praesent viverra purus odio, ut ornare ex blandit eget. Sed viverra metus quis erat mollis accumsan. Pellentesque eu dui ante. Cras eu nunc quis libero suscipit imperdiet vel malesuada lectus. Suspendisse ultricies nisi id bibendum molestie. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; ",
            "Integer nec urna imperdiet, bibendum augue ac, vulputate felis. Nam a rutrum enim. Praesent fringilla ipsum felis, eu porta ligula molestie interdum. Phasellus condimentum et diam ut laoreet. Mauris dignissim id nisi sit amet consectetur. Quisque eget ullamcorper urna. Donec nec mauris ut nisi euismod sollicitudin. Pellentesque at tempus justo. Nunc dui erat, efficitur id est eget, ornare gravida arcu. In a tellus id elit aliquam scelerisque eget non dui. Integer dolor lacus, facilisis eget risus ac, tempor mattis felis. Nulla massa ante, luctus ut est finibus, iaculis vehicula neque. Phasellus enim felis, maximus a neque nec, facilisis ullamcorper tellus. Aliquam mollis nec lectus non varius. "
        ],
        "img": ["https://static01.nyt.com/images/2021/09/14/science/07CAT-STRIPES/07CAT-STRIPES-mediumSquareAt3X-v2.jpg"],
    },
    {
        "h1": ["Second Title"],
        "p": [
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras facilisis porta vehicula. Aenean eleifend elit vel justo accumsan feugiat. Ut eget risus ac est suscipit tempor quis sed mi. Aliquam erat volutpat. Curabitur fringilla nibh libero, vel porta libero consequat nec. Donec eu pretium ipsum. Proin cursus ipsum vel sem suscipit mattis. Nam sit amet mi id sem aliquam rutrum ut nec dui. Donec congue sollicitudin metus, eget egestas mi aliquet ac. Nullam eget porttitor est. Integer sed odio nulla. Sed imperdiet vel sapien a feugiat. Curabitur pellentesque turpis eu ipsum ornare, in ornare eros dignissim. Nunc et nunc tempus, tempor enim at, semper purus. Praesent accumsan pulvinar libero, eleifend laoreet ipsum tincidunt sit amet. ",
            "Nunc pellentesque mi magna, non porttitor arcu varius sed. Mauris nulla nunc, placerat pulvinar nibh vel, consequat iaculis nisi. In non efficitur turpis, a convallis odio. Vivamus efficitur dignissim ornare. In facilisis eu massa in semper. Donec nec erat sed leo vestibulum porttitor. Donec aliquam odio at felis porta, ut mattis eros suscipit. Nunc fermentum eros quis magna congue, eget condimentum dui condimentum. Praesent viverra purus odio, ut ornare ex blandit eget. Sed viverra metus quis erat mollis accumsan. Pellentesque eu dui ante. Cras eu nunc quis libero suscipit imperdiet vel malesuada lectus. Suspendisse ultricies nisi id bibendum molestie. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; ",
            "Integer nec urna imperdiet, bibendum augue ac, vulputate felis. Nam a rutrum enim. Praesent fringilla ipsum felis, eu porta ligula molestie interdum. Phasellus condimentum et diam ut laoreet. Mauris dignissim id nisi sit amet consectetur. Quisque eget ullamcorper urna. Donec nec mauris ut nisi euismod sollicitudin. Pellentesque at tempus justo. Nunc dui erat, efficitur id est eget, ornare gravida arcu. In a tellus id elit aliquam scelerisque eget non dui. Integer dolor lacus, facilisis eget risus ac, tempor mattis felis. Nulla massa ante, luctus ut est finibus, iaculis vehicula neque. Phasellus enim felis, maximus a neque nec, facilisis ullamcorper tellus. Aliquam mollis nec lectus non varius. "
        ],
        "img": ["https://ychef.files.bbci.co.uk/976x549/p07ryyyj.jpg"],
    },
    {
        "h1": ["Third Title"],
        "p": [
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras facilisis porta vehicula. Aenean eleifend elit vel justo accumsan feugiat. Ut eget risus ac est suscipit tempor quis sed mi. Aliquam erat volutpat. Curabitur fringilla nibh libero, vel porta libero consequat nec. Donec eu pretium ipsum. Proin cursus ipsum vel sem suscipit mattis. Nam sit amet mi id sem aliquam rutrum ut nec dui. Donec congue sollicitudin metus, eget egestas mi aliquet ac. Nullam eget porttitor est. Integer sed odio nulla. Sed imperdiet vel sapien a feugiat. Curabitur pellentesque turpis eu ipsum ornare, in ornare eros dignissim. Nunc et nunc tempus, tempor enim at, semper purus. Praesent accumsan pulvinar libero, eleifend laoreet ipsum tincidunt sit amet. ",
            "Nunc pellentesque mi magna, non porttitor arcu varius sed. Mauris nulla nunc, placerat pulvinar nibh vel, consequat iaculis nisi. In non efficitur turpis, a convallis odio. Vivamus efficitur dignissim ornare. In facilisis eu massa in semper. Donec nec erat sed leo vestibulum porttitor. Donec aliquam odio at felis porta, ut mattis eros suscipit. Nunc fermentum eros quis magna congue, eget condimentum dui condimentum. Praesent viverra purus odio, ut ornare ex blandit eget. Sed viverra metus quis erat mollis accumsan. Pellentesque eu dui ante. Cras eu nunc quis libero suscipit imperdiet vel malesuada lectus. Suspendisse ultricies nisi id bibendum molestie. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; ",
            "Integer nec urna imperdiet, bibendum augue ac, vulputate felis. Nam a rutrum enim. Praesent fringilla ipsum felis, eu porta ligula molestie interdum. Phasellus condimentum et diam ut laoreet. Mauris dignissim id nisi sit amet consectetur. Quisque eget ullamcorper urna. Donec nec mauris ut nisi euismod sollicitudin. Pellentesque at tempus justo. Nunc dui erat, efficitur id est eget, ornare gravida arcu. In a tellus id elit aliquam scelerisque eget non dui. Integer dolor lacus, facilisis eget risus ac, tempor mattis felis. Nulla massa ante, luctus ut est finibus, iaculis vehicula neque. Phasellus enim felis, maximus a neque nec, facilisis ullamcorper tellus. Aliquam mollis nec lectus non varius. "
        ],
        "img": ["https://cdn.mos.cms.futurecdn.net/KYEJp9vem3QQFGhi25SYx4-1200-80.jpg"],
    }
];

/*
 * get html
 */
function scrapeThePage() {
    var htmlCode = document.documentElement.outerHTML;
    return htmlCode;
}

/*
 * access session data
 */
function storeData(key, data) {
    var current = window.localStorage.getItem(key);
    if (!current) {
        current = [];
    } else {
        current = JSON.parse(current);
    }
    current.push(data);
    window.localStorage.setItem(key, JSON.stringify(current));
    console.log('data stored');
}

function removeData(key) {
    window.localStorage.removeItem(key);
}

function getData(key) {
    var current = window.localStorage.getItem(key);
    if (!current) {
        current = [];
    } else {
        current = JSON.parse(current);
    }
    return current;
}

/*
 * Additionnal function
 */
function isIn(arr, url) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].url  === url) {
            return true;
        }
    }
    return false;
}

/*
 * event listener
 */
document.addEventListener('DOMContentLoaded', function () {

    /*
     * Simplify
     */
    document.getElementById('simplify').addEventListener('click', async () => {

        var tmp = await getActiveTab();
        var storedTabs = getData('tabs');
        if (storedTabs.length === 0 || !isIn(storedTabs, tmp.url)) {
            storedTabs.push(tmp);
        }

        for (var i = 0; i < storedTabs.length; i++) {
            const html = await getHtml(storedTabs[i], scrapeThePage);
            console.log('html : ', i+1, ' = ', html);
            // call simplifier here
        }

        removeData('tabs');

    });

    /*
     * Summariser
     */
    document.getElementById('summarise').addEventListener('click', async () => {
        // Article link: https://www.theverge.com/2022/1/10/22876061/samsung-qd-oled-quantum-dot-tv-panels-sgs-certification-brightness-color-viewing-angles
        let test_text = `Importantly, Samsung Display’s new panel appears to achieve this without sacrificing the existing benefits of OLED displays. These include pure blacks where no light is being emitted at all, not to mention excellent viewing angles compared to typical LCD TVs. In fact, SGS says the viewing angles of Samsung Display’s QD-OLEDs are even better than existing OLEDs, maintaining 80 percent of luminance when viewed from a 60-degree angle compared to 53 percent for a conventional OLED.

        An important caveat is that all of these comparisons were made with LG’s 2021 flagship, which is due to be superseded this year when it releases a new lineup of OLED TVs. LG Display also has a new generation of OLED panels of its own, dubbed OLED EX, which it says offer increased brightness levels of up to 30 percent. Whether that’s enough to remain competitive with Samsung’s new panels remains to be seen.

        We’ll still have to wait for consumer TVs to actually make it to market using both panels before we can be completely sure of these readings, but it’s looking like an impressive set of results for Samsung Display’s latest technology. And Samsung’s display arm produces panels for a variety of companies, so it won’t just be Samsung’s own TVs that benefit.

        The question still remains when, exactly, Samsung Display’s new panels will actually go on sale. Interestingly the first QD-OLED TV to be announced wasn’t from Samsung Electronics, but was instead from Sony which said its Bravia XR A95K will use a QD-OLED panel from Samsung Display. Alienware also has a QD-OLED computer monitor in the works. When Samsung Electronics will eventually release a QD-OLED TV of its own is anyone’s guess.
        `;

        let testCase = [
            {
                "h1": "Samsung's OLED TVs",
                // "p": [
                //     "Importantly, Samsung Display’s new panel appears to achieve this without sacrificing the existing benefits of OLED displays. These include pure blacks where no light is being emitted at all, not to mention excellent viewing angles compared to typical LCD TVs. In fact, SGS says the viewing angles of Samsung Display’s QD-OLEDs are even better than existing OLEDs, maintaining 80 percent of luminance when viewed from a 60-degree angle compared to 53 percent for a conventional OLED.",
                //     "An important caveat is that all of these comparisons were made with LG’s 2021 flagship, which is due to be superseded this year when it releases a new lineup of OLED TVs. LG Display also has a new generation of OLED panels of its own, dubbed OLED EX, which it says offer increased brightness levels of up to 30 percent. Whether that’s enough to remain competitive with Samsung’s new panels remains to be seen.",
                //     "We’ll still have to wait for consumer TVs to actually make it to market using both panels before we can be completely sure of these readings, but it’s looking like an impressive set of results for Samsung Display’s latest technology. And Samsung’s display arm produces panels for a variety of companies, so it won’t just be Samsung’s own TVs that benefit.",
                //     "The question still remains when, exactly, Samsung Display’s new panels will actually go on sale. Interestingly the first QD-OLED TV to be announced wasn’t from Samsung Electronics, but was instead from Sony which said its Bravia XR A95K will use a QD-OLED panel from Samsung Display. Alienware also has a QD-OLED computer monitor in the works. When Samsung Electronics will eventually release a QD-OLED TV of its own is anyone’s guess."
                // ]
                "p": `Importantly, Samsung Display’s new panel appears to achieve this without sacrificing the existing benefits of OLED displays. These include pure blacks where no light is being emitted at all, not to mention excellent viewing angles compared to typical LCD TVs. In fact, SGS says the viewing angles of Samsung Display’s QD-OLEDs are even better than existing OLEDs, maintaining 80 percent of luminance when viewed from a 60-degree angle compared to 53 percent for a conventional OLED.

                An important caveat is that all of these comparisons were made with LG’s 2021 flagship, which is due to be superseded this year when it releases a new lineup of OLED TVs. LG Display also has a new generation of OLED panels of its own, dubbed OLED EX, which it says offer increased brightness levels of up to 30 percent. Whether that’s enough to remain competitive with Samsung’s new panels remains to be seen.
        
                We’ll still have to wait for consumer TVs to actually make it to market using both panels before we can be completely sure of these readings, but it’s looking like an impressive set of results for Samsung Display’s latest technology. And Samsung’s display arm produces panels for a variety of companies, so it won’t just be Samsung’s own TVs that benefit.
        
                The question still remains when, exactly, Samsung Display’s new panels will actually go on sale. Interestingly the first QD-OLED TV to be announced wasn’t from Samsung Electronics, but was instead from Sony which said its Bravia XR A95K will use a QD-OLED panel from Samsung Display. Alienware also has a QD-OLED computer monitor in the works. When Samsung Electronics will eventually release a QD-OLED TV of its own is anyone’s guess.
                `
            }
        ];

        let summary = summarise(testCase[0]["p"]);
        // testCase[0]["p"] = summary;
        // let htmlContent = render(testCase, "simplify");
        let newWindow = window.open();

        newWindow.document.write(summary);
    });

    /*
     * Remember Pages
     */
    // document.getElementById('remember').addEventListener('click', async () => {
    //     storeData('tabs', await getActiveTab());
    // });

    // /*
    //  * Dashboard
    //  */
    // document.getElementById('dashboard').addEventListener('click', async () => {
    //     alert('not implemented yet');
    // });
});