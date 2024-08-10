<template>
  <main class="container vh-100">
    <div class="row justify-content-center align-items-center h-100">
      <div class="col-4 py-5">
        <!-- 登入 -->
        <section v-if="!signInState.token">
          <h1>登入</h1>
          <div class="form-floating mb-3">
            <input
              type="email"
              class="form-control"
              id="signInEmail"
              placeholder="Email"
              v-model="signInDate.email"
            />
            <label for="signInEmail">Email</label>
          </div>
          <div class="form-floating mb-3">
            <input
              type="password"
              class="form-control"
              id="signInPassword"
              placeholder="Password"
              v-model="signInDate.password"
            />
            <label for="signInPassword">Password</label>
          </div>
          <button type="button" class="btn btn-primary me-3" @click="signIn">登入</button>
          <small v-if="responseMsg.target == 'signin' && responseMsg.message">{{
            responseMsg.message
          }}</small>
        </section>

        <!-- 註冊 -->
        <section v-if="!signInState.token">
          <h1>註冊</h1>
          <div class="form-floating mb-3">
            <input
              type="email"
              class="form-control"
              id="signUpEmail"
              placeholder="Email"
              v-model="signUpDate.email"
            />
            <label for="signUpEmail" class="form-label">Email</label>
          </div>
          <div class="form-floating mb-3">
            <input
              type="password"
              class="form-control"
              id="signUpPassword"
              placeholder="Password"
              v-model="signUpDate.password"
            />
            <label for="signUpPassword" class="form-label">Password</label>
          </div>
          <div class="form-floating mb-3">
            <input
              type="text"
              class="form-control"
              id="signUpNickName"
              placeholder="NickName"
              v-model="signUpDate.nickname"
            />
            <label for="signUpNickName" class="form-label">NickName</label>
          </div>
          <button type="button" class="btn btn-primary me-3" @click="signUp">註冊</button>
          <small v-if="responseMsg.target == 'signup' && responseMsg.message">{{
            responseMsg.message
          }}</small>
        </section>

        <!-- 驗證token -->
        <section>
          <h1>驗證token</h1>
          <p class="fs-6 text-break" v-text="signInState.token"></p>
          <!-- 測試 cookie 讀取 清除 
          <div class="form-floating mb-3">
            <input
              type="text"
              class="form-control mb-3"
              id="setToken"
              placeholder="Token"
              v-model="signInState.token"
            />
            <label for="setToken">Token</label>
          </div>
          <button type="button" class="btn btn-light btn-sm me-2" @click="readCookieToken">
            讀取cookie
          </button>
          <button type="button" class="btn btn-light btn-sm me-2" @click="delCookieToken">
            清除cookie
          </button> -->
          <button type="button" class="btn btn-primary me-2" @click="checkToken">驗證</button>
          <button type="button" class="btn btn-primary" @click="signOut">登出</button>
          <br />
          <small v-if="responseMsg.target == 'token' && responseMsg.message">{{
            responseMsg.message
          }}</small>
          <small v-if="responseMsg.target == 'signout' && responseMsg.message">{{
            responseMsg.message
          }}</small>
        </section>

        <!-- TodoList -->
        <section v-if="signInState.token">
          <h1>TODOLIST</h1>
          <ul class="list-group">
            <li
              class="todoItem list-group-item d-flex justify-content-between align-items-center"
              v-for="todo in todolistDate"
              :key="todo.id"
            >
              <div class="me-auto">
                <input
                  type="checkbox"
                  class="align-middle me-2"
                  v-model="todo.status"
                  @change="toggleTodoStatus(todo.id)"
                />
                <span v-show="tempTodoThing.id !== todo.id">{{ todo.content }}</span>
                <input
                  type="text"
                  class="form-control"
                  v-if="tempTodoThing.id === todo.id"
                  v-model="tempTodoThing.content"
                  @blur="updateTodos(todo.id)"
                />
                {{ todo.createTime }}
              </div>
              <div class="todoTools btn-group" role="group">
                <button type="button" class="btn btn-primary" @click="editTodos(todo.id)">
                  修改
                </button>
                <button type="button" class="btn btn-primary" @click="delTodos(todo.id)">
                  刪除
                </button>
              </div>
            </li>
          </ul>
          <input
            type="text"
            placeholder="todothing"
            class="form-control my-2"
            v-model="newTodoThing"
          />
          <button type="button" class="btn btn-primary me-2" @click="createTodos">新增事項</button>
        </section>
      </div>
    </div>
  </main>
</template>

<style>
.todoItem:hover .todoTools {
  visibility: visible;
}
.todoTools {
  visibility: hidden;
}
</style>

<script setup>
import axios from 'axios'
import { onMounted, ref } from 'vue'

const apiBase = ref('https://todolist-api.hexschool.io')
const responseMsg = ref({
  target: '',
  message: ''
})

// 註冊
const signUpDate = ref({
  email: '',
  password: '',
  nickname: ''
})

