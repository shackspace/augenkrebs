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

function controls_draw()
{
	button_add("◃◃","seek_back");
	button_add("▯▯","pause");
	button_add("◽",	"stop");
	button_add("▹▹","seek");
}

function init()
{
	controls_draw();
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
