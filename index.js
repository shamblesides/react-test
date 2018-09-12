import { Game } from './Game';
import './index.css';

if (typeof window !== 'undefined') window.onerror = alert;

const numGames = 1;

export default () => (
    <div class="some-index-root" style={{ height: '100%' }}>
        {Array(numGames).fill(0).map(() => (
            <Game scale={'auto'} />
        ))}
    </div>
);
