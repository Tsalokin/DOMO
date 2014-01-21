function ai(type){
	this.type=type;
	this.w = 60;
	this.h = 60;
	this.a=0;
	this.ax = 0;
	this.ay = 0;
	this.vx = 0;
	this.vy = 0;
	this.x = (1-2*Math.random())*2000;
	this.y = (1-2*Math.random())*2000;
	this.target = DOMO;
	switch(this.type){
		case 0: //triangles
			this.hlt = 10;
			this.mhlt = 10;
			this.dmg = 2;
			this.ht = 0;
			this.bst = 10;
			this.rld = 0;
			this.rldt = rndr(100,200);
			this.td = 500;
			this.speed = rndr(0.3,0.4,1);
			this.vd = 1000;
			break;
		case 1: //squares
			this.hlt = 30;
			this.mhlt = 30;
			this.dmg = 10;
			this.ht = 0;
			this.bst = 6;
			this.speed = rndr(0.4,0.5,1);
			this.vd = 800;
			break;
		case 2: //circles
			this.hlt = 20;
			this.mhlt = 20;
			this.dmg = 5;
			this.bstr = 1000;
			this.ht = 0;
			this.rld = 0;
			this.fadetime = 30;
			this.fadeini=this.fadetime;
			this.rldt = rndr(100,200);
			this.bsize = 10;
			this.expvel = 10;
			this.exprad = 100;
			this.td = this.exprad*0.9;
			this.bst = 3;
			this.speed = rndr(0.2,0.3,1);
			this.vd = 600;
			break;
		case 3: //friendlies
			this.hlt = 2;
			this.mhlt = 2;
			this.dmg = 0.5;
			this.ht = 0;
			this.rld = 0;
			this.bst = 3;
			this.speed = rndr(0.5,0.7,1);
			this.vd = 1000;
			this.target = bai[rndr(0,bai.length)];
			this.a = Math.random()*Math.PI*2;
			this.x=DOMO.x+rndr(-25,25);
			this.y=DOMO.y+rndr(-25,25);
			break;
	}
	
}

ai.prototype.draw = function(){
	switch(this.type){
		case 0: //square mobs
			ctx.beginPath();
			ctx.lineWidth=1;
			ctx.fillStyle = ctx.strokeStyle = "#0AF";
			ctx.polygon(this.x,this.y,10,3,this.a,1);
			ctx.closePath();
			break;

		case 1: //triangle mobs
			ctx.beginPath();
			ctx.lineWidth=1;
			ctx.fillStyle = "#4F4";
			ctx.fillRect(this.x-7,this.y-7,14,14);
			ctx.closePath();
			break;
			
		case 2: //circle mobs
			ctx.lineWidth=1;
			ctx.fillStyle = "#408";
			ctx.beginPath();
			ctx.arc(this.x,this.y,8,0,Math.PI*2);
			ctx.fill();
			ctx.closePath();
			break;
		
		case 3: //friendlies
			ctx.lineWidth=4;
			ctx.strokeStyle = "#F0D";
			ctx.beginPath();
			this.speed=1;
			ctx.moveTo(this.x-2,this.y);
			ctx.lineTo(this.x+2,this.y);
			ctx.stroke();
			ctx.closePath();
			break;
			
	}
	if(this.type!=3){
		ctx.beginPath();
		ctx.fillStyle = ctx.strokeStyle  = "FFF";
		ctx.lineWidth=1.5;
		ctx.arc(this.x,this.y,4.5,0,(Math.PI*2*(this.hlt/this.mhlt)));
		ctx.stroke();
		ctx.closePath();
	}
}

ai.prototype.move = function(){
	var targ = [dist(this,this.target),this.target];
	this.target = targ[1];
	if(this.target && targ[0] < this.vd){
		this.a += mnmx(-Math.PI/16, Math.PI/16, angle( this.a, Math.atan2( this.target.y - this.y, this.target.x - this.x) ));
		this.ax = (Math.cos(this.a)+(1-2*Math.random()))*this.speed;
		this.ay = (Math.sin(this.a)+(1-2*Math.random()))*this.speed;
	}else{
		if(this.type==3){this.target = bai[rndr(0,bai.length)];}
		if(ticker%10==0){
			this.a += (1-2*Math.random())*Math.PI/12;
		}else if((Math.abs(this.x) == 2000) || (Math.abs(this.y) == 2000)){
			this.a += (sign(this.a)*Math.random())*Math.PI/12;
		}
		this.ax = this.speed*Math.cos(this.a);
		this.ay = this.speed*Math.sin(this.a);
	}
	
	if(targ[0]<10) this.attack(); //squares attack normally
	if((this.type==0) && (targ[0]<this.td)) this.shoot(0); //triangles fire bullets
	if((this.type==2) && (targ[0]<this.td)) this.shoot(2); //circles fire pulses
	
	this.vx += this.ax;
	this.vy += this.ay;
	
	this.vx *= friction;
	this.vy *= friction;
	
	(Math.abs(this.x+this.vx) > 2000)? this.x = (this.x/Math.abs(this.x))*2000 : this.x += this.vx;
	(Math.abs(this.y+this.vy) > 2000)? this.y = (this.y/Math.abs(this.y))*2000 : this.y += this.vy;
}

ai.prototype.attack = function(){
	if(Math.abs(this.ht-ticker)>=15){
		this.target.hlt-=this.dmg;
		this.ht = ticker;
		if(this.type==3) this.hlt-=this.dmg;
	}
	
}

ai.prototype.shoot = function(type){
	switch(type){
		case 0:
			if(Math.abs(this.rld-ticker)>=this.rldt){
				this.rld = ticker;
				ent.push(new ENT(3,this));
			}
			break;
		case 1:
			if(Math.abs(this.rld-ticker)>=this.rldt){
				this.rld = ticker;
				var cnt = 0;
				for(var i=0; i<5; i++){
					cnt++;
					ent.push(new ENT(2,this,cnt));
				}
			}
			break;
			
		case 2:
			if(Math.abs(this.rld-ticker)>=this.rldt){
				this.rld = ticker;
				var cnt=0;
				ent.push(new ENT(4,this,cnt));
			}
			break;
			
	}
}