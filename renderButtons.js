document.getElementById("export").addEventListener("click", () => {
    window.print()
});

document.getElementsByClassName("functionButton")[0].addEventListener("click", () => {
    
    let htmlContent = "";
    let mode = document.getElementsByClassName("functionButton")[0].id;
    let data = JSON.parse(window.localStorage.getItem("tabs"))[0];
    
    if(mode === "simplify"){
        htmlContent = data["simplifierRender"];
    }
    else if(mode === "summarise"){
        htmlContent = data["summariserRender"];
    }

    document.open();
    document.write(htmlContent);
})
