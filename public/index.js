class Agent {
    constructor() {

    }

    async build(userPrompt) {
        fetch(`/build`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userPrompt: userPrompt })
        })
        .then(response => response.text())
        .then(data => {
            data = JSON.parse(data)
            return data
        })
    }
}