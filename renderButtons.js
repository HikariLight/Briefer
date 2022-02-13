// We'll have to generate a simplified *and* a summarised version of 
// the original content and save them in localStorage

document.getElementById("export").addEventListener("click", () => {
    alert("Exporting...");
    
    // I think Julien said there's a very easy way of doing this. Was it this?
    // window.print()
});
    
let functionButton = document.getElementById("functionButton");
    
functionButton.addEventListener("click", () => {
    let mode = functionButton.innerText;

    if(mode === "Simplify"){
        alert("Simplifying...");
    }
    else if(mode === "Summarise"){
        alert("Summarising...");
    }
})