const signUp = async () => {
  responseMsg.value = { target: 'signup', message: '' }
  try {
    const response = await axios.post(`${apiBase.value}/users/sign_up`, signUpDate.value)
    responseMsg.value.message = `註冊成功 UID: ${response.data.uid}`

    signUpDate.value = {}
  } catch (error) {
    responseMsg.value.message = `註冊失敗 ERROR: ${error.response.data.message}`
  }
}

// 登入
const signInDate = ref({
  email: '',
  password: ''
})
const signInState = ref({
  status: '',
  exp: '',
  token: '',
  nickname: ''
})

const signIn = async () => {
  responseMsg.value = { target: 'signin', message: '' }
  try {
    const response = await axios.post(`${apiBase.value}/users/sign_in`, signInDate.value)
    signInState.value = response.data
    signInState.value.exp = new Date(signInState.value.exp).toUTCString()
    getTodos()

    responseMsg.value.message = `登入成功`
    signInDate.value = {}

    // 插入cookie
    document.cookie = `hexschoolTodo=${signInState.value.token}`
    document.cookie = `;expires=${signInState.value.exp}`
  } catch (error) {
    responseMsg.value.message = `登入失敗 ERROR: ${error.response.data.message}`
    signInDate.value.password = ''
  }
}

// cookie & token
const readCookieToken = () => {
  signInState.value.token = document.cookie.replace(
    new RegExp('(?:(?:^|.*;)\\s*hexschoolTodo\\s*\\=\\s*([^;]*).*$)|^.*$'),
    '$1'
  )
}
readCookieToken()

const checkToken = async () => {
  responseMsg.value = { target: 'token', message: '' }

  try {
    const response = await axios.get(`${apiBase.value}/users/checkout`, {
      headers: {
        Authorization: signInState.value.token
      }
    })
    responseMsg.value.message = `驗證成功 UID: ${response.data.uid}`
  } catch (error) {
    responseMsg.value.message = `驗證失敗 ERROR: ${error.response.data.message}`
  }
}

const delCookieToken = () => {
  signInState.value = {}
  todolistDate.value.length = 0
  document.cookie = `hexschoolTodo=; expires=Thu, 01 Jan 1970 00:00:00 GMT`
}

// 登出
const signOut = async () => {
  responseMsg.value = { target: 'signout', message: '' }
  try {
    const response = await axios.post(
      `${apiBase.value}/users/sign_out`,
      {},
      {
        headers: {
          Authorization: signInState.value.token
        }
      }
    )
    delCookieToken()
    responseMsg.value.message = `登出成功`
    console.log(response)
  } catch (error) {
    responseMsg.value.message = `登出失敗(?) ERROR: ${error.response.data.message}`
  }
}

// todolist
const todolistDate = ref([])
const newTodoThing = ref('')
const tempTodoThing = ref({
  id: '',
  content: ''
})

const getTodos = async () => {
  try {
    const response = await axios.get(`${apiBase.value}/todos/`, {
      headers: {
        Authorization: signInState.value.token
      }
    })
    todolistDate.value = response.data.data
    console.log('todo run')
  } catch (error) {
    console.log(error.response.data)
  }
}

const createTodos = async () => {
  if (newTodoThing.value) {
    try {
      await axios.post(
        `${apiBase.value}/todos/`,
        {
          content: newTodoThing.value
        },
        {
          headers: {
            Authorization: signInState.value.token
          }
        }
      )
      newTodoThing.value = ''
      getTodos()
    } catch (error) {
      console.log(error.response.data)
    }
  } else {
    // 沒有填寫代辦事項
  }
}

const editTodos = async (id) => {
  const idx = todolistDate.value.findIndex((item) => item.id === id)
  tempTodoThing.value = {
    id: id,
    content: todolistDate.value[idx].content
  }
}

const updateTodos = async (id) => {
  if (tempTodoThing.value) {
    try {
      await axios.put(
        `${apiBase.value}/todos/${id}`,
        {
          content: tempTodoThing.value.content
        },
        {
          headers: {
            Authorization: signInState.value.token
          }
        }
      )
      tempTodoThing.value = ''
      getTodos()
    } catch (error) {
      console.log(error.response.data)
    }
  } else {
    // 沒有填寫代辦事項
  }
}

const delTodos = async (id) => {
  try {
    await axios.delete(`${apiBase.value}/todos/${id}`, {
      headers: {
        Authorization: signInState.value.token
      }
    })
    getTodos()
  } catch (error) {
    console.log(error)
  }
}

const toggleTodoStatus = async (id) => {
  try {
    await axios.patch(
      `${apiBase.value}/todos/${id}/toggle`,
      {},
      {
        headers: {
          Authorization: signInState.value.token
        }
      }
    )
    getTodos()
  } catch (error) {
    console.log(error)
  }
}

onMounted(() => {
  if (signInState.value.token) {
    getTodos()
  }
})
</script>
