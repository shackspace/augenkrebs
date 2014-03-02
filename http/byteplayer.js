function $(a){return document.getElementById(a);}

function xhr(url,callback,postvars)
{
	var xhr = new XMLHttpRequest();
	xhr.open(postvars?"POST":"GET", url, true);
	xhr.onreadystatechange = function()
	{
		if(xhr.readyState != 4) return;
		if(callback) return callback(xhr.responseText);
	}
	xhr.send(postvars);
}
function action_open()
{
	xhr("/",false,"do=open&url="+encodeURIComponent($("url").value));
}

function button_add(desc,action)
{
	var button = document.createElement("span");
	button.className="button";
	button.innerHTML=desc;
	button.onclick = function()
	{
		if(action == "open") return action_open();
		xhr("/",false,"do="+action);
	}
	$("buttons").appendChild(button);
}

function slider_set(obj,key)
{
	xhr("/", false, "do=set_"+key+"&val="+obj.value);
}


function controls_draw()
{
	button_add("◃◃","seek_back");
	button_add("▯▯","pause");
	button_add("◽",	"stop");
	button_add("▹▹","seek");
}

function two_digits(num)
{
	return num<10?"0"+num:num;
}

function format_time(timestamp)
{
	var seconds = Math.floor(timestamp / 1000000);
	var minutes = Math.floor(seconds / 60);
	seconds = seconds % 60;
	return two_digits(minutes)+":"+two_digits(seconds);
}

function init()
{
	$("url").focus();
	controls_draw();
	setInterval(function()
	{
		xhr("/status",function(answer)
		{
			try {answer = JSON.parse(answer);} catch(e){return;}

			var dom_tracklist = $("tracklist");
			dom_tracklist.innerHTML = "";
			var tracklist = answer.tracklist
			for(var i=0;i<tracklist.length;++i){
				var list_elem = document.createElement('li');
				list_elem.appendChild(document.createTextNode(tracklist[i]));
				dom_tracklist.appendChild(list_elem);
			}

			$("slider_container").style.display = answer.pos?"block":"none";

			$("volume").innerHTML  = Math.floor(answer.vol*100)+"%";
			$("volume_slider").value = answer.vol*100;

			if(!answer.pos) return;
			
			var current = answer.pos;
			var end     = answer.meta["mpris:length"];
			
			$("slider").value	= current;
			$("slider").max		= end;
			
			$("playpos").innerHTML = format_time(current);
			$("endpos").innerHTML  = format_time(end);
		});
	},1000);
	
	
	/*
	var buttons = $("buttons").getElementsByTagName("input");
	for(var i=0;i<buttons.length;i++) {
		buttons[i].type="button";
		buttons[i].onclick=function()
		{
			// TODO: convert to post
			var action = this.value;
			var url = "/?do="+action;
			if(action == "Open") url += "&videourl="+encodeURIComponent($("videourl").value);
			xhr(url);
		};
	}
	*/
/*
	var dndtarget = $("droptarget");
	dndtarget.style.display="block";
	dndtarget.ondragover = allowDrop;
	dndtarget.ondrop = drop;
*/
}
init();


/* TODO: reimplement drag n drop stuff */
function allowDrop(ev){
	ev.preventDefault();
}

function drop(ev){
	ev.preventDefault();
	var data=ev.dataTransfer.getData("Text");
	var url = "/?do=Open&videourl="+encodeURIComponent(data);
	xhr(url);
}
