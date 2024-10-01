document.getElementById('uploadButton').addEventListener('click', function() {
	document.getElementById('file').click();
});

document.getElementById('file').addEventListener('change', function(event) {
	var fileInput = document.getElementById('file');
	var file = fileInput.files[0]; // Get the selected file

	// Check if the file is a GIF
	if (file && file.type === 'image/gif') {
		var reader = new FileReader();

		reader.onload = function(e) {
			// Create an image element
			var img = document.createElement('img');

			// Set the source of the image to the data URL of the file
			img.src = e.target.result;

			// Clear the gif div and append the image
			var gifDiv = document.getElementById('gif');
			gifDiv.innerHTML = '';
			gifDiv.appendChild(img);
		};

		// Read the file as a data URL
		reader.readAsDataURL(file);
	} else {
		alert('Please select a GIF file.');
	}
});

var intervalId = null;

document.getElementById('form2').addEventListener('submit', function(event) {
  event.preventDefault();

	var rowsInput = document.getElementById('rows');
	var colsInput = document.getElementById('cols');

	var rows = parseInt(rowsInput.value);
	var cols = parseInt(colsInput.value);

	if (isNaN(rows) || isNaN(cols)) {
		alert('Please enter valid numbers for rows and cols.');
		return;
	}

	var gifDiv = document.getElementById('gif');
	var img = gifDiv.querySelector('img');

	if (!img) {
		alert('No image to split.');
		return;
	}

	var splitDiv = document.getElementById('split');

	var imgWidth = img.naturalWidth;
	var imgHeight = img.naturalHeight;

	var partWidth = imgWidth / cols;
	var partHeight = imgHeight / rows;

	splitDiv.innerHTML = ''; // Clear the split div
	splitDiv.style.display = 'grid';
	splitDiv.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
	splitDiv.style.gridGap = '10px'; // Add space between the grid items
	splitDiv.style.height = `${imgHeight}px`;
	splitDiv.style.width = `${imgWidth}px`;


	var fileInput = document.getElementById('file');
	var file = fileInput.files[0]; // Get the selected file

	// Check if the file is a GIF
	if (file && file.type === 'image/gif') {
		var reader = new FileReader();

		reader.onload = function(e) {
			for (var r = 0; r < rows; r++) {
				for (var c = 0; c < cols; c++) {
					var x = c * partWidth;
					var y = r * partHeight;

					// Create the div and img elements
					const div = document.createElement('div');
					const img = document.createElement('img');

					// Set the styles on the div
					div.style.width = `${partWidth}px`;
					div.style.height = `${partHeight}px`;
					div.style.overflow = 'hidden';
					div.style.position = 'relative';

					// Set the styles and src on the img
					img.style.position = 'absolute';
					img.style.top = `-${y}px`;
					img.style.left = `-${x}px`;
					img.src = e.target.result;

					// Append the img to the div
					div.appendChild(img);

					// Append the div to the split div
					var splitDiv = document.getElementById('split');
					splitDiv.appendChild(div);
				}
			}
		};

		// Read the file as a data URL
		reader.readAsDataURL(file);
	} else {
		alert('Please select a GIF file.');
	}
});