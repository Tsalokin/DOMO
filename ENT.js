function ENT(type,frm,cnt){
	this.type = type;
	this.frm = frm;
	this.w=5;
	this.h=5;
	switch(this.type){
		case 0:
			this.ct = ticker;
			this.dmg = 1;
			this.a = frm.ga;
			this.vx = 14+(1-2*Math.random());
			this.vy = 14+(1-2*Math.random());
			this.x = frm.x+(5+cnt*7)*Math.cos(frm.ga)+(1-2*Math.random())*2;
			this.y = frm.y+(5+cnt*7)*Math.sin(frm.ga)+(1-2*Math.random())*2;
			break;
		case 1:
			this.ct = ticker;
			this.dmg = 2;
			this.a = frm.ga;
			this.vx = 12;
			this.vy = 12;
			this.x = frm.x+5*Math.cos(frm.ga);
			this.y = frm.y+5*Math.sin(frm.ga);
			break;
		case 2: //shotgun
			var r = (1-2*Math.random())*Math.PI/64;
			this.ct = ticker;
			this.dmg = 1;
			this.a = frm.ga+((cnt-9.5)*Math.PI/128+r);
			this.vx = 10;
			this.vy = 10;
			this.x = frm.x+15*Math.cos(frm.ga+(cnt-9.5)*Math.PI/64+r)+rndr(0,1);
			this.y = frm.y+15*Math.sin(frm.ga+(cnt-9.5)*Math.PI/64+r)+rndr(0,1);
			break;
		case 3:
			this.ct = ticker;
			this.dmg = frm.dmg;
			this.a = frm.a;
			this.vx = 20;
			this.vy = 20;
			this.x = frm.x+5*Math.cos(frm.a);
			this.y = frm.y+5*Math.sin(frm.a);
			break;
		case 4:
			this.ct = ticker;
			this.dmg = frm.dmg;
			this.a = frm.a;
			this.vx = 0;
			this.vy = 0;
			this.x = frm.x;
			this.y = frm.y;
			this.fadetime = frm.fadetime;
			this.fadeini=frm.fadeini;
			this.bstr = frm.bstr;
			this.size = frm.bsize;
			this.expvel = frm.expvel;
			this.maxsz = frm.exprad;
			break;
	}
}

ENT.prototype.draw = function(){
	
	switch(this.type){
		case 0: 
			ctx.strokeStyle = "#000";
			ctx.lineWidth=2;
			ctx.beginPath();
			ctx.moveTo( this.x, this.y );
			ctx.lineTo( this.x+4*Math.cos(this.a), this.y+4*Math.sin(this.a) );
			ctx.stroke();
			ctx.closePath();
			break;
		case 1: case 3: //DOMO bullets(1) and AI bullets(3)
			ctx.strokeStyle = "#000";
			ctx.lineWidth=2;
			ctx.beginPath();
			ctx.moveTo( this.x, this.y );
			ctx.lineTo( this.x+7*Math.cos(this.a), this.y+7*Math.sin(this.a) );
			ctx.stroke();
			ctx.closePath();
			break;
		case 2: //shotgun shells
			ctx.strokeStyle = "#000";
			ctx.lineWidth=2;
			ctx.beginPath();
			ctx.moveTo( this.x, this.y );
			ctx.lineTo( this.x+7*Math.cos(this.a), this.y+7*Math.sin(this.a) );
			ctx.stroke();
			ctx.closePath();
			break;
		
		case 4: //bubbles
			var shits=(this.fadetime/(this.fadeini*2));
			ctx.strokeStyle = "rgba(255,0,0,"+shits+")";
			ctx.lineWidth=5;
			ctx.beginPath();
			ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
			ctx.stroke();
			ctx.closePath();
			
			break;
	}
	
}

ENT.prototype.move = function(){
	switch(this.type){
		case 4: //bubbles
			if(this.size <= this.maxsz) this.size+=this.expvel;
			else if(this.fadetime<=0) death(ent,ent[ent.indexOf(this)]);
			else this.fadetime--;
			break;
		default: //bullets
			this.x+=this.vx*Math.cos(this.a);
			this.y+=this.vy*Math.sin(this.a);
			break;
	}
	
}

