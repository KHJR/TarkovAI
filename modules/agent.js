import { VertexAI } from '@google-cloud/vertexai'
import { request, gql } from 'graphql-request'
import fs from 'fs'

class Agent {
    constructor(projectId = process.env.tarkovAIProjectID, location = process.env.tarkovAILocation, modelID = process.env.tarkovAIModel) {
        const tarkovAI = new VertexAI({ project: projectId, location: location });
        this.model = tarkovAI.getGenerativeModel({ model: modelID });

        this.chat = this.model.startChat({});
        this.prompts = {
            'systemPrompt': fs.readFileSync(`./private/prompts/systemPrompt.txt`, 'utf8'),
            'taskPrompt1': fs.readFileSync(`./private/prompts/taskPrompt1.txt`, 'utf8'),
            'taskPrompt2': fs.readFileSync(`./private/prompts/taskPrompt2.txt`, 'utf8'),
            'taskPrompt3': fs.readFileSync(`./private/prompts/taskPrompt3.txt`, 'utf8'),
            'taskPrompt4': fs.readFileSync(`./private/prompts/taskPrompt4.txt`, 'utf8'),
            'taskPrompt5': fs.readFileSync(`./private/prompts/taskPrompt5.txt`, 'utf8')
        }
    }

    async layer1(userPrompt) {
        console.log("Just entered Agent")
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
        console.log(output1.candidates[0].content.parts[0].text)
        const weaponType = JSON.parse(output1.candidates[0].content.parts[0].text.match(/\[.*\]/s)[0])[0]

        return weaponType
    }

    async layer2(weaponType, userPrompt) {
        const weapons = fs.readFileSync(`./private/data/weaponType/${weaponType}.json`, 'utf8');
        const input2 = `
            Data:
            ${weapons}

            User Prompt:
            ${userPrompt}
    
            Task:
            ${this.prompts.taskPrompt2}
        `
        const output2 = (await this.chat.sendMessage(input2)).response
        const weapon = JSON.parse(output2.candidates[0].content.parts[0].text.match(/\[.*\]/s)[0])[0]

        return weapon
    }

    async layer3(weaponDataWithPrice, userPrompt) {
        const input3 = `
            Data:
            ${JSON.stringify(weaponDataWithPrice)}
    
            Original User Prompt:
            ${userPrompt}
    
            Task:
            ${this.prompts.taskPrompt3}
        `

        const output3 = (await this.chat.sendMessage(input3)).response
        const result = JSON.parse(output3.candidates[0].content.parts[0].text.match(/\{.*\}/s)[0])

        return {items: result.attachments, explanation: result.explanation}
    }

    async layer4(weaponData, items) {
        const input4 = `
            Dataset:
            ${JSON.stringify(weaponData['Item Properties'])}

            List of items:
            ${JSON.stringify(items)}

            Task:
            ${this.prompts.taskPrompt4}
        `
        this.chat = this.model.startChat({})
        const output4 = (await this.chat.sendMessage(input4)).response
        const checkedItems = JSON.parse(output4.candidates[0].content.parts[0].text.match(/\[.*\]/s)[0])
        
        return checkedItems
    }

    async layer5(weaponData, items) {
        console.log("at layer 5")

        const input5 = `
            Tree Data:
            ${JSON.stringify(weaponData['Tree Structure'])}

            List of items:
            ${JSON.stringify(items)}

            Task:
            ${this.prompts.taskPrompt5}
        `

        const output5 = (await this.chat.sendMessage(input5)).response
        const checkedItems = JSON.parse(output5.candidates[0].content.parts[0].text.match(/\[.*\]/s)[0])

        return checkedItems
    }


    async getPrice(weapon, weaponType) {
        const weaponData = JSON.parse(fs.readFileSync(`./private/data/weapon/${weaponType}/${weapon}.json`, 'utf8'));
        const allowedItems = Object.keys(weaponData['Item Properties']);

        const query = gql`
            {
                items(names: ${JSON.stringify(allowedItems)}) {
                    name
                    buyFor {
                        priceRUB
                    }
                }
            }
        `;

        try {
            const data = await request('https://api.tarkov.dev/graphql', query);
            for (const itemName of allowedItems) {
                const buyFor = data.items.find(item => item.name === itemName).buyFor;
                weaponData['Item Properties'][itemName].price = buyFor.length > 0 ? buyFor[0].priceRUB : 0;
            }
            return weaponData; // Now this will return after the data is processed
        } catch (error) {
            console.error("Error fetching data:", error);
            throw error; // Optional: rethrow or handle the error accordingly
        }
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
        this.chat = this.model.startChat({})
        const weaponType = await this.layer1(userPrompt)
        const weapon = await this.layer2(weaponType, userPrompt)
        const weaponDataWithPrice = await this.getPrice(weapon, weaponType)
        const result = await this.layer3(weaponDataWithPrice, userPrompt)
        
        let checkedItems = await this.layer4(weaponDataWithPrice, result.items)
        checkedItems.push(weapon)
        checkedItems = await this.layer5(weaponDataWithPrice, checkedItems)

        const itemTree = this.format(checkedItems, weaponType, weapon, weaponDataWithPrice)

        return [itemTree, checkedItems, result.explanation]
    }
}

export { Agent }