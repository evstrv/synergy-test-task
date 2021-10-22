import axios from 'axios'

async function getUsers(numb) {
  try {
    const users = await axios.get(`https://randomuser.me/api/?results=${numb}`)
    return users.data.results
  } catch (err) {
    console.log('error: ', err)
  }
}

async function addUser() {
  try {
    const user = await axios.get('https://randomuser.me/api/')
    return user.data.results
  } catch (err) {
    console.log('error: ', err)
  }
}

export { getUsers, addUser }
