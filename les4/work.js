"use strict"

const text = document.querySelector('div');
const btn = document.querySelector('button')
btn.addEventListener('click', () => {
//text.textContent = text.textContent.replace(/'/g, '"')
text.textContent = text.textContent.replace(/\B'|'\B/g, '"')
})