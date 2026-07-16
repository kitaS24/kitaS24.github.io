//NO AI/LLM/GPT MODEL WAS USED!

let Field =[];

let PlayerState = "alive";


function CheckIfDead(){
    if(PlayerState == "dead"){
        $("body").addClass("dead");
    }
}

function CheckWinState(){
    for (let i = 0; i < Field.length; i++) {
        for (let j = 0; j < Field[i].length; j++) {
            if(Field[i][j] == 0){
                return;
            }
        }
    }
    PlayerState = "win";
}

function Uncover(){
    $('.field-cell').each(function() {
            let x = $(this).index();
            let y = $(this).parent().index();
            if(Field[x][y] == -1){
                if($(this).hasClass("flag")){
                    $(this).addClass("BSpaceC");
                    $("#"+x+"-"+y).removeClass("flag");
                }else{
                    $(this).addClass("BSpace");
                }
            }
        }
    )
}


function IfB(x,y){
    if(x<0){return false;}
    if(y<0){return false;}

    if(x>=Field.length){return false;}
    if(y>=Field[x].length){return false;}

    if(Field[x][y] == -1){
        return true;
    }
    return false;
}

function CountB(x,y){
    let count = 0;
    count += IfB(x-1,y-1);
    count += IfB(x-1,y);
    count += IfB(x-1,y+1);
    count += IfB(x+1,y-1);
    count += IfB(x+1,y);
    count += IfB(x+1,y+1);
    count += IfB(x,y-1);
    count += IfB(x,y+1);
    return count;
}

function SetCellVal(x,y,v){
    if(v==0){return;}
    $("#"+x+"-"+y).html("<span class='n"+v+"' >"+v+"<\span>");
}

function UncoverField(x,y,byUser){
    if(x<0){return;}
    if(y<0){return;}

    if(x>=Field.length){return;}
    if(y>=Field[x].length){return;}

    if(Field[x][y] == 0 && byUser){
        $("#"+x+"-"+y).addClass("FreeSpace");
        $("#"+x+"-"+y).removeClass("flag");
        SetCellVal(x,y,CountB(x,y));
        Field[x][y] = 1;
        UncoverField(x-1,y,false);
        UncoverField(x,y-1,false);
        UncoverField(x+1,y,false);
        UncoverField(x,y+1,false);
    }
    if(Field[x][y] == -1 && byUser){
        PlayerState = "dead";
        Uncover();
    }
    if(Field[x][y] == 0 && !byUser){

        if($("#"+x+"-"+y).hasClass("flag")){return;}

        $("#"+x+"-"+y).addClass("FreeSpace");
        $("#"+x+"-"+y).removeClass("flag");
        SetCellVal(x,y,CountB(x,y));
        Field[x][y] = 2;

        if(CountB(x,y) !=0){return;}

        UncoverField(x-1,y,false);
        UncoverField(x,y-1,false);
        UncoverField(x+1,y,false);
        UncoverField(x,y+1,false);
    }
    CheckIfDead();
    CheckWinState();
    if(PlayerState == "dead"){$("#state").html("DEAD!")}
    if(PlayerState == "win"){$("#state").html("YOU WON!")}
    if(PlayerState == "alive"){$("#state").html("you are STILL ALIVE!")}
}

function D(x1,x2,y1,y2){
    return Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
}

function GenField(w,h,id){
    for (let j=0;j<h;j++){
        $("#"+id).append("<tr class='field-row'></tr>");
    }

    for (let i=0;i<w;i++){
        $(".field-row").append("<td class='field-cell'></td>");
    }

    $('.field-cell').on('click', function() {
        let x = $(this).index();
        let y = $(this).parent().index();

        if(PlayerState == "dead"){return;}
        UncoverField(x,y,true);
    });

    $('.field-cell').on("contextmenu", function (event) {
        if(PlayerState == "dead"){return;}
        event.preventDefault();
        $(this).toggleClass("flag");
    });

    //index
    $('.field-cell').each(function() {
            let x = $(this).index();
            let y = $(this).parent().index();
            $(this).attr("id",x+"-"+y);
        }
    )


    for (let j=0;j<w;j++){
        let OneC = [];
        for (let i=0;i<h;i++){
            //if(Math.random()<0.7*(D(w/2,h/2,j,i)/D((w/2),0,(h/2),0)) ^Math.random()<0.5) {
            if(Math.random()<0.2) {
                OneC.push(-1);
            }else{
                OneC.push(0);
            }
        }
        Field.push(OneC);
        OneC = [];
    }
}

GenField(30,20,"field");


$("#reset").click(function(){
    Field = [];
    $("#field").html("");
    GenField(30,20,"field");
    PlayerState = "alive";

    $("body").removeClass("dead");
})