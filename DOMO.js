function DOMO(){
	this.target = -1;
	this.rldt = 10;
	this.st = 10;
	this.hlt = 1000;
	this.mhlt = 1000;
	this.wpn = 1;
	this.bblc = 300;
	this.bblt = 0;
	this.au = 0;
	this.ad = 0;
	this.ar = 0;
	this.al = 0;
	this.w = 60;
	this.h = 60;
	this.bubble = false;
	this.a = 0;
	this.ga = 0;
	this.vx = 0;
	this.vy = 0;
	this.x = 0;
	this.y = 0;
}

DOMO.prototype.draw = function(){
	ctx.lineWidth=1;
	ctx.fillStyle = ctx.strokeStyle  = "#f80";
	ctx.polygon(this.x,this.y,10,6,this.a,1);
	
	
	if(Math.abs(this.st-ticker)>=50){
		var ofnd = atree.retrieve(DOMO);
		this.target = nn(DOMO, ofnd);
		if((this.target[0]<750)&&(this.target)){
			this.target = this.target[1]; 
			this.st=ticker; 
			this.sht=true;
		}else{
			this.target=-1;
			this.sht=false;
		}
	}
	
	ctx.strokeStyle = ((!autotarg) ? ("#f80"):((this.target==-1)?("#f00"):("#fff")));
	ctx.lineWidth=2;
	ctx.beginPath();
	ctx.moveTo( this.x+7*Math.cos(this.a), this.y+7*Math.sin(this.a) );
	ctx.lineTo( this.x+9*Math.cos(this.a), this.y+9*Math.sin(this.a) );
	ctx.stroke();
	
	if(!autotarg){	
		this.ga += mnmx(-Math.PI/16, Math.PI/16, angle(this.ga,this.a));
		this.sht=false;
	}else if(this.target!=-1){
		this.ga += mnmx(-Math.PI/32, Math.PI/32, angle( this.ga, Math.atan2( this.target.y - this.y, this.target.x - this.x)));
	}
	
	ctx.strokeStyle = "#fff";
	ctx.beginPath();
	ctx.moveTo( this.x + 0*Math.cos(this.ga), this.y + 0*Math.sin(this.ga) );
	ctx.lineTo( this.x + 7*Math.cos(this.ga), this.y + 7*Math.sin(this.ga) );
	ctx.stroke();
	
	ctx.fillStyle = ctx.strokeStyle  = "#fff";
	ctx.lineWidth=1.5;
	ctx.beginPath();
	ctx.arc(this.x,this.y,5, this.ga-Math.PI*0.75+Math.PI, this.ga+Math.PI*0.75+Math.PI);
	ctx.stroke();
	
	ctx.fillStyle = ctx.strokeStyle  = "#0f0";
	ctx.lineWidth=1.5;
	ctx.beginPath();
	ctx.arc(this.x,this.y,5, this.ga-Math.PI*(this.hlt/this.mhlt)*0.75+Math.PI, this.ga+Math.PI*(this.hlt/this.mhlt)*0.75+Math.PI);
	ctx.stroke();
	ctx.closePath();
	
	if(DOMO.bubble && this.bblc>=300){
		this.bblt++;
		var lst = atree.retrieve(DOMO);
		for(var i=0; i<lst.length; i++){
			lst[i].color = "#F00";
			if(dist(DOMO,lst[i])<30){
				if(DOMO.bubble){ 
					lst[i].hlt -= 0.1;
					var a = Math.atan2( lst[i].y-DOMO.y, lst[i].x-DOMO.x);
					lst[i].x = 35*Math.cos(a)+DOMO.x;
					lst[i].y = 35*Math.sin(a)+DOMO.y;	
				}						
			}
		}
		ctx.save();
		ctx.strokeStyle = "#fff";
		ctx.beginPath();
		ctx.arc( DOMO.x, DOMO.y, 30, 0, 6.29 );
		ctx.stroke();
		ctx.closePath();
		ctx.restore();
		if(this.bblt>60){
			this.bblt=0;
			this.bblc=0;
			this.bubble=false;
		}
	}else if (this.bblt==0){
		this.bblc++;
	}
	
	this.sht ? DOMO.shoot(this.wpn): 0;
}

DOMO.prototype.move = function(){
	this.vx += this.al+this.ar;
	this.vy += this.au+this.ad;
	this.vx *= friction;
	this.vy *= friction;
	
	this.a += mnmx( -Math.PI/16, Math.PI/16, angle( this.a, Math.atan2(this.vy, this.vx) ));
    (Math.abs(this.x+this.vx) > 2000)? this.x = (this.x/Math.abs(this.x))*2000 : this.x += this.vx;
	(Math.abs(this.y+this.vy) > 2000)? this.y = (this.y/Math.abs(this.y))*2000 : this.y += this.vy;
}

DOMO.prototype.shoot = function(type){
	switch(type){
		case 1:
			if(Math.abs(this.rldt-ticker)>=6){
				this.rldt = ticker;
				ent.push(new ENT(1,this));
			}
			break;
		case 2:
			if(Math.abs(this.rldt-ticker)>=10){
				this.rldt = ticker;
				var cnt = 0;
				for(var i=0; i<5; i++){
					cnt++;
					ent.push(new ENT(2,this,cnt));
				}
			}
			break;
	}
}