import axios from 'axios';


export async function getUsers(numb) {
    try {
        const users = await axios.get(`https://randomuser.me/api/?results=${numb}`);
        return users.data.results;
    } catch(err) {
        console.log("error: ", err);
    }
}