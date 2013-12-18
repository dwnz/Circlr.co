$(function(){
		$('#filedrag').click(function(){
			$('#fileselect').click();
		});
		
		$.get(
			'/api/count',
			{},
			function(data){
				$('#circlesMade').html(data + ' circles created.');
			}
		);
		
		// getElementById
		function $id(id) {
			return document.getElementById(id);
		}
		// output information
		function Output(msg) {
			console.log(msg);
			//var m = $id("messages");
			//m.innerHTML = msg + m.innerHTML;
		}
		// file drag hover
		function FileDragHover(e) {
			e.stopPropagation();
			e.preventDefault();
			e.target.className = (e.type == "dragover" ? "hover camera" : "camera");
		}
		// file selection
		function FileSelectHandler(e) {
			// cancel event and hover styling
			FileDragHover(e);
			// fetch FileList object
			var files = e.target.files || e.dataTransfer.files;
			// process all File objects
			var file = files[0];
			

			if(file.size > 10485760){
				alert("Doh! That file is too big. The limit is 10mb.");
				return;
			}

			if(file.type !== 'image/jpg' && file.type !== 'image/jpeg'){
				alert("Doh! I only support JPG files.");
				return;
			};

			$('#msg').html('Uploading now...');
			$('#upload').submit();
		}
		// output file information
		function ParseFile(file) {
			Output(
				"<p>File information: <strong>" + file.name +
				"</strong> type: <strong>" + file.type +
				"</strong> size: <strong>" + file.size +
				"</strong> bytes</p>"
			);
		}
		// initialize
		function Init() {
			var fileselect = $id("fileselect"),
				filedrag = $id("filedrag"),
				submitbutton = $id("submitbutton");
			// file select
			fileselect.addEventListener("change", FileSelectHandler, false);
			// is XHR2 available?
			var xhr = new XMLHttpRequest();
			if (xhr.upload) {
				// file drop
				filedrag.addEventListener("dragover", FileDragHover, false);
				filedrag.addEventListener("dragleave", FileDragHover, false);
				filedrag.addEventListener("drop", FileSelectHandler, false);
				filedrag.style.display = "block";
				// remove submit button
				//submitbutton.style.display = "none";
			}
		}
		// call initialization file
		if (window.File && window.FileList && window.FileReader) {
			Init();
		}
});