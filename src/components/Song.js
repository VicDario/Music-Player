import './Song.css';

function Song(props) {
    return (
        <button type="button" className={'col-md-12 item '+ props.active } id={props.sources.id} name={props.sources.url} onClick={props.selectSong}>
            <p>{props.sources.id}</p>{props.sources.name} {props.sound}
        </button>
    )
}

export default Song;