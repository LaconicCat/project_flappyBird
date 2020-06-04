(function(){
    //背景类
    var Background = window.Background = function(){
        //自己的背景
        this.image = game.R.bg_day;
        this.windowHeight = parseFloat(game.canvas.style.height);
        this.windowWidth = parseFloat(game.canvas.style.width); 
        this.y = 0.8 * (this.windowHeight - 512);
        this.w = 288;
        this.h = 512;
        this.x = 0;
        this.speed = 1;
    }
    //渲染
    Background.prototype.render = function(){
        let height = 0;
        //渲染图片，因为图片不够宽，克隆几张图片
        game.ctx.drawImage(this.image, this.x, this.y);
        game.ctx.drawImage(this.image, this.x + this.w, this.y);
        game.ctx.drawImage(this.image, this.x + 2*this.w, this.y);
        //渲染猫腻矩形
        game.ctx.fillStyle = "#4EC0CA";
        game.ctx.fillRect(0, 0, this.windowWidth, this.y+10);
        game.ctx.fillStyle = "#ef655a";
    }
    //运动
    Background.prototype.update = function(){
        this.x -= this.speed;
        //跑马灯，克隆图片，等克隆图片到达边线，瞬间拉回
        if(this.x < -this.w){
            this.x = 0;
        }
    }
})();