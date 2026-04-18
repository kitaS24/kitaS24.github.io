//NO AI/LLM/GPT MODEL WAS USED!


/* COMMIT MESSAGE:
 * Fix: CPU paddle behavior in edge cases. Interpolation. Ball-Paddle collision
 * Add: debug state, multiple ball support
 * Change: ball velocity during restart
 *
 */

let Score = [0, 0];

let DiffModif = {}
const HookeD = 0.7;

const PxToM = 10;


let screenScale = 2;

//DEBUG
let DebugCtx = null;

const DEBUG = false;

function intersect(a, b) {
    return (
        a.minX <= b.maxX &&
        a.maxX >= b.minX &&
        a.minY <= b.maxY &&
        a.maxY >= b.minY
    );
}

function Dist(p1,p2){
    let v=[p1[0]-p2[0],p1[1]-p2[1]];
    return Math.sqrt(v[0]*v[0]+v[1]*v[1]);
}


function Predict(pos,vel,a) {

    if(DEBUG) {
        DebugCtx.strokeStyle = "red";
        DebugCtx.beginPath();
        DebugCtx.moveTo(screenScale*pos[0], screenScale*pos[1]);
    }

    let bounced = false;
    while (!bounced) {
        if(DEBUG) {DebugCtx.lineTo(screenScale*pos[0],screenScale*pos[1]);}
        pos[0] += vel[0]*a;
        pos[1] += vel[1] * a;

        if(DiffModif.g){
            vel[1] += 9.8*a*PxToM;
        }

        if (pos[0] < 0 || pos[0] > 255 - 4) {
            if (pos[0] > 255 - 4) { bounced = true; }
            vel[0] *= -1;
        }


        if (pos[1] < 0 || pos[1] > 255 - 4) {
                vel[1] *= -1;
            }
        

    }
    //console.log(pos);
    if(DEBUG) {DebugCtx.stroke();}
    return pos;
}


function DottedLineY(x,c) {
    c.fillStyle = "#ffffff";
    for (let i = 0; i < 256;i+=8)
    c.fillRect(screenScale*x, screenScale*i, screenScale*2, screenScale*4);
}

function DashedPaddle(x,y,w,h,c){
    x=Math.floor(x);
    y=Math.floor(y);
    w=Math.floor(w);
    h=Math.floor(h);
    c.fillStyle = "#ffffff";
    for (let i = y; i < y+h;i++) {
        if(i&1) {
            c.fillRect(screenScale*x, screenScale*i, screenScale*w, screenScale*1);
        }
    }
}

function DrawBuffer(x, y, buffer, w, h,c) {
    c.fillStyle = "#ffffff";
    for (let ix = 0; ix < w; ix++) {
        for (let iy = 0; iy < h; iy++) {
            if (buffer[ix + iy * w] ==1) {
                c.fillRect(screenScale*(x + ix), screenScale*(y + iy), screenScale*1, screenScale*1);
            }
        }
    }
}

function DrawScore(x, y, n,c) {
    let Nums = [
        [   1, 1, 1,
            1, 0, 1,
            1, 0, 1,
            1, 0, 1,
            1, 1, 1
        ],
        [0, 1, 0,
            1, 1, 0,
            0, 1, 0,
            0, 1, 0,
            1, 1, 1
        ],
        [1, 1, 1,
            0, 0, 1,
            1, 1, 1,
            1, 0, 0,
            1, 1, 1
        ],
        [1, 1, 1,
            0, 0, 1,
            0, 1, 1,
            0, 0, 1,
            1, 1, 1
        ],
        [1, 0, 1,
            1, 0, 1,
            1, 1, 1,
            0, 0, 1,
            0, 0, 1
        ],
        [1, 1, 1,
            1, 0, 0,
            1, 1, 1,
            0, 0, 1,
            1, 1, 1
        ],
        [1, 1, 1,
            1, 0, 0,
            1, 1, 1,
            1, 0, 1,
            1, 1, 1
        ],
        [1, 1, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1
        ],
    ]

    DrawBuffer(x, y, Nums[n], 3, 5, c);
}

class Paddle {

    constructor() {

        this.realPos = [0,0];
        this.realVel = [0,0];

        this.pos = [0, 0];
        this.height = 32;
        this.Type = 0;
        this.lastMoveT = 0;
        this.a = [0, 0];


        this.CpuPaddleAvg = [0,0];

        let IsDown = false;
        let IsUp = false;




      

        
        $(document).on('keydown', (event) => {
            const key = event.key.toLowerCase();
            if (this.Type == 0) {
                if (key === 'w') {
                    this.IsUp = true;
                }
                if (key === 's') {
                    this.IsDown = true;
                }
            }
        });
        $(document).on('keyup', (event) => {
            const key = event.key.toLowerCase();
            if (this.Type == 0) {
                if (key === 'w') {
                    this.IsUp = false;
                }
                if (key === 's') {
                    this.IsDown = false;
                }
            }
        });
    }


