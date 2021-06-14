import Song from './components/Song';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faStepForward, faStepBackward, faMusic, faPlusCircle, faMinusCircle} from '@fortawesome/free-solid-svg-icons';
import './App.css';
import { useRef, useEffect, useState} from 'react';

function App() {
	//States
	let [song, setSong] = useState('');
	let [isPlaying, setPlay] = useState(false);
	let [currentSelect, setCurrent] = useState(false);
	let [songsList, setList] = useState([]);
	let [currentTime, setCurrentTime] = useState(0);

	//References
	let audioPlayer = useRef();
	let progressBar = useRef();
	let animationRef = useRef();

	async function getSongs() {
        try {
            const response = await fetch('https://assets.breatheco.de/apis/sound/songs', {
                method: 'GET', // GET POST PUT DELETE
                //body: data, // POST PUT
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.status === 404) throw new Error("Pagina No encontrada");
            const data = await response.json();
        	setList(data);
        } catch (error) {
            console.log(error);
        }
    }
	useEffect(() => {
		getSongs();
	}, []);

	useEffect(() =>{
		console.log(audioPlayer.current.currentTime)
	}, [audioPlayer?.current?.currentTime])

	useEffect (() =>{
		const seconds = Math.floor(audioPlayer.current.duration);
		progressBar.current.max = seconds;
	}, [audioPlayer?.current?.loadedmetadata, audioPlayer?.current?.readyState])

	function selectSong(e){
		let select = e.target;
		setSong(`https://assets.breatheco.de/apis/sound/${select.name}`);
		setCurrent(parseInt(select.id));
		audioPlayer.current.src = song;
		audioPlayer.current.play();
		setPlay(true);
		animationRef.current = requestAnimationFrame(whilePlaying);
	}
 
	function togglePlayPause() {
		if(currentSelect === false)	return; 
        setPlay(!isPlaying);
		if(isPlaying) {
			audioPlayer.current.pause();
			cancelAnimationFrame(animationRef.current);
		}
		else{
			audioPlayer.current.play();
			animationRef.current = requestAnimationFrame(whilePlaying);
		} 
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
		audioPlayer.current.play();
	}

	function changeRange () {
		audioPlayer.current.currentTime = progressBar.current.value;
		setCurrentTime(progressBar.current.value);
	}

	function whilePlaying () {
		progressBar.current.value = audioPlayer.current.currentTime;
		setCurrentTime(progressBar.current.value);
		animationRef.current = requestAnimationFrame(whilePlaying);
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
			<div className="row songlist">
			{
				songsList !== undefined && 
				songsList.map((song, key) => {
				let active = {active: '', sound: ''};
				let itemNumber = key;
				if(key === currentSelect){
					active.active = 'active';
					active.sound = <FontAwesomeIcon icon={faMusic} className="MusicIcon"/>
				}
				return <Song sources={song} key={key} selectSong={selectSong} active={active.active} sound={active.sound} itemNumber={itemNumber} />
				})
			}
			</div>
			<div className="player">
				<div className="volume">
				<button className="button" type="button" onClick={downVolume}><FontAwesomeIcon icon={faMinusCircle} className="icon icon-volume" /></button>
				<button className="button" type="button" onClick={upVolume}><FontAwesomeIcon icon={faPlusCircle} className="icon icon-volume" /></button>
				</div>
				<div className="controls">
           			<button className="button" type="button" onClick={previous}><FontAwesomeIcon icon={faStepBackward} className="icon"/></button>
            		<button className="button" type="button" onClick={togglePlayPause}>
                	{isPlaying === false ? 
                    	<FontAwesomeIcon icon={faPlay} className="icon"/> :
                    	<FontAwesomeIcon icon={faPause} className="icon" />}
            		</button>
            		<button className="button" type="button" onClick={next}><FontAwesomeIcon icon={faStepForward} className="icon" /></button>
            		
        		</div>
				<div className="range">
					<input type="range" ref={progressBar} onChange={changeRange} />
				</div>
				<audio ref={audioPlayer} onEnded={ended}/>
			</div>
		</div>
	);
}

export default App;
