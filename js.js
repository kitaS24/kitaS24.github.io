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

$("#headPopup").mouseover( function e(){SelectPanel = true;IgnoreTouchscreen=true;});
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

$("#ButtonHome").click(function e(){
        document.getElementById("content").src = "pages/home.html";
    });
$("#ButtonAboutMe").click(function e(){
        document.getElementById("content").src = "pages/about.html";
    });
$("#ButtonMyProjects").click(function e(){
        window.location.replace("pages/projects.html");
    });
$("#ButtonMyPages").click(function e(){
        document.getElementById("content").src = "pages/pages.html";
    });
$("#ButtonLinks").click(function e(){
        FullscreenBlur(true);
        document.getElementById("InfoLinks").style.top = "50%";
    });
$("#ButtonLinksClose").click(function e(){
        FullscreenBlur(false);
        document.getElementById("InfoLinks").style.top = "150%";
    });
$("#ButtonMyArticles").click(function e(){
        document.getElementById("content").src = "pages/articles/all_articles.html";
    });
$("#ButtonJsGames").click(function e(){
    document.getElementById("content").src = "pages/games/all_games.html";
});

// history
let History=[];

setInterval(function e(){

    if(History[History.length-1] !=document.getElementById("content").contentWindow.location.href){
        History.push(document.getElementById("content").contentWindow.location.href);

    }
    $("#ButtonBack").prop("disabled", History.length<=1);
},500);

$("#ButtonBack").click(function e(){
    $("#ButtonBack").prop("disabled",History.length<=1);
        if(!$("#ButtonBack").prop("disabled")){
            History.pop();
            document.getElementById("content").contentWindow.location.href =History[History.length-1];
        }
    $("#ButtonBack").prop("disabled", History.length<=1);
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
    $("#SharedPopup").slideDown(0);
    //document.getElementById("SharedPopup").style.display = "block";
    document.getElementById("content").contentWindow.location.href = a;
    });

$("#SharedPopupClose").click(function a() {
    $("#SharedPopup").hide("clip",{},1000)
});

$("#ButtonShare").click(function e(){
        const url = new URL(window.location.href);
        url.searchParams.set("sharedpage", document.getElementById("content").contentWindow.location.pathname);
        $("#ButtonShare").text("COPIED!");

        setTimeout(function e(){
            $("#ButtonShare").text("SHARE PAGE");
        },1000);
        navigator.clipboard.writeText(url.toString())
            .catch(() => {
                $("#ButtonShare").text("FAILED TO COPY");
                setTimeout(function e(){
                    $("#ButtonShare").text("SHARE PAGE");
                },1000);
            });
});

$("#SharedPopup").hide(0);