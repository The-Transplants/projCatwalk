//React
import React, {useContext,useState} from 'react';
import {QuestionContext} from '../QuestionContext';
import {AnswerList} from './AnswerList';
import {Helpful} from './Helpful';
import { Modal } from '../../Modal/Modal.jsx';
import {QuestionForm} from './QuestionForm';

//Stylesheet
import './QuestionList.css'

export const QuestionList = (props) =>{
  const {searchTerm} = props;
  const [modalState, setModalState] = useState(null);
  const {questions, addQuestion, AnsId} = useContext(QuestionContext);
  const [lastIndex, setLastIndex] = useState(2);
  var qLen = questions.length;
  var questionsfiltered = questions;
  if (searchTerm.length >= 3) {
    questionsfiltered = questions.filter((each)=>{
      if (each.question_body.toLowerCase().includes(searchTerm.toLowerCase())){
        return each;
      }
    })
    qLen = questionsfiltered.length
  }
  const loadMore = () => {
    setLastIndex(lastIndex+2);
  };

  function handleModal(){
    setModalState(<QuestionForm finished={ModalFinished} questions = {questions} addQuestion={addQuestion}/>)
  }

  function ModalFinished(){
    setModalState(null)
  }

  return (
  <div id='QuestionList'>
      {(searchTerm.length < 3 ? questions : questionsfiltered).slice(0, lastIndex).map(q=>{
        return (
          <div key={q.question_id}>
            <div className="Q-Helpful">
            <span className="Q-statement" >Q: {q.question_body}</span>
            </div>
            <Helpful Qid = {q.question_id} Qbody = {q.question_body} question_helpfulness = {q.question_helpfulness}/>


            <AnswerList key={AnsId} question = {q}/>
          </div>
        )
      })
      }
      {lastIndex < qLen ? <button id='loadMore' onClick = {loadMore}>MORE ANSWERED QUESTIONS</button>:null}
      <Modal component = {modalState} setComponent={setModalState}/>
      <button className='addAbtn' onClick={ handleModal } >Ask A QUESTION +</button>
  </div>
  )
};