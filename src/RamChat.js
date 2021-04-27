import { Component } from 'react'
import { io } from 'socket.io-client'
import './RamChat.css'


const socket = io()

export default class RamChat extends Component {
    


    state = {
        conversation: [],
        chatInput: '',
        room: '', // used to match clients on the server, to view the same chat via socket.io
        joinRoom: '',
        welcomeDiv: 'welcome-div',
        // chatBoxDiv: 'chat-box-div hide-element'
        chatDiv: 'chat-div hide-element',
        chatStatsDiv: 'chat-stats-div hide-element',
        chatTitleDiv: 'chat-title-div',
        arrowMenu: 'arrow arrowRight',
        roomAndConnectionsDiv: 'room-and-connections-div',
        nameAndTerminateDiv: 'name-and-terminate-div hide-element',

        alias: '',
        participants: 0
    }
    
    componentDidMount() {
        // socket.on('welcome',(message) =>{
        //     this.setState({
        //         conversation: [...this.state.conversation, message]
        //     })
        // })
        socket.on('successfulRegistration', this.onSucessRegistered)
        socket.on('successfulJoin', this.onSuccessfulJoin)
        socket.on('participants', this.onParticipants)
        socket.on('message', this.onMessage)
    }
    
    componentWillUnmount() {
        socket.emit('disconnect')
        socket.off()
    }
    
    
    onSucessRegistered = (message) => {
        this.setState({welcomeDiv: 'welcome-div hide-element'})
        this.setState({chatDiv: 'chat-div'})

        this.setState({alias: 'Host'})
        this.setState({participants: 1})
        this.onMessage(message)
    }

    onSuccessfulJoin = (msg) => { // these 2 fuctions do the same thing. Later versions might have them do different things.
        this.setState({welcomeDiv: 'welcome-div hide-element'})
        this.setState({chatDiv: 'chat-div'})

        this.setState({alias: msg.alias})
        this.onMessage(msg)
    }

    onParticipants = (num) => this.setState({ participants: num})
    
    onMessage = (msg) => {
        this.setState({ conversation: [...this.state.conversation, msg.message] })
    }
    
    handleStartCodeInput = (e) => this.setState({room: e.target.value})

    handleStartCodeBtn = () => {
        let room = this.state.room
        socket.emit('startRoom', room)
    }

    handleJoinCodeInput = (e) => this.setState({joinRoom: e.target.value})

    handleJoinCodeBtn = () => { 
        console.log("sending to join room" + this.state.joinRoom)
        let joinRoom = this.state.joinRoom
        socket.emit('joinRoom', joinRoom)
        this.setState({room: joinRoom})
    }
    

    handleToggleHamburger = () => {
        if (this.state.chatStatsDiv === 'chat-stats-div hide-element') {
           this.setState({chatStatsDiv: 'chat-stats-div'})
           this.setState({chatTitleDiv: 'chat-title-div hide-element'})
        } else {
            this.setState({chatStatsDiv: 'chat-stats-div hide-element'})
            this.setState({chatTitleDiv: 'chat-title-div'}) 
        }
    }

    handleToggleArrow = () => {
        if (this.state.arrowMenu === 'arrow arrowLeft') {
            this.setState({roomAndConnectionsDiv: 'room-and-connections-div'})
            this.setState({nameAndTerminateDiv: 'name-and-terminate-div hide-element'})
            this.setState({arrowMenu: 'arrow arrowRight'})
        } else {
            this.setState({roomAndConnectionsDiv: 'room-and-connections-div hide-element'})
            this.setState({nameAndTerminateDiv: 'name-and-terminate-div'})
            this.setState({arrowMenu: 'arrow arrowLeft'})
        }
    }

    handleChatInput = (e) => this.setState({chatInput: e.target.value})

    handleChatBtn = () => {
        let message = this.state.chatInput
        socket.emit('sendmessage', message, this.state.room)
        this.setState({chatInput: ''})
    }


    render() {

        return (
            <div className="ram-chat-main-div">
                <div className={this.state.welcomeDiv}>
                    <h1 className="ram-chat-title-h1">RAM chat 🐏 💻</h1>
                    <h3><em>Start</em> or <em>Join</em> a chat</h3>
                    <div className="start-chat-div">
                        <input className="start-code-input" type="text" placeholder="Create a room name" onChange={this.handleStartCodeInput} onKeyPress={(e) => e.key === 'Enter' ? this.handleStartCodeBtn() : null}/>
                        <button className="start-code-btn" onClick={this.handleStartCodeBtn}>start room</button>
                    </div>
                    <div className="join-chat-div">
                        <input className="join-code-input" type="text" placeholder="Join a room" onChange={this.handleJoinCodeInput} onKeyPress={(e) => e.key === 'Enter' ? this.handleJoinCodeBtn() : null}/>
                        <button className="join-code-btn" onClick={this.handleJoinCodeBtn}>join room</button>
                    </div>
                </div>

                <div className={this.state.chatDiv}>
                    <div className="chat-menu-div">
                        <div className="hamburger-menu-div" onClick={this.handleToggleHamburger}>
                            <div className="burger-container-div">
                                <div className="burger-div"></div>
                                <div className="burger-div"></div>
                                <div className="burger-div"></div>
                            </div>
                        </div>
                        <div className={this.state.chatStatsDiv}> 
                            <div className="slide-menu-div">
                                <div className={this.state.roomAndConnectionsDiv}>
                                    <p>Room Name: {this.state.room}</p>
                                    <p>Participants: {this.state.participants}</p>
                                </div>
                                <div className={this.state.nameAndTerminateDiv}>
                                    <div className="nickname-div">
                                        <p>alias:</p>
                                        <input className="alias-input" type="text" placeholder="enter alias" value={this.state.alias}/><button>save</button>
                                    </div>
                                    <div>
                                        <a href="/">logout</a>
                                    </div>
                                </div>
                                <div>
                                    <i className={this.state.arrowMenu} onClick={this.handleToggleArrow}></i>
                                </div>
                            </div>
                        </div>
                        <div className={this.state.chatTitleDiv}>
                            <h1>RAM chat 🐏 💻</h1>
                        </div>
                    </div>
                    
                    {/* <div className={this.state.chatBoxDiv}> */}
                    <div className="chat-box-div">
                        <ul className="chat-ul">
                            {this.state.conversation.map((comment, index) => <li className="comment-li" key={index}>{comment}</li> )}
                        </ul>
                        <input className="chat-input" type="text" placeholder="Type message ..." onChange={this.handleChatInput} value={this.state.chatInput} onKeyPress={(e) => e.key === 'Enter' ? this.handleChatBtn() : null}/>
                        {/* <button className="chat-btn" onClick={this.handleChatBtn}>submit</button> */}
                    </div>
                </div>
            </div>
        )
    }
}

