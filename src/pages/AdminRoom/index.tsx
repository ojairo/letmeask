import {useHistory, useParams} from 'react-router-dom'

import { RoomCode } from '../../components/RoomCode'
import {Button} from '../../components/Button'
import { Question } from '../../components/Question'

import logoImg from '../../assets/images/logo.svg'
import deleteImg from '../../assets/images/delete.svg'
import checkImg from '../../assets/images/check.svg'
import answerImg from '../../assets/images/answer.svg'

import { useRoom } from '../../hooks/useRoom'
import './styles.scss'

import { database } from '../../services/firebase'

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

  async function handleCheckQuestionAsAnswered(questionId: string, isAnswered: boolean){
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true
    })
  }

  async function handleHighLightQuestion(questionId: string, isHighlighted: boolean){
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: true
    })
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
                isAnswered = {question.isAnswered}
                isHighlighted = {question.isHighLighted}
              >
                {!question.isAnswered && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleCheckQuestionAsAnswered(question.id, question.isAnswered)}
                    >
                      <img src={checkImg} alt="Check" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleHighLightQuestion(question.id, question.isHighLighted)}
                    >
                      <img src={answerImg} alt="Answer" />
                    </button>
                  </>
                )}

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
