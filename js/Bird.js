
(function(){
    var Bird = window.Bird = function(){
        //随机鸟的颜色
        this.color = parseInt(Math.random() * 6);
        //决定用图，小鸟用三种颜色，每个颜色有三种翅膀状态。
        this.imageArr = [
            game.R["bird" + this.color + "_0"],
            game.R["bird" + this.color + "_1"],
            game.R["bird" + this.color + "_2"],
            game.R["bird" + this.color + "_3"],
            game.R["bird" + this.color + "_4"],
            game.R["bird" + this.color + "_5"]
        ];
        //翅膀
        this.wingState = 0;
        //小鸟的位置（真实物理位置）
        this.width = game.canvas.clientWidth;
        this.height = game.canvas.clientHeight;
        this.x = this.width*0.382;
        this.y = this.height*0.382;
        //鸟帧数，用于下落上升算法
        this.fno = 0;
        this.r = 0;
        this.hasEnergy = false;
    }
    Bird.prototype.update = function(){
        this.wings();
        
        //算法要掉落
        if(!this.hasEnergy){
            this.y += this.fno * 0.6;
        } else {
            this.y -= 0.6 * (10 - this.fno);
            if(this.fno > 20){
                this.hasEnergy = false;
                this.fno = 0;
            }
        }
        this.r += 0.03;
        this.fno ++;
        
        if(this.y < 24){
            this.y = 24;
        } else if (this.y > this.height*0.8 - 14){
            this.y = this.height*0.8 - 14;
            this.r = 0;
        }

        //计算自己的四个碰撞检测值
        this.T = this.y - 12; //13 是图片的上空隙
        this.B = this.y + 12;
        this.R = this.x + 17;
        this.L = this.x - 17;
    }

    Bird.prototype.render = function(){
        game.ctx.save();
        game.ctx.translate(this.x, this.y);
        game.ctx.rotate(this.r);
        game.ctx.drawImage(this.imageArr[this.wingState], -24, -24);
        game.ctx.restore();
        
    }
    
    Bird.prototype.fly = function(){
        this.hasEnergy = true;
        this.r = -0.6;
        this.fno = 0;
    }

    Bird.prototype.wings = function(){
        if(game.fno % 5 === 0){
            this.wingState++;
            if(this.wingState > 2){
                this.wingState = 0;
            }
        }
    }
})();