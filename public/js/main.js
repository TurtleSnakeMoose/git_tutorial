const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

document.addEventListener('DOMContentLoaded', () => {

    const dest_input = $('input');
    const btn_search = $('button');
    const msg1 = $('#msg1');
    const msg2 = $('#msg2');

    btn_search.addEventListener('click', () => {
        msg1.textContent = 'Loading...';
        msg2.textContent = '';

        fetch(`/weather?destination=${dest_input.value}`).then((response) => {
            response.json().then((data) => {

                if (data.error) {
                    msg1.textContent = data.error;
                    return;
                }

                const {location, feelslike, temperature} = data;
                msg1.textContent = `The forecast for ${location}:`;
                msg2.textContent = `It is now ${temperature} but feels like ${feelslike}.`;
            })
        });
    });

});