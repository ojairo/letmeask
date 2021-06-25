import {FormEvent, useState} from 'react'
import {useHistory} from 'react-router-dom'
import { Button } from '../components/Button'

import { useAuth } from '../hooks/useAuth'

import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import googleIcon from '../assets/images/google-icon.svg'
import '../styles/auth.scss'
import { database } from '../services/firebase'

export function Home(){
  const history = useHistory()
  const {signInWithGoogle, user} = useAuth()
  const [roomCode, setRoomCode] = useState('')

  async function handleCreateRoom(){
    if(!user){
      await signInWithGoogle()
    }

    history.push('/rooms/new')
  }

  async function handleJoinRoom(e: FormEvent){
    e.preventDefault()

    if(roomCode.trim() === ''){
      return
    }

    const roomRef = await database.ref(`rooms/${roomCode}`).get()

    if(!roomRef.exists()){
      alert('Rooms does not exists.')
      return
    }

    if(roomRef.val().endedAt){
      alert('Room already closed.')
      return
    }

    history.push(`/rooms/${roomCode}`)
  }

  return(
    <div id="page-auth">
      <aside>
        <img src={illustrationImg} alt="Ilustração simbolizando perguntas e responstas" />
        <strong>Crie salas de Q&A ao vivo</strong>
        <p>Tire as dúvidas de sua audiência em tempo real</p>
      </aside>
      <main>
        <div className= "main-content">
          <img src={logoImg} alt="LetMeAsk" />
          <button className = "create-room" onClick={handleCreateRoom}>
            <img src={googleIcon} alt="Logo do google" />
            Crie sua sala com o Google
          </button>
          <div className="separator">ou entre em outra sala</div>
          <form onSubmit={e => handleJoinRoom(e)}>
            <input
              type="text"
              placeholder="Digite o código da sala"
              onChange={e => setRoomCode(e.target.value)}
              value={roomCode}
            />
            <Button type="submit">
              Entrar na sala
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}
