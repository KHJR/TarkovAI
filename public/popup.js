popupDataCache = {}

function dragElement(element) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    document.getElementById('drag-bar-popup').onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
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

function showPopup() {
	function fill(name, item) {
		document.getElementById('name-popup').innerText = name
        document.getElementById('image-popup').src = item.image512pxLink;
        document.getElementById('reason-popup').innerText = item.description;
        document.getElementById('ergonomics-popup').innerText = item.ergonomicsModifier;
        document.getElementById('recoil-popup').innerText = item.recoilModifier;
        document.getElementById('price-popup').innerText = '₽' + item.buyFor[0].priceRUB;
	}

	const name = this.getAttribute('name');
	
	if (name in popupDataCache) {
		const item = popupDataCache[name]
		fill(name, item)
	}
	else {
		/*
		const delay = ms => new Promise(res => setTimeout(res, ms));
		document.getElementById('name-popup').innerText = '';
		document.getElementById('image-popup').src = '';
		document.getElementById('stats-popup').style.opacity = '0%';
		document.getElementById('right-popup').style.opacity = '0%';
		*/
		document.getElementById('content-popup').classList.add('content-shine-popup');
		fetch('https://api.tarkov.dev/graphql', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
			},
			body: JSON.stringify({query: `{
			items(name: "${name}") {
						name
						image512pxLink
						description
						ergonomicsModifier
						recoilModifier
						buyFor {
						priceRUB
					}
				}
			}
			`})
		})
		.then(r => r.json())
		.then(data => {
			const item = data.data.items[0];
			popupDataCache[name] = item
		
			fill(name, item)
			/*
			await delay(3000)
			document.getElementById('stats-popup').style.opacity = '100%';
			document.getElementById('right-popup').style.opacity = '100%';
			*/
			document.getElementById('content-popup').classList.remove('content-shine-popup');
		});
	}

	document.getElementById('popup').style.display = 'flex';
}

dragElement(document.getElementById('popup'));

// Test Code
document.querySelector('[name="Walther MRS reflex sight"]').onclick = showPopup;
document.querySelector('[name="KAC PRS/QDC 7.62x51 sound suppressor"]').onclick = showPopup;