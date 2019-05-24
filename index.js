import run from './example/index.js';

window.onerror = function() {
    alert('Game broke! ' + [].join.call(arguments, ' | '))
};

run();