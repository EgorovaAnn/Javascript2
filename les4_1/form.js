"use strict"

const text = document.querySelector('.text');
const tel = document.querySelector('.tel');
const email = document.querySelector('.email');
const btn = document.querySelector('button');



class Validator {
    constructor(form) {
        this.patterns = {
            name: /^[a-zа-яА-ЯЁё]+$/i,
            tel: /^\+7\(\d{3}\)\d{3}-\d{4}$/,
            email: /^[\w._-]+@\w+\.[a-z]{2,4}$/i
        };
        this.errors = {
            name: 'Имя содержит только буквы',
            tel: 'Телефон подчиняется шаблону +7(000)000-0000',
            email: 'E-mail выглядит как mymail@mail.ru, или my.mail@mail.ru, или my-mail@mail.ru'
        };
        this.errorClass = 'errorMsg';
        this.form = form;
        this.valid = false;
        this.validateForm();
    }
    validateForm(){
        let errors = [...document.getElementById(this.form).querySelectorAll(`.${this.errorClass}`)];
        for (let error of errors){
            error.remove();
        }
        let formFields = [...document.getElementById(this.form).getElementsByTagName('input')];
        for (let field of formFields){
            this.validate(field);
        }
        if(![...document.getElementById(this.form).querySelectorAll('.invalid')].length){
           this.valid = true;
        }
    }
    validate(field){
        if(this.patterns[field.name]){
            if(!this.patterns[field.name].test(field.value)){
               field.classList.add('invalid');
               this.addErrorMsg(field);
               this.watchField(field);
            }
        }
    }
    addErrorMsg(field){
        let error = `<div class="${this.errorClass}">${this.errors[field.name]}</div> `;
        field.parentNode.insertAdjacentHTML('beforeend', error);
    }
    watchField(field){
        field.addEventListener('input', () => {
            let error = field.parentNode.querySelector(`.${this.errorClass}`);
            if(this.patterns[field.name].test(field.value)){
                field.classList.remove('invalid');
                field.classList.add('valid');
                if(error){
                    error.remove();
                }
            } else {
                field.classList.remove('valid');
                field.classList.add('invalid');
                if(!error){
                    this.addErrorMsg(field);
                }
            }
        });
    }
}
