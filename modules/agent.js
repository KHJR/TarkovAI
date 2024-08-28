const { request, gql } = require('graphql-request')

class Agent {
    constructor(projectId=process.env.tarkovAIProjectID, location=process.env.tarkovAILocation, model=process.env.tarkovAIModel) {  
        const tarkovAI = new tarkovAI({project: projectId, location: location});
        const model = tarkovAI.getGenerativeModel({ model: model });

        this.chat = model.startChat({});
        this.prompts = JSON.parse(fs.readFileSync(`./private/prompts.json`, 'utf8'));
    }

    async layer1(userPrompt) {
        const weaponTypeDesc = fs.readFileSync(`./private/data/weaponTypeDesc.json`, 'utf8');

        const input1 = `
            System Prompt:
            ${this.prompts.layer1.systemPrompt}
    
            Data:
            ${weaponTypeDesc}
    
            User Prompt:
            ${userPrompt}
    
            Task:
            ${this.prompts.layer1.taskPrompt1}
        `

        const output1 = (await this.chat.sendMessage(input1)).response
        const weaponType = JSON.stringify(output1.candidates[0].content.parts[0].text).slice(1, -4)

        return weaponType
    }

    async layer2(weaponType) {
        const weapons = fs.readFileSync(`./private/data/weaponType/${weaponType}.json`, 'utf8');
        const input2 = `
            Data:
            ${weapons}
    
            Task:
            ${this.prompts.layer2.taskPrompt2}
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
            ${this.prompts.layer3.taskPrompt3}
        `
    
        const output3 = (await this.chat.sendMessage(input3)).response
        // TODO: Clean output3 to be used for final process
        items = [] // Temporary
        explanation = "" // Temporary
        return [items, explanation]
    }

    async getPrice(weapon, weaponType) {
        const weaponData = fs.readFileSync(`./private/data/weapon/${weaponType}/${weapon}.json`, 'utf8');
        const allowedItems = Object.keys(weaponData)

        const query = gql`
            {
                items(names: ${JSON.stringify(allowedItems)}) {
                    name
                    buyFor {
                        price
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

    async build(userPrompt) {
        const weaponType = this.layer1(userPrompt)
        const weapon = this.layer2(weaponType)
        const weaponDataWithPrice = this.getPrice(weapon, weaponType)
        const [items, explanation] = this.layer3(weaponDataWithPrice, userPrompt)

        return [items, explanation]
    }
}

module.exports = { Agent }