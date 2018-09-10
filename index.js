import { Game } from './Game';
import './index.css';

const numGames = 1;

export default () => (
    <div class="some-index-root" style={{ height: '100%' }}>
        {Array(numGames).fill(0).map(() => (
            <Game scale={'auto'} />
        ))}
    </div>
);
