const toyItemTree = {
	'name': 'Mosin 7.62x54R bolt-action rifle (Sniper)',
	'type': 'Weapon',
	'children': [
		{
			'name': 'Mosin Rifle 7.62x54R 5-round magazine',
			'type': 'Magazine',
			'children': []
		},
		{
			'name': 'Mosin Rifle standard stock',
			'type': 'Stock',
			'children': []
		},
		{
			'name': 'Mosin Rifle 7.62x54R 730mm regular barrel',
			'type': 'Barrel',
			'children': [
				{
					'name': 'Mosin Rifle front sight',
					'type': 'Front Sight',
					'children': []
				},
				{
					'name': 'Mosin Rifle rear sight',
					'type': 'Rear Sight',
					'children': []
				}
			]
		},
		{
			'name': 'Mosin Rifle Kochetov mount',
			'type': 'Mount',
			'children': [
				{
					'name': 'PU 3.5x ring scope mount',
					'type': 'Mount',
					'children': [
						{
							'name': 'PU 3.5x riflescope',
							'type': 'Scope',
							'children': []
						}
					]
				}
			]
		}
	]
}

const toyItemData = {
	'Mosin 7.62x54R bolt-action rifle (Sniper)': {
		'img': 'https://assets.tarkov.dev/5ae08f0a5acfc408fb1398a1-512.webp'
	},
	'Mosin Rifle 7.62x54R 5-round magazine': {
		'img': 'https://assets.tarkov.dev/5ae0973a5acfc4001562206c-512.webp'
	},
	'Mosin Rifle standard stock': {
		'img': 'https://assets.tarkov.dev/5ae096d95acfc400185c2c81-512.webp'
	},
	'Mosin Rifle 7.62x54R 730mm regular barrel': {
		'img': 'https://assets.tarkov.dev/5ae09bff5acfc4001562219d-512.webp'
	},
	'Mosin Rifle front sight': {
		'img': 'https://assets.tarkov.dev/5ae099875acfc4001714e593-512.webp'
	},
	'Mosin Rifle rear sight': {
		'img': 'https://assets.tarkov.dev/5ae099925acfc4001a5fc7b3-512.webp'
	},
	'Mosin Rifle Kochetov mount': {
		'img': 'https://assets.tarkov.dev/5b3f7bf05acfc433000ecf6b-512.webp'
	},
	'PU 3.5x ring scope mount': {
		'img': 'https://assets.tarkov.dev/5b3f7c005acfc4704b4a1de8-512.webp'
	},
	'PU 3.5x riflescope': {
		'img': 'https://assets.tarkov.dev/5b3f7c1c5acfc40dc5296b1d-512.webp'
	}
}

function createTree(rootTree, itemData) {
	let rootBranch = document.createElement('div')
	rootBranch.classList.add('branch-tree')

	function createEntry(subTree) {
		const name = subTree.name
		const type = subTree.type

		let entry = document.createElement('div')
		entry.classList.add('entry-tree')
		let content = document.createElement('div')
		content.classList.add('content-tree')
		let typeSpan = document.createElement('span')
		typeSpan.classList.add('type-tree')
		typeSpan.innerText = type
		let img = document.createElement('img')
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

	rootBranch.appendChild(createEntry(rootTree))
	return rootBranch
}

let rootTree = document.getElementById('tree')
rootTree.appendChild(createTree(toyItemTree, toyItemData))