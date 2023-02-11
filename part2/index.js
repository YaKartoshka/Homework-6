function destroyPopup(popup) {
    popup.remove();
}

function ask({question, cancel = false}) {
    return new Promise(resolve => {

        const popup = document.createElement('form');
        popup.classList.add('popup');
        popup.classList.add('open');

        popup.insertAdjacentHTML(
            'afterbegin',
            `<fieldset>
        <label>${question}</label>
        <input name="input" type="file">
        <button type="submit" class="submit">Submit</button>
        </fieldset>`
                );
        
        if (cancel) {
            const cancelButton = document.createElement('button');
            cancelButton.type = 'button';
            cancelButton.textContent = 'Cancel';
            popup.appendChild(cancelButton);

            cancelButton.addEventListener('click', () => {
                resolve(null);
                destroyPopup(popup);
            })
        }

        popup.addEventListener('submit', e => {
            e.preventDefault();
            const inputValue = e.target.input.value;
            resolve(inputValue);

            destroyPopup(popup);
        }, { once: true });

        document.body.appendChild(popup);
    })
}

const questions = [
    {
        question: 'Upload your profile image',
    },
    {
        question: 'Upload your cover letter',
        cancel: true
    },
    {
        question: 'Upload your permissions',
    }
];

// Promise.all(questions.map(question => ask(question))).then();

// questions.forEach(async(question) => {
//     await ask(question);
// });

async function askMany() {
    questions.forEach(async(question)=>{
        const answer = await ask(question);
        console.log(answer)
    });
    
}

askMany();