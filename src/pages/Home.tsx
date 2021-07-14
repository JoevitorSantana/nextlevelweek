import { useHistory } from 'react-router';
import illustrationImg from '../assets/img/illustration.svg';
import logoImg from '../assets/img/logo.svg';
import googleIcon from '../assets/img/google-icon.svg';
import '../styles/auth.scss';
import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';
import { FormEvent } from 'react';
import { useState } from 'react';
import { database } from '../services/firebase';

export function Home() {
    const history = useHistory();
    const { user, signInWithGoogle} = useAuth();
    const [roomCode, setRoomCode] = useState('');

    async function handleCreateRoom () {
        if (!user){
            await signInWithGoogle()
        }
        history.push('/rooms/new');
    }
    
    async function HandleJoinRoom(event: FormEvent) {
        event.preventDefault();

        if (roomCode.trim() === '') {
            return;
        }
        const roomRef = await database.ref(`rooms/${roomCode}`).get();

        if (!roomRef.exists()){
            alert('Room does not exist.');
            return;
        }

        if(roomRef.val().endedAt){
            alert('Room already closed.')
            return;
        }

        history.push(`/rooms/${roomCode}`);
    }
    
    return (
        <div id="page-auth">
            <aside>
                <img src={illustrationImg} alt="Imagem simbolizando perguntas e respostas" />
                <strong>Crie salas de Q&amp;A ao vivo</strong>
                <p>Tire as dúvidas de sua audiência em tempo real</p>
            </aside>
            <main>
                <div className="main-content">
                    <img src={logoImg} alt="Letmeask" />
                    <button onClick={handleCreateRoom} className="create-room">
                        <img src={googleIcon} alt="ícone google" />
                        Crie sua sala Google
                    </button>
                    <div className="separator">Ou entre em uma sala</div>
                    <form onSubmit={HandleJoinRoom}>
                        <input 
                            type="text" 
                            placeholder="Digite o código da sala"
                            onChange = {event => setRoomCode(event.target.value)}
                            value = {roomCode}
                        />
                        <Button type="submit">
                            Entrar na Sala
                        </Button>
                    </form>
                </div>
            </main>
        </div>
    )
}