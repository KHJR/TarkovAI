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
		img.src = itemData[name].img
		content.appendChild(img)
		content.appendChild(typeSpan)
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
    rootTree.innerHTML = ''
	rootTree.appendChild(rootBranch)	
}


const toyTree2 = {
    "name": "FN SCAR-L 5.56x45 assault rifle",
    "type": "Assault Rifle",
    "children": [
        {
            "name": "AR-15 Magpul MOE pistol grip (Black)",
            "type": "Pistol Grip",
            "children": []
        },
        {
            "name": "FN SCAR-L 5.56x45 upper receiver",
            "type": "Receiver",
            "children": [
                {
                    "name": "ELCAN SpecterDR 1x/4x scope",
                    "type": "Scope",
                    "children": []
                },
                {
                    "name": "Aimpoint Micro H-2 Standard Mount",
                    "type": "Scope",
                    "children": [
                        {
                            "name": "Aimpoint Micro H-2 reflex sight",
                            "type": "Scope",
                            "children": []
                        }
                    ]
                },
                {
                    "name": "FN SCAR-L 5.56x45 14 inch barrel",
                    "type": "Barrel",
                    "children": [
                        {
                            "name": "AR-15 AAC Blackout 51T 5.56x45 flash hider",
                            "type": "Muzzle",
                            "children": []
                        }
                    ]
                }
            ]
        },
        {
            "name": "FN SCAR folding polymer stock",
            "type": "Stock",
            "children": []
        },
        {
            "name": "FN SCAR charging handle",
            "type": "Ch. Handle",
            "children": []
        }
    ]
}

