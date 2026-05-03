//18x9

function AddIconFile(x,y,id,name){
    $("body").append("<div id='"+id+"' class='icon-file'><p class='filetext'>"+name+"</p></div>");

    let a = $("#"+id);
    a.css({"top": y*5.5+2+"vw","left": x*5.5+"vw"});

}
function AddIconExe(x,y,id,name){
    $("body").append("<div id='"+id+"' class='icon-exe'><p class='filetext'>"+name+"</p></div>");

    let a = $("#"+id);
    a.css({"top": y*5.5+2+"vw","left": x*5.5+"vw"});

}
function AddIconFolder(x,y,id,name){
    $("body").append("<div id='"+id+"' class='icon-folder-d'><p class='filetext'>"+name+"</p></div>");

    let a = $("#"+id);
    a.css({"top": y*5.5+2+"vw","left": x*5.5+"vw"});

}
function AddIconFolderGit(x,y,id,name){
    $("body").append("<div id='"+id+"' class='icon-folder-git'><p class='filetext'>"+name+"</p></div>");

    let a = $("#"+id);
    a.css({"top": y*5.5+2+"vw","left": x*5.5+"vw"});

}

function NewPg(pg){
    let h = "<div class='window-div'><button class='winclosebtn' onclick='$(this).parent().hide(0)'>X</button><iframe class='window' src='"+pg+"'></iframe></div>";
    let w=$( h ).appendTo( "body" );
    w.css({"width":"75vw","height":"75vh"})
    w.draggable();
    w.resizable();

}

function ChangePage(page){
    //window.location.replace(page);
    document.location.href = page;
}


AddIconFolder(0,0,"fo1","articles");
AddIconFile(1,5,"fi1","README.txt");
AddIconExe(16,4,"exe1","GAMES");
AddIconExe(16,5,"exe2","wallpaper");
AddIconFolderGit(2,7,"git1","GIT");

function RandBg(){
    let a = Math.floor(Math.random()*5);
    $("body").removeClass("kali");
    $("body").removeClass("ubuntu");
    $("body").removeClass("xfce2");
    $("body").removeClass("kali2");

    if(a == 1){
        $("body").addClass("kali");
    }
    if(a == 2){
        $("body").addClass("ubuntu");
    }
    if(a == 3){
        $("body").addClass("xfce2");
    }
    if(a == 4){
        $("body").addClass("kali2");
    }
}

$("#fo1").on("click",function(){NewPg("pages/articles/all_articles.html")});
$("#fi1").on("click",function(){NewPg("index2readme.html")});
$("#exe1").on("click",function(){NewPg("pages/games/all_games.html")});
$("#git1").on("click",function(){ChangePage("https://github.com/kitaS24");});
$("#exe2").on("click",function(){RandBg();});