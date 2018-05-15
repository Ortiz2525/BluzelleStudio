import logo from './logo.png';

export const Header = () => (
    <div style={{
        textAlign: 'center',
        marginTop: 10
    }}>
        <img 
            width="320px"
            src={logo}/>
        <h1 style={{
            display: 'inline-block',
            fontWeight: 'bold',
            fontFamily: 'Courier New',
            color: '#32658A',
            marginLeft: 35,
            marginBottom: 18,
            verticalAlign: 'bottom',
            fontSize: 40
        }}>Database Editor</h1>
    </div>
);