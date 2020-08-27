import React from 'react';
import ReactDOM from 'react-dom';

import '../src/style.scss';

import pomodoro from '../src/img/pomodoro.png';
import breaky from '../src/img/break.png';
import play_pause from '../src/img/play_pause.png';
import reset from '../src/img/reset.png';

var interval;

class App extends React.Component{
    constructor(props){
        super(props);
        this.state={
            currentTimer: new Date(0,0,1,0,25,0),
            sessionLength: 25,
            breakLength: 5,
            timerLabel: 'Session',
            timerRunning: false
        }
        this.handlePlayPause = this.handlePlayPause.bind(this);
        this.handleInterval = this.handleInterval.bind(this);
        this.handleIncreaseLength = this.handleIncreaseLength.bind(this);
        this.handleDecreaseLength = this.handleDecreaseLength.bind(this);
        this.handleReset = this.handleReset.bind(this);
    }

    handlePlayPause(){
        if(!this.state.timerRunning){
            this.handleInterval();
        }  
        else{
            clearInterval(interval);
        }
        this.setState(state=>{
            return {timerRunning: !state.timerRunning}
        })
    }

    handleInterval(){
        interval = setInterval(()=>{
            if(this.state.currentTimer.getHours()===1){
                this.setState(state=>{
                    state.currentTimer.setHours(0);
                    state.currentTimer.setMinutes(59);
                    state.currentTimer.setSeconds(59);
                    return {
                        currentTimer: state.currentTimer
                    }
                })
            }
            else if(this.state.currentTimer.getMinutes()===0 && this.state.currentTimer.getSeconds()===0){
                this.setState(state=>{
                    const nextLabel = state.timerLabel === 'Session' ? 'Break' : 'Session'; 
                    const nextLength = nextLabel === 'Session' ? state.sessionLength : state.breakLength; 
                    state.currentTimer.setMinutes(nextLength);
                    return {
                        currentTimer: state.currentTimer,
                        timerLabel: nextLabel
                    }
                });
            }
            else{
                this.setState(state=>{
                    state.currentTimer.setSeconds(state.currentTimer.getSeconds() -1);
                    return {
                        currentTimer: state.currentTimer
                    }
                });
            }
            
        }, 1000);
    }

    handleIncreaseLength(e){
        if(!this.state.timerRunning){
            if(e.currentTarget.className==="session" && this.state.sessionLength<60){
                this.setState(state=>{
                    const newSessionLength = state.sessionLength + 1;
                    if(newSessionLength===60){
                        state.currentTimer.setHours(1);
                        state.currentTimer.setMinutes(0);
                    }
                    else{
                        state.currentTimer.setMinutes(newSessionLength);
                    }
                    state.currentTimer.setSeconds(0);
                    return {
                        sessionLength: newSessionLength,
                        currentTimer: state.currentTimer
                    }
                });
            }
            else if(e.currentTarget.className==="break" && this.state.breakLength < 60){
                this.setState(state=>{
                    return {breakLength: state.breakLength + 1}
                });
            }
            
        } 
    }

    handleDecreaseLength(e){
        if(!this.state.timerRunning){
            if(e.currentTarget.className==="session" && this.state.sessionLength>1){
                this.setState(state=>{
                    const newSessionLength = state.sessionLength - 1;
                    state.currentTimer.setMinutes(newSessionLength);
                    state.currentTimer.setSeconds(0);
                    return {
                        sessionLength: state.sessionLength - 1,
                        currentTimer: state.currentTimer
                    }
                     });
            }
            else if(e.currentTarget.className==="break" && this.state.breakLength > 1){
                this.setState(state=>{
                    return {breakLength: state.breakLength - 1}
                     });
            }
        }  
    }

    handleReset(){
        clearInterval(interval);

        this.setState({
            currentTimer: new Date(0,0,1,0,25,0),
            sessionLength: 25,
            breakLength: 5,
            timerRunning: false,
            timerLabel: 'Session'
        })
    }

