import {buildSubscription} from "aws-appsync"
import {graphqlMutation} from "aws-appsync-react"
import gql from 'graphql-tag'
import {compose, graphql} from 'react-apollo'
import './App.css'
import {useEffect, useState} from "react/cjs/react.production.min.js"



const SubscribeToTodos = gql`
    subscription {
        onCreateTodo{
            id title content completed
        }
    }
`

const ListTodos = gql`
    query{
        listTodos {
            items {id title content }
        }
    }
`

const CreateTodo = gql`
    mutation ($title:String!, $content: String!, $completed: Boolean){
        createTodo(input:{
            title: $title,
            completed: $completed
            content: $content
        }){
            id title content completed
        }
    }
`
const App = (props) => {
  const [content, setContent] = useState('')
  // const {subscribeToMore} = props
  const {todos, subscribeToMore}  = props
  console.log(props)

  useEffect(()=>{
    subscribeToMore(
      buildSubscription(SubscribeToTodos,ListTodos)
    )
  },[subscribeToMore])


  const addTodo = () => {
    if (content === '') return
    const newTodo = {title:'γαμήσια', content:content, completed: false}
    props.createTodo(newTodo)
    setContent('')
  }
  return (
    <div className="App">
      <input type="text" onChange={(e)=>setContent(e.currentTarget.value)}
      value={content}/>
      <button onClick={addTodo}>Add</button>
      {
        todos.map((item, i) => (<p key={i}>{item.content}</p>))
      }

    </div>
  )
}

export default compose(
  graphqlMutation(CreateTodo,ListTodos,'Todo'),
  graphql(ListTodos, {
    options: {
      fetchPolicy: 'cache-and-network',
    },
    props: props => ({
      subscribeToMore: props.data.subscribeToMore,
      todos: props.data.listTodos ? props.data.listTodos.items : []
    })
  })
)(App)
// export  default App
