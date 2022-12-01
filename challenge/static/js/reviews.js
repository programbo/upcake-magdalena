const $ = document.querySelector.bind(document);

window.onload = () => {
    $('#reviewBtn').addEventListener('click', addReview);
}

const addReview = async (link, id) => {
    $('#reviewBtn').disabled = true;
    let card = $('#resp-msg');
    card.style.display = 'block';
    card.innerText = 'Submitting your review...';
	let name = $('#name').value;
    let review = $('#review').value;
    let post_id = $('#post-id').value;
    if (name === '' || review === '') {
        return;
    }
	await fetch('/api/reviews/add', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({post_id, name, review}),
	})
    .then(resp => resp.json()
    .then(response => {
        if (resp.status == 200) {
            card.innerText = 'Your review is submitted successfully!';
            setTimeout(() => { location.reload()}, 500);
        }
        else {
            card.innerText = 'Something went wrong, please try again!';
        }
        $('#reviewBtn').disabled = false;
    })
	.catch((error) => {
        card.innerText = 'Something went wrong, please try again!';
		console.log(error);
        $('#reviewBtn').disabled = false;
	}));
}