'use strict';

import frontexpress from '/lib/frontexpress/lib/frontexpress';

const app = frontexpress();

app.get('/pages/:id', (req, res) => {
    document.body.innerHTML = `Page ${req.params.id}`;
});
app.get('/comments/:id', (req, res) => {
    document.body.innerHTML = `Comment ${req.params.id}`;
});

app.listen();

['/pages/1', '/comments/1'].forEach(uri => {
    const button = document.createElement('button');
    button.textContent = uri;
    button.addEventListener('click', () => app.httpGet({ uri }));
    document.body.appendChild(button);
})