(function(){
    //管子类
    var Pipe = window.Pipe = function(){
        this.imageUp = game.R.pipe_up;
        this.imageDown = game.R.pipe_down;
        this.windowHeight = parseFloat(game.canvas.style.height);
        this.windowWidth = parseFloat(game.canvas.style.width); 
        
        //总高，上面管子的高度 + 空隙 + 下面管子高度
        this.allHight = this.windowHeight * 0.8;
        //空隙
        this.interspace = 160;
        //图片高度
        this.h = 320;
        //随机上管子高度
        this.topHeight = parseInt(Math.random() * (this.h - 100)) + 100;
        //下管子高度
        this.bottomHeight = this.allHight - this.interspace - this.topHeight;
        //下馆子高度超过this.h的时候，规定切片用的高为this.h
        this.cutBottomHeight = Math.min(this.bottomHeight, this.h);       
        //自己的位置
        this.x = this.windowWidth;
        this.alreadyPass = false;
        //将自己推入管子数组
        game.pipeArr.push(this);
    }
    //渲染
    Pipe.prototype.render = function(){
        //上边的管子，开口向下
        game.ctx.drawImage(this.imageDown, 0, this.h - this.topHeight, 52, this.topHeight, this.x, 0, 52, this.topHeight);
        game.ctx.drawImage(this.imageUp, 0, 0, 52, this.cutBottomHeight, this.x, this.topHeight + this.interspace, 52, this.bottomHeight);
        //打印自己的数值
        game.ctx.fillStyle = "black";
        game.ctx.fillText(this.topHeight, this.x + 12, this.topHeight + 14);
        game.ctx.fillText(this.topHeight + this.interspace, this.x + 12, this.topHeight + this.interspace - 4);
    }
    //运动
    Pipe.prototype.update = function(){
        this.x -= 2;
        //碰撞检测
        if(game.bird.R > this.x && game.bird.L < this.x + 52){
            if(game.bird.T < this.topHeight || game.bird.B > this.allHight - this.bottomHeight){
                //死亡就进入场景四
                game.sm.enter(4);
            }
        }
        //加分,检测是否被通过过
        if(game.bird.R > this.x + 52 && !this.alreadyPass){
            game.score ++;
            this.alreadyPass = true;
        }
        //检测管子是否已经出了视口，如果是就要删除
        if(this.x < -52){
            for (let i = 0; i < game.pipeArr.length; i++) {
                if(this === game.pipeArr[i]){
                    game.pipeArr.splice(i, 1);
                }
            }
        }
    }
})();