const toyItemData2 = {
    "AR-15 Magpul MOE pistol grip (Black)": {
        "img": "https://assets.tarkov.dev/55802f5d4bdc2dac148b458f-512.webp",
        "description": "The polymer Magpul MOE (Magpul Original Equipment) pistol grip can be installed on any weapon compatible with AR-15 pistol grips. Thanks to the ergonomic shape and anti-slip texture, it makes the weapon grip and control more comfortably. The inside of the grip contains free space for spare parts, tools, batteries, and an accessories kit.",
        "ergonomics": 10,
        "recoil": 0,
        "price": 6205
    },
    "ELCAN SpecterDR 1x/4x scope": {
        "img": "https://assets.tarkov.dev/57ac965c24597706be5f975c-512.webp",
        "description": "The SpecterDR (Dual Role) 1x/4x scope from Specter scope series designed by ELCAN has marked a breakthrough in the optic sight development by becoming the first variable scope that truly has two work modes, switching from 4x magnification to 1x in one touch. Also features a backup iron sight.",
        "ergonomics": -4,
        "recoil": 0,
        "price": 40105
    },
    "ELCAN SpecterDR 1x/4x scope (FDE)": {
        "img": "https://assets.tarkov.dev/57aca93d2459771f2c7e26db-512.webp",
        "description": "The SpecterDR (Dual Role) 1x/4x scope from Specter scope series designed by ELCAN has marked a breakthrough in the optic sight development by becoming the first variable scope that truly has two work modes, switching from 4x magnification to 1x in one touch. Also features a backup iron sight. Flat Dark Earth version.",
        "ergonomics": -4,
        "recoil": 0,
        "price": 46234
    },
    "AR-15 AAC Blackout 51T 5.56x45 flash hider": {
        "img": "https://assets.tarkov.dev/5c7e5f112e221600106f4ede-512.webp",
        "description": "The Advanced Armament Corporation (AAC) Blackout 51T flash hider is an effective flash suppressor that also serves as an attachment platform for the AAC 762-SDN-6 sound suppressor. Can be installed on AR-15-based rifles.",
        "ergonomics": -1,
        "recoil": -6,
        "price": 8753
    },
    "Aimpoint Micro H-2 Standard Mount": {
        "img": "https://assets.tarkov.dev/616554fe50224f204c1da2aa-512.webp",
        "description": "Aimpoint Micro Standard Mount is a base mount for H-2 sights of the Micro series. Backwards-compatible with both T-1 and H-1 series reflex sights.",
        "ergonomics": 0,
        "recoil": 0,
        "price": 2637
    },
    "Aimpoint Micro H-2 reflex sight": {
        "img": "https://assets.tarkov.dev/61657230d92c473c770213d7-512.webp",
        "description": "The Micro H-2 compact reflex sight by Aimpoint was designed for use with any kind of firearms and even with bows. Lightweight, compact, and durable.",
        "ergonomics": 0,
        "recoil": 0,
        "price": 22855
    },
    "FN SCAR folding polymer stock": {
        "img": "https://assets.tarkov.dev/61816734d8e3106d9806c1f3-512.webp",
        "description": "A folding polymer stock for the SCAR-series rifles, manufactured by Fabrique Nationale Herstal.",
        "ergonomics": 0,
        "recoil": -4,
        "price": 7300
    },
    "FN SCAR charging handle": {
        "img": "https://assets.tarkov.dev/6181688c6c780c1e710c9b04-512.webp",
        "description": "A standard-issue charging handle for the SCAR-series assault rifles, manufactured by Fabrique Nationale Herstal.",
        "ergonomics": 1,
        "recoil": 0,
        "price": 2920
    },
    "FN SCAR folding polymer stock (FDE)": {
        "img": "https://assets.tarkov.dev/61825d06d92c473c770215de-512.webp",
        "description": "A folding polymer stock for the SCAR-series rifles, manufactured by Fabrique Nationale Herstal. Flat Dark Earth version.",
        "ergonomics": 0,
        "recoil": -4,
        "price": 7909
    },
    "FN SCAR-L 5.56x45 14 inch barrel": {
        "img": "https://assets.tarkov.dev/6183fd911cb55961fa0fdce9-512.webp",
        "description": "A 14 inches long (355mm) STD barrel for the SCAR-series weapons chambered in 5.56x45 NATO ammo.",
        "ergonomics": -13,
        "recoil": -4,
        "price": 29200
    },
    "FN SCAR-L 5.56x45 upper receiver": {
        "img": "https://assets.tarkov.dev/618405198004cc50514c3594-512.webp",
        "description": "An upper receiver for the SCAR-L assault rifle, manufactured by Fabrique Nationale Herstal. Features a top rail for installation of additional equipment.",
        "ergonomics": 2,
        "recoil": 0,
        "price": 7544
    },
    "FN SCAR-L 5.56x45 assault rifle": {
        "img": "https://assets.tarkov.dev/6184055050224f204c1da540-512.webp",
        "description": "The FN SCAR-L (Special Operations Forces Combat Assault Rifle - Light) assault rifle chambered in 5.56x45 NATO rounds, was adopted by the US SOCOM as the Mk 16. Features a side-folding polymer stock and a free-floating, cold hammer-forged Mil-Spec barrel with hardchromed bore. Fully-ambidextrous operating controls instantly adapt the SCAR to any user or any shooting position. The receiver-integrated optical rail plus three accessory rails enable mounting of a wide variety of scopes, electronic sights, tactical lights and lasers. Manufactured by Fabrique Nationale Herstal.",
        "ergonomics": 45,
        "recoil": null,
        "price": 54627
    },
    "FN SCAR-L 5.56x45 upper receiver (FDE)": {
        "img": "https://assets.tarkov.dev/618426d96c780c1e710c9b9f-512.webp",
        "description": "An upper receiver for the SCAR-L assault rifle, manufactured by Fabrique Nationale Herstal. Features a top rail for installation of additional equipment. Flat Dark Earth version.",
        "ergonomics": 2,
        "recoil": 0,
        "price": 7909
    },
    "FN SCAR-L 5.56x45 assault rifle (FDE)": {
        "img": "https://assets.tarkov.dev/618428466ef05c2ce828f218-512.webp",
        "description": "The FN SCAR-L (Special Operations Forces Combat Assault Rifle - Light) assault rifle chambered in 5.56x45 NATO rounds, was adopted by the US SOCOM as the Mk 16. Features a side-folding polymer stock and a free-floating, cold hammer-forged Mil-Spec barrel with hardchromed bore. Fully-ambidextrous operating controls instantly adapt the SCAR to any user or any shooting position. The receiver-integrated optical rail plus three accessory rails enable mounting of a wide variety of scopes, electronic sights, tactical lights and lasers. Manufactured by Fabrique Nationale Herstal. Flat Dark Earth version.",
        "ergonomics": 45,
        "recoil": null,
        "price": 18000
    },
    "FN SCAR-L 5.56x45 assault rifle (FDE) CQC": {
        "img": "https://assets.tarkov.dev/6193e108c1982475fa2a7f16-512.webp",
        "description": null,
        "ergonomics": null,
        "recoil": null,
        "price": 132710
    },
    "FN SCAR-L 5.56x45 assault rifle LB": {
        "img": "https://assets.tarkov.dev/6193e18de693542ea37d11b3-512.webp",
        "description": null,
        "ergonomics": null,
        "recoil": null,
        "price": 113349
    },
    "FN SCAR-L 5.56x45 assault rifle (FDE) Default": {
        "img": "https://assets.tarkov.dev/6193e226449ec003d9127fa6-512.webp",
        "description": null,
        "ergonomics": null,
        "recoil": null,
        "price": 112865
    },
    "FN SCAR Kinetic MREX 6.5 M-LOK rail": {
        "img": "https://assets.tarkov.dev/619666f4af1f5202c57a952d-512.webp",
        "description": "The MREX 6.5 M-LOK rail for SCAR series rifles allows the installation of additional equipment. Manufactured by Kinetic.",
        "ergonomics": 3,
        "recoil": -1,
        "price": 11730
    },
    "FN SCAR-L 5.56x45 assault rifle (FDE) Contract Wars": {
        "img": "https://assets.tarkov.dev/619e61e70459e93c12392ba7-512.webp",
        "description": null,
        "ergonomics": null,
        "recoil": null,
        "price": 150000
    }
}
