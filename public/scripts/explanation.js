function createExplanation(explanation) {
    document.getElementById('explanation-title').innerText = 'Explanation'
    document.getElementById('explanation').innerText = explanation
}

function loading() {
    document.getElementById('explanation-title').innerText = 'Loading'
    document.getElementById('explanation').innerText = 'Waiting for response... If its taking more than a minute, please refresh and try again.'
}

function errored() {
    document.getElementById('explanation-title').innerText = 'Error'
    document.getElementById('explanation').innerText = 'Error occurred while processing. Most likely it is due to request quota being exceeded. Please refresh the page and try again after a few seconds.'
}