import { Game } from './Game';

export default () => (
    <div>
        <div style={{ width: '100%', height: 300 }}>
            <Game scale={'auto'} />
        </div>
        <div style={{ width: '100%', height: 300 }}>
            <Game scale={2} />
            <Game scale={2} />
        </div>
    </div>
);
