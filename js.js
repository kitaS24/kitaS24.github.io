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
    return;
    //no blur here
    if(val) {
        document.getElementById("fullscreenBlur").style.opacity = "1";
    }else{
        document.getElementById("fullscreenBlur").style.opacity = "0";
    }
}

/*function UpdateSelectPanel(){
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
*/
//setInterval(UpdateSelectPanel,1000/60);

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
    window.location.href = "pages/projects.html";
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
    window.location.href = "pages/games/all_games.html";
});

$("#ButtonLinux").click(function e(){
    window.location.href = "index2.html";
});

$("#ButtonShoutbox").click(function e(){
    document.getElementById("content").src = "pages/shoutbox.html";
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
        $("#ButtonShare").addClass("CopyTrue");

        setTimeout(function e(){
            $("#ButtonShare").removeClass("CopyTrue");
        },1000);
        navigator.clipboard.writeText(url.toString())
            .catch(() => {
                //$("#ButtonShare").text("FAILED TO COPY");
                setTimeout(function e(){
                    //$("#ButtonShare").text("SHARE PAGE");
                },1000);
            });
});

$("#SharedPopup").hide(0);

function detectMob() {
    const toMatch = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i
    ];

    return toMatch.some((toMatchItem) => {
        return navigator.userAgent.match(toMatchItem);
    });
}

function detectMob2() {
    return ( ( window.innerWidth <= 800 ) && ( window.innerHeight <= 600 ) );
}

if(detectMob() || detectMob2()){
    window.location.replace("indexphone.html");
}

{
    let Arr = [
        "The grass is the greenest wherever you water it",
        "Online since Feb 2026",
        "Rolled back 30 years",
        "It just works",
        "No AI!",
        "No Microsoft bloat",
        "No Copilot",
        "No ADS",
        "No installation needed",
        "Truly MySpace",
        "IRC IRC IRC",
        "https://noai.duckduckgo.com/",
        "Even Microsoft uses Linux",
        "AI is expensive, so don't use it",
        "Check it out!",
        "sudo apt upgrade",
        "10 HOME <br> 20 SWEET <br> 30 GOTO 10",
        "Google, I am not a robot",
        "It just works, without a Microsoft account",
        "sv_cheats 1",
        "HALF-LIFE",
        "undefined?",
        "null?",
        "0x48 0x65 0x6C 0x6C 0x6F 0x2C 0x20 0x57 0x6F 0x72 0x6C 0x64 0x21",
        "Crowbar",
        "C++",
        "OpenGL",
        "It starts with...",
        "But in the end, it doesn't even matter",
        "Can it run Doom?",
        "Fix 1 bug, get 20 new instead",
        "This message changes with each page load",


    ];

    let LastIndexes = [];
    if(localStorage.getItem("msgs") != null){
        LastIndexes =JSON.parse(localStorage.getItem("msgs"));
    }
    console.log(LastIndexes);
    if(LastIndexes.length >15){
        LastIndexes.shift();
    }

    let x = -1;
    while(x ==-1 || LastIndexes.includes(x)) {
        x = Math.floor(Math.random() * Arr.length);
    }
    if(LastIndexes.length ==0){x=1;}
    if(LastIndexes.length ==1){x=31;}

    LastIndexes.push(x);
    localStorage.setItem("msgs",JSON.stringify(LastIndexes));
    //let x = Arr.length-1;

    $("#head-scroll").html(Arr[x]);
    if(Arr[x] == "10 HOME <br> 20 SWEET <br> 30 GOTO 10") {
        $("#head-scroll").css("font-size", "6px");
        $("#head-scroll").css("font-weight", "bold");
    }
    if(Arr[x] == "HALF-LIFE") {
        $("#head-scroll").css("color", "#fb7e14");
    }
}