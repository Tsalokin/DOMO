function ENT(type,frm,cnt){
	this.type = type;
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
			this.dmg = 1;
			this.a = frm.a;
			this.vx = 20;
			this.vy = 20;
			this.x = frm.x+5*Math.cos(frm.a);
			this.y = frm.y+5*Math.sin(frm.a);
			break;
		
	}
}

ENT.prototype.draw = function(){
	
	switch(this.type){
		case 1: case 3:
			ctx.strokeStyle = "#000";
			ctx.lineWidth=2;
			ctx.beginPath();
			ctx.moveTo( this.x, this.y );
			ctx.lineTo( this.x+7*Math.cos(this.a), this.y+7*Math.sin(this.a) );
			ctx.closePath();
			ctx.stroke();
			break;
		case 2:
			ctx.strokeStyle = "#000";
			ctx.lineWidth=2;
			ctx.beginPath();
			ctx.moveTo( this.x, this.y );
			ctx.lineTo( this.x+7*Math.cos(this.a), this.y+7*Math.sin(this.a) );
			ctx.closePath();
			ctx.stroke();
	}
	
}

ENT.prototype.move = function(){
	this.x+=this.vx*Math.cos(this.a);
	this.y+=this.vy*Math.sin(this.a);
}

