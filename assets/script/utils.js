'use strict';

export function getElement(selector, scope = document) {
    return scope.getElementById(selector);
}

export function select(selector, scope = document) {
    return scope.querySelector(selector);
}

export function selectAll(selector, scope = document) {
    return [...scope.querySelectorAll(selector)];
}

export function listen(selector, event, callback) {
    return selector.addEventListener(event, callback);
}