//alert("working!");


let SelectPanel = true;
let PanelPos = 0;
let IgnoreTouchscreen = false;

//https://easings.net/#easeInOutBack
function easeInOutBack(x) {
    const c1 = 1.70158;
    const c2 = c1 * 1.525;

    return x < 0.5
        ? (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
        : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;

}

function FullscreenBlur(val){
    if(val) {
        document.getElementById("fullscreenBlur").style.opacity = "1";
    }else{
        document.getElementById("fullscreenBlur").style.opacity = "0";
    }
}

function UpdateSelectPanel(){
    let Delta=1/60;
    if(SelectPanel) {
        PanelPos += Delta*1.6;
    }else{
        PanelPos -= Delta*1.2;
    }
    if(PanelPos >-0.2){PanelPos=-0.2;}
    if(PanelPos <-1){PanelPos=-1;}

    let a=-easeInOutBack(-PanelPos);
    if(a >0){a=0;}
    document.getElementById("headPopup").style.left = a*20+"%";
    if(a <-1){a=-1;}
    document.getElementById("content").style.left = a*20+25+"%";
}

setInterval(UpdateSelectPanel,1000/60);

document.getElementById("headPopup").addEventListener("mouseover", function e(){SelectPanel = true;IgnoreTouchscreen=true;});
document.getElementById("headPopup").addEventListener("mouseout", function e(){SelectPanel = false;});
document.getElementById("headPopup").addEventListener("click", function e(){
    if(!IgnoreTouchscreen) {
        SelectPanel = !SelectPanel;
    }
});//for touchscreen devices
document.getElementById("headPopupOpenClose")
    .addEventListener("click", function e(){
        if(IgnoreTouchscreen) {
            SelectPanel = !SelectPanel;
        }
    });//again for touchscreen DEVICES


//menu buttons
document.getElementById("ButtonHome")
    .addEventListener("click", function e(){
        document.getElementById("content").src = "pages/home.html";
    });
document.getElementById("ButtonAboutMe")
    .addEventListener("click", function e(){
        document.getElementById("content").src = "pages/about.html";
    });
document.getElementById("ButtonMyProjects")
    .addEventListener("click", function e(){
        window.location.replace("pages/projects.html");
    });
document.getElementById("ButtonMyPages")
    .addEventListener("click", function e(){
        document.getElementById("content").src = "pages/pages.html";
    });
document.getElementById("ButtonLinks")
    .addEventListener("click", function e(){
        FullscreenBlur(true);
        document.getElementById("InfoLinks").style.top = "50%";
    });
document.getElementById("ButtonLinksClose")
    .addEventListener("click", function e(){
        FullscreenBlur(false);
        document.getElementById("InfoLinks").style.top = "150%";
    });
document.getElementById("ButtonMyArticles")
    .addEventListener("click", function e(){
        document.getElementById("content").src = "pages/articles/all_articles.html";
    });

// history
let History=[];

setInterval(function e(){

    if(History[History.length-1] !=document.getElementById("content").contentWindow.location.href){
        History.push(document.getElementById("content").contentWindow.location.href);

    }
        document.getElementById("ButtonBack").disabled = History.length<=1;
},500);

document.getElementById("ButtonBack")
    .addEventListener("click", function e(){
        document.getElementById("ButtonBack").disabled = History.length<=1;
        if(!document.getElementById("ButtonBack").disabled){
            History.pop();
            document.getElementById("content").contentWindow.location.href =History[History.length-1];
        }
        document.getElementById("ButtonBack").disabled = History.length<=1;
    });




////

window.addEventListener("load", function e(){
    const params = new URLSearchParams(window.location.search);
    const a = params.get("sharedpage");
    if (
        !a ||
        !a.startsWith("/pages/") ||
        a.includes("://") ||
        a.includes("..")
    ) {
        return;
    }
    document.getElementById("SharedPopup").style.display = "block";
    document.getElementById("content").contentWindow.location.href = a;
    });

document.getElementById("ButtonShare")
    .addEventListener("click", function e(){
        const url = new URL(window.location.href);
        url.searchParams.set("sharedpage", document.getElementById("content").contentWindow.location.pathname);
        document.getElementById("ButtonShare").innerHTML = "COPIED!";

        setTimeout(function e(){
            document.getElementById("ButtonShare").innerHTML = "SHARE PAGE";
        },1000);
        navigator.clipboard.writeText(url.toString())
            .catch(() => {
                document.getElementById("ButtonShare").innerHTML = "FAILED TO COPY";
                setTimeout(function e(){
                    document.getElementById("ButtonShare").innerHTML = "SHARE PAGE";
                },1000);
            });
});