popupDataCache = {}

function dragElement(element) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    document.getElementById('drag-bar-popup').onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;

        // Get the window boundaries
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const elementRect = element.getBoundingClientRect();

        // Calculate the new position while keeping the element within the screen
        let newTop = element.offsetTop - pos2;
        let newLeft = element.offsetLeft - pos1;

        // Constrain the new position within the screen boundaries
        if (newTop < 0) newTop = 0; // Prevent going above the top boundary
        if (newLeft < 0) newLeft = 0; // Prevent going beyond the left boundary
        if (newTop + elementRect.height > windowHeight) newTop = windowHeight - elementRect.height; // Prevent going below the bottom boundary
        if (newLeft + elementRect.width > windowWidth) newLeft = windowWidth - elementRect.width; // Prevent going beyond the right boundary

        // Set the element's new position:
        element.style.top = newTop + 'px';
        element.style.left = newLeft + 'px';
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

function showPopup(e) {
	const name = this.getAttribute('name');
	document.getElementById('name-popup').innerText = name
    document.getElementById('image-popup').src = itemData[name].img;
    document.getElementById('description-popup').innerText = itemData[name].description;
    document.getElementById('ergonomics-popup').innerText = itemData[name].ergonomics;
    document.getElementById('recoil-popup').innerText = itemData[name].recoil;
    document.getElementById('price-popup').innerText = '₽' + itemData[name].price;
	
	document.getElementById('popup').style.display = 'flex';
	e.stopPropagation()
}

dragElement(document.getElementById('popup'));