    Frame(TPS) {
        this.LastTps = TPS;

        this.lastMoveT -= 1 / TPS;
        if (this.Type == 1) {
            //this.pos[1] = Ball1.pos[1]-this.height/2;

            let clD = 10000;
            let clId = 0;
            for (let i = 0; i < Ball1.length; i++) {
                let tmp_d = Dist(this.realPos,Ball1[i].pos);
                if(tmp_d <clD){
                    clD = tmp_d;
                    clId = i;
                }
            }

            let closestPos = [Ball1[clId].pos[0], Ball1[clId].pos[1]];
            let closestVel = [Ball1[clId].vel[0], Ball1[clId].vel[1]];
            if (this.lastMoveT <= 0) {


                let b = 3;
                if (closestPos[0] > 128) {
                    b = 1.5;
                }
                if (closestPos[0] > 200) {
                    b = 0.4;
                }
                if(DiffModif.g){b = 0.5;}
                if(DiffModif.diff){b = 0.2;}

                this.a = Predict(closestPos, closestVel,b);
                this.lastMoveT += 0.3;
            }

            if(DiffModif.g && DiffModif.hooke){
                let x=1;
                if(Math.abs(this.realVel[1]) >Math.max(255-closestPos[0],50)){x=-1;}
                if (this.a[1] - this.height / 2 > this.CpuPaddleAvg[1]) {
                    this.pos[1] += (80 / this.LastTps)*x;
                }
                if (this.a[1] - this.height / 2 < this.CpuPaddleAvg[1]) {
                    this.pos[1] -= (80 / this.LastTps)*x;
                }
            }else {
                if (this.a[1] - this.height / 2 > this.pos[1]) {
                    this.pos[1] += 80 / this.LastTps;
                }
                if (this.a[1] - this.height / 2 < this.pos[1]) {
                    this.pos[1] -= 80 / this.LastTps;
                }
            }

            this.CpuPaddleAvg[0] *=0.9;
            this.CpuPaddleAvg[1] *=0.9;

            this.CpuPaddleAvg[0] +=this.realPos[0]*0.1;
            this.CpuPaddleAvg[1] +=this.realPos[1]*0.1;




        }


        if (this.Type == 0) {
            if (this.IsDown) {
                this.pos[1] += 80 / this.LastTps;
            }
            if (this.IsUp) {
                this.pos[1] -= 80 / this.LastTps;
            }
        }
        if (this.pos[1] < 0) { this.pos[1] = 0; }
        if (this.pos[1] > 256 - this.height) { this.pos[1] = 256 - this.height; }

        if(DiffModif.hooke){

            if(DiffModif.g){
                this.realVel[1] += 9.8*5;
            }
            this.realVel[1] -= (this.realPos[1]-this.pos[1])*HookeD;
            this.realVel[1] *= 0.97;

            this.realPos[0] = this.pos[0];
            this.realVel[0]=0;

        }else {
            this.realPos[0] = this.pos[0];
            this.realPos[1] = this.pos[1];

            this.realVel[0]=0;
            this.realVel[1]=0;
        }

        this.realPos[0] += this.realVel[0]/TPS;
        this.realPos[1] += this.realVel[1]/TPS;

    }

    Draw(c) {

        if(DiffModif.hooke){
            /*
            c.fillStyle = "#ffffff22";
            c.fillRect(this.pos[0], this.pos[1], 4, this.height);
             */
            DashedPaddle(this.pos[0], this.pos[1], 4, this.height,c);
        }

        c.fillStyle = "#ffffff";
        c.fillRect(screenScale*this.realPos[0], screenScale*this.realPos[1], screenScale*4, screenScale*this.height);
        if(DEBUG) {
            c.fillStyle = "#f00";
            c.fillRect(screenScale*this.CpuPaddleAvg[0], screenScale*this.CpuPaddleAvg[1], screenScale*2, screenScale*2);
        }
        }
}

class Ball {

    constructor() {
        this.pos = [8, 8];
        this.vel = [64, 32];

        this.Restart();
    }

    Restart() {
        //restart
        this.pos = [128, 128];

        //TODO: remove legacy code

        /*LEGACY
        if (Math.random() >= 0.5) {
            this.vel[0] = 64;
        } else {
            this.vel[0] = -64;
        }*/
        this.vel[0] = Math.random() * 256 - 128;

        this.vel[1] =0;
        while(this.vel[1] < 16 && this.vel[1] >-16) {
            /*LEGACY
            if (Math.random() >= 0.5) {
                this.vel[1] += 64
            } else {
                this.vel[1] -= 64;
            }
            if (Math.random() >= 0.5) {
                this.vel[1] += 32
            } else {
                this.vel[1] -= 32;
            }
            if (Math.random() >= 0.5) {
                this.vel[1] += 16
            } else {
                this.vel[1] -= 16;
            }
            if (Math.random() >= 0.5) {
                this.vel[1] += 8;
            } else {
                this.vel[1] -= 8;
            }*/
            this.vel[1] = Math.random() * 256 - 128;
        }

        let D = Math.sqrt(this.vel[0]*this.vel[0]+this.vel[1]*this.vel[1]);
        this.vel[0] /= D;this.vel[1] /= D;
        if(DiffModif.bs){
            this.vel[0] *= 128;this.vel[1] *= 128;
        }else {
            this.vel[0] *= 64;this.vel[1] *= 64;
        }


        //this.vel[1] = Math.random() * 256 - 128;
    }

    Frame(TPS) {
        this.pos[0] += this.vel[0] / TPS;
        this.pos[1] += this.vel[1] / TPS;

        if(DiffModif.g){
            this.vel[1] += 9.8/TPS*PxToM;
        }



        //collision paddle

        let bc = {
            minX: this.pos[0], maxX: this.pos[0] + 4,
            minY: this.pos[1], maxY: this.pos[1] + 4};
        let p1c = {
            minX: Paddle1.realPos[0], maxX: Paddle1.realPos[0] + 4,
            minY: Paddle1.realPos[1], maxY: Paddle1.realPos[1] + Paddle1.height
        };
        let p2c = {
            minX: Paddle2.realPos[0], maxX: Paddle2.realPos[0] + 4,
            minY: Paddle2.realPos[1], maxY: Paddle2.realPos[1] + Paddle2.height
        };

        if (intersect(bc, p1c)) {
            this.vel[0] *= -1; this.pos[0] +=this.vel[0]/(TPS/2);
        }
        if (intersect(bc, p2c)) {
            this.vel[0] *= -1; this.pos[0] +=this.vel[0]/(TPS/2);
        }

        //dumb collision

        if (this.pos[0] < 0 || this.pos[0] > 255 - 4) {
            this.vel[0] *= -1;

            if (this.pos[0] < 0) { Score[1]++; }
            if (this.pos[0] > 255 - 4) { Score[0]++; }

            //restart
            this.Restart();
        }
        if (this.pos[1] < 0 || this.pos[1] > 255 - 4) {
            this.vel[1] *= -1;
        }



        
    }

    Draw(c) {
        c.fillStyle = "#ffffff";
        c.fillRect(screenScale*this.pos[0], screenScale*this.pos[1], screenScale*4,  screenScale*4);
    }
}



let Paddle1 = new Paddle();
let Paddle2 = new Paddle();
let Ball1 = [];
Ball1.push(new Ball());


Paddle2.pos = [256 - 4, 0];
Paddle2.Type = 1;


let halt = false;

function Draw(TPS) {
    const c = document.getElementById("canvas");
    const ctx = c.getContext("2d");
    DebugCtx = ctx;

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, screenScale*256, screenScale*256);
    DottedLineY(128, ctx);

    Score[0] = Math.min(Score[0],7);
    Score[1] = Math.min(Score[1],7);

    DrawScore(128-7, 4, Score[0], ctx);
    DrawScore(128 + 5, 4, Score[1], ctx);

    if (Score[0] >= 7) {
        halt = true;
    }
    if (Score[1] >= 7) {
        halt = true;
    }




    Paddle1.Frame(TPS);
    Paddle2.Frame(TPS);
    for (let i=0;i<Ball1.length;i++) {
        Ball1[i].Frame(TPS);
    }


    Paddle1.Draw(ctx);
    Paddle2.Draw(ctx);
    for (let i=0;i<Ball1.length;i++) {
        Ball1[i].Draw(ctx);
    }

}


setInterval(function e() {

    DiffModif.bs=$("#flag-bs").is(':checked');
    DiffModif.diff=$("#flag-diff").is(':checked');
    DiffModif.hooke=$("#flag-hooke").is(':checked');
    DiffModif.g=$("#flag-g").is(':checked');
    DiffModif.BNum=$("#val-bn").val();


    if (!halt) {
        Draw(30);
        $("#g").hide(0);
    } else {
        $("#g").show(0);
    }
},1000/30)


$("#btn-reset").click(function (){

    Paddle1 = new Paddle();
    Paddle2 = new Paddle();
    Ball1 = [];

    //setup
    Paddle2.pos = [256 - 4, 0];
    Paddle2.Type = 1;

    for (let i = 0; i < DiffModif.BNum; i++) {
        Ball1.push(new Ball());
    }
    Score = [0,0];
    halt=false;
})