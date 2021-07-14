import {useHistory, useParams} from 'react-router-dom';
import logoImg from '../assets/img/logo.svg';
import { Button } from '../components/Button';
import { Question } from '../components/Questions';
import { RoomCode } from '../components/RoomCode';
//import { useAuth } from '../hooks/useAuth';
import deleteImg from '../assets/img/delete.svg';
import { useRoom } from '../hooks/useRoom';
import '../styles/room.scss';
import { database } from '../services/firebase';
import checkImg from '../assets/img/check.svg';
import answerImg from '../assets/img/answer.svg';


type RoomParams = {
    id: string;
}

export function AdminRoom () {
    const params = useParams<RoomParams>();
    //const {user} = useAuth();
    const roomId = params.id;
    const { title, questions} = useRoom(roomId)
    const history = useHistory();

    

    async function handleEndRoom() {
        await database.ref(`rooms/${roomId}`).update({
            endedAt: new Date(),
        })

        history.push('/');
    }
    
    async function handleDeleteQuestion(questionId: string) {
        if(window.confirm('Você tem certeza que deseja excluir esta pergunta?')) {
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
        }
    }
    async function handleCheckQuestionAsAnswered(questionId:string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswered: true,
        })
    }
    async function handleHighlightedQuestion(questionId:string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighlighted: true,
        })
    }

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="letmeask" />                      
                    <div>
                        <RoomCode code={roomId}/>  
                        <Button isOutlined onClick={handleEndRoom}>Encerrar Sala</Button>
                    </div>                
                </div>
            </header>

            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {questions.length > 0 && <span>{questions.length} Pergunta(s)</span>}
                    
                </div>
                
                <div className="question-list">
                    {questions.map(question => {
                        return (
                            <Question
                                key={question.id}
                                content = {question.content}
                                author = {question.author}
                                isAnswered={question.isAnswered}
                                isHighlighted={question.isHighlighted}

                            >
                                {!question.isAnswered && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => handleCheckQuestionAsAnswered(question.id)}
                                        >
                                            <img src={checkImg} alt="Marcar pergunta como rspondida" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleHighlightedQuestion(question.id)}
                                        >
                                            <img src={answerImg} alt="Dar destaque a pergunta" />
                                        </button>
                                    </>                                    
                                )}
                                <button
                                    type="button"
                                    onClick={() => handleDeleteQuestion(question.id)}
                                >
                                    <img src={deleteImg} alt="Remover pergunta" />
                                </button>
                            </Question>
                        );
                    })}
                </div>
                
            </main>
        </div>
    );
}