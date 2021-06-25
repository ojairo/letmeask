import { useState, FormEvent } from 'react'

import {useParams} from 'react-router-dom'
import { RoomCode } from '../components/RoomCode'
import { useAuth } from '../hooks/useAuth'
import { database } from '../services/firebase'
import {Button} from '../components/Button'

import logoImg from '../assets/images/logo.svg'
import '../styles/room.scss'
import { Question } from '../components/Question'
import { useRoom } from '../hooks/useRoom'

type ParamsProps = {
  id: string
}

export function Room(){
  const {user} = useAuth()
  const params = useParams<ParamsProps>()
  const [newQuestion, setNewQuestion] = useState('')
  const roomId = params.id

  const {title, questions} = useRoom(roomId)

  async function handleSendQuestion(e: FormEvent){
    e.preventDefault()

    if(newQuestion.trim() === ''){
      return
    }

    if(!user){
      throw new Error('You must be logged in.')
    }

    const question = {
      content: newQuestion,
      author:{
        name: user?.name,
        avatar: user?.avatar,
      },
      isHighLighted: false,
      isAnswered: false,
    }

    await database.ref(`rooms/${roomId}/questions`).push(question)

    setNewQuestion('')
  }

  return(
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <RoomCode code= {params.id}/>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        <form onSubmit={handleSendQuestion}>
          <textarea
            placeholder= "O que você quer perguntar?"
            onChange={e => setNewQuestion(e.target.value)}
            value={newQuestion}
          />

          <div className="form-footer">
            {user ? (
              <div className="user-info">
                <img src={user.avatar} alt={user.name} />
                <span>{user.name}</span>
              </div>
            ) : (
              <span>Para enviar uma pergunta. <button>  Faça seu login</button>
              </span>
            )}
            <Button type="submit" disabled={!user}>
              Enviar pergunta
            </Button>
          </div>
        </form>
        <div className="question-list">
          {questions.map(question => {
            return(
              <Question
                key = {question.id}
                content = {question.content}
                author = {question.author}
              />
            )
          })}
        </div>
      </main>
    </div>
  )
}
