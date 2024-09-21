//Test to see if the tree will be built correctly.
let itemTree = {}
let items = []
let itemData = {}

class Agent {
    constructor() {
        this.itemTree = {}
        this.items = []
        this.itemData = {}
        this.explanation = ''
    }

    async getItemData(items) {
    
        const response = await fetch('https://api.tarkov.dev/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query: `{
                    items(names: ${JSON.stringify(items)}) {
                        name
                        image512pxLink
                        description
                        ergonomicsModifier
                        recoilModifier
                        buyFor {
                            priceRUB
                        }
                    }
                }`
            })
        });
        
        const data = await response.json();
        console.log(data);

        let itemData = {};
        const rawItemData = data.data.items //.slice(0, items.length+1);
        for (const item of rawItemData) {
            itemData[item.name] = {
                img: item.image512pxLink,
                description: item.description,
                ergonomics: item.ergonomicsModifier,
                recoil: item.recoilModifier,
                price: item.buyFor.length > 0? item.buyFor[0].priceRUB : 0
            };
        }

        return itemData;
    }

    async build(userPrompt) {
        const response = await fetch(`/build`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userPrompt: userPrompt })
        });


        const data = await response.text();
        const parsedData = JSON.parse(data);

        this.itemTree = parsedData.itemTree;
        this.items = parsedData.items;
        this.itemData = await this.getItemData(this.items);
        this.explanation = parsedData.explanation;

        return { itemTree: this.itemTree, items: this.items, itemData: this.itemData};
    }
}

//Every code below can and should be deleted for production
async function test() {
    const agent = new Agent()
    const result = await agent.build('I want a MP5 with surpressor and 1x scope')

    //Assign the result to the global variable
    itemTree = result.itemTree
    items = result.items
    itemData = result.itemData

    console.log(itemTree)
    console.log(items)
    console.log(itemData)

    createTree(itemTree, itemData)
}

test()