let buttonRender = (mode) =>{
    let htmlContent = "";

    let data = JSON.parse(window.localStorage.getItem("tabs"))[0];

    if(mode === "Simplify"){
        htmlContent = data["simplifierRender"];
    }
    else if(mode === "Summarise"){
        htmlContent = data["summariserRender"];
    }

    document.open()
    document.write(htmlContent);
}

document.getElementById("export").addEventListener("click", () => {
    window.print()
});
    
let functionButton = document.getElementById("functionButton");
    
functionButton.addEventListener("click", () => {
    let mode = functionButton.innerText;
    buttonRender(mode);
})
