import Song from './components/Song';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faStepForward, faStepBackward, faMusic} from '@fortawesome/free-solid-svg-icons';
import './App.css';
import { createRef, useState} from 'react';

let songs = [
	{ "id":1, "category":"game", "name":"Mario Castle", "url":"files/mario/songs/castle.mp3" },
	{ "id":2, "category":"game", "name":"Mario Star", "url":"files/mario/songs/hurry-starman.mp3"},
	{ "id":3, "category":"game", "name":"Mario Overworld", "url":"files/mario/songs/overworld.mp3"}
]

function App() {
	let audioPlayer = createRef();
	let [song, setSong] = useState('');
	let [isPlaying, setPlay] = useState(false);
	let [currentSelect, setCurrent] = useState(false);

	function selectSong(e){
		audioPlayer.current.pause();
		let select = e.target;
		if(isPlaying) setPlay(!isPlaying);
		setSong(`https://assets.breatheco.de/apis/sound/${select.name}`);
		setCurrent(parseInt(select.id) - 1);
	}
 
	function togglePlayPause() {
		if(currentSelect === false)	return; 
        setPlay(!isPlaying);
		if(isPlaying) audioPlayer.current.pause()
		else audioPlayer.current.play();
    } 

	function next() {
		if (!currentSelect) return;
		audioPlayer.current.pause();
		if (currentSelect + 2 >= songs.length){
			setCurrent(0);
			setSong(`https://assets.breatheco.de/apis/sound/${songs[0].url}`);
		}
		if (currentSelect + 1 <= songs.length){
			setCurrent(currentSelect+1);
			setSong(`https://assets.breatheco.de/apis/sound/${songs[currentSelect-1].url}`);
		}
		console.log(song);
	}
	return (
		<div className="app">
			<div className="row">
			{
				songs.map((song, e) => {
					let active = {active: '', sound: ''};
					if(e === currentSelect){
						active.active = 'active';
						active.sound = <FontAwesomeIcon icon={faMusic} className="MusicIcon"/>
					}
					return <Song sources={song} key={e} selectSong={selectSong} active={active.active} sound={active.sound} />
				})
			}
			</div>
			<div className="row">
				<div className="col-md-12 d-flex justify-content-center player">
           			<button className="button" type="button"><FontAwesomeIcon icon={faStepBackward} className="icon"/></button>
            		<button className="button" type="button" onClick={togglePlayPause}>
                	{isPlaying === false ? 
                    	<FontAwesomeIcon icon={faPlay} className="icon"/> :
                    	<FontAwesomeIcon icon={faPause} className="icon" />}
            		</button>
            		<button className="button" onClick={next}><FontAwesomeIcon icon={faStepForward} className="icon" /></button>
            		<audio ref={audioPlayer} src={song} />
        		</div>
			</div>
		</div>
	);
}

export default App;
