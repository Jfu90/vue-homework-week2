<template>
  <main class="container vh-100">
    <div class="row justify-content-center align-items-center h-100">
      <div class="col-4 py-5">
        <div v-if="!signInState.token">
          <!-- 登入 -->
          <section v-if="setSignIn">
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
            <button type="button" class="btn btn-primary w-100 mb-3" @click="signIn">登入</button>
          </section>

          <!-- 註冊 -->
          <section v-if="!setSignIn">
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
            <button type="button" class="btn btn-primary w-100 mb-3" @click="signUp">註冊</button>
          </section>
          <div class="alert alert-danger" role="alert" v-if="responseMsg.message">
            <small>{{ responseMsg.message }}</small>
          </div>
          <!-- 切換 -->
          <div class="text-center mt-3">
            <a href="#" class="text-decoration-none" @click.prevent="setSignIn = true">登入</a> |
            <a href="#" class="text-decoration-none" @click.prevent="setSignIn = false">註冊</a>
          </div>
        </div>

        <!-- 驗證token -->
        <section v-if="signInState.token">
          <div class="d-flex">
            <h2 class="me-auto">驗證token</h2>
            <button type="button" class="btn btn-primary me-2" @click="checkToken">驗證</button>
            <button type="button" class="btn btn-primary" @click="signOut">登出</button>
          </div>
          <!-- <p class="fs-6 text-break" v-text="signInState.token"></p> 
           測試 cookie 讀取 清除 
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

          <small v-if="responseMsg.target == 'token' && responseMsg.message">{{
            responseMsg.message
          }}</small>
          <small v-if="responseMsg.target == 'signout' && responseMsg.message">{{
            responseMsg.message
          }}</small>
          <hr />
        </section>

        <!-- TodoList -->
        <section v-if="signInState.token">
          <h1>TODOLIST</h1>
          <div class="input-group mb-3">
            <input
              type="text"
              placeholder="todothing"
              class="form-control"
              v-model="newTodoThing"
            />
            <button type="button" class="btn btn-primary" @click="createTodos">新增事項</button>
          </div>
          <ul class="list-group">
            <li
              class="todoItem list-group-item d-flex justify-content-between align-items-center"
              v-for="todo in todolistDate"
              :key="todo.id"
            >
              <div class="me-auto">
                <input
                  type="checkbox"
                  class="from-check-input me-2"
                  v-model="todo.status"
                  @change="toggleTodoStatus(todo.id)"
                />
                <span
                  v-show="tempTodoThing.id !== todo.id"
                  :class="{ 'text-decoration-line-through': todo.status }"
                  >{{ todo.content }}</span
                >
                <input
                  type="text"
                  class="form-control"
                  v-if="tempTodoThing.id === todo.id"
                  v-model="tempTodoThing.content"
                  @blur="tempTodoThing.id = ''"
                  @keyup.enter="updateTodos(todo.id)"
                />
                <!-- {{ todo.createTime }} -->
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
const setSignIn = ref(true)
let timer
const clearResponseMsg = () => {
  if (timer !== 'undefined') clearTimeout(timer)
  return setTimeout(() => {
    responseMsg.value = { target: '', message: '' }
  }, 3000)
}

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
    responseMsg.value.message = `[ 註冊成功 ] UID: ${response.data.uid}`

    signUpDate.value = {
      email: '',
      password: '',
      nickname: ''
    }
    setSignIn.value = true
  } catch (error) {
    responseMsg.value.message = `[ 註冊失敗 ] ${error.response.data.message}`
  }
  timer = clearResponseMsg()
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

    responseMsg.value.message = `[ 登入成功 ]`
    signInDate.value = {}

    // 插入cookie
    document.cookie = `hexschoolTodo=${signInState.value.token}`
    document.cookie = `;expires=${signInState.value.exp}`
  } catch (error) {
    responseMsg.value.message = `[ 登入失敗 ] ${error.response.data.message}`
    signInDate.value.password = ''
  }

  timer = clearResponseMsg()
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
    responseMsg.value.message = `[ 驗證成功 ] UID: ${response.data.uid}`
  } catch (error) {
    responseMsg.value.message = `[ 驗證失敗 ] ${error.response.data.message}`
  }
  timer = clearResponseMsg()
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
    responseMsg.value.message = `[ 登出成功 ]`
    console.log(response)
  } catch (error) {
    responseMsg.value.message = `[ 登出失敗(?) ] ${error.response.data.message}`
  }
  timer = clearResponseMsg()
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
      tempTodoThing.value = { id: '', content: '' }
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
