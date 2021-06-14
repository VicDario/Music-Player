import './Song.css';

function Song(props) {
    return (
        <button type="button" className={'col-md-12 item '+ props.active } id={props.itemNumber} name={props.sources.url} onClick={props.selectSong}>
            <p>{props.itemNumber + 1}</p>{props.sources.name} {props.sound}
        </button>
    )
}

export default Song;