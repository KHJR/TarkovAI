import { Agent } from './modules/agent.js'
import express from 'express'

const app = express()
const PORT = parseInt(process.env.PORT) || 8080
const agent = new Agent()

app.use(express.json())

app.post('/build', async (req, res) => {
	try {
		console.log(req.body.userPrompt)
		const [items, explanation] = await agent.build(req.body.userPrompt)
		res.send({
			items: items,
			explanation: explanation
		});
	}
	catch (err) {
		res.status(500).send({ error: 'Something went wrong' });
	}
});

app.use(express.static('public'))

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})