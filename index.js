import run from './game/index';

window.onerror = function() {
    alert('Game broke! ' + [].join.call(arguments, ' | '))
};

run();