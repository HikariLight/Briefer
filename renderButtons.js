const buttonRender = (mode) => {
    let htmlContent = "";
    
    let data = JSON.parse(window.localStorage.getItem("tabs"))[0];
    
    if(mode === "simplify"){
        htmlContent = data["simplifierRender"];
    }
    else if(mode === "summarise"){
        htmlContent = data["summariserRender"];
    }
    
    // This stupid thing won't work -_-
    // document.open()
    // document.write(htmlContent);

    window.close();
    let newWindow = window.open();
    newWindow.document.write(htmlContent);
}

document.getElementById("export").addEventListener("click", () => {
    window.print()
});
    
let functionButton = document.getElementsByClassName("functionButton")[0];
    
functionButton.addEventListener("click", () => {
    let mode = functionButton.id;
    buttonRender(mode);
})
