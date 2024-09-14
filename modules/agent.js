import { VertexAI } from '@google-cloud/vertexai'
import { request, gql } from 'graphql-request'
import fs from 'fs'

class Agent {
    constructor(projectId=process.env.tarkovAIProjectID, location=process.env.tarkovAILocation, modelID=process.env.tarkovAIModel) {  
        const tarkovAI = new VertexAI({project: projectId, location: location});
        const model = tarkovAI.getGenerativeModel({ model: modelID });

        this.chat = model.startChat({});
        this.prompts = {
            'systemPrompt': fs.readFileSync(`./private/prompts/systemPrompt.txt`, 'utf8'),
            'taskPrompt1': fs.readFileSync(`./private/prompts/taskPrompt1.txt`, 'utf8'),
            'taskPrompt2': fs.readFileSync(`./private/prompts/taskPrompt2.txt`, 'utf8'),
            'taskPrompt3': fs.readFileSync(`./private/prompts/taskPrompt3.txt`, 'utf8')
        }
    }

    async layer1(userPrompt) {
        const weaponTypeDesc = fs.readFileSync(`./private/data/weaponTypeDesc.json`, 'utf8');

        const input1 = `
            System Prompt:
            ${this.prompts.systemPrompt}
    
            Data:
            ${weaponTypeDesc}
    
            User Prompt:
            ${userPrompt}
    
            Task:
            ${this.prompts.taskPrompt1}
        `

        const output1 = (await this.chat.sendMessage(input1)).response
        console.log(output1)
        const weaponType = JSON.stringify(output1.candidates[0].content.parts[0].text).slice(1, -4)

        return weaponType
    }

    async layer2(weaponType) {
        const weapons = fs.readFileSync(`./private/data/weaponType/${weaponType}.json`, 'utf8');
        const input2 = `
            Data:
            ${weapons}
    
            Task:
            ${this.prompts.taskPrompt2}
        `
        const output2 = (await this.chat.sendMessage(input2)).response
        const weapon = JSON.stringify(output2.candidates[0].content.parts[0].text).slice(1, -4)

        return weapon
    }

    async layer3(weaponDataWithPrice, userPrompt) {
        const input3 = `
            Data:
            ${weaponDataWithPrice}
    
            Original User Prompt:
            ${userPrompt}
    
            Task:
            ${this.prompts.taskPrompt3}
        `
    
        const output3 = (await this.chat.sendMessage(input3)).response
        // TODO: Clean output3 to be used for final process
        items = [] // Temporary
        explanation = "" // Temporary
        return [items, explanation]
    }

    async getPrice(weapon, weaponType) {
        const weaponData = JSON.parse(fs.readFileSync(`./private/data/weapon/${weaponType}/${weapon}.json`, 'utf8'))
        const allowedItems = Object.keys(weaponData)

        const query = gql`
            {
                items(names: ${JSON.stringify(allowedItems)}) {
                    name
                    buyFor {
                        priceRUB
                    }
                }
            }
        `
        
        request('https://api.tarkov.dev/graphql', query).then((data) => {
            for (itemName of allowedItems) {
                weaponData['Item Properties'][itemName].price = data.data.items.find(item => item.name == itemName).buyFor[0].price
            }
            return weaponData
        })
    }

    format(items, weaponType, weapon, weaponData) {
        /*
        Function that gets items as a list, and turn it into a tree structure that can be processed by createTree later on frontend.
        */

        let root = {
            'name': weapon,
            'type': weaponType,
        }

        function getChildren(subTree) {
            let children = []

            for (const [type, value] of Object.entries(subTree)) {
                for (const allowedItem in value['Allowed Items']) {
                    if (items.includes(allowedItem)) {
                        let item = {
                            'name': allowedItem,
                            'type': type,
                        }

                        item.children = getChildren(value['Allowed Items'][allowedItem])
                        children.push(item)
                    }
                }
            }

            return children
        }
        root.children = getChildren(weaponData['Tree Structure'])
        return root
    }

    async build(userPrompt) {
        const weaponType = await this.layer1(userPrompt)
        const weapon = await this.layer2(weaponType)
        const weaponDataWithPrice = await this.getPrice(weapon, weaponType)
        const [items, explanation] = await this.layer3(weaponDataWithPrice, userPrompt)
        const itemTree = this.format(items, weaponType, weapon, weaponDataWithPrice)

        return [itemTree, items, explanation]
    }
}

export { Agent }