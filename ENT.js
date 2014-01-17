function ENT(type,frm,cnt){
	this.type = type;
	this.frm = frm;
	this.w=5;
	this.h=5;
	switch(this.type){
		case 1:
			this.ct = ticker;
			this.dmg = 2;
			this.a = frm.ga;
			this.vx = 12;
			this.vy = 12;
			this.x = frm.x+5*Math.cos(frm.ga);
			this.y = frm.y+5*Math.sin(frm.ga);
			break;
		case 2:
			var r = (1-2*Math.random())*Math.PI/16;
			this.ct = ticker;
			this.dmg = 1;
			this.a = frm.ga+((cnt-3)*Math.PI/32+r);
			this.vx = 14;
			this.vy = 14;
			this.x = frm.x+15*Math.cos(frm.ga+(cnt-3)*Math.PI/16+r);
			this.y = frm.y+15*Math.sin(frm.ga+(cnt-3)*Math.PI/16+r);
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
			this.vx = 0;
			this.vy = 0;
			this.x = frm.x;
			this.y = frm.y;
			this.size = frm.bsize;
			this.expvel = frm.expvel;
			this.maxsz = frm.exprad;
			break;
	}
}

ENT.prototype.draw = function(){
	
	switch(this.type){
		case 1: case 3: //DOMO bullets(1) and AI bullets(3)
			ctx.strokeStyle = "#000";
			ctx.lineWidth=2;
			ctx.beginPath();
			ctx.moveTo( this.x, this.y );
			ctx.lineTo( this.x+7*Math.cos(this.a), this.y+7*Math.sin(this.a) );
			ctx.closePath();
			ctx.stroke();
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
			ctx.strokeStyle = "#E00";
			ctx.lineWidth=2;
			ctx.beginPath();
			ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
			ctx.closePath();
			ctx.stroke();
			break;
	}
	
}

ENT.prototype.move = function(){
	switch(this.type){
		case 4: //bubbles
			if(this.size <= this.maxsz) this.size+=this.expvel;
			else death(ent,ent[ent.indexOf(this)]);
			break;
		default: //bullets
			this.x+=this.vx*Math.cos(this.a);
			this.y+=this.vy*Math.sin(this.a);
			break;
	}
	
}

