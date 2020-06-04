(function(){
    var Game = window.Game = function(params){
        //得到画布
        this.canvas = document.querySelector(params.canvasid);
        this.ctx = this.canvas.getContext('2d');
        //资源文件地址
        this.Rjsonurl = params.Rjsonurl;
        //设置宽高
        this.init();
        //分数
        this.score = 0;
        //帧编号
        this.fno = -149;
        //读取资源，异步语句，需要回调函数
        var self = this;
        //读取资源是一个异步函数，所以我们不知道什么时候执行完毕，但是所有其他的事情必须等到他完毕之后才执行，所以要等callback。
        this.loadAllResource(function(){
            //我们封装的回调函数，这里表示全部资源加载完毕
            self.start();
        });
    }
    //初始化，设置画布的宽高
    Game.prototype.init = function(){
        let width = document.documentElement.clientWidth;
        let height = document.documentElement.clientHeight;
        if(width > 414){
            width = 414;
        } else if (width < 320) {
            width = 320;
        }
        if(height > 823){
            height = 823;
        } else if (height <500){
            height = 500;
        }
        let ratio = window.devicePixelRatio;
        this.canvas.style.width = width + 'px';
        this.canvas.style.height = height + 'px';
        if(ratio > 1){
            this.canvas.width = width * ratio;
            this.canvas.height = height * ratio;
            this.ctx.scale(ratio, ratio);
        } else {
            this.canvas.width = width;
            this.canvas.height = height;
        }
    }
    
    //读取资源
    Game.prototype.loadAllResource = function(callback){
        //准备一个R对象
        this.R = {};
        var self = this; //备份
        //计数器
        var alreadyLoadNum = 0;
        //发出请求，请求json文件
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(){
            if(xhr.readyState === 4){
                var Robj = JSON.parse(xhr.responseText);
                for(let i = 0; i < Robj.images.length; i++){
                    //创建一个同名的key
                    self.R[Robj.images[i].name] = new Image();
                    //请求
                    self.R[Robj.images[i].name].src = Robj.images[i].url;
                    //监听
                    self.R[Robj.images[i].name].onload = function(){
                        alreadyLoadNum++;
                        //提示文字
                        self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);
                        var text = "正在加载" + alreadyLoadNum + '/' + Robj.images.length +',请稍后';
                        //设置居中位置
                        self.ctx.textAlign = "center";
                        self.ctx.font = "18px 微软雅黑"
                        let ratio = window.devicePixelRatio;
                        self.ctx.fillText(text, self.canvas.width/(2*ratio), self.canvas.height/ratio *  (1 - 0.618));
                        //判断是否加载完毕
                        if(alreadyLoadNum === Robj.images.length){
                            callback();
                        }
                    }
                };
            }
        }
        xhr.open('get', this.Rjsonurl, true);
        xhr.send(null);
    }
    
    //开始游戏
    Game.prototype.start = function(){
        //实例化自己的场景管理器即可
        this.sm = new SceneManager();
        var self = this;
        //设置定时器
        this.timer = setInterval(function(){
            //清屏
            self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);
            self.sm.update();
            self.sm.render();

            //帧编号
            self.fno ++;
            self.ctx.font = "16px consolas";
            self.ctx.textAlign = "left";
            self.ctx.fillStyle = 'black';
            self.ctx.fillText("场景号:" + self.sm.sceneNumber + " FNO:" + self.fno, 10, 20);
        },20);
    }
})();