    render() {
        let timeLeft= this.state.currentTimer.getHours() === 1 ? '60:00': this.state.currentTimer.toLocaleTimeString().slice(3,8);
        return(
            <div id="react-app">
                <div id="timer-label">{this.state.timerLabel}</div>
                <Timer timeLeft={timeLeft}/>
                <Session 
                    sessionLength={this.state.sessionLength} 
                    increase={this.handleIncreaseLength}
                    decrease={this.handleDecreaseLength} 
                />
                <Break 
                    breakLength={this.state.breakLength} 
                    increase={this.handleIncreaseLength}
                    decrease={this.handleDecreaseLength}
                />
                <div id="controls">
                    <PlayPause handlePlayPause={this.handlePlayPause}/>
                    <Reset handleReset={this.handleReset}/>
                </div>                
                <p>
                Essential Pomodoro Clock<br/>
                by<br/>
                Arturo Gascon</p>

            </div>
        );
    }

}

class Timer extends React.Component{
    render(){
        return(
            <div id="time-left">{this.props.timeLeft}</div>
        );
    }
}

class Session extends React.Component{
    render(){
        return(
            <div id="session-container">
                <div id="session-increment" className="session" onClick={this.props.increase}>
                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="plus-circle" className="svg-inline--fa fa-plus-circle fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm144 276c0 6.6-5.4 12-12 12h-92v92c0 6.6-5.4 12-12 12h-56c-6.6 0-12-5.4-12-12v-92h-92c-6.6 0-12-5.4-12-12v-56c0-6.6 5.4-12 12-12h92v-92c0-6.6 5.4-12 12-12h56c6.6 0 12 5.4 12 12v92h92c6.6 0 12 5.4 12 12v56z"></path></svg>
                </div>
                <div id="session-length" className="session">{this.props.sessionLength}</div>
                <div id="session-decrement" className="session" onClick={this.props.decrease}>
                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="minus-circle" className="svg-inline--fa fa-minus-circle fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zM124 296c-6.6 0-12-5.4-12-12v-56c0-6.6 5.4-12 12-12h264c6.6 0 12 5.4 12 12v56c0 6.6-5.4 12-12 12H124z"></path></svg>
                </div>
                <div id="session-label">Session</div>
                <div className="img-deco">
                    <img src={pomodoro} alt="pomodoro"/> 
                </div>
                
            </div>
        );
    }
}

class Break extends React.Component{
    render(){
        return(
            <div id="break-container">
                <div id="break-increment" className="break" onClick={this.props.increase}>
                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="plus-circle" className="svg-inline--fa fa-plus-circle fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm144 276c0 6.6-5.4 12-12 12h-92v92c0 6.6-5.4 12-12 12h-56c-6.6 0-12-5.4-12-12v-92h-92c-6.6 0-12-5.4-12-12v-56c0-6.6 5.4-12 12-12h92v-92c0-6.6 5.4-12 12-12h56c6.6 0 12 5.4 12 12v92h92c6.6 0 12 5.4 12 12v56z"></path></svg>
                </div>
                <div id="break-length" className="break">{this.props.breakLength}</div>
                <div id="break-decrement" className="break" onClick={this.props.decrease}>
                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="minus-circle" className="svg-inline--fa fa-minus-circle fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zM124 296c-6.6 0-12-5.4-12-12v-56c0-6.6 5.4-12 12-12h264c6.6 0 12 5.4 12 12v56c0 6.6-5.4 12-12 12H124z"></path></svg>
                </div>
                <div id="break-label">Break</div>
                <div className="img-deco">
                    <img src={breaky} alt="break"/> 
                </div>
            </div>
        );
    }
}

class PlayPause extends React.Component{
    render(){
        return(
            <div id="start_stop" onClick={this.props.handlePlayPause}>
                <img src={play_pause} alt="Start/Stop"/>
            </div>
        );
    }
}

class Reset extends React.Component{
    render(){
        return(
            <div id="reset" onClick={this.props.handleReset}>
                <img src={reset} alt="Reset"/>
            </div>
        );
    }
}






ReactDOM.render(<App/>, document.getElementById('react-container'));