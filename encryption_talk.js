"use strict;"

var DH_key_exchange = function () {

    const canvas_id="dh_key";
    const speed = 30;
    const width = window.innerWidth*0.8;
    const height = window.innerWidth*0.6;
    const radius = 50;
    const velocity = width/100;
    var canvas = document.getElementById(canvas_id);
    var ctx; //drawing context
    var raf; //request animation frame
    var balls = {}

    var generate_ball = function(x, y, color, label) {
        return {
            x: x,
            y: y,
            request_x: x,
            request_y: y,
            request_color: color,
            velocity: velocity,
            color: color,
            label: label,

            draw: function() {
                let circle=new Path2D();
                circle.arc(this.x, this.y, radius, 0, 2*Math.PI);
                ctx.fillStyle = this.color;
                ctx.fillText(label, this.x, this.y+radius*3/2);
                ctx.fill(circle);
            },

            updatePosition: function() {
                let diff_x = this.request_x - this.x;
                let diff_y = this.request_y - this.y;

                if (Math.abs(diff_x) < this.velocity) {
                    this.x = this.request_x;
                }
                else {
                    this.x += Math.abs(diff_x)/diff_x * this.velocity;
                }

                if (Math.abs(diff_y) < this.velocity) {
                    this.y = this.request_y;
                }
                else {
                    this.y += Math.abs(diff_y)/diff_y * this.velocity;
                }
            },
        };
    };

    var animation_steps =[];

    /**
     * @brief IIFE startup and draw background.
     */
    (()=>{
        canvas.width = width;
        canvas.height = height;
        ctx = canvas.getContext('2d');
        ctx.font = '24px serif';
        ctx.textAlign = "center";

        //populate the animation
        nextAnimationStep();
        nextAnimationStep();
        draw();

        // set refresh rate
        setInterval(draw, speed);
        canvas.addEventListener('click', function() {
            nextAnimationStep()
          });
    })();

    function nextAnimationStep() {

        if (animation_steps.length === 0) {
            //reload the animation steps, push new animation steps onto the queue.
            animation_steps = [];
            animation_steps.push( ()=>{
                    balls = {
                        "ball1": generate_ball(width/6, height/3, "green", "key 1"), 
                        "ball2": generate_ball(width*5/6, height/3, "blue", "key 2")
                    }; 
                } );
            animation_steps.push( ()=>{
                    balls.ball1.request_x = width/2;
                    balls.ball1.request_y = height/2;
                    balls.ball2.request_x = width/2;
                    balls.ball2.request_y = height/2;
                });
            animation_steps.push( ()=>{
                    balls.ball1.request_x = width/6;
                    balls.ball1.request_y = height*2/3;
                    balls.ball2.request_x = width*5/6;
                    balls.ball2.request_y = height*2/3;
                });
            return;
        }

        //Pop the first step off the queue and run it.
        current_step = animation_steps.shift();
        current_step();

        if ( animation_steps.length === 0 ) {
            nextAnimationStep();
        }
    }

    function drawBackground() {
        ctx.beginPath();
        ctx.strokeStyle = "yellow";
        ctx.fillStyle = "yellow";
        ctx.fillText("Client", width/6, height/10);
        ctx.fillText("Server", width*5/6, height/10);
        ctx.fillText("Public Internet", width/2, height/10);
        ctx.setLineDash([4, 2]);
        ctx.moveTo(width/3, 0);
        ctx.lineTo(width/3, height);
        ctx.moveTo(width*2/3, 0);
        ctx.lineTo(width*2/3, height);
        ctx.stroke();
    };

    function draw() {
        ctx.clearRect(0,0, canvas.width, canvas.height);
        drawBackground();
        Object.keys(balls).forEach((key)=>{
            balls[key].updatePosition();
            balls[key].draw();
        });
    }

    

    return {

    };
};

//Set up Diffie-Hellman part of presentation on page.
var DH_draw = DH_key_exchange();