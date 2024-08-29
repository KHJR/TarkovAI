document.getElementById('sendButton').onclick = async () => {
    const userPrompt = document.getElementById('userPrompt').value
    fetch(`/build?userPrompt=${userPrompt}`)
    .then(response => response.text())
    .then(data => {
        data = JSON.parse(data)
        console.log(data)
    })
}