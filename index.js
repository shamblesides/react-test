import run from './example/index';

window.onerror = function() {
    alert('Game broke! ' + [].join.call(arguments, ' | '))
};

run();