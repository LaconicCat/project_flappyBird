(function(){
    //背景类
    var Land = window.Land = function(){
        //自己的背景
        this.image = game.R.land;
        this.windowHeight = parseFloat(game.canvas.style.height);
        this.windowWidth = parseFloat(game.canvas.style.width); 
        
        //图片宽度
        this.w = 336;
        //图片位置
        this.x = 0;
        this.y = this.windowHeight * 0.8;
        this.speed = 1;
    }
    //渲染
    Land.prototype.render = function(){
        game.ctx.drawImage(this.image, this.x, this.y);
        game.ctx.drawImage(this.image, this.x + this.w, this.y);
        game.ctx.drawImage(this.image, this.x + this.w*2, this.y);
        //猫腻矩形
        game.ctx.fillStyle = "#ded895";
        game.ctx.fillRect(0, this.y + 100, this.windowWidth, this.windowHeight*0.2 - 100);
    }
    //运动
    Land.prototype.update = function(){
        this.x -= 2;
        if(this.x < -this.w){
            this.x = 0;
        }
    }
})();