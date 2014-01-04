var recommended =
[
	"http://youtube.com/watch?v=eQ6rfI28zJ4",
	"http://vimeo.com/50747914",
	"http://youtube.com/watch?v=VXCIQStE1rk",
	"http://youtube.com/watch?v=lRY4-feFZZY",
	
];

function $(a){return document.getElementById(a);}

function xhr(url,callback)
{
	var xhr = new XMLHttpRequest();
	xhr.open("GET", url, true);
	xhr.onreadystatechange = function()
	{
		if(xhr.readyState != 4) return;
		if(callback) return callback(xhr.responseText);
	}
	xhr.send();
}

function random_link()
{
	var index = Math.floor(Math.random()*recommended.length);
	if($("videourl").value == recommended[index])
		index++; if(index==recommended.length) index-=2;
	$("videourl").value = recommended[index];
}

function allowDrop(ev){
	ev.preventDefault();
}

function drop(ev){
	ev.preventDefault();
	var data=ev.dataTransfer.getData("Text");
	var url = "/?do=Open&videourl="+encodeURIComponent(data);
	xhr(url);
}

function init()
{
	$("home").href="#";
	$("home").onclick=random_link;
	if($("videourl").value == "" || recommended.indexOf($("videourl").value) == -1)
		random_link();
	
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

	var dndtarget = $("droptarget");
	dndtarget.style.display="block";
	dndtarget.ondragover = allowDrop;
	dndtarget.ondrop = drop;
}
init();
