window.onload = function(){
	//defining variables/canvas
	
	cv = document.getElementById("canvas");
	ctx = cv.getContext("2d");
	ctx.fullscreen(1500,750);
	img = new Image();
	img.src = "./domobg.png";
	
	ctx.a=0;
	ctx.x=0;
	ctx.y=0;
	ctx.vx=0;
	ctx.vy=0;
	
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	
	pause=false;
	autotarg = 0;	
	ticker=0;
	friction = 0.95;
	
	map=[[null],[-2000,-2030,4000,30],[-2000,2030,4000,-30],[-2030,-2030,30,4060],[2000,-2030,30,4060]];
	
	bai=[];
	gai=[];
	ent=[];

	gai.push(DOMO = new DOMO());
	for(var i=0; i<100; i++){
		bai.push(new ai(0));
	}
	for(var i=0; i<70; i++){
		bai.push(new ai(1));
	}
	for(var i=0; i<50; i++){
		bai.push(new ai(2));
	}

	atree = new QUAD.init({ x:-2000, y:-2000, w:4000, h:4000, maxDepth:8, maxChildren:10});
	etree = new QUAD.init({ x:-2000, y:-2000, w:4000, h:4000, maxDepth:3, maxChildren:1});
	
	img.onload = function(){animate();}
}

function animate(){
	if(!pause){
		ctx.clear();
		updttre();
		ctx.drawImage(img, -2000, -2000);
		mapdrw();
		ctx.fillStyle="#000";
		ctx.fillText(bai.length,ctx.x-700,ctx.y-350);
		
		for(var i=0; i<bai.length; i++){
			var efnd = etree.retrieve(bai[i]);
			var fnd = nn(bai[i],efnd);
			if((fnd[0]<10)&&(bai.indexOf(fnd[1].frm)==-1)){
				bai[i].hlt-=fnd[1].dmg;
				death(ent,fnd[1]);
			}
		}
		
		for(var i=0; i<gai.length; i++){
			var efnd = etree.retrieve(gai[i]);
			var fnd = nn(gai[i],efnd);
			if((fnd[0]<10)&&(gai.indexOf(fnd[1].frm)==-1)){
				gai[i].hlt-=fnd[1].dmg;
				if(fnd[1].type!=4) death(ent,fnd[1]);
			}
		}
		
		for(var i in bai){
			bai[i].draw();
			bai[i].color=0;
			bai[i].move();
			var close = nn(bai[i],ent);
			if(bai[i].hlt<=0){death(bai,bai[i])}
		}
		
		for(var i in gai){
			gai[i].draw();
			ctx.fillStyle = "#000";
			ctx.fillText(Math.round(DOMO.x)+", "+Math.round(DOMO.y), DOMO.x,DOMO.y-18);
			gai[i].move();
			if(gai[i].hlt<=0){death(gai,gai[i]);}
		}
		
		for(var i in ent){
			ent[i].draw();
			ent[i].move();
			if(Math.abs(ent[i].ct-ticker)>=200){
				death(ent,ent[i]);
				i--;
			}
		}
		
		//drawNode(atree.root);
		ctxm();
		ticker++;
	}
	window.requestAnimFrame(animate);
}

function drawNode(anode) {
    var nodes = anode.nodes;
    if (nodes) {
        for (var i = 0; i < nodes.length; i++) {
            drawNode(nodes[i]);
        }
    }
    ctx.beginPath();
    ctx.strokeStyle = "#000";
    ctx.strokeRect(anode.x, anode.y, anode.w, anode.h); 
    ctx.stroke();  
    ctx.closePath();
};

function ctxm(){
	ctx.a = Math.atan2( DOMO.y - ctx.y, DOMO.x - ctx.x);
	var v = mnmx( -40, 40, dist( ctx, DOMO )/4 );
	ctx.vx = v*Math.cos(ctx.a);
	ctx.vy = v*Math.sin(ctx.a);
	ctx.x += ctx.vx;
	ctx.y += ctx.vy;
	ctx.translate(-ctx.vx,-ctx.vy);
}

function dist(cur,targ){
	if((cur)&&(targ)){
		return Math.sqrt(Math.pow(targ.x-cur.x,2)+Math.pow(targ.y-cur.y,2));
	}
}

function distsq(cur,targ){
	if((cur)&&(targ)){
		return Math.pow(targ.x-cur.x,2)+Math.pow(targ.y-cur.y,2);
	}
}

function nn(cur,wht){
	var close = 0;
	var closest = [Infinity,0];
	for(i in wht){
		close = distsq(cur,wht[i]);
		if(close<closest[0]){
			closest[0]=close;
			closest[1]=wht[i];
		}
	}
	closest[0] = Math.sqrt(closest[0]);
	return closest;
} 

function angle( a1, a2 ){
	a1 %= 2*Math.PI;
	a2 %= 2*Math.PI;
	
	if( a1-a2 > Math.PI ){ a2 += 2*Math.PI; }
	else if( a2-a1 > Math.PI ){ a1 += 2*Math.PI; }
	
	var s = (a1>a2)?-1:1;
	var v1 = { x:Math.cos(a1), y:Math.sin(a1) }
	var v2 = { x:Math.cos(a2), y:Math.sin(a2) }
	var dot = v1.x*v2.x+v1.y*v2.y;
	var v1v2a = Math.acos( Math.max( -1, Math.min(1, dot / Math.sqrt(v1.x*v1.x+v1.y*v1.y)*Math.sqrt(v2.x*v2.x+v2.y*v2.y))) );
	return s*v1v2a;
}

function mapdrw(){
	for(i in map){
		if(map[i]!=null){
			ctx.fillStyle = "#fff";
			ctx.fillRect(map[i][0],map[i][1],map[i][2],map[i][3]);
		}
	}
}

function death(arr,obj){
	arr.splice(arr.indexOf(obj),1);
	delete obj;
}

function sign(x){
	if(x==0) return 1;
	return x/Math.abs(x);
}

function saTarg(targ){
	for(var i in bai){
		bai[i].target = targ;
	}
}

function updttre(){
	atree.clear();
	etree.clear();
	atree.insert(bai);
	etree.insert(ent);
}

document.onkeydown = function(e){
	switch(e.keyCode){
		case "W".charCodeAt(0): DOMO.au = -0.5; break;
		case "S".charCodeAt(0): DOMO.ad = 0.5; break;
		case "D".charCodeAt(0): DOMO.ar = 0.5; break;
		case "A".charCodeAt(0): DOMO.al = -0.5; break;
		case "E".charCodeAt(0): autotarg = !autotarg; break;
		case "T".charCodeAt(0): DOMO.target = Dntarget(); break;
		case "P".charCodeAt(0): pause=!pause; break;
		case "1".charCodeAt(0): DOMO.wpn=1; break;
		case "2".charCodeAt(0):	DOMO.wpn=2; break;
		case 32: break;
	}
}

document.onkeyup = function(e){
	switch(e.keyCode){
		case "W".charCodeAt(0): DOMO.au = 0; break;
		case "S".charCodeAt(0): DOMO.ad = 0; break;
		case "D".charCodeAt(0): DOMO.ar = 0; break;
		case "A".charCodeAt(0): DOMO.al = 0; break;
		case 32: DOMO.bubble = true; break;
	}
}