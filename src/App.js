import Song from './components/Song';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faStepForward, faStepBackward, faMusic, faPlusCircle, faMinusCircle} from '@fortawesome/free-solid-svg-icons';
import './App.css';
import { createRef, useState} from 'react';

let songsList = [
	{ "id":1, "category":"game", "name":"Mario Castle", "url":"files/mario/songs/castle.mp3" },
	{ "id":2, "category":"game", "name":"Mario Star", "url":"files/mario/songs/hurry-starman.mp3"},
	{ "id":3, "category":"game", "name":"Mario Overworld", "url":"files/mario/songs/overworld.mp3"}
]

function App() {
	let audioPlayer = createRef();
	let progressBar = createRef();
	let [song, setSong] = useState('');
	let [isPlaying, setPlay] = useState(false);
	let [currentSelect, setCurrent] = useState(false);

	function selectSong(e){
		audioPlayer.current.pause();
		let select = e.target;
		setSong(`https://assets.breatheco.de/apis/sound/${select.name}`);
		setCurrent(parseInt(select.id) - 1);
		audioPlayer.current.src = song;
		audioPlayer.current.load();
		audioPlayer.current.play();
		setPlay(true);
	}
 
	function togglePlayPause() {
		if(currentSelect === false)	return; 
        setPlay(!isPlaying);
		if(isPlaying) audioPlayer.current.pause()
		else audioPlayer.current.play();
    } 

	function next() {
		if (currentSelect === false) return;
		audioPlayer.current.pause();
		setPlay(true);
		if (currentSelect + 1 === songsList.length){
			setCurrent(0);
			setSong(`https://assets.breatheco.de/apis/sound/${songsList[0].url}`);
		}
		if (currentSelect + 1 < songsList.length){
			setCurrent(currentSelect+1);
			setSong(`https://assets.breatheco.de/apis/sound/${songsList[currentSelect+1].url}`);
		}
		audioPlayer.current.src = song;
		audioPlayer.current.load();
		audioPlayer.current.play();
	}

	function previous() {
		if (currentSelect === false) return;
		audioPlayer.current.pause();
		setPlay(true);
		if (currentSelect - 1 === -1){
			setCurrent(songsList.length-1);
			setSong(`https://assets.breatheco.de/apis/sound/${songsList[songsList.length-1].url}`);
		}
		if (currentSelect - 1 > -1){
			setCurrent(currentSelect-1);
			setSong(`https://assets.breatheco.de/apis/sound/${songsList[currentSelect-1].url}`);
		}
		audioPlayer.current.src = song;
		audioPlayer.current.load();
		audioPlayer.current.play();
	}

	function setProgressBar () {
		const seconds = Math.floor(audioPlayer.current.duration);
		progressBar.current.max = seconds;
	}

	function changeRange () {
		setProgressBar();
		audioPlayer.current.currentTime = progressBar.current.value;
	}

	function ended (){
		setPlay(false);
	}

	function upVolume() {
		if(audioPlayer.current.volume === 1)	return;
		audioPlayer.current.volume += 0.1;
	}
	function downVolume() {
		if(audioPlayer.current.volume < 0.01)	return;
		audioPlayer.current.volume -= 0.1;
	}
	return (
		<div className="app">
			<div className="row">
			{
				songsList.map((song, e) => {
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
					<button className="button" type="button" onClick={downVolume}><FontAwesomeIcon icon={faMinusCircle} className="icon" /></button>
					<button className="button" type="button" onClick={upVolume}><FontAwesomeIcon icon={faPlusCircle} className="icon" /></button>
           			<button className="button" type="button" onClick={previous}><FontAwesomeIcon icon={faStepBackward} className="icon"/></button>
            		<button className="button" type="button" onClick={togglePlayPause}>
                	{isPlaying === false ? 
                    	<FontAwesomeIcon icon={faPlay} className="icon"/> :
                    	<FontAwesomeIcon icon={faPause} className="icon" />}
            		</button>
            		<button className="button" type="button" onClick={next}><FontAwesomeIcon icon={faStepForward} className="icon" /></button>
            		<input type="range" ref={progressBar} onChange={changeRange} />
        		</div>
				<audio ref={audioPlayer} onEnded={ended}/>
			</div>
		</div>
	);
}

export default App;
