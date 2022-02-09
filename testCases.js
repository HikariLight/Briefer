// Source: https://arstechnica.com/science/2022/02/hydrogen-soaked-crystal-lets-neural-networks-expand-to-match-a-problem/
const headerTestCase = {
    "title": "Hydrogen-soaked crystal lets neural networks expand to match a problem",
    "logo": "https://cdn.arstechnica.net/favicon.ico",
    "url": "https://arstechnica.com/science/2022/02/hydrogen-soaked-crystal-lets-neural-networks-expand-to-match-a-problem/"
}

const testCase = [
    {
        "img": "https://cdn.arstechnica.net/wp-content/uploads/2022/02/GettyImages-1201452137-800x450.jpg",
        "p": [
            "Training AIs remains very processor-intensive, in part because traditional processing architectures are poor matches for the sorts of neural networks that are widely used. This has led to the development of what has been termed neuromorphic computing hardware, which attempts to model the behavior of biological neurons in hardware.",
            "But most neuromorphic hardware is implemented in silicon, which limits it to behaviors that are set at the hardware level. A group of US researchers is now reporting a type of non-silicon hardware that's substantially more flexible. It works by controlling how much hydrogen is present in an alloy of nickel, with the precise amount of hydrogen switching a single device among four different behaviors, each of which is useful for performing neural-network operations."
        ]
    },
    {
        "h1": "Give it the gas",
        "p": [
            "The material being used here is one of a class of compounds called perovskite nickelates. Perovskite is a general term for a specific arrangement of atoms in a crystalline structure; a wide variety of chemicals can form perovskites. In this case, the crystal is formed from a material that's a mix of neodymium, nickel, and oxygen.",
            "The crystal structure has enough open space that it can readily absorb and hold onto hydrogen. Once the hydrogen is incorporated, its electron will often end up being transferred to one of the nickel atoms. This changes the electrical properties of the atom and, in doing so, changes the conductivity of the material in general. The degree to which they change depends on how much hydrogen is present.",
            "Since the hydrogen ends up with a positive charge after giving up its electron, it can be controlled by externally applied electric fields. So, by controlling the electrical environment, it's possible to redistribute the hydrogen within the perovskite structure. That will then change the conductive properties of the material.",
            "The researchers show that these states are meta-stable: they'll change if an external force is applied but will remain stable for up to six months without the need to refresh the hydrogen. It's not clear whether it needs to be refreshed at that point or whether that's simply the latest they checked.",
            "In any case, the researchers create a device simply by hooking up the perovskite to electrodes in a hydrogen atmosphere. (Getting the hydrogen into the material requires one electrode to be made from platinum or palladium.) From there, they demonstrated that it can be reliably switched among four states.",
            "One state allows it to act as a resistor, meaning the device can act as a memristor. Similarly, it'll behave as a memcapacitor, holding charge if set in that state. When in spiking neuron mode, it will accumulate multiple signals, at which point its resistance changes dramatically. This mimics how a neuron requires incoming spikes to exceed a threshold before it switches into an active state. Finally they had a configuration that acted like a synapse (at least in neural-network terms), transforming an input based on its strength.",
            "Obviously, it's possible to do similar things with dedicated devices for each of the four functions if you're willing to activate and shut off different parts of a chip when needed. But many of these behaviors are analog, something that silicon requires even more hardware to emulate. Here, all this is done with a single bit of material between two electrodes."
        ]
    },
    {
        "h1": "But what’s it good for?",
        "p": [
            "After having demonstrated a single device can work, rather than struggling to build a chip containing a lot of them, the team shifted over to building models based on its behavior. They built different types of neural networks that were used to interpret a couple of standard AI tests—written and spoken digit recognition—along with a fairly recent practical example: EKG characterization.",
            "One thing the researchers modeled was something called reservoir computing. This approach to AI tries to limit the cost of training a system by setting up a multi-layer neural network, and then only training the final layer before the output—in essence, training the output neurons to pay attention to specific parts of the reservoir. Here, the flexibility of the devices meant that fewer of them were needed in the reservoir in order to provide similar performance to more traditional hardware.",
            "Another problem that was modeled was the response of a network to having a changing number of items it needed to recognize. An example of this would be a system that was trained to recognize fish and cats, and then later had images of birds mixed in. Or one that was trained to recognize all fish, cats, birds, and lizards but in the end was only shown images of fish and lizards. Ideally, a system can learn on the fly or scale down on its computational requirements if it was initially overtrained.",
            "Again, the flexibility of having a device that can be reconfigured into different behaviors on the fly made a big difference. When left to reconfigure itself in response to a reduced set of input images, the system could drop nearly half its nodes without losing performance. Alternately, as the researchers added tasks it was untrained for, the system learned so well that its accuracy more than doubled that of a system with traditional hardware.",
            "None of this is to say that we're going to be building these things and swapping them into data centers any time soon. There are a lot of issues—cost of materials, ease of manufacturing, integration with silicon hardware—that would need to be worked out before we could even start to understand whether these offer any sort of benefit in terms of performance or energy use.",
            "But it's clear that the mismatch between AI and traditional silicon hardware is inducing a lot of experimentation with alternate technology, including different ways of using silicon. There are parallels there to what's going on with quantum computing, although with a key difference: we already have complicated AI algorithms in use, whereas with quantum computers, we're still waiting for the hardware that will allow our algorithms to run."
        ]
    }
];

export { headerTestCase, testCase }