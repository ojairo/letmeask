import {useHistory, useParams} from 'react-router-dom'
import { RoomCode } from '../components/RoomCode'
import {Button} from '../components/Button'

import logoImg from '../assets/images/logo.svg'
import deleteImg from '../assets/images/delete.svg'
import { Question } from '../components/Question'
import { useRoom } from '../hooks/useRoom'
import '../styles/room.scss'
import { database } from '../services/firebase'

type ParamsProps = {
  id: string
}

export function AdminRoom(){
  const params = useParams<ParamsProps>()
  const roomId = params.id

  const {title, questions} = useRoom(roomId)
  const history = useHistory()

  async function handleEndRoom(){
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    })

    history.push('/')
  }

  async function handleDeleteQuestion(questionId: string){
    const response = window.confirm('Tem certeza que você deseja excluir essa pergunta?')

    if(response){
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
    }
  }

  return(
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div>
            <RoomCode code= {params.id}/>
            <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        <div className="question-list">
          {questions.map(question => {
            return(
              <Question
                key = {question.id}
                content = {question.content}
                author = {question.author}
              >
                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  <img src={deleteImg} alt="Delete" />
                </button>
              </Question>
            )
          })}
        </div>
      </main>
    </div>
  )
}
