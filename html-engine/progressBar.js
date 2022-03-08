let progressBar = document.getElementById("progressBar");

// Gets the width in px
let width = parseInt(getComputedStyle(progressBar).getPropertyValue('width').replace(/px/g, ""));

const process = () => {
    console.log(width);
    if(width >= 300){
        clearInterval(progress);
    } else{

        width += 3;
        progressBar.innerText = (width / 3) + '%';
        progressBar.style.width = width + 'px';
    }
}

let progress = setInterval(process, 25);