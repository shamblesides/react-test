import { Game } from './Game';

const numGames = 1;

export default () => (
    <div class="some-index-root">
        {Array(numGames).fill(0).map(() => (
            <div style="display: inline-block; margin: 5px">
                <Game scale={2} />
            </div>
        ))}
    </div>
);
