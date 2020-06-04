(function(){
    var SceneManager = window.SceneManager = function(){
        //1表示欢迎屏幕，2表示教程，3表示游戏界面，4表示GameOver
        this.sceneNumber = 1;
        this.logoY = -48;
        this.button_playX = game.canvas.clientWidth/2 - 58;
        this.button_playY = game.canvas.clientHeight;
        //场景管理器负责实例化东西
        game.background = new Background();
        game.land = new Land();
        game.bird = new Bird();

        //添加监听
        this.bindEvent();
    }
    SceneManager.prototype.update = function(){
        switch(this.sceneNumber){
            case 1 :
                game.background.update();
                game.land.update();
                game.bird.wings();
                game.bird.x = game.canvas.clientWidth*0.5;
                game.bird.y = game.canvas.clientHeight*0.45;
                if(this.logoY < game.canvas.clientHeight*0.3){
                    this.logoY += 2;
                }
                if(this.button_playY > game.canvas.clientHeight*0.5){
                    this.button_playY -= 2;
                }
                break;
            case 2:
                game.bird.wings();
                game.bird.x = game.canvas.clientWidth/2;
                game.bird.y = game.canvas.clientHeight*0.382;
                game.land.update();
                game.background.update();
                game.fno % 5 === 0 && this.opacityIndex ++;
                if(this.opacityIndex >= this.opacityArr.length){
                    this.opacityIndex = 0;
                }
                break;
            case 3:
                game.bird.wings();
                game.bird.update();

                game.land.update();
                game.background.update();

                //负责处理管子
                game.fno % 150 === 0 && (new Pipe());
                for (let i = 0; i < game.pipeArr.length; i++) {
                    game.pipeArr[i].update();
                }
                
                break;
            case 4:
                this.maskOpacity -= 0.05;
                if(this.maskOpacity <= 0){
                    this.maskOpacity = 0;
                }
                if(game.bird.y > game.canvas.clientHeight * 0.8 - 24 ){
                    this.isBirdLand = true;
                }
                this.birdFno ++;
                if(!this.isBirdLand){
                    game.bird.y += 2 * this.birdFno;
                } else {
                    game.fno % 5 === 0 && this.boomNum ++;
                }
                break;
        }
        
    }
    SceneManager.prototype.render = function(){
        //更具当前是第几个场景来决定做什么
        switch(this.sceneNumber){
            case 1 :
                game.background.render();
                game.land.render();
                game.bird.render();
                game.ctx.drawImage(game.R["logo"], game.canvas.clientWidth/2 - 89, this.logoY);
                game.ctx.drawImage(game.R["button_play"], this.button_playX, this.button_playY);
                break;
            case 2 :
                game.background.render();
                game.land.render();
                game.bird.render();
                //tutorial wink
                game.ctx.save();
                game.ctx.drawImage(game.R["tutorial"], game.canvas.clientWidth/2 - 57, game.canvas.clientHeight*0.5);
                game.ctx.restore();
                break;
            case 3:
                game.background.render();
                game.land.render();
                game.bird.render();
                for (let i = 0; i < game.pipeArr.length; i++) {
                    game.pipeArr[i].render();
                }
                //打印分数
                var scroeLength = game.score.toString().length;
                //循环语句去设置图片的显示位置，基准位置是clientWidth/2 - 数字长度/2 * 每个字宽度
                for(var i = 0; i < scroeLength; i++){
                    game.ctx.drawImage(game.R["digit" + game.score.toString().charAt(i)], game.canvas.clientWidth / 2 - scroeLength/2 * 34 + 34 * i + 5, 20);
                }
                break;
            case 4:
                game.background.render();
                game.land.render();
                for (let i = 0; i < game.pipeArr.length; i++) {
                    game.pipeArr[i].render();
                }
                if(!this.isBirdLand){
                    game.bird.render();
                } else {
                    //渲染爆炸特效
                    if(this.boomNum <= 11){
                        game.ctx.drawImage(game.R["b" + this.boomNum], game.bird.x - 37, game.bird.y - 90);
                    } else {
                        this.enter(5);
                    }
                }

                game.ctx.fillStyle = "rgba(255, 255, 255,"+ this.maskOpacity +")";
                game.ctx.fillRect(0, 0, game.canvas.width, game.canvas.height);
                //打印分数
                var scroeLength = game.score.toString().length;
                //循环语句去设置图片的显示位置，基准位置是clientWidth/2 - 数字长度/2 * 每个字宽度
                for(var i = 0; i < scroeLength; i++){
                    game.ctx.drawImage(game.R["digit" + game.score.toString().charAt(i)], game.canvas.clientWidth / 2 - scroeLength/2 * 34 + 34 * i + 5, 20);
                }
                break;
            case 5:
                game.background.render();
                game.land.render();
                for (let i = 0; i < game.pipeArr.length; i++) {
                    game.pipeArr[i].render();
                }
                //打印分数
                var scroeLength = game.score.toString().length;
                //循环语句去设置图片的显示位置，基准位置是clientWidth/2 - 数字长度/2 * 每个字宽度
                for(var i = 0; i < scroeLength; i++){
                    game.ctx.drawImage(game.R["digit" + game.score.toString().charAt(i)], game.canvas.clientWidth / 2 - scroeLength/2 * 34 + 34 * i + 5, 20);
                }

                //渲染重新开始
                game.ctx.drawImage(game.R["game_over"], game.canvas.clientWidth/2 - 102, game.canvas.clientHeight*0.382 - 27);
                break;
                
        }
    }
    //进入某个场景
    SceneManager.prototype.enter = function(number){
        this.sceneNumber = number;
        switch(this.sceneNumber){
            case 1:
                game.bird = new Bird();
                //进入1号场景瞬间的事情
                game.bird.r = 0;
                this.logoY = -48;
                break;
            case 2:
                this.opacityArr = [0.2, 0.5, 1, 0.5];
                this.opacityIndex = 0;
                break;
            case 3:
                //管子数组清空
                game.score = 0;
                game.pipeArr = new Array();
                break;
            case 4:
                this.maskOpacity = 1;
                this.isBirdLand = false;
                this.birdFno = 0;
                this.boomNum = 0;
                break;
            case 5:
                break;
        }
    }
    //添加监听
    SceneManager.prototype.bindEvent = function(){
        var self = this;
        game.canvas.onclick = function(event){
            clickHandler(event.clientX, event.clientY);
            console.log(event.clientX, event.clientY);
        }
        function clickHandler(mouseX, mouseY){
            //点击的时候判断场景
            switch(self.sceneNumber){
                case 1:
                    let width = document.documentElement.clientWidth;
                    if(width > 414){
                        self.enter(2);
                    } else {
                        //进入一号场景一瞬间要做的事情
                        if(mouseX > self.button_playX && mouseX < self.button_playX + 116 && mouseY > self.button_playY && mouseY < self.button_playY + 70){
                            self.enter(2);
                        }
                    }
                    break;
                case 2:
                    self.enter(3);
                    break;
                case 3:
                    game.bird.fly();
                    break;
                case 5:
                    self.enter(1);
            }
        }
    }
})();