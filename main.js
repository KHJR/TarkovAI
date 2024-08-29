import { Agent } from './modules/agent.js'
import express from 'express'

const app = express()

const PORT = parseInt(process.env.PORT) || 8080

const agent = new Agent()

app.get('/build', async (req, res) => {
	const [items, explanation] = await agent.build(req.query.userPrompt)
	res.send({
		items: items,
		explanation: explanation
	});
});

app.use(express.static('public'))

app.listen(PORT, () => {
    console.log(`helloworld: listening on port ${PORT}`)
})