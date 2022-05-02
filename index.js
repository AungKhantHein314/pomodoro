function App() {

    const [displayTime, setDisplayTime] = React.useState(25 * 60);
    const [breakTime, setBreakTime] = React.useState(5 * 60);
    const [sessionTime, setSessionTime] = React.useState(25 * 60);
    const [timerOn, setTiemrOn] = React.useState(false);
    const [breakAudio, setBreakAudio] = React.useState(new Audio("./alarm.mp3"))
    const [onBreak, setOnBreak] = React.useState()

    const playBreakSound = () => {
        breakAudio.currentTime = 0;
        breakAudio.play();

    }

    const formatTime = (time) => {
        let minutes = Math.floor(time/60);
        let seconds = time % 60;
        return (
            (minutes < 10 ? "0" + minutes : minutes) + ":" + 
            (seconds < 10 ? "0" + seconds : seconds)
        );
    }

    const changeTime = (amount, type) => {
        if(type == "break") {
            if(breakTime <= 60 && amount < 0) {
                return ;
            }
            setBreakTime(prev => prev + amount)
        } else { 
            if(sessionTime <= 60 && amount < 0) {
                return ;
            }
            setSessionTime(prev => prev + amount)
            if(!timerOn){
                setDisplayTime(sessionTime + amount)
            }
        }
    }

    const controlTime = () => {
        let second = 1000;
        let date = new Date().getTime();
        let nextDate = new Date().getTime() + second;
        let onBreakVariable = onBreak;
        if(!timerOn) {
            let interval = setInterval(() => {
                date = new Date().getTime();
                if(date > nextDate) {
                    setDisplayTime(prev => {
                        if(prev <= 0 && !onBreakVariable) {
                            playBreakSound();
                            onBreakVariable=true
                            setOnBreak(true);
                            return breakTime;
                        }else if (prev <= 0 && onBreakVariable) {
                            playBreakSound();
                            onBreakVariable=false;
                            setOnBreak(false);
                            return sessionTime;
                        }
                        return prev -1
                    })
                    nextDate += second;
                }
            }, 30);
            localStorage.clear();
            localStorage.setItem('interval-id', interval)
        }
        if(timerOn){
            clearInterval(localStorage.getItem("interval-id"))
        }
        setTiemrOn(!timerOn)
    }

    const resetTime = () => {
        setDisplayTime(25 * 60);
        setBreakTime(5*60);
        setSessionTime(25 * 60);
    }

    return (
        <div className="text-center">
            <h1>PomodoroClock</h1>
            <div className="dual-container">
                <Length title={"break length"} changeTime={changeTime} type={"break"} time={breakTime} formatTime={formatTime}/>
                <Length title={"session length"} changeTime={changeTime} type={"session"} time={sessionTime} formatTime={formatTime}/>
            </div>
            <h3>{onBreak ? "Break" : "Session"}</h3>
            <h1 className="text-center" style={{marginTop: 40}}>{formatTime(displayTime)}</h1>
            <button className="btn btn-lg" style={{color: "white"}} onClick={controlTime}>
                {timerOn ? <i className="fas fa-pause"></i> : <i className="fas fa-play"></i>}
            </button>
            <button className="btn btn-lg" onClick={resetTime}>
                    <i className="fas fa-redo" style={{color: "white"}}></i>
                </button>
        </div>
    )
}

function Length({title, changeTime, type, time, formatTime}) {
    return (
        <div>
            <h3>{title}</h3>
            <div className="time-sets">
                <button className="btn" onClick={() => changeTime(-60, type)}>
                    <i className="fas fa-arrow-circle-down" style={{color: "white"}}></i>
                </button>
                <h3>{formatTime(time)}</h3>
                <button className="btn" onClick={() => changeTime(60, type)}>
                    <i className="fas fa-arrow-circle-up" style={{color: "white"}}></i>
                </button>
            </div>
        </div>
    )
}

ReactDOM.render(<App/>, document.getElementById("app"))