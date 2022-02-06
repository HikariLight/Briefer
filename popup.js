import { getHtml, getActiveTab } from './reader.js';
import { clearHtml } from './simplifier.js';
import { summarise } from "./summariser.js";
import { render } from "./engine.js";

// First Article link: https://www.theverge.com/2022/1/10/22876061/samsung-qd-oled-quantum-dot-tv-panels-sgs-certification-brightness-color-viewing-angles
// Second Article link: https://arstechnica.com/science/2022/02/hydrogen-soaked-crystal-lets-neural-networks-expand-to-match-a-problem/
const testCase = [
    {
        // "title": "Samsung Display’s new QD-OLED panel can hit 1,000 nits brightness for improved HDR",
        "h1": "Samsung's OLED TVs",
        "p": [
            "Importantly, Samsung Display’s new panel appears to achieve this without sacrificing the existing benefits of OLED displays. These include pure blacks where no light is being emitted at all, not to mention excellent viewing angles compared to typical LCD TVs. In fact, SGS says the viewing angles of Samsung Display’s QD-OLEDs are even better than existing OLEDs, maintaining 80 percent of luminance when viewed from a 60-degree angle compared to 53 percent for a conventional OLED.",
            "An important caveat is that all of these comparisons were made with LG’s 2021 flagship, which is due to be superseded this year when it releases a new lineup of OLED TVs. LG Display also has a new generation of OLED panels of its own, dubbed OLED EX, which it says offer increased brightness levels of up to 30 percent. Whether that’s enough to remain competitive with Samsung’s new panels remains to be seen.",
            "We’ll still have to wait for consumer TVs to actually make it to market using both panels before we can be completely sure of these readings, but it’s looking like an impressive set of results for Samsung Display’s latest technology. And Samsung’s display arm produces panels for a variety of companies, so it won’t just be Samsung’s own TVs that benefit.",
            "The question still remains when, exactly, Samsung Display’s new panels will actually go on sale. Interestingly the first QD-OLED TV to be announced wasn’t from Samsung Electronics, but was instead from Sony which said its Bravia XR A95K will use a QD-OLED panel from Samsung Display. Alienware also has a QD-OLED computer monitor in the works. When Samsung Electronics will eventually release a QD-OLED TV of its own is anyone’s guess."
        ],
        "img": "https://cdn.vox-cdn.com/thumbor/QfqtCHxcWLbO24LC6i8o5cAQOc4=/0x0:750x500/920x613/filters:focal(315x190:435x310):format(webp)/cdn.vox-cdn.com/uploads/chorus_image/image/70368755/3.0.jpg"
    },
    {
        // "title": "Hydrogen-soaked crystal lets neural networks expand to match a problem",
        "h1": "Give it the gas",
        "p": [
            "The material being used here is one of a class of compounds called perovskite nickelates. Perovskite is a general term for a specific arrangement of atoms in a crystalline structure; a wide variety of chemicals can form perovskites. In this case, the crystal is formed from a material that's a mix of neodymium, nickel, and oxygen.",
            "The crystal structure has enough open space that it can readily absorb and hold onto hydrogen. Once the hydrogen is incorporated, its electron will often end up being transferred to one of the nickel atoms. This changes the electrical properties of the atom and, in doing so, changes the conductivity of the material in general. The degree to which they change depends on how much hydrogen is present.",
            "Since the hydrogen ends up with a positive charge after giving up its electron, it can be controlled by externally applied electric fields. So, by controlling the electrical environment, it's possible to redistribute the hydrogen within the perovskite structure. That will then change the conductive properties of the material.",
            "The researchers show that these states are meta-stable: they'll change if an external force is applied but will remain stable for up to six months without the need to refresh the hydrogen. It's not clear whether it needs to be refreshed at that point or whether that's simply the latest they checked.",
            "In any case, the researchers create a device simply by hooking up the perovskite to electrodes in a hydrogen atmosphere. (Getting the hydrogen into the material requires one electrode to be made from platinum or palladium.) From there, they demonstrated that it can be reliably switched among four states.",
            "One state allows it to act as a resistor, meaning the device can act as a memristor. Similarly, it'll behave as a memcapacitor, holding charge if set in that state. When in spiking neuron mode, it will accumulate multiple signals, at which point its resistance changes dramatically. This mimics how a neuron requires incoming spikes to exceed a threshold before it switches into an active state. Finally they had a configuration that acted like a synapse (at least in neural-network terms), transforming an input based on its strength.",
            "Obviously, it's possible to do similar things with dedicated devices for each of the four functions if you're willing to activate and shut off different parts of a chip when needed. But many of these behaviors are analog, something that silicon requires even more hardware to emulate. Here, all this is done with a single bit of material between two electrodes."
        ],
        "img": "https://cdn.arstechnica.net/wp-content/uploads/2022/02/GettyImages-1201452137-800x450.jpg"
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
            // call simplifier 
            var dict = clearHtml(html);
            console.log('dictionnary : ', dict);

            var htmlContent = render(dict, "simplify");
        
            var newWindow = window.open();
            newWindow.document.write(htmlContent);
        }

        removeData('tabs');

    });

    /*
     * Summariser
     */
    document.getElementById('summarise').addEventListener('click', async () => {
        for(let i = 0; i < testCase.length; i++){
            testCase[i]["p"] = summarise(testCase[i]["p"]);
        }

        let htmlContent = render(testCase, "summarise");
        
        let newWindow = window.open();
        newWindow.document.write(htmlContent);
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