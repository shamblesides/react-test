import { Game } from './Game';

export default () => (
    <div class="some-index-root">
        <div class="some-index-container-1" style={{ width: '100%', height: 300, border: 'solid 1px' }}>
            <Game scale={'auto'} />
        </div>
        <div class="some-index-container-2" style={{ width: '100%', height: 300, border: 'solid 1px' }}>
            <Game scale={2} />
            <Game scale={2} />
        </div>
    </div>
);
