function createTree(itemTree, itemData) {
	let rootBranch = document.createElement('div')
	rootBranch.classList.add('branch-tree')

	function createEntry(subTree) {
		const name = subTree.name
		const type = subTree.type

		let entry = document.createElement('div')
		entry.classList.add('entry-tree')

		let content = document.createElement('div')
		content.classList.add('content-tree')
		content.setAttribute('name', name)
		content.onclick = showPopup

		let typeSpan = document.createElement('span')
		typeSpan.classList.add('type-tree')
		typeSpan.innerText = type
		
		let img = document.createElement('img')
		console.log("Item Image Here")
		console.log(name)
		img.src = itemData[name].img

		content.appendChild(typeSpan)
		content.appendChild(img)
		entry.appendChild(content)

		if (subTree.children.length != 0) {
			let branch = document.createElement('div')
			branch.classList.add('branch-tree')
			for (child of subTree.children) {
				branch.appendChild(createEntry(child))
			}

			entry.appendChild(branch)
		}

		return entry
	}

	rootBranch.appendChild(createEntry(itemTree))
	
	let rootTree = document.getElementById('tree')
	rootTree.appendChild(rootBranch)